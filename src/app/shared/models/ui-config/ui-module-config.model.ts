import { UIModuleConfigKey } from '../../enums/ui-module-config-key';
import { UIConfigNodeViewModel } from './ui-config-node-view-model.model';

export interface UIModuleConfig {
  module: UIModuleConfigKey;
  moduleConfigViewModel: UIConfigNodeViewModel | undefined;
  cacheTime: number | undefined;
}
