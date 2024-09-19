import { Request, Response } from "express";
import axios from 'axios';
import fs from 'fs';
import * as Yup from "yup";
import {head} from "lodash";
import GetDefaultWhatsApp from "../helpers/GetDefaultWhatsApp";
import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import Message from "../models/Message";
import { getIO } from "../libs/socket";
import Whatsapp from "../models/Whatsapp";
import Queue from '../models/Queue';
import User from '../models/User';
import CreateOrUpdateContactService from "../services/ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketService from "../services/TicketServices/FindOrCreateTicketService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import GetProfilePicUrl from "../services/WbotServices/GetProfilePicUrl";
import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
import UpdateTicketService from "../services/TicketServices/UpdateTicketService";
import { getWbot } from "../libs/wbot";
import SendWhatsAppMessageLink from "../services/WbotServices/SendWhatsAppMessageLink";
import SendWhatsAppMessageAPI from "../services/WbotServices/SendWhatsAppMessageAPI";
import SendWhatsAppMediaImage from "../services/WbotServices/SendWhatsappMediaImage";
//invoices
import FindAllInvoiceService from "../services/InvoicesService/FindAllInvoiceService";
import ListInvoicesServices from "../services/InvoicesService/ListInvoicesServices";
import ShowInvoceService from "../services/InvoicesService/ShowInvoiceService";
import UpdateInvoiceService from "../services/InvoicesService/UpdateInvoiceService";
import Invoices from "../models/Invoices";

// contacts
import ListContactsService from "../services/ContactServices/ListContactsService";
import CreateContactService from "../services/ContactServices/CreateContactService";
import ShowContactService from "../services/ContactServices/ShowContactService";
import UpdateContactService from "../services/ContactServices/UpdateContactService";
import DeleteContactService from "../services/ContactServices/DeleteContactService";
import DeleteAllContactService from "../services/ContactServices/DeleteAllContactService";
import GetContactService from "../services/ContactServices/GetContactService";
import ToggleDisableBotService from "../services/ContactServices/ToggleDisableBotService";
import CheckContactNumber from "../services/WbotServices/CheckNumber";
import CheckIsValidContact from "../services/WbotServices/CheckIsValidContact";

import CreateCompanyService from "../services/CompanyService/CreateCompanyService";
import UpdateCompanyService from "../services/CompanyService/UpdateCompanyService";
import BlockCompanyService from "../services/CompanyService/BlockCompanyService";
import CheckSettings from "../helpers/CheckSettings";

import AppError from "../errors/AppError";
import SimpleListService, { SearchContactParams } from "../services/ContactServices/SimpleListService";
import { ImportXLSContactsService } from "../services/ContactServices/ImportXLSContactsService";
import ApiUsages from "../models/ApiUsages";
import { useDate } from "../utils/useDate";
import TicketTag from "../models/TicketTag";
import Tag from "../models/Tag";
import moment from "moment";
import path from "path";
import Ticket from "../models/Ticket";
import Contact from "../models/Contact";
import Company from "../models/Company";
import {SendPresenceStatus} from "../helpers/SendPresenceStatus";
import ContactCustomField from "../models/ContactCustomField";

type WhatsappData = { whatsappId: number };

export class OnWhatsAppDto {
  constructor(public readonly jid: string, public readonly exists: boolean) {}
}

interface TicketData {
  contactId: number;
  status: string;
  queueId: number;
  userId: number;
  sendFarewellMessage?: boolean;
}

type MessageData = {
  body: string;
  fromMe: boolean;
  read: boolean;
  quotedMsg?: Message;
  number?: string;
};

type IndexGetContactQuery = {
  name: string;
  number: string;
};

interface ExtraInfo extends ContactCustomField {
  name: string;
  value: string;
}

interface ContactData {
  name: string;
  number: string;
  email?: string;
  extraInfo?: ExtraInfo[];
}

// Tipo de dados para Company
type CompanyData = {
  name: string;
  id?: number | string;
  phone?: string;
  email?: string;
  status?: boolean;
  planId?: number;
  campaignsEnabled?: boolean;
  dueDate?: any;
  recurrence?: string;
};

const CompanySchema = Yup.object().shape({
  name: Yup.string().required(),
  id: Yup.number(),
  phone: Yup.string().nullable(),
  email: Yup.string().email().nullable(),
  status: Yup.boolean().nullable(),
  planId: Yup.number().nullable(),
  campaignsEnabled: Yup.boolean().nullable(),
  dueDate: Yup.date().nullable(),
  recurrence: Yup.string().nullable()
});

