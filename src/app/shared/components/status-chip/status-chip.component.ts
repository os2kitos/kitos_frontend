import { Component, Input, OnInit } from '@angular/core';
import { EntityStatusCategories } from '../../models/status/entity-status-categories.model';
import { EntityStatusTextsService } from '../../services/entity-status-texts.service';

@Component({
  selector: 'app-status-chip',
  templateUrl: 'status-chip.component.html',
  styleUrls: ['status-chip.component.scss'],
})
export class StatusChipComponent implements OnInit {
  @Input() public type: EntityStatusCategories | undefined;
  @Input() public value?: boolean | null = undefined;
  @Input() public title?: string | null = '';

  public trueString?: string;
  public falseString?: string;

  constructor(private readonly statusService: EntityStatusTextsService) {}

  ngOnInit() {
    if (this.type) {
      const texts = this.statusService.map(this.type);
      this.trueString = texts.trueString;
      this.falseString = texts.falseString;
    } else {
      console.error('type not provided');
    }
  }
}
