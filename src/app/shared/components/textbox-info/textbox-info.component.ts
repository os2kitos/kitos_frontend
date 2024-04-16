import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-textbox-info',
  templateUrl: 'textbox-info.component.html',
  styleUrls: ['textbox-info.component.scss'],
})
export class TextBoxInfoComponent {
  @Input() indented: boolean = false;

}
