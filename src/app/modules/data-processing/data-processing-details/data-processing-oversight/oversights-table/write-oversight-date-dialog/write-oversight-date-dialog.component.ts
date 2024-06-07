import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIOversightDateDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { selectDataProcessingOversightDates } from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-write-oversight-date-dialog',
  templateUrl: './write-oversight-date-dialog.component.html',
  styleUrl: './write-oversight-date-dialog.component.scss',
})
export class WriteOversightDateDialogComponent extends BaseComponent implements OnInit {
  @Input() public oversightDate: APIOversightDateDTO | undefined;

  public oversightDateFormGroup = new FormGroup({
    date: new FormControl<Date | undefined>(undefined, Validators.required),
    notes: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<WriteOversightDateDialogComponent>,
    private actions$: Actions
  ) {
    super();
  }

  public isBusy = false;
  public isEdit = false;
  public title = 'Tilføj tilsyn';

  ngOnInit(): void {
    if (this.oversightDate?.uuid) {
      this.isEdit = true;
      this.title = 'Rediger tilsyn';

      this.oversightDateFormGroup.patchValue({
        date: optionalNewDate(this.oversightDate.completedAt),
        notes: this.oversightDate.remark,
      });
    }

    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingSuccess)).subscribe(() => {
        this.onCancel();
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingError)).subscribe(() => {
        this.isBusy = false;
      })
    );
  }

  public onSave() {
    if (this.oversightDateFormGroup.invalid) {
      return;
    }

    this.isBusy = true;

    const request: APIOversightDateDTO = {
      completedAt: this.oversightDateFormGroup.value.date!.toISOString(),
      remark: this.oversightDateFormGroup.value.notes ?? '',
    };

    this.store
      .select(selectDataProcessingOversightDates)
      .pipe(first())
      .subscribe((oversightDates) => {
        if (this.isEdit) {
          this.store.dispatch(
            DataProcessingActions.patchDataProcessingOversightDate(
              { ...request, uuid: this.oversightDate?.uuid },
              oversightDates
            )
          );
        } else {
          this.store.dispatch(DataProcessingActions.addDataProcessingOversightDate(request, oversightDates));
        }
      });
  }

  public onCancel() {
    this.dialogRef.close();
  }
}
