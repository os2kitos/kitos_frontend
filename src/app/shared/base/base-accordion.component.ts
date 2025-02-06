import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseComponent } from './base.component';

@Component({
  template: '',
})
export class BaseAccordionComponent extends BaseComponent {
  @Input() public isExpanded$?: Observable<boolean>;
  @Output() public expandedChanged = new EventEmitter<boolean>();

  public onExpandedChanged(expanded: boolean) {
    this.expandedChanged.emit(expanded);
  }
}
