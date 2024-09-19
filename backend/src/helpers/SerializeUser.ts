import Queue from "../models/Queue";
import Company from "../models/Company";
import User from "../models/User";
import Setting from "../models/Setting";

interface SerializedUser {
  id: number;
  name: string;
  email: string;
  profile: string;
  companyId: number;
  company: Company | null;
  super: boolean;
  queues: Queue[];
  allTicket: string;
  startWork: string;
  endWork: string;
  spy: string;
  isTricked: string;
  defaultMenu: string;
  tokenVersion: number;
}

export const SerializeUser = async (user: User): Promise<SerializedUser> => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
    companyId: user.companyId,
    company: user.company,
    super: user.super,
    queues: user.queues,
    allTicket: user.allTicket,
    startWork: user.startWork,
    endWork: user.endWork,
    spy: user.spy,
    isTricked: user.isTricked,
    defaultMenu: user.defaultMenu,
    tokenVersion: user.tokenVersion
  };
};
