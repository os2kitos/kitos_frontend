import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from '../constants/constants';

@Directive({
  selector: '[appAfterValueChanged]',
})
export class AfterValueChangedDirective<T> implements OnDestroy {
  @Output()
  public appAfterValueChanged: EventEmitter<T> = new EventEmitter<T>();

  @Input()
  public valueChangeDelay = DEFAULT_INPUT_DEBOUNCE_TIME;

  private stream: Subject<T> = new Subject<T>();
  private subscription: Subscription;

  constructor() {
    this.subscription = this.stream
      .pipe(debounceTime(this.valueChangeDelay))
      .subscribe((value: T) => this.appAfterValueChanged.next(value));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('valueChange', ['$event'])
  public onValueChange(value: T): void {
    this.stream.next(value);
  }
}
