import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { uiConfigHelpTexts } from '../ui-config-helptexts';

export const DataProcessingUiBluePrint = {
  module: UIModuleConfigKey.DataProcessingRegistrations,
  isObligatory: false,
  helpText: uiConfigHelpTexts.generalUiCustomizationHelpText,
  text: 'Databehandling',
  children: {
    frontPage: {
      text: 'Forside',
      isObligatory: true,
      helpText: uiConfigHelpTexts.cannotChangeTab,
    },
    itSystems: {
      text: 'IT Systemer',
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      isObligatory: true,
    },
    itContracts: {
      text: 'IT Kontrakter',
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      isObligatory: true,
      children: {
        mainContract: {
          text: 'Hvilken kontrakt skal angive om databehandlingen er aktiv',
        },
      },
    },
    oversight: {
      text: 'Tilsyn',
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      isObligatory: true,
      children: {
        scheduledInspectionDate: {
          text: 'Kommende planlagt tilsyn',
        },
      },
    },
    roles: {
      text: 'Databehandlingsroller',
    },
    notifications: {
      text: 'Advis',
    },
    references: {
      text: 'Referencer',
    },
  },
};
