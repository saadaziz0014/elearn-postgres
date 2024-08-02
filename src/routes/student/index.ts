import express from "express";
import registerTeacher from "./registerTeacher";
import profile from "./profile";
import course from './course';
import { checkStudent, checkStudentOrTeacher } from "../../middleware";

const router = express.Router();

router.use('/register-teacher', checkStudent, registerTeacher);
router.use('/profile', checkStudentOrTeacher, profile);
router.use('/course', checkStudentOrTeacher, course);

export default router