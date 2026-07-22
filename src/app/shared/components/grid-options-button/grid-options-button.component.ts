import { Component, Input } from '@angular/core';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { Observable } from 'rxjs';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { selectGridConfigModificationPermission } from 'src/app/store/user-store/selectors';
import { Store } from '@ngrx/store';
import { ColumnConfigService } from '../../services/column-config.service';
import { MenuButtonComponent } from '../buttons/menu-button/menu-button.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';
import { GridFilterButtonsComponent } from './grid-filter-buttons/grid-filter-buttons.component';
import { AsyncPipe } from '@angular/common';
import { DividerComponent } from '../divider/divider.component';
import { GridColumnConfigButtonsComponent } from './grid-column-config-buttons/grid-column-config-buttons.component';
import { ResetToOrgColumnsConfigButtonComponent } from '../reset-to-org-columns-config-button/reset-to-org-columns-config-button.component';
import { MenuButtonItemComponent } from '../buttons/menu-button/menu-button-item/menu-button-item.component';
import { HelpIconComponent } from '../icons/help.component';

@Component({
  selector: 'app-grid-options-button',
  templateUrl: './grid-options-button.component.html',
  styleUrl: './grid-options-button.component.scss',
  imports: [
    MenuButtonComponent,
    ParagraphComponent,
    GridFilterButtonsComponent,
    DividerComponent,
    GridColumnConfigButtonsComponent,
    ResetToOrgColumnsConfigButtonComponent,
    MenuButtonItemComponent,
    HelpIconComponent,
    AsyncPipe
],
})
export class GridOptionsButtonComponent {
  @Input() entityType!: RegistrationEntityTypes;
  @Input() hasResetButton: boolean = false;
  @Input() hasColumnConfigButtons: boolean = false;
  @Input() createPermission$?: Observable<boolean | undefined>;

  public readonly hasConfigGridPermission$ = this.store.select(selectGridConfigModificationPermission);

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private columnConfigService: ColumnConfigService,
  ) {}

  public hasChanges$(): Observable<boolean> {
    return this.columnConfigService.hasChanges(this.entityType);
  }

  public getHelpTextKey(): string | undefined {
    switch (this.entityType) {
      case 'it-system-usage':
        return 'it-system.overview';
      case 'it-system':
        return 'it-system.catalog';
      case 'it-interface':
        return 'it-system.interfaceCatalog';
      case 'it-contract':
        return 'it-contract.overview';
      case 'data-processing-registration':
        return 'data-processing.overview';
      case 'organization-user':
        return 'organization.user';
      default:
        return undefined;
    }
  }

  public openHelpTextDialog() {
    const dialogRef = this.dialog.open(HelpDialogComponent, { maxHeight: '90vh', height: 'auto' });
    (dialogRef.componentInstance as HelpDialogComponent).helpTextKey = this.getHelpTextKey();
  }
}
