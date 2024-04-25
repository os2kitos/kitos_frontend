import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { BaseComponent } from '../../../base/base.component';

@Component({
  selector: 'app-create-entity-with-name-dialog',
  templateUrl: './create-entity-with-name-dialog.component.html',
  styleUrl: './create-entity-with-name-dialog.component.scss',
})
export class CreateEntityWithNameDialogComponent extends BaseComponent implements OnInit {
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public title!: string;

  public createForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
