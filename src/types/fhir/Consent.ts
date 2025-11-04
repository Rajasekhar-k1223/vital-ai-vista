import {
  FHIRResource,
  Identifier,
  CodeableConcept,
  Reference,
  Period,
  Attachment,
  Coding
} from './base';

export interface Consent extends FHIRResource {
  resourceType: 'Consent';
  identifier?: Identifier[];
  status: 'draft' | 'proposed' | 'active' | 'rejected' | 'inactive' | 'entered-in-error';
  scope: CodeableConcept;
  category: CodeableConcept[];
  patient?: Reference;
  dateTime?: string;
  performer?: Reference[];
  organization?: Reference[];
  sourceAttachment?: Attachment;
  sourceReference?: Reference;
  policy?: ConsentPolicy[];
  policyRule?: CodeableConcept;
  verification?: ConsentVerification[];
  provision?: ConsentProvision;
}

export interface ConsentPolicy {
  authority?: string;
  uri?: string;
}

export interface ConsentVerification {
  verified: boolean;
  verifiedWith?: Reference;
  verificationDate?: string;
}

export interface ConsentProvision {
  type?: 'deny' | 'permit';
  period?: Period;
  actor?: ConsentProvisionActor[];
  action?: CodeableConcept[];
  securityLabel?: Coding[];
  purpose?: Coding[];
  class?: Coding[];
  code?: CodeableConcept[];
  dataPeriod?: Period;
  data?: ConsentProvisionData[];
  provision?: ConsentProvision[];
}

export interface ConsentProvisionActor {
  role: CodeableConcept;
  reference: Reference;
}

export interface ConsentProvisionData {
  meaning: 'instance' | 'related' | 'dependents' | 'authoredby';
  reference: Reference;
}
