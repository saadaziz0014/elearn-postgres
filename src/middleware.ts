import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ errors: "Unauthorized" });
        let secrets = [process.env.S_SECRET!, process.env.T_SECRET!, process.env.A_SECRET!];
        let decoded = null;
        for (let i = 0; i < secrets.length; i++) {
            try {
                decoded = jwt.verify(token, secrets[i]);
                break;
            } catch (error) {
                continue;
            }
        }
        req.query.userData = decoded || {}
        next();
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ errors: error.message })
    }
}

function checkAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        let userData = req.query.userData as any;
        if (userData.role != "ADMIN") return res.status(401).json({ errors: "Unauthorized" });
        next();
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
}

function checkStudent(req: Request, res: Response, next: NextFunction) {
    try {
        const userData = req.query.userData as any;
        if (userData.role != "STUDENT") return res.status(401).json({ errors: "Unauthorized" });
        next();
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
}

function checkStudentOrTeacher(req: Request, res: Response, next: NextFunction) {
    try {
        const userData = req.query.userData as any;
        if (userData.role != "STUDENT" && userData.role != "TEACHER") return res.status(401).json({ errors: "Unauthorized" });
        next();
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
}

function checkTeacher(req: Request, res: Response, next: NextFunction) {
    const userData = req.query.userData as any;
    if (userData.role != "TEACHER") return res.status(401).json({ errors: "Unauthorized" });
    next();
}

export { checkAuth, checkAdmin, checkStudent, checkStudentOrTeacher, checkTeacher };