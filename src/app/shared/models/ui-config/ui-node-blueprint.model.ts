export interface UINodeBlueprint {
  text: string;
  isObligatory?: boolean;
  children?: Record<string, UINodeBlueprint>;
  fullKey?: string;
  helpText?: string;
  disableIfSubtreeDisabled?: boolean;
}
