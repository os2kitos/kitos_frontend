import { SegmentButtonOption } from '../components/segment/segment.component';

export enum ItSystemUsageModuleSegmentOption {
  Usage = 'local',
  Catalog = 'catalog',
}

export const itSystemUsageModuleSegmentOptions: SegmentButtonOption<ItSystemUsageModuleSegmentOption>[] = [
  { text: $localize`Lokal data fra kommunen`, value: ItSystemUsageModuleSegmentOption.Usage },
  {
    text: $localize`Data fra IT Systemkataloget`,
    value: ItSystemUsageModuleSegmentOption.Catalog,
    dataCy: 'catalog-segment',
  },
];
