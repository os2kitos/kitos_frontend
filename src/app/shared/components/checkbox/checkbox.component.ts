import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input() public text = '';
  @Input() public disabled = false;

  @Input() public formGroup!: FormGroup;
  @Input() public formName: string | null = null;
}
