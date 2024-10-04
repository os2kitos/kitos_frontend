import { Component } from '@angular/core';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
  selector: 'app-local-admin',
  templateUrl: './local-admin.component.html',
  styleUrl: './local-admin.component.scss',
})
export class LocalAdminComponent {
  public readonly AppPath = AppPath;
}
