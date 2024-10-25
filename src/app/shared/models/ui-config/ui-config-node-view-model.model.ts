export interface UIConfigNodeViewModel {
  module?: string;
  text: string;
  helpText?: string;
  fullKey: string;
  isObligatory?: boolean;
  isEnabled?: boolean;
  disableIfSubtreeDisabled?: boolean;
  children?: UIConfigNodeViewModel[];
}
