import {Request, Response} from "express";
import {getIO} from "../libs/socket";
import {removeWbot, restartWbot} from "../libs/wbot";
import {StartWhatsAppSession} from "../services/WbotServices/StartWhatsAppSession";
import FindAllCompanyService from "../services/CompanyService/FindAllCompaniesService";
import CreateWhatsAppService from "../services/WhatsappService/CreateWhatsAppService";
import DeleteWhatsAppService from "../services/WhatsappService/DeleteWhatsAppService";
import ListWhatsAppsService from "../services/WhatsappService/ListWhatsAppsService";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import AppError from "../errors/AppError";
import Ticket from "../models/Ticket";
import {Op} from "sequelize";
import {closeImportedTickets} from "../services/WhatsappService/ImportWhatsAppMessageService";
import { FindOptions } from "sequelize/types";
import Queue from "../models/Queue";
import Whatsapp from "../models/Whatsapp";

interface WhatsappData {
  name: string;
  queueIds: number[];
  companyId: number;
  greetingMessage?: string;
  complationMessage?: string;
  outOfHoursMessage?: string;
  ratingMessage?: string;
  status?: string;
  isDefault?: boolean;
  token?: string;
  sendIdQueue?: number;
  timeSendQueue?: number;
  promptId?: number;
  allowGroup?: boolean;
  importOldMessages? : string;
  importRecentMessages? : string;
  closedTicketsPostImported?: boolean;
  importOldMessagesGroups?: boolean;

  maxUseBotQueues?: number;
  timeUseBotQueues?: number;
  expiresTicket?: number;
  expiresInactiveMessage?: string;
}

interface QueryParams {
  session?: number | string;
}


export const closedTickets = async (req: Request, res: Response): Promise<Response> => {
  const {whatsappId} = req.params;
  await closeImportedTickets(whatsappId);
  return res.status(200).json('whatsapp');
}
export const index = async (req: Request, res: Response): Promise<Response> => {
  const {companyId} = req.user;
  const {session} = req.query as QueryParams;
  const whatsapps = await ListWhatsAppsService({companyId, session});

  return res.status(200).json(whatsapps);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    status,
    isDefault,
    greetingMessage,
    complationMessage,
    outOfHoursMessage,
    queueIds,
    token,
    allowGroup,
    timeSendQueue,
    sendIdQueue,
    promptId,
    maxUseBotQueues,
    timeUseBotQueues,
    expiresTicket,
    expiresInactiveMessage,
    importOldMessages,
    importRecentMessages,
    closedTicketsPostImported,
    importOldMessagesGroups
  }: WhatsappData = req.body;
  const {companyId} = req.user;

  const {whatsapp, oldDefaultWhatsapp} = await CreateWhatsAppService({
    name,
    status,
    isDefault,
    greetingMessage,
    complationMessage,
    outOfHoursMessage,
    queueIds,
    companyId,
    token,
    timeSendQueue,
    sendIdQueue,
    promptId,
    maxUseBotQueues,
    timeUseBotQueues,
    expiresTicket,
    expiresInactiveMessage,
    allowGroup,
    importOldMessages,
    importRecentMessages,
    closedTicketsPostImported,
    importOldMessagesGroups
  });

   StartWhatsAppSession(whatsapp, companyId);

  const io = getIO();
  io
    .to(`company-${companyId}-mainchannel`)
    .emit(`company-${companyId}-whatsapp`, {
    action: "update",
    whatsapp
  });

  if (oldDefaultWhatsapp) {
    io
      .to(`company-${companyId}-mainchannel`)
      .emit(`company-${companyId}-whatsapp`, {
      action: "update",
      whatsapp: oldDefaultWhatsapp
    });
  }

  return res.status(200).json(whatsapp);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const {whatsappId} = req.params;
  const {companyId} = req.user;
  const {session} = req.query;

  const whatsapp = await ShowWhatsAppService(whatsappId, companyId, session);

  return res.status(200).json(whatsapp);
};

export const getAllConnections = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Buscar todas as empresas
    const companies = await FindAllCompanyService();
    if (!companies || companies.length === 0) {
      return res.status(404).json({ error: "No companies found" });
    }

    // Buscar todas as conexões de WhatsApp para todas as empresas
    const allConnections = [];
    for (const company of companies) {
      // Certifique-se de que o companyId é um número
      if (typeof company.id !== 'number') {
        continue; // Se não for um número, pule para a próxima iteração
      }
      const connections = await Whatsapp.findAll({
        where: { companyId: company.id }
      });
      allConnections.push(...connections);
    }

    return res.status(200).json(allConnections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch connections" });
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {whatsappId} = req.params;
  const whatsappData = req.body;
  const {companyId} = req.user;

  const {whatsapp, oldDefaultWhatsapp} = await UpdateWhatsAppService({
    whatsappData,
    whatsappId,
    companyId
  });

  const io = getIO();
  io
    .to(`company-${companyId}-mainchannel`)
    .emit(`company-${companyId}-whatsapp`, {
    action: "update",
    whatsapp
  });

  if (oldDefaultWhatsapp) {
    io
      .to(`company-${companyId}-mainchannel`)
      .emit(`company-${companyId}-whatsapp`, {
      action: "update",
      whatsapp: oldDefaultWhatsapp
    });
  }

  return res.status(200).json(whatsapp);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {whatsappId} = req.params;
  const {companyId} = req.user;

  const whatsapp = await ShowWhatsAppService(whatsappId, companyId);

  const openTickets: Ticket[] = await whatsapp.$get('tickets', {
    where: {
      status: {[Op.or]: ["open", "pending"]}
    }
  });

  if (openTickets.length > 0) {
    throw new AppError("Não é possível remover conexão que contém tickets não resolvidos");
  }

  await DeleteWhatsAppService(whatsappId);
  await removeWbot(+whatsappId);

  const io = getIO();
  io
    .to(`company-${companyId}-mainchannel`)
    .emit(`company-${companyId}-whatsapp`, {
    action: "delete",
    whatsappId: +whatsappId
  });

  return res.status(200).json({message: "Whatsapp deleted."});
};

export const restart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId, profile } = req.user;
  if (profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
  await restartWbot(companyId);
  return res.status(200).json({ message: "Whatsapp restart." });
};
