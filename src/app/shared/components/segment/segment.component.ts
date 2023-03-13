import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SegmentButtonOption<T> {
  text: string;
  value: T;
}

@Component({
  selector: 'app-segment',
  templateUrl: 'segment.component.html',
  styleUrls: ['segment.component.scss'],
})
export class SegmentComponent<T> {
  @Input() public buttons: SegmentButtonOption<T>[] = [];

  @Input() public selected?: T;
  @Output() selectedChange = new EventEmitter<T>();
}
