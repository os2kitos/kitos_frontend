import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ParagraphComponent } from '../paragraph/paragraph.component';

@Component({
  selector: 'app-number-circle',
  templateUrl: './number-circle.component.html',
  styleUrl: './number-circle.component.scss',
  imports: [NgClass, ParagraphComponent],
})
export class NumberCircleComponent {
  @Input() public number!: number;
}
