export const completionRequestSchema = {
    type: "object",
    properties: {
        studentCourseId: {
            type: "number"
        },
        evidence: {
            type: "string"
        }
    },
    required: ["studentCourseId", "evidence"]
}