import { PathLocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { trim } from 'lodash';

@Injectable({
  providedIn: 'root',
})
/**
 * Service to resolve the true app root regardless of environment
 */
export class AppRootUrlResolverServiceService {
  constructor(private readonly pathLocationStrategy: PathLocationStrategy) {}

  public resolveRootUrl() {
    const basePath = trim(this.pathLocationStrategy.getBaseHref(), '/');
    const origin = window.location.origin;
    const root = basePath === '' ? origin : `${origin}/${basePath}`;
    return root;
  }
}
