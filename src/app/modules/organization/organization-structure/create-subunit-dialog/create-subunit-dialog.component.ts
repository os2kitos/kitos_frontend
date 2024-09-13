import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';

@Component({
  selector: 'app-create-subunit-dialog',
  templateUrl: './create-subunit-dialog.component.html',
  styleUrl: './create-subunit-dialog.component.scss',
})
export class CreateSubunitDialogComponent {

  @Input() parentUnitUuid$!: Observable<string>;
  @Input() parentUnitName$!: Observable<string>;

  public createForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    ean: new FormControl<number | undefined>(undefined),
    localId: new FormControl<string | undefined>(undefined),
  });

  constructor(private dialogRef: MatDialogRef<CreateSubunitDialogComponent>, private store: Store) {}

  public onCreate(): void {
    this.createSubunit();
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private createSubunit(): void {
    const name = this.createForm.controls.name.value;
    const ean = this.createForm.controls.ean.value;
    const localId = this.createForm.controls.localId.value;
    if (!name) return; // Don't think this is possible, but satisfies the type checker (09/09/2024)
    this.parentUnitUuid$.pipe(first()).subscribe((parentUuid) => {
      this.store.dispatch(
        OrganizationUnitActions.createOrganizationSubunit({
          parentUuid: parentUuid,
          name,
          ean: ean ?? undefined,
          localId: localId ?? undefined,
        })
      );
    });
  }
}
