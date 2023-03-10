import { Keypair } from '@solana/web3.js'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { PaymentStatus } from '@prisma/client'
import { TRPCError } from '@trpc/server'

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

  orders: publicProcedure.query(async ({ ctx, input }) => {
    return await ctx.prisma.order.findMany()
  }),

  orderById: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
        },
      })
    }),

  createNewOrder: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        shopAddress: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.order.create({
        data: {
          amount: input.amount,
          reference: new Keypair().publicKey.toBase58(),
          shopAddress: input.shopAddress,
        },
      })
    }),

  updateOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.string().optional(),
        table: z.number().optional(),
        customerAddress: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
        },
      })
      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found in database.',
        })
      }

      return await ctx.prisma.order.update({
        where: {
          id: input.orderId,
        },
        data: {
          status: input.status ? (input.status as PaymentStatus) : order.status,
          table: input.table ? input.table : order.table,
          customerAddress: input.customerAddress
            ? input.customerAddress
            : order.customerAddress,
        },
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
