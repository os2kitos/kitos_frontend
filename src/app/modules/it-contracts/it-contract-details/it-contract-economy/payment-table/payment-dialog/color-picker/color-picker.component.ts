/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { APIPaymentResponseDTO } from 'src/app/api/v2';
import { BaseDropdownComponent } from 'src/app/shared/base/base-dropdown.component';

export interface ColorModel {
  name: string;
  id: APIPaymentResponseDTO.AuditStatusEnum;
}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
})
export class ColorPickerComponent extends BaseDropdownComponent<ColorModel | null> implements OnInit, OnChanges {
  @Output() public openDropdown = new EventEmitter();

  override data = [
    { name: $localize`Audit ikke gennemført`, id: APIPaymentResponseDTO.AuditStatusEnum.White },
    { name: $localize`Opfylder standarderne`, id: APIPaymentResponseDTO.AuditStatusEnum.Green },
    { name: $localize`Mindre forbedringer påkrævet`, id: APIPaymentResponseDTO.AuditStatusEnum.Yellow },
    { name: $localize`Væsentlige forbedringer nødvendige`, id: APIPaymentResponseDTO.AuditStatusEnum.Red },
  ];

  override ngOnInit() {
    super.ngOnInit();

    if (!this.formName) return;

    // Update value subject to be used in calculating obselete values
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject$.next(value))
    );

    // Push initial values to value and data form subjects
    this.formValueSubject$.next(this.formGroup?.controls[this.formName]?.value);
    this.formDataSubject$.next(this.data ?? []);
  }

  public onOpen() {
    this.openDropdown.emit();
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
