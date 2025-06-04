import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { APIPublicMessageRequestDTO } from 'src/app/api/v2';
import { BooleanValueDisplayType } from 'src/app/shared/components/status-chip/status-chip.component';
import { validateUrl } from 'src/app/shared/helpers/link.helpers';
import { IconType } from 'src/app/shared/models/icon-type';
import { PublicMessage } from 'src/app/shared/models/public-messages/public-message.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ExternalPageLinkComponent } from '../../../shared/components/external-page-link/external-page-link.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ParagraphComponent } from '../../../shared/components/paragraph/paragraph.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { FrontpageComponentStore } from '../frontpage.component-store';
import { PublicMessageDialogComponent } from './public-message-dialog/public-message-dialog.component';

export interface PublicMessageConfig {
  iconType: IconType;
  index: number;
}

@Component({
  selector: 'app-public-message',
  templateUrl: './public-message.component.html',
  styleUrls: ['./public-message.component.scss'],
  host: {
    '[style.width]': "mode === 'compact' ? '352px' : '452px'",
  },
  imports: [
    CommonModule,
    CardComponent,
    IconComponent,
    StatusChipComponent,
    ButtonComponent,
    ExternalPageLinkComponent,
    ParagraphComponent,
  ],
})
export class PublicMessageComponent implements OnInit {
  @Input() mode!: 'normal' | 'compact';
  @Input() publicMessageUuid!: string;

  private readonly publicMessages$ = this.componentStore.publicMessages$.pipe(filterNullish());
  public publicMessage$!: Observable<PublicMessage>;

  public readonly statusDisplayType = BooleanValueDisplayType.NormalUnstable;

  constructor(
    private dialog: MatDialog,
    private readonly componentStore: FrontpageComponentStore,
  ) {}

  ngOnInit(): void {
    // Initialize publicMessage$ by filtering publicMessages$ for the message with the matching UUID
    this.publicMessage$ = this.publicMessages$.pipe(
      map((messages) => messages.find((message) => message.uuid === this.publicMessageUuid)!),
    );
  }

  public openPublicMessageDialog(): void {
    const dialogRef = this.dialog.open(PublicMessageDialogComponent);
    dialogRef.componentInstance.publicMessage$ = this.publicMessage$;
  }

  public hasValidUrl(publicMessage: PublicMessage): boolean {
    const url = publicMessage.link;
    return !!url && validateUrl(url);
  }

  public activeStatus(publicMessage: PublicMessage): boolean | undefined {
    switch (publicMessage.status?.value) {
      case APIPublicMessageRequestDTO.StatusEnum.Active:
        return true;
      case APIPublicMessageRequestDTO.StatusEnum.Inactive:
        return false;
      default:
        return undefined;
    }
  }

  public getIconType(publicMessage: PublicMessage): IconType {
    return publicMessage.iconType?.icon ?? 'document';
  }
}
