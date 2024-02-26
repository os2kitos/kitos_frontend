import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { ExternalReferencesManagmentActions } from 'src/app/store/external-references-management/actions';
import { BaseComponent } from '../../base/base.component';
import { ExternalReferenceCommandsViewModel } from '../../models/external-references/external-reference-commands-view.model';
import { ExternalReferenceViewModel } from '../../models/external-references/external-reference-view.model';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { ExternalReferencesStoreAdapterService } from '../../services/external-references-store-adapter.service';
import { CreateExternalReferenceDialogComponent } from './create-external-reference-dialog/create-external-reference-dialog.component';
import { EditExternalReferenceDialogComponent } from './edit-external-reference-dialog/edit-external-reference-dialog.component';

@Component({
  selector: 'app-external-references-management[entityType][hasModifyPermission]',
  templateUrl: './external-references-management.component.html',
  styleUrls: ['./external-references-management.component.scss'],
})
export class ExternalReferencesManagementComponent extends BaseComponent implements OnInit {
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public hasModifyPermission!: boolean;

  public loading = false;
  public externalReferences: Array<ExternalReferenceViewModel> = [];

  constructor(
    private readonly externalReferencesService: ExternalReferencesStoreAdapterService,
    private readonly confirmationService: ConfirmActionService,
    private readonly dialogService: MatDialog,
    private readonly store: Store
  ) {
    super();
  }

  public editReference(externalReference: ExternalReferenceViewModel): void {
    const createDialogComponent = this.dialogService.open(EditExternalReferenceDialogComponent).componentInstance;
    const enforceLockedMaster = this.shouldEnforceMaster(externalReference);
    createDialogComponent.entityType = this.entityType;
    createDialogComponent.masterReferenceIsReadOnly = enforceLockedMaster;
    createDialogComponent.initialModel = {
      ...externalReference,
      masterReference: enforceLockedMaster,
    };
    createDialogComponent.referenceUuid = externalReference.uuid;
  }

  private shouldEnforceMaster(externalReference?: ExternalReferenceViewModel) {
    const noMaster = this.externalReferences.filter((x) => x.masterReference).length === 0;
    const enforceLockedMaster = externalReference?.masterReference || noMaster;
    return enforceLockedMaster;
  }

  public removeReference(referenceUuid: string): void {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne referencen?`,
      onConfirm: () => {
        this.store.dispatch(ExternalReferencesManagmentActions.delete(this.entityType, referenceUuid));
      },
    });
  }

  public createReference(): void {
    const createDialogComponent = this.dialogService.open(CreateExternalReferenceDialogComponent).componentInstance;
    const enforceLockedMaster = this.shouldEnforceMaster();
    createDialogComponent.entityType = this.entityType;
    createDialogComponent.masterReferenceIsReadOnly = enforceLockedMaster;
    createDialogComponent.initialModel = {
      title: $localize`Læs mere`,
      masterReference: enforceLockedMaster,
    };
  }

  ngOnInit(): void {
    this.subscribeToExternalReferences();
  }

  getCommands(
    externalReference: APIExternalReferenceDataResponseDTO,
    allReferences: Array<APIExternalReferenceDataResponseDTO>
  ): ExternalReferenceCommandsViewModel | null {
    if (!this.hasModifyPermission) return null;
    return {
      edit: true,
      delete: !externalReference.masterReference || allReferences.length === 1,
    };
  }

  private subscribeToExternalReferences() {
    //Subscribe to state changes on references
    this.subscriptions.add(
      this.externalReferencesService
        .selectExternalReferences(this.entityType)
        .pipe(
          map((externalReferences) =>
            externalReferences
              ?.map<ExternalReferenceViewModel>((externalReference) => ({
                uuid: externalReference.uuid ?? '',
                documentId: externalReference.documentId,
                title: externalReference.title,
                url: externalReference.url,
                masterReference: externalReference.masterReference,
                commands: this.getCommands(externalReference, externalReferences),
              }))
              .sort((a, b) => a.title.localeCompare(b.title))
          )
        )
        .subscribe((externalReferences) => {
          if (externalReferences) {
            this.externalReferences = externalReferences;
          }
          this.loading = !externalReferences;
        })
    );
  }
}
