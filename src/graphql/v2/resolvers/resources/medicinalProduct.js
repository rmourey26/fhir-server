// ------ This code is generated by a code generator.  Do not edit. ------

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        medicinalProduct: async (parent, args, context, info) => {
            return await context.dataApi.getResourcesBundle(
                parent,
                args,
                context,
                info,
                'MedicinalProduct'
            );
        }
    },
    MedicinalProductContact: {
        __resolveType(obj, context, info) {
            return context.dataApi.resolveType(obj, context, info);
        },
    },
    MedicinalProduct: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        pharmaceuticalProduct: async (parent, args, context, info) => {
            return await context.dataApi.findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.pharmaceuticalProduct);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        packagedMedicinalProduct: async (parent, args, context, info) => {
            return await context.dataApi.findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.packagedMedicinalProduct);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        attachedDocument: async (parent, args, context, info) => {
            return await context.dataApi.findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.attachedDocument);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        masterFile: async (parent, args, context, info) => {
            return await context.dataApi.findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.masterFile);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        contact: async (parent, args, context, info) => {
            return await context.dataApi.findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.contact);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        clinicalTrial: async (parent, args, context, info) => {
            return await context.dataApi.findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.clinicalTrial);
        },
    }
};

