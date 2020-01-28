import { Injectable, Injector } from '@angular/core';
import { StateManagerContext } from '@lcu/common';
import { DocsModel } from '../models/docs.model';

@Injectable({
    providedIn: 'root'
})
export class DocsManagerContext extends StateManagerContext<DocsModel> {

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
    
    protected async loadStateKey() {
        return 'main';
    }

    protected async loadStateName() {
        return 'docs';
    }
}
