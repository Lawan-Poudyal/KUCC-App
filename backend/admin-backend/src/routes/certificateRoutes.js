import express from "express";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { downloadCertificate, getAllCertificates, getCertificatesByRegistration, getCertificateTypes, getMyCertificates, issueCertificate } from "../controllers/certificateController.js";

const router=express.Router();

/* Admin */
router.post("/issue",requireAdmin(["master","editor"]),issueCertificate);
router.get("/admin", requireAdmin(),getAllCertificates);

/*Download certificate(anyone with ID can download) */
router.get("/download/:certificateId", downloadCertificate);

/*Get certificates by registration ID */
router.get("/by-registration/:registrationId",getCertificatesByRegistration);



/*User (RLS protected, no middleware) */
router.get("/my", getMyCertificates);

router.get("/types",getCertificateTypes);

export default router;
