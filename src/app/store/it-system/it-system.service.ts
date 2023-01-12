import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { ITSystem } from '../../shared/models/it-system.model';

@Injectable({ providedIn: 'root' })
export class ITSystemService extends EntityCollectionServiceBase<ITSystem> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('ITSystem', serviceElementsFactory);
  }
}
