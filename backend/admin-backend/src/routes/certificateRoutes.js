import express from "express";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { getAllCertificates, getCertificateTypes, getMyCertificates, issueCertificate } from "../controllers/certificateController.js";

const router=express.Router();

/* Admin */
router.post("/issue",requireAdmin(["master","editor"]),issueCertificate);
router.get("/admin", requireAdmin(),getAllCertificates);

/*User (RLS protected, no middleware) */
router.get("/my", getMyCertificates);

router.get("/types",getCertificateTypes);

export default router;
