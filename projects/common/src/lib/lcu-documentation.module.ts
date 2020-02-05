import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule, MaterialModule } from '@lcu/common';
import { DocsService } from './services/docs.service';
import { LcuDocsComponent, markedOptionsFactory } from './controls/docs/docs.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

@NgModule({
  declarations: [LcuDocsComponent],
  imports: [
    FathymSharedModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    HttpClientModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory
      }
    })
  ],
  exports: [LcuDocsComponent],
  entryComponents: []
})
export class LcuDocumentationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LcuDocumentationModule,
      providers: [DocsService]
    };
  }
}
