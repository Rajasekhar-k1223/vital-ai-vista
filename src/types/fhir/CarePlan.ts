import {
  FHIRResource,
  Identifier,
  CodeableConcept,
  Reference,
  Period,
  Annotation
} from './base';

export interface CarePlan extends FHIRResource {
  resourceType: 'CarePlan';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  replaces?: Reference[];
  partOf?: Reference[];
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown';
  intent: 'proposal' | 'plan' | 'order' | 'option';
  category?: CodeableConcept[];
  title?: string;
  description?: string;
  subject: Reference; // Patient
  encounter?: Reference;
  period?: Period;
  created?: string;
  author?: Reference;
  contributor?: Reference[];
  careTeam?: Reference[];
  addresses?: Reference[];
  supportingInfo?: Reference[];
  goal?: Reference[];
  activity?: CarePlanActivity[];
  note?: Annotation[];
}

export interface CarePlanActivity {
  outcomeCodeableConcept?: CodeableConcept[];
  outcomeReference?: Reference[];
  progress?: Annotation[];
  reference?: Reference;
  detail?: CarePlanActivityDetail;
}

export interface CarePlanActivityDetail {
  kind?: 'Appointment' | 'CommunicationRequest' | 'DeviceRequest' | 'MedicationRequest' | 'NutritionOrder' | 'Task' | 'ServiceRequest' | 'VisionPrescription';
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  code?: CodeableConcept;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  goal?: Reference[];
  status: 'not-started' | 'scheduled' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled' | 'stopped' | 'unknown' | 'entered-in-error';
  statusReason?: CodeableConcept;
  doNotPerform?: boolean;
  scheduledTiming?: any;
  scheduledPeriod?: Period;
  scheduledString?: string;
  location?: Reference;
  performer?: Reference[];
  productCodeableConcept?: CodeableConcept;
  productReference?: Reference;
  dailyAmount?: any;
  quantity?: any;
  description?: string;
}
