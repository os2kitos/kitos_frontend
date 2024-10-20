import { UIModuleConfigKey } from '../../enums/ui-module-customization-key';
import { UIConfigNodeViewModel } from './ui-config-node-view-model.model';

export interface UIModuleConfig {
  module: UIModuleConfigKey;
  configViewModels: UIConfigNodeViewModel[];
}
