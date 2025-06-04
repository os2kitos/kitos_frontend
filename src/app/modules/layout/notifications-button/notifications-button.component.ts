import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, of } from 'rxjs';
import { AppPath } from 'src/app/shared/enums/app-path';
import { selectAllAlertCount } from 'src/app/store/alerts/selectors';
import {
  selectShowItSystemModule,
  selectShowItContractModule,
  selectShowDataProcessingRegistrations,
} from 'src/app/store/organization/selectors';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { MatBadge } from '@angular/material/badge';
import { NotificationIconComponent } from '../../../shared/components/icons/notification-icon.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-notifications-button',
  templateUrl: './notifications-button.component.html',
  styleUrl: './notifications-button.component.scss',
  imports: [ButtonComponent, RouterLinkActive, MatBadge, RouterLink, NotificationIconComponent, AsyncPipe],
})
export class NotificationsButtonComponent {
  public readonly alertsCount$ = this.store.select(selectAllAlertCount);

  private readonly itSystemsEnabled$ = this.store.select(selectShowItSystemModule);
  private readonly itContractsEnabled$ = this.store.select(selectShowItContractModule);
  private readonly dataProcessingEnabled$ = this.store.select(selectShowDataProcessingRegistrations);

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  public getFullRoute$(): Observable<string> {
    return this.getSubRoute$().pipe(map((route) => `notifications/${route}`));
  }

  private getSubRoute$(): Observable<string> {
    const subRoute = this.getSubroute();
    if (subRoute === AppPath.root) {
      return this.getDefaultNotificationPage$();
    } else {
      return of(subRoute);
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

  private getDefaultNotificationPage$(): Observable<string> {
    return combineLatest([this.itSystemsEnabled$, this.itContractsEnabled$, this.dataProcessingEnabled$]).pipe(
      map(([itSystemsEnabled, itContractsEnabled, dataProcessingEnabled]) => {
        if (itSystemsEnabled) return AppPath.itSystems;
        if (itContractsEnabled) return AppPath.itContracts;
        if (dataProcessingEnabled) return AppPath.dataProcessing;
        return AppPath.root;
      }),
    );
  }
}
