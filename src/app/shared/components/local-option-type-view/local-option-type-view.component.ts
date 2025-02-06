import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs';
import { LocalOptionTypeActions } from 'src/app/store/local-admin/local-option-types/actions';
import { BaseComponent } from '../../base/base.component';
import { NON_EDITABLE_LOCAL_OPTION_TYPE_CATEGORY_HELP_TEXT } from '../../constants/constants';
import { LocalAdminOptionType, LocalAdminOptionTypeItem } from '../../models/options/local-admin-option-type.model';
import { EditLocalOptionTypeDialogComponent } from './edit-local-option-type-dialog/edit-local-option-type-dialog.component';
import { LocalOptionTypeTableComponentStore } from './local-option-type-table.component-store';

@Component({
  selector: 'app-local-option-type-view',
  templateUrl: './local-option-type-view.component.html',
  styleUrl: './local-option-type-view.component.scss',
  providers: [LocalOptionTypeTableComponentStore],
})
export class LocalOptionTypeViewComponent extends BaseComponent implements OnInit {
  @Input() optionType!: LocalAdminOptionType;
  @Input() expandedByDefault: boolean = false;
  @Input() title: string = '';
  @Input() disableAccordion: boolean = false;
  @Input() scrollable: 'scrollable' | 'virtual' | 'none' = 'scrollable';
  @Input() fitSizeToContent = true;

  @Input() showWriteAccess: boolean = false;
  @Input() showDescription: boolean = true;
  @Input() showEditButton: boolean = true;

  constructor(
    private componentStore: LocalOptionTypeTableComponentStore,
    private dialog: MatDialog,
    private actions$: Actions
  ) {
    super();
  }

  public readonly onlyEditableByGlobalAdminText = NON_EDITABLE_LOCAL_OPTION_TYPE_CATEGORY_HELP_TEXT;

  public readonly optionTypeItems$ = this.componentStore.optionTypeItems$;
  public readonly isLoading$ = this.componentStore.isLoading$;

  public ngOnInit(): void {
    this.componentStore.setState({ isLoading: false, optionTypeItems: [], type: this.optionType });
    this.componentStore.getOptionTypeItems();

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(LocalOptionTypeActions.updateOptionTypeSuccess),
          filter(({ optionType }) => optionType === this.optionType)
        )
        .subscribe(() => {
          this.componentStore.getOptionTypeItems();
        })
    );
  }

  public onEdit(optionType: LocalAdminOptionTypeItem): void {
    const dialogRef = this.dialog.open(EditLocalOptionTypeDialogComponent);
    dialogRef.componentInstance.optionTypeItem = optionType;
    dialogRef.componentInstance.optionType = this.optionType;
  }
}
