import { Injectable, Injector } from '@angular/core';
import { StateContext } from '@lcu/common';
import { DocsModel } from '../models/docs.model';

@Injectable({
    providedIn: 'root'
})
export class DocsManagerContext extends StateContext<DocsModel> {

    protected State: DocsModel;

    constructor(protected injector: Injector) {
        super(injector);
    }

    public GetDocsById(id: number): void {
        this.State.Loading = true;

        this.Execute({
            Arguments: {
                DocsId: id
            },
            Type: 'get-docs-by-id'
        });
    }

    protected loadStateKey(): string {
        return 'main';
    }

    protected loadStateName(): string {
        return 'docs';
    }
}
