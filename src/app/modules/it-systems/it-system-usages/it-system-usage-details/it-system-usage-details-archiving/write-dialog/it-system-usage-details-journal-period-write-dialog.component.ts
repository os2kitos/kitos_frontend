import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
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

    //on success close the dialog
    this.actions$
      .pipe(
        ofType(
          ITSystemUsageActions.addItSystemUsageJournalPeriodSuccess,
          ITSystemUsageActions.patchItSystemUsageJournalPeriodSuccess
        ),
        first()
      )
      .subscribe(() => this.dialog.close());

    //on error set isBusy to false
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

    const startDate = this.journalPeriodForm.value.startDate?.toISOString();
    const endDate = this.journalPeriodForm.value.endDate?.toISOString();
    const archiveId = this.journalPeriodForm.value.archiveId;
    const approved = this.journalPeriodForm.value.approved ?? false;

    if (!startDate || !endDate || !archiveId) return;

    this.isBusy = true;

    const request = {
      startDate: startDate,
      endDate: endDate,
      archiveId: archiveId,
      approved: approved,
    };

    if (!this.isEdit) {
      this.store.dispatch(ITSystemUsageActions.addItSystemUsageJournalPeriod(request));
      return;
    }

    if (!this.journalPeriod?.uuid) return;
    this.store.dispatch(ITSystemUsageActions.patchItSystemUsageJournalPeriod(this.journalPeriod?.uuid, request));
  }

  public onCancel() {
    this.dialog.close();
  }
}
