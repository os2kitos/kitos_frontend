import { Component } from '@angular/core';
import { Environment } from 'src/app/shared/models/environment';
import { EnvironmentService } from 'src/app/shared/services/environment.service';

@Component({
  selector: 'app-env-ribbon',
  templateUrl: 'env-ribbon.component.html',
  styleUrls: ['env-ribbon.component.scss'],
})
export class EnvRibbonComponent {
  public environment: Environment;

  constructor(environmentService: EnvironmentService) {
    this.environment = environmentService.current;
  }
}
