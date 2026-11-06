import { APIInvoiceFrequencyChoice } from 'src/app/api/v2';

export const invoiceFrequencyChoiceOptions = Object.values(APIInvoiceFrequencyChoice).map((value) => ({
  name: formatInvoiceFrequency(value),
  value,
}));

export function formatInvoiceFrequency(value: APIInvoiceFrequencyChoice | null | undefined): string {
  switch (value) {
    case APIInvoiceFrequencyChoice.Yearly:
      return $localize`Årligt`;
    case APIInvoiceFrequencyChoice.HalfYearly:
      return $localize`Halvårligt`;
    case APIInvoiceFrequencyChoice.Quarterly:
      return $localize`Kvartalvis`;
    default:
      return '';
  }
}
