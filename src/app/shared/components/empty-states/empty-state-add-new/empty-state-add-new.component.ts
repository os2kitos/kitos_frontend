import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state-add-new[name]',
  templateUrl: './empty-state-add-new.component.html',
  styleUrls: ['./empty-state-add-new.component.scss'],
})
export class EmptyStateAddNewComponent {
  @Input() public name = '';
}
