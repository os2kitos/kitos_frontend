import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { skip } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganization } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'it-systems.component.html',
  styleUrls: ['it-systems.component.scss'],
})
export class ITSystemsComponent extends BaseComponent implements OnInit {
  constructor(private store: Store, private router: Router) {
    super();
  }

  ngOnInit() {
    // Go to IT Systems and reload when organization changes
    this.subscriptions.add(
      this.store
        .select(selectOrganization)
        .pipe(filterNullish(), skip(1))
        .subscribe(() => {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate(['/it-systems']));
        })
    );
  }
}
