/**
 * @name exports
 * @static
 * @summary Arguments for the explanationofbenefit query
 */
module.exports = {
  'care-team': {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.careTeam.provider',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-care-team',
    description: 'Member of the CareTeam'
  },
  claim: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.claim',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-claim',
    description: 'The reference to the claim'
  },
  coverage: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.insurance.coverage',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-coverage',
    description: 'The plan under which the claim was adjudicated'
  },
  created: {
    type: 'date',
    fhirtype: 'date',
    xpath: 'ExplanationOfBenefit.created',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-created',
    description: 'The creation date for the EOB'
  },
  'detail-udi': {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.item.detail.udi',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-detail-udi',
    description: 'UDI associated with a line item detail product or service'
  },
  disposition: {
    type: 'string',
    fhirtype: 'string',
    xpath: 'ExplanationOfBenefit.disposition',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-disposition',
    description: 'The contents of the disposition message'
  },
  encounter: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.item.encounter',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-encounter',
    description: 'Encounters associated with a billed line item'
  },
  enterer: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.enterer',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-enterer',
    description: 'The party responsible for the entry of the Claim'
  },
  facility: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.facility',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-facility',
    description: 'Facility responsible for the goods and services'
  },
  identifier: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'ExplanationOfBenefit.identifier',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-identifier',
    description: 'The business identifier of the Explanation of Benefit'
  },
  'item-udi': {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.item.udi',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-item-udi',
    description: 'UDI associated with a line item product or service'
  },
  patient: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.patient',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-patient',
    description: 'The reference to the patient'
  },
  payee: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.payee.party',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-payee',
    description: 'The party receiving any payment for the Claim'
  },
  'procedure-udi': {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.procedure.udi',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-procedure-udi',
    description: 'UDI associated with a procedure'
  },
  provider: {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.provider',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-provider',
    description: 'The reference to the provider'
  },
  status: {
    type: 'token',
    fhirtype: 'token',
    xpath: 'ExplanationOfBenefit.status',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-status',
    description: 'Status of the instance'
  },
  'subdetail-udi': {
    type: 'reference',
    fhirtype: 'reference',
    xpath: 'ExplanationOfBenefit.item.detail.subDetail.udi',
    definition: 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-subdetail-udi',
    description: 'UDI associated with a line item detail subdetail product or service'
  }
};
