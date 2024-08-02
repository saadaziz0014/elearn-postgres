import express from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";

const router = express.Router();

router.get("/all", async (req: Request, res: Response) => {
    try {
        let page = parseInt(req.query.page as string) || 1;
        let limit = 10;
        let offset = (page - 1) * limit;
        let status = req.query.status as string;
        let totalRequests = 0;
        let totalPages = 0;
        if (status && status != "ALL") {
            totalRequests = await prisma.registerTeacher.count({ where: { status } });
            totalPages = Math.ceil(totalRequests / limit);
            totalPages = totalPages == 0 ? 1 : totalPages;
            let requests = await prisma.registerTeacher.findMany({
                where: {
                    status
                },
                include: {
                    Student: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip: offset,
                take: limit
            });
            return res.status(200).json({ requests, totalPages, totalRequests });
        } else {
            totalRequests = await prisma.registerTeacher.count();
            totalPages = Math.ceil(totalRequests / limit);
            totalPages = totalPages == 0 ? 1 : totalPages;
            let requests = await prisma.registerTeacher.findMany({
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    Student: {
                        include: {
                            user: true
                        }
                    }
                },
                skip: offset,
                take: limit
            });
            return res.status(200).json({ requests, totalPages, totalRequests });
        }
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.patch("/:id", async (req: Request, res: Response) => {
    try {
        let status = req.body.status;
        let updateRequest = await prisma.registerTeacher.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                status
            }
        });
        if (status == "ACCEPTED") {
            let request = await prisma.registerTeacher.findUnique({
                where: {
                    id: parseInt(req.params.id)
                },
                include: {
                    Student: {
                        include: {
                            user: true
                        }
                    }
                }
            });
            if (!request) return res.status(400).json({ errors: "Request not found" });
            let user = await prisma.user.update({
                where: {
                    id: request.Student.user.id
                },
                data: {
                    role: "TEACHER"
                }
            });
            let teacher = await prisma.teacher.create({
                data: {
                    user: {
                        connect: {
                            id: user.id
                        }
                    },
                    specialization: request.specialization,
                    experience: request.experience
                }
            });
        }
        res.status(200).json({ request: updateRequest, message: "Request updated" });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
})



export default router