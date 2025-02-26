'use strict';

import { NextFunction, Request, Response } from 'express';

export const asyncHandlerV2 =
    (fn:any) => (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };