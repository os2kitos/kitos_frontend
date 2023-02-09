import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  templateUrl: 'it-system-details.component.html',
  styleUrls: ['it-system-details.component.scss'],
})
export class ITSystemDetailsComponent {
  public itSystemId$ = this.route.params.pipe(map((params) => params['id']));

  constructor(private route: ActivatedRoute) {}
}
