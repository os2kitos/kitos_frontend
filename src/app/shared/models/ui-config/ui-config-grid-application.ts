export interface UIConfigGridApplication {
  shouldEnable: boolean;
  columnNamesToConfigure: Set<string>;
  columnNameSubstringsToConfigure?: Set<string>;
}
