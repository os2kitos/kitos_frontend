import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appAfterValueChanged]',
})
export class AfterValueChangedDirective implements OnDestroy {
  @Output()
  public appAfterValueChanged: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  public valueChangeDelay = 300;

  private stream: Subject<string> = new Subject<string>();
  private subscription: Subscription;

  constructor() {
    this.subscription = this.stream
      .pipe(debounceTime(this.valueChangeDelay))
      .subscribe((value: string) => this.appAfterValueChanged.next(value));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('valueChange', ['$event'])
  public onValueChange(value: string): void {
    this.stream.next(value);
  }
}
