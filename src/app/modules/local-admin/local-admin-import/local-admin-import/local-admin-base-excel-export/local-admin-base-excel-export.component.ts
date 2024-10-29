/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, first, map, mergeMap, of } from 'rxjs';
import { APIV2ExcelInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ExcelImportActions } from 'src/app/store/local-admin/excel-import/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-local-admin-base-excel-export',
  templateUrl: './local-admin-base-excel-export.component.html',
  styleUrl: './local-admin-base-excel-export.component.scss',
})
export class LocalAdminBaseExcelExportComponent {
  public readonly excelForm: FormGroup;
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid).pipe(filterNullish());
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private httpClient: HttpClient,
    @Inject(APIV2ExcelInternalINTERNALService) private apiService: APIV2ExcelInternalINTERNALService //@Inject(APIExcelService) private excelService: APIExcelService
  ) {
    this.excelForm = this.fb.group({
      file: [null, Validators.required],
    });
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

      //this.store.dispatch(ExcelImportActions.excelImport('OrganizationUnits'));
      this.organizationUuid$
        .pipe(
          first(),
          mergeMap((orgUuid) => {
            const serviceCall = this.apiService.postSingleExcelInternalV2PostOrgUnits(
              { organizationUuid: orgUuid, importOrgUnits: true, body: formData },
              undefined,
              undefined,
              { httpHeaderAccept: 'multipart/form-data' as any, context: undefined }
            );

            return serviceCall.pipe(
              map(() => ExcelImportActions.excelImportSuccess()),
              catchError(() => of(ExcelImportActions.excelImportError()))
            );
          })
        )
        .subscribe();
      /* () => {
        // this.store.dispatch(ExcelImportActions.excelImport('OrganizationUnits'));

        //this.excelService.postSingleExcelInternalV2PostOrgUnits({ organizationUuid: orgUuid, importOrgUnits: true });
      } */
      // Handle the form submission, e.g., send the form data to the server
      // You can use a service to send the form data to the server
      // this.yourService.uploadFile(formData).subscribe(response => {
      //   console.log('Upload successful', response);
      // });
    }
  }
}
