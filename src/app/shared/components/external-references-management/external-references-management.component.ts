import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from '../../base/base.component';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { ExternalReferencesStoreAdapterService } from '../../services/external-references-store-adapter.service';

export interface ExternalReferenceCommandsViewModel {
  edit: boolean;
  delete: boolean;
}

export interface ExternalReferenceViewModel {
  uuid: string;
  title: string;
  documentId?: string;
  url?: string;
  isMasterReference: boolean;
  commands: ExternalReferenceCommandsViewModel | null;
}

@Component({
  selector: 'app-external-references-management[entityUuid][entityType][hasModifyPermission]',
  templateUrl: './external-references-management.component.html',
  styleUrls: ['./external-references-management.component.scss'],
})
export class ExternalReferencesManagementComponent extends BaseComponent implements OnInit {
  @Input() public entityUuid!: string;
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public hasModifyPermission!: boolean;

  public loading = false;
  public externalReferences: Array<ExternalReferenceViewModel> = [];

  constructor(
    private readonly externalReferencesService: ExternalReferencesStoreAdapterService,
    private readonly confirmationService: ConfirmActionService
  ) {
    super();
  }

  public editReference(referenceUuid: string): void {
    console.log('Edit', referenceUuid);
  }

  public removeReference(referenceUuid: string): void {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne referencen?`,
      onConfirm: () => {
        this.externalReferencesService.dispatchDeleteExternalReference(this.entityType, referenceUuid);
      },
    });
  }

  public createReference(): void {
    console.log('Create new');
  }

  ngOnInit(): void {
    switch (this.entityType) {
      case 'data-processing-registration':
      case 'it-contract':
      case 'it-system':
      case 'it-system-usage':
        //Subscribe to state changes on references
        this.subscriptions.add(
          this.externalReferencesService
            .selectExternalReferences(this.entityType)
            .pipe(
              map((externalReferences) =>
                externalReferences?.map<ExternalReferenceViewModel>((externalReference) => ({
                  uuid: externalReference.uuid ?? '',
                  documentId: externalReference.documentId,
                  title: externalReference.title,
                  url: externalReference.url,
                  isMasterReference: externalReference.masterReference,
                  commands: this.getCommands(externalReference, externalReferences),
                }))
              )
            )
            .subscribe((externalReferences) => {
              if (externalReferences) {
                this.externalReferences = externalReferences;
              }
              this.loading = !externalReferences;
            })
        );
        break;
      default:
        console.error(`Unsupported registration type ${this.entityType}`);
        return;
    }
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
}
