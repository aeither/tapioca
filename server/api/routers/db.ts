import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const dbRouter = createTRPCRouter({
  products: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.product.findMany({
        where: {
          orderId: {
            equals: input.orderId,
          },
        },
      })
    }),

  orderTotal: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.product.aggregate({
        where: {
          orderId: {
            equals: input.orderId,
          },
        },
        _sum: {
          price: true,
        },
      })
    }),

  createNewOrder: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.order.create({
      data: {},
    })
  }),

  addProduct: publicProcedure
    .input(
      z.object({
        title: z.string(),
        price: z.number(),
        orderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.create({
        data: {
          title: input.title,
          price: input.price,
          orderId: input.orderId,
        },
      })
    }),
})
