import express, { Application } from 'express';
import path from 'path';

import { Logger } from '../shared/logger';

export const withStaticRouter = (context: { app: Application }) => {
  context.app.use((req, _res, next) => {
    Logger.debug(`Static router request for ${req.url}`);
    next();
  });
  context.app.use(express.static(path.join(__dirname, '../../../build')));
  context.app.use((_, res) => {
    res.sendFile(path.join(__dirname, '../../../build', 'index.html'));
  });
};
