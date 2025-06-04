import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';
import { PencilIconComponent } from '../../icons/pencil-icon.compnent';

@Component({
  selector: 'app-readonly-link-textbox',
  templateUrl: './readonly-link-textbox.component.html',
  styleUrl: './readonly-link-textbox.component.scss',
  imports: [MatFormField, MatLabel, MatInput, NgIf, IconButtonComponent, MatSuffix, PencilIconComponent],
})
export class ReadonlyLinkTextboxComponent {
  @Input() public title!: string;
  @Input() isDisabled = false;
  @Input() public size: 'medium' | 'large' = 'large';

  @Output() public iconClick = new EventEmitter<void>();

  public onIconClick(): void {
    this.iconClick.emit();
  }
}
