import { Component, Input } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { LocalAdminImportEntityType } from 'src/app/shared/enums/local-admin-import-entity-type';

@Component({
  selector: 'app-local-admin-import',
  templateUrl: './local-admin-import.component.html',
  styleUrl: './local-admin-import.component.scss',
})
export class LocalAdminImportComponent {
  public readonly contractsType = LocalAdminImportEntityType.contracts;
  public readonly usersType = LocalAdminImportEntityType.users;
  public readonly ImportSelectOption = LocalAdminImportEntityType;
  public readonly helpTextKey = 'local-config.import.organization';

  @Input() public selected = LocalAdminImportEntityType.organization;

  public showingOptions: SegmentButtonOption<LocalAdminImportEntityType>[] = [
    { text: $localize`Organisation`, value: LocalAdminImportEntityType.organization },
    { text: $localize`Brugere`, value: LocalAdminImportEntityType.users },
    { text: $localize`IT Kontrakter`, value: LocalAdminImportEntityType.contracts },
  ];
}
