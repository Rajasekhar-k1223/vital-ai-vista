import {
  FHIRResource,
  Identifier,
  CodeableConcept,
  Reference,
  Period
} from './base';

export interface Appointment extends FHIRResource {
  resourceType: 'Appointment';
  identifier?: Identifier[];
  status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow' | 'entered-in-error' | 'checked-in' | 'waitlist';
  cancelationReason?: CodeableConcept;
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  appointmentType?: CodeableConcept;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  priority?: number;
  description?: string;
  supportingInformation?: Reference[];
  start?: string;
  end?: string;
  minutesDuration?: number;
  slot?: Reference[];
  created?: string;
  comment?: string;
  patientInstruction?: string;
  basedOn?: Reference[];
  participant: AppointmentParticipant[];
  requestedPeriod?: Period[];
}

export interface AppointmentParticipant {
  type?: CodeableConcept[];
  actor?: Reference;
  required?: 'required' | 'optional' | 'information-only';
  status: 'accepted' | 'declined' | 'tentative' | 'needs-action';
  period?: Period;
}
