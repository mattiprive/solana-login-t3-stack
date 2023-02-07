import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';

import { z } from 'zod';
import { Role } from '@prisma/client';

import { Session } from 'next-auth';
import Context from './auth-context';

export const serverRouter = trpc
    .router<Context>()
    .middleware(async ({ ctx, next }) => {
        // Take session from context
        const session: Session | null = ctx.session;
        //Put publicKey in variable
        let publicKey;
        if (session === null || session.user?.name === null) {
            publicKey = "";
        }
        else {
            publicKey = session.user?.name;
        }
        //Find role of publicKey
        let roleraw: { role: Role } | null = await ctx.prisma.user.findFirst({
            where: {
                publickey: publicKey
            },
            select: {
                role: true
            }
        });
        const role: Role | undefined = roleraw?.role;
        //If we find a publicKey & no role, put user in database as USER
        if (!role && publicKey && publicKey != "") {
            await ctx.prisma.user.create({
                data: {
                    publickey: publicKey
                }
            });
        }
        return next({
            ctx: {
                ...ctx,
                role: role  // user value is known to be non-null now
            }
        })
    })
    .query('role', {
        resolve: async ({ ctx }) => {
            const session = ctx.session;
            let publicKey;
            if (session === null || session.user?.name === null) {
                publicKey = "nope";
            }
            else {
                publicKey = session.user?.name;
            }
            return await ctx.prisma.user.findFirst({
                where: {
                    publickey: publicKey
                },
                select: {
                    role: true
                }
            })
        }
    }
    )
    .query('findAll', {
        resolve: async ({ ctx }) => {
            if (ctx.role === "ADMIN") {
                return await ctx.prisma.contactForm.findMany();
            }
            else {
                // return await ctx.prisma.contactForm.findMany();
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
        }
    })
    .mutation('insertOne', {
        input: z.object({
            title: z.string(),
            email: z.string()
        }),
        resolve: async ({ input, ctx }) => {
            return await ctx.prisma.contactForm.create({
                data: {
                    title: input.title,
                    email: input.email
                }
            });
        }
    })
    .mutation('updateOne', {
        input: z.object({
            id: z.number(),
            title: z.string(),
            checked: z.boolean()
        }),
        resolve: async ({ input, ctx }) => {
            if (ctx.role === "ADMIN") {
                const { id, ...rest } = input;

                return await ctx.prisma.contactForm.update({
                    where: { id },
                    data: { ...rest }
                });
            }
            else {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

        }
    })
    .mutation('deleteAll', {
        input: z.object({
            ids: z.number().array()
        }),
        resolve: async ({ input, ctx }) => {

            if (ctx.role === "ADMIN") {
                const { ids } = input;
                return await ctx.prisma.contactForm.deleteMany({
                    where: {
                        id: { in: ids }
                    }
                });
            }
            else {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
        }
    })
    .query('findAdmin', {
        resolve: async ({ ctx }) => {
            return await ctx.prisma.user.findMany(
                {
                    where: {
                        role: 'ADMIN'
                    },
                    select: {
                        publickey: true
                    }
                }
            );
        }
    })
    ;

export type ServerRouter = typeof serverRouter;
function data() {
    throw new Error('Function not implemented.');
}

