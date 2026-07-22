import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, map } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIItInterfaceDataResponseDTO,
  APIUpdateItInterfaceRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { LinkWriteDialogComponent } from 'src/app/shared/components/dialogs/link-write-dialog/link-write-dialog.component';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import {
  ScopeChoice,
  mapScopeEnumToScopeChoice,
  scopeOptions,
} from 'src/app/shared/models/it-system/it-system-scope.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import {
  selectInterface,
  selectInterfaceData,
  selectInterfaceDeactivated,
  selectInterfaceHasModifyPermission,
  selectInterfaceUrlReference,
  selectInterfaceUuid,
} from 'src/app/store/it-system-interfaces/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { InterfaceDataWriteDialogComponent } from './interface-data-write-dialog/interface-data-write-dialog.component';
import { ITSystemInterfacesDetailsFrontpageComponentStore } from './it-system-interfaces-details-frontpage.component-store';
import { hasOpenDialogs } from 'src/app/shared/helpers/dialog.helpers';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { StatusChipComponent } from '../../../../../shared/components/status-chip/status-chip.component';
import { FormGridComponent } from '../../../../../shared/components/form-grid/form-grid.component';
import { TextBoxComponent } from '../../../../../shared/components/textbox/textbox.component';
import { ConnectedDropdownComponent } from '../../../../../shared/components/dropdowns/connected-dropdown/connected-dropdown.component';
import { DropdownComponent } from '../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { LinkTextboxComponent } from '../../../../../shared/components/link-textbox/link-textbox.component';
import { TextAreaComponent } from '../../../../../shared/components/textarea/textarea.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { ContentSpaceBetweenComponent } from '../../../../../shared/components/content-space-between/content-space-between.component';
import { TableRowActionsComponent } from '../../../../../shared/components/table-row-actions/table-row-actions.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { PencilIconComponent } from '../../../../../shared/components/icons/pencil-icon.compnent';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../../shared/components/collection-extension-button/collection-extension-button.component';

@Component({
  selector: 'app-it-system-interfaces-details-frontpage',
  templateUrl: './it-system-interfaces-details-frontpage.component.html',
  styleUrl: './it-system-interfaces-details-frontpage.component.scss',
  providers: [ITSystemInterfacesDetailsFrontpageComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    StatusChipComponent,
    FormGridComponent,
    FormsModule,
    ReactiveFormsModule,
    TextBoxComponent,
    ConnectedDropdownComponent,
    DropdownComponent,
    LinkTextboxComponent,
    TextAreaComponent,
    StandardVerticalContentGridComponent,
    NativeTableComponent,
    ParagraphComponent,
    ContentSpaceBetweenComponent,
    TableRowActionsComponent,
    IconButtonComponent,
    PencilIconComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    AsyncPipe
],
})
export class ItSystemInterfacesDetailsFrontpageComponent extends BaseComponent implements OnInit {
  public readonly interfaceTypeOptions$ = this.store
    .select(selectRegularOptionTypes('it-interface_interface-type'))
    .pipe(filterNullish());
  public readonly scopeOptions = scopeOptions;
  public readonly itSystems$ = this.componentStore.itSystems$;
  public readonly interfaceData$ = this.store.select(selectInterfaceData).pipe(filterNullish());
  public readonly interfaceUrlReference$ = this.store.select(selectInterfaceUrlReference);
  public readonly isInterfaceActive$ = this.store.select(selectInterfaceDeactivated);
  public readonly urlReferenceAsSimpleLink$ = this.interfaceUrlReference$.pipe(
    map((reference) => ({ name: '', url: reference }) as SimpleLink),
  );
  public readonly anyInterfaceData$ = this.interfaceData$.pipe(matchNonEmptyArray());
  public readonly isLoadingSystems$ = this.componentStore.isLoading$;

  public readonly hasModifyPermission$ = this.store.select(selectInterfaceHasModifyPermission);

  public disableLinkControl = false;

  public readonly interfaceFormGroup = new FormGroup({
    name: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    interfaceId: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    version: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    exposedBySystem: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    uuid: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    createdBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    rightsHolder: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    scope: new FormControl<ScopeChoice | undefined>({ value: undefined, disabled: true }),
    interfaceType: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    description: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    notes: new FormControl<string | undefined>({ value: undefined, disabled: true }),
  });

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService,
    private readonly componentStore: ITSystemInterfacesDetailsFrontpageComponentStore,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToItInterface();

