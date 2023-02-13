import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TextBoxComponent as KendoTextBoxComponent } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-textbox',
  templateUrl: 'textbox.component.html',
  styleUrls: ['textbox.component.scss'],
})
export class TextBoxComponent implements AfterViewInit {
  @Input() public text = '';
  @Input() public disabled = false;
  @Input() public type: 'text' | 'email' | 'password' = 'text';

  @Input() public formGroup!: FormGroup;
  @Input() public formName: string | null = null;

  @ViewChild('textbox') textbox?: KendoTextBoxComponent;

  ngAfterViewInit() {
    // Kendo TextBoxComponent does not support setting input type, so we need to do it manually
    this.textbox?.input.nativeElement.setAttribute('type', this.type);
  }
}
