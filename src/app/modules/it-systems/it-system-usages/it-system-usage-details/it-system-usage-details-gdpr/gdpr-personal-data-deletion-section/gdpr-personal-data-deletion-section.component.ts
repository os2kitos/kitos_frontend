import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { mapUIConfigStatusToRecommended } from 'src/app/shared/helpers/observable-helpers';
import { selectITSystemUsageEnableAndRecommendedGdprPersonalDataDeletion } from 'src/app/store/organization/ui-module-customization/selectors';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { BehaviorSubject, combineLatest, map, switchMap, shareReplay, withLatestFrom } from 'rxjs';
import {
  APISimpleLinkDTO,
  APIGDPRRegistrationsResponseDTO,
  APIGDPRWriteRequestDTO,
  APIIdentityNamePairResponseDTO,
  APIPersonalDataDeletionCapabilityChoice,
  APIPersonalDataDeletionMethodChoice,
  OrganizationV2Service,
} from 'src/app/api/v2';
import { BaseAccordionComponent } from 'src/app/shared/base/base-accordion.component';
import { AccordionComponent } from 'src/app/shared/components/accordion/accordion.component';
import { DropdownComponent } from 'src/app/shared/components/dropdowns/dropdown/dropdown.component';
import { DatePickerComponent } from 'src/app/shared/components/datepicker/datepicker.component';
import { getMaximumFutureDate } from 'src/app/shared/helpers/date.helpers';
import { dateLessThanOrEqualToDateValidator } from 'src/app/shared/helpers/form.helpers';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { DropdownOption } from 'src/app/shared/models/dropdown-option.model';
import {
  personalDataDeletionCapabilityOptions,
  personalDataDeletionMethodOptions,
  supportsPersonalDataDeletion,
} from 'src/app/shared/models/it-system-usage/gdpr/personal-data-deletion.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr, selectITSystemUsageHasModifyPermission } from 'src/app/store/it-system-usage/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { EditUrlSectionComponent } from '../../../../shared/edit-url-section/edit-url-section.component';

@Component({
  selector: 'app-gdpr-personal-data-deletion-section',
  templateUrl: './gdpr-personal-data-deletion-section.component.html',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    AccordionComponent,
    DropdownComponent,
    DatePickerComponent,
    StandardVerticalContentGridComponent,
    EditUrlSectionComponent,
  ],
})
export class GdprPersonalDataDeletionSectionComponent extends BaseAccordionComponent implements OnInit {
  private readonly gdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly recommended$ = this.store.select(selectITSystemUsageEnableAndRecommendedGdprPersonalDataDeletion).pipe(mapUIConfigStatusToRecommended());
  public readonly capabilityOptions = personalDataDeletionCapabilityOptions;
  public readonly methodOptions = personalDataDeletionMethodOptions;
  public readonly deadlines$ = this.store.select(selectRegularOptionTypes('it-system-usage_personal-data-deletion-deadline-type'));
  public readonly userSearch$ = new BehaviorSubject<string | undefined>(undefined);
  public readonly users$ = combineLatest([this.store.select(selectOrganizationUuid).pipe(filterNullish()), this.userSearch$]).pipe(
    switchMap(([organizationUuid, nameOrEmailQuery]) => this.organizationService.getManyOrganizationV2GetOrganizationUsers({ organizationUuid, nameOrEmailQuery })),
    shareReplay({ bufferSize: 1, refCount: true }));
  public readonly procedure$ = this.gdpr$.pipe(map((g) => this.toSimpleLink(g.personalDataDeletionProcedureDocumentation)));
  public readonly verification$ = this.gdpr$.pipe(map((g) => this.toSimpleLink(g.personalDataDeletionVerificationDocumentation)));
  public detailsDisabled = true;
  public readonly maximumVerifiedDate = getMaximumFutureDate();
  private canModify = false;
  public readonly formGroup = new FormGroup({
    capability: new FormControl<DropdownOption<APIPersonalDataDeletionCapabilityChoice> | undefined>(undefined),
    method: new FormControl<DropdownOption<APIPersonalDataDeletionMethodChoice> | undefined>(undefined),
    deadline: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
    responsibleUser: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
    verifiedDate: new FormControl<Date | undefined>(undefined, dateLessThanOrEqualToDateValidator(this.maximumVerifiedDate)),
  });
  constructor(
    private readonly store: Store,
    private readonly organizationService: OrganizationV2Service,
    private readonly actions$: Actions,
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system-usage_personal-data-deletion-deadline-type'));
    this.subscriptions.add(
      combineLatest([this.gdpr$, this.store.select(selectITSystemUsageHasModifyPermission)])
        .subscribe(([gdpr, permission]) => this.applyGdprState(gdpr, permission === true)),
    );
    this.subscribeToSaveFailures();
  }

