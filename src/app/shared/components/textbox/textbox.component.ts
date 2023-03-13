import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TextBoxComponent as KendoTextBoxComponent } from '@progress/kendo-angular-inputs';
import { IconShowOptions } from '@progress/kendo-angular-inputs/textbox/models/icon-show-options';

@Component({
  selector: 'app-textbox',
  templateUrl: 'textbox.component.html',
  styleUrls: ['textbox.component.scss'],
})
export class TextBoxComponent implements AfterViewInit {
  @Input() public text = '';
  @Input() public disabled = false;
  @Input() public clearable = false;
  @Input() public type: 'text' | 'number' | 'email' | 'password' = 'text';
  @Input() public icon?: 'search';
  @Input() public size: 'small' | 'large' = 'large';
  @Input() public info?: string | null;

  @Input() public formGroup?: FormGroup;
  @Input() public formName: string | null = null;
  @Input() public showValidation: IconShowOptions = false;

  @Input() public value?: string | null = '';
  @Output() public valueChange = new EventEmitter<string>();

  @ViewChild('textbox') textbox?: KendoTextBoxComponent;

  ngAfterViewInit() {
    // Kendo TextBoxComponent does not support setting input type, so we need to do it manually
    this.textbox?.input.nativeElement.setAttribute('type', this.type);
  }
}