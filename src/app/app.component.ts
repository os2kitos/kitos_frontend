import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { filter, Subscription } from 'rxjs';
import { ChooseOrganizationComponent } from './modules/layout/choose-organization/choose-organization.component';
import { selectUserHasNoOrganization } from './store/user-store/selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  constructor(private store: Store, private dialogService: DialogService) {}

  ngOnInit(): void {
    // Show choose organization dialog if user has no organization
    this.subscriptions.add(
      this.store
        .select(selectUserHasNoOrganization)
        .pipe(filter((userHasNoOrganization) => !!userHasNoOrganization))
        .subscribe(() => this.dialogService.open({ content: ChooseOrganizationComponent }))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
