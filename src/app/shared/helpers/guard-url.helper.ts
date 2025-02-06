import { UrlSerializer, UrlTree } from '@angular/router';

export function extractRoute(urlSerializer: UrlSerializer, url: string): string {
  //The StartupGuardService is called twice if there's an existing url, because of that we have to check if returnUrl is already present
  if (url.includes('returnUrl')) {
    // Remove 'returnUrl' and anything after it
    const returnUrl = url.split('?returnUrl=')[1] || '';
    return decodeURIComponent(returnUrl);
  } else {
    // Extract the path
    const urlTree: UrlTree = urlSerializer.parse(url);
    return urlTree.root.children['primary']?.segments.map((segment) => segment.path).join('/') || '';
  }
}
