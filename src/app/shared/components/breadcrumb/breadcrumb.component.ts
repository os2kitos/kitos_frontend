import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BreadCrumbContext } from '../../models/breadcrumbs/breadcrumb-context.model';
import { BreadCrumb } from '../../models/breadcrumbs/breadcrumb.model';

@Component({
  selector: 'app-breadcrumb[breadCrumb]',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input() public breadCrumb!: BreadCrumb;
  @Input() public context?: BreadCrumbContext;
  @Output() breadCrumbClicked = new EventEmitter();

  public itemClicked() {
    if (this.breadCrumb.routerLink) {
      this.breadCrumbClicked.emit(this.breadCrumb);
    }
  }
}
