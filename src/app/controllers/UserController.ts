import * as Yup from 'yup';
import { Request, Response } from 'express';

import User from '../models/User';

class UserController {
  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    try {
      await schema.validate(req.body);

      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create(req.body);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error?.errors });
    }
  }

  async update(req: Request<{ userId: string }>, res: Response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword: string, field: Yup.StringSchema) =>
          oldPassword ? field.required() : field
        ),
      confirmPasswod: Yup.string().when(
        'password',
        (password: string, field: Yup.StringSchema) =>
          password
            ? field
                .required()
                .oneOf(
                  [Yup.ref('password')],
                  'Password and Password Confirmation does not match'
                )
            : field
      ),
    });
    try {
      await schema.validate(req.body);

      const { email, oldPassword, password } = req.body;
      const user = await User.findByPk<User>(req.params.userId);
      if (user?.email !== email) {
        const userExists = await User.findOne({
          where: { email },
        });
        if (userExists) {
          return res.status(400).json({ error: 'User already exists' });
        }
      }

      if (password && !(await user?.checkPassword(oldPassword ?? ''))) {
        return res.status(401).json({ error: 'Password does not match' });
      }
      await user?.update(req.body);
      const { id, name } = (await User.findByPk<User>(
        req.params.userId
      )) as User;
      return res.json({
        id,
        name,
        email,
      });
    } catch (error) {
      return res.status(400).json({ error: error?.errors });
    }
  }
}

export default new UserController();