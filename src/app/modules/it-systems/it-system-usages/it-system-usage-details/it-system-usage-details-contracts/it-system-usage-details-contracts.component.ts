import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter, first } from 'rxjs';
import { APIItContractResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageMainContract,
  selectItSystemUsageUuid,
  selectItSystemUsageValidAccordingToMainContract,
} from 'src/app/store/it-system-usage/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypesDictionary } from 'src/app/store/regular-option-type-store/selectors';
import { ItSystemUsageDetailsContractsComponentStore } from './it-system-usage-details-contracts.component-store';
import {
  selectITSystemUsageEnableAssociatedContracts,
  selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { MatDialog } from '@angular/material/dialog';
import { CreateAndAssociateContractDialogComponent } from './create-and-associate-contract-dialog/create-and-associate-contract-dialog.component';
import { Actions, ofType } from '@ngrx/effects';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectItContractHasCollectionCreatePermissions } from 'src/app/store/it-contract/selectors';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { DetailsPageLinkComponent } from '../../../../../shared/components/details-page-link/details-page-link.component';
import { StatusChipComponent } from '../../../../../shared/components/status-chip/status-chip.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { SelectedOptionTypeTextComponent } from '../../../../../shared/components/selected-option-type-text/selected-option-type-text.component';
import { BooleanCircleComponent } from '../../../../../shared/components/boolean-circle/boolean-circle.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../../shared/components/collection-extension-button/collection-extension-button.component';
import { DropdownComponent } from '../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { AppDatePipe } from '../../../../../shared/pipes/app-date.pipe';

@Component({
  templateUrl: 'it-system-usage-details-contracts.component.html',
  styleUrls: ['it-system-usage-details-contracts.component.scss'],
  providers: [ItSystemUsageDetailsContractsComponentStore],
  imports: [
    NgIf,
    CardComponent,
    CardHeaderComponent,
    LoadingComponent,
    StandardVerticalContentGridComponent,
    NativeTableComponent,
    NgFor,
    DetailsPageLinkComponent,
    StatusChipComponent,
    ParagraphComponent,
    SelectedOptionTypeTextComponent,
    BooleanCircleComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    DropdownComponent,
    AsyncPipe,
    AppDatePipe,
  ],
})
export class ITSystemUsageDetailsContractsComponent extends BaseComponent implements OnInit {
  public readonly mainContract$ = this.store.select(selectItSystemUsageMainContract);
  public readonly mainContractIsValid$ = this.store.select(selectItSystemUsageValidAccordingToMainContract);
  public readonly availableContractsForSelection$ = this.contractsStore.associatedContracts$;
  public availableContractTypesDictionary$ = this.store
    .select(selectRegularOptionTypesDictionary('it-contract_contract-type'))
    .pipe(filterNullish());
  public readonly isLoading$ = this.contractsStore.associatedContractsIsLoading$;
  public readonly contractRows$ = this.contractsStore.contractRows$;
  public readonly anyContracts$ = this.contractRows$.pipe(matchNonEmptyArray());

  public readonly contractSelectionForm = new FormGroup({
    mainContract: new FormControl<APIItContractResponseDTO | undefined>(undefined),
  });

  public readonly associatedContractsEnabled$ = this.store.select(selectITSystemUsageEnableAssociatedContracts);
  public readonly contractToDetermineIsActiveEnabled$ = this.store.select(
    selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive,
  );

  public readonly contractCreationPermission$ = this.store.select(selectItContractHasCollectionCreatePermissions);

  constructor(
    private readonly store: Store,
    private readonly contractsStore: ItSystemUsageDetailsContractsComponentStore,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions,
  ) {
    super();
  }

  public patchMainContract(uuid?: string) {
    if (this.contractSelectionForm.valid) {
      this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ general: { mainContractUuid: uuid } }));
    } else {
      this.notificationService.showError($localize`Valg af kontrakt er ugyldig`);
    }
  }

  public ngOnInit(): void {
    this.store.dispatch(ITContractActions.getITContractCollectionPermissions());
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_contract-type'));

    //Update form on changes
    this.subscriptions.add(
      this.mainContract$
        .pipe(filterNullish(), combineLatestWith(this.availableContractsForSelection$))
        .subscribe(([mainContract, availableContracts]) =>
          this.contractSelectionForm.patchValue({
            mainContract: availableContracts.filter((contract) => contract.uuid === mainContract?.uuid).pop(),
          }),
        ),
    );

    // Initiate load of associated contracts when system usage changes
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((itSystemUsageUuid) => this.contractsStore.getAssociatedContracts(itSystemUsageUuid)),
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITContractActions.createAndAssociateContractSuccess)).subscribe(({ usageUuid }) => {
        this.contractsStore.getAssociatedContracts(usageUuid);
      }),
    );

    // Disable forms if user does not have rights to modify
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          this.contractSelectionForm.disable();
        }),
    );
  }

  public openCreateAndRegisterContractDialog() {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish(), first())
        .subscribe((itSystemUsageUuid) => {
          const dialogRef = this.dialog.open(CreateAndAssociateContractDialogComponent);
          dialogRef.componentInstance.usageToAssociateUuid = itSystemUsageUuid;
        }),
    );
  }
}
