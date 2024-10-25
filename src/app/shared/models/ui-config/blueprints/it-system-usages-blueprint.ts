import { UIModuleConfigKey } from '../../../enums/ui-module-config-key';
import { uiConfigHelpTexts } from '../ui-config-helptexts';

export const ItSystemUsageUiBluePrint = {
  module: UIModuleConfigKey.ItSystemUsage,
  isObligatory: false,
  helpText: uiConfigHelpTexts.generalUiCustomizationHelpText,
  text: $localize`IT-Systemer i anvendelse`,
  children: {
    frontPage: {
      text: $localize`Systemforside`,
      isObligatory: true,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      children: {
        usagePeriod: {
          text: $localize`Datofelter`,
          helpText: $localize`Dækker felterne “Ibrugtagningsdato” og “Slutdato for anvendelse”`,
        },
        lifeCycleStatus: {
          text: $localize`Livscyklus`,
        },
      },
    },
    contracts: {
      text: $localize`Kontrakter`,
      isObligatory: true,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      children: {
        selectContractToDetermineIfItSystemIsActive: {
          text: $localize`Hvilken kontrakt skal afgøre om IT systemet er aktivt`,
        },
      },
    },
    dataProcessing: {
      text: $localize`Databehandling`,
      isObligatory: true,
      helpText: $localize`Det er kun muligt at fjerne dette faneblad ved at slå det relaterede modul fra`,
    },
    gdpr: {
      text: $localize`GDPR`,
      children: {
        plannedRiskAssessmentDate: {
          text: $localize`Dato for planlagt risikovurdering`,
        },
      },
    },
    systemRoles: {
      text: $localize`Systemroller`,
    },
    organization: {
      text: $localize`Organisation`,
    },
    systemRelations: {
      text: $localize`Relationer`,
    },
    interfaces: {
      text: $localize`Udstillede snitflader`,
    },
    archiving: {
      text: $localize`Arkivering`,
    },
    hierarchy: {
      text: $localize`Hierarki`,
    },
    localKle: {
      text: $localize`Lokale KLE`,
    },
    advice: {
      text: $localize`Advis`,
    },
    localReferences: {
      text: $localize`Lokale referencer`,
    },
  },
};
