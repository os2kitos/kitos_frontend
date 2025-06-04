import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APINotificationResponseDTO } from 'src/app/api/v2';
import { mapNotificationEntityTypes } from 'src/app/shared/models/notification-entity-types';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationsTableComponentStore } from '../notifications-table.component-store';
import { ScrollbarDialogComponent } from '../../dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../native-table/native-table.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { EmptyStateComponent } from '../../empty-states/empty-state.component';

@Component({
  selector: 'app-notifications-table-sent-dialog',
  templateUrl: './notifications-table-sent-dialog.component.html',
  styleUrl: './notifications-table-sent-dialog.component.scss',
  providers: [NotificationsTableComponentStore],
  imports: [
    ScrollbarDialogComponent,
    NgIf,
    NativeTableComponent,
    NgFor,
    ParagraphComponent,
    EmptyStateComponent,
    AsyncPipe,
  ],
})
export class NotificationsTableSentDialogComponent implements OnInit {
  @Input() public title!: string;
  @Input() public ownerEntityUuid!: string;

  public currentNotificationSent$ = this.componentStore.currentNotificationSent$;
  public readonly anyNotifications$ = this.currentNotificationSent$.pipe(matchNonEmptyArray());

  public notification: APINotificationResponseDTO | undefined;

  constructor(
    private componentStore: NotificationsTableComponentStore,
    @Inject(MAT_DIALOG_DATA) public data: APINotificationResponseDTO,
  ) {
    this.notification = data;
  }

  public formatDate(date: string | undefined) {
    if (date) {
      return new Date(date).toLocaleString();
    }
    return $localize`Ugyldig dato fundet.`;
  }

  private setupSentTable() {
    if (this.notification?.uuid)
      this.componentStore.getCurrentNotificationSent({
        ownerResourceType:
          mapNotificationEntityTypes(this.notification.ownerResourceType) ??
          this.throwExpression('Invalid ownerResourceType'),
        ownerResourceUuid: this.ownerEntityUuid,
        notificationUuid: this.notification.uuid,
      });
  }

  private throwExpression(errorMessage: string): never {
    throw new Error(errorMessage);
  }

  ngOnInit(): void {
    this.setupSentTable();
  }
}
