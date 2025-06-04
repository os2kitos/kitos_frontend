import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConnectedDropdownDialogComponent } from 'src/app/shared/components/dialogs/connected-dropdown-dialog/connected-dropdown-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectItContractDataProcessingRegistrations,
  selectItContractHasModifyPermissions,
} from 'src/app/store/it-contract/selectors';
import { ItContractDataProcessingRegistrationsComponentStore } from './it-contract-dpr.component-store';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { ContentSpaceBetweenComponent } from '../../../../shared/components/content-space-between/content-space-between.component';
import { DetailsPageLinkComponent } from '../../../../shared/components/details-page-link/details-page-link.component';
import { IconButtonComponent } from '../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../shared/components/collection-extension-button/collection-extension-button.component';

@Component({
  selector: 'app-it-contract-dpr',
  templateUrl: './it-contract-dpr.component.html',
  styleUrl: './it-contract-dpr.component.scss',
  providers: [ItContractDataProcessingRegistrationsComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    StandardVerticalContentGridComponent,
    NgIf,
    NativeTableComponent,
    NgFor,
    ContentSpaceBetweenComponent,
    DetailsPageLinkComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    AsyncPipe,
  ],
})
export class ItContractDprComponent extends BaseComponent {
  public readonly dataProcessingRegistrations$ = this.store
    .select(selectItContractDataProcessingRegistrations)
    .pipe(filterNullish());
  public readonly anyDataProcessingRegistrations$ = this.dataProcessingRegistrations$.pipe(matchNonEmptyArray());
  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions);

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly componentStore: ItContractDataProcessingRegistrationsComponentStore,
  ) {
    super();
  }

  public onDelete(uuid: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITContractActions.removeITContractDataProcessingRegistration(uuid));
          }
        }),
    );
  }

  public onAdd(): void {
    const dialogRef = this.dialog.open(ConnectedDropdownDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.title = $localize`Tilføj databehandling`;
    dialogInstance.dropdownText = $localize`Registering`;
    dialogInstance.data$ = this.componentStore.dataProcessingRegistrations$;
    dialogInstance.isLoading$ = this.componentStore.dataProcessingRegistrationsIsLoading$;
    dialogInstance.successActionType = ITContractActions.addITContractDataProcessingRegistrationSuccess.type;
    dialogInstance.errorActionType = ITContractActions.addITContractDataProcessingRegistrationError.type;
    dialogInstance.save.subscribe((data) => {
      this.store.dispatch(ITContractActions.addITContractDataProcessingRegistration(data.uuid));
    });
    dialogInstance.filterChange.subscribe((search) => this.search(search));
  }

  private search(search?: string): void {
    this.componentStore.searchDataProcessingRegistrations(search);
  }
}
