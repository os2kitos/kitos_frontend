import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, pairwise } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-it-contracts-root',
  templateUrl: './it-contracts-root.component.html',
  styleUrl: './it-contracts-root.component.scss',
})
export class ItContractsRootComponent extends BaseComponent implements OnInit {
  constructor(private store: Store, private router: Router) {
    super();
  }

  ngOnInit() {
    // Go to IT Contracts and reload when users organization changes
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
            .then(() => this.router.navigate([AppPath.itContracts]))
        )
    );

    this.store.dispatch(UIModuleConfigActions.getUIModuleConfig({ module: UIModuleConfigKey.ItContract }));
  }
}
