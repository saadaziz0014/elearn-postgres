import express from 'express';
import { Request, Response } from 'express';
import { prisma } from '../../db';
import { ajv } from '../../validator';
import { videoSchema } from '../../schema/videoSchema';
import { courseUpdate } from '../../schema/courseUpdate';
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        let title = req.body.title;
        if (!title) return res.status(400).json({ errors: "Title can't be null" });
        title = title.toLowerCase();
        let addedCourse = await prisma.course.findFirst({
            where: {
                title
            }
        });
        if (addedCourse) return res.status(400).json({ errors: "Course already exists" });
        let userData = req.query.userData as any;
        let teacher = await prisma.teacher.findUnique({
            where: {
                userId: userData.id
            }
        })
        if (!teacher) return res.status(400).json({ errors: "Teacher not found" });
        let course = await prisma.course.create({
            data: {
                title,
                teacherId: teacher.id
            }
        });
        return res.status(200).json({ course });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.get("/all", async (req: Request, res: Response) => {
    try {
        let page = parseInt(req.query.page as string) || 1;
        let limit = 10;
        let offset = (page - 1) * limit;
        let status = req.query.status as string;
        let totalCourses = 0;
        let totalPages = 0;
        let courses = [];
        if (status && status != "ALL") {
            totalCourses = await prisma.course.count({ where: { isActive: true } });
            totalPages = Math.ceil(totalCourses / limit);
            totalPages = totalPages == 0 ? 1 : totalPages;
            courses = await prisma.course.findMany({
                where: { isActive: true },
                skip: offset,
                take: limit
            });
            return res.status(200).json({ courses, totalPages, totalCourses });
        } else {
            totalCourses = await prisma.course.count();
            totalPages = Math.ceil(totalCourses / limit);
            totalPages = totalPages == 0 ? 1 : totalPages;
            courses = await prisma.course.findMany({
                skip: offset,
                take: limit
            });
            return res.status(200).json({ courses, totalPages, totalCourses });
        }
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        let course = await prisma.course.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                CourseVideo: true
            }
        });
        return res.status(200).json({ course });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.patch("/:id", async (req: Request, res: Response) => {
    try {
        let course = {
            title: req.body.title,
            isActive: req.body.isActive
        }
        const isValid = ajv.validate(courseUpdate, course);
        if (!isValid) return res.status(400).json({ errors: ajv.errors && ajv.errors[0].message })
        let existTitle = await prisma.course.findFirst({
            where: {
                title: course.title,
                NOT: {
                    id: parseInt(req.params.id)
                }
            }
        })
        if (existTitle) return res.status(400).json({ errors: "Course already exists" });
        let updateCourse = await prisma.course.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                title: course.title,
                isActive: course.isActive
            }
        });
        return res.status(200).json({ course: updateCourse, message: "Course updated" });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
})

router.put("/:id", async (req: Request, res: Response) => {
    try {
        let video = {
            title: req.body.title,
            url: req.body.url
        }
        const isValid = ajv.validate(videoSchema, video);
        if (!isValid) return res.status(400).json({ errors: ajv.errors && ajv.errors[0].message });
        video.title = video.title.toLowerCase();
        let existVideo = await prisma.courseVideo.findFirst({
            where: {
                title: video.title
            }
        });
        if (existVideo) return res.status(400).json({ errors: "Video already exists" });
        let addVideo = await prisma.courseVideo.create({
            data: {
                title: video.title,
                url: video.url,
                Course: {
                    connect: {
                        id: parseInt(req.params.id)
                    }
                }
            }
        });
        return res.status(200).json({ video: addVideo, message: "Video added" });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.put("/video/:id", async (req: Request, res: Response) => {
    try {
        let video = {
            title: req.body.title,
            url: req.body.url
        }
        const isValid = ajv.validate(videoSchema, video);
        if (!isValid) return res.status(400).json({ errors: ajv.errors && ajv.errors[0].message });
        video.title = video.title.toLowerCase();
        let exist = await prisma.courseVideo.findFirst({
            where: {
                title: video.title,
                NOT: {
                    id: parseInt(req.params.id)
                }
            }
        })
        if (exist) return res.status(400).json({ errors: "Video already exists" });
        let userData = req.query.userData as any;
        let teacher = await prisma.teacher.findUnique({
            where: {
                userId: userData.id
            }
        });
        if (!teacher) return res.status(400).json({ errors: "Teacher not found" });
        let course = await prisma.course.findFirst({
            where: {
                CourseVideo: {
                    some: {
                        id: parseInt(req.params.id)
                    }
                },
                teacherId: teacher.id
            }
        });
        if (!course) return res.status(400).json({ errors: "Course not found" });
        let updateVideo = await prisma.courseVideo.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                title: video.title,
                url: video.url
            }
        });
        return res.status(200).json({ video: updateVideo, message: "Video updated" });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.get("/students/:id", async (req: Request, res: Response) => {
    try {
        let userData = req.query.userData as any;
        let teacher = await prisma.teacher.findUnique({
            where: {
                userId: userData.id
            }
        });
        if (!teacher) return res.status(400).json({ errors: "Teacher not found" });
        let course = await prisma.course.findUnique({
            where: {
                id: parseInt(req.params.id),
                teacherId: teacher.id
            }
        });
        if (!course) return res.status(400).json({ errors: "Course not found" });
        let students = await prisma.studentCourses.findMany({
            where: {
                courseId: course.id
            },
            include: {
                Student: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return res.status(200).json({ students });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
})

export default router