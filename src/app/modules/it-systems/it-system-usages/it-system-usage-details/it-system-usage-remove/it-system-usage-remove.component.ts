import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectITSystemUsageIsRemoving } from 'src/app/store/it-system-usage/selectors';

@Component({
  templateUrl: 'it-system-usage-remove.component.html',
  styleUrls: ['it-system-usage-remove.component.scss'],
})
export class ITSystemUsageRemoveComponent extends BaseComponent implements OnInit {
  public readonly isRemoving$ = this.store.select(selectITSystemUsageIsRemoving);

  constructor(
    private dialogRef: MatDialogRef<ITSystemUsageRemoveComponent>,
    private store: Store,
    private updates$: Actions,
    private router: Router,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.subscriptions.add(
      // Handle remove IT system usage success
      this.updates$.pipe(ofType(ITSystemUsageActions.removeItSystemUsageSuccess)).subscribe(() => {
        this.dialogRef.close();
        this.notificationService.showDefault($localize`Systemanvendelsen er slettet`);
        this.router.navigate([`/${AppPath.itSystems}/${AppPath.itSystemUsages}`]);
      })
    );
  }

  public cancel() {
    this.dialogRef.close();
  }

  public remove() {
    this.store.dispatch(ITSystemUsageActions.removeItSystemUsage());
  }
}
