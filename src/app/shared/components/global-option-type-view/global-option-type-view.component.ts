import { Component, Input, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs';
import { GlobalOptionTypeActions } from 'src/app/store/global-admin/global-option-types/actions';
import { BaseComponent } from '../../base/base.component';
import { GlobalAdminOptionType } from '../../models/options/global-admin-option-type.model';
import { isRoleOptionType } from '../../models/options/role-option-types.model';
import { GlobalOptionTypeTableComponentStore } from './global-option-type-table.component-store';
import { DialogOpenerService } from '../../services/dialog-opener.service';

@Component({
  selector: 'app-global-option-type-view',
  templateUrl: './global-option-type-view.component.html',
  styleUrl: './global-option-type-view.component.scss',
  providers: [GlobalOptionTypeTableComponentStore],
})
export class GlobalOptionTypeViewComponent extends BaseComponent implements OnInit {
  @Input() optionType!: GlobalAdminOptionType;
  @Input() title: string = '';
  @Input() showDescription: boolean = true;
  @Input() expandedByDefault: boolean = false;
  @Input() disableAccordion: boolean = false;
  @Input() showWriteAccess: boolean = false;

  constructor(
    private componentStore: GlobalOptionTypeTableComponentStore,
    private actions$: Actions,
    private dialogOpener: DialogOpenerService
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
          ofType(GlobalOptionTypeActions.updateOptionTypeSuccess, GlobalOptionTypeActions.createOptionTypeSuccess),
          filter(({ optionType }) => optionType === this.optionType)
        )
        .subscribe(() => {
          this.componentStore.getOptionTypeItems();
        })
    );
  }

  public onCreate() {
    const componentInstance = this.dialogOpener.openGlobalOptionTypeDialog(this.optionType);
    componentInstance.action = 'create';
  }

  public getCreateButtonType() {
    return isRoleOptionType(this.optionType) ? $localize`rolle` : $localize`type`;
  }
}
