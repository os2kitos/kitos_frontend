import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-subunit-dialog',
  templateUrl: './create-subunit-dialog.component.html',
  styleUrl: './create-subunit-dialog.component.scss',
})
export class CreateSubunitDialogComponent implements OnInit {
  public readonly parentUnitName = this.data.parentUnitName;

  public createForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    ean: new FormControl<number | undefined>(undefined),
    localId: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateSubunitDialogComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { parentUnitUuid: string; parentUnitName: string },
    private store: Store,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.actions$.pipe(ofType(OrganizationUnitActions.createOrganizationSubunitSuccess), first()).subscribe(() => {
      const newSubunitName = this.createForm.controls.name.value;
      this.notificationService.showDefault(`${newSubunitName} ` + $localize`er gemt`);
      this.store.dispatch(OrganizationUnitActions.getOrganizationUnits()); //TODO: Need to update the list of units after succesful create, but this does not seem to the the trick
    });

    this.actions$.pipe(ofType(OrganizationUnitActions.createOrganizationSubunitError), first()).subscribe(() => {
      const newSubunitName = this.createForm.controls.name.value;
      this.notificationService.showError($localize`Fejl! ` + newSubunitName + $localize` kunne ikke oprettes!`);
    });
  }

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
    if (!name) return; //Don't think this is possible, but satisfies the type checker
    this.store.dispatch(
      OrganizationUnitActions.createOrganizationSubunit({
        parentUnitUuid: this.data.parentUnitUuid,
        name,
        ean: ean ?? undefined,
        localId: localId ?? undefined,
      })
    );
  }
}
