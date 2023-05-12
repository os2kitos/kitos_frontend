import { ExternalReferenceCommandsViewModel } from './external-reference-commands-view.model';
import { ExternalReferenceProperties } from './external-reference-properties.model';

export interface ExternalReferenceViewModel extends ExternalReferenceProperties {
  uuid: string;
  commands: ExternalReferenceCommandsViewModel | null;
}
