import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { KLEActions } from 'src/app/store/kle/actions';
import {
  selectAdminKleChangesDownloaded,
  selectAdminKleIsLoading,
  selectAdminKleStatus,
} from 'src/app/store/kle/selectors';

@Component({
  selector: 'app-global-admin-other-kle',
  templateUrl: './global-admin-other-kle.component.html',
  styleUrl: './global-admin-other-kle.component.scss',
})
export class GlobalAdminOtherKleComponent extends BaseComponent implements OnInit {
  public readonly kleStatus$ = this.store.select(selectAdminKleStatus);
  public readonly isLoading$ = this.store.select(selectAdminKleIsLoading);
  public readonly changesDownloaded$ = this.store.select(selectAdminKleChangesDownloaded);

  constructor(private readonly store: Store, private readonly actions$: Actions) {
    super();
  }

  ngOnInit(): void {
    this.dispatchGetKleStatus();

    this.subscriptions.add(
      this.actions$.pipe(ofType(KLEActions.updateAdminKLESuccess)).subscribe(() => {
        this.dispatchGetKleStatus();
      })
    );
  }

  public updateKle() {
    this.store.dispatch(KLEActions.updateAdminKLE());
  }

  public downloadKleChanges() {
    this.store.dispatch(KLEActions.getAdminKLEFile());
  }

  private dispatchGetKleStatus() {
    this.store.dispatch(KLEActions.getAdminKLEStatus());
  }
}
