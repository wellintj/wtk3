import {FindOptions} from "sequelize/types";
import {Op} from "sequelize";
import moment from "moment";
import AppError from "../../errors/AppError";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import ShowTicketService from "../TicketServices/ShowTicketService";
import Queue from "../../models/Queue";
import OldMessage from "../../models/OldMessage";
import User from "../../models/User";
import TicketTraking from "../../models/TicketTraking";
import {Sequelize} from "sequelize-typescript";

interface Request {
  companyId: number;
  userId: string;
  dateStart: string;
  dateEnd: string;
  status: string;
  profile: string;
}

interface TicketsQueue {
  time: string;
  total: number;
}

interface Response {


  data: Ticket[];

}

const TicketsQueueService = async ({

                                     dateStart,
                                     dateEnd,
                                     status,
                                     userId,
                                     companyId,
                                     profile

                                   }: Request): Promise<Response> => {



/*
  let filter = {};
  const linkedModels = [{
    model: Contact.default,
    as: "contact",
    attributes: ["id", "name", "number", "profilePicUrl", "companyId", "urlPicture"]
  }, {
    model: User.default,
    as: "user",
    attributes: ["id", "name", "profile"]
  }, {
    model: Queue.default,
    as: "queue"
  }];
  if (status) {
    const a = [];
    const c = await Ticket.default.findAll({
      where: {
        status: "open"
      },
      group: ["companyId", "contactId", "queueId", "whatsappId"],
      attributes: ["companyId", "contactId", "queueId", "whatsappId", [(0, b.fn)("max", (0, b.col)("id")), "id"]]
    });
    if (c) {
      a.push(c.map(a => a.id));
    }
    const e = lodash.intersection(...a);
    filter = {
      ...filter,
      id: {
        [b.Op.in]: e
      }
    };
  }
  if (profile === "user") {
    filter = {
      ...filter,
      userId: userId
    };
  }
  if (dateStart && dateEnd) {
    filter = {
      ...filter,
      createdAt: {
        [b.Op.between]: [+(0, c.startOfDay)((0, c.parseISO)(dateStart)), +(0, c.endOfDay)((0, c.parseISO)(dateEnd))]
      }
    };
  }
  const r = await Ticket.default.findAll({
    where: {
      ...filter,
      companyId: companyId
    },
    include: linkedModels,
    order: [["updatedAt", "DESC"]]
  });
  return r;
 */

let filter = {};
  const linkedModels = [{
    model: User,
    as: "user",
    attributes: ["id", "name", "profile"]
  }, {
    model: Queue,
    as: "queue"
  }];
  if (status) {
    const a = [];
    const c = await Ticket.findAll({
      where: {
        status: "open"
      },
      group: ["companyId", "contactId", "queueId", "whatsappId"],
      attributes: ["companyId", "contactId", "queueId", "whatsappId", [Sequelize.fn("max", Sequelize.col("id")), "id"]]
    });
    if (c) {
      a.push(c.map(a => a.id));
    }
    const e = a.reduce((acc, val) => acc.filter(x => val.includes(x)));
    filter = {
      ...filter,
      id: {
        [Op.in]: e
      }
    };
  }
  if (profile === "user") {
    filter = {
      ...filter,
      userId: userId
    };
  }
  if (dateStart && dateEnd) {
    filter = {
      ...filter,
      createdAt: {
        [Op.between]: [moment(dateStart).startOf('day').toDate(), moment(dateEnd).endOf('day').toDate()]
      }
    };
  }
  const r = await Ticket.findAll({
    where: {
      ...filter,
      companyId: companyId
    },
    include: linkedModels,
    order: [["updatedAt", "DESC"]]
  });
  return {data: r};
}


export default TicketsQueueService;
