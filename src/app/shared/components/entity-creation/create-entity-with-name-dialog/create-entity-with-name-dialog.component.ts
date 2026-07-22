import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { BaseCreateEntityDialogComponent } from '../base-create-entity-dialog-component';
import { CreateEntityDialogComponentStore } from '../create-entity-dialog.component-store';
import { DialogComponent } from '../../dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../textbox/textbox.component';
import { AsyncPipe } from '@angular/common';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { CreateEntityDialogActionButtonsComponent } from '../create-entity-dialog-action-buttons/create-entity-dialog-action-buttons.component';

@Component({
  selector: 'app-create-entity-with-name-dialog',
  templateUrl: './create-entity-with-name-dialog.component.html',
  styleUrl: './create-entity-with-name-dialog.component.scss',
  providers: [CreateEntityDialogComponentStore],
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    ParagraphComponent,
    CreateEntityDialogActionButtonsComponent,
    AsyncPipe
],
})
export class CreateEntityWithNameDialogComponent extends BaseCreateEntityDialogComponent implements OnInit {
  public createForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
  });

  @ViewChild('nameInput') nameInput: ElementRef | undefined;

  override ngOnInit(): void {
    super.ngOnInit();

    const control = this.createForm.get('name');

    this.subscriptions.add(
      control?.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
        if (!value) return;

        this.componentStore.checkNameAvailability({ searchObject: { nameEquals: value }, entityType: this.entityType });
      }),
    );
  }

  public createEntity(openAfterCreate: boolean): void {
    const name = this.createForm.controls.name.value;
    if (!name) {
      return;
    }

    switch (this.entityType) {
      case 'it-contract':
        this.store.dispatch(ITContractActions.createItContract(name, openAfterCreate));
        break;
      case 'it-system':
        this.store.dispatch(ITSystemActions.createItSystem(name, openAfterCreate));
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.createDataProcessing(name, openAfterCreate));
        break;
      default:
        throw `Create Entity of type: ${this.entityType} is not implemented`;
    }
  }
}