type IndexQuery = { searchParam: string; pageNumber: string };


export const createCompany = async (req: Request, res: Response) => {
  try {
    await CompanySchema.validate(req.body);
    const newCompany = await Company.create(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    await CompanySchema.validate(req.body);
    const { id } = req.params;
    const [updated] = await Company.update(req.body, { where: { id } });
    if (updated) {
      const updatedCompany = await Company.findByPk(id);
      res.status(200).json(updatedCompany);
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const blockCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Company.update({ status: false }, { where: { id } });
    if (updated) {
      const blockedCompany = await Company.findByPk(id);
      res.status(200).json(blockedCompany);
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const createContact = async (
  whatsappId: number | undefined,
  companyId: number | undefined,
  newContact: string
) => {
  await CheckIsValidContact(newContact, companyId);
  const validNumber: any = await CheckContactNumber(newContact, companyId);
  const profilePicUrl = await GetProfilePicUrl(validNumber, companyId);
  const number = validNumber;
  const contactData = {
    name: `${number}`,
    number,
    profilePicUrl,
    isGroup: false,
    companyId
  };
  const contact = await CreateOrUpdateContactService(contactData, null, null);
  let whatsapp: Whatsapp | null;
  if (whatsappId === undefined) {
    whatsapp = await GetDefaultWhatsApp(companyId);
  } else {
    whatsapp = await Whatsapp.findByPk(whatsappId);
    if (whatsapp === null) {
      throw new AppError(`whatsapp #${whatsappId} not found`);
    }
  }
  const createTicket = await FindOrCreateTicketService(
    contact,
    whatsapp.id,
    0,
    companyId
  );
  const ticket = await ShowTicketService(createTicket.id, companyId);
  SetTicketMessagesAsRead(ticket);
  return ticket;
};

function formatBRNumber(jid: string) {
  const regexp = new RegExp(/^(\d{2})(\d{2})\d{1}(\d{8})$/);
  if (regexp.test(jid)) {
    const match = regexp.exec(jid);
    if (
      match &&
      match[1] === "55" &&
      Number.isInteger(Number.parseInt(match[2]))
    ) {
      const ddd = Number.parseInt(match[2]);
      if (ddd < 31) {
        return match[0];
      } else if (ddd >= 31) {
        return match[1] + match[2] + match[3];
      }
    }
  } else {
    return jid;
  }
}

function createJid(number: string) {
  if (number.includes("@g.us") || number.includes("@s.whatsapp.net")) {
    return formatBRNumber(number) as string;
  }
  return number.includes("-")
    ? `${number}@g.us`
    : `${formatBRNumber(number)}@s.whatsapp.net`;
}

export const indexLink = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const newContact: ContactData = req.body;
  const { whatsappId }: WhatsappData = req.body;
  const { msdelay }: any = req.body;
  const url = req.body.url;
  const caption = req.body.caption;
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const companyId = whatsapp.companyId;
  newContact.number = newContact.number.replace("-", "").replace(" ", "");
  const schema = Yup.object().shape({
    number: Yup.string()
      .required()
      .matches(/^\d+$/, "Invalid number format. Only numbers is allowed.")
  });
  try {
    await schema.validate(newContact);
  } catch (err: any) {
    throw new AppError(err.message);
  }
  const contactAndTicket = await createContact(
    whatsappId,
    companyId,
    newContact.number
  );
  await SendWhatsAppMessageLink({
    ticket: contactAndTicket,
    url,
    caption,
    msdelay
  });
  setTimeout(async () => {
    await UpdateTicketService({
      ticketId: contactAndTicket.id,
      ticketData: {
        status: "pending",
        sendFarewellMessage: false,
        amountUsedBotQueues: 0
      },
      companyId
    });
  }, 200);
  setTimeout(async () => {
    const { dateToClient } = useDate();
    const hoje: string = dateToClient(new Date().toString());
    const timestamp = moment().format();
    const exist = await ApiUsages.findOne({
      where: { dateUsed: hoje, companyId: companyId }
    });
    if (exist) {
      await exist.update({
        usedPDF: exist.dataValues["usedPDF"] + 1,
        UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
        updatedAt: timestamp
      });
    } else {
      const usage = await ApiUsages.create({
        companyId: companyId,
        dateUsed: hoje
      });
      await usage.update({
        usedPDF: usage.dataValues["usedPDF"] + 1,
        UsedOnDay: usage.dataValues["UsedOnDay"] + 1,
        updatedAt: timestamp
      });
    }
  }, 100);
  return res.send({ status: "SUCCESS" });
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const newContact: ContactData = req.body;
  const { whatsappId }: WhatsappData = req.body;
  const { msdelay }: any = req.body;
  const { body, quotedMsg }: MessageData = req.body;
  const medias = req.files as Express.Multer.File[];
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const companyId = whatsapp.companyId;
  newContact.number = newContact.number.replace("-", "").replace(" ", "");
  const schema = Yup.object().shape({
    number: Yup.string()
      .required()
      .matches(/^\d+$/, "Invalid number format. Only numbers is allowed.")
  });
  try {
    await schema.validate(newContact);
  } catch (err: any) {
    throw new AppError(err.message);
  }
  const contactAndTicket = await createContact(
    whatsappId,
    companyId,
    newContact.number
  );
  if (medias) {
    await Promise.all(
      medias.map(async (media: Express.Multer.File) => {
        await SendWhatsAppMedia({ body, media, ticket: contactAndTicket });
      })
    );
  } else {
    await SendWhatsAppMessageAPI({
      body,
      ticket: contactAndTicket,
      quotedMsg,
      msdelay
    });
  }
  setTimeout(async () => {
    await UpdateTicketService({
      ticketId: contactAndTicket.id,
      ticketData: {
        status: "pending",
        sendFarewellMessage: false,
        amountUsedBotQueues: 0
      },
      companyId
    });
  }, 100);
  setTimeout(async () => {
    const { dateToClient } = useDate();
    const hoje: string = dateToClient(new Date().toString());
    const timestamp = moment().format();
    const exist = await ApiUsages.findOne({
      where: { dateUsed: hoje, companyId: companyId }
    });
    if (exist) {
      if (medias) {
        await Promise.all(
          medias.map(async (media: Express.Multer.File) => {
            console.log("media", media);
            const type = path.extname(media.originalname);
            console.log("type", type);
            if (media.mimetype.includes("pdf")) {
              await exist.update({
                usedPDF: exist.dataValues["usedPDF"] + 1,
                UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
                updatedAt: timestamp
              });
            } else if (media.mimetype.includes("image")) {
              await exist.update({
                usedImage: exist.dataValues["usedImage"] + 1,
                UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
                updatedAt: timestamp
              });
            } else if (media.mimetype.includes("video")) {
              await exist.update({
                usedVideo: exist.dataValues["usedVideo"] + 1,
                UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
                updatedAt: timestamp
              });
            } else {
              await exist.update({
                usedOther: exist.dataValues["usedOther"] + 1,
                UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
                updatedAt: timestamp
              });
            }
          })
        );
      } else {
        await exist.update({
          usedText: exist.dataValues["usedText"] + 1,
          UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
          updatedAt: timestamp
        });
      }
    } else {
      await ApiUsages.create({ companyId: companyId, dateUsed: hoje });
      if (medias) {
        await Promise.all(
          medias.map(async (media: Express.Multer.File) => {
            console.log("media", media);
            const type = path.extname(media.originalname);
            console.log("type", type);
            if (media.mimetype.includes("pdf")) {
              await exist.update({
                usedPDF: exist.dataValues["usedPDF"] + 1,
                UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
                updatedAt: timestamp
              });
            } else if (media.mimetype.includes("image")) {
              await exist.update({
                usedImage: exist.dataValues["usedImage"] + 1,
                UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
                updatedAt: timestamp
              });
            } else if (media.mimetype.includes("video")) {
              await exist.update({
                usedVideo: exist.dataValues["usedVideo"] + 1,
                UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
                updatedAt: timestamp
              });
            } else {
              await exist.update({
                usedOther: exist.dataValues["usedOther"] + 1,
                UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
                updatedAt: timestamp
              });
            }
          })
        );
      } else {
        await exist.update({
          usedText: exist.dataValues["usedText"] + 1,
          UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
          updatedAt: timestamp
        });
      }
    }
  }, 100);
  return res.send({ status: "SUCCESS" });
};
export const indexImage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const newContact: ContactData = req.body;
  const { whatsappId }: WhatsappData = req.body;
  const { msdelay }: any = req.body;
  const url = req.body.url;
  const caption = req.body.caption;
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const companyId = whatsapp.companyId;
  newContact.number = newContact.number.replace("-", "").replace(" ", "");
  const schema = Yup.object().shape({
    number: Yup.string()
      .required()
      .matches(/^\d+$/, "Invalid number format. Only numbers is allowed.")
  });
  try {
    await schema.validate(newContact);
  } catch (err: any) {
    throw new AppError(err.message);
  }
  const contactAndTicket = await createContact(
    whatsappId,
    companyId,
    newContact.number
  );
  if (url) {
    await SendWhatsAppMediaImage({
      ticket: contactAndTicket,
      url,
      caption,
      msdelay
    });
  }
  setTimeout(async () => {
    await UpdateTicketService({
      ticketId: contactAndTicket.id,
      ticketData: {
        status: "pending",
        sendFarewellMessage: false,
        amountUsedBotQueues: 0
      },
      companyId
    });
  }, 100);
  setTimeout(async () => {
    const { dateToClient } = useDate();
    const hoje: string = dateToClient(new Date().toString());
    const timestamp = moment().format();
    const exist = await ApiUsages.findOne({
      where: { dateUsed: hoje, companyId: companyId }
    });
    if (exist) {
      await exist.update({
        usedImage: exist.dataValues["usedImage"] + 1,
        UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
        updatedAt: timestamp
      });
    } else {
      const usage = await ApiUsages.create({
        companyId: companyId,
        dateUsed: hoje
      });
      await usage.update({
        usedImage: usage.dataValues["usedImage"] + 1,
        UsedOnDay: usage.dataValues["UsedOnDay"] + 1,
        updatedAt: timestamp
      });
    }
  }, 100);
  return res.send({ status: "SUCCESS" });
};

export const checkNumber = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const newContact: ContactData = req.body;
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const companyId = whatsapp.companyId;
  const number = newContact.number.replace("-", "").replace(" ", "");
  const whatsappDefault = await GetDefaultWhatsApp(companyId);
  const wbot = getWbot(whatsappDefault.id);
  const jid = createJid(number);
  try {
    const [result] = (await wbot.onWhatsApp(jid)) as {
      exists: boolean;
      jid: string;
    }[];
    if (result.exists) {
      setTimeout(async () => {
        const { dateToClient } = useDate();
        const hoje: string = dateToClient(new Date().toString());
        const timestamp = moment().format();
        const exist = await ApiUsages.findOne({
          where: { dateUsed: hoje, companyId: companyId }
        });
        if (exist) {
          await exist.update({
            usedCheckNumber: exist.dataValues["usedCheckNumber"] + 1,
            UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
            updatedAt: timestamp
          });
        } else {
          const usage = await ApiUsages.create({
            companyId: companyId,
            dateUsed: hoje
          });
          await usage.update({
            usedCheckNumber: usage.dataValues["usedCheckNumber"] + 1,
            UsedOnDay: usage.dataValues["UsedOnDay"] + 1,
            updatedAt: timestamp
          });
        }
      }, 100);
      return res
        .status(200)
        .json({
          existsInWhatsapp: true,
          number: number,
          numberFormatted: result.jid
        });
    }
  } catch (error) {
    return res
      .status(400)
      .json({
        existsInWhatsapp: false,
        number: jid,
        error: "Not exists on Whatsapp"
      });
  }
};
export const indexWhatsappsId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log("req", req);
  console.log("req", req.user);
  return res.status(200).json("oi");
};


// api troca de fila //

export const updateQueueId = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { queueId } = req.body;
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const companyId = whatsapp.companyId;

  try {
    // Verifique se a fila pertence à empresa especificada
    const isQueueValidForCompany = await Queue.findOne({
      where: { id: queueId, companyId: companyId },
    });

    if (!isQueueValidForCompany) {
      return res.status(400).json({ status: "ERROR", error: "Invalid queue for the company" });
    }

    // Chame o serviço UpdateTicketService aqui, passando o ticketId e o novo queueId
    await UpdateTicketService({
      ticketId: (ticketId), // Certifique-se de converter para número, se necessário
      ticketData: { queueId },
      companyId: companyId, // Substitua isso pela lógica real para obter companyId a partir do token
    });

    return res.status(200).json({ status: "SUCCESS" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "ERROR", error: "Internal Server Error" });
  }
};

