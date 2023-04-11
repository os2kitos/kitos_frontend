import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbContext } from '../../models/breadcrumbs/breadcrumb-context.model';
import { BreadCrumb } from '../../models/breadcrumbs/breadcrumb.model';

@Component({
  selector: 'app-breadcrumb[breadCrumb][context]',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input() public breadCrumb!: BreadCrumb;
  @Input() public context!: BreadCrumbContext;

  constructor(private router: Router) {}

  public itemClicked() {
    const commands = this.context.routerCommands;
    if (commands) {
      this.router.navigate(commands);
    }
  }
}
