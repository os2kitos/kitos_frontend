import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-standard-vertical-content-grid',
  templateUrl: './standard-vertical-content-grid.component.html',
  styleUrls: ['./standard-vertical-content-grid.component.scss'],
  imports: [NgClass],
})
export class StandardVerticalContentGridComponent {
  @Input() numColumns = 1;
  @Input() withGap = true;
  @Input() gapSize: 'small' | 'medium' | 'large' = 'medium';
}
