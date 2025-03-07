/**
 * @name exports
 * @static
 * @summary Arguments for the auditevent query
 */
module.exports = {
  action: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'AuditEvent.action',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-action',
    description: 'Type of action performed during the event'
  },
  address: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'AuditEvent.agent.network.address',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-address',
    description: 'Identifier for the network access point of the user device'
  },
  agent: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'AuditEvent.agent.who',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-agent',
    description: 'Identifier of who'
  },
  'agent-name': {
    type: 'string',
    fhirtype: 'string',
    xpath: 'AuditEvent.agent.name',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-agent-name',
    description: 'Human friendly name for the agent'
  },
  'agent-role': {
    type: 'token',
    fhirtype: 'token',
    xpath: 'AuditEvent.agent.role',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-agent-role',
    description: 'Agent role in the event'
  },
  altid: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'AuditEvent.agent.altId',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-altid',
    description: 'Alternative User identity'
  },
  date: {
    type: 'date',
    fhirtype: 'date',
    xpath: 'AuditEvent.recorded',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-date',
    description: 'Time when the event was recorded'
  },
  entity: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'AuditEvent.entity.what',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-entity',
    description: 'Specific instance of resource'
  },
  'entity-name': {
    type: 'string',
    fhirtype: 'string',
    xpath: 'AuditEvent.entity.name',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-entity-name',
    description: 'Descriptor for entity'
  },
  'entity-role': {
    type: 'token',
    fhirtype: 'token',
    xpath: 'AuditEvent.entity.role',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-entity-role',
    description: 'What role the entity played'
  },
  'entity-type': {
    type: 'token',
    fhirtype: 'token',
    xpath: 'AuditEvent.entity.type',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-entity-type',
    description: 'Type of entity involved'
  },
  outcome: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'AuditEvent.outcome',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-outcome',
    description: 'Whether the event succeeded or failed'
  },
  patient: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'AuditEvent.agent.who',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-patient',
    description: 'Identifier of who'
  },
  policy: {
    type: 'uri',
    fhirtype: 'uri',
    xpath: 'AuditEvent.agent.policy',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-policy',
    description: 'Policy that authorized event'
  },
  site: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'AuditEvent.source.site',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-site',
    description: 'Logical source location within the enterprise'
  },
  source: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'AuditEvent.source.observer',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-source',
    description: 'The identity of source detecting the event'
  },
  subtype: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'AuditEvent.subtype',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-subtype',
    description: 'More specific type/id for the event'
  },
  type: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'AuditEvent.type',
    definition: 'http://hl7.org/fhir/SearchParameter/AuditEvent-type',
    description: 'Type/identifier of event'
  }
};
