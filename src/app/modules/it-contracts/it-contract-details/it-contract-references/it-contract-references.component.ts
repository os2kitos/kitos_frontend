import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectItContractHasModifyPermissions } from 'src/app/store/it-contract/selectors';

@Component({
  selector: 'app-it-contract-references',
  templateUrl: './it-contract-references.component.html',
  styleUrl: './it-contract-references.component.scss',
})
export class ItContractReferencesComponent extends BaseComponent {
  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions);

  constructor(private store: Store) {
    super();
  }
}
