import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatestWith, first, map } from 'rxjs';
import {
  APIDataProcessingRegistrationOversightWriteRequestDTO,
  APIIdentityNamePairResponseDTO,
  APIUpdateDataProcessingRegistrationRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DropdownDialogComponent } from 'src/app/shared/components/dialogs/dropdown-dialog/dropdown-dialog.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { combineOR } from 'src/app/shared/helpers/observable-helpers';
import {
  mapToOversightInterval,
  OversightInterval,
  oversightIntervalOptions,
} from 'src/app/shared/models/data-processing/oversight-interval.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { YesNoEnum, yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessing,
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingOversightOptions,
} from 'src/app/store/data-processing/selectors';
import {
  selectDprEnabledOversightInterval,
  selectDprEnableOversightOptions,
  selectDprEnableOversights,
  selectDprEnableScheduledInspectionDate,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { DropdownComponent } from '../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { TextAreaComponent } from '../../../../shared/components/textarea/textarea.component';
import { DatePickerComponent } from '../../../../shared/components/datepicker/datepicker.component';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { ContentSpaceBetweenComponent } from '../../../../shared/components/content-space-between/content-space-between.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { IconButtonComponent } from '../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../shared/components/collection-extension-button/collection-extension-button.component';
import { OversightsTableComponent } from './oversights-table/oversights-table.component';

@Component({
  selector: 'app-data-processing-oversight',
  templateUrl: './data-processing-oversight.component.html',
  styleUrl: './data-processing-oversight.component.scss',
  imports: [
    NgIf,
    CardComponent,
    CardHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    DropdownComponent,
    TextAreaComponent,
    DatePickerComponent,
    NativeTableComponent,
    NgFor,
    ContentSpaceBetweenComponent,
    ParagraphComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    OversightsTableComponent,
    AsyncPipe,
  ],
})
export class DataProcessingOversightComponent extends BaseComponent implements OnInit {
  public readonly oversightOptions$ = this.store.select(selectDataProcessingOversightOptions).pipe(filterNullish());

  public readonly anyOversightOptions$ = this.oversightOptions$.pipe(matchNonEmptyArray());
  public readonly hasModifyPermission$ = this.store.select(selectDataProcessingHasModifyPermissions);
  public readonly yesNoOptions = yesNoOptions.map((option) => ({ id: option.value, label: option.name }));

  public readonly oversightIntervalOptions = oversightIntervalOptions;
  public readonly oversightOptionTypes$ = this.store
    .select(selectRegularOptionTypes('data-processing-oversight-option-types'))
    .pipe(
      filterNullish(),
      combineLatestWith(this.oversightOptions$.pipe(map((options) => options?.map((option) => option.uuid)))),
      map(([options, existingOptionUuids]) => {
        if (!existingOptionUuids || existingOptionUuids.length == 0) return options;

        return options.filter((option: APIIdentityNamePairResponseDTO) => !existingOptionUuids.includes(option.uuid));
      }),
    );

  public readonly hasOversightsValue$ = new BehaviorSubject<YesNoEnum | undefined>(undefined);
  public readonly isHasOversightsTrue$ = this.hasOversightsValue$.pipe(map((value) => value === 'Yes'));

  public readonly generalInformationForm = new FormGroup(
    {
      interval: new FormControl<OversightInterval | undefined>({ value: undefined, disabled: true }),
      intervalRemarks: new FormControl<string | undefined>({
        value: undefined,
        disabled: true,
      }),
      completedAt: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
      remarks: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    },
    { updateOn: 'blur' },
  );

  public readonly oversightIntervalEnabled$ = this.store.select(selectDprEnabledOversightInterval);
  public readonly nextOversightEnabled$ = this.store.select(selectDprEnableScheduledInspectionDate);
  public readonly oversightOptionsEnabled$ = this.store.select(selectDprEnableOversightOptions);
  public readonly oversightsEnabled$ = this.store.select(selectDprEnableOversights);

  public readonly intervalCardEnabled$ = combineOR([
    this.oversightIntervalEnabled$,
    this.nextOversightEnabled$,
    this.oversightOptionsEnabled$,
  ]);

  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('data-processing-oversight-option-types'));

    this.subscriptions.add(
      this.store
        .select(selectDataProcessing)
        .pipe(combineLatestWith(this.store.select(selectDataProcessingHasModifyPermissions)))
        .subscribe(([dataProcessing, hasModifyPermissions]) => {
          this.generalInformationForm.patchValue({
            interval: mapToOversightInterval(dataProcessing?.oversight?.oversightInterval),
            intervalRemarks: dataProcessing?.oversight?.oversightIntervalRemark,
            completedAt: optionalNewDate(dataProcessing?.oversight?.oversightScheduledInspectionDate),
            remarks: dataProcessing?.oversight?.oversightOptionsRemark,
          });
          if (hasModifyPermissions) {
            this.generalInformationForm.enable();
          }
        }),
    );
  }

  public patch(request: APIUpdateDataProcessingRegistrationRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(DataProcessingActions.patchDataProcessing(request));
    }
  }

  public patchOversight(
    value: APIDataProcessingRegistrationOversightWriteRequestDTO,
    valueChange?: ValidatedValueChange<unknown>,
  ): void {
    this.patch({ oversight: value }, valueChange);
  }

  public onAddNewOversight(): void {
    const dialogRef = this.dialog.open(DropdownDialogComponent<APIIdentityNamePairResponseDTO>);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.title = $localize`Tilføj tilsynsmulighed`;
    dialogInstance.dropdownText = $localize`Vælg tilsynsmulighed`;
    dialogInstance.valueField = 'uuid';
    dialogInstance.data$ = this.oversightOptionTypes$.pipe(
      map((options) => options?.map((option) => ({ uuid: option.uuid, name: option.name }))),
    );
    dialogInstance.successActionType = DataProcessingActions.patchDataProcessingSuccess.type;
    dialogInstance.errorActionType = DataProcessingActions.patchDataProcessingError.type;
    dialogInstance.save
      .pipe(combineLatestWith(this.store.select(selectDataProcessingOversightOptions)), first())
      .subscribe(([data, oversightOptions]) => {
        this.store.dispatch(DataProcessingActions.addDataProcessingOversightOption(data, oversightOptions));
      });
  }

  public onDeleteOversight(oversightUuid: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(combineLatestWith(this.oversightOptions$.pipe(first())))
        .subscribe(([result, oversightOptions]) => {
          if (result === true) {
            this.store.dispatch(
              DataProcessingActions.removeDataProcessingOversightOption(oversightUuid, oversightOptions),
            );
          }
        }),
    );
  }
}
