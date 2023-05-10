import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ExternalReferencesStoreAdapterService } from 'src/app/shared/services/external-references-store-adapter.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-create-external-reference-dialog[initialModel][masterReferenceIsReadOnly][registrationEntityType]',
  templateUrl: './create-external-reference-dialog.component.html',
  styleUrls: ['./create-external-reference-dialog.component.scss'],
})
export class CreateExternalReferenceDialogComponent extends BaseComponent {
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

  public create(newExternalReference: ExternalReferenceProperties) {
    this.busy = true;
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
    this.storeAdapter.dispatchCreateExternalReference(this.entityType, newExternalReference);
  }
  public cancel() {
    this.dialogRef.close();
  }
  //TODO: Use the base dialog, react to events from the changes and set "redOnly state while waiting for update"
  //TODO: This  one interacts with the store service and acts on responses!
}
