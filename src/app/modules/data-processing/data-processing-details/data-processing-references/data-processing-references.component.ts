import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectDataProcessingHasModifyPermissions } from 'src/app/store/data-processing/selectors';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { ExternalReferencesManagementComponent } from '../../../../shared/components/external-references-management/external-references-management.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-data-processing-references',
  templateUrl: './data-processing-references.component.html',
  styleUrl: './data-processing-references.component.scss',
  imports: [CardComponent, CardHeaderComponent, ExternalReferencesManagementComponent, AsyncPipe],
})
export class DataProcessingReferencesComponent extends BaseComponent {
  public hasModifyPermission$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(private store: Store) {
    super();
  }
}
