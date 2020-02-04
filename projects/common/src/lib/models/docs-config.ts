export class LcuMarkdownDocsConfig {
  public DefaultDocPath?: string;
  public DisableNavigation?: boolean;
  public Docs: LcuMarkdownDoc[];
  public IndentVariant?: number;
  public LocationRoot: string;

  constructor(opts: LcuMarkdownDocsConfig) {
    Object.assign(this, opts);
  }
}

export class LcuMarkdownDoc {
  public Children: LcuMarkdownDoc[];
  public Path: string;
  public Title: string;

  constructor(opts: LcuMarkdownDoc) {
    Object.assign(this, opts);
  }
}

export class LcuMarkdownDocChangeEvent {
  public DocPath: string;

  constructor(opts: LcuMarkdownDocChangeEvent) {
    Object.assign(this, opts);
  }
}
