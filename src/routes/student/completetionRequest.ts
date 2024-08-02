import express from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        let completionRequest = {
            studentCourseId: req.body.id,
            evidence: req.body.evidence
        }
        const userData = req.query.userData as any;
        let student = await prisma.student.findUnique({
            where: {
                userId: userData.id
            }
        });
        if (!student) return res.status(400).json({ errors: "Student not found" });
        let courseStudent = await prisma.studentCourses.findMany({
            where: {
                studentId: student.id,
                id: completionRequest.studentCourseId
            }
        });
        if (!courseStudent) return res.status(400).json({ errors: "Enrolled Course not found" });
        let checkRequest = await prisma.courseCompletionRequest.findFirst({
            where: {
                studentCourseId: completionRequest.studentCourseId,
            }
        });
        if (checkRequest) return res.status(400).json({ errors: "Request already sent" });
        let request = await prisma.courseCompletionRequest.create({
            data: {
                studentCourseId: completionRequest.studentCourseId,
                evidence: completionRequest.evidence
            }
        });
        res.status(200).json({ request });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
})