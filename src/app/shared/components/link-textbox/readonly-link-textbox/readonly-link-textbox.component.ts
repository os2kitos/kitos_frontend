import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/select';

import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';
import { PencilIconComponent } from '../../icons/pencil-icon.compnent';
import { RecommendedBadgeComponent } from '../../recommended-badge/recommended-badge.component';

@Component({
  selector: 'app-readonly-link-textbox',
  templateUrl: './readonly-link-textbox.component.html',
  styleUrl: './readonly-link-textbox.component.scss',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    IconButtonComponent,
    MatSuffix,
    PencilIconComponent,
    RecommendedBadgeComponent,
  ],
})
export class ReadonlyLinkTextboxComponent {
  // Undefined preserves the badge state derived from this field.
  @Input() public recommendedFilled: boolean | undefined;
  @Input() public title!: string;
  @Input() isDisabled = false;
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() recommended: boolean = false;

  @Output() public iconClick = new EventEmitter<void>();

  public onIconClick(): void {
    this.iconClick.emit();
  }
}
