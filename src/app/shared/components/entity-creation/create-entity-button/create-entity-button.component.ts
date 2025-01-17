import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateInterfaceDialogComponent } from 'src/app/modules/it-systems/it-system-interfaces/create-interface-dialog/create-interface-dialog.component';
import { CreateUserDialogComponent } from 'src/app/modules/organization/organization-users/create-user-dialog/create-user-dialog.component';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { CreateEntityWithNameDialogComponent } from '../create-entity-with-name-dialog/create-entity-with-name-dialog.component';

@Component({
  selector: 'app-create-entity-button',
  templateUrl: './create-entity-button.component.html',
  styleUrl: './create-entity-button.component.scss',
})
export class CreateEntityButtonComponent extends BaseComponent {
  @Input() public entityType!: RegistrationEntityTypes;

  constructor(private dialog: MatDialog) {
    super();
  }

  private getCreateTitle(): string {
    switch (this.entityType) {
      case 'it-contract':
        return $localize`Opret IT Kontrakt`;
      case 'it-system':
        return $localize`Opret IT System`;
      case 'it-interface':
        return $localize`Opret Snitflade`;
      case 'data-processing-registration':
        return $localize`Opret Registering`;
      case 'organization-user':
        return $localize`Opret Bruger`;
      default:
        throw `Entity type ${this.entityType} not supported.`;
    }
  }

  public openCreateDialog() {
    console.log('Test');
    switch (this.entityType) {
      case 'it-interface':
        this.dialog.open(CreateInterfaceDialogComponent);
        break;
      case 'organization-user':
        this.dialog.open(CreateUserDialogComponent, { height: '95%', maxHeight: '750px' });
        break;
      default: {
        const dialogRef = this.dialog.open(CreateEntityWithNameDialogComponent);
        const dialogInstance = dialogRef.componentInstance as CreateEntityWithNameDialogComponent;
        dialogInstance.entityType = this.entityType;
        dialogInstance.title = this.getCreateTitle();
      }
    }
  }
}
