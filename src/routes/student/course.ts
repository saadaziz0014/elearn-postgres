import express from 'express';
import { Request, Response } from 'express';
import { prisma } from '../../db';

const router = express.Router();

router.get("/all", async (req: Request, res: Response) => {
    try {
        let page = parseInt(req.query.page as string) || 1;
        let limit = 10;
        let search = req.query.search as string;
        search = search && search != '' ? search.toLowerCase() : search;
        let offset = (page - 1) * limit;
        let totalCourses = 0;
        let totalPages = 0;
        let courses = [];
        totalCourses = await prisma.course.count({ where: { title: { contains: search }, isActive: true } });
        totalPages = Math.ceil(totalCourses / limit);
        totalPages = totalPages == 0 ? 1 : totalPages;
        courses = await prisma.course.findMany({
            where: { title: { contains: search }, isActive: true },
            skip: offset,
            take: limit
        });
        return res.status(200).json({ courses, totalPages, totalCourses });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.get("/enroll/:id", async (req: Request, res: Response) => {
    try {
        let nineteenSeventy = new Date("1970-01-01T00:00:00.000Z");
        let userData = req.query.userData as any;
        let courseId = parseInt(req.params.id);
        let student = await prisma.student.findUnique({
            where: {
                userId: userData.id
            }
        });
        if (userData.role == "TEACHER") {
            let teacher = await prisma.teacher.findUnique({
                where: {
                    userId: userData.id
                }
            })
            if (teacher) {
                let selfCourse = await prisma.course.findUnique({
                    where: {
                        id: courseId
                    }
                })
                if (selfCourse && selfCourse.teacherId == teacher.id) return res.status(400).json({ errors: "Self course" });
            }
        }
        if (!student) return res.status(400).json({ errors: "Student not found" });
        let checkExist = await prisma.studentCourses.findFirst({
            where: {
                studentId: student.id,
                courseId: courseId
            }
        });
        if (checkExist) return res.status(400).json({ errors: "Already enrolled" });
        let course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) return res.status(400).json({ errors: "Course not found" });
        let enroll = await prisma.studentCourses.create({
            data: {
                studentId: student.id,
                courseId: course.id,
                completedDate: nineteenSeventy,
            }
        });
        return res.status(200).json({ enroll });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
})

export default router