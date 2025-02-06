import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { uiConfigHelpTexts } from '../ui-config-helptexts';

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
        contractName: {
          text: $localize`Kontraktnavn`,
          isObligatory: true,
        },
        contractId: {
          text: $localize`KontraktID`,
        },
        contractType: {
          text: $localize`Kontrakttype`,
        },
        template: {
          text: $localize`Kontraktskabelon`,
        },
        criticality: {
          text: $localize`Kritikalitet`,
        },
        purchaseForm: {
          text: $localize`Indkøbsform`,
        },
        isActive: {
          text: $localize`Gyldig`,
        },
        agreementPeriod: {
          text: $localize`Gyldig fra/til`,
        },
        notes: {
          text: $localize`Bemærkning`,
        },
        parentContract: {
          text: $localize`Overordnet kontrakt`,
        },
        responsibleUnit: {
          text: $localize`Ansvarlig enhed`,
        },
        internalSigner: {
          text: $localize`Kontraktunderskriver`,
          helpText: "Herunder: 'Underskriver', 'Underskrevet' og 'Dato'",
        },
        supplier: {
          text: $localize`Leverandør`,
        },
        externalSigner: {
          text: $localize`Leverandørs underskrift`,
          helpText: "Herunder: 'Underskriver', 'Underskrevet' og 'Dato'",
        },
        procurementStrategy: {
          text: $localize`Genanskaffelsesstrategi`,
        },
        procurementPlan: {
          text: $localize`Genanskaffelsesplan`,
        },
        procurementInitiated: {
          text: $localize`Genanskaffelse igangsat`,
        },
        createdBy: {
          text: $localize`Oprettet af`,
        },
        lastModifiedBy: {
          text: $localize`Sidst redigeret (bruger)`,
        },
        lastModifiedDate: {
          text: $localize`Sidst redigeret (dato)`,
        },
      },
    },
    itSystems: {
      text: $localize`IT Systemer`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      children: {
        agreementElements: {
          text: $localize`Aftaleelementer`,
        },
        systemUsages: {
          text: $localize`IT Systemer`,
        },
        relations: {
          text: $localize`Relationer`,
        },
      },
    },
    dataProcessing: {
      text: $localize`Databehandling`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
    },
    deadlines: {
      text: $localize`Aftalefrister`,
      children: {
        agreementDeadlines: {
          text: $localize`Aftalefrister`,
          helpText: "Herunder: 'Varighed', 'Løbende', 'Option' forlæng', 'Antal brugte optioner' og 'Uopsigelig til' ",
        },
        termination: {
          text: $localize`Opsigelse`,
          helpText: "Herunder: 'Kontrakten opsagt', 'Opsigelsesfrist', 'Løbende' og 'Inden udgangen af' ",
        },
      },
    },
    economy: {
      text: $localize`Økonomi`,
      children: {
        paymentModel: {
          text: $localize`Betalingsmodel`,
          helpText: "Herunder: 'Driftsvederlag påbegyndt', 'Betalingsfrekvens', 'Betalingsmodel' og 'Prisregulering' ",
        },
        extPayment: {
          text: $localize`Ekstern betaling`,
        },
        intPayment: {
          text: $localize`Intern betaling`,
        },
      },
    },
    contractRoles: {
      text: $localize`Kontraktroller`,
    },
    hierarchy: {
      text: $localize`Hierarki`,
      helpText: uiConfigHelpTexts.cannotChangeTab,
    },
    advice: {
      text: $localize`Advis`,
    },
    references: {
      text: $localize`Referencer`,
      helpText: uiConfigHelpTexts.cannotChangeTab,
    },
  },
};
