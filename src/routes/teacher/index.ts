import express from "express";
import profile from "./profile";
import course from './course';
import { checkStudentOrTeacher, checkTeacher } from "../../middleware";

const router = express.Router();

router.use("/profile", checkStudentOrTeacher, profile);
router.use("/course", checkTeacher, course);

export default router