import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectDataProcessingMainContract } from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-data-processing-it-contracts',
  templateUrl: './data-processing-it-contracts.component.html',
  styleUrl: './data-processing-it-contracts.component.scss',
})
export class DataProcessingItContractsComponent extends BaseComponent implements OnInit {
  public readonly mainContract$ = this.store.select(selectDataProcessingMainContract);

  public contractFormGroup = new FormGroup({
    mainContract: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
  });

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
