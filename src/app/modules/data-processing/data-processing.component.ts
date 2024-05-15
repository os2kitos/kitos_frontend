import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, pairwise } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'data-processing.component.html',
  styleUrls: ['data-processing.component.scss'],
})
export class DataProcessingComponent extends BaseComponent implements OnInit {
  constructor(private store: Store, private router: Router) {
    super();
  }
  ngOnInit(): void {
    // Go to DataProcessings and reload when users organization changes
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
            .then(() => this.router.navigate([AppPath.dataProcessing]))
        )
    );
  }
}
