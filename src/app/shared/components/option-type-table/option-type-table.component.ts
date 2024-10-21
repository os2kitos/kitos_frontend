import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { BaseComponent } from '../../base/base.component';
import { LocalOptionType, LocalOptionTypeItem } from '../../models/options/local-option-type.model';
import { EditOptionTypeDialogComponent } from './edit-option-type-dialog/edit-option-type-dialog.component';
import { OptionTypeTableComponentStore } from './option-type-table.component-store';
import { LocalOptionTypeActions } from 'src/app/store/local-option-types/actions';
import { filter } from 'rxjs';

@Component({
  selector: 'app-option-type-table',
  templateUrl: './option-type-table.component.html',
  styleUrl: './option-type-table.component.scss',
  providers: [OptionTypeTableComponentStore],
})
export class OptionTypeTableComponent extends BaseComponent implements OnInit {
  @Input() optionType!: LocalOptionType;
  @Input() expandedByDefault: boolean = false;
  @Input() title: string = '';
  @Input() disableAccordion: boolean = false;

  @Input() showWriteAccess: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() showEditButton: boolean = true;

  constructor(
    private componentStore: OptionTypeTableComponentStore,
    private dialog: MatDialog,
    private actions$: Actions
  ) {
    super();
  }

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

  public onEdit(optionType: LocalOptionTypeItem): void {
    const dialogRef = this.dialog.open(EditOptionTypeDialogComponent);
    dialogRef.componentInstance.optionTypeItem = optionType;
    dialogRef.componentInstance.optionType = this.optionType;
  }
}
