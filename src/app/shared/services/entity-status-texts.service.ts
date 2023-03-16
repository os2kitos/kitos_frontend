import { Injectable } from '@angular/core';
import { EntityStatusCategories } from '../models/status/entity-status-categories.model';
import { EntityStatusTexts } from '../models/status/entity-status-texts.model';

@Injectable({
  providedIn: 'root',
})
export class EntityStatusTextsService {
  private readonly typeToTextMap: Record<EntityStatusCategories, EntityStatusTexts> = {
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
    'it-contract': {
      trueString: $localize`Gyldig`,
      falseString: $localize`Ikke gyldig`,
    },
  };

  map(category: EntityStatusCategories): EntityStatusTexts {
    return this.typeToTextMap[category];
  }
}
