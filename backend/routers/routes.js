import express from "express";
import userRouter from "./userRouter.js";
import uploadRouter from "./uploadRouter.js";
import categoryRouter from "./categoryRouter.js";
import tagRouter from "./tagRouter.js";
import videoRouter from "./videoRouter.js";
import favoriteRouter from "./favoriteRouter.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/upload", uploadRouter);
router.use("/categories", categoryRouter);
router.use("/tags", tagRouter);
router.use("/videos", videoRouter);
router.use("/favorites", favoriteRouter);

export default router;
