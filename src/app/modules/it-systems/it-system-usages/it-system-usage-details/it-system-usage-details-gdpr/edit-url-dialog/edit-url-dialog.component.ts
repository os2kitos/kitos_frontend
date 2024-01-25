import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-edit-url-dialog',
  templateUrl: './edit-url-dialog.component.html',
  styleUrls: ['./edit-url-dialog.component.scss'],
})
export class EditUrlDialogComponent extends BaseComponent implements OnInit {
  @Input() simpleLink?: SimpleLink | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() submitMethod!: EventEmitter<any>;

  public readonly simpleLinkForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    url: new FormControl<string | undefined>(undefined, Validators.required),
  });

  public isBusy = false;

  constructor(
    private readonly dialogRef: MatDialogRef<EditUrlDialogComponent>,
    private readonly store: Store,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.simpleLink) {
      this.simpleLinkForm.patchValue({
        name: this.simpleLink.name,
        url: this.simpleLink.url,
      });
    }

    //on success close the dialog
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageSuccess), first())
        .subscribe(() => this.dialogRef.close())
    );

    //on error set isBusy to false
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.patchItSystemUsageError)).subscribe(() => {
        this.isBusy = false;
      })
    );
  }

  onSave() {
    if (!this.simpleLinkForm.valid) return;
    const name = this.simpleLinkForm.value.name;
    const url = this.simpleLinkForm.value.url;
    if (!url || !name) return;

    this.isBusy = true;

    this.submitMethod.emit({ name: name, url: url });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
