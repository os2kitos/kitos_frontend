import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, pairwise } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'organization.component.html',
  styleUrls: ['organization.component.scss'],
  selector: 'app-organization',
})
export class OrganizationComponent extends BaseComponent implements OnInit {
  constructor(private store: Store, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .select(selectOrganizationUuid)
        .pipe(
          pairwise(),
          filter(([prevUuid, nextUuid]) => prevUuid !== nextUuid)
        )
        .subscribe(() =>
          this.router
            .navigateByUrl(AppPath.root, { skipLocationChange: true })
            .then(() => this.router.navigate([AppPath.organization]))
        )
    );
  }
}
