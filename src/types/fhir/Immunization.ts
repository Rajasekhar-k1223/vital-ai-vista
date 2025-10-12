import {
  FHIRResource,
  Identifier,
  CodeableConcept,
  Reference,
  Quantity,
  Annotation
} from './base';

export interface Immunization extends FHIRResource {
  resourceType: 'Immunization';
  identifier?: Identifier[];
  status: 'completed' | 'entered-in-error' | 'not-done';
  statusReason?: CodeableConcept;
  vaccineCode: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  occurrenceDateTime?: string;
  occurrenceString?: string;
  recorded?: string;
  primarySource?: boolean;
  reportOrigin?: CodeableConcept;
  location?: Reference;
  manufacturer?: Reference;
  lotNumber?: string;
  expirationDate?: string;
  site?: CodeableConcept;
  route?: CodeableConcept;
  doseQuantity?: Quantity;
  performer?: ImmunizationPerformer[];
  note?: Annotation[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  isSubpotent?: boolean;
  subpotentReason?: CodeableConcept[];
  education?: ImmunizationEducation[];
  programEligibility?: CodeableConcept[];
  fundingSource?: CodeableConcept;
  reaction?: ImmunizationReaction[];
  protocolApplied?: ImmunizationProtocolApplied[];
}

export interface ImmunizationPerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export interface ImmunizationEducation {
  documentType?: string;
  reference?: string;
  publicationDate?: string;
  presentationDate?: string;
}

export interface ImmunizationReaction {
  date?: string;
  detail?: Reference;
  reported?: boolean;
}

export interface ImmunizationProtocolApplied {
  series?: string;
  authority?: Reference;
  targetDisease?: CodeableConcept[];
  doseNumberPositiveInt?: number;
  doseNumberString?: string;
  seriesDosesPositiveInt?: number;
  seriesDosesString?: string;
}
