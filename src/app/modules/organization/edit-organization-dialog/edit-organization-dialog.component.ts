import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatestWith, map, Observable, pipe } from 'rxjs';
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
  @Input() public unitName$!: Observable<string>;
  @Input() public rootUnitUuid$!: Observable<string>;

  public readonly confirmColor: ThemePalette = 'primary';

  constructor(private readonly dialog: MatDialogRef<ConfirmationDialogComponent>) {
    super();
  }

  public SaveResult() {
    this.dialog.close(true);
  }

  public CancelResult() {
    this.dialog.close(false);
  }

  public shouldDisableEditParentUnit(){
    return this.unit$.pipe(
      combineLatestWith(this.rootUnitUuid$),
      map(([unit, rootUnitUuid]) => {
        if (!unit.parentOrganizationUnit) return true;
        return unit.parentOrganizationUnit.uuid === rootUnitUuid;
      })
    )
  }
}
