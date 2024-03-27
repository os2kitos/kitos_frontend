import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  selector: 'app-link-write-dialog',
  templateUrl: './link-write-dialog.component.html',
  styleUrl: './link-write-dialog.component.scss',
})
export class LinkWriteDialogComponent extends BaseComponent implements OnInit {
  @Input() public url$!: Observable<string | undefined>;
  @Output() submitMethod = new EventEmitter();

  public readonly urlForm = new FormGroup({
    url: new FormControl<string | undefined>(undefined),
  });

  constructor(private readonly dialogRef: MatDialogRef<LinkWriteDialogComponent>, private readonly actions$: Actions) {
    super();
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.url$.subscribe((url) => {
        this.urlForm.patchValue({
          url: url,
        });
      })
    );
  }

  onSave() {
    const url = this.urlForm.value.url;

    this.submitMethod.emit(url);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
