import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { TextBoxComponent as KendoTextBoxComponent } from '@progress/kendo-angular-inputs';
import { IconShowOptions } from '@progress/kendo-angular-inputs/textbox/models/icon-show-options';
import { BaseFormComponent } from '../../base/base-form.component';

@Component({
  selector: 'app-textbox',
  templateUrl: 'textbox.component.html',
  styleUrls: ['textbox.component.scss'],
})
export class TextBoxComponent extends BaseFormComponent<string> implements AfterViewInit {
  @Input() public clearable = false;
  @Input() public type: 'text' | 'number' | 'email' | 'password' = 'text';
  @Input() public maxLength = 2000;
  @Input() public icon?: 'search';
  @Input() public size: 'small' | 'large' = 'large';
  @Input() public info?: string | null;

  @Input() public showValidation: IconShowOptions = false;

  @ViewChild('textbox') textbox?: KendoTextBoxComponent;

  ngAfterViewInit() {
    // Kendo TextBoxComponent does not support setting input type, so we need to do it manually
    this.textbox?.input.nativeElement.setAttribute('type', this.type);
  }
}