// encerrar ticket

export const closeTicket = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const companyId = whatsapp.companyId;
  const { ticketId } = req.params;
  const ticketData = await ShowTicketService(ticketId, companyId);
    ticketData.status = req.body.ticketData.status;
  console.log(ticketData.status);
  const { ticket } = await UpdateTicketService({
    ticketData: ticketData as TicketData,
    ticketId,
    companyId
  });
  return res.status(200).json(ticket);
};




// add tag //
export const updateTicketTag = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId, tagId } = req.body;
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");

  try {
    // Busque o companyId associado ao token
    const whatsapp = await Whatsapp.findOne({ where: { token } });
    const companyId = whatsapp.companyId;

    // Verifique se a tag pertence à empresa especificada
    const tag = await Tag.findOne({
      where: { id: tagId, companyId: companyId },
    });

    if (!tag) {
      return res.status(400).json({ status: "ERROR", error: "Tag does not belong to the specified company" });
    }

    // Verifique se a tag já está associada ao ticket
    const existingTag = await TicketTag.findOne({
      where: { ticketId, tagId },
    });

    if (existingTag) {
      return res.status(400).json({ status: "ERROR", error: "Tag already associated with the ticket" });
    }

    // Adicione a nova tag ao ticket
    const ticketTag = await TicketTag.create({ ticketId, tagId });

    return res.status(200).json({ status: "SUCCESS", ticketTag });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "ERROR", error: "Failed to update ticket tag" });
  }
};
// remove tag //
export const removeTicketTag = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId, tagId } = req.body;

  try {
    // Verifique se a tag está associada ao ticket
    const ticketTag = await TicketTag.findOne({
      where: { ticketId, tagId },
    });

    if (!ticketTag) {
      return res.status(400).json({ status: "ERROR", error: "Tag is not associated with the ticket" });
    }

    // Remova a associação entre a tag e o ticket
    await ticketTag.destroy();

    return res.status(200).json({ status: "SUCCESS" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "ERROR", error: "Failed to remove ticket tag" });
  }
};

