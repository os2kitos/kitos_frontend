import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ExternalReferencesManagmentActions } from 'src/app/store/external-references-management/actions';

@Component({
  selector: 'app-create-external-reference-dialog[initialModel][masterReferenceIsReadOnly][entityType]',
  templateUrl: './create-external-reference-dialog.component.html',
  styleUrls: ['./create-external-reference-dialog.component.scss'],
})
export class CreateExternalReferenceDialogComponent extends BaseComponent implements OnInit {
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
      this.actions$.pipe(ofType(ExternalReferencesManagmentActions.addSuccess), first()).subscribe(() => {
        this.dialogRef.close();
      })
    );
    this.subscriptions.add(
      this.actions$.pipe(ofType(ExternalReferencesManagmentActions.addError), first()).subscribe(() => {
        this.busy = false;
      })
    );
  }

  public create(newExternalReference: ExternalReferenceProperties) {
    this.busy = true;

    this.store.dispatch(ExternalReferencesManagmentActions.add(this.entityType, newExternalReference));
  }
  public cancel() {
    this.dialogRef.close();
  }
}
