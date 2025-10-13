import {
  FHIRResource,
  Identifier,
  CodeableConcept,
  Reference,
  Annotation,
  Period
} from './base';

export interface AllergyIntolerance extends FHIRResource {
  resourceType: 'AllergyIntolerance';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: 'allergy' | 'intolerance';
  category?: ('food' | 'medication' | 'environment' | 'biologic')[];
  criticality?: 'low' | 'high' | 'unable-to-assess';
  code?: CodeableConcept; // Substance
  patient: Reference;
  encounter?: Reference;
  onsetDateTime?: string;
  onsetAge?: { value?: number; unit?: string };
  onsetPeriod?: Period;
  onsetRange?: { low?: any; high?: any };
  onsetString?: string;
  recordedDate?: string;
  recorder?: Reference;
  asserter?: Reference;
  lastOccurrence?: string;
  note?: Annotation[];
  reaction?: AllergyIntoleranceReaction[];
}

export interface AllergyIntoleranceReaction {
  substance?: CodeableConcept;
  manifestation: CodeableConcept[];
  description?: string;
  onset?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  exposureRoute?: CodeableConcept;
  note?: Annotation[];
}
