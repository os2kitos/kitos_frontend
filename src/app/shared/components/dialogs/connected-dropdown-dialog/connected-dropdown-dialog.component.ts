import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  selector: 'app-connected-dropdown-dialog',
  templateUrl: './connected-dropdown-dialog.component.html',
  styleUrl: './connected-dropdown-dialog.component.scss',
})
export class ConnectedDropdownDialogComponent<T> extends BaseComponent implements OnInit {
  @Input() public title!: string;
  @Input() public dropdownText!: string;
  @Input() public data$!: Observable<T[]>;
  @Input() public isLoading$!: Observable<boolean>;
  @Input() public successActionType!: string;
  @Input() public errorActionType!: string;
  @Input() public nested: boolean = false;
  @Input() public confirmButtonText = $localize`Tilføj`
  @Input() public enableRepeatConfirmWithSameData = false;
  @Input() public description?: string;
  @Output() public save = new EventEmitter<APIIdentityNamePairResponseDTO>();
  @Output() public filterChange = new EventEmitter<string>();

  public dropdownFormGroup = new FormGroup({
    dropdownControl: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined, Validators.required),
  });

  public isBusy = false;

  constructor(
    private readonly actions$: Actions,
    private readonly dialogRef: MatDialogRef<ConnectedDropdownDialogComponent<T>>
  ) {
    super();
  }

  ngOnInit(): void {
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
      if (!this.enableRepeatConfirmWithSameData) this.isBusy = true;
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
