import { Server as SocketIO } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { Server } from "http";
import { verify } from "jsonwebtoken";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";
import User from "../models/User";
import Queue from "../models/Queue";
import Ticket from "../models/Ticket";
import jwtConfig from "../config/auth";
import { CounterManager } from "./counter";

let io: SocketIO;

export const initIO = (httpServer: Server): SocketIO => {
  io = new SocketIO(httpServer, {
    connectionStateRecovery: {
      maxDisconnectionDuration: 5 * 60 * 1000,
      skipMiddlewares: true,
    },
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  });

  if (process.env.SOCKET_ADMIN && JSON.parse(process.env.SOCKET_ADMIN)) {
    User.findByPk(1).then(adminUser => {
      instrument(io, {
        auth: {
          type: "basic",
          username: adminUser.email,
          password: adminUser.passwordHash
        },
        mode: "development"
      });
    });
  }

  io.on("connection", async socket => {
    const { token, userId } = socket.handshake.query;

    let tokenData = null;
    try {
      tokenData = verify(token as string, jwtConfig.secret);
      logger.debug(tokenData, "io-onConnection: tokenData");
      logger.info(`Client Connected => userId: ${tokenData.id}`);
    } catch (error) {
      logger.debug(`Error decoding token: ${error?.message}`);
      socket.disconnect(true);
      return io;
    }

    const counters = new CounterManager();
    let user: User = null;
    const userId1 = tokenData.id;

    if (userId1 && userId1 !== "undefined" && userId1 !== "null") {
      user = await User.findByPk(userId1, { include: [Queue] });
      if (user) {
        user.online = true;
        await user.save();
        logger.info(`onConnect: User ${userId1} was found`);
      } else {
        logger.info(`onConnect: User ${userId1} not found`);
        socket.disconnect(true);
        return io;
      }
    } else {
      logger.info("onConnect: Missing userId");
      socket.disconnect(true);
      return io;
    }

    socket.join(`company-${user.companyId}-mainchannel`);
    socket.join(`company-${user.companyId}`);
    socket.join(`user-${user.id}`);

    socket.on("joinChatBox", async (ticketId: string) => {
      if (!ticketId || ticketId === "undefined") {
        return;
      }
      Ticket.findByPk(ticketId).then(
        (ticket) => {
          if (ticket && ticket.companyId === user.companyId &&
            (ticket.userId === user.id || user.profile === "admin" || user.allTicket)) {
            const c = counters.incrementCounter(`ticket-${ticketId}`);
            if (c === 1) {
              socket.join(ticketId);
            }
            logger.debug(`joinChatbox[${c}]: Channel: ${ticketId} by user ${user.id}`);
          } else {
            socket.disconnect(true);
            logger.info(`Invalid attempt to join channel of ticket ${ticketId} by user ${user.id}`);

          }
        },
        (error) => {
          socket.disconnect(true);
          logger.error(error, `Error fetching ticket ${ticketId}`);
        }
      );
    });

    socket.on("leaveChatBox", async (ticketId: string) => {
      if (!ticketId || ticketId === "undefined") {
        socket.disconnect(true);
        return;
      }

      const c = counters.decrementCounter(`ticket-${ticketId}`);
      if (c === 0) {
        socket.leave(ticketId);
      }
      socket.disconnect(true);
      logger.debug(`leaveChatbox[${c}]: Channel: ${ticketId} by user ${user.id}`);
    });

    socket.on("joinNotification", async () => {
      const c = counters.incrementCounter("notification");
      if (c === 1) {
        if (user.profile === "admin" || user.allTicket) {
          socket.join(`company-${user.companyId}-notification`);
        } else {
          user.queues.forEach((queue) => {
            logger.debug(`User ${user.id} of company ${user.companyId} joined queue ${queue.id} channel.`);
            socket.join(`queue-${queue.id}-notification`);
          });
        }
      }
      logger.debug(`joinNotification[${c}]: User: ${user.id}`);
    });

    socket.on("leaveNotification", async () => {
      const c = counters.decrementCounter("notification");
      if (c === 0) {
        if (user.profile === "admin" || user.allTicket) {
          socket.leave(`company-${user.companyId}-notification`);
          socket.disconnect(true);
        } else {
          user.queues.forEach((queue) => {
            logger.debug(`User ${user.id} of company ${user.companyId} leaved queue ${queue.id} channel.`);
            socket.leave(`queue-${queue.id}-notification`);
            socket.disconnect(true);
          });
        }
      }
      logger.debug(`leaveNotification[${c}]: User: ${user.id}`);
    });

    socket.on("joinTickets", (status: string) => {
      if (counters.incrementCounter(`status-${status}`) === 1) {
        if (user.profile === "admin" || user.allTicket) {
          logger.debug(`Admin ${user.id} of company ${user.companyId} joined ${status} tickets channel.`);
          socket.join(`company-${user.companyId}-${status}`);
        } else {
          user.queues.forEach((queue) => {
            logger.debug(`User ${user.id} of company ${user.companyId} joined queue ${queue.id} pending tickets channel.`);
            socket.join(`queue-${queue.id}-${status}`);
          });
        }
      }
    });

    socket.on("leaveTickets", (status: string) => {
      if (counters.decrementCounter(`status-${status}`) === 0) {
        if (user.profile === "admin") {
          logger.debug(`Admin ${user.id} of company ${user.companyId} leaved ${status} tickets channel.`);
          socket.leave(`company-${user.companyId}-${status}`);
          socket.disconnect(true);
        } else {
          user.queues.forEach((queue) => {
            logger.debug(`User ${user.id} of company ${user.companyId} leaved queue ${queue.id} pending tickets channel.`);
            socket.leave(`queue-${queue.id}-${status}`);
            socket.disconnect(true);
          });
        }
      }
    });
    return io;
  });

  return io;
};

export const getIO = (): SocketIO => {
  if (!io) {
    throw new AppError("Socket IO not initialized");
  }
  return io;
};
