import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contentbox',
  templateUrl: 'contentbox.component.html',
  styleUrls: ['contentbox.component.scss'],
})
export class ContentBoxComponent {
  @Input() public text = '';

  @Input() public formGroup!: FormGroup;
  @Input() public formName: string | null = null;
}
