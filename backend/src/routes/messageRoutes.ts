import { Router } from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import uploadConfig from "../config/upload";
import tokenAuth from "../middleware/tokenAuth";

import * as MessageController from "../controllers/MessageController";

const messageRoutes = Router();

const upload = multer(uploadConfig);

messageRoutes.get("/messages/all", isAuth, MessageController.getAll);

messageRoutes.get("/messages/:ticketId", isAuth, MessageController.index);

messageRoutes.post("/messages/:ticketId", isAuth, upload.array("medias"), MessageController.store);

messageRoutes.delete("/messages/:messageId", isAuth, MessageController.remove);

messageRoutes.post("/api/messages/send", tokenAuth, upload.array("medias"), MessageController.send);

messageRoutes.post('/message/forward', isAuth, MessageController.forwardMessage);

messageRoutes.post("/test/audio",isAuth,  upload.single("audio"), MessageController.storeAudio);

messageRoutes.post("/messages/typing/:ticketId",isAuth,  MessageController.typing);

messageRoutes.post("/messages/edit/:messageId", isAuth, MessageController.edit);

// Rota para adicionar uma reação a uma mensagem
messageRoutes.post('/messages/:messageId/reactions', isAuth, MessageController.addReaction);


export default messageRoutes;
