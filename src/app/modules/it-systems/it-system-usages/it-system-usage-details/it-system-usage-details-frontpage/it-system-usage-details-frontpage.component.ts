import { Component, Input } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';

enum FrontpageSelectOption {
  local = 'local',
  catalog = 'catalog',
}

@Component({
  templateUrl: 'it-system-usage-details-frontpage.component.html',
  styleUrls: ['it-system-usage-details-frontpage.component.scss'],
})
export class ITSystemUsageDetailsFrontpageComponent {
  public readonly FrontpageSelectOption = FrontpageSelectOption;

  @Input() public selected = FrontpageSelectOption.local;

  public showingOptions: SegmentButtonOption<FrontpageSelectOption>[] = [
    { text: $localize`Lokal data fra kommunen`, value: FrontpageSelectOption.local },
    { text: $localize`Data fra IT Systemkataloget`, value: FrontpageSelectOption.catalog },
  ];
}
