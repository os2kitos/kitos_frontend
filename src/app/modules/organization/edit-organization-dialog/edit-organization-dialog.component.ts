import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatestWith, map, Observable } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-organization-dialog',
  templateUrl: './edit-organization-dialog.component.html',
  styleUrl: './edit-organization-dialog.component.scss',
})
export class EditOrganizationDialogComponent extends BaseComponent {
  @Input() public unit$!: Observable<APIOrganizationUnitResponseDTO>;
  @Input() public rootUnitUuid$!: Observable<string>;
  @Output() saveChanges = new EventEmitter();

  public readonly confirmColor: ThemePalette = 'primary';

  constructor(private readonly dialog: MatDialogRef<ConfirmationDialogComponent>) {
    super();
  }

  public onSave() {
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
