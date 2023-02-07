
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import { getServerAuthSession } from "../utils/get-server-auth-session";

import { PrismaClient } from '@prisma/client';

type CreateContextOptions = {
    session: Session | null;
    prisma: PrismaClient;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        prisma: opts.prisma,
        session: opts.session,

    };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
    opts: trpcNext.CreateNextContextOptions,
) => {
    const { req, res } = opts;

    // Get the session from the server using the unstable_getServerSession wrapper function
    const session = await getServerAuthSession({ req, res });
    const prisma = new PrismaClient();

    return await createContextInner({
        session,
        prisma
    });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
export default Context;