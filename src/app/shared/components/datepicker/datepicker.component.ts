import { NgIf } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule, provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDatepickerToggleIcon,
} from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/select';
import IMask from 'imask';
import { BaseFormComponent } from '../../base/base-form.component';

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,

    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,

    MatDatepickerInput,
    MatDatepickerToggle,

    MatSuffix,
    MatDatepickerToggleIcon,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  providers: [
    provideMomentDateAdapter(),
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['DD-MM-yyyy', 'DDMMyyyy'],
        },
        display: {
          dateInput: 'DD-MM-yyyy',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})
export class DatePickerComponent extends BaseFormComponent<Date | undefined> implements AfterViewInit, OnDestroy {
  @Input() public icon?: 'search';
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public pickerAlignmentY: 'above' | 'below' = 'above';
  @Input() override value: Date | undefined = undefined;

  public formDateInputValueChange(event: MatDatepickerInputEvent<moment.Moment, unknown>) {
    const newValue = this.extractDate(event);
    super.formValueChange(newValue);
    this.mask?.updateValue();
  }

  private toLocaleUtcDate(date: moment.Moment) {
    const thisDate = date.utc(true);
    const converted = new Date(thisDate.year(), thisDate.month(), thisDate.date(), 0, 0, 0);
    return converted;
  }

  private extractDate(event: MatDatepickerInputEvent<moment.Moment, unknown>): Date | undefined {
    const result = event.value ? this.toLocaleUtcDate(event.value) : undefined;
    return result;
  }

  public dateInputChanged(event: MatDatepickerInputEvent<moment.Moment, unknown>) {
    const newValue = this.extractDate(event);
    this.valueChange.emit(newValue);
    this.mask?.updateValue();
  }

  private mask?: InstanceType<typeof IMask.InputMask>;

  @ViewChild('input', { read: ViewContainerRef }) public input!: ViewContainerRef;

  // Due to issue described here: https://github.com/angular/angular/issues/16755 we have to use native control masking to not conflict with the date picker which also interacts with the input field
  // We use imask which is the up-to-date version of the vanilla-text-mask mentioned in the thread.
  public ngAfterViewInit(): void {
    setTimeout(() => {
      const element = this.input?.element;
      if (element) {
        this.mask = IMask(element.nativeElement, {
          lazy: true,
          mask: 'DD-MM-YYYY',
          blocks: {
            DD: {
              mask: IMask.MaskedRange,
              from: 1,
              to: 31,
            },
            MM: {
              mask: IMask.MaskedRange,
              from: 1,
              to: 12,
            },
            YYYY: {
              mask: IMask.MaskedRange,
              from: 1900,
              to: 4000,
            },
          },
        });
      }
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
    this.mask?.destroy();
  }
}
