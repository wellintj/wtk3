import User from "../../models/User";
import AppError from "../../errors/AppError";
import Queue from "../../models/Queue";
import Company from "../../models/Company";

const ShowUserService = async (id: string | number, requestUserId?: string | number): Promise<User> => {
  // Encontrar o usuário solicitado
  const user = await User.findByPk(id, {
    attributes: [
      "name",
      "id",
      "email",
      "companyId",
      "profile",
      "super",
      "tokenVersion",
      "whatsappId",
      "allTicket",
      "startWork",
      "endWork",
      "spy",
      "isTricked",
      "defaultMenu"
    ],
    include: [
      { model: Queue, as: "queues", attributes: ["id", "name", "color"] },
      { model: Company, as: "company", attributes: ["id", "name"] }
    ]
  });

  if (!user) {
    throw new AppError("ERR_NO_USER_FOUND", 404);
  }

  // Verificar permissões se requestUserId for fornecido
  if (requestUserId) {
    const requestUser = await User.findByPk(requestUserId);

    if (!requestUser) {
      throw new AppError("ERR_NO_USER_FOUND", 404);
    }

    if (!requestUser.super && user.companyId !== requestUser.companyId) {
      throw new AppError("ERR_FORBIDDEN", 403);
    }
  }

  return user;
};

export default ShowUserService;
