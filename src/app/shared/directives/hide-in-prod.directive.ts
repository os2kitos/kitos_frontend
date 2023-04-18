import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[appHideInProd]',
})
export class HideInProdDirective implements OnInit {
  constructor(private templateRef: TemplateRef<unknown>, private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    if (environment.env !== 'production') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
