/**
 * OS2Kitos API - V2
 * <b><i>OBS: Dokumentation for V1 findes ved at skifte version på dokumentet til 1 øverst på siden</i></b><br/><br/>KITOS API V2 understøtter både læse- og skriveoperationer for de væsentlige registreringsobjekter i KITOS. <br/><br/>Se mere om designet og konventionerne i API\'et her: <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/2059599873/API+Design+V2\'>API V2</a>.<br/><br/>Generelt er anvendelsen af KITOS API(er) beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
 *
 * The version of the OpenAPI document: 2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface APIItContract { 
    Uuid?: string;
    readonly IsActive?: boolean;
    ReferenceId?: number;
    Name?: string;
    Active?: boolean;
    Note?: string;
    ItContractId?: string;
    SupplierContractSigner?: string;
    HasSupplierSigned?: boolean;
    SupplierSignedDate?: string;
    ContractSigner?: string;
    IsSigned?: boolean;
    SignedDate?: string;
    ResponsibleOrganizationUnitId?: number;
    OrganizationId?: number;
    SupplierId?: number;
    ProcurementStrategyId?: number;
    ProcurementPlanQuarter?: number;
    ProcurementPlanYear?: number;
    ProcurementInitiated?: APIItContract.ProcurementInitiatedEnum;
    ContractTemplateId?: number;
    ContractTypeId?: number;
    PurchaseFormId?: number;
    ParentId?: number;
    CriticalityId?: number;
    Concluded?: string;
    DurationYears?: number;
    DurationMonths?: number;
    DurationOngoing?: boolean;
    IrrevocableTo?: string;
    ExpirationDate?: string;
    Terminated?: string;
    TerminationDeadlineId?: number;
    OptionExtendId?: number;
    ExtendMultiplier?: number;
    Running?: APIItContract.RunningEnum;
    ByEnding?: APIItContract.ByEndingEnum;
    OperationRemunerationBegun?: string;
    PaymentFreqencyId?: number;
    PaymentModelId?: number;
    PriceRegulationId?: number;
    Id?: number;
    ObjectOwnerId?: number;
    LastChanged?: string;
    LastChangedByUserId?: number;
}
export namespace APIItContract {
    export type ProcurementInitiatedEnum = 'Yes' | 'No' | 'Undecided';
    export const ProcurementInitiatedEnum = {
        Yes: 'Yes' as ProcurementInitiatedEnum,
        No: 'No' as ProcurementInitiatedEnum,
        Undecided: 'Undecided' as ProcurementInitiatedEnum
    };
    export type RunningEnum = 'EndOfCalendarYear' | 'EndOfQuarter' | 'EndOfMonth';
    export const RunningEnum = {
        EndOfCalendarYear: 'EndOfCalendarYear' as RunningEnum,
        EndOfQuarter: 'EndOfQuarter' as RunningEnum,
        EndOfMonth: 'EndOfMonth' as RunningEnum
    };
    export type ByEndingEnum = 'EndOfCalendarYear' | 'EndOfQuarter' | 'EndOfMonth';
    export const ByEndingEnum = {
        EndOfCalendarYear: 'EndOfCalendarYear' as ByEndingEnum,
        EndOfQuarter: 'EndOfQuarter' as ByEndingEnum,
        EndOfMonth: 'EndOfMonth' as ByEndingEnum
    };
}


