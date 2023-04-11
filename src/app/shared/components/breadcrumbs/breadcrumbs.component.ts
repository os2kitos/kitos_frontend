import { Component, Input } from '@angular/core';
import { BreadCrumbContext } from '../../models/breadcrumbs/breadcrumb-context.model';
import { BreadCrumb } from '../../models/breadcrumbs/breadcrumb.model';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: 'breadcrumbs.component.html',
  styleUrls: ['breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  public breadCrumbs?: { item: BreadCrumb; context: BreadCrumbContext }[];

  @Input() public set items(items: BreadCrumb[] | null) {
    if (items) {
      const newBreadCrumbs = [];
      const routerCommands: Array<string> = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        if (item.routerLink) {
          routerCommands.push(item.routerLink);
        }
        newBreadCrumbs.push({
          item: items[i],
          context: {
            last: i == items.length - 1,
            routerCommands: item.routerLink ? [...routerCommands] : undefined,
          },
        });
      }
      this.breadCrumbs = newBreadCrumbs;
    } else {
      this.breadCrumbs = undefined;
    }
  }
}
