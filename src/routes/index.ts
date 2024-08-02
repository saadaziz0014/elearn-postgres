import express from "express";
import admin from './admin/index';
import teacher from './teacher/index';
import student from './student/index';
import auth from './auth';
import { checkAdmin, checkAuth } from "../middleware";

const router = express.Router();

router.use('/auth', auth);
router.use('/admin', checkAuth, checkAdmin, admin);
router.use('/teacher', checkAuth, teacher);
router.use('/student', checkAuth, student);


export default router