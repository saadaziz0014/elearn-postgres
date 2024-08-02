import express from 'express';
import { Request, Response } from 'express';
import { prisma } from '../../db';
import { registerTeacherSchema } from '../../schema/registerTeacher';
import { ajv } from '../../validator';
const router = express.Router();

router.post("/request", async (req: Request, res: Response) => {
    try {
        const userData = req.query.userData as any;
        let registerTeacher = {
            specialization: req.body.specialization,
            experience: req.body.experience
        }
        const isValid = ajv.validate(registerTeacherSchema, registerTeacher);
        if (!isValid) return res.status(400).json({ errors: ajv.errors && ajv.errors[0].message });
        let student = await prisma.student.findUnique({
            where: {
                userId: userData.id
            }
        })
        if (!student) return res.status(400).json({ errors: "Student not found" });
        let checkRequest = await prisma.registerTeacher.findUnique({
            where: {
                studentId: student.id
            }
        })
        if (checkRequest) return res.status(400).json({ errors: "Request already sent" });
        let request = await prisma.registerTeacher.create({
            data: {
                studentId: student.id,
                specialization: registerTeacher.specialization,
                experience: registerTeacher.experience
            }
        });
        res.status(200).json({ request });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.get("/my-request", async (req: Request, res: Response) => {
    try {
        const userData = req.query.userData as any;
        let student = await prisma.student.findUnique({
            where: {
                userId: userData.id
            }
        })
        if (!student) return res.status(400).json({ errors: "Student not found" });
        let checkRequest = await prisma.registerTeacher.findUnique({
            where: {
                studentId: student.id
            }
        })
        if (!checkRequest) return res.status(400).json({ errors: "Request not found" });
        res.status(200).json({ request: checkRequest });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

export default router;