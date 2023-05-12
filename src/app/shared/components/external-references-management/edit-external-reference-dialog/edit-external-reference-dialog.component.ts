import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ExternalReferencesManagmentActions } from 'src/app/store/external-references-management/actions';
import { CreateExternalReferenceDialogComponent } from '../create-external-reference-dialog/create-external-reference-dialog.component';

@Component({
  selector: 'app-edit-external-reference-dialog[initialModel][referenceUuid][entityType][masterReferenceIsReadOnly]',
  templateUrl: './edit-external-reference-dialog.component.html',
  styleUrls: ['./edit-external-reference-dialog.component.scss'],
})
export class EditExternalReferenceDialogComponent extends BaseComponent implements OnInit {
  @Input() public referenceUuid!: string;
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public masterReferenceIsReadOnly!: boolean;
  @Input() public initialModel!: ExternalReferenceProperties;
  public busy = false;
  constructor(
    private readonly dialogRef: MatDialogRef<
      CreateExternalReferenceDialogComponent,
      ExternalReferenceProperties | undefined
    >,
    private readonly actions$: Actions,
    private readonly store: Store
  ) {
    super();
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(ExternalReferencesManagmentActions.editSuccess), first()).subscribe(() => {
        this.dialogRef.close();
      })
    );
    this.subscriptions.add(
      this.actions$.pipe(ofType(ExternalReferencesManagmentActions.editError), first()).subscribe(() => {
        this.busy = false;
      })
    );
  }

  public edit(editedExternalReference: ExternalReferenceProperties) {
    this.busy = true;
    this.store.dispatch(
      ExternalReferencesManagmentActions.edit(this.entityType, this.referenceUuid, editedExternalReference)
    );
  }
  public cancel() {
    this.dialogRef.close();
  }
}
