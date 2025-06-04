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
    ...dto,
    uuid: dto.uuid!,
    status: mapStatusType(dto.status),
    iconType: mapIconType(dto.iconType),
  };
}
