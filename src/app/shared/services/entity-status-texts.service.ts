import { Injectable } from '@angular/core';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { EntityStatusTexts } from '../models/status/entity-status-texts.model';

@Injectable({
  providedIn: 'root',
})
export class EntityStatusTextsService {
  private readonly typeToTextMap: Record<RegistrationEntityTypes, EntityStatusTexts> = {
    'data-processing-registration': {
      trueString: $localize`Aktiv`,
      falseString: $localize`Ikke aktiv`,
    },
    'it-system': {
      trueString: $localize`Tilgængeligt`,
      falseString: $localize`Ikke tilgængeligt`,
    },
    'it-system-usage': {
      trueString: $localize`Aktivt`,
      falseString: $localize`Ikke aktivt`,
    },
    'it-interface': {
      trueString: $localize`Aktiv`,
      falseString: $localize`Ikke aktiv`,
    },
    'it-contract': {
      trueString: $localize`Gyldig`,
      falseString: $localize`Ikke gyldig`,
    },
    organization: {
      trueString: $localize`Aktiv`,
      falseString: $localize`Ikke aktiv`,
    },
  };

  public map(category: RegistrationEntityTypes): EntityStatusTexts {
    return this.typeToTextMap[category];
  }
}
