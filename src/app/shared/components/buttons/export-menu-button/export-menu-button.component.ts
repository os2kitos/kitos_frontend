import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GdprOverviewDialogComponent } from 'src/app/modules/it-systems/it-system-usages/gdpr-overview-dialog/gdpr-overview-dialog.component';
import { selectITSystemUsageEnableGdpr } from 'src/app/store/organization/ui-module-customization/selectors';
import { ExportIconComponent } from '../../icons/export-icon.component';
import { LockIconComponent } from '../../icons/lock-icon.component';
import { MenuButtonItemComponent } from '../menu-button/menu-button-item/menu-button-item.component';
import { MenuButtonComponent } from '../menu-button/menu-button.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-export-menu-button',
  templateUrl: './export-menu-button.component.html',
  styleUrl: './export-menu-button.component.scss',
  imports: [MenuButtonComponent, MenuButtonItemComponent, ExportIconComponent, LockIconComponent, AsyncPipe],
})
export class ExportMenuButtonComponent {
  @Input() exportMethod!: (exportAllColumns: boolean) => void;
  @Input() showColumnsOnlyOption = true;
  @Input() enabledGdprExport = false;
  @Input() anyOverviewFiltersApplied$!: Observable<boolean>;
  @Input() entityText!: string;

  constructor(private dialog: MatDialog, private store: Store) {
  }

  public readonly gdprEnabled$ = this.store.select(selectITSystemUsageEnableGdpr);

  triggerMethod(exportAllColumns: boolean): void {
    if (this.exportMethod) {
      this.exportMethod(exportAllColumns);
    }
  }

  public openGdprOverview(): void {
    const dialogRef = this.dialog.open(GdprOverviewDialogComponent, { width: '90%', height: '95%' });
    dialogRef.componentInstance.anyOverviewFiltersApplied$ = this.anyOverviewFiltersApplied$;
    dialogRef.componentInstance.entityText = this.entityText;
  }
}
