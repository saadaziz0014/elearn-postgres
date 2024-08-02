export const createUserSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 8
        },
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
            minLength: 8
        },
        phone: {
            type: 'string',
            minLength: 10
        },
        class: {
            type: 'string'
        }
    },
    required: ['name', 'email', 'password', 'phone', 'class']
}