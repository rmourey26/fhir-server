// ------ This code is generated by a code generator.  Do not edit. ------


// noinspection JSUnusedLocalSymbols
module.exports = {
    PatientContact: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        organization: async (parent, args, context, info) => {
            return await context.dataApi.findResourceByReference(
                parent,
                args,
                context,
                info,
                parent.organization);
        },
    }
};

