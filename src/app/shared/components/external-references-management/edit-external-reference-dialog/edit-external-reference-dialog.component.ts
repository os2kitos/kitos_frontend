import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ExternalReferencesStoreAdapterService } from 'src/app/shared/services/external-references-store-adapter.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { CreateExternalReferenceDialogComponent } from '../create-external-reference-dialog/create-external-reference-dialog.component';

@Component({
  selector: 'app-edit-external-reference-dialog[initialModel][referenceUuid][entityType][masterReferenceIsReadOnly]',
  templateUrl: './edit-external-reference-dialog.component.html',
  styleUrls: ['./edit-external-reference-dialog.component.scss'],
})
export class EditExternalReferenceDialogComponent extends BaseComponent {
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
    private readonly storeAdapter: ExternalReferencesStoreAdapterService,
    private readonly actions$: Actions
  ) {
    super();
  }

  public edit(editedExternalReference: ExternalReferenceProperties) {
    this.busy = true;
    //TODO: Move to the adapter and publish events from there
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.patchItSystemUsageSuccess), first()).subscribe(() => {
        this.dialogRef.close();
      })
    );
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.patchItSystemUsageError), first()).subscribe(() => {
        this.busy = false;
      })
    );
    this.storeAdapter.dispatchEditExternalReference(this.entityType, this.referenceUuid, editedExternalReference);
  }
  public cancel() {
    this.dialogRef.close();
  }
}
