import { AfterViewInit, Component, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import IMask from 'imask';
import { BaseFormComponent } from '../../base/base-form.component';

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

  @ViewChild('input', { read: ViewContainerRef }) public input!: ViewContainerRef;

  override formInputValueChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const newValue = this.convertEventValueToNumber(value);
    super.formValueChange(newValue);
  }

  public inputChanged(value: string) {
    const newValue = this.convertEventValueToNumber(value);
    this.valueChange.emit(newValue);
  }

  public ngAfterViewInit(): void {
    if (!this.disabled && !this.formGroup?.controls[this.formName ?? '']?.disabled) {
      setTimeout(() => {
        IMask(this.input.element.nativeElement, {
          mask: Number,
          //at the moment only supports integers, extend to support other values
          scale: this.getScale(), //x == 0 -> integers, x > 0 -> number of digits after point
          min: this.minLength,
          max: this.maxLength,
        });
      });
    }
  }

  private convertEventValueToNumber(eventValue?: string): number | undefined {
    if (!eventValue) return eventValue as undefined;

    //ensures that no other values than numbers and optionally a coma is not returned
    const onlyNumbersRegex = /[^0-9]/g;

    //at the moment only supports integers, extend to support other values
    const valuesToPreserveRegex = this.numberType === 'integer' ? onlyNumbersRegex : onlyNumbersRegex;
    const newValue = eventValue.replace(valuesToPreserveRegex, '');
    return newValue as unknown as number;
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
