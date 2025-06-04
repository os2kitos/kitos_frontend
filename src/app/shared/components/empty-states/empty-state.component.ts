import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { AddProgramIconComponent } from '../icons/add-program-icon.component';
import { EmptySearchIconComponent } from '../icons/empty-search-icon.component';
import { EmptyUpdateIconComponent } from '../icons/empty-update-icon.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';

@Component({
  selector: 'app-empty-state[text][context]',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  imports: [NgIf, AddProgramIconComponent, EmptySearchIconComponent, EmptyUpdateIconComponent, ParagraphComponent],
})
export class EmptyStateComponent {
  @Input() public text = '';
  @Input() public context!: 'emptyTable' | 'searchResult' | 'emptyUpdate';
}