    this.store.dispatch(RegularOptionTypeActions.getOptions('it-interface_interface-type'));
  }

  public patchFrontPage(frontpage: APIUpdateItInterfaceRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text} er ugyldig`);
    } else {
      this.store.dispatch(ITInterfaceActions.updateITInterface(frontpage));
    }
  }

  public patchExposedBySystem(systemUuid: string | undefined, valueChange?: ValidatedValueChange<unknown>) {
    this.subscribeToNextUpdateToVerifyPermissions();
    this.patchFrontPage({ exposedBySystemUuid: systemUuid }, valueChange);
  }

  public searchItSystems(searchTerm?: string): void {
    this.componentStore.searchItSystems(searchTerm);
  }

  public openWriteDialog(interfaceData?: APIItInterfaceDataResponseDTO): void {
    const createDialogRef = this.dialog.open(InterfaceDataWriteDialogComponent);
    const createDialogInstance = createDialogRef.componentInstance as InterfaceDataWriteDialogComponent;
    createDialogInstance.existingData = interfaceData;

    this.subscriptions.add(
      createDialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.subscriptions.add(
              this.store
                .select(selectInterfaceUuid)
                .pipe(filterNullish(), first())
                .subscribe((itInterfaceUuid) => {
                  this.store.dispatch(ITInterfaceActions.getITInterface(itInterfaceUuid));
                }),
            );
          }
        }),
    );
  }

  public deleteInterfaceDataRow(dataUuid?: string) {
    if (dataUuid === undefined) return;
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.title = $localize`Er du sikker på du vil slette data`;
    confirmationDialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      confirmationDialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITInterfaceActions.removeITInterfaceData(dataUuid));
          }
        }),
    );
  }

  public openUpdateUrlDialog() {
    if (hasOpenDialogs(this.dialog)) return;

    const dialogRef = this.dialog.open(LinkWriteDialogComponent);
    const instance = dialogRef.componentInstance as LinkWriteDialogComponent;
    instance.url$ = this.interfaceUrlReference$;
    instance.submitMethod.subscribe((url) => this.updateUrl(url));
  }

  public resetUrl() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.store.dispatch(ITInterfaceActions.updateITInterface({ urlReference: null as any }));
  }

  private updateUrl(url: string) {
    this.store.dispatch(ITInterfaceActions.updateITInterface({ urlReference: url }));
  }

  private subscribeToItInterface(): void {
    this.subscriptions.add(
      this.store
        .select(selectInterface)
        .pipe(filterNullish(), combineLatestWith(this.hasModifyPermission$))
        .subscribe(([itInterface, hasModifyPermission]) => {
          this.interfaceFormGroup.patchValue({
            name: itInterface.name,
            interfaceId: itInterface.interfaceId,
            version: itInterface.version,
            exposedBySystem: itInterface.exposedBySystem,
            uuid: itInterface.uuid,
            createdBy: itInterface.createdBy.name,
            rightsHolder: itInterface.rightsHolder?.name,
            scope: mapScopeEnumToScopeChoice(itInterface.scope),
            interfaceType: itInterface.itInterfaceType,
            description: itInterface.description,
            notes: itInterface.notes,
          });

          if (hasModifyPermission) {
            this.interfaceFormGroup.enable();
            this.disableLinkControl = false;
          } else {
            this.interfaceFormGroup.disable();
            this.disableLinkControl = true;
          }

          this.interfaceFormGroup.controls.uuid.disable();
          this.interfaceFormGroup.controls.createdBy.disable();
          this.interfaceFormGroup.controls.rightsHolder.disable();
        }),
    );
  }

  private subscribeToNextUpdateToVerifyPermissions(): void {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITInterfaceActions.updateITInterfaceSuccess),
          first(),
          combineLatestWith(this.store.select(selectInterfaceUuid).pipe(filterNullish())),
        )
        .subscribe(([_, interfaceUuid]) => {
          this.store.dispatch(ITInterfaceActions.getITInterfacePermissions(interfaceUuid));
        }),
    );
  }
}
