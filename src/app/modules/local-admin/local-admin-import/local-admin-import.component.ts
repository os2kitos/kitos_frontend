import { Component, Input } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';

export enum LocalAdminImportTabOptions {
  organization = 'organization',
  users = 'users',
  contracts = 'contracts',
}

@Component({
  selector: 'app-local-admin-import',
  templateUrl: './local-admin-import.component.html',
  styleUrl: './local-admin-import.component.scss',
})
export class LocalAdminImportComponent {
  public readonly contractsType = LocalAdminImportTabOptions.contracts;
  public readonly usersType = LocalAdminImportTabOptions.users;
  public readonly ImportSelectOption = LocalAdminImportTabOptions;

  @Input() public selected = LocalAdminImportTabOptions.organization;

  public showingOptions: SegmentButtonOption<LocalAdminImportTabOptions>[] = [
    { text: $localize`Organisation`, value: LocalAdminImportTabOptions.organization },
    { text: $localize`Brugere`, value: LocalAdminImportTabOptions.users },
    { text: $localize`IT Kontrakter`, value: LocalAdminImportTabOptions.contracts },
  ];
}
