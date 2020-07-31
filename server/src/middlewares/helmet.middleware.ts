import helmet from 'helmet';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { promises as fsp } from 'fs';

import getScriptSrcHashes from '../utils/getScriptSrcHashes';

const helmetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const indexPath = path.resolve(__dirname, '..', '..', '..', 'client', 'build', 'index.html');
  const index = await fsp.readFile(indexPath, 'utf-8');
  const hashes = await getScriptSrcHashes(index);

  return helmet({
    contentSecurityPolicy: {
      directives: {
        baseUri: ["'none'"],
        defaultSrc: ["'none'"],
        connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://stats.g.doubleclick.net', 'https://rs.fullstory.com'],
        formAction: ["'none'"],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com', 'https://stats.g.doubleclick.net', 'https://www.google.com'],
        manifestSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'sha256-KYbqXqOYv6xOvzbfRwXslg+GK2ebpVi0G6EzAvF6Yc8='",
          'https://edge.fullstory.com',
          'https://fullstory.com',
          'https://storage.googleapis.com',
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
          ...hashes,
        ],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        // sandbox: ['allow-forms', 'allow-scripts'],
        // reportUri: '/report-violation',
        // objectSrc: ["'none'"],
        // upgradeInsecureRequests: true,
      },
    },
  })(req, res, next);
};

export default helmetMiddleware;
