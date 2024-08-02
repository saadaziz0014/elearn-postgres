import express from "express";
import user from "./user";
import registerTeacher from "./registerTeacher";

const router = express.Router();

router.use('/user', user);
router.use('/register-teacher', registerTeacher);

export default router