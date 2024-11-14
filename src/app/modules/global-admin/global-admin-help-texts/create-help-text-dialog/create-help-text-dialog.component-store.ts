import { Inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { Observable, switchMap, tap } from "rxjs";
import { APIV2HelpTextsInternalINTERNALService } from "src/app/api/v2/api/v2HelpTextsInternalINTERNAL.service";
import { APIHelpTextResponseDTO } from "src/app/api/v2/model/helpTextResponseDTO";

interface State {
  isLoading: boolean,
  keyExists: boolean
}

@Injectable()
export class CreateHelpTextDialogComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly keyExists$ = this.select((state) => state.keyExists);

  constructor(@Inject(APIV2HelpTextsInternalINTERNALService) private helpTextsService: APIV2HelpTextsInternalINTERNALService) {
    super({ isLoading: false, keyExists: false });
  }

  public setLoading(isLoading: boolean): void {
    this.patchState({ isLoading });
  }

  public setKeyExists(keyExists: boolean): void {
    this.patchState({ keyExists });
  }

  public checkIfKeyExists = this.effect((key$: Observable<string>) =>
    key$.pipe(
      tap(() => this.setLoading(true)),
      switchMap((key) => {
        return this.helpTextsService.getManyHelpTextsInternalV2GetAll().pipe(
          tapResponse(
            (helpTextDtos) => this.setKeyExists(this.keyIsInArray(helpTextDtos, key)),
            (e) => console.error(e),
            () => this.setLoading(false)
          )
        );
      })
    )
  );

  private keyIsInArray(helpTextDtos: APIHelpTextResponseDTO[], key: string): boolean {
    return helpTextDtos.some((ht) => ht.key === key);
  }
}


