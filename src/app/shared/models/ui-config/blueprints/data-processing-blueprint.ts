import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { uiConfigHelpTexts } from '../ui-config-helptexts';

export const DataProcessingUiBluePrint = {
  module: UIModuleConfigKey.DataProcessingRegistrations,
  isObligatory: false,
  helpText: uiConfigHelpTexts.generalUiCustomizationHelpText,
  text: $localize`Databehandling`,
  children: {
    frontPage: {
      text: $localize`Forside`,
      isObligatory: true,
      helpText: uiConfigHelpTexts.cannotChangeTab,
    },
    itSystems: {
      text: $localize`IT Systemer`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      isObligatory: true,
    },
    itContracts: {
      text: $localize`IT Kontrakter`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      isObligatory: true,
      children: {
        mainContract: {
          text: $localize`Hvilken kontrakt skal angive om databehandlingen er aktiv`,
        },
      },
    },
    oversight: {
      text: $localize`Tilsyn`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      isObligatory: true,
      children: {
        scheduledInspectionDate: {
          text: $localize`Kommende planlagt tilsyn`,
        },
      },
    },
    roles: {
      text: $localize`Databehandlingsroller`,
    },
    notifications: {
      text: $localize`Advis`,
    },
    references: {
      text: $localize`Referencer`,
    },
  },
};
