import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectItContractSystemAgreementElements,
  selectItContractSystemUsages,
} from 'src/app/store/it-contract/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { AgreementElementCreateDialogComponent } from './agreement-element-create-dialog/agreement-element-create-dialog.component';
import { ContractSystemCreateDialogComponent } from './contract-system-create-dialog/contract-system-create-dialog.component';
import { ItContractSystemsComponentStore } from './it-contract-systems.component-store';

@Component({
  selector: 'app-it-contract-systems',
  templateUrl: './it-contract-systems.component.html',
  styleUrl: './it-contract-systems.component.scss',
  providers: [ItContractSystemsComponentStore],
})
export class ItContractSystemsComponent extends BaseComponent implements OnInit {
  public readonly systemAgreementElements$ = this.store
    .select(selectItContractSystemAgreementElements)
    .pipe(filterNullish());
  public readonly systemUsages$ = this.store.select(selectItContractSystemUsages).pipe(filterNullish());
  public readonly anyAgreementElements$ = this.systemAgreementElements$.pipe(matchNonEmptyArray());
  public readonly anySystemUsages$ = this.systemUsages$.pipe(matchNonEmptyArray());
  public readonly relations$ = this.componentStore.systemRelations$;
  public readonly anyRelations$ = this.relations$.pipe(matchNonEmptyArray());
  public readonly relationsIsLoading$ = this.componentStore.systemRelationsIsLoading$;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly componentStore: ItContractSystemsComponentStore
  ) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-agreement-element-types'));
  }

  public onAddNewAgreementElement(): void {
    this.dialog.open(AgreementElementCreateDialogComponent);
  }

  public onDeleteAgreementElement(agreementElementUuid: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITContractActions.removeITContractSystemAgreementElement(agreementElementUuid));
          }
        })
    );
  }

  public onAddNewSystemUsage(): void {
    this.dialog.open(ContractSystemCreateDialogComponent);
  }

  public onDeleteSystemUsage(systemUsageUuid: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITContractActions.removeITContractSystemUsage(systemUsageUuid));
          }
        })
    );
  }
}
