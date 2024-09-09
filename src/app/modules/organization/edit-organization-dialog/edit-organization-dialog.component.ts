import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, map, Observable } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIUpdateOrganizationUnitRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';

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

  public form = new FormGroup({
    parentUnitControl: new FormControl<IdentityNamePair | undefined>(undefined),
    nameControl: new FormControl<string | undefined>(undefined, Validators.required),
    eanControl: new FormControl<number | undefined>(undefined),
    idControl: new FormControl<string | undefined>(undefined),
  });

  constructor(private readonly dialog: MatDialogRef<ConfirmationDialogComponent>, private readonly store: Store) {
    super();
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.unit$.subscribe((unit) => {
        this.form.patchValue({
          parentUnitControl: unit.parentOrganizationUnit,
          nameControl: unit.name,
          eanControl: unit.ean,
          idControl: unit.unitId,
        });
      })
    );
  }

  public onSave() {
    if (this.form.valid) {
      this.subscriptions.add(
        this.unit$
          .pipe(first())
          .subscribe((unit) => {
              const updatedUnit = this.updateDtoWithOrWithoutParentUnit(unit);
              this.store.dispatch(OrganizationUnitActions.patchOrganizationUnit(unit.uuid, updatedUnit));
            })
      );
    }
    this.dialog.close();
  }

  private updateDtoWithOrWithoutParentUnit(unit: APIOrganizationUnitResponseDTO): APIUpdateOrganizationUnitRequestDTO{
    const controls = this.form.controls;
    const updatedUnit: APIUpdateOrganizationUnitRequestDTO = {
      ean: controls.eanControl.value ?? unit.ean,
      localId: controls.idControl.value ?? unit.unitId,
      name: controls.nameControl.value ?? unit.name,
    };
    const existingParentUuid = unit.parentOrganizationUnit?.uuid;
    const formParentUuid = controls.parentUnitControl.value?.uuid;

    return existingParentUuid === formParentUuid ? updatedUnit : {...updatedUnit, parentUuid: formParentUuid};
  }

  public isRootUnit() {
    return this.unit$.pipe(
      combineLatestWith(this.rootUnitUuid$),
      map(([unit, rootUnitUuid]) => {
        return unit.uuid === rootUnitUuid;
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
}
