import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridActions } from 'src/app/store/grid/actions';

@Component({
  selector: 'app-gdpr-overview-dialog',
  templateUrl: './gdpr-overview-dialog.component.html',
  styleUrl: './gdpr-overview-dialog.component.scss',
})
export class GdprOverviewDialogComponent {
  constructor(private store: Store) {}

  public exportToExcel() {
    this.store.dispatch(GridActions.exportLocalData());
  }
}
