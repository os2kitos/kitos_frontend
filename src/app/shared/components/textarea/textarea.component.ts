import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { BaseFormComponent } from '../../base/base-form.component';
import { RecommendedBadgeComponent } from '../recommended-badge/recommended-badge.component';

@Component({
  selector: 'app-textarea',
  templateUrl: 'textarea.component.html',
  styleUrls: ['textarea.component.scss'],
  imports: [
    MatError,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    CdkTextareaAutosize,
    NgClass,
    RecommendedBadgeComponent,
  ],
})
export class TextAreaComponent extends BaseFormComponent<string> implements AfterViewInit {
  // Undefined preserves the badge state derived from this field.
  @Input() public recommendedFilled: boolean | undefined;
  @Input() public recommended = false;
  @Input() public autosizeMinRows = 4;
  @Input() public autosizeMaxRows = 20;

  public initialized = false;

  public hasContent(value: string | null | undefined): boolean {
    return !!value?.trim();
  }

  ngAfterViewInit(): void {
    //This fix ensures that cdkTextareaAutosize is ready to perform correct autosizing.
    //Without this delay, the autosizing will not correctly autosize on load (will add additional spacing below the text)
    //Doing it after one js check to prevent violating the angular lifecycle rules
    setTimeout(() => (this.initialized = true));
  }
}
