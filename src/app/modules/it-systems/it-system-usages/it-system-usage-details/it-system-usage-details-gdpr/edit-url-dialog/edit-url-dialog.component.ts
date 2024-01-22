import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
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
    if (!this.directoryDocumentationForm.valid) return;

    const name = this.directoryDocumentationForm.value.name;
    const url = this.directoryDocumentationForm.value.url;

    this.store.dispatch(ITSystemUsageActions.patchItSystemUsage(
      { gdpr: { directoryDocumentation: { name: (name ? name : ''), url: (url ? url: '') } } }))
    this.dialogRef.close()
    }

  onCancel() {
    this.dialogRef.close();
  }

  saveIsEnabled() {
    const formContent = this.directoryDocumentationForm.value;
    return (formContent.name
        && formContent.url)
      || (!formContent.name
        && !formContent.url);
  }

}
