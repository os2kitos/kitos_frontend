import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, combineLatestWith, first, map, Observable } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIUpdateOrganizationUnitRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import {
  PaymentRegistrationModel,
  RegistrationModel,
} from 'src/app/shared/models/organization-unit/organization-unit-registration.model';
import { TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import {
  selectExternalPaymentsRegistrations,
  selectInternalPaymentsRegistrations,
  selectIsLoadingRegistrations,
  selectItContractRegistrations,
  selectOrganizationUnitRightsRegistrations,
  selectRelevantSystemsRegistrations,
  selectResponsibleSystemsRegistrations,
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

  public readonly organizationUnitRegistrations$ = this.store.select(selectOrganizationUnitRightsRegistrations);
  public readonly itContractRegistration$ = this.store.select(selectItContractRegistrations);
  public readonly internalPaymentsRegistrations$ = this.store.select(selectInternalPaymentsRegistrations);
  public readonly externalPaymentsRegistrations$ = this.store.select(selectExternalPaymentsRegistrations);
  public readonly responsibleSystemsRegistrations$ = this.store.select(selectResponsibleSystemsRegistrations);
  public readonly relevantSystemsRegistrations$ = this.store.select(selectRelevantSystemsRegistrations);

  public readonly hasOrganizationUnitRights$ = this.organizationUnitRegistrations$.pipe(
    map((registrations) => this.hasRegistrations(registrations))
  );
  public readonly hasItContractRegistrations$ = this.itContractRegistration$.pipe(
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

  public baseInfoForm = new FormGroup({
    parentUnitControl: new FormControl<IdentityNamePair | undefined>(undefined),
    nameControl: new FormControl<string | undefined>(undefined, Validators.required),
    eanControl: new FormControl<number | undefined>(undefined),
    idControl: new FormControl<string | undefined>(undefined),
  });

  public isAllSelected = false;
  public selectedTransferUnit: TreeNodeModel | null = null;

  constructor(private readonly dialog: MatDialogRef<ConfirmationDialogComponent>, private readonly store: Store) {
    super();
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.unit$.subscribe((unit) => {
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

  public changeSelectAllRegistrationsState() {
    this.isAllSelected = !this.isAllSelected;
    this.store.dispatch(OrganizationUnitActions.changeAllSelect(this.isAllSelected));
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
}
