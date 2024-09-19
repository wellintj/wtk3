import nodemailer from "nodemailer";
import sequelize from "sequelize";
import database from "../../database";
import Setting from "../../models/Setting";

interface UserData {
  companyId: number;
  // Outras propriedades que você obtém da consulta
}

const SendMail = async (email: string, tokenSenha: string) => {
  try {
    const companyId = 1; // Defina o companyId como 1

    // Verifique se o email existe no banco de dados
    const { hasResult, data } = await filterEmail(email);

    if (!hasResult) {
      return { status: 404, message: "Email não encontrado" };
    }

    const userData = data[0] as UserData;

    if (!userData || userData.companyId === undefined) {
      return { status: 404, message: "Dados do usuário não encontrados" };
    }

    // Busque as configurações de SMTP do banco de dados para a companyId especificada
    const [urlSmtpSetting, userSmtpSetting, passwordSmtpSetting, portSmtpSetting] = await Promise.all([
      Setting.findOne({ where: { companyId, key: 'smtpauth' } }),
      Setting.findOne({ where: { companyId, key: 'usersmtpauth' } }),
      Setting.findOne({ where: { companyId, key: 'clientsecretsmtpauth' } }),
      Setting.findOne({ where: { companyId, key: 'smtpport' } })
    ]);

    const urlSmtp = urlSmtpSetting?.value;
    const userSmtp = userSmtpSetting?.value;
    const passwordSmtp = passwordSmtpSetting?.value;
    const fromEmail = userSmtp; // Defina o email de origem como o usuário SMTP
    const portSmtp = portSmtpSetting?.value;

    if (!urlSmtp || !userSmtp || !passwordSmtp || !portSmtp) {
      throw new Error("Configurações SMTP estão incompletas");
    }

    const transporter = nodemailer.createTransport({
      host: urlSmtp,
      port: Number(portSmtp), // Defina a porta conforme necessário
      secure: false, // Defina como necessário (false geralmente para SMTP não SSL)
      auth: {
        user: userSmtp,
        pass: passwordSmtp
      }
    });

    const { hasResults } = await insertToken(email, tokenSenha);

    if (!hasResults) {
      return { status: 404, message: "Não foi possível inserir o token de redefinição" };
    }

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: "Redefinição de Senha",
      text: `Olá,\n\nVocê solicitou a redefinição de senha para sua conta, utilize o seguinte Código de Verificação para concluir o processo de redefinição de senha:\n\nCódigo de Verificação: ${tokenSenha}\n\nPor favor, copie e cole o Código de Verificação no campo 'Código de Verificação'.\n\nSe você não solicitou esta redefinição de senha, por favor, ignore este e-mail.\n\n\nAtenciosamente`
    };

    const info = await transporter.sendMail(mailOptions);
    return { status: 200, message: "E-mail enviado com sucesso", info };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return { status: 500, message: "Erro interno do servidor" };
  }
};

// Função para verificar se o email existe no banco de dados
const filterEmail = async (email: string) => {
  const sql = `SELECT * FROM "Users" WHERE email ='${email}'`;
  const result = await database.query(sql, { type: sequelize.QueryTypes.SELECT });
  return { hasResult: result.length > 0, data: result };
};

const insertToken = async (email: string, tokenSenha: string) => {
  const sqls = `UPDATE "Users" SET "resetPassword"= '${tokenSenha}' WHERE email ='${email}'`;
  const results = await database.query(sqls, { type: sequelize.QueryTypes.UPDATE });
  return { hasResults: results[1] > 0, datas: results };
};

export default SendMail;
