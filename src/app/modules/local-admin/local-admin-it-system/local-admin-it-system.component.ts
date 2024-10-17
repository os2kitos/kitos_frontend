import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';

enum LocalAdminItSystemSegmentOption {
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

@Component({
  selector: 'app-local-admin-it-system',
  templateUrl: './local-admin-it-system.component.html',
  styleUrl: './local-admin-it-system.component.scss',
})
export class LocalAdminItSystemComponent {
  public readonly LocalAdminItSystemSegmentOption = LocalAdminItSystemSegmentOption;

  public selectedSegment: LocalAdminItSystemSegmentOption = LocalAdminItSystemSegmentOption.RegularOptionTypes;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminItSystemSegmentOption>[] = [
    { text: $localize`It system et eller andet godt avn`, value: LocalAdminItSystemSegmentOption.RegularOptionTypes },
    { text: $localize`It system roller`, value: LocalAdminItSystemSegmentOption.RoleOptionTypes },
  ];
}
