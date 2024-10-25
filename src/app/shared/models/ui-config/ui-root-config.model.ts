import { APIUIRootConfigResponseDTO } from "src/app/api/v2";

export interface UIRootConfig {
  showItContractModule?: boolean;
  showDataProcessing?: boolean;
  showItSystemModule?: boolean;
}

export function mapUIRootConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dto: any): UIRootConfig {
  return {
    showItContractModule: dto.showItContractModule,
    showDataProcessing: dto.showDataProcessing,
    showItSystemModule: dto.showItSystemModule,
  };
}
