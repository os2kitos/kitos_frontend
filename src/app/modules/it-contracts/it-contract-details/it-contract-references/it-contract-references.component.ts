import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectItContractHasModifyPermissions } from 'src/app/store/it-contract/selectors';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { ExternalReferencesManagementComponent } from '../../../../shared/components/external-references-management/external-references-management.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-it-contract-references',
  templateUrl: './it-contract-references.component.html',
  styleUrl: './it-contract-references.component.scss',
  imports: [CardComponent, CardHeaderComponent, ExternalReferencesManagementComponent, AsyncPipe],
})
export class ItContractReferencesComponent extends BaseComponent {
  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions);

  constructor(private store: Store) {
    super();
  }
}
