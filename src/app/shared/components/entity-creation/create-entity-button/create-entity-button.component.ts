import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { CreateEntityWithNameDialogComponent } from '../create-entity-with-name-dialog/create-entity-with-name-dialog.component';

@Component({
  selector: 'app-create-entity-button',
  templateUrl: './create-entity-button.component.html',
  styleUrl: './create-entity-button.component.scss',
})
export class CreateEntityButtonComponent extends BaseComponent implements OnInit {
  @Input() public entityType!: RegistrationEntityTypes;

  public createTitle!: string;

  constructor(private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    switch (this.entityType) {
      case 'it-contract':
        this.createTitle = $localize`Opret IT Kontrakt`;
        break;
      case 'it-system':
        this.createTitle = $localize`Opret IT System`;
        break;
      case 'it-interface':
        this.createTitle = $localize`Opret Snitflade`;
        break;
      case 'data-processing-registration':
        this.createTitle = $localize`Opret Registering`;
        break;
      default:
        throw `Entity type ${this.entityType} not supported.`;
    }
  }

  public openCreateDialog() {
    const dialogRef = this.dialog.open(CreateEntityWithNameDialogComponent);
    const dialogInstance = dialogRef.componentInstance as CreateEntityWithNameDialogComponent;
    dialogInstance.entityType = this.entityType;
    dialogInstance.title = this.createTitle;
  }
}
