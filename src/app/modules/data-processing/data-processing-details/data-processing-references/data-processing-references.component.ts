import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectDataProcessingHasModifyPermissions } from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-data-processing-references',
  templateUrl: './data-processing-references.component.html',
  styleUrl: './data-processing-references.component.scss',
})
export class DataProcessingReferencesComponent extends BaseComponent {
  public hasModifyPermission$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(private store: Store) {
    super();
  }
}