// listar todos os tickets da company //

export const listTicketsByCompany = async (req: Request, res: Response): Promise<Response> => {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const companyId = whatsapp.companyId;

  try {
    // Certifique-se de converter companyId para número, se necessário
    const tickets = await Ticket.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: Contact,
          as: "contact",
          attributes: [
            "id",
            "name",
            "number",
            "email",
            "profilePicUrl",
            "acceptAudioMessage",
            "active",
            "disableBot"
          ],
          include: ["extraInfo"]
        },
        { model: Queue, as: "queue", attributes: ["id", "name", "color"] },
        { model: User, as: "user", attributes: ["id", "name"] },
        { model: Tag, as: "tags", attributes: ["id", "name", "color"] },
        {
          model: Whatsapp,
          as: "whatsapp",
          attributes: ["name", "facebookUserToken", "facebookUserId"]
        },
        { model: Company, as: "company", attributes: ["name"] }
      ]
    });

    return res.status(200).json({ status: "SUCCESS", tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "ERROR", error: "Internal Server Error" });
  }
};

// listar todos os tickets por tagId
export const listTicketsByTag = async (req: Request, res: Response): Promise<Response> => {
  const { tagId } = req.params;
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");

  try {
    // Busque o companyId associado ao token
    const whatsapp = await Whatsapp.findOne({ where: { token } });
    const companyId = whatsapp.companyId;

    // Verifique se a tag pertence à empresa especificada
    const tag = await Tag.findOne({
      where: { id: tagId, companyId: companyId },
    });

    if (!tag) {
      return res.status(400).json({ status: "ERROR", error: "Tag does not belong to the specified company" });
    }

    // Busque todos os tickets relacionados à tag específica, à empresa e à tagId
    const tickets = await Ticket.findAll({
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "name",],
          through: {
            attributes: [],
            where: { tagId: tagId }
          }
        },
        {
          model: Contact,
          as: "contact",
          attributes: [
            "id",
            "name",
            "number",
            "email",
            "profilePicUrl",
            "acceptAudioMessage",
            "active",
            "disableBot"
          ],
          include: ["extraInfo"]
        },
        { model: Queue, as: "queue", attributes: ["id", "name", "color"] },
        { model: User, as: "user", attributes: ["id", "name"] },
        {
          model: Whatsapp,
          as: "whatsapp",
          attributes: ["name", "facebookUserToken", "facebookUserId"]
        },
        { model: Company, as: "company", attributes: ["name"] }
      ],
      where: {
        companyId: companyId,  // Adicionando condição para filtrar pela empresa correta
        '$tags.id$': tagId  // Adicionando condição para filtrar pela tagId correta
      }
    });

    return res.status(200).json({ status: "SUCCESS", tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "ERROR", error: "Internal Server Error" });
  }
};

