import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GdprOverviewDialogComponent } from 'src/app/modules/it-systems/it-system-usages/gdpr-overview-dialog/gdpr-overview-dialog.component';
import { selectITSystemUsageEnableGdpr } from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  selector: 'app-export-menu-button',
  templateUrl: './export-menu-button.component.html',
  styleUrl: './export-menu-button.component.scss',
})
export class ExportMenuButtonComponent {
  @Input() exportMethod!: (exportAllColumns: boolean) => void;
  @Input() showColumnsOnlyOption = true;
  @Input() enabledGdprExport = false;

  constructor(private dialog: MatDialog, private store: Store) {}

  public readonly gdprEnabled$ = this.store.select(selectITSystemUsageEnableGdpr);

  triggerMethod(exportAllColumns: boolean): void {
    if (this.exportMethod) {
      this.exportMethod(exportAllColumns);
    }
  }

  public openGdprOverview(): void {
    this.dialog.open(GdprOverviewDialogComponent, { width: '90%', height: '90%', maxHeight: '1200px' });
  }
}
