import { Request, Response } from 'express';

export default {
  'GET  /api/notice': (_: Request, res: Response) => {
    res.send({ message: 'Ok' });
  },
  'POST  /api/notice': (_: Request, res: Response) => {
    res.send({ message: 'Ok' });
  },
  'PUT  /api/notice': (_: Request, res: Response) => {
    res.send({ message: 'Ok' });
  },
  'DELETE  /api/notice': (_: Request, res: Response) => {
    res.send({ message: 'Ok' });
  },
};