  private subscribeToSaveFailures(): void {
    this.subscriptions.add(
      this.actions$.pipe(
        ofType(ITSystemUsageActions.patchITSystemUsageError),
        withLatestFrom(this.gdpr$, this.store.select(selectITSystemUsageHasModifyPermission)),
      ).subscribe(([, gdpr, permission]) => this.applyGdprState(gdpr, permission === true)),
    );
  }

  public externalSearch(): boolean {
    return true;
  }

  private applyGdprState(gdpr: APIGDPRRegistrationsResponseDTO, canModify: boolean): void {
    this.canModify = canModify;
    this.patchForm(gdpr);
    this.updateEnabledState(gdpr.personalDataDeletionCapability);
  }

  private toSimpleLink(link?: APISimpleLinkDTO | null): SimpleLink | undefined {
    return link ? { name: link.name ?? undefined, url: link.url ?? undefined } : undefined;
  }

  private patchForm(gdpr: APIGDPRRegistrationsResponseDTO): void {
    this.formGroup.patchValue({
      capability: this.capabilityOptions.find((o) => o.value === gdpr.personalDataDeletionCapability),
      method: this.methodOptions.find((o) => o.value === gdpr.personalDataDeletionMethod),
      deadline: gdpr.personalDataDeletionDeadlineType ?? undefined,
      responsibleUser: gdpr.personalDataDeletionResponsibleUser ?? undefined,
      verifiedDate: gdpr.personalDataDeletionVerifiedDate ? new Date(gdpr.personalDataDeletionVerifiedDate) : undefined,
    });
  }

  private updateEnabledState(capability?: APIPersonalDataDeletionCapabilityChoice | null): void {
    this.detailsDisabled = !this.canModify || !supportsPersonalDataDeletion(capability);
    for (const [name, control] of Object.entries(this.formGroup.controls)) {
      const enabled = name === 'capability' ? this.canModify : !this.detailsDisabled;
      if (enabled) control.enable({ emitEvent: false });
      else control.disable({ emitEvent: false });
    }
  }

  public changeCapability(capability: APIPersonalDataDeletionCapabilityChoice | null): void {
    if (!this.canModify) return;
    this.updateEnabledState(capability);
    const gdpr: APIGDPRWriteRequestDTO = { personalDataDeletionCapability: capability };
    if (!supportsPersonalDataDeletion(capability)) this.clearDeletionDetails(gdpr);
    this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ gdpr }));
  }

  private clearDeletionDetails(gdpr: APIGDPRWriteRequestDTO): void {
    Object.assign(gdpr, {
      personalDataDeletionMethod: null,
      personalDataDeletionDeadlineTypeUuid: null,
      personalDataDeletionResponsibleUserUuid: null,
      personalDataDeletionVerifiedDate: null,
      personalDataDeletionProcedureDocumentation: null,
      personalDataDeletionVerificationDocumentation: null,
    });
    this.formGroup.patchValue({ method: undefined, deadline: undefined, responsibleUser: undefined, verifiedDate: undefined });
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO): void {
    if (this.detailsDisabled || !this.formGroup.valid) return;
    this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ gdpr }));
  }
}