export const listTicketsByTagIsAuth = async (req: Request, res: Response): Promise<Response> => {
  const { tagId } = req.params;

  try {
    // Certifique-se de converter companyId para número, se necessário
    const tickets = await Ticket.findAll({
      include: [
        {
          model: Contact,
          as: "contact",
          attributes: [
            "name",
            "number",
            "email",
          ],
          include: ["extraInfo"]
        },
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "name", "color"],
          where: { id: tagId } // Adicione esta condição para filtrar pela tag específica
        },
        {
          model: Whatsapp,
          as: "whatsapp",
          attributes: ["name", "facebookUserToken", "facebookUserId"]
        },
        { model: Company, as: "company", attributes: ["name"] }
      ]
    });

    return res.status(200).json({ status: "SUCCESS", tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "ERROR", error: "Internal Server Error" });
  }
};
export function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const handleAudioLink = async (req: Request, res: Response): Promise<Response> => {
  const { link, contactNumber } = req.body;
   // Defina o caminho onde deseja salvar o arquivo de áudio baixado

  try {
    // Obtenha o WhatsApp associado ao token
    const authHeader = req.headers.authorization;
    const [, token] = authHeader.split(' ');
    const whatsapp = await Whatsapp.findOne({ where: { token } });
    const companyId = whatsapp.companyId;
    const whatsappDefault = await GetDefaultWhatsApp(companyId);
    const wbot = getWbot(whatsappDefault.id);

    const localFilePath = `./public/company${companyId}/${makeid(10)}.mp3`;

    if (!whatsapp) {
      return res.status(401).json({ status: 'ERRO', error: 'Token de autorização inválido' });
    }

    // Baixe o áudio do link
    const response = await axios.get(link, { responseType: 'arraybuffer' });
    fs.writeFileSync(localFilePath, Buffer.from(response.data));

    // Use o código existente para enviar a mensagem de áudio
    const caption = 'Legenda do áudio';

    await SendPresenceStatus(wbot, contactNumber);

    await wbot.sendMessage(
      `${contactNumber}@s.whatsapp.net`,
      {
        audio: fs.readFileSync(localFilePath),
        fileName: caption,
        caption: caption,
        mimetype: 'audio/mp4', // Defina o tipo de mídia correto para arquivos de áudio
        ptt: true,
      }
    );

    return res.status(200).json({ status: 'SUCESSO' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'ERRO', error: 'Erro ao lidar com o link de áudio' });
  }
};

