import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatestWith, map, Observable } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';

@Component({
  selector: 'app-edit-organization-dialog',
  templateUrl: './edit-organization-dialog.component.html',
  styleUrl: './edit-organization-dialog.component.scss',
})
export class EditOrganizationDialogComponent extends BaseComponent implements OnChanges {
  @Input() public unit$!: Observable<APIOrganizationUnitResponseDTO>;
  @Input() public rootUnitUuid$!: Observable<string>;
  @Input() public organizationUnits$!: Observable<APIOrganizationUnitResponseDTO[]>
  @Output() saveChanges = new EventEmitter();

  public readonly confirmColor: ThemePalette = 'primary';

  public organizationUnitNames$: Observable<string[]> | undefined = undefined;

  private form = new FormGroup(
    {
      parentUnitControl: new FormControl<IdentityNamePair | undefined>(undefined),
      nameControl: new FormControl<string | undefined>(undefined, Validators.required),
      eanControl: new FormControl<number | undefined>(undefined),
      idControl: new FormControl<string | undefined>(undefined)
    }
  )

  constructor(private readonly dialog: MatDialogRef<ConfirmationDialogComponent>) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organizationUnits$'] && this.organizationUnits$){
      this.organizationUnitNames$ = this.organizationUnits$.pipe(
      map((units) => units.map((unit) => unit.name)));
    }

  }

  public onSave() {
    if (this.form.valid){
      const controls = this.form.controls;
      const parentOrganizationUnit = this.organizationUnits$.pipe(
        map((units) => units.find((unit) => unit.name === controls.nameControl.value)))
      const updatedUnit = {
      parentOrganizationUnit: parentOrganizationUnit,
      ean: controls.eanControl.value,
      unitId: controls.idControl.value,
      name: controls.nameControl.value,
      }

      this.saveChanges.emit(updatedUnit)
    }

    this.dialog.close(true);
  }

  public isRootUnit(){
    return this.unit$.pipe(
      combineLatestWith(this.rootUnitUuid$),
      map(([unit, rootUnitUuid]) => {
        if (!unit.parentOrganizationUnit) return true;
        return unit.parentOrganizationUnit.uuid === rootUnitUuid;
      })
    );
  }

  public getParentUnitHelpText(){
    return this.unit$.pipe(
      map((unit) => {
        return this.isRootUnit()
        ? `Du kan ikke ændre overordnet organisationsenhed for ${unit.name}`
        : 'Der kan kun vælges blandt de organisationsenheder, som er indenfor samme organisation, og som ikke er en underenhed til kommunaldirektøren.'
      })
    );
  }
}
