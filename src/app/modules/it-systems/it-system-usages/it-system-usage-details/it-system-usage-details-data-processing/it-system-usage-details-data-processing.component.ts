import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-it-system-usage-details-data-processing',
  templateUrl: './it-system-usage-details-data-processing.component.html',
  styleUrls: ['./it-system-usage-details-data-processing.component.scss']
})
export class ItSystemUsageDetailsDataProcessingComponent {
  constructor(private route: ActivatedRoute, private store: Store) { }
}
