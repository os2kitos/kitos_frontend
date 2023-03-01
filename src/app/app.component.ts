import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogCloseResult, DialogService } from '@progress/kendo-angular-dialog';
import { filter, withLatestFrom } from 'rxjs';
import { ChooseOrganizationComponent } from './modules/layout/choose-organization/choose-organization.component';
import { BaseComponent } from './shared/base/base.component';
import { selectOrganizations } from './store/organization/selector';
import { UserActions } from './store/user-store/actions';
import { selectIsAuthenticating, selectUserHasNoOrganization } from './store/user-store/selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseComponent implements OnInit {
  public isAuthenticating$ = this.store.select(selectIsAuthenticating);

  constructor(private store: Store, private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    // Ensure user is part of an organization by either choosen the only organization available to that user or
    // presenting a dialog for the user to decide.
    this.subscriptions.add(
      this.store
        .select(selectOrganizations)
        .pipe(
          withLatestFrom(this.store.select(selectUserHasNoOrganization)),
          filter(([organizations, userHasNoOrganization]) => organizations.length > 0 && !!userHasNoOrganization)
        )
        .subscribe(([organizations]) => {
          if (organizations.length === 1) {
            this.store.dispatch(UserActions.updateOrganization(organizations.pop()));
          } else {
            const dialogRef = this.dialogService.open({
              content: ChooseOrganizationComponent,
              preventAction: (ev) => ev instanceof DialogCloseResult,
            });
            (dialogRef.content.instance as ChooseOrganizationComponent).closable = false;
          }
        })
    );
  }
}
