import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import {
  LcuMarkdownDocsConfig,
  LcuMarkdownDocChangeEvent,
  LcuMarkdownDoc
} from '../../models/docs-config';
// import { isString } from 'util';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Observable, of as observableOf } from 'rxjs';
import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';

export class FileNode {
  children: FileNode[];
  filename: string;
  level: number;
  path: string;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean,
    public filename: string,
    public level: number,
    public path: string
  ) {}
}

export const originalHeading = new MarkedRenderer().heading;

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  let lastLevel = 0;

  renderer.heading = (text: string, level: number, raw: string) => {
    lastLevel = level;
    return '<h' + level + '>' + text + '</h' + level + '>\n';
  };

  renderer.link = (href: string, title: string, text: string) => {
    return `<a title="${title || ''}" href="${href}">${text ||
      title ||
      href}</a>`;
  };

  renderer.paragraph = (text: string) => {
    let pClass = '';

    switch (lastLevel) {
      case 1:
      case 2:
        pClass = 'mat-body-3';
        break;
      case 3:
      case 4:
        pClass = 'mat-body-2';
        break;
      default:
        pClass = 'mat-body-1';
        break;
    }

    return `<p class="${pClass}">${text}</p>`;
  };

  return { renderer };
}

const path = require('path-browserify');

@Component({
  selector: 'lcu-markdown-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class LcuDocsComponent implements OnInit {

  //  Properties
  public ActiveDocData: string;
  public ActiveDocPath: string;
  public DataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  public TreeControl: FlatTreeControl<FileFlatNode>;
  public TreeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

  @Input('config') public Config: LcuMarkdownDocsConfig;

  @Input('docs')
  public set Docs(docs: string) {
    this.http
      .get(path.join(docs, 'lcu.docs.json'))
      .subscribe((res: LcuMarkdownDocsConfig) => {
        this.Config = res;
        this.Reload();
      });
  }

  @Output('docChange')
  public DocChange: EventEmitter<LcuMarkdownDocChangeEvent>;

  //  Constructors
  constructor(protected http: HttpClient) {
    this.DocChange = new EventEmitter();

    this.TreeFlattener = new MatTreeFlattener(
      this.Transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );

    this.TreeControl = new FlatTreeControl<FileFlatNode>(
      this.getLevel,
      this.isExpandable
    );

    this.DataSource = new MatTreeFlatDataSource(
      this.TreeControl,
      this.TreeFlattener
    );
  }

  //  Life Cycle
  public ngOnInit(): void {
    this.Reload();
  }

  @HostListener('click', ['$event.target'])
  public onClick(btn: any) {
    if (btn && btn.href && (btn.href as string).endsWith('.md')) {
      const path = btn.href.replace(document.getElementsByTagName('base')[0].href, '');

      console.log(`Going to doc: ${path}`);

      this.GoToDoc(path);

      return false;
    }
  }

  //  API Methods
  public BuildFileTree(): void {
    this.DataSource.data = this.buildFileTree(this.Config.Docs, 0);
  }

  public FindDoc(path: string): LcuMarkdownDoc {
    return this.Config.Docs.find(d => d.Path === path);
  }

  public GoToDoc(docOpt: LcuMarkdownDoc | string): void {
    const docPath = typeof docOpt === 'string'
      ? docOpt as string
      : (docOpt as LcuMarkdownDoc).Path;

    if (this.ActiveDocPath !== docPath) {
      this.ActiveDocPath = docPath;
    }

    this.calculateActiveDocData();
    this.DocChange.emit({ DocPath: docPath });
  }

  public HasChild(_: number, nodeData: FileFlatNode): boolean {
    return nodeData.expandable;
  }

  public Reload(): void {
    if (this.Config && this.Config.Docs && this.Config.Docs.length > 0) {
      this.BuildFileTree();

      this.GoToDoc(
        this.ActiveDocPath || this.Config.DefaultDocPath || this.Config.Docs[0]
      );
    }
  }

  public Transformer(node: FileNode): FileFlatNode {
    return new FileFlatNode(!!node.children, node.filename, node.level, node.path);
  }

  //  Helpers
  protected buildFileTree(docs: LcuMarkdownDoc[], level: number): FileNode[] {
    return docs.reduce<FileNode[]>((accumulator, doc) => {
      const node = this.buildFileNodeFromDoc(doc, level);

      return accumulator.concat(node);
    }, []);
  }

  protected buildFileNodeFromDoc(doc: LcuMarkdownDoc, level: number, bypassChildren?: boolean): FileNode {
    const node = new FileNode();

    if (doc != null) {
      node.filename = doc.Title;
      node.level = level;

      if (!bypassChildren && doc.Children && doc.Children.length > 0) {
        node.children = this.buildFileTree(doc.Children, level + 1);
        const docCatch = {...doc};
        docCatch.Children = null;
      } else {
        node.path = doc.Path;
      }
    }

    return node;
  }

  protected calculateActiveDocData(): void {
    if (this.Config && this.ActiveDocPath) {
      this.ActiveDocData = path.join(this.Config.LocationRoot, this.ActiveDocPath);
    } else {
      this.ActiveDocData = null;
    }
  }

  protected getLevel(node: FileFlatNode): number {
    return node.level;
  }

  protected isExpandable(node: FileFlatNode): boolean {
    return node.expandable;
  }

  protected getChildren(node: FileNode): Observable<FileNode[]> {
    return observableOf(node.children);
  }
}
