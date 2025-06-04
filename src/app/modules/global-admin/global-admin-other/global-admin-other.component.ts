import { Component } from '@angular/core';
import { SegmentComponent } from '../../../shared/components/segment/segment.component';
import { NgIf } from '@angular/common';
import { GlobalAdminOtherUserShutdownComponent } from './global-admin-other-user-shutdown/global-admin-other-user-shutdown.component';
import { GlobalAdminSystemIntegratorsComponent } from './global-admin-system-integrators/global-admin-system-integrators.component';
import { GlobalAdminOtherApiUsersComponent } from './global-admin-other-api-users/global-admin-other-api-users.component';
import { GlobalAdminOtherKleComponent } from './global-admin-other-kle/global-admin-other-kle.component';
import { GlobalAdminOtherBrokenLinksComponent } from './global-admin-other-broken-links/global-admin-other-broken-links.component';

export enum GlobalAdminOtherSegmentOptionType {
  UserManagement = 'UserManagement',
  APIUsers = 'APIUsers',
  Misc = 'Misc',
}

@Component({
  selector: 'app-global-admin-other',
  templateUrl: './global-admin-other.component.html',
  styleUrl: './global-admin-other.component.scss',
  imports: [
    SegmentComponent,
    NgIf,
    GlobalAdminOtherUserShutdownComponent,
    GlobalAdminSystemIntegratorsComponent,
    GlobalAdminOtherApiUsersComponent,
    GlobalAdminOtherKleComponent,
    GlobalAdminOtherBrokenLinksComponent,
  ],
})
export class GlobalAdminOtherComponent {
  public readonly SegmentType = GlobalAdminOtherSegmentOptionType;
  public selectedSegment = GlobalAdminOtherSegmentOptionType.UserManagement;

  public readonly segmentOptions = [
    {
      text: $localize`Brugerstyring`,
      value: GlobalAdminOtherSegmentOptionType.UserManagement,
      dataCy: 'user-management-segment',
    },
    { text: $localize`API-brugere`, value: GlobalAdminOtherSegmentOptionType.APIUsers, dataCy: 'api-users-segment' },
    { text: $localize`Diverse`, value: GlobalAdminOtherSegmentOptionType.Misc, dataCy: 'misc-segment' },
  ];
}
