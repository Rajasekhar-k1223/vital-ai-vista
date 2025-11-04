import {
  FHIRResource,
  Identifier,
  CodeableConcept,
  Reference,
  Period,
  Address,
  Quantity
} from './base';

export interface Claim extends FHIRResource {
  resourceType: 'Claim';
  identifier?: Identifier[];
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  type: CodeableConcept;
  subType?: CodeableConcept;
  use: 'claim' | 'preauthorization' | 'predetermination';
  patient: Reference;
  billablePeriod?: Period;
  created: string;
  enterer?: Reference;
  insurer?: Reference;
  provider: Reference;
  priority: CodeableConcept;
  fundsReserve?: CodeableConcept;
  related?: ClaimRelated[];
  prescription?: Reference;
  originalPrescription?: Reference;
  payee?: ClaimPayee;
  referral?: Reference;
  facility?: Reference;
  careTeam?: ClaimCareTeam[];
  supportingInfo?: ClaimSupportingInfo[];
  diagnosis?: ClaimDiagnosis[];
  procedure?: ClaimProcedure[];
  insurance: ClaimInsurance[];
  accident?: ClaimAccident;
  item?: ClaimItem[];
  total?: Money;
}

export interface Money {
  value?: number;
  currency?: string;
}

export interface ClaimRelated {
  claim?: Reference;
  relationship?: CodeableConcept;
  reference?: Identifier;
}

export interface ClaimPayee {
  type: CodeableConcept;
  party?: Reference;
}

export interface ClaimCareTeam {
  sequence: number;
  provider: Reference;
  responsible?: boolean;
  role?: CodeableConcept;
  qualification?: CodeableConcept;
}

export interface ClaimSupportingInfo {
  sequence: number;
  category: CodeableConcept;
  code?: CodeableConcept;
  timingDate?: string;
  timingPeriod?: Period;
  valueBoolean?: boolean;
  valueString?: string;
  valueQuantity?: Quantity;
  valueAttachment?: any;
  valueReference?: Reference;
  reason?: CodeableConcept;
}

export interface ClaimDiagnosis {
  sequence: number;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
  type?: CodeableConcept[];
  onAdmission?: CodeableConcept;
  packageCode?: CodeableConcept;
}

export interface ClaimProcedure {
  sequence: number;
  type?: CodeableConcept[];
  date?: string;
  procedureCodeableConcept?: CodeableConcept;
  procedureReference?: Reference;
  udi?: Reference[];
}

export interface ClaimInsurance {
  sequence: number;
  focal: boolean;
  identifier?: Identifier;
  coverage: Reference;
  businessArrangement?: string;
  preAuthRef?: string[];
  claimResponse?: Reference;
}

export interface ClaimAccident {
  date: string;
  type?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
}

export interface ClaimItem {
  sequence: number;
  careTeamSequence?: number[];
  diagnosisSequence?: number[];
  procedureSequence?: number[];
  informationSequence?: number[];
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  servicedDate?: string;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
  bodySite?: CodeableConcept;
  subSite?: CodeableConcept[];
  encounter?: Reference[];
  detail?: ClaimItemDetail[];
}

export interface ClaimItemDetail {
  sequence: number;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
  subDetail?: ClaimItemSubDetail[];
}

export interface ClaimItemSubDetail {
  sequence: number;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
}
