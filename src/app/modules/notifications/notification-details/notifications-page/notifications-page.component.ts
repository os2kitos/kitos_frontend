import { Component, Input } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

enum NotificationSegmentType {
  Advis = 'advis',
  Alerts = 'alerts',
}

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss',
})
export class NotificationsPageComponent {
  @Input() entityType!: RegistrationEntityTypes;

  public selectedSegment = NotificationSegmentType.Advis;
  public readonly NotificationSegmentType = NotificationSegmentType;
  public readonly segmentOptions: SegmentButtonOption<NotificationSegmentType>[] = [
    {
      value: NotificationSegmentType.Advis,
      text: $localize`Kommende advis`,
      dataCy: 'advis-segment',
    },
    {
      value: NotificationSegmentType.Alerts,
      text: $localize`Ulæste advarsler`,
      dataCy: 'alerts-segment',
    },
  ];
}
