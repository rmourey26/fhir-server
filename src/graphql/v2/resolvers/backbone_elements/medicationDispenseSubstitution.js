// ------ This code is generated by a code generator.  Do not edit. ------


// noinspection JSUnusedLocalSymbols
module.exports = {
    MedicationDispenseSubstitutionResponsibleParty: {
        __resolveType(obj, context, info) {
            return context.dataApi.resolveType(obj, context, info);
        },
    },
    MedicationDispenseSubstitution: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        responsibleParty: async (parent, args, context, info) => {
            return await context.dataApi.findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.responsibleParty);
        },
    }
};

