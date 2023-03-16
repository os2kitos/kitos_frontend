import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-chip',
  templateUrl: 'status-chip.component.html',
  styleUrls: ['status-chip.component.scss'],
})
export class StatusChipComponent implements OnInit {
  @Input() public type: 'it-system-usage' | 'it-system' | 'data-processing-registration' | 'it-contract' | undefined;
  @Input() public value?: boolean | null = undefined;
  @Input() public title?: string | null = '';

  public trueString?: string;
  public falseString?: string;

  ngOnInit() {
    if (this.type) {
      switch (this.type) {
        case 'it-system-usage':
          this.trueString = $localize`Aktivt`;
          this.falseString = $localize`Ikke aktivt`;
          return;
        case 'it-system':
          this.trueString = $localize`Tilgængeligt`;
          this.falseString = $localize`Ikke tilgængeligt`;
          return;
        case 'data-processing-registration':
          this.trueString = $localize`Aktiv`;
          this.falseString = $localize`Ikke aktiv`;
          return;
        case 'it-contract':
          this.trueString = $localize`Gyldig`;
          this.falseString = $localize`Ikke gyldig`;
          return;
      }
    } else {
      console.error('type not provided');
    }
  }
}
