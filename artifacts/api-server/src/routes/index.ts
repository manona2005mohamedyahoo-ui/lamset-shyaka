import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mobileRouter from "./mobile";
import brandingRouter from "./branding";

const router: IRouter = Router();

router.use(healthRouter);
router.use(brandingRouter);
router.use(mobileRouter);

export default router;
