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
          text: $localize`Status`,
          cannotBeRecommended: true,
        },
        agreementPeriod: {
          text: $localize`Gyldig fra/til`,
        },
        notes: {
          text: $localize`Bemærkning`,
        },
        parentContract: {
          text: $localize`Overordnet kontrakt`,
          cannotBeRecommended: true,
        },
        useParentValidity: {
          text: $localize`Nedarv overordnet kontrakts gyldighed`,
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
        externalContactPerson: {
          text: $localize`Leverandørens kontaktperson`,
        },
        externalContactPersonPhone: {
          text: $localize`Leverandørens kontaktperson (telefon)`,
        },
        externalContactPersonEmail: {
          text: $localize`Leverandørens kontaktperson (email)`,
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
          cannotBeRecommended: true,
        },
        lastModifiedDate: {
          text: $localize`Sidst redigeret (dato)`,
          cannotBeRecommended: true,
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
      children: {
        dataProcessingRegistrations: {
          text: $localize`Tilknyttede databehandlinger`,
          isObligatory: true,
        },
      },
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
      children: {
        roles: {
          text: $localize`Kontraktroller`,
          isObligatory: true,
        },
      },
    },
    hierarchy: {
      text: $localize`Hierarki`,
      helpText: uiConfigHelpTexts.cannotChangeTab,
    },
    advice: {
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
      helpText: uiConfigHelpTexts.cannotChangeTab,
      children: {
        references: {
          text: $localize`Referencer`,
          isObligatory: true,
        },
      },
    },
  },
};
