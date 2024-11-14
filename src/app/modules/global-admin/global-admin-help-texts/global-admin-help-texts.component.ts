import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { helpTextColumns } from 'src/app/shared/models/global-admin/help-text-columns';
import { HelpText } from 'src/app/shared/models/help-text.model';
import { HelpTextActions } from 'src/app/store/global-admin/help-texts/actions';
import { selectHelpTexts } from 'src/app/store/global-admin/help-texts/selectors';
import { CreateHelpTextDialogComponent } from './create-help-text-dialog/create-help-text-dialog.component';

@Component({
  selector: 'app-global-admin-help-texts',
  templateUrl: './global-admin-help-texts.component.html',
  styleUrl: './global-admin-help-texts.component.scss',
})
export class GlobalAdminHelpTextsComponent implements OnInit {
  public readonly helpTexts$ = this.store.select(selectHelpTexts);
  public readonly columns = helpTextColumns;

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(HelpTextActions.getHelpTexts());
  }

  public onEdit(helpText: HelpText) {}

  public onDelete(helpText: HelpText) {}

  public onClickCreate() {
    this.dialog.open(CreateHelpTextDialogComponent);
  }
}
