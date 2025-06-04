import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/select';
import { BaseFormComponent } from '../../base/base-form.component';
import { InfoIconComponent } from '../icons/info-icon.component';
import { SearchIconComponent } from '../icons/search-icon.component';
import { TrashcanIconComponent } from '../icons/trashcan-icon.component';
import { XIconComponent } from '../icons/x-icon.component';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'app-textbox',
  templateUrl: 'textbox.component.html',
  styleUrls: ['textbox.component.scss'],
  imports: [
    NgIf,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatProgressSpinner,
    MatSuffix,
    SearchIconComponent,
    MatPrefix,
    TrashcanIconComponent,
    XIconComponent,
    TooltipComponent,
    InfoIconComponent,
  ],
})
export class TextBoxComponent extends BaseFormComponent<string> {
  @Input() public clearable = false;
  @Input() public type: 'text' | 'email' | 'password' = 'text';
  @Input() public maxLength = 2000;
  @Input() public icon?: 'search' | 'edit' | 'trashcan';
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public info?: string | null;
  @Input() public isLoading: boolean | null = null;
  @Input() public pattern: string = '';
  @Output() public iconClick = new EventEmitter<void>();

  public onIconClick(): void {
    this.iconClick.emit();
  }
}
