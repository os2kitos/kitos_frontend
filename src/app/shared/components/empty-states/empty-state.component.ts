import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state[text][context]',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() public text = '';
  @Input() public context!: 'emptyTable' | 'searchResult' | 'emptyUpdate';
}
