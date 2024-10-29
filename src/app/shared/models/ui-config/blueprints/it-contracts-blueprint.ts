import { UIModuleConfigKey } from "src/app/shared/enums/ui-module-config-key";
import { uiConfigHelpTexts } from "../ui-config-helptexts";

export const ItContractsUiBluePrint = {
  module: UIModuleConfigKey.ItContract,
  isObligatory: false,
  helpText: uiConfigHelpTexts.generalUiCustomizationHelpText,
  text: $localize`IT Kontrakt`,
  children: {
    frontPage: {
      text: $localize`Kontraktforside`,
      isObligatory: true,
      helpText: uiConfigHelpTexts.cannotChangeTab,
      children: {
        contractId: {
          text: $localize`KontraktID`
        },
        contractType: {
          text: $localize`Kontrakttype`
        },
        template: {
          text: $localize`Kontraktskabelon`
        },
        criticality: {
          text: $localize`Kritikalitet`
        },
        purchaseForm: {
          text: $localize`Indkøbsform`
        },
        procurementStrategy: {
          text: $localize`Genanskaffelsesstrategi`
        },
        procurementPlan: {
          text: $localize`Genanskaffelsesplan`
        },
        procurementInitiated: {
          text: $localize`Genanskaffelse igangsat`
        },
        externalSigner: {
          text: $localize`Leverandørs underskrift`,
          helpText: "Herunder: 'Underskriver', 'Underskrevet' og 'Dato'"
        },
        internalSigner: {
          text: $localize`Kontraktunderskriver`,
          helpText: "Herunder: 'Underskriver', 'Underskrevet' og 'Dato'"
        },
        agreementPeriod: {
          text: $localize`Gyldig fra/til`
        },
        isActive: {
          text: $localize`Gyldig`
        }
      }
    },
    itSystems: {
      text: $localize`IT Systemer`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      isObligatory: true
    },
    dataProcessing: {
      text: $localize`Databehandling`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      isObligatory: true
    },
    deadlines: {
      text: $localize`Aftalefrister`,
      isObligatory: false,
      disableIfSubtreeDisabled: true,
      children: {
        agreementDeadlines: {
          text: $localize`Aftalefrister`,
          helpText: "Herunder: 'Varighed', 'Løbende', 'Option' forlæng', 'Antal brugte optioner' og 'Uopsigelig til' "
        },
        termination: {
          text: $localize`Opsigelse`,
          helpText: "Herunder: 'Kontrakten opsagt', 'Opsigelsesfrist', 'Løbende' og 'Inden udgangen af' "
        }
      }
    },
    economy: {
      text: $localize`Økonomi`,
      isObligatory: false,
      disableIfSubtreeDisabled: true,
      children: {
        paymentModel: {
          text: $localize`Betalingsmodel`,
          helpText: "Herunder: 'Driftsvederlag påbegyndt', 'Betalingsfrekvens', 'Betalingsmodel' og 'Prisregulering' "
        },
        extPayment: {
          text: $localize`Ekstern betaling`
        },
        intPayment: {
          text: $localize`Intern betaling`
        }
      }
    },
    contractRoles: {
      text: $localize`Kontraktroller`
    },
    hierarchy: {
      text: $localize`Hierarki`,
      helpText: uiConfigHelpTexts.cannotChangeTab,
      isObligatory: true
    },
    advice: {
      text: $localize`Advis`
    },
    references: {
      text: $localize`Referencer`,
      helpText: uiConfigHelpTexts.cannotChangeTab,
      isObligatory: true
    }
  }
};
