import {
  FHIRResource,
  Identifier,
  CodeableConcept,
  Reference,
  Annotation,
  Attachment
} from './base';

export interface Communication extends FHIRResource {
  resourceType: 'Communication';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  partOf?: Reference[];
  inResponseTo?: Reference[];
  status: 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed' | 'entered-in-error' | 'unknown';
  statusReason?: CodeableConcept;
  category?: CodeableConcept[];
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  medium?: CodeableConcept[];
  subject?: Reference; // Patient
  topic?: CodeableConcept;
  about?: Reference[];
  encounter?: Reference;
  sent?: string;
  received?: string;
  recipient?: Reference[];
  sender?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  payload?: CommunicationPayload[];
  note?: Annotation[];
}

export interface CommunicationPayload {
  contentString?: string;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
