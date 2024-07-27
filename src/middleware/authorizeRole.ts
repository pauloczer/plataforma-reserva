import { Request, Response, NextFunction } from 'express';

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user.role; 
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
};
