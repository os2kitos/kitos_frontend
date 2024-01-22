import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-edit-url-dialog',
  templateUrl: './edit-url-dialog.component.html',
  styleUrls: ['./edit-url-dialog.component.scss']
})
export class EditUrlDialogComponent extends BaseComponent implements OnInit{


  public readonly directoryDocumentationForm = new FormGroup(
    {
      name: new FormControl<string | undefined>(undefined),
      url: new FormControl<string | undefined>(undefined),
  })

  constructor(
    private readonly dialogRef: MatDialogRef<EditUrlDialogComponent>,
    private readonly store: Store
  ) {
    super()
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store
      .select(selectItSystemUsageGdpr)
      .pipe(filterNullish())
      .subscribe((gdpr) => {
          this.directoryDocumentationForm.patchValue({
            name: gdpr.directoryDocumentation?.name,
            url: gdpr.directoryDocumentation?.url
          })
      })
    )
  }

  onSave() {
      console.log('todo send form content')
  }

  onCancel() {
    this.dialogRef.close();
  }
}
