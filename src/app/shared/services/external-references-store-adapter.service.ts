import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, first, of } from 'rxjs';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { ExternalReferencesManagmentActions } from 'src/app/store/external-references-management/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageExternalReferences } from 'src/app/store/it-system-usage/selectors';
import { ExternalReferenceProperties } from '../models/external-references/external-reference-properties.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

@Injectable({
  providedIn: 'root',
})
export class ExternalReferencesStoreAdapterService implements OnDestroy {
  public subscriptions = new Subscription();
  constructor(private readonly store: Store, private readonly actions$: Actions) {}

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public subscribeOnActions() {
    this.subscribeCommandMediators();
  }

  private subscribeCommandMediators() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ExternalReferencesManagmentActions.delete))
        .subscribe((deleteCommand) =>
          this.dispatchDeleteExternalReference(deleteCommand.entityType, deleteCommand.referenceUuid)
        )
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ExternalReferencesManagmentActions.add))
        .subscribe((addCommand) => this.dispatchCreateExternalReference(addCommand.entityType, addCommand.properties))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ExternalReferencesManagmentActions.edit))
        .subscribe((editCommand) =>
          this.dispatchEditExternalReference(editCommand.entityType, editCommand.referenceUuid, editCommand.properties)
        )
    );
  }

  public selectExternalReferences(
    entityType: RegistrationEntityTypes
  ): Observable<Array<APIExternalReferenceDataResponseDTO> | undefined> {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.select(selectItSystemUsageExternalReferences);
      default:
        console.error(`Missing support for entity type:${entityType}`);
        return of([]);
    }
  }

  private dispatchDeleteExternalReference(entityType: RegistrationEntityTypes, referenceUuid: string): void {
    switch (entityType) {
      case 'it-system-usage':
        this.subscriptions.add(
          this.actions$
            .pipe(ofType(ITSystemUsageActions.patchItSystemUsageSuccess), first())
            .subscribe(() =>
              this.store.dispatch(ExternalReferencesManagmentActions.deleteSuccess(entityType, referenceUuid))
            )
        );
        this.subscriptions.add(
          this.actions$
            .pipe(ofType(ITSystemUsageActions.patchItSystemUsageError), first())
            .subscribe(() =>
              this.store.dispatch(ExternalReferencesManagmentActions.deleteError(entityType, referenceUuid))
            )
        );
        return this.store.dispatch(ITSystemUsageActions.removeExternalReference(referenceUuid));
      default:
        console.error(`Missing support for entity type:${entityType}`);
        break;
    }
  }

  private dispatchCreateExternalReference(
    entityType: RegistrationEntityTypes,
    properties: ExternalReferenceProperties
  ): void {
    switch (entityType) {
      case 'it-system-usage':
        this.subscriptions.add(
          this.actions$
            .pipe(ofType(ITSystemUsageActions.patchItSystemUsageSuccess), first())
            .subscribe(() => this.store.dispatch(ExternalReferencesManagmentActions.addSuccess(entityType, properties)))
        );
        this.subscriptions.add(
          this.actions$
            .pipe(ofType(ITSystemUsageActions.patchItSystemUsageError), first())
            .subscribe(() => this.store.dispatch(ExternalReferencesManagmentActions.addError(entityType, properties)))
        );
        return this.store.dispatch(ITSystemUsageActions.addExternalReference(properties));
      default:
        console.error(`Missing support for entity type:${entityType}`);
        break;
    }
  }

  private dispatchEditExternalReference(
    entityType: RegistrationEntityTypes,
    referenceUuid: string,
    properties: ExternalReferenceProperties
  ): void {
    switch (entityType) {
      case 'it-system-usage':
        this.subscriptions.add(
          this.actions$
            .pipe(ofType(ITSystemUsageActions.patchItSystemUsageSuccess), first())
            .subscribe(() =>
              this.store.dispatch(ExternalReferencesManagmentActions.editSuccess(entityType, referenceUuid, properties))
            )
        );
        this.subscriptions.add(
          this.actions$
            .pipe(ofType(ITSystemUsageActions.patchItSystemUsageError), first())
            .subscribe(() =>
              this.store.dispatch(ExternalReferencesManagmentActions.editError(entityType, referenceUuid, properties))
            )
        );
        return this.store.dispatch(ITSystemUsageActions.editExternalReference(referenceUuid, properties));
      default:
        console.error(`Missing support for entity type:${entityType}`);
        break;
    }
  }
}
