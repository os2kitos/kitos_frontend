import { AfterViewInit, Component } from '@angular/core';
import { BaseFormComponent } from '../../base/base-form.component';

@Component({
  selector: 'app-textarea',
  templateUrl: 'textarea.component.html',
  styleUrls: ['textarea.component.scss'],
})
export class TextAreaComponent extends BaseFormComponent<string> implements AfterViewInit {
  public initialized = false;

  ngAfterViewInit(): void {
    //This fix ensures that cdkTextareaAutosize is ready to perform correct autosizing.
    //Without this delay, the autosizing will not correctly autosize on load (will add additional spacing below the text)
    //Doing it after one js check to prevent violating the angular lifecycle rules
    setTimeout(() => (this.initialized = true));
  }
}
