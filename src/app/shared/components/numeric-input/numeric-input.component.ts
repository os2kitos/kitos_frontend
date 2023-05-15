import { AfterViewInit, Component, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import IMask from 'imask';
import { BaseFormComponent } from '../../base/base-form.component';
import { INT_MAX_VALUE } from '../../constants';

@Component({
  selector: 'app-numeric-input',
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.scss'],
})
export class NumericInputComponent extends BaseFormComponent<number | undefined> implements AfterViewInit, OnDestroy {
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public minLength = 0;
  @Input() public maxLength = INT_MAX_VALUE;
  @Input() public numberType: 'integer' | undefined = 'integer';

  @ViewChild('input', { read: ViewContainerRef }) public input!: ViewContainerRef;

  override formInputValueChange(event: Event) {
    const newValue = this.convertEventValueToNumber(event);
    super.formValueChange(newValue);
  }

  public inputChanged(event: Event) {
    const newValue = this.convertEventValueToNumber(event);
    this.valueChange.emit(newValue);
  }

  public ngAfterViewInit(): void {
    if (!this.disabled && !this.formGroup?.controls[this.formName ?? '']?.disabled) {
      setTimeout(() => {
        IMask(this.input.element.nativeElement, {
          mask: Number,
          scale: this.numberType === 'integer' ? 0 : 0,
          min: this.minLength,
          max: this.maxLength,
        });
      });
    }
  }

  private convertEventValueToNumber(event: Event): number {
    let value = (event.target as HTMLInputElement).value;
    //ensures that no other values than numbers and optionally a coma is not returned
    const valuesToPreserveRegex = this.numberType === 'integer' ? /[^0-9]/g : /[^0-9,]/g;
    value = value.replace(valuesToPreserveRegex, '');
    return value as unknown as number;
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
