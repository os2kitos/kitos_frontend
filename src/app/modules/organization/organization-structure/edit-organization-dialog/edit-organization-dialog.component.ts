import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, map, Observable } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIOrganizationRegistrationUnitResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIUpdateOrganizationUnitRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectIsLoadingRegistrations, selectRegistrations } from 'src/app/store/organization-unit/selectors';

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

  public readonly registrations$ = this.store.select(selectRegistrations).pipe(filterNullish());
  //public readonly mappedRegistrations = this.registrations$.pipe(map((registrations) => registrations.((registration) => ({ registration, isSelected: false }))));
  public readonly isLoading$ = this.store.select(selectIsLoadingRegistrations);

  public readonly anyRegistrations$ = this.registrations$.pipe(map((registrations) => this.hasAnyData(registrations)));
  public readonly hasOrganizationUnitRights$ = this.registrations$.pipe(
    map((registrations) => this.hasOrganizationUnitRights(registrations))
  );
  public readonly hasItContractRegistrations$ = this.registrations$.pipe(
    map((registrations) => this.hasItContractRegistrations(registrations))
  );
  public readonly hasInternalPayments$ = this.registrations$.pipe(
    map((registrations) => this.hasInternalPayments(registrations))
  );
  public readonly hasExternalPayments$ = this.registrations$.pipe(
    map((registrations) => this.hasInternalPayments(registrations))
  );
  public readonly hasRelevantSystems$ = this.registrations$.pipe(
    map((registrations) => this.hasRelevantSystems(registrations))
  );
  public readonly hasResponsibleSystems$ = this.registrations$.pipe(
    map((registrations) => this.hasResponsibleSystems(registrations))
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

  private hasAnyData(registration: APIOrganizationRegistrationUnitResponseDTO | undefined): boolean {
    return (
      (registration &&
        (this.hasOrganizationUnitRights(registration) ||
          this.hasItContractRegistrations(registration) ||
          this.hasInternalPayments(registration) ||
          this.hasExternalPayments(registration) ||
          this.hasResponsibleSystems(registration) ||
          this.hasRelevantSystems(registration))) ??
      false
    );
  }

  private hasOrganizationUnitRights(registration: APIOrganizationRegistrationUnitResponseDTO): boolean {
    return (registration?.organizationUnitRights && registration.organizationUnitRights.length > 0) ?? false;
  }

  private hasItContractRegistrations(registration: APIOrganizationRegistrationUnitResponseDTO): boolean {
    return (registration?.itContractRegistrations && registration.itContractRegistrations.length > 0) ?? false;
  }

  private hasInternalPayments(registration: APIOrganizationRegistrationUnitResponseDTO): boolean {
    return (
      (registration.payments &&
        registration.payments.some((payment) => payment.internalPayments && payment.internalPayments.length > 0)) ??
      false
    );
  }

  private hasExternalPayments(registration: APIOrganizationRegistrationUnitResponseDTO): boolean {
    return (
      (registration.payments &&
        registration.payments.some((payment) => payment.externalPayments && payment.externalPayments.length > 0)) ??
      false
    );
  }

  private hasResponsibleSystems(registration: APIOrganizationRegistrationUnitResponseDTO): boolean {
    return (registration?.responsibleSystems && registration.responsibleSystems.length > 0) ?? false;
  }

  private hasRelevantSystems(registration: APIOrganizationRegistrationUnitResponseDTO): boolean {
    return (registration?.relevantSystems && registration.relevantSystems.length > 0) ?? false;
  }
}
