import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-grid',
  templateUrl: './form-grid.component.html',
  styleUrls: ['./form-grid.component.scss'],
})
export class FormGridComponent {
  @Input() public formGroup!: FormGroup;
}
