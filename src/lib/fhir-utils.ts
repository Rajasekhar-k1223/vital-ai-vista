// FHIR Helper Functions and Coding Systems

import type { 
  HumanName, 
  ContactPoint, 
  Address, 
  CodeableConcept, 
  Coding, 
  Identifier,
  Reference 
} from '@/types/fhir/base';

// ===== Coding System URLs =====
export const CODING_SYSTEMS = {
  LOINC: 'http://loinc.org',
  SNOMED: 'http://snomed.info/sct',
  RXNORM: 'http://www.nlm.nih.gov/research/umls/rxnorm',
  ICD10: 'http://hl7.org/fhir/sid/icd-10',
  UCUM: 'http://unitsofmeasure.org',
  MRN: 'http://hospital.example.org/mrn',
  NPI: 'http://hl7.org/fhir/sid/us-npi'
};

// ===== Common LOINC Codes for Observations =====
export const LOINC_CODES = {
  BLOOD_PRESSURE: '85354-9',
  SYSTOLIC_BP: '8480-6',
  DIASTOLIC_BP: '8462-4',
  HEART_RATE: '8867-4',
  BODY_TEMPERATURE: '8310-5',
  RESPIRATORY_RATE: '9279-1',
  OXYGEN_SATURATION: '2708-6',
  BODY_WEIGHT: '29463-7',
  BODY_HEIGHT: '8302-2',
  BMI: '39156-5',
  GLUCOSE: '2339-0',
  HEMOGLOBIN: '718-7',
  WHITE_BLOOD_CELL: '6690-2'
};

// ===== Helper Functions =====

export function createHumanName(
  family: string, 
  given: string | string[], 
  use: 'usual' | 'official' = 'official'
): HumanName {
  return {
    use,
    family,
    given: Array.isArray(given) ? given : [given],
    text: `${Array.isArray(given) ? given.join(' ') : given} ${family}`
  };
}

export function getDisplayName(names?: HumanName[]): string {
  if (!names || names.length === 0) return 'Unknown';
  const name = names.find(n => n.use === 'official') || names[0];
  return name.text || `${name.given?.join(' ') || ''} ${name.family || ''}`.trim();
}

export function createContactPoint(
  system: 'phone' | 'email',
  value: string,
  use: 'home' | 'work' | 'mobile' = 'work'
): ContactPoint {
  return { system, value, use };
}

export function getContactValue(
  telecom?: ContactPoint[], 
  system: 'phone' | 'email' = 'phone'
): string {
  return telecom?.find(t => t.system === system)?.value || 'N/A';
}

export function createAddress(
  line: string | string[],
  city: string,
  state: string,
  postalCode: string,
  country: string = 'USA'
): Address {
  return {
    use: 'home',
    type: 'physical',
    line: Array.isArray(line) ? line : [line],
    city,
    state,
    postalCode,
    country,
    text: `${Array.isArray(line) ? line.join(', ') : line}, ${city}, ${state} ${postalCode}`
  };
}

export function getAddressText(addresses?: Address[]): string {
  if (!addresses || addresses.length === 0) return 'N/A';
  const addr = addresses[0];
  return addr.text || `${addr.line?.join(', ')}, ${addr.city}, ${addr.state} ${addr.postalCode}`;
}

export function createCodeableConcept(
  system: string,
  code: string,
  display: string
): CodeableConcept {
  return {
    coding: [{ system, code, display }],
    text: display
  };
}

export function getCodeDisplay(concept?: CodeableConcept): string {
  return concept?.text || concept?.coding?.[0]?.display || 'Unknown';
}

export function createIdentifier(
  system: string,
  value: string,
  use: 'usual' | 'official' = 'official'
): Identifier {
  return { system, value, use };
}

export function getIdentifierValue(
  identifiers?: Identifier[], 
  system?: string
): string {
  if (!identifiers || identifiers.length === 0) return 'N/A';
  if (system) {
    return identifiers.find(i => i.system === system)?.value || 'N/A';
  }
  return identifiers[0]?.value || 'N/A';
}

export function createReference(
  resourceType: string,
  id: string,
  display?: string
): Reference {
  return {
    reference: `${resourceType}/${id}`,
    type: resourceType,
    display
  };
}

// ===== Common SNOMED Codes =====
export const SNOMED_CODES = {
  // Encounter Types
  AMBULATORY: '185349003',
  EMERGENCY: '50849002',
  INPATIENT: '32485007',
  
  // Conditions
  DIABETES_MELLITUS: '73211009',
  HYPERTENSION: '38341003',
  ASTHMA: '195967001',
  CHEST_PAIN: '29857009',
  
  // Procedures
  ANNUAL_PHYSICAL: '185349003',
  FOLLOW_UP: '308335008'
};

// ===== Status Badge Helpers =====
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'final':
    case 'finished':
    case 'completed':
      return 'status-active';
    case 'in-progress':
    case 'preliminary':
      return 'status-warning';
    case 'planned':
    case 'registered':
      return 'status-info';
    case 'cancelled':
    case 'entered-in-error':
    case 'stopped':
      return 'status-inactive';
    default:
      return 'status-info';
  }
}

// ===== Date Formatters =====
export function formatFHIRDate(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

export function formatFHIRDateTime(date: Date): string {
  return date.toISOString();
}

export function parseFHIRDate(dateString?: string): Date | undefined {
  return dateString ? new Date(dateString) : undefined;
}
