import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/select';
import { BaseFormComponent } from '../../base/base-form.component';
import { InfoIconComponent } from '../icons/info-icon.component';
import { SearchIconComponent } from '../icons/search-icon.component';
import { TrashcanIconComponent } from '../icons/trashcan-icon.component';
import { XIconComponent } from '../icons/x-icon.component';
import { RecommendedBadgeComponent } from '../recommended-badge/recommended-badge.component';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'app-textbox',
  templateUrl: 'textbox.component.html',
  styleUrls: ['textbox.component.scss'],
  imports: [
    MatError,
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
    RecommendedBadgeComponent,
  ],
})
export class TextBoxComponent extends BaseFormComponent<string> {
  @Input() public recommended = false;
  @Input() public clearable = false;
  @Input() public type: 'text' | 'email' | 'password' = 'text';
  @Input() public maxLength = 2000;
  @Input() public icon?: 'search' | 'edit' | 'trashcan';
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public info?: string | null;
  @Input() public isLoading: boolean | null = null;
  @Input() public pattern: string = '';
  @Output() public iconClick = new EventEmitter<void>();

  public hasContent(value: string | null | undefined): boolean {
    return !!value?.trim();
  }

  public onIconClick(): void {
    this.iconClick.emit();
  }
}
