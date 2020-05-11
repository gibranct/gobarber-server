import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';

import authConfig from '../../config/auth';

interface JWTPayload {
  id: number;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = (await promisify(jwt.verify)(
      token,
      authConfig.secret
    )) as JWTPayload;

    req.body.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
