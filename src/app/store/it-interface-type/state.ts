import { EntityState } from "@ngrx/entity";
import { APIRegularOptionResponseDTO } from "src/app/api/v2";

export interface InterfaceTypeState extends EntityState<APIRegularOptionResponseDTO>{
  cacheTime: number | undefined;
}
