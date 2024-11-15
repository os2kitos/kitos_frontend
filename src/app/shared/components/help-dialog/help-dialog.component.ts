import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { CreateHelpTextDialogComponent } from 'src/app/shared/components/dialogs/create-help-text-dialog/create-help-text-dialog.component';
import { EditHelpTextDialogComponent } from 'src/app/shared/components/dialogs/edit-help-text-dialog/edit-help-text-dialog.component';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { HelpDialogComponentStore } from './help-dialog.component-store';

@Component({
  templateUrl: 'help-dialog.component.html',
  styleUrls: ['help-dialog.component.scss'],
  providers: [HelpDialogComponentStore],
})
export class HelpDialogComponent implements OnInit {
  @Input() helpTextKey?: string;

  public readonly helpText$ = this.componentStore.helpText$;
  public readonly isEditable$ = this.componentStore.isEditable$;
  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  constructor(
    private dialogRef: MatDialogRef<HelpDialogComponent>,
    private store: Store,
    private componentStore: HelpDialogComponentStore,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.helpTextKey) {
      this.componentStore.getHelpText(this.helpTextKey);
    }
  }

  public edit() {
    this.helpText$.pipe(first()).subscribe((helpText) => {
      this.dialogRef.close();
      if (!helpText) return;
      const editDialogRef = this.dialog.open(EditHelpTextDialogComponent);
      editDialogRef.componentInstance.helpText = helpText;
    });
  }

  public create() {
    this.dialogRef.close();
    const createDialogRef = this.dialog.open(CreateHelpTextDialogComponent);
    createDialogRef.componentInstance.existingKey = this.helpTextKey;
  }
}
