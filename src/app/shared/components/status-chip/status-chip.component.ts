import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-chip',
  templateUrl: 'status-chip.component.html',
  styleUrls: ['status-chip.component.scss'],
})
export class StatusChipComponent implements OnInit {
  @Input() public type: 'active' | 'available' = 'active';
  @Input() public value?: boolean | null = undefined;
  @Input() public title?: string | null = '';

  public trueString?: string;
  public falseString?: string;

  ngOnInit() {
    switch (this.type) {
      case 'active':
        this.trueString = $localize`Aktivt`;
        this.falseString = $localize`Ikke aktivt`;
        return;
      case 'available':
        this.trueString = $localize`Tilgængeligt`;
        this.falseString = $localize`Ikke tilgængeligt`;
        return;
    }
  }
}
