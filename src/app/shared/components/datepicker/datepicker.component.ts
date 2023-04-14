import { AfterViewInit, Component, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import IMask, { AnyMaskedOptions } from 'imask';
import * as moment from 'moment';
import { BaseFormComponent } from '../../base/base-form.component';

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DatePickerComponent extends BaseFormComponent<Date | undefined> implements AfterViewInit, OnDestroy {
  @Input() public icon?: 'search';
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public pickerAlignmentY: 'above' | 'below' = 'above';
  @Input() override value: Date | undefined = undefined;

  public formDateInputValueChange(event: MatDatepickerInputEvent<moment.Moment, unknown>) {
    const newValue = this.extractDate(event);
    super.formValueChange(newValue);
  }

  private toUtcDate(date: moment.Moment) {
    const converted = new Date(Date.UTC(date.year(), date.month(), date.date(), 0, 0, 0, 0));
    return converted;
  }

  private extractDate(event: MatDatepickerInputEvent<moment.Moment, unknown>): Date | undefined {
    return event.value ? this.toUtcDate(moment(event.value)) : undefined;
  }

  public dateInputChanged(event: MatDatepickerInputEvent<moment.Moment, unknown>) {
    const newValue = this.extractDate(event);
    this.valueChange.emit(newValue);
  }

  private mask?: IMask.InputMask<AnyMaskedOptions>;

  @ViewChild('input', { read: ViewContainerRef }) public input!: ViewContainerRef;

  // Due to issue described here: https://github.com/angular/angular/issues/16755 we have to use native control masking to not conflict with the date picker which also interacts with the input field
  // We use imask which is the up-to-date version of the vanilla-text-mask mentioned in the thread.
  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.mask = IMask(this.input.element.nativeElement, {
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
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
    this.mask?.destroy();
  }
}
