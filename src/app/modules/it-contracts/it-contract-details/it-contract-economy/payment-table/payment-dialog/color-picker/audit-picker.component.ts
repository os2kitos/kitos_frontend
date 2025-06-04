/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { APIPaymentResponseDTO } from 'src/app/api/v2';
import { BaseDropdownComponent } from 'src/app/shared/base/base-dropdown.component';
import { AuditModel, baseAuditStatusValue } from 'src/app/shared/models/it-contract/audit-model';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent, NgOptionTemplateDirective } from '@ng-select/ng-select';
import { ColorCircleComponent } from '../../../color-circle/color-circle.component';

@Component({
  selector: 'app-audit-picker',
  templateUrl: './audit-picker.component.html',
  styleUrl: './audit-picker.component.scss',
  imports: [NgIf, FormsModule, ReactiveFormsModule, NgSelectComponent, NgOptionTemplateDirective, ColorCircleComponent],
})
export class AuditPickerComponent extends BaseDropdownComponent<AuditModel | null> implements OnInit, OnChanges {
  @Output() public openDropdown = new EventEmitter();

  override valueField = 'id';

  override data = [
    baseAuditStatusValue,
    { name: $localize`Opfylder standarderne`, id: APIPaymentResponseDTO.AuditStatusEnum.Green },
    { name: $localize`Mindre forbedringer påkrævet`, id: APIPaymentResponseDTO.AuditStatusEnum.Yellow },
    { name: $localize`Væsentlige forbedringer nødvendige`, id: APIPaymentResponseDTO.AuditStatusEnum.Red },
  ];

  override ngOnInit() {
    super.ngOnInit();

    if (!this.formName) return;

    // Update value subject to be used in calculating obselete values
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject$.next(value)),
    );

    // Push initial values to value and data form subjects
    this.formValueSubject$.next(this.formGroup?.controls[this.formName]?.value);
    this.formDataSubject$.next(this.data ?? []);
  }

  public onOpen() {
    this.openDropdown.emit();
  }
}
