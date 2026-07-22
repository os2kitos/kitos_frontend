import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { BaseComponent } from '../../../../base/base.component';
import { IdentityNamePair } from '../../../../models/identity-name-pair.model';
import { RegistrationEntityTypes } from '../../../../models/registrations/registration-entity-categories.model';
import { IconButtonComponent } from '../../../buttons/icon-button/icon-button.component';
import { ContentSpaceBetweenComponent } from '../../../content-space-between/content-space-between.component';
import { ScrollbarDialogComponent } from '../../../dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { ArrowRightIconComponent } from '../../../icons/arrow-right-icon.component';
import { NativeTableComponent } from '../../../native-table/native-table.component';
import { ParagraphComponent } from '../../../paragraph/paragraph.component';
import { GridUsagesDropdownDialogComponent } from '../grid-usages-dropdown-dialog/grid-usages-dropdown-dialog.component';
import { GridUsagesDialogComponentStore } from './grid-usages-dialog.component-store';

@Component({
  selector: 'app-usages',
  templateUrl: './grid-usages-dialog.component.html',
  styleUrls: ['./grid-usages-dialog.component.scss'],
  providers: [GridUsagesDialogComponentStore],
  imports: [
    ScrollbarDialogComponent,
    NativeTableComponent,
    ContentSpaceBetweenComponent,
    ParagraphComponent,
    IconButtonComponent,
    ArrowRightIconComponent,
    AsyncPipe
],
})
export class GridUsagesDialogComponent extends BaseComponent implements OnInit {
  @Input() type!: RegistrationEntityTypes | undefined;
  @Input() rowEntityIdentifier!: string | undefined;
  @Input() usingOrganizations!: IdentityNamePair[];
  @Input() title!: string;

  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);
  public readonly canExecuteMigration$ = this.componentStore.canExecuteMigration$;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly componentStore: GridUsagesDialogComponentStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.componentStore.getMigrationPermissions();
  }

  public isItSystemDialog(): boolean {
    return this.type === 'it-system';
  }

  public clickMigrateUsage($event: IdentityNamePair) {
    if (!this.rowEntityIdentifier) throw new Error('Row entity identifier is missing');
    const dialogRef = this.dialog.open(GridUsagesDropdownDialogComponent, {
      width: '700px',
    });
    const componentInstance = dialogRef.componentInstance;
    componentInstance.usingOrganization = $event;
    componentInstance.rowEntityIdentifier = this.rowEntityIdentifier;
  }
}
