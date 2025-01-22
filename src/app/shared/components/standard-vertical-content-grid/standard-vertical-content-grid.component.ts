import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-standard-vertical-content-grid',
  templateUrl: './standard-vertical-content-grid.component.html',
  styleUrls: ['./standard-vertical-content-grid.component.scss'],
})
export class StandardVerticalContentGridComponent {
  @Input() numColumns = 1;
  @Input() withGap = true;
}
