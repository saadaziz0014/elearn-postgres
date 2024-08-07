export const videoSchema = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
        },
        url: {
            type: 'string'
        }
    },
    required: ['title', 'url']
}