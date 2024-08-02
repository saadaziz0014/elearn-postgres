import express from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    let userData = req.query.userData as any;
    const student = await prisma.user.findUnique({
        where: {
            id: userData.id
        }
    });
    return res.status(200).json(student);
});

router.patch("/", async (req: Request, res: Response) => {
    try {
        const userData = req.query.userData as any;
        let className = req.body.class;
        if (!className) return res.status(400).json({ errors: "Class not found" });
        const student = await prisma.student.update({
            where: {
                userId: userData.id
            },
            data: {
                class: className
            }
        })
        return res.status(200).json(student);
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
})

export default router;