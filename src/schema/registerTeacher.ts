export const registerTeacherSchema = {
    type: "object",
    properties: {
        specialization: {
            type: "string",
        },
        experience: {
            type: "number",
        }
    },
    required: ["specialization", "experience"]
}