//invoices

type StorePlanData = {
  name: string;
  id?: number | string;
  users: number | 0;
  connections: number | 0;
  queues: number | 0;
  value: number;
};
type UpdateInvoiceData = { status: string; id?: string };

export const indexApi = async (req: Request, res: Response): Promise<Response> => {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const companyId = whatsapp.companyId;
  const { searchParam, pageNumber } = req.query as IndexQuery;

  if (companyId === 1)
  {
    const { invoices, count, hasMore } = await ListInvoicesServices({
      searchParam,
      pageNumber
    });
    return res.json({ invoices, count, hasMore });
  } else {
    return res.status(401).json({ status: 'ERRO', error: 'Acesso não autorizado. Por favor, forneça credenciais válidas.' });
  }


};
export const showApi = async (req: Request, res: Response): Promise<Response> => {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const companyId = whatsapp.companyId;
  const { Invoiceid } = req.params;
  const invoice = await ShowInvoceService(Invoiceid);
  return res.status(200).json(invoice);
};

export const showAllApi = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization;
    const [, token] = authHeader.split(" ");
    const whatsapp = await Whatsapp.findOne({ where: { token } });
    const compKey = whatsapp.companyId;

    // Extrair id e status do corpo da solicitação
    const { companyId, status } = req.body;

    // Filtrar os invoices pelo companyId e status
    if (compKey === 1){
      const invoices = await Invoices.findAll({
        where: {
          companyId,
          status
        }
      });

      return res.status(200).json(invoices);
    } else{
      return res.status(401).json({ status: 'ERRO', error: 'Acesso não autorizado. Por favor, forneça credenciais válidas.' });
    }

  } catch (error) {
    console.error("Erro ao buscar invoices:", error);
    return res.status(500).json({ error: "Erro ao buscar invoices" });
  }
};

