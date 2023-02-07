import * as trpcNext from '@trpc/server/adapters/next';

import { serverRouter } from 'src/server/router';
import { createContext } from 'src/server/auth-context';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

const cors = Cors();

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: { (req: Cors.CorsRequest, res: { statusCode?: number; setHeader(key: string, value: string): any; end(): any; }, next: (err?: any) => any): void; (arg0: NextApiRequest, arg1: NextApiResponse<any>, arg2: (result: any) => void): void; }) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });
}

export function withCors(handler: NextApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        await runMiddleware(req, res, cors);

        return await handler(req, res);
    };
}

export default withCors(
    trpcNext.createNextApiHandler({
        router: serverRouter,
        createContext
    })
);