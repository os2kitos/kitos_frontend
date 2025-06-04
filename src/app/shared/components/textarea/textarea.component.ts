import { AfterViewInit, Component, Input } from '@angular/core';
import { BaseFormComponent } from '../../base/base-form.component';
import { NgIf, NgClass } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-textarea',
  templateUrl: 'textarea.component.html',
  styleUrls: ['textarea.component.scss'],
  imports: [NgIf, MatFormField, FormsModule, ReactiveFormsModule, MatLabel, MatInput, CdkTextareaAutosize, NgClass],
})
export class TextAreaComponent extends BaseFormComponent<string> implements AfterViewInit {
  @Input() public autosizeMinRows = 4;
  @Input() public autosizeMaxRows = 20;

  public initialized = false;

  ngAfterViewInit(): void {
    //This fix ensures that cdkTextareaAutosize is ready to perform correct autosizing.
    //Without this delay, the autosizing will not correctly autosize on load (will add additional spacing below the text)
    //Doing it after one js check to prevent violating the angular lifecycle rules
    setTimeout(() => (this.initialized = true));
  }
}
