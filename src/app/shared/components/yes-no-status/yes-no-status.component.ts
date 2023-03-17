import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-yes-no-status',
  templateUrl: './yes-no-status.component.html',
  styleUrls: ['./yes-no-status.component.scss'],
})
export class YesNoStatusComponent implements OnInit {
  public statusText?: string;
  @Input() public status?: boolean;

  ngOnInit(): void {
    if (this.status !== undefined) {
      this.statusText = this.status ? $localize`Ja` : $localize`Nej`;
    }
  }
}
