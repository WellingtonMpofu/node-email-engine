import express from 'express';
import  multer from 'multer';
import { sendEmail, sendEmailWithAttachments, sendCalendarEvent } from "../controllers/emailController.mjs";
import { OutlookEmailService } from '../utils/outlookEmailService.mjs';

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const uploadMiddleware = upload.array("files")

router.post('/send', sendEmail);
router.post('/send/attachments', uploadMiddleware, sendEmailWithAttachments);
router.post('/send-calendar-event', sendCalendarEvent);

export default router