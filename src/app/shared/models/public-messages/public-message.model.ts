import { APIPublicMessageResponseDTO } from 'src/app/api/v2';
import { HasUuid } from '../has-uuid';
import { mapIconType, PublicMessageIconType } from './icon-type.model';
import { mapStatusType, StatusType } from './status-type.model';

export interface PublicMessage extends HasUuid {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  status?: StatusType;
  link?: string;
  iconType?: PublicMessageIconType;
  isMain?: boolean;
}

export function adaptPublicMessage(dto: APIPublicMessageResponseDTO): PublicMessage {
  return {
    uuid: dto.uuid!,
    title: dto.title ?? undefined,
    shortDescription: dto.shortDescription ?? undefined,
    longDescription: dto.longDescription ?? undefined,
    status: mapStatusType(dto.status ?? undefined),
    link: dto.link ?? undefined,
    iconType: mapIconType(dto.iconType ?? undefined),
    isMain: dto.isMain,
  };
}
