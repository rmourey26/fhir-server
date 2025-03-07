/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
// This file is auto-generated by generate_classes so do not edit manually

const Element = require('../complex_types/element');
const Resource = require('../resources/resource');
const async = require('async');


/**
SpecimenDefinition.Container
    A kind of specimen with associated set of requirements.
*/
class SpecimenDefinitionContainer extends Element {
    /**
     * @param {String|undefined} [id],
     * @param {Extension[]|undefined} [extension],
     * @param {Extension[]|undefined} [modifierExtension],
     * @param {CodeableConcept|undefined} [material],
     * @param {CodeableConcept|undefined} [type],
     * @param {CodeableConcept|undefined} [cap],
     * @param {String|undefined} [description],
     * @param {Quantity|undefined} [capacity],
     * @param {Quantity|undefined} [minimumVolumeQuantity],
     * @param {String|undefined} [minimumVolumeString],
     * @param {SpecimenDefinitionAdditive[]|undefined} [additive],
     * @param {String|undefined} [preparation],
    */
    constructor(
        {
            id,
            extension,
            modifierExtension,
            material,
            type,
            cap,
            description,
            capacity,
            minimumVolumeQuantity,
            minimumVolumeString,
            additive,
            preparation,
        }
    ) {
        super({});

        // ---- Define getters and setters as enumerable ---

        /**
         * @description None
         * @property {String|undefined}
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
         * @description May be used to represent additional information that is not part of the basic
    definition of the element. To make the use of extensions safe and manageable,
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
    definition of the element and that modifies the understanding of the element
    in which it is contained and/or the understanding of the containing element's
    descendants. Usually modifier elements provide negation or qualification. To
    make the use of extensions safe and manageable, there is a strict set of
    governance applied to the definition and use of extensions. Though any
    implementer can define an extension, there is a set of requirements that SHALL
    be met as part of the definition of the extension. Applications processing a
    resource are required to check for modifier extensions.
    
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
         * @description The type of material of the container.
         * @property {CodeableConcept|undefined}
        */
        Object.defineProperty(this, 'material', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.material,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.material = undefined;
                    return;
                }
                const CodeableConcept = require('../complex_types/codeableConcept.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.material = FhirResourceCreator.create(valueProvided, CodeableConcept);
            }
        });

        /**
         * @description The type of container used to contain this kind of specimen.
         * @property {CodeableConcept|undefined}
        */
        Object.defineProperty(this, 'type', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.type,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.type = undefined;
                    return;
                }
                const CodeableConcept = require('../complex_types/codeableConcept.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.type = FhirResourceCreator.create(valueProvided, CodeableConcept);
            }
        });

        /**
         * @description Color of container cap.
         * @property {CodeableConcept|undefined}
        */
        Object.defineProperty(this, 'cap', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.cap,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.cap = undefined;
                    return;
                }
                const CodeableConcept = require('../complex_types/codeableConcept.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.cap = FhirResourceCreator.create(valueProvided, CodeableConcept);
            }
        });

        /**
         * @description The textual description of the kind of container.
         * @property {String|undefined}
        */
        Object.defineProperty(this, 'description', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.description,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.description = undefined;
                    return;
                }
                this.__data.description = valueProvided;
            }
        });

        /**
         * @description The capacity (volume or other measure) of this kind of container.
         * @property {Quantity|undefined}
        */
        Object.defineProperty(this, 'capacity', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.capacity,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.capacity = undefined;
                    return;
                }
                const Quantity = require('../complex_types/quantity.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.capacity = FhirResourceCreator.create(valueProvided, Quantity);
            }
        });

        /**
         * @description None
         * @property {Quantity|undefined}
        */
        Object.defineProperty(this, 'minimumVolumeQuantity', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.minimumVolumeQuantity,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.minimumVolumeQuantity = undefined;
                    return;
                }
                const Quantity = require('../complex_types/quantity.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.minimumVolumeQuantity = FhirResourceCreator.create(valueProvided, Quantity);
            }
        });

        /**
         * @description None
         * @property {String|undefined}
        */
        Object.defineProperty(this, 'minimumVolumeString', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.minimumVolumeString,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.minimumVolumeString = undefined;
                    return;
                }
                this.__data.minimumVolumeString = valueProvided;
            }
        });

        /**
         * @description Substance introduced in the kind of container to preserve, maintain or enhance
    the specimen. Examples: Formalin, Citrate, EDTA.
         * @property {SpecimenDefinitionAdditive[]|undefined}
        */
        Object.defineProperty(this, 'additive', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.additive,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.additive = undefined;
                    return;
                }
                const SpecimenDefinitionAdditive = require('../backbone_elements/specimenDefinitionAdditive.js');
                const {FhirResourceCreator} = require('../../../fhirResourceCreator');
                this.__data.additive = FhirResourceCreator.createArray(valueProvided, SpecimenDefinitionAdditive);
            }
        });

        /**
         * @description Special processing that should be applied to the container for this kind of
    specimen.
         * @property {String|undefined}
        */
        Object.defineProperty(this, 'preparation', {
            // https://www.w3schools.com/js/js_object_es5.asp
            enumerable: true,
            configurable: true,
            get: () => this.__data.preparation,
            set: valueProvided => {
                if (valueProvided === undefined || valueProvided === null || (Array.isArray(valueProvided) && valueProvided.length === 0)) {
                    this.__data.preparation = undefined;
                    return;
                }
                this.__data.preparation = valueProvided;
            }
        });




        // --- Now copy properties from passed in object ----
        Object.assign(this, {
            id,
            extension,
            modifierExtension,
            material,
            type,
            cap,
            description,
            capacity,
            minimumVolumeQuantity,
            minimumVolumeString,
            additive,
            preparation,
        });

    }



    /**
     * Returns JSON representation of entity
     * @return {Object}
     */
    toJSON() {
        const {removeNull} = require('../../../../utils/nullRemover');

        return removeNull({
            id: this.id,
            extension: this.extension && this.extension.map(v => v.toJSON()),
            modifierExtension: this.modifierExtension && this.modifierExtension.map(v => v.toJSON()),
            material: this.material && this.material.toJSON(),
            type: this.type && this.type.toJSON(),
            cap: this.cap && this.cap.toJSON(),
            description: this.description,
            capacity: this.capacity && this.capacity.toJSON(),
            minimumVolumeQuantity: this.minimumVolumeQuantity && this.minimumVolumeQuantity.toJSON(),
            minimumVolumeString: this.minimumVolumeString,
            additive: this.additive && this.additive.map(v => v.toJSON()),
            preparation: this.preparation,
        });
    }

    /**
     * Returns JSON representation of entity
     * @param {function(Reference): Promise<Reference>} fnUpdateReferenceAsync
     * @return {void}
     */
    async updateReferencesAsync({fnUpdateReferenceAsync}) {
            if (this.extension) {await async.each(this.extension, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
            if (this.modifierExtension) {await async.each(this.modifierExtension, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
            if (this.material) {await this.material.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.type) {await this.type.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.cap) {await this.cap.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.capacity) {await this.capacity.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.minimumVolumeQuantity) {await this.minimumVolumeQuantity.updateReferencesAsync({fnUpdateReferenceAsync});}
            if (this.additive) {await async.each(this.additive, async v => await v.updateReferencesAsync({fnUpdateReferenceAsync}));}
    }

    /**
     * Returns JSON representation of entity
     * @return {Object}
     */
    toJSONInternal() {
        const {removeNull} = require('../../../../utils/nullRemover');
        const json = {
            id: this.id,
            extension: this.extension && this.extension.map(v => v.toJSONInternal()),
            modifierExtension: this.modifierExtension && this.modifierExtension.map(v => v.toJSONInternal()),
            material: this.material && this.material.toJSONInternal(),
            type: this.type && this.type.toJSONInternal(),
            cap: this.cap && this.cap.toJSONInternal(),
            description: this.description,
            capacity: this.capacity && this.capacity.toJSONInternal(),
            minimumVolumeQuantity: this.minimumVolumeQuantity && this.minimumVolumeQuantity.toJSONInternal(),
            minimumVolumeString: this.minimumVolumeString,
            additive: this.additive && this.additive.map(v => v.toJSONInternal()),
            preparation: this.preparation,
        };



        return removeNull(json);
    }
}

module.exports = SpecimenDefinitionContainer;
