import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, first, map, Observable } from 'rxjs';
import { AppPath } from 'src/app/shared/enums/app-path';
import { selectAllAlertCount } from 'src/app/store/alerts/selectors';
import {
  selectShowItSystemModule,
  selectShowItContractModule,
  selectShowDataProcessingRegistrations,
} from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-notifications-button',
  templateUrl: './notifications-button.component.html',
  styleUrl: './notifications-button.component.scss',
})
export class NotificationsButtonComponent {
  public readonly alertsCount$ = this.store.select(selectAllAlertCount);

  private readonly itSystemsEnabled$ = this.store.select(selectShowItSystemModule);
  private readonly itContractsEnabled$ = this.store.select(selectShowItContractModule);
  private readonly dataProcessingEnabled$ = this.store.select(selectShowDataProcessingRegistrations);

  constructor(private store: Store, private router: Router) {}

  public navigateToNotifications() {
    const subRoute = this.getSubroute();
    if (subRoute === AppPath.root) {
      //Let UI Customization decide the default page
      this.getDefaultNotificationPage()
        .pipe(first())
        .subscribe((defaultPage) => {
          this.router.navigate([`${AppPath.notifications}/${defaultPage}`]);
        });
    } else {
      this.router.navigate([`${AppPath.notifications}/${subRoute}`]);
    }
  }

  private getSubroute(): string {
    const moduleRoute = this.getModuleRoute();
    switch (moduleRoute) {
      case AppPath.itSystems:
      case AppPath.itContracts:
      case AppPath.dataProcessing:
        return moduleRoute;
      default:
        return AppPath.root;
    }
  }

  private getModuleRoute(): string {
    const currentRoute = this.router.url;
    const splitRoutes = currentRoute.split('/');
    if (splitRoutes.length < 2) return AppPath.root;
    const moduleRoute = splitRoutes[1];
    return moduleRoute;
  }

  private getDefaultNotificationPage(): Observable<string> {
    return combineLatest([this.itSystemsEnabled$, this.itContractsEnabled$, this.dataProcessingEnabled$]).pipe(
      map(([itSystemsEnabled, itContractsEnabled, dataProcessingEnabled]) => {
        if (itSystemsEnabled) return AppPath.itSystems;
        if (itContractsEnabled) return AppPath.itContracts;
        if (dataProcessingEnabled) return AppPath.dataProcessing;
        return AppPath.root;
      })
    );
  }
}
