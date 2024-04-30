/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { combineLatest } from 'rxjs';
import { APIPaymentResponseDTO } from 'src/app/api/v2';
import { BaseDropdownComponent } from 'src/app/shared/base/base-dropdown.component';

export interface ColorModel {
  name: APIPaymentResponseDTO.AuditStatusEnum;
  id: APIPaymentResponseDTO.AuditStatusEnum;
}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
})
export class ColorPickerComponent extends BaseDropdownComponent<ColorModel | null> implements OnInit, OnChanges {
  @Input() public includeItemDescription = false;
  @Input() public considerCurrentValueObsoleteIfNotPresentInData = true;
  @Input() public searchFn?: (search: string, item: ColorModel) => boolean;
  @Output() public focusEvent = new EventEmitter();
  @Output() public openDropdown = new EventEmitter();

  override ngOnInit() {
    super.ngOnInit();

    // Add obselete value when both value and data are present if data does not contain current form value
    this.subscriptions.add(
      combineLatest([this.formValueSubject$, this.formDataSubject$]).subscribe(([value]) =>
        this.addObsoleteValueIfMissingToData(value)
      )
    );

    if (!this.formName) return;

    // Update value subject to be used in calculating obselete values
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject$.next(value))
    );

    // Push initial values to value and data form subjects
    this.formValueSubject$.next(this.formGroup?.controls[this.formName]?.value);
    this.formDataSubject$.next(this.data ?? []);
  }

  public onFocus() {
    this.focusEvent.emit();
  }

  public onOpen() {
    this.openDropdown.emit();
  }

  private addObsoleteValueIfMissingToData(value?: any) {
    if (this.considerCurrentValueObsoleteIfNotPresentInData) {
      if (this.data && this.formName && this.doesDataContainValue(value)) {
        // Set generated obselete value on the form control
        const obseleteDataOption: ColorModel = {
          ...value,
          [this.textField]: $localize`${value[this.textField]} (udgået)`,
        };
        this.formGroup?.controls[this.formName].setValue(obseleteDataOption, { emitEvent: false });
      }
    }
  }

  private doesDataContainValue(value?: any): boolean {
    if (!this.data || value === undefined || value === null) return false;

    return !this.data.some(
      (option: any) => option[this.valueField] !== undefined && option[this.valueField] === value[this.valueField]
    );
  }
}

/*
  public colorModel = {
    name: APIPaymentResponseDTO.AuditStatusEnum.White,
    id: APIPaymentResponseDTO.AuditStatusEnum.White,
  };
  public colors = [
    { name: APIPaymentResponseDTO.AuditStatusEnum.White, id: APIPaymentResponseDTO.AuditStatusEnum.White },
    { name: APIPaymentResponseDTO.AuditStatusEnum.Green, id: APIPaymentResponseDTO.AuditStatusEnum.Green },
    { name: APIPaymentResponseDTO.AuditStatusEnum.Yellow, id: APIPaymentResponseDTO.AuditStatusEnum.Yellow },
    { name: APIPaymentResponseDTO.AuditStatusEnum.Red, id: APIPaymentResponseDTO.AuditStatusEnum.Red },
  ];
}
 */
