export interface UIConfigNodeViewModel {
  module?: string;
  text: string;
  helpText?: string;
  fullKey: string;
  isObligatory?: boolean;
  isEnabled?: boolean;
  cannotBeRecommended?: boolean;
  isRecommended?: boolean;
  disableIfSubtreeDisabled?: boolean;
  children?: UIConfigNodeViewModel[];
}
