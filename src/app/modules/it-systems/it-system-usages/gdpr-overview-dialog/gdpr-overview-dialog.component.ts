import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridActions } from 'src/app/store/grid/actions';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { OverviewHeaderComponent } from '../../../../shared/components/overview-header/overview-header.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { ExportIconComponent } from '../../../../shared/components/icons/export-icon.component';
import { GdprOverviewComponent } from '../gdpr-overview/gdpr-overview.component';

@Component({
  selector: 'app-gdpr-overview-dialog',
  templateUrl: './gdpr-overview-dialog.component.html',
  styleUrl: './gdpr-overview-dialog.component.scss',
  imports: [DialogComponent, OverviewHeaderComponent, ButtonComponent, ExportIconComponent, GdprOverviewComponent],
})
export class GdprOverviewDialogComponent {
  constructor(private store: Store) {}

  public exportToExcel() {
    this.store.dispatch(GridActions.exportLocalData());
  }
}
