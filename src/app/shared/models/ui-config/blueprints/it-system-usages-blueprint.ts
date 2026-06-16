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
        purpose: {
          text: $localize`Systemets overordnede formål`,
        },
        version: {
          text: $localize`Version`,
        },
        technicalSystemType: {
          text: $localize`Tekniske systemtyper`,
          disableByDefault: true,
        },
        amountOfUsers: {
          text: $localize`Antal brugere`,
        },
        dataClassification: {
          text: $localize`Klassifikation af data`,
        },
        description: {
          text: $localize`Note`,
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
        containsAITechnology: {
          text: $localize`Indeholder AI-teknologi`,
        },
        webAccessibility: {
          text: $localize`Webtilgængelighed (WCAG)`,
        },
        isSociallyCritical: {
          text: $localize`Samfundskritisk IT-system`,
          disableByDefault: true,
        },
        isBusinessCritical: {
          text: $localize`Forretningskritisk IT-system`,
        },
        criticalityFieldsLastChanged: {
          text: $localize`Systemkritikalitet sidst opdateret`,
          disableByDefault: true,
        },
        systemUsageCriticalityLevel: {
          text: $localize`Kritikalitet`,
          disableByDefault: true,
        },
        criticalityLevelDocumentation: {
          text: $localize`Reference for kritikalitetsvurdering`,
          disableByDefault: true,
        },
        hostedAt: {
          text: $localize`IT-Systemet driftes`,
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
        processingPurpose: {
          text: $localize`Behandlingsformål`,
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
        riskAssessmentResult: {
          text: $localize`Hvad viste den seneste risikovurdering?`,
          disableByDefault: true,
        },
        dpiaConducted: {
          text: $localize`Gennemført DPIA / Konsekvensanalyse`,
        },
        retentionPeriod: {
          text: $localize`Er der bevaringsfrist på data inden de må slettes?`,
        },
        isDataProcessingAgreementRequired: {
          text: $localize`Kræver system databehandleraftale`,
          disableByDefault: true,
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
      children: {
        itInterfaceIds: {
          text: $localize`Snitflade ID'er`,
          disableByDefault: true,
        },
        itInterfaceVersions: {
          text: $localize`Snitflade versioner`,
          disableByDefault: true,
        },
      },
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
        catalogArchiveDuty: {
          text: $localize`Rigsarkivets vejledning til arkivering`,
        },
        catalogArchiveDutyComment: {
          text: $localize`Bemærkning fra Rigsarkivet`,
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
