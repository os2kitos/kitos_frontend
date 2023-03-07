import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-header',
  templateUrl: 'card-header.component.html',
  styleUrls: ['card-header.component.scss'],
})
export class CardHeaderComponent {
  @Input() public title?: string;
  @Input() public spacer = true;
}
