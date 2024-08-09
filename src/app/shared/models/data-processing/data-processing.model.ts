export interface DataProcessingRegistration {
  id: string;
  name: string;
  disabled: boolean;
  lastChangedById: number;
  lastChangedAt: string;
  activeAccordingToMainContract: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptDataProcessingRegistration = (value: any): DataProcessingRegistration | undefined => {
  if (!value.SourceEntityUuid) return;

  return {
    id: value.SourceEntityUuid,
    name: value.Name,
    disabled: value.IsActive === 'false',
    lastChangedById: value.LastChangedById,
    lastChangedAt: value.LastChangedAt,
    activeAccordingToMainContract: value.activeAccordingToMainContract
  };
};
