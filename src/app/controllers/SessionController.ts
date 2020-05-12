import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    try {
      await schema.validate(req.body);

      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password does not match' });
      }

      const { id, name, provider } = user;

      return res.json({
        user: {
          id,
          name,
          email,
          provider,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error?.errors });
    }
  }
}

export default new SessionController();