import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridActions } from 'src/app/store/grid/actions';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { OverviewHeaderComponent } from '../../../../shared/components/overview-header/overview-header.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { ExportIconComponent } from '../../../../shared/components/icons/export-icon.component';
import { GdprOverviewComponent } from '../gdpr-overview/gdpr-overview.component';
import { ParagraphComponent } from 'src/app/shared/components/paragraph/paragraph.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { InfoIconComponent } from 'src/app/shared/components/icons/info-icon.component';

@Component({
  selector: 'app-gdpr-overview-dialog',
  templateUrl: './gdpr-overview-dialog.component.html',
  styleUrl: './gdpr-overview-dialog.component.scss',
  imports: [DialogComponent, OverviewHeaderComponent, ButtonComponent, ExportIconComponent, GdprOverviewComponent, ParagraphComponent, AsyncPipe, InfoIconComponent],
})
export class GdprOverviewDialogComponent {
  @Input() anyOverviewFiltersApplied$!: Observable<boolean>;
  @Input() entityText!: string;

  constructor(private store: Store) {
  }

  public exportToExcel() {
    this.store.dispatch(GridActions.exportLocalData());
  }
}
