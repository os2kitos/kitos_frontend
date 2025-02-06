import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';

@Component({
  selector: 'app-external-reference-dialog[externalReferenceProperties][title]',
  templateUrl: './external-reference-dialog.component.html',
  styleUrls: ['./external-reference-dialog.component.scss'],
})
export class ExternalReferenceDialogComponent extends BaseComponent implements OnInit {
  @Input() public externalReferenceProperties!: ExternalReferenceProperties;
  public isBusy = false;
  @Input()
  get busy(): boolean {
    return this.isBusy;
  }
  set busy(busy: boolean) {
    this.isBusy = busy;
    if (busy) {
      this.externalReferenceForm.disable();
    } else {
      this.externalReferenceForm.enable();
      if (this.masterReferenceIsReadOnly) {
        this.externalReferenceForm.controls.masterReference.disable();
      }
    }
  }

  @Input() public masterReferenceIsReadOnly = false;
  @Input() public title!: string;
  @Output() public cancelled = new EventEmitter();
  @Output() public saved = new EventEmitter<ExternalReferenceProperties>();

  public readonly externalReferenceForm = new FormGroup(
    {
      title: new FormControl(''),
      documentId: new FormControl<string | undefined>(undefined),
      url: new FormControl<string | undefined>(undefined),
      masterReference: new FormControl<boolean>(false),
    },
    { updateOn: 'change' }
  );

  constructor() {
    super();
  }

  public save() {
    if (this.externalReferenceForm.valid) {
      this.saved.emit({
        masterReference: this.externalReferenceForm.controls.masterReference.value === true,
        title: this.externalReferenceForm.controls.title.value ?? '-',
        documentId: this.externalReferenceForm.controls.documentId.value ?? undefined,
        url: this.externalReferenceForm.controls.url.value ?? undefined,
      });
    }
  }

  public cancel() {
    this.cancelled.emit();
  }

  public ngOnInit(): void {
    this.externalReferenceForm.setValidators(this.createValidator());
    this.externalReferenceForm.patchValue({
      documentId: this.externalReferenceProperties.documentId,
      masterReference: this.externalReferenceProperties.masterReference,
      title: this.externalReferenceProperties.title,
      url: this.externalReferenceProperties.url,
    });
    this.externalReferenceForm.controls.title;
    this.busy = this.isBusy;
  }
  createValidator(): ValidatorFn {
    return (_: AbstractControl) => {
      const docId = this.externalReferenceForm.controls.documentId;
      const url = this.externalReferenceForm.controls.url;
      const title = this.externalReferenceForm.controls.title;

      const controlsWithErrors = Array<AbstractControl>();
      const missingError = { missing: true };
      if (!title.value) {
        controlsWithErrors.push(title);
      } else {
        title.setErrors(null);
      }
      if (!url.value && !docId.value) {
        controlsWithErrors.push(url);
        controlsWithErrors.push(docId);
      } else {
        url.setErrors(null);
        docId.setErrors(null);
      }

      if (controlsWithErrors.length > 0) {
        controlsWithErrors.forEach((control) => control.setErrors(missingError));
        return { incomplete: true };
      }

      return null;
    };
  }
}
