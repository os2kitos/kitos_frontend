import { UIModuleCustomizationKey } from '../../enums/ui-module-customization-key';

export interface UINodeBlueprint {
  text: string;
  readOnly?: boolean;
  children?: Record<string, UINodeBlueprint>;
  fullKey?: string;
  helpText?: string;
  subtreeIsComplete?: boolean;
}

export function getItSystemUsageUiBluePrint(): UINodeBlueprint {
  const blueprint = ItSystemUsageUiBluePrint;
  setupUIBlueprintKeys(UIModuleCustomizationKey.ItSystemUsage, blueprint, []);
  return blueprint;
}

function setupUIBlueprintKeys(currentLevelKey: string, currentNode: UINodeBlueprint, ancestorKeys: string[]) {
  const keyPath = [...ancestorKeys, currentLevelKey];
  currentNode.fullKey = keyPath.join('.');

  if (currentNode.children) {
    Object.keys(currentNode.children).forEach((key) => {
      if (currentNode.children) setupUIBlueprintKeys(key, currentNode.children[key], keyPath);
    });
  }
}

const ItSystemUsageUiBluePrint = {
  module: UIModuleCustomizationKey.ItSystemUsage,
  isObligatory: false,
  helpText: $localize`Bemærk: Skjules faneblad/felt fjernes relaterede felt(er) også fra overbliksbillederne`,
  text: $localize`IT-Systemer i anvendelse`,
  children: {
    frontPage: {
      text: $localize`Systemforside`,
      isObligatory: true,
      helpText: $localize`Det er kun muligt at fjerne dette faneblad ved at slå det relaterede modul fra`,
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
      helpText: $localize`Det er kun muligt at fjerne dette faneblad ved at slå det relaterede modul fra`,
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
