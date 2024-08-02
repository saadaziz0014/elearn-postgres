export const changePasswordSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
        oldPassword: {
            type: 'string',
        },
        newPassword: {
            type: 'string',
            minLength: 8
        }
    },
    required: ['email', 'oldPassword', 'newPassword']
}