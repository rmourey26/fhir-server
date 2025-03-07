/**
 * @name exports
 * @static
 * @summary Arguments for the questionnaire query
 */
module.exports = {
  code: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Questionnaire.item.code',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-code',
    description: 'A code that corresponds to one of its items in the questionnaire'
  },
  context: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Questionnaire.useContext.valueCodeableConcept',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-context',
    description: 'A use context assigned to the questionnaire'
  },
  'context-quantity': {
    type: 'quantity',
    fhirtype: 'quantity',
    xpath: 'Questionnaire.useContext.valueQuantity',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-context-quantity',
    description: 'A quantity- or range-valued use context assigned to the questionnaire'
  },
  'context-type': {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Questionnaire.useContext.code',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-context-type',
    description: 'A type of use context assigned to the questionnaire'
  },
  date: {
    type: 'date',
    fhirtype: 'date',
    xpath: 'Questionnaire.date',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-date',
    description: 'The questionnaire publication date'
  },
  definition: {
    type: 'uri',
    fhirtype: 'uri',
    xpath: 'Questionnaire.item.definition',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-definition',
    description: 'ElementDefinition - details for the item'
  },
  description: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'Questionnaire.description',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-description',
    description: 'The description of the questionnaire'
  },
  effective: {
    type: 'date',
    fhirtype: 'date',
    xpath: 'Questionnaire.effectivePeriod',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-effective',
    description: 'The time during which the questionnaire is intended to be in use'
  },
  identifier: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Questionnaire.identifier',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-identifier',
    description: 'External identifier for the questionnaire'
  },
  jurisdiction: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Questionnaire.jurisdiction',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-jurisdiction',
    description: 'Intended jurisdiction for the questionnaire'
  },
  name: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'Questionnaire.name',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-name',
    description: 'Computationally friendly name of the questionnaire'
  },
  publisher: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'Questionnaire.publisher',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-publisher',
    description: 'Name of the publisher of the questionnaire'
  },
  status: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Questionnaire.status',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-status',
    description: 'The current status of the questionnaire'
  },
  'subject-type': {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Questionnaire.subjectType',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-subject-type',
    description: 'Resource that can be subject of QuestionnaireResponse'
  },
  title: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'Questionnaire.title',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-title',
    description: 'The human-friendly name of the questionnaire'
  },
  url: {
    type: 'uri',
    fhirtype: 'uri',
    xpath: 'Questionnaire.url',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-url',
    description: 'The uri that identifies the questionnaire'
  },
  version: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Questionnaire.version',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-version',
    description: 'The business version of the questionnaire'
  },
  'context-type-quantity': {
    type: 'composite',
    fhirtype: 'composite',
    xpath: '',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-context-type-quantity',
    description: 'A use context type and quantity- or range-based value assigned to the questionnaire'
  },
  'context-type-value': {
    type: 'composite',
    fhirtype: 'composite',
    xpath: '',
    definition: 'http://hl7.org/fhir/SearchParameter/Questionnaire-context-type-value',
    description: 'A use context type and value assigned to the questionnaire'
  }
};
