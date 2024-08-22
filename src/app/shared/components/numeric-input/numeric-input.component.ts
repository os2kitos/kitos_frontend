import { AfterViewInit, Component, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import IMask from 'imask';
import { BaseFormComponent } from '../../base/base-form.component';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-numeric-input',
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.scss'],
})
export class NumericInputComponent extends BaseFormComponent<number | undefined> implements AfterViewInit, OnDestroy {
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public minLength = 0;
  @Input() public maxLength = Number.MAX_SAFE_INTEGER;
  @Input() public numberType: 'integer' | undefined = 'integer';
  @Input() public placeholder = $localize`Indtast et heltal`;

  @ViewChild('input', { read: ViewContainerRef }) public input!: ViewContainerRef;
  @ViewChild(MatInput) public matInput!: MatInput;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mask: any;

  override formInputValueChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const newValue = this.convertEventValueToNumber(value);
    super.formValueChange(newValue);
  }

  override clear() {
    this.mask?.updateValue();
    super.clear();
  }

  public inputChanged(value: string) {
    const newValue = this.convertEventValueToNumber(value);
    this.valueChange.emit(newValue);
  }

  public ngAfterViewInit(): void {
    // Due to issue described here: https://github.com/angular/angular/issues/16755 we have to use native control masking to not conflict with the date picker which also interacts with the input field
    // We use imask which is the up-to-date version of the vanilla-text-mask mentioned in the thread.
    setTimeout(() => {
      IMask(this.input.element.nativeElement, {
        mask: this.mask,
        //at the moment only supports integers, extend to support other values
        scale: this.getScale(), //x == 0 -> integers, x > 0 -> number of digits after point
        min: this.minLength,
        max: this.maxLength,
      });
    });
  }

  private convertEventValueToNumber(eventValue?: string): number | undefined {
    if (!eventValue) return eventValue as undefined;

    const valuesToPreserveRegex = this.getNumberCaptureExpression();
    if (valuesToPreserveRegex) {
      const newValue = eventValue.replace(valuesToPreserveRegex, '');
      const valueAsNumber = parseInt(newValue);
      return isNaN(valueAsNumber.valueOf()) ? undefined : valueAsNumber.valueOf();
    } else {
      console.error('Invalid number format:', this.numberType);
      return undefined;
    }
  }

  private getNumberCaptureExpression() {
    switch (this.numberType) {
      case 'integer':
        //ensures that no other values than numbers and optionally a coma is not returned
        return /[^0-9]/g;
      default:
        return null;
    }
  }

  private getScale(): number {
    switch (this.numberType) {
      case 'integer':
        return 0;
      default:
        return 0;
    }
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
