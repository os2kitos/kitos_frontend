import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsagesComponent } from '../usages/usages.component';

@Component({
  selector: 'app-usage-link',
  standalone: false,
  templateUrl: './usage-link.component.html',
  styleUrl: './usage-link.component.scss'
})
export class UsageLinkComponent {

  constructor(private dialog: MatDialog) {

  }

  @Input () usages: string[] = [];
  @Input () name: string = '';

  onUsageClick(event: Event) {
    event.preventDefault();
    this.dialog.open(UsagesComponent, {
      data: { usages: this.usages, name: this.name }
    });
  }
}
