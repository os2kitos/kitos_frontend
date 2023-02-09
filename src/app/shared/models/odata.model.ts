export interface OData {
  '@odata.context': string;
  '@odata.count': number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}
