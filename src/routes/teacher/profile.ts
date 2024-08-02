import express from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { ajv } from "../../validator";
import { registerTeacherSchema } from "../../schema/registerTeacher";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const userData = req.query.userData as any;
        let teacher = await prisma.teacher.findUnique({
            where: {
                userId: userData.id
            }
        });
        return res.status(200).json(teacher);
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.patch("/", async (req: Request, res: Response) => {
    try {
        const userData = req.query.userData as any;
        let profileData = {
            specialization: req.body.specialization,
            experience: req.body.experience
        }
        let isValid = ajv.validate(registerTeacherSchema, profileData);
        if (!isValid) return res.status(400).json({ errors: ajv.errors && ajv.errors[0].message });
        let teacher = await prisma.teacher.update({
            where: {
                userId: userData.id
            },
            data: profileData
        });
        return res.status(200).json(teacher);
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

export default router;