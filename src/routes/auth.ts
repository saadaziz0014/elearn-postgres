import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUserSchema } from "../schema/createUser";
import { loginUserSchema } from "../schema/loginUser";
import { ajv } from "../validator";
import { changePasswordSchema } from "../schema/changePassword";
import { checkAuth } from "../middleware";
import { prisma } from "../db";
const router = express.Router();


router.post("/register", async (req: Request, res: Response) => {
    try {
        const user = {
            name: req.body.name,
            email: req.body.email && req.body.email.toLowerCase(),
            password: req.body.password,
            phone: req.body.phone,
            class: req.body.class
        };
        const isValid = ajv.validate(createUserSchema, user);
        if (!isValid) return res.status(400).json({ errors: ajv.errors && ajv.errors[0].message });
        const exists = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })
        if (exists) return res.status(400).json({ errors: "User already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        const userCreated = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                phone: user.phone,
                Student: {
                    create: {
                        class: user.class
                    }
                }
            }
        });
        let payload = {
            id: userCreated.id,
            email: userCreated.email,
            phone: userCreated.phone,
            role: userCreated.role
        }
        const token = jwt.sign(payload, process.env.S_SECRET!);
        return res.status(200).json({ token, user: userCreated });
    } catch (error: any) {
        res.status(500).json({ errors: error.message });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const user = {
            email: req.body.email && req.body.email.toLowerCase(),
            password: req.body.password
        };
        const isValid = ajv.validate(loginUserSchema, user);
        if (!isValid) return res.status(400).json({ errors: ajv.errors && ajv.errors[0].message });
        const exists = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })
        if (!exists) return res.status(400).json({ errors: "User not found" });
        if (exists.isActive == false) return res.status(400).json({ errors: "User Blocked" });
        const validPassword = await bcrypt.compare(user.password, exists.password);
        if (!validPassword) return res.status(400).json({ errors: "Invalid password" });
        let payload = {
            id: exists.id,
            email: exists.email,
            phone: exists.phone,
            role: exists.role
        }
        let token = null;
        if (payload.role == "STUDENT") token = jwt.sign(payload, process.env.S_SECRET!);
        else if (payload.role == "TEACHER") token = jwt.sign(payload, process.env.T_SECRET!);
        else if (payload.role == "ADMIN") token = jwt.sign(payload, process.env.A_SECRET!);
        return res.status(200).json({ token, user: exists });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
});

router.post("/change-password", checkAuth, async (req: Request, res: Response) => {
    try {
        let userData = req.query.userData as any;
        const data = {
            email: req.body.email && req.body.email.toLowerCase(),
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword
        }
        if (data.email != userData.email) return res.status(400).json({ errors: "Unauthorized" });
        const isValid = ajv.validate(changePasswordSchema, data);
        if (!isValid) return res.status(400).json({ errors: ajv.errors && ajv.errors[0].message });
        const exists = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (!exists) return res.status(400).json({ errors: "User not found" });
        const validPassword = await bcrypt.compare(data.oldPassword, exists.password);
        if (!validPassword) return res.status(400).json({ errors: "Invalid password" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.newPassword, salt);
        data.newPassword = hashedPassword;
        const userUpdated = await prisma.user.update({
            where: {
                id: exists.id
            },
            data: {
                password: data.newPassword
            }
        });
        return res.status(200).json({ user: userUpdated });
    } catch (error: any) {
        res.status(500).json({ errors: error.message })
    }
})

export default router