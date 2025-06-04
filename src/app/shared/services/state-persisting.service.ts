import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public get<T>(token: string): T | null {
    const settings = localStorage.getItem(token);
    return settings ? JSON.parse(settings) : null;
  }
  public set<T>(token: string, data: T): void {
    localStorage.setItem(token, JSON.stringify(data));
  }

  public remove(token: string): void {
    localStorage.removeItem(token);
  }
}
