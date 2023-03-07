import { Request, Response } from "express";
import { sendEmailWithTemplateService } from "../../services/sendgrid/email";

export const sendEmail = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    // const email = req.body;
    const response: any = await sendEmailWithTemplateService(data);
    if (response.code >= 400 || response.message) {
      return res.status(response.code).json({
        message: response.response.body.errors[0].message,
        code: response.message
      });
    }
    return res.status(200).send();
  } catch (error: any) {
    console.log(error)
    return res.status(500).send({
      message: error.message,
      code: error.code || 'INTERNAL_SERVER_ERROR',
    });
  }
}