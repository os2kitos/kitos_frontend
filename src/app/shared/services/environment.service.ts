import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Environment } from '../models/environment';

@Injectable({ providedIn: 'any' })
export class EnvironmentService {
  public get current(): Environment {
    return environment;
  }
}
