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
        name: {
          text: $localize`Navn`,
          isObligatory: true,
        },
        systemId: {
          text: $localize`System ID`,
        },
        version: {
          text: $localize`Version`,
        },
        amountOfUsers: {
          text: $localize`Antal brugere`,
        },
        dataClassification: {
          text: $localize`Klassifikation af data`,
        },
        description: {
          text: $localize`Beskrivelse`,
        },
        takenIntoUsageBy: {
          text: $localize`Taget i anvendelse af`,
        },
        lastEditedBy: {
          text: $localize`Sidst redigeret (bruger)`,
        },
        lastEditedAt: {
          text: $localize`Sidst redigeret (dato)`,
        },
        lifeCycleStatus: {
          text: $localize`Livscyklus`,
        },
        usagePeriod: {
          text: $localize`Datofelter`,
          helpText: $localize`Dækker felterne “Ibrugtagningsdato” og “Slutdato for anvendelse”`,
        },
        status: {
          text: $localize`Status`,
        },
      },
    },
    contracts: {
      text: $localize`Kontrakter`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      children: {
        associatedContracts: {
          text: $localize`Tilknyttede kontrakter`,
        },
        selectContractToDetermineIfItSystemIsActive: {
          text: $localize`Hvilken kontrakt skal afgøre om IT systemet er aktivt`,
        },
      },
    },
    dataProcessing: {
      text: $localize`Databehandling`,
      helpText: $localize`Det er kun muligt at fjerne dette faneblad ved at slå det relaterede modul fra`,
    },
    gdpr: {
      text: $localize`GDPR`,
      children: {
        purpose: {
          text: $localize`Systemets overordnede formål`,
        },
        businessCritical: {
          text: $localize`Forretningskritisk IT-System`,
        },
        hostedAt: {
          text: $localize`IT-Systemet driftes`,
        },
        documentation: {
          text: $localize`Link til fortegnelse`,
        },
        dataTypes: {
          text: $localize`Hvilke typer data indeholder systemet?`,
        },
        registeredCategories: {
          text: $localize`Hvilke kategorier af registrerede indgår i databehandlingen?`,
        },
        technicalPrecautions: {
          text: $localize`Implementeret passende tekniske foranstaltninger`,
        },
        userSupervision: {
          text: $localize`Logning af brugerkontrol`,
        },
        plannedRiskAssessmentDate: {
          text: $localize`Dato for planlagt risikovurdering`,
        },
        conductedRiskAssessment: {
          text: $localize`Foretaget risikovurdering`,
        },
        dpiaConducted: {
          text: $localize`Gennemført DPIA / Konsekvensanalyse`,
        },
        retentionPeriod: {
          text: $localize`Er der bevaringsfrist på data inden de må slettes?`,
        },
      },
    },
    systemRoles: {
      text: $localize`Systemroller`,
    },
    organization: {
      text: $localize`Organisation`,
      children: {
        responsibleUnit: {
          text: $localize`Ansvarlig organisationsenhed`,
        },
        relevantUnits: {
          text: $localize`Relevante organisationsenheder
`,
        },
      },
    },
    systemRelations: {
      text: $localize`Relationer`,
      children: {
        outgoing: {
          text: $localize`Relationer til andre systemer`,
        },
        incoming: {
          text: $localize`Relationer fra andre systemer`,
        },
      },
    },
    interfaces: {
      text: $localize`Udstillede snitflader`,
    },
    archiving: {
      text: $localize`Arkivering`,
      children: {
        archiveDuty: {
          text: $localize`Arkiveringspligt`,
          isObligatory: true,
        },
        archiveType: {
          text: $localize`Arkivtype`,
        },
        archiveLocation: {
          text: $localize`Arkiveringssted`,
        },
        archiveSupplier: {
          text: $localize`Arkiveringsleverandør`,
        },
        archiveTestLocation: {
          text: $localize`Arkiveringsteststed`,
        },
        archiveFrequency: {
          text: $localize`Arkiveringsfrekvens`,
        },
        documentBearing: {
          text: $localize`Dokumentbærende`,
        },
        active: {
          text: $localize`Er der arkiveret fra systemet?`,
        },
        notes: {
          text: $localize`Arkiveringsbemærkninger`,
        },
        journalPeriods: {
          text: $localize`Journalperioder`,
        },
      },
    },
    hierarchy: {
      text: $localize`Hierarki`,
    },
    localKle: {
      text: $localize`Lokale KLE`,
      children: {
        inheritedKle: {
          text: $localize`Nedarvede opgaver (Data fra IT Systemkataloget)`,
        },
        localKle: {
          text: $localize`Lokale tilknyttede opgaver`,
        },
      },
    },
    advice: {
      text: $localize`Advis`,
    },
    localReferences: {
      text: $localize`Lokale referencer`,
    },
  },
};
