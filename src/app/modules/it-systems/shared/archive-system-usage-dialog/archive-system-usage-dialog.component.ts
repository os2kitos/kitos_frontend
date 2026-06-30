import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, first, map, startWith } from 'rxjs';
import { APICreateItSystemUsageArchiveRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { IconButtonComponent } from 'src/app/shared/components/buttons/icon-button/icon-button.component';
import { DatePickerComponent } from 'src/app/shared/components/datepicker/datepicker.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ScrollbarDialogComponent } from 'src/app/shared/components/dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { TrashcanIconComponent } from 'src/app/shared/components/icons/trashcan-icon.component';
import { ParagraphComponent } from 'src/app/shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextAreaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import {
  dateGreaterThanOrEqualControlValidator,
  dateLessThanOrEqualControlValidator,
} from 'src/app/shared/helpers/form.helpers';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsage } from 'src/app/store/it-system-usage/selectors';
import { EditUrlSectionComponent } from '../edit-url-section/edit-url-section.component';

@Component({
  selector: 'app-archive-system-usage-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    DialogActionsComponent,
    TextBoxComponent,
    DatePickerComponent,
    TextAreaComponent,
    ButtonComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    EditUrlSectionComponent,
    ScrollbarDialogComponent,
    ParagraphComponent,
  ],
  templateUrl: './archive-system-usage-dialog.component.html',
  styleUrl: './archive-system-usage-dialog.component.scss',
})
export class ArchiveSystemUsageDialogComponent extends BaseComponent implements OnInit {
  @Input() public itSystemUsageUuid!: string;

  public archiveFormGroup = new FormGroup({
    takenIntoUsageDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    archivingDate: new FormControl<Date | undefined>(undefined, Validators.required),
    referenceName: new FormControl<string | undefined>(undefined),
    note: new FormControl<string | undefined>(undefined, Validators.required),
    archiveReferences: new FormArray([this.createReferenceFormGroup()]),
  });

  public itSystemUsage$ = this.store.select(selectItSystemUsage).pipe(filterNullish(), first());

  constructor(
    private readonly store: Store,
    public dialogRef: MatDialogRef<ArchiveSystemUsageDialogComponent>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectItSystemUsage)
      .pipe(first())
      .subscribe((usage) => {
        if (!usage) {
          this.store.dispatch(ITSystemUsageActions.getITSystemUsage(this.itSystemUsageUuid));
        }
      });
    this.setupDateValidators();
    this.setTakenIntoUsageDate();
  }

  private setTakenIntoUsageDate() {
    this.subscriptions.add(
      this.itSystemUsage$.subscribe((itSystemUsage) => {
        const takenIntoUsageDateControl = this.archiveFormGroup.controls.takenIntoUsageDate;
        if (itSystemUsage.createdAt) {
          takenIntoUsageDateControl.setValue(new Date(itSystemUsage.createdAt));
        }
      }),
    );
  }

  private setupDateValidators() {
    const controls = this.archiveFormGroup.controls;
    controls.archivingDate.addValidators(dateGreaterThanOrEqualControlValidator(controls.takenIntoUsageDate));
    controls.archivingDate.updateValueAndValidity();
    controls.takenIntoUsageDate.addValidators(dateLessThanOrEqualControlValidator(controls.archivingDate));
    controls.takenIntoUsageDate.updateValueAndValidity();
  }

  public get archiveReferences() {
    return this.archiveFormGroup.controls.archiveReferences;
  }

  public addReference() {
    this.archiveReferences.push(this.createReferenceFormGroup());
  }

  public hasDateOrderValidationError() {
    const takenIntoUsageControl = this.archiveFormGroup.controls.takenIntoUsageDate;
    if (!takenIntoUsageControl.value) return false;

    const archivingDateControl = this.archiveFormGroup.controls.archivingDate;
    const archivingDateError = archivingDateControl.value && archivingDateControl.invalid;

    return takenIntoUsageControl.invalid || archivingDateError;
  }

  public formIsInvalid() {
    return this.archiveFormGroup.invalid;
  }

  public removeReference(index: number) {
    if (this.archiveReferences.length <= 1) return;
    this.archiveReferences.removeAt(index);
  }

  public onReferenceUpdated(index: number, simpleLink: SimpleLink | null) {
    const reference = this.archiveReferences.at(index);
    reference.patchValue({
      name: simpleLink?.name || undefined,
      url: simpleLink?.url || undefined,
    });
  }

  public getReferenceObservable$(index: number): Observable<SimpleLink | undefined> {
    const reference = this.archiveReferences.at(index);
    return reference.valueChanges.pipe(
      startWith(reference.value),
      map(
        ({ name, url }) =>
          ({
            name: name || undefined,
            url: url || undefined,
          }) as SimpleLink,
      ),
    );
  }

  public canRemoveReference(): boolean {
    return this.archiveReferences.length > 1;
  }

  public isAddReferenceDisabled() {
    return this.archiveReferences.controls.some((reference) => !reference.value.url);
  }

  onConfirm(): void {
    if (!this.archiveFormGroup.valid) return;
    const controls = this.archiveFormGroup.controls;

    const validArchiveReferences = this.archiveReferences.controls
      .map((referenceControl) => {
        const reference = referenceControl.controls;
        const name = reference.name.value || '';
        const url = reference.url.value || '';
        return { name, url };
      })
      .filter(({ name, url }) => Boolean(name.trim() || url.trim()));

    const dto: APICreateItSystemUsageArchiveRequestDTO = {
      archivingDate: this.toISOStringOrEmptyString(controls.archivingDate?.value),
      takenIntoUsageDate: this.toISOStringOrEmptyString(controls.takenIntoUsageDate?.value),
      referenceName: controls.referenceName.value || '',
      note: controls.note.value || '',
      archiveReferences: validArchiveReferences,
    };

    this.store.dispatch(ITSystemUsageActions.archiveItSystemUsage(this.itSystemUsageUuid, dto));
    this.dialogRef.close();
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  private toISOStringOrEmptyString(date: Date | undefined | null): string {
    return date ? date.toISOString() : '';
  }

  private createReferenceFormGroup() {
    return new FormGroup({
      name: new FormControl<string | undefined>(undefined),
      url: new FormControl<string | undefined>(undefined),
    });
  }
}
