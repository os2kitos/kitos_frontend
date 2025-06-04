import { Component } from '@angular/core';
import { Environment } from 'src/app/shared/models/environment';
import { EnvironmentService } from 'src/app/shared/services/environment.service';

@Component({
  selector: 'app-test-environment-ribbon',
  imports: [],
  templateUrl: './test-environment-ribbon.component.html',
  styleUrl: './test-environment-ribbon.component.scss'
})
export class TestEnvironmentRibbonComponent {
  public environment: Environment;

  constructor(environmentService: EnvironmentService) {
    this.environment = environmentService.current;
  }
}
