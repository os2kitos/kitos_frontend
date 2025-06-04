import { Directive, ElementRef, OnDestroy, OnInit, Optional } from '@angular/core';
import { Router, RouterLink, UrlTree } from '@angular/router';
import { verifyClickAndOpenNewTab } from '../helpers/navigation/ctrl-click.helpers';

@Directive({ selector: '[appCtrlClick]' })
export class CtrlClickDirective implements OnInit, OnDestroy {
  private captureClickListener!: (event: MouseEvent) => void;

  constructor(private router: Router, @Optional() private routerLink: RouterLink, private el: ElementRef) {}

  private readonly clickEventName = 'click';
  private readonly auxClickEventName = 'auxclick';

  ngOnInit(): void {
    this.captureClickListener = this.onCaptureClick.bind(this);
    this.el.nativeElement.addEventListener(this.clickEventName, this.captureClickListener, true);
    this.el.nativeElement.addEventListener(this.auxClickEventName, this.captureClickListener, true);
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener(this.clickEventName, this.captureClickListener, true);
    this.el.nativeElement.removeEventListener(this.auxClickEventName, this.captureClickListener, true);
  }

  private onCaptureClick(event: MouseEvent): void {
    if (!this.routerLink) return;

    const relativeUrl = this.router.serializeUrl(this.routerLink.urlTree ?? new UrlTree());
    const baseHref = document.querySelector('base')?.getAttribute('href') || '/';

    const fullUrl = window.location.origin + baseHref.replace(/\/?$/, '/') + relativeUrl.replace(/^\//, '');

    verifyClickAndOpenNewTab(event, fullUrl);
  }
}
