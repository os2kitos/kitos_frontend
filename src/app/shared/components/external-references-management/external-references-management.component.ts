import { Component, Input, OnInit } from '@angular/core';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from '../../base/base.component';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
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

  constructor(private readonly externalReferencesService: ExternalReferencesStoreAdapterService) {
    super();
  }

  ngOnInit(): void {
    switch (this.entityType) {
      case 'data-processing-registration':
      case 'it-contract':
      case 'it-system':
      case 'it-system-usage':
        //Add published data
        this.subscriptions.add(
          this.externalReferencesService.selectExternalReferences(this.entityType).subscribe((externalReferences) => {
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
}
