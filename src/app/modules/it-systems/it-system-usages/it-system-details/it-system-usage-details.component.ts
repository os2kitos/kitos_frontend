import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  templateUrl: 'it-system-usage-details.component.html',
  styleUrls: ['it-system-usage-details.component.scss'],
})
export class ITSystemUsageDetailsComponent {
  public itSystemId$ = this.route.params.pipe(map((params) => params['id']));

  constructor(private route: ActivatedRoute) {}
}
