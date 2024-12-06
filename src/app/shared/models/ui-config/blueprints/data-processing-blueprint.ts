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
      children: {
        name: {
          text: $localize`Navn`,
          isObligatory: true,
        },
        dataResponsible: {
          text: $localize`Dataansvarlig`,
        },
        status: {
          text: $localize`Status`,
        },
        lastChangedBy: {
          text: $localize`Sidst redigeret af bruger`,
        },
        lastChangedAt: {
          text: $localize`Sidst redigeret dato`,
        },
        agreementConcluded: {
          text: $localize`Databehandler afftale indgået`,
        },
        transferBasis: {
          text: $localize`Overførselsgrundlag`,
        },
        processors: {
          text: $localize`Databehandlere`,
        },
        subProcessors: {
          text: $localize`Underdatabehandlere`,
        },
      },
    },
    itSystems: {
      text: $localize`IT Systemer`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
    },
    itContracts: {
      text: $localize`IT Kontrakter`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      children: {
        mainContract: {
          text: $localize`Hvilken kontrakt skal angive om databehandlingen er aktiv`,
        },
        associatedContracts: {
          text: $localize`Tilknyttede kontrakter`,
        },
      },
    },
    oversight: {
      text: $localize`Tilsyn`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      children: {
        oversightInterval: {
          text: $localize`Tilsynsinterval`,
        },
        scheduledInspectionDate: {
          text: $localize`Kommende planlagt tilsyn`,
        },
        oversightOptions: {
          text: $localize`Tilsynsmuligheder`,
        },
        oversights: {
          text: $localize`Gennemførte og kommende tilsyn`,
        }
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
