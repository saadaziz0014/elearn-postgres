export const courseUpdate = {
    type: "object",
    properties: {
        title: {
            type: "string"
        },
        isActive: {
            type: "boolean"
        }
    },
    required: ['title', 'isActive']
}