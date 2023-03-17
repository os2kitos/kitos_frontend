import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { AppPath } from '../../enums/app-path';
import { HelpDialogComponentStore } from './help-dialog.component-store';

@Component({
  templateUrl: 'help-dialog.component.html',
  styleUrls: ['help-dialog.component.scss'],
  providers: [HelpDialogComponentStore],
})
export class HelpDialogComponent implements OnInit {
  @Input() helpTextKey?: string;

  public readonly helpText$ = this.componentStore.helpText$;

  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  constructor(
    private dialog: DialogRef,
    private router: Router,
    private store: Store,
    private componentStore: HelpDialogComponentStore
  ) {}

  ngOnInit() {
    if (this.helpTextKey) {
      this.componentStore.getHelpText(this.helpTextKey);
    }
  }

  public edit() {
    this.dialog.close();
    this.router.navigateByUrl(`/${AppPath.globalAdmin}/${AppPath.helpTexts}/${this.helpTextKey}`);
  }
}
