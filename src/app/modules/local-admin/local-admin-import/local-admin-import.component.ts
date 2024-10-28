import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIRootConfigActions } from 'src/app/store/local-admin/ui-root-config/actions';

enum LocalAdminImportTabOptions {
  organization = 'organization',
  users = 'users',
  contracts = 'contracts',
}

@Component({
  selector: 'app-local-admin-import',
  templateUrl: './local-admin-import.component.html',
  styleUrl: './local-admin-import.component.scss',
})
export class LocalAdminImportComponent implements OnInit {

  constructor(private readonly store: Store){}

  ngOnInit(): void {
    this.store.dispatch(UIRootConfigActions.setCurrentTabModuleKey({ moduleKey: undefined }));

  }
  public readonly ImportSelectOption = LocalAdminImportTabOptions;

  @Input() public selected = LocalAdminImportTabOptions.organization;

  public showingOptions: SegmentButtonOption<LocalAdminImportTabOptions>[] = [
    { text: $localize`Organisation`, value: LocalAdminImportTabOptions.organization },
    { text: $localize`Brugere`, value: LocalAdminImportTabOptions.users },
    { text: $localize`IT Kontrakter`, value: LocalAdminImportTabOptions.contracts },
  ];
}
