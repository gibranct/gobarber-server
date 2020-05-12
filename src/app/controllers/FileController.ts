import fs from 'fs';
import { Request, Response } from 'express';

import File from '../models/File';

class FileController {
  async store(req: Request, res: Response) {
    const { originalname: name, filename: path } = req.file;

    try {
      const file = await File.create({ name, path });

      return res.json(file);
    } catch (error) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json(error);
    }
  }
}

export default new FileController();
