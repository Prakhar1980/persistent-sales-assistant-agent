import { Router } from "express";
import { getCatalogController } from "../controllers/catalog.controller.js";

export const catalogRouter = Router();

catalogRouter.get("/catalog", getCatalogController);

