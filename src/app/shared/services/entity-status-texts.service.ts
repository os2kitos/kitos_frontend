import { Injectable } from '@angular/core';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { EntityStatusTexts } from '../models/status/entity-status-texts.model';

@Injectable({
  providedIn: 'root',
})
export class EntityStatusTextsService {

  private ACTIVE_TEXT = $localize`Aktiv`;
  private INACTIVE_TEXT = $localize`Ikke aktiv`;

  private readonly typeToTextMap: Record<RegistrationEntityTypes, EntityStatusTexts> = {
    'data-processing-registration': {
      trueString: this.ACTIVE_TEXT,
      falseString: this.INACTIVE_TEXT,
    },
    'it-system': {
      trueString: $localize`Tilgængeligt`,
      falseString: $localize`Ikke tilgængeligt`,
    },
    'it-system-usage': {
      trueString: $localize`Aktivt`,
      falseString: this.INACTIVE_TEXT,
    },
    'it-interface': {
      trueString: this.ACTIVE_TEXT,
      falseString: this.INACTIVE_TEXT,
    },
    'it-contract': {
      trueString: $localize`Gyldig`,
      falseString: $localize`Ikke gyldig`,
    },
    'organization': {
      trueString: this.ACTIVE_TEXT,
      falseString: this.INACTIVE_TEXT,
    },
    'organization-unit': {
      trueString: this.ACTIVE_TEXT,
      falseString: this.INACTIVE_TEXT,
    },
    'organization-user': {
      trueString: this.ACTIVE_TEXT,
      falseString: this.INACTIVE_TEXT,
    },
    'local-admin-organization': {
      trueString: this.ACTIVE_TEXT,
      falseString: this.INACTIVE_TEXT,
    },
  };

  public map(category: RegistrationEntityTypes): EntityStatusTexts {
    return this.typeToTextMap[category];
  }
}
