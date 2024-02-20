import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseFormComponent } from '../../base/base-form.component';

@Component({
  selector: 'app-textbox',
  templateUrl: 'textbox.component.html',
  styleUrls: ['textbox.component.scss'],
})
export class TextBoxComponent extends BaseFormComponent<string> {
  @Input() public clearable = false;
  @Input() public type: 'text' | 'email' | 'password' = 'text';
  @Input() public maxLength = 2000;
  @Input() public icon?: 'search' | 'edit' | 'trashcan';
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public info?: string | null;
  @Output() public iconClick = new EventEmitter<void>();

  public onIconClick(): void {
    this.iconClick.emit();
  }
}
