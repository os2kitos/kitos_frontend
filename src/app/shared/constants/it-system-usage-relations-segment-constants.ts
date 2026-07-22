import { SegmentButtonOption } from '../components/segment/segment.component';

export enum ItSystemUsageRelationSegmentOption {
  Outgoing = 'outgoing',
  Incoming = 'incoming',
}

export const itSystemUsageRelationSegmentOptions: SegmentButtonOption<ItSystemUsageRelationSegmentOption>[] = [
  { text: $localize`Udgående relationer`, value: ItSystemUsageRelationSegmentOption.Outgoing },
  {
    text: $localize`Indkommende relationer`,
    value: ItSystemUsageRelationSegmentOption.Incoming,
    dataCy: 'incoming-relations-segment-button',
  },
];
