import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { APIJournalPeriodResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-it-system-usage-details-journal-period-write-dialog',
  templateUrl: './it-system-usage-details-journal-period-write-dialog.component.html',
  styleUrls: ['./it-system-usage-details-journal-period-write-dialog.component.scss'],
})
export class ItSystemUsageDetailsJournalPeriodWriteDialogComponent extends BaseComponent implements OnInit {
  @Input() public journalPeriod?: APIJournalPeriodResponseDTO | undefined;

  public readonly journalPeriodForm = new FormGroup({
    startDate: new FormControl<Date | undefined>(undefined, Validators.required),
    endDate: new FormControl<Date | undefined>(undefined, Validators.required),
    archiveId: new FormControl<string | undefined>(undefined, Validators.required),
    approved: new FormControl<boolean>(false),
  });

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialogRef<ItSystemUsageDetailsJournalPeriodWriteDialogComponent>,
    private readonly actions$: Actions
  ) {
    super();
  }

  public isEdit = false;
  public saveText = $localize`Opret`;
  public isBusy = false;

  ngOnInit(): void {
    if (this.journalPeriod) {
      this.isEdit = true;
      this.saveText = $localize`Gem`;
      this.journalPeriodForm.patchValue({
        startDate: new Date(this.journalPeriod.startDate),
        endDate: new Date(this.journalPeriod.endDate),
        archiveId: this.journalPeriod.archiveId,
        approved: this.journalPeriod.approved,
      });
    }

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageJournalPeriodError,
            ITSystemUsageActions.patchItSystemUsageJournalPeriodError
          )
        )
        .subscribe(() => {
          this.isBusy = false;
        })
    );
  }

  public onSave() {
    if (!this.journalPeriodForm.valid) return;

    this.isBusy = true;

    if (!this.isEdit) {
      this.store.dispatch(
        ITSystemUsageActions.addItSystemUsageJournalPeriod({
          startDate: this.journalPeriodForm.value.startDate?.toISOString() as string,
          endDate: this.journalPeriodForm.value.endDate?.toISOString() as string,
          archiveId: this.journalPeriodForm.value.archiveId as string,
          approved: this.journalPeriodForm.value.approved as boolean,
        })
      );
    } else {
      this.store.dispatch(
        ITSystemUsageActions.patchItSystemUsageJournalPeriod(this.journalPeriod?.uuid as string, {
          startDate: this.journalPeriodForm.value.startDate?.toISOString() as string,
          endDate: this.journalPeriodForm.value.endDate?.toISOString() as string,
          archiveId: this.journalPeriodForm.value.archiveId as string,
          approved: this.journalPeriodForm.value.approved as boolean,
        })
      );
    }

    this.dialog.close();
  }

  public onCancel() {
    this.dialog.close();
  }
}
