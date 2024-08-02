import express from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";

const router = express.Router();

router.get("/all", async (req: Request, res: Response) => {
    try {
        let page = parseInt(req.query.page as string) || 1;
        let limit = 10;
        let offset = (page - 1) * limit;
        let totalUsers = await prisma.user.count({ where: { NOT: { role: "ADMIN" } } });
        let totalPages = Math.ceil(totalUsers / limit);
        totalPages = totalPages == 0 ? 1 : totalPages;
        let users = await prisma.user.findMany({
            where: {
                NOT: {
                    role: "ADMIN"
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: offset,
            take: limit
        });
        return res.status(200).json({ users, totalPages, totalUsers });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                Teacher: true,
                Student: true
            }
        });
        return res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        let deactivateUser = await prisma.user.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                isActive: false
            }
        });
        res.status(200).json({ user: deactivateUser, message: "User deactivated" });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.patch("/:id", async (req: Request, res: Response) => {
    try {
        let activateUser = await prisma.user.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                isActive: true
            }
        });
        res.status(200).json({ user: activateUser, message: "User activated" });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
})

export default router;