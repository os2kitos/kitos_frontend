import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { GlobalAdminActions } from 'src/app/store/global-admin/actions';
import { selectAllGlobalAdmins, selectGlobalAdminsLoading } from 'src/app/store/global-admin/selectors';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { ContentSpaceBetweenComponent } from '../../../../shared/components/content-space-between/content-space-between.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { TableRowActionsComponent } from '../../../../shared/components/table-row-actions/table-row-actions.component';
import { IconButtonComponent } from '../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../shared/components/icons/trashcan-icon.component';

@Component({
  selector: 'app-global-admins-table',
  templateUrl: './global-admins-table.component.html',
  styleUrl: './global-admins-table.component.scss',
  imports: [
    NgIf,
    LoadingComponent,
    NativeTableComponent,
    NgFor,
    ContentSpaceBetweenComponent,
    ParagraphComponent,
    TableRowActionsComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    AsyncPipe,
  ],
})
export class GlobalAdminsTableComponent implements OnInit {
  constructor(
    private confirmActionService: ConfirmActionService,
    private store: Store,
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(GlobalAdminActions.getGlobalAdmins());
  }

  public readonly globalAdmins$ = this.store.select(selectAllGlobalAdmins);
  public readonly globalAdminsIsLoading$ = this.store.select(selectGlobalAdminsLoading);

  public removeGlobalAdmin(globalAdmin: ShallowUser) {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Fjern "${globalAdmin.name}" som global administrator`,
      onConfirm: () => this.store.dispatch(GlobalAdminActions.removeGlobalAdmin(globalAdmin.uuid)),
    });
  }
}