export const updateApi = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const whatsapp = await Whatsapp.findOne({ where: { token } });
  const compKey = whatsapp.companyId;
  const InvoiceData: UpdateInvoiceData = req.body;
  const schema = Yup.object().shape({ name: Yup.string() });
  try {
    await schema.validate(InvoiceData);
  } catch (err) {
    throw new AppError(err.message);
  }
  const { id, status } = InvoiceData;

  if (compKey === 1){
    const plan = await UpdateInvoiceService({ id, status });


      const invoices = await Invoices.findByPk(id);
      const companyId = invoices.companyId;
      const company = await Company.findByPk(companyId);
      const expiresAt = new Date(company.dueDate);
      expiresAt.setDate(expiresAt.getDate() + 30);
      const date = expiresAt.toISOString().split("T")[0];
      if (company) {
        await company.update({ dueDate: date });
        const invoi = await invoices.update({
          id: id,
          status: "paid"
        });
        await company.reload();
        const io = getIO();
        const companyUpdate = await Company.findOne({
          where: { id: companyId }
        });

      }


    return res.status(200).json(plan);
  } else{
    return res.status(401).json({ status: 'ERRO', error: 'Acesso não autorizado. Por favor, forneça credenciais válidas.' });
  }
};

export const updateUsageStats = async (req: Request, res: Response) => {
  // Verifique se req.user existe e tem a propriedade companyId
  if (!req.user || !req.user.companyId) {
    return res.status(400).send({ status: "ERROR", message: "Missing user or companyId" });
  }

  const { companyId } = req.user;
  const { contactId } = req.params;

  setTimeout(async () => {
    const { dateToClient } = useDate();
    const hoje: string = dateToClient(new Date().toString());
    const timestamp = moment().format();

    try {
      const exist = await ApiUsages.findOne({
        where: { dateUsed: hoje, companyId: companyId }
      });

      if (exist) {
        await exist.update({
          usedOther: exist.dataValues["usedOther"] + 1,
          UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
          updatedAt: timestamp
        });
      } else {
        const usage = await ApiUsages.create({
          companyId: companyId,
          dateUsed: hoje
        });
        await usage.update({
          usedOther: usage.dataValues["usedOther"] + 1,
          UsedOnDay: usage.dataValues["UsedOnDay"] + 1,
          updatedAt: timestamp
        });
      }
    } catch (error) {
      console.error("Error updating usage stats:", error);
      return res.status(500).send({ status: "ERROR", message: "Internal server error" });
    }
  }, 100);

  return res.send({ status: "SUCCESS" });
};

export const indexContacts = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber } = req.query as IndexQuery;
  const { companyId } = req.user;

  const { contacts, count, hasMore } = await ListContactsService({
    searchParam,
    pageNumber,
    companyId
  });

  return res.json({ contacts, count, hasMore });
};

export const listContacts = async (req: Request, res: Response): Promise<Response> => {
  const { name } = req.query as unknown as SearchContactParams;
  const { companyId } = req.user;

  const contacts = await SimpleListService({ name, companyId });

  return res.json(contacts);
};

export const showContacts = async (req: Request, res: Response): Promise<Response> => {
  const { contactId } = req.params;
  const { companyId } = req.user;

  //await updateUsageStats(companyId, contactId);
  const contact = await ShowContactService(contactId, companyId);

  return res.status(200).json(contact);
};

export const findOrCreateContacts = async (req: Request, res: Response): Promise<Response> => {
  const { name, number } = req.body as IndexGetContactQuery;
  const { companyId } = req.user;

  const contact = await GetContactService({
    name,
    number,
    companyId
  });

  return res.status(200).json(contact);
};

