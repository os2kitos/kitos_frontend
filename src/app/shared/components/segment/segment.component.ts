import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';


export interface SegmentButtonOption<T> {
  text: string;
  value: T;
  dataCy?: string;
}

@Component({
  selector: 'app-segment',
  templateUrl: 'segment.component.html',
  styleUrls: ['segment.component.scss'],
  imports: [MatButtonToggleGroup, MatButtonToggle],
})
export class SegmentComponent<T> {
  @Input() public buttons: SegmentButtonOption<T>[] = [];

  @Input() public selected?: T;
  @Output() selectedChange = new EventEmitter<T>();
}
