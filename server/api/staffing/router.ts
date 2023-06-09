import { z } from "zod"

import {createTRPCRouter, protectedProcedure, publicProcedure, restrictedProcedure} from "../trpc";
import {Role} from "../../../prisma/role";

//get all shifts from the start of today onwards until a set amount of days after that

export const staffingRouter = createTRPCRouter({
  getStaffing: publicProcedure
    .input(z.object({
      fromDate: z.date().optional(),
      limit: z.number().min(1).max(20).nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 7
      const items = await ctx.prisma.staffing.findMany({
        take: limit * 10,
        where: {
          shift: {
            start: {
              gte: new Date((input?.fromDate || new Date()).setHours(0, 0, 0, 0)),
            },
          }
        },
        include: {
          shift: {
            include: {
              staffings: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                    }
                  },
                  shift_type: true,
                }
              }
            }
          },
          shift_type: true,
        },
        orderBy: {
          shift: {
            start: 'asc',
          }
        }
      })
      return items
    }),
  getPersonalStaffing: protectedProcedure
    .input(z.object({
      fromDate: z.date().optional(),
      limit: z.number().min(1).max(20).nullish(),
      cursor: z.string().nullish()
    }))
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 10
      const items = await ctx.prisma.staffing.findMany({
        take: limit + 1,
        where: {
          user_id: ctx.session.user.id,
          shift: {
            start: {
              gte: input?.fromDate || new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        },
        cursor: input?.cursor ? {
          id: input.cursor
        } : undefined,
        include: {
          shift: {
            include: {
              staffings: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true
                    }
                  },
                  shift_type: true
                }
              }
            }
          },
          shift_type: true
        },
        orderBy: {
          shift: {
            start: "asc"
          }
        }
      })
      let nextCursor: string | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id
      }
      return {
        items,
        nextCursor
      }
    }),
  removeAllStaffing: publicProcedure
    .mutation(async ({ ctx }) => {
      return ctx.prisma.staffing.deleteMany()
    }),
  createStaffing: publicProcedure
    .input(
      z.object({
        shift_id: z.string(),
        user_id: z.string(),
        shift_type_id: z.string()
      }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.staffing.create({
        data: {
          user_id: input.user_id,
          shift_id: input.shift_id,
          shift_type_id: input.shift_type_id
        }
      });
    }),
  addStaffing: restrictedProcedure(Role.ADMIN)
    .input(
      z.object({
        shift_id: z.string(),
        user_id: z.string(),
        shift_type_name: z.string()
      }))
    .mutation(async ({ ctx, input }) => {
      const shiftType = await ctx.prisma.shift_Type.findUnique({
        where: {
          name: input.shift_type_name
        }
      });

      if (!shiftType) {
        throw new Error(`Shift type with name ${input.shift_type_name} not found.`);
      }

      return await ctx.prisma.staffing.create({
        data: {
          user_id: input.user_id,
          shift_id: input.shift_id,
          shift_type_id: shiftType.id
        }
      });
    }),
  removeStaffing: publicProcedure
    .input(z.object({
      shift_id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not found")
      }

      const staffing = await ctx.prisma.staffing.findFirst({
        where: {
          shift_id: input.shift_id,
          user_id: userId
        }
      })

      if (!staffing) {
        throw new Error("Staffing not found")
      }

      return ctx.prisma.staffing.delete({
        where: {
          id: staffing.id
        }
      })
    }),
  changeShiftType: publicProcedure
    .input(
      z.object({
        staffing_id: z.string(),
        shift_type_id: z.string()
      }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.staffing.update({
        where: {
          id: input.staffing_id
        },
        data: {
          shift_type_id: input.shift_type_id
        }
      })
    }),
  removeStaffingAdmin: restrictedProcedure(Role.ADMIN)
    .input(z.object({
      staffing_id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.staffing.delete({
        where: {
          id: input.staffing_id
        }
      });
    }),
});