export const storeContacts = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const newContact: ContactData = req.body;
  newContact.number = newContact.number.replace("-", "").replace(" ", "");

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    number: Yup.string()
      .required()
      .matches(/^\d+$/, "Invalid number format. Only numbers is allowed.")
  });

  try {
    await schema.validate(newContact);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  await CheckIsValidContact(newContact.number, companyId);
  const validNumber = await CheckContactNumber(newContact.number, companyId);
  const number = validNumber.jid.replace(/\D/g, "");
  newContact.number = number;

  const contact = await CreateContactService({
    ...newContact,
    companyId
  });

  const io = getIO();
  io.emit(`company-${companyId}-contact`, {
    action: "create",
    contact
  });

  return res.status(200).json(contact);
};

export const removeAllContacts = async (req: Request, res: Response) => {
  const { companyId } = req.user;

  try {
    await Contact.destroy({
      where: { companyId: companyId }
    });

    // Emitindo evento para atualizar a interface do usuário em tempo real
    const io = getIO();
    io.emit(`company-${companyId}-contact`, {
      action: "deleteAll"
    });

    setTimeout(async () => {
      const { dateToClient } = useDate();
      const hoje: string = dateToClient(new Date().toString());
      const timestamp = moment().format();

      try {
        const exist = await ApiUsages.findOne({
          where: { dateUsed: hoje, companyId: companyId }
        });

        if (exist) {
          await exist.update({
            usedOther: exist.dataValues["usedOther"] + 1,
            UsedOnDay: exist.dataValues["UsedOnDay"] + 1,
            updatedAt: timestamp
          });
        } else {
          const usage = await ApiUsages.create({
            companyId: companyId,
            dateUsed: hoje
          });
          await usage.update({
            usedOther: usage.dataValues["usedOther"] + 1,
            UsedOnDay: usage.dataValues["UsedOnDay"] + 1,
            updatedAt: timestamp
          });
        }
      } catch (error) {
        console.error("Error updating usage stats:", error);
        return res.status(500).send({ status: "ERROR", message: "Internal server error" });
      }
    }, 100);

    return res.status(200).send({ status: "SUCCESS", message: "All contacts removed successfully" });
  } catch (error) {
    console.error("Error removing all contacts:", error);
    return res.status(500).send({ status: "ERROR", message: "Internal server error" });
  }
};

export const updateContacts = async (req: Request, res: Response): Promise<Response> => {
  const contactData: ContactData = req.body;
  const { companyId } = req.user;

  const schema = Yup.object().shape({
    name: Yup.string(),
    number: Yup.string().matches(
      /^\d+$/,
      "Invalid number format. Only numbers is allowed."
    )
  });

  try {
    await schema.validate(contactData);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  await CheckIsValidContact(contactData.number, companyId);
  const validNumber = await CheckContactNumber(contactData.number, companyId);
  const number = validNumber.jid.replace(/\D/g, "");
  contactData.number = number;

  const { contactId } = req.params;

  const contact = await UpdateContactService({
    contactData,
    contactId,
    companyId
  });

  const io = getIO();
  io.emit(`company-${companyId}-contact`, {
    action: "update",
    contact
  });

  //await updateUsageStats(contactId, companyId);

  return res.status(200).json(contact);
};

export const removeContacts = async (req: Request, res: Response): Promise<Response> => {
  const { contactId } = req.params;
  const { companyId } = req.user;

  await ShowContactService(contactId, companyId);

  await DeleteContactService(contactId);

  const io = getIO();
  io.emit(`company-${companyId}-contact`, {
    action: "delete",
    contactId
  });

  return res.status(200).json({ message: "Contact deleted" });
};

export const uploadContacts = async (request: Request, response: Response) => {
  const files = request.files as Express.Multer.File[];
  const firstFile = head(files);
  const { companyId } = request.user;

  const importedContacts = await ImportXLSContactsService(companyId, firstFile);

  const socket = getIO();
  const message = {
    action: "reload",
    records: importedContacts
  };

  socket
    .to(`company-${companyId}-mainchannel`)
    .emit(`company-${companyId}-contact`, message);

  return response.status(200).json(importedContacts);
};

export const toggleDisableBotContacts = async (req: Request, res: Response): Promise<Response> => {
  const { contactId } = req.params;
  const { companyId } = req.user;

  const updatedContact = await ToggleDisableBotService(contactId, companyId);

  const io = getIO();
  io.emit(`company-${companyId}-contact`, {
    action: "update",
    contact: updatedContact
  });

  return res.status(200).json(updatedContact);
};
