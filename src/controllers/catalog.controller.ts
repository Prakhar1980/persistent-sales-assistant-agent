import { Request, Response } from "express";
import { getCatalog } from "../services/catalog.service.js";

export function getCatalogController(_req: Request, res: Response): void {
  res.json(getCatalog());
}

