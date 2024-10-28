/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders, HttpParameterCodec } from '@angular/common/http';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { CustomHttpParameterCodec } from 'src/app/api/v1/encoder';
import { APIV2ExcelInternalINTERNALService, Configuration } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { APIExcelService } from 'src/app/shared/services/excel.service';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-local-admin-base-excel-export',
  templateUrl: './local-admin-base-excel-export.component.html',
  styleUrl: './local-admin-base-excel-export.component.scss',
})
export class LocalAdminBaseExcelExportComponent {
  public readonly excelForm: FormGroup;
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid).pipe(filterNullish());
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  protected basePath = 'https://kitos-dev.strongminds.dk';
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private httpClient: HttpClient,
    @Inject(APIV2ExcelInternalINTERNALService) private apiService: APIV2ExcelInternalINTERNALService,
    @Optional() configuration: Configuration,
    @Inject(APIExcelService) private excelService: APIExcelService
  ) {
    this.excelForm = this.fb.group({
      file: [null, Validators.required],
    });
    if (configuration) {
      this.configuration = configuration;
    }
    this.configuration.basePath = this.basePath;

    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }

  fileImported(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.excelForm.patchValue({
        file: file,
      });
      this.excelForm.get('file')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.excelForm.valid) {
      const formData = new FormData();
      formData.append('file', this.excelForm.get('file')?.value);

      this.organizationUuid$.pipe(first()).subscribe((orgUuid) => {
        this.apiService.postSingleExcelInternalV2PostOrgUnits(
          { organizationUuid: orgUuid, importOrgUnits: true },
          formData
        );
        //this.excelService.postSingleExcelInternalV2PostOrgUnits({ organizationUuid: orgUuid, importOrgUnits: true });
      });
      // Handle the form submission, e.g., send the form data to the server
      // You can use a service to send the form data to the server
      // this.yourService.uploadFile(formData).subscribe(response => {
      //   console.log('Upload successful', response);
      // });
    }
  }
}
