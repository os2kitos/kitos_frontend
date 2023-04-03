import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { uniqueId } from 'lodash';
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
      for (let i = 0; i < items.length; ++i) {
        newBreadCrumbs.push({
          item: items[i],
          context: {
            last: i == items.length - 1,
            uuid: uniqueId('breadcrumb_'),
          },
        });
      }
      this.breadCrumbs = newBreadCrumbs;
    } else {
      this.breadCrumbs = undefined;
    }
  }

  constructor(private router: Router) {}

  public onItemClick(uuid: string) {
    if (!this.breadCrumbs) return;

    const selectedItemIndex = this.breadCrumbs.findIndex((breadCrumb) => uuid === breadCrumb.context.uuid);

    if (selectedItemIndex !== -1) {
      const url = this.breadCrumbs.slice(0, selectedItemIndex + 1).map((i) => i.item.routerLink);
      this.router.navigate(url);
    } else {
      console.error('Failed to locate index for breadcrumb uuid:', uuid);
    }
  }
}
