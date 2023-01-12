import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable, delay, of } from 'rxjs';
import { ITSystem, itSystemExample } from '../../shared/models/it-system.model';

@Injectable()
export class ITSystemDataService extends DefaultDataService<ITSystem> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('ITSystem', http, httpUrlGenerator);
  }

  override getAll(): Observable<ITSystem[]> {
    return of(itSystemExample).pipe(delay(1000));
  }
}
