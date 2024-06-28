import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatePersistingService {
  public get<T>(token: string): T {
    const settings = localStorage.getItem(token);
    return settings ? JSON.parse(settings) : settings;
  }
  public set<T>(token: string, data: T): void {
    localStorage.setItem(token, JSON.stringify(data));
  }
}
