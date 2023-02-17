import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: 'textarea.component.html',
  styleUrls: ['textarea.component.scss'],
})
export class TextAreaComponent {
  @Input() public text = '';

  @Input() public formGroup!: FormGroup;
  @Input() public formName: string | null = null;
}
