/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
// This file is auto-generated by generate_classes so do not edit manually

const Resource = require('../resources/resource');
const async = require('async');


/**
MedicinalProductIndication
    Indication for the Medicinal Product.
    If the element is present, it must have either a @value, an @id, or extensions
*/
class MedicinalProductIndication extends Resource {
    /**
     * @param {id|undefined} [id],
     * @param {Meta|undefined} [meta],
     * @param {uri|undefined} [implicitRules],
     * @param {code|undefined} [language],
     * @param {Narrative|undefined} [text],
     * @param {ResourceContainer[]|undefined} [contained],
     * @param {Extension[]|undefined} [extension],
     * @param {Extension[]|undefined} [modifierExtension],
     * @param {Reference[]|undefined} [subject],
     * @param {CodeableConcept|undefined} [diseaseSymptomProcedure],
     * @param {CodeableConcept|undefined} [diseaseStatus],
     * @param {CodeableConcept[]|undefined} [comorbidity],
     * @param {CodeableConcept|undefined} [intendedEffect],
     * @param {Quantity|undefined} [duration],
     * @param {MedicinalProductIndicationOtherTherapy[]|undefined} [otherTherapy],
     * @param {Reference[]|undefined} [undesirableEffect],
     * @param {Population[]|undefined} [population],
     * @param {Object|undefined} [_access]
     * @param {string|undefined} [_sourceAssigningAuthority]
     * @param {string|undefined} [_uuid]
     * @param {string|undefined} [_sourceId]
    */
    constructor(
        {
            id,
            meta,
            implicitRules,
            language,
            text,
            contained,
            extension,
            modifierExtension,
            subject,
            diseaseSymptomProcedure,
            diseaseStatus,
            comorbidity,
            intendedEffect,
            duration,
            otherTherapy,
            undesirableEffect,
            population,
            _access,
            _sourceAssigningAuthority,
            _uuid,
            _sourceId,
        }
    ) {
        super({});

        // ---- Define getters and setters as enumerable ---

        /**
         * @description The logical id of the resource, as used in the URL for the resource. Once
    assigned, this value never changes.
         * @property {id|undefined}
        */
        Object.defineProperty(this, 'id', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.id,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.id = undefined;
                    return;
                }
                this.__data.id = valueProvided;
            }
        });

        /**
         * @description The metadata about the resource. This is content that is maintained by the
    infrastructure. Changes to the content might not always be associated with
    version changes to the resource.
         * @property {Meta|undefined}
        */
        Object.defineProperty(this, 'meta', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.meta,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.meta = undefined;
                    return;
                }
                const Meta = require('../complex_types/meta.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.meta = FhirResourceCreator.create(valueProvided, Meta);
            }
        });

        /**
         * @description A reference to a set of rules that were followed when the resource was
    constructed, and which must be understood when processing the content. Often,
    this is a reference to an implementation guide that defines the special rules
    along with other profiles etc.
         * @property {uri|undefined}
        */
        Object.defineProperty(this, 'implicitRules', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.implicitRules,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.implicitRules = undefined;
                    return;
                }
                this.__data.implicitRules = valueProvided;
            }
        });

        /**
         * @description The base language in which the resource is written.
         * @property {code|undefined}
        */
        Object.defineProperty(this, 'language', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.language,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.language = undefined;
                    return;
                }
                this.__data.language = valueProvided;
            }
        });

        /**
         * @description A human-readable narrative that contains a summary of the resource and can be
    used to represent the content of the resource to a human. The narrative need
    not encode all the structured data, but is required to contain sufficient
    detail to make it "clinically safe" for a human to just read the narrative.
    Resource definitions may define what content should be represented in the
    narrative to ensure clinical safety.
         * @property {Narrative|undefined}
        */
        Object.defineProperty(this, 'text', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.text,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.text = undefined;
                    return;
                }
                const Narrative = require('../complex_types/narrative.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.text = FhirResourceCreator.create(valueProvided, Narrative);
            }
        });

        /**
         * @description These resources do not have an independent existence apart from the resource
    that contains them - they cannot be identified independently, and nor can they
    have their own independent transaction scope.
         * @property {ResourceContainer[]|undefined}
        */
        Object.defineProperty(this, 'contained', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.contained,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.contained = undefined;
                    return;
                }
                const ResourceContainer = require('../simple_types/resourceContainer.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.contained = FhirResourceCreator.createArray(valueProvided);
            }
        });

        /**
         * @description May be used to represent additional information that is not part of the basic
    definition of the resource. To make the use of extensions safe and manageable,
    there is a strict set of governance  applied to the definition and use of
    extensions. Though any implementer can define an extension, there is a set of
    requirements that SHALL be met as part of the definition of the extension.
         * @property {Extension[]|undefined}
        */
        Object.defineProperty(this, 'extension', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.extension,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.extension = undefined;
                    return;
                }
                const Extension = require('../complex_types/extension.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.extension = FhirResourceCreator.createArray(valueProvided, Extension);
            }
        });

        /**
         * @description May be used to represent additional information that is not part of the basic
    definition of the resource and that modifies the understanding of the element
    that contains it and/or the understanding of the containing element's
    descendants. Usually modifier elements provide negation or qualification. To
    make the use of extensions safe and manageable, there is a strict set of
    governance applied to the definition and use of extensions. Though any
    implementer is allowed to define an extension, there is a set of requirements
    that SHALL be met as part of the definition of the extension. Applications
    processing a resource are required to check for modifier extensions.
    
    Modifier extensions SHALL NOT change the meaning of any elements on Resource
    or DomainResource (including cannot change the meaning of modifierExtension
    itself).
         * @property {Extension[]|undefined}
        */
        Object.defineProperty(this, 'modifierExtension', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.modifierExtension,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.modifierExtension = undefined;
                    return;
                }
                const Extension = require('../complex_types/extension.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.modifierExtension = FhirResourceCreator.createArray(valueProvided, Extension);
            }
        });

        /**
         * @description The medication for which this is an indication.
         * @property {Reference[]|undefined}
        */
        Object.defineProperty(this, 'subject', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.subject,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.subject = undefined;
                    return;
                }
                const Reference = require('../complex_types/reference.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.subject = FhirResourceCreator.createArray(valueProvided, Reference);
            }
        });

        /**
         * @description The disease, symptom or procedure that is the indication for treatment.
         * @property {CodeableConcept|undefined}
        */
        Object.defineProperty(this, 'diseaseSymptomProcedure', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.diseaseSymptomProcedure,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.diseaseSymptomProcedure = undefined;
                    return;
                }
                const CodeableConcept = require('../complex_types/codeableConcept.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.diseaseSymptomProcedure = FhirResourceCreator.create(valueProvided, CodeableConcept);
            }
        });

        /**
         * @description The status of the disease or symptom for which the indication applies.
         * @property {CodeableConcept|undefined}
        */
        Object.defineProperty(this, 'diseaseStatus', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.diseaseStatus,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.diseaseStatus = undefined;
                    return;
                }
                const CodeableConcept = require('../complex_types/codeableConcept.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.diseaseStatus = FhirResourceCreator.create(valueProvided, CodeableConcept);
            }
        });

        /**
         * @description Comorbidity (concurrent condition) or co-infection as part of the indication.
         * @property {CodeableConcept[]|undefined}
        */
        Object.defineProperty(this, 'comorbidity', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.comorbidity,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.comorbidity = undefined;
                    return;
                }
                const CodeableConcept = require('../complex_types/codeableConcept.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.comorbidity = FhirResourceCreator.createArray(valueProvided, CodeableConcept);
            }
        });

        /**
         * @description The intended effect, aim or strategy to be achieved by the indication.
         * @property {CodeableConcept|undefined}
        */
        Object.defineProperty(this, 'intendedEffect', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.intendedEffect,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.intendedEffect = undefined;
                    return;
                }
                const CodeableConcept = require('../complex_types/codeableConcept.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.intendedEffect = FhirResourceCreator.create(valueProvided, CodeableConcept);
            }
        });

        /**
         * @description Timing or duration information as part of the indication.
         * @property {Quantity|undefined}
        */
        Object.defineProperty(this, 'duration', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.duration,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.duration = undefined;
                    return;
                }
                const Quantity = require('../complex_types/quantity.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.duration = FhirResourceCreator.create(valueProvided, Quantity);
            }
        });

        /**
         * @description Information about the use of the medicinal product in relation to other
    therapies described as part of the indication.
         * @property {MedicinalProductIndicationOtherTherapy[]|undefined}
        */
        Object.defineProperty(this, 'otherTherapy', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.otherTherapy,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.otherTherapy = undefined;
                    return;
                }
                const MedicinalProductIndicationOtherTherapy = require('../backbone_elements/medicinalProductIndicationOtherTherapy.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.otherTherapy = FhirResourceCreator.createArray(valueProvided, MedicinalProductIndicationOtherTherapy);
            }
        });

        /**
         * @description Describe the undesirable effects of the medicinal product.
         * @property {Reference[]|undefined}
        */
        Object.defineProperty(this, 'undesirableEffect', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.undesirableEffect,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.undesirableEffect = undefined;
                    return;
                }
                const Reference = require('../complex_types/reference.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.undesirableEffect = FhirResourceCreator.createArray(valueProvided, Reference);
            }
        });

        /**
         * @description The population group to which this applies.
         * @property {Population[]|undefined}
        */
        Object.defineProperty(this, 'population', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.population,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.population = undefined;
                    return;
                }
                const Population = require('../backbone_elements/population.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.population = FhirResourceCreator.createArray(valueProvided, Population);
            }
        });


        /**
         * @description _access
         * @property {Object|undefined}
         */
        Object.defineProperty(this, '_access', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data._access,
            set: valueProvided => {
                this.__data._access = valueProvided;
            }
        });
        /**
         * @description _sourceAssigningAuthority
         * @property {string|undefined}
         */
        Object.defineProperty(this, '_sourceAssigningAuthority', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data._sourceAssigningAuthority,
            set: valueProvided => {
                this.__data._sourceAssigningAuthority = valueProvided;
            }
        });
        /**
         * @description _uuid
         * @property {string|undefined}
         */
        Object.defineProperty(this, '_uuid', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data._uuid,
            set: valueProvided => {
                this.__data._uuid = valueProvided;
            }
        });
        /**
         * @description _sourceId
         * @property {string|undefined}
         */
        Object.defineProperty(this, '_sourceId', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data._sourceId,
            set: valueProvided => {
                this.__data._sourceId = valueProvided;
            }
        });


        // --- Now copy properties from passed in object ----
        Object.assign(this, {
            id,
            meta,
            implicitRules,
            language,
            text,
            contained,
            extension,
            modifierExtension,
            subject,
            diseaseSymptomProcedure,
            diseaseStatus,
            comorbidity,
            intendedEffect,
            duration,
            otherTherapy,
            undesirableEffect,
            population,
            _access,
            _sourceAssigningAuthority,
            _uuid,
            _sourceId,
        });

        /**
         * @description Define a default non-writable resourceType property
         * @property {string|undefined}
         */
        Object.defineProperty(this, 'resourceType', {
            value: 'MedicinalProductIndication',
            enumerable: true,
            writable: false,
            configurable: true
        });
    }

    /**
     * @description Define a default non-writable resourceType property
     * @property {string|undefined}
     */
    static get resourceType() {
        return 'MedicinalProductIndication';
    }

    /**
     * @description Creates a blank new resource
     * @param {id|undefined} [id],
     * @param {Meta|undefined} [meta],
     * @param {uri|undefined} [implicitRules],
     * @param {code|undefined} [language],
     * @param {Narrative|undefined} [text],
     * @param {ResourceContainer[]|undefined} [contained],
     * @param {Extension[]|undefined} [extension],
     * @param {Extension[]|undefined} [modifierExtension],
     * @param {Reference[]|undefined} [subject],
     * @param {CodeableConcept|undefined} [diseaseSymptomProcedure],
     * @param {CodeableConcept|undefined} [diseaseStatus],
     * @param {CodeableConcept[]|undefined} [comorbidity],
     * @param {CodeableConcept|undefined} [intendedEffect],
     * @param {Quantity|undefined} [duration],
     * @param {MedicinalProductIndicationOtherTherapy[]|undefined} [otherTherapy],
     * @param {Reference[]|undefined} [undesirableEffect],
     * @param {Population[]|undefined} [population],
     * @param {Object|undefined} [_access]
     * @param {string|undefined} [_sourceAssigningAuthority]
     * @param {string|undefined} [_uuid]
     * @param {string|undefined} [_sourceId]
     * @returns {MedicinalProductIndication}
    */
    create(
            {
            id,
            meta,
            implicitRules,
            language,
            text,
            contained,
            extension,
            modifierExtension,
            subject,
            diseaseSymptomProcedure,
            diseaseStatus,
            comorbidity,
            intendedEffect,
            duration,
            otherTherapy,
            undesirableEffect,
            population,
            _access,
            _sourceAssigningAuthority,
            _uuid,
            _sourceId,
        }
    ) {
        return new MedicinalProductIndication({
            id,
            meta,
            implicitRules,
            language,
            text,
            contained,
            extension,
            modifierExtension,
            subject,
            diseaseSymptomProcedure,
            diseaseStatus,
            comorbidity,
            intendedEffect,
            duration,
            otherTherapy,
            undesirableEffect,
            population,
            _access,
            _sourceAssigningAuthority,
            _uuid,
            _sourceId,
        });
    }

    /**
     * @description creates a copy of this resource
     * @returns {MedicinalProductIndication}
    */
    clone() {
        return new MedicinalProductIndication(this.toJSONInternal());
    }


    /**
     * Returns JSON representation of entity
     * @return {Object}
     */
    toJSON() {
        const {removeNull} = require('../../../../utils/nullRemover');

        return removeNull({
            resourceType: this.resourceType,
            id: this.id,
            meta: this.meta && this.meta.toJSON(),
            implicitRules: this.implicitRules,
            language: this.language,
            text: this.text && this.text.toJSON(),
            contained: this.contained && this.contained.map(v => v.toJSON()),
            extension: this.extension && this.extension.map(v => v.toJSON()),
            modifierExtension: this.modifierExtension && this.modifierExtension.map(v => v.toJSON()),
            subject: this.subject && this.subject.map(v => v.toJSON()),
            diseaseSymptomProcedure: this.diseaseSymptomProcedure && this.diseaseSymptomProcedure.toJSON(),
            diseaseStatus: this.diseaseStatus && this.diseaseStatus.toJSON(),
            comorbidity: this.comorbidity && this.comorbidity.map(v => v.toJSON()),
            intendedEffect: this.intendedEffect && this.intendedEffect.toJSON(),
            duration: this.duration && this.duration.toJSON(),
            otherTherapy: this.otherTherapy && this.otherTherapy.map(v => v.toJSON()),
            undesirableEffect: this.undesirableEffect && this.undesirableEffect.map(v => v.toJSON()),
            population: this.population && this.population.map(v => v.toJSON()),
        });
    }

    /**
     * Returns JSON representation of entity
     * @param {function(Reference): Promise<Reference>} fnUpdateReferenceAsync
     * @return {void}
     */
    async updateReferencesAsync({fnUpdateReferenceAsync}) {
            if (this.meta) {await this.meta.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.text) {await this.text.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.contained) {await async.each(this.contained, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
            if (this.extension) {await async.each(this.extension, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
            if (this.modifierExtension) {await async.each(this.modifierExtension, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
            if (this.subject) {await async.each(this.subject, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
            if (this.diseaseSymptomProcedure) {await this.diseaseSymptomProcedure.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.diseaseStatus) {await this.diseaseStatus.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.comorbidity) {await async.each(this.comorbidity, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
            if (this.intendedEffect) {await this.intendedEffect.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.duration) {await this.duration.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.otherTherapy) {await async.each(this.otherTherapy, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
            if (this.undesirableEffect) {await async.each(this.undesirableEffect, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
            if (this.population) {await async.each(this.population, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
    }

    /**
     * Returns JSON representation of entity
     * @return {Object}
     */
    toJSONInternal() {
        const {removeNull} = require('../../../../utils/nullRemover');
        const json = {
            resourceType: this.resourceType,
            id: this.id,
            meta: this.meta && this.meta.toJSONInternal(),
            implicitRules: this.implicitRules,
            language: this.language,
            text: this.text && this.text.toJSONInternal(),
            contained: this.contained && this.contained.map(v => v.toJSONInternal()),
            extension: this.extension && this.extension.map(v => v.toJSONInternal()),
            modifierExtension: this.modifierExtension && this.modifierExtension.map(v => v.toJSONInternal()),
            subject: this.subject && this.subject.map(v => v.toJSONInternal()),
            diseaseSymptomProcedure: this.diseaseSymptomProcedure && this.diseaseSymptomProcedure.toJSONInternal(),
            diseaseStatus: this.diseaseStatus && this.diseaseStatus.toJSONInternal(),
            comorbidity: this.comorbidity && this.comorbidity.map(v => v.toJSONInternal()),
            intendedEffect: this.intendedEffect && this.intendedEffect.toJSONInternal(),
            duration: this.duration && this.duration.toJSONInternal(),
            otherTherapy: this.otherTherapy && this.otherTherapy.map(v => v.toJSONInternal()),
            undesirableEffect: this.undesirableEffect && this.undesirableEffect.map(v => v.toJSONInternal()),
            population: this.population && this.population.map(v => v.toJSONInternal()),
        };


        if (this._access) {
            json._access = this._access;
        }
        if (this._sourceAssigningAuthority) {
            json._sourceAssigningAuthority = this._sourceAssigningAuthority;
        }
        if (this._uuid) {
            json._uuid = this._uuid;
        }
        if (this._sourceId) {
            json._sourceId = this._sourceId;
        }

        return removeNull(json);
    }
}

module.exports = MedicinalProductIndication;
