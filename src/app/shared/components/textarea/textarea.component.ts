import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input() public value?: string = '';
  @Output() public valueChange = new EventEmitter<string>();

  private hasChangedSinceLastBlur = false;

  public formValueChange(value: string) {
    this.hasChangedSinceLastBlur = true;
    this.value = value;
  }

  public formBlur() {
    if (!this.hasChangedSinceLastBlur) return;
    this.hasChangedSinceLastBlur = false;

    this.valueChange.emit(this.value);
  }
}
