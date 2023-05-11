import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./example/exampleRouter";
import { scheduleRouter } from "./schedule/schedule";
import { staffingRouter } from "./userRouters/staffing";
import { requiredStaffing } from "./requiredStaffing/standBy";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  schedule: scheduleRouter,
  staffing: staffingRouter,
  requiredStaffing: requiredStaffing
});

// export type definition of API
export type AppRouter = typeof appRouter;
