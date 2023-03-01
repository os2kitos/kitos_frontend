import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export class BaseComponent implements OnDestroy {
  public subscriptions = new Subscription();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
