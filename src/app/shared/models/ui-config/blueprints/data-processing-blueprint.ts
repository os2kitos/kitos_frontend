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
          cannotBeRecommended: true,
        },
        lastChangedBy: {
          text: $localize`Sidst redigeret af bruger`,
          cannotBeRecommended: true,
        },
        lastChangedAt: {
          text: $localize`Sidst redigeret dato`,
          cannotBeRecommended: true,
        },
        agreementConcluded: {
          text: $localize`Databehandler aftale indgået`,
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
        responsibleOrgUnit: {
          text: $localize`Ansvarlig enhed`,
        },
        enforceInvalidity: {
          text: $localize`Gennemtving deaktivering`,
          disableByDefault: true,
          cannotBeRecommended: true,
        },
      },
    },
    itSystems: {
      text: $localize`IT Systemer`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      children: {
        systemUsages: {
          text: $localize`IT Systemer`,
          isObligatory: true,
        },
      },
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
          cannotBeRecommended: true,
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
        },
      },
    },
    roles: {
      text: $localize`Databehandlingsroller`,
      children: {
        roles: {
          text: $localize`Databehandlingsroller`,
          isObligatory: true,
        },
      },
    },
    notifications: {
      text: $localize`Advis`,
      children: {
        notifications: {
          text: $localize`Advis`,
          isObligatory: true,
        },
      },
    },
    references: {
      text: $localize`Referencer`,
      children: {
        references: {
          text: $localize`Referencer`,
          isObligatory: true,
        },
      },
    },
  },
};
