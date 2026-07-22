import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from '../../buttons/button/button.component';
import { DropdownComponent } from '../../dropdowns/dropdown/dropdown.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ConnectedDropdownDialogComponent } from '../connected-dropdown-dialog/connected-dropdown-dialog.component';
import { DialogActionsComponent } from '../dialog-actions/dialog-actions.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-dropdown-dialog',
  templateUrl: './dropdown-dialog.component.html',
  styleUrl: './dropdown-dialog.component.scss',
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    DropdownComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
    ParagraphComponent
],
})
export class DropdownDialogComponent<T> extends BaseComponent implements OnInit {
  @Input() public title!: string;
  @Input() public description?: string;
  @Input() public bulletPoints?: string[];
  @Input() public dropdownText!: string;
  @Input() public data$!: Observable<T[]>;
  @Input() public valueField = 'value';
  @Input() public textField = 'name';
  @Input() public successActionType!: string;
  @Input() public errorActionType!: string;
  @Input() public onOpen?: () => void | undefined = undefined;
  @Output() public save = new EventEmitter<T>();
  @Output() public filterChange = new EventEmitter<string>();

  public dropdownFormGroup = new FormGroup({
    dropdownControl: new FormControl<T | undefined>(undefined, Validators.required),
  });

  public isBusy = false;

  constructor(
    private readonly actions$: Actions,
    private readonly dialogRef: MatDialogRef<ConnectedDropdownDialogComponent<T>>
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.onOpen) this.onOpen();

    this.actions$.pipe(ofType(this.successActionType)).subscribe(() => {
      this.dialogRef.close();
    });
    this.actions$.pipe(ofType(this.errorActionType)).subscribe(() => {
      this.isBusy = false;
    });
  }

  public onSearch(search?: string) {
    this.filterChange.emit(search);
  }

  public onSave() {
    if (this.dropdownFormGroup.valid) {
      this.isBusy = true;
      const value = this.dropdownFormGroup.value.dropdownControl;
      if (!value) {
        this.isBusy = false;
        return;
      }

      this.save.emit(value);
    }
  }

  public onCancel() {
    this.dialogRef.close();
  }
}
