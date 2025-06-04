export interface HasUuid {
  uuid: string;
}

export function toUuid(obj: HasUuid): string {
  return obj.uuid;
}
