export interface UIConfigNodeViewModel {
  text: string;
  helpText?: string;
  fullKey: string;
  isObligatory?: boolean;
  isEnabled?: boolean;
  children?: UIConfigNodeViewModel[];
}


