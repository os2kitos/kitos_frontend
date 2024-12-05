import { Component, Input, OnInit } from '@angular/core';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { Observable } from 'rxjs';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { selectGridConfigModificationPermission } from 'src/app/store/user-store/selectors';
import { Store } from '@ngrx/store';
import { ColumnConfigService } from '../../services/column-config.service';

@Component({
  selector: 'app-grid-options-button',
  templateUrl: './grid-options-button.component.html',
  styleUrl: './grid-options-button.component.scss',
})
export class GridOptionsButtonComponent implements OnInit {
  @Input() entityType!: RegistrationEntityTypes;
  @Input() hasResetButton: boolean = false;
  @Input() hasColumnConfigButtons: boolean = false;
  @Input() createPermission$?: Observable<boolean | undefined>;

  public readonly hasConfigGridPermission$ = this.store.select(selectGridConfigModificationPermission);

  public hasChanges$!: Observable<boolean>;

  constructor(private dialog: MatDialog, private store: Store, private columnConfigService: ColumnConfigService) {}

  public ngOnInit(): void {
    this.hasChanges$ = this.columnConfigService.hasChanges(this.entityType);
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
