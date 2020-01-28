import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule, MaterialModule } from '@lcu/common';
import { DocsService } from './services/docs.service';
import { DocsComponent } from './controls/docs/docs.component';
import { DocsDirective } from './directives/docs.directive';

@NgModule({
  declarations: [DocsComponent, DocsDirective],
  imports: [
    FathymSharedModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [DocsComponent, DocsDirective],
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
