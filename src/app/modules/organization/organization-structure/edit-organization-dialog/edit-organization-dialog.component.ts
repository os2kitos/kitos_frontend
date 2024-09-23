import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, combineLatestWith, first, map, Observable } from 'rxjs';
import {
  APIChangeOrganizationUnitRegistrationV2RequestDTO,
  APIIdentityNamePairResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIUpdateOrganizationUnitRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import {
  PaymentRegistrationModel,
  RegistrationModel,
} from 'src/app/shared/models/organization-unit/organization-unit-registration.model';
import { TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import {
  selectExternalPaymentsRegistrations,
  selectInternalPaymentsRegistrations,
  selectIsLoadingRegistrations,
  selectItContractRegistrations,
  selectOrganizationUnitRightsRegistrations,
  selectRelevantSystemsRegistrations,
  selectResponsibleSystemsRegistrations,
  selectUnitPermissions,
} from 'src/app/store/organization-unit/selectors';

@Component({
  selector: 'app-edit-organization-dialog',
  templateUrl: './edit-organization-dialog.component.html',
  styleUrl: './edit-organization-dialog.component.scss',
})
export class EditOrganizationDialogComponent extends BaseComponent implements OnInit {
  @Input() public unit$!: Observable<APIOrganizationUnitResponseDTO>;
  @Input() public rootUnitUuid$!: Observable<string>;
  @Input() public validParentOrganizationUnits$!: Observable<APIIdentityNamePairResponseDTO[]>;

  public readonly confirmColor: ThemePalette = 'primary';

  public readonly isLoading$ = this.store.select(selectIsLoadingRegistrations);

  public readonly unitPermissions$ = this.store.select(selectUnitPermissions);

  public readonly organizationUnitRegistrations$ = this.store.select(selectOrganizationUnitRightsRegistrations);
  public readonly itContractRegistrations$ = this.store.select(selectItContractRegistrations);
  public readonly internalPaymentsRegistrations$ = this.store.select(selectInternalPaymentsRegistrations);
  public readonly externalPaymentsRegistrations$ = this.store.select(selectExternalPaymentsRegistrations);
  public readonly responsibleSystemsRegistrations$ = this.store.select(selectResponsibleSystemsRegistrations);
  public readonly relevantSystemsRegistrations$ = this.store.select(selectRelevantSystemsRegistrations);

  public readonly hasOrganizationUnitRights$ = this.organizationUnitRegistrations$.pipe(
    map((registrations) => this.hasRegistrations(registrations))
  );
  public readonly hasItContractRegistrations$ = this.itContractRegistrations$.pipe(
    map((registrations) => this.hasRegistrations(registrations))
  );
  public readonly hasInternalPayments$ = this.internalPaymentsRegistrations$.pipe(
    map((registrations) => this.hasRegistrations(registrations))
  );
  public readonly hasExternalPayments$ = this.externalPaymentsRegistrations$.pipe(
    map((registrations) => this.hasRegistrations(registrations))
  );
  public readonly hasResponsibleSystems$ = this.responsibleSystemsRegistrations$.pipe(
    map((registrations) => this.hasRegistrations(registrations))
  );
  public readonly hasRelevantSystems$ = this.relevantSystemsRegistrations$.pipe(
    map((registrations) => this.hasRegistrations(registrations))
  );

  public readonly allOrganizationUnitRightsSelected$ = this.organizationUnitRegistrations$.pipe(
    map((registrations) => this.areAllRegistrationsSelected(registrations))
  );
  public readonly allItContractRegistrationsSelected$ = this.itContractRegistrations$.pipe(
    map((registrations) => this.areAllRegistrationsSelected(registrations))
  );
  public readonly allInternalPaymentsSelected$ = this.internalPaymentsRegistrations$.pipe(
    map((registrations) => this.areAllRegistrationsSelected(registrations))
  );
  public readonly allExternalPaymentsSelected$ = this.externalPaymentsRegistrations$.pipe(
    map((registrations) => this.areAllRegistrationsSelected(registrations))
  );
  public readonly allResponsibleSystemsSelected$ = this.responsibleSystemsRegistrations$.pipe(
    map((registrations) => this.areAllRegistrationsSelected(registrations))
  );
  public readonly allRelevantSystemsSelected$ = this.relevantSystemsRegistrations$.pipe(
    map((registrations) => this.areAllRegistrationsSelected(registrations))
  );

  public readonly anyRegistrations$ = combineLatest([
    this.hasOrganizationUnitRights$,
    this.hasItContractRegistrations$,
    this.hasInternalPayments$,
    this.hasExternalPayments$,
    this.hasResponsibleSystems$,
    this.hasRelevantSystems$,
  ]).pipe(
    map(
      ([
        hasOrganizationUnitRights,
        hasItContractRegistrations,
        hasInternalPayments,
        hasExternalPayments,
        hasResponsibleSystems,
        hasRelevantSystems,
      ]) =>
        hasOrganizationUnitRights ||
        hasItContractRegistrations ||
        hasInternalPayments ||
        hasExternalPayments ||
        hasResponsibleSystems ||
        hasRelevantSystems
    )
  );

  public readonly allRegistrationsSelected$ = combineLatest([
    this.allOrganizationUnitRightsSelected$,
    this.allItContractRegistrationsSelected$,
    this.allInternalPaymentsSelected$,
    this.allExternalPaymentsSelected$,
    this.allResponsibleSystemsSelected$,
    this.allRelevantSystemsSelected$,
  ]).pipe(
    map(
      ([
        allOrganizationUnitRightsSelected,
        allItContractRegistrationsSelected,
        allInternalPaymentsSelected,
        allExternalPaymentsSelected,
        allResponsibleSystemsSelected,
        allRelevantSystemsSelected,
      ]) =>
        allOrganizationUnitRightsSelected &&
        allItContractRegistrationsSelected &&
        allInternalPaymentsSelected &&
        allExternalPaymentsSelected &&
        allResponsibleSystemsSelected &&
        allRelevantSystemsSelected
    )
  );

  private readonly combinedRegistrations$ = combineLatest([
    this.organizationUnitRegistrations$,
    this.itContractRegistrations$,
    this.internalPaymentsRegistrations$,
    this.externalPaymentsRegistrations$,
    this.relevantSystemsRegistrations$,
    this.responsibleSystemsRegistrations$,
  ]);

  public readonly selectedRegistrationsCount$ = this.combinedRegistrations$.pipe(
    map(([organizationUnit, itContract, internalPayments, externalPayments, responsibleSystems, relevantSystems]) => {
      const selectedOrganizationUnitCount = organizationUnit.filter((registration) => registration.isSelected).length;
      const selectedItContractCount = itContract.filter((registration) => registration.isSelected).length;
      const selectedInternalPaymentsCount = internalPayments.filter((payment) => payment.isSelected).length;
      const selectedExternalPaymentsCount = externalPayments.filter((payment) => payment.isSelected).length;
      const selectedResponsibleSystemsCount = responsibleSystems.filter(
        (registration) => registration.isSelected
      ).length;
      const selectedRelevantSystemsCount = relevantSystems.filter((registration) => registration.isSelected).length;

      return (
        selectedOrganizationUnitCount +
        selectedItContractCount +
        selectedInternalPaymentsCount +
        selectedExternalPaymentsCount +
        selectedResponsibleSystemsCount +
        selectedRelevantSystemsCount
      );
    })
  );

  public baseInfoForm = new FormGroup({
    parentUnitControl: new FormControl<IdentityNamePair | undefined>(undefined),
    nameControl: new FormControl<string | undefined>(undefined, Validators.required),
    eanControl: new FormControl<number | undefined>(undefined),
    idControl: new FormControl<string | undefined>(undefined),
  });

  public selectedTransferUnit: TreeNodeModel | undefined = undefined;

  public readonly disabledTransferButtonTooltip = $localize`Du skal vælge en ny organisationsenhed for at kunne overføre`;

  constructor(
    private readonly dialog: MatDialogRef<ConfirmationDialogComponent>,
    private readonly store: Store,
    private confirmActionService: ConfirmActionService,
    private router: Router,
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.unit$.pipe(filterNullish()).subscribe((unit) => {
        if (!unit.uuid) return;
        this.store.dispatch(OrganizationUnitActions.getRegistrations(unit.uuid));

        this.baseInfoForm.patchValue({
          parentUnitControl: unit.parentOrganizationUnit,
          nameControl: unit.name,
          eanControl: unit.ean,
          idControl: unit.unitId,
        });
      })
    );

    this.subscriptions.add(
      this.isRootUnit().subscribe((isRootUnit) => {
        if (isRootUnit) this.baseInfoForm.controls.parentUnitControl.disable();
      })
    );
  }

  public onSave() {
    if (this.baseInfoForm.valid) {
      this.subscriptions.add(
        this.unit$.pipe(first()).subscribe((unit) => {
          const updatedUnit = this.updateDtoWithOrWithoutParentUnit(unit);
          this.store.dispatch(OrganizationUnitActions.patchOrganizationUnit(unit.uuid, updatedUnit));
        })
      );
    }
    this.dialog.close();
  }

  public onParentUnitControlBlur() {
    this.subscriptions.add(
      this.unit$.subscribe((unit) => {
        const control = this.baseInfoForm.controls.parentUnitControl;
        if (!control.value) control.patchValue(unit.parentOrganizationUnit);
      })
    );
  }

  public isRootUnit() {
    return this.unit$.pipe(
      combineLatestWith(this.rootUnitUuid$),
      map(([unit, rootUnitUuid]) => {
        return unit.uuid === rootUnitUuid;
      })
    );
  }

  public getParentUnitDropdownText() {
    return this.isRootUnit().pipe(
      map((isRootUnit) => {
        return isRootUnit ? $localize`Ingen overordnet enhed` : $localize`Overordnet enhed`;
      })
    );
  }

  public getParentUnitHelpText() {
    return this.isRootUnit().pipe(
      combineLatestWith(this.unit$),
      map(([isRootUnit, unit]) => {
        const unitName = unit.name;
        return isRootUnit
          ? $localize`Du kan ikke ændre overordnet organisationsenhed for ${unitName}`
          : $localize`Der kan kun vælges blandt de organisationsenheder, som er indenfor samme organisation, og som ikke er en underenhed til ${unitName}.`;
      })
    );
  }

  public changeSelectAllRegistrationsState(selectAll: boolean) {
    this.store.dispatch(OrganizationUnitActions.changeAllSelect(selectAll));
  }

  public deleteSelected(unitUuid: string) {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.performOperationOnSelected(unitUuid, 'delete'),
      message: $localize`Denne handling kan ikke fortrydes.`,
      title: $localize`Vil du slette de valgte registreringer?`,
    });
  }

  public transferSelected(unitUuid: string) {
    if (this.selectedTransferUnit === undefined) {
      return;
    }

    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.performOperationOnSelected(unitUuid, 'transfer'),
      message: $localize`Denne handling kan ikke fortrydes.`,
      title: $localize`Vil du overføre de valgte registreringer?`,
    });
  }

  public performOperationOnSelected(unitUuid: string, operation: 'delete' | 'transfer') {
    this.subscriptions.add(
      this.combinedRegistrations$
        .pipe(first())
        .subscribe(
          ([organizationUnit, itContract, internalPayments, externalPayments, relevantSystems, responsibleSystems]) => {
            const paymentsRequest = this.getPaymentsRequest(internalPayments, externalPayments);

            const request: APIChangeOrganizationUnitRegistrationV2RequestDTO = {
              //casting as number to satisfy the type checker
              organizationUnitRights: organizationUnit
                .filter((registration) => registration.isSelected)
                .map((registration) => registration.registration.id as number),
              itContractRegistrations: itContract
                .filter((registration) => registration.isSelected)
                .map((registration) => registration.registration.id as number),
              paymentRegistrationDetails: paymentsRequest,
              relevantSystems: relevantSystems
                .filter((registration) => registration.isSelected)
                .map((registration) => registration.registration.id as number),
              responsibleSystems: responsibleSystems
                .filter((registration) => registration.isSelected)
                .map((registration) => registration.registration.id as number),
            };

            if (operation === 'transfer') {
              const transferRequest = { ...request, targetUnitUuid: this.selectedTransferUnit?.id };
              this.store.dispatch(OrganizationUnitActions.transferRegistrations(unitUuid, transferRequest));
            } else {
              this.store.dispatch(OrganizationUnitActions.removeRegistrations(unitUuid, request));
            }
          }
        )
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onUnitSelectionChange(event: any) {
    this.selectedTransferUnit = event;
  }

  public onNavigateToDetailsPage() {
    this.dialog.close();
  }

  public openDeleteDialog(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.confirmDeleteHandler(),
      message: $localize`Er du sikker på at du vil slette denne enhed?`,
      title: $localize`Slet enhed`,
    });
  }

  public disableSaveButton() {
    return this.unit$.pipe(
      map((unit) => {
        const controls = this.baseInfoForm.controls;
        return (
          controls.parentUnitControl.value?.uuid == unit.parentOrganizationUnit?.uuid &&
          controls.nameControl.value == unit.name &&
          controls.eanControl.value == unit.ean &&
          controls.idControl.value == unit.unitId
        );
      })
    );
  }

  private confirmDeleteHandler(): void {
    this.unit$.pipe(first()).subscribe((unit) => {
      this.store.dispatch(OrganizationUnitActions.deleteOrganizationUnit(unit.uuid));
    });

    this.actions$
      .pipe(
        ofType(OrganizationUnitActions.deleteOrganizationUnitSuccess),
        combineLatestWith(
          this.rootUnitUuid$.pipe(map((uuid) => `${AppPath.organization}/${AppPath.structure}/${uuid}`))
        ),
        first()
      )
      .subscribe(([_, rootUnitUrl]) => {
        this.dialog.close();
        this.router.navigateByUrl(rootUnitUrl);
      });
  }

  private updateDtoWithOrWithoutParentUnit(unit: APIOrganizationUnitResponseDTO): APIUpdateOrganizationUnitRequestDTO {
    const controls = this.baseInfoForm.controls;
    const updatedUnit: APIUpdateOrganizationUnitRequestDTO = {
      ean: controls.eanControl.value ?? unit.ean,
      localId: controls.idControl.value ?? unit.unitId,
      name: controls.nameControl.value ?? unit.name,
    };
    const existingParentUuid = unit.parentOrganizationUnit?.uuid;
    const formParentUuid = controls.parentUnitControl.value?.uuid;

    return existingParentUuid === formParentUuid ? updatedUnit : { ...updatedUnit, parentUuid: formParentUuid };
  }

  private hasRegistrations<T>(registrations: Array<RegistrationModel<T>> | Array<PaymentRegistrationModel>): boolean {
    return registrations.length > 0 ?? false;
  }

  private areAllRegistrationsSelected<T>(
    registration: Array<RegistrationModel<T>> | Array<PaymentRegistrationModel>
  ): boolean {
    return registration.every((registration) => registration.isSelected);
  }

  private getPaymentsRequest(
    internalPayments: PaymentRegistrationModel[],
    externalPayments: PaymentRegistrationModel[]
  ) {
    const selectedInternalPayments = internalPayments.filter((payment) => payment.isSelected);
    const selectedExternalPayments = externalPayments.filter((payment) => payment.isSelected);

    const groupedPayments = selectedInternalPayments
      .concat(selectedExternalPayments)
      .reduce((acc: { [key: number]: { internalPaymentIds: number[]; externalPaymentIds: number[] } }, payment) => {
        const contractId = payment.itContractId;
        const id = payment.registration.id;
        if (!id) return acc;
        if (!acc[contractId]) {
          acc[contractId] = { internalPaymentIds: [], externalPaymentIds: [] };
        }
        if (selectedInternalPayments.includes(payment)) {
          acc[contractId].internalPaymentIds.push(id);
        } else if (selectedExternalPayments.includes(payment)) {
          acc[contractId].externalPaymentIds.push(id);
        }
        return acc;
      }, {});

    return Object.keys(groupedPayments).map((contractId) => ({
      itContractId: Number(contractId),
      internalPayments: groupedPayments[Number(contractId)].internalPaymentIds,
      externalPayments: groupedPayments[Number(contractId)].externalPaymentIds,
    }));
  }
}
