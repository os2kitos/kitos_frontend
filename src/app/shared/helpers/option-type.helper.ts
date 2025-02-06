import { RegularOptionType } from '../models/options/regular-option-types.model';
import { RoleOptionTypes } from '../models/options/role-option-types.model';

export function getOptionTypeName(optionType: RegularOptionType | RoleOptionTypes): string {
  switch (optionType) {
    //IT system types
    case 'it-system_business-type':
      return $localize`Forretningstyper`;
    case 'it-system_usage-archive-location-type':
      return $localize`Arkiveringstyper`;
    case 'it-system_usage-archive-location-test-type':
      return $localize`Arkiveringsteststed`;
    case 'it-interface_data-type':
      return $localize`Datatyper`;
    case 'it-system_usage-relation-frequency-type':
      return $localize`Frekvenser`;
    case 'it-interface_interface-type':
      return $localize`Grænseflader`;
    case 'it_system_usage-gdpr-sensitive-data-type':
      return $localize`Følsomme persondata`;
    case 'it_system_usage-gdpr-registered-data-category-type':
      return $localize`Kategorier af registrerede i databehandlingen`;
    case 'it-system_usage-data-classification-type':
      return $localize`Klassifikation af data i systemet`;
    //IT contract types
    case 'it-contract_contract-type':
      return $localize`Kontrakttype`;
    case 'it-contract_contract-template-type':
      return $localize`Kontraktskabeloner`;
    case 'it-contract_purchase-form-type':
      return $localize`Indkøbsformer`;
    case 'it-contract-agreement-element-types':
      return $localize`Aftaleelementer`;
    case 'it-contract-extend-types':
      return $localize`Option forlæng`;
    case 'it-contract-payment-frequency-types':
      return $localize`Betalingsfrekvenser`;
    case 'it-contract-price-regulation-types':
      return $localize`Prisreguleringer`;
    case 'it-contract_procurement-strategy-type':
      return $localize`Genanskaffelsesstrategier`;
    case 'it-contract-termination-period-types':
      return $localize`Opsigelsesfrister`;
    case 'it-contract_criticality-type':
      return $localize`Kritikalitet`;
    //Data processing types
    case 'data-processing-basis-for-transfer-types':
      return $localize`Overførselsgrundlag`;
    case 'data-processing-oversight-option-types':
      return $localize`Tilsynsmuligheder`;
    case 'data-processing-data-responsible-types':
      return $localize`Dataansvarlige`;
    case 'data-processing-country-types':
      return $localize`Lande`;
    //Role types
    case 'it-system-usage':
      return $localize`IT System roller`;
    case 'it-contract':
      return $localize`IT Kontrakt roller`;
    case 'data-processing':
      return $localize`Databehandlingsroller`;
    case 'organization-unit':
      return 'Organisationsroller';
    default:
      throw new Error(`Option type name not implemented for e${optionType}`);
  }
}
