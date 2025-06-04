import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-grid',
  templateUrl: './form-grid.component.html',
  styleUrls: ['./form-grid.component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class FormGridComponent {
  @Input() public formGroup!: FormGroup;
}
