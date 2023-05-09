import { Component, Input, OnInit } from '@angular/core';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from '../../base/base.component';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { ExternalReferencesStoreAdapterService } from '../../services/external-references-store-adapter.service';

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
  public externalReferences: Array<APIExternalReferenceDataResponseDTO> = [];
  public allowRemoveMasterReference = true;

  constructor(
    private readonly externalReferencesService: ExternalReferencesStoreAdapterService,
    private readonly confirmationService: ConfirmActionService
  ) {
    super();
  }

  public editReference(referenceUuid: string): void {
    throw new Error('Method not implemented.');
  }

  public removeReference(referenceUuid?: string): void {
    //TODO: Do not allow removing the master reference if there are more than one available
    if (referenceUuid) {
      this.confirmationService.confirmAction({
        category: ConfirmActionCategory.Warning,
        message: $localize`Er du sikker på at du vil fjerne referencen?`,
        onConfirm: () => {
          this.externalReferencesService.dispatchDeleteExternalReference(this.entityType, referenceUuid);
        },
      });
    }
  }

  public createReference(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    switch (this.entityType) {
      case 'data-processing-registration':
      case 'it-contract':
      case 'it-system':
      case 'it-system-usage':
        //Subscribe to state changes on references
        this.subscriptions.add(
          this.externalReferencesService.selectExternalReferences(this.entityType).subscribe((externalReferences) => {
            if (externalReferences) {
              this.externalReferences = externalReferences;
            }
            //TODO: Change to add a vm to each reference where available commands are exposed
            this.allowRemoveMasterReference = this.externalReferences?.length === 1;
            this.loading = !externalReferences;
          })
        );
        break;
      default:
        console.error(`Unsupported registration type ${this.entityType}`);
        return;
    }
  }
}
