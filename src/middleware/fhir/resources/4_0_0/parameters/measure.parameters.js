/**
 * @name exports
 * @static
 * @summary Arguments for the measure query
 */
module.exports = {
  'composed-of': {
    type: 'reference',
    fhirtype: 'reference',
    xpath: "Measure.relatedArtifact[type/@value='composed-of'].resource",
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-composed-of',
    description: 'What resource is being referenced'
  },
  context: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Measure.useContext.valueCodeableConcept',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-context',
    description: 'A use context assigned to the measure'
  },
  'context-quantity': {
    type: 'quantity',
    fhirtype: 'quantity',
    xpath: 'Measure.useContext.valueQuantity',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-context-quantity',
    description: 'A quantity- or range-valued use context assigned to the measure'
  },
  'context-type': {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Measure.useContext.code',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-context-type',
    description: 'A type of use context assigned to the measure'
  },
  date: {
    type: 'date',
    fhirtype: 'date',
    xpath: 'Measure.date',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-date',
    description: 'The measure publication date'
  },
  'depends-on': {
    type: 'reference',
    fhirtype: 'reference',
    xpath: "Measure.relatedArtifact[type/@value='depends-on'].resource",
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-depends-on',
    description: 'What resource is being referenced'
  },
  'derived-from': {
    type: 'reference',
    fhirtype: 'reference',
    xpath: "Measure.relatedArtifact[type/@value='derived-from'].resource",
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-derived-from',
    description: 'What resource is being referenced'
  },
  description: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'Measure.description',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-description',
    description: 'The description of the measure'
  },
  effective: {
    type: 'date',
    fhirtype: 'date',
    xpath: 'Measure.effectivePeriod',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-effective',
    description: 'The time during which the measure is intended to be in use'
  },
  identifier: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Measure.identifier',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-identifier',
    description: 'External identifier for the measure'
  },
  jurisdiction: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Measure.jurisdiction',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-jurisdiction',
    description: 'Intended jurisdiction for the measure'
  },
  name: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'Measure.name',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-name',
    description: 'Computationally friendly name of the measure'
  },
  predecessor: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: "Measure.relatedArtifact[type/@value='predecessor'].resource",
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-predecessor',
    description: 'What resource is being referenced'
  },
  publisher: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'Measure.publisher',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-publisher',
    description: 'Name of the publisher of the measure'
  },
  status: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Measure.status',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-status',
    description: 'The current status of the measure'
  },
  successor: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: "Measure.relatedArtifact[type/@value='successor'].resource",
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-successor',
    description: 'What resource is being referenced'
  },
  title: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'Measure.title',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-title',
    description: 'The human-friendly name of the measure'
  },
  topic: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Measure.topic',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-topic',
    description: 'Topics associated with the measure'
  },
  url: {
    type: 'uri',
    fhirtype: 'uri',
    xpath: 'Measure.url',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-url',
    description: 'The uri that identifies the measure'
  },
  version: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'Measure.version',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-version',
    description: 'The business version of the measure'
  },
  'context-type-quantity': {
    type: 'composite',
    fhirtype: 'composite',
    xpath: '',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-context-type-quantity',
    description: 'A use context type and quantity- or range-based value assigned to the measure'
  },
  'context-type-value': {
    type: 'composite',
    fhirtype: 'composite',
    xpath: '',
    definition: 'http://hl7.org/fhir/SearchParameter/Measure-context-type-value',
    description: 'A use context type and value assigned to the measure'
  }
};
