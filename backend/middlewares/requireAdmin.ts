import type { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.role !== "ADMIN") {
    res.status(403).json({ message: "Not allowed" });
    return;
  }
  next();
}
