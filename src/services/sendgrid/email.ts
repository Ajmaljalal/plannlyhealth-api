import SendgridMail from "../../configs/sendgrid";


const templateIds: any = {
  "password-reset": "d-a27fdf6c8ed04873b25c662230c96857",
  "invite-user": "d-76e3ea4d358f4a58850bc5fa58ad6194",
}

export const sendRawEmailService = async (requestData: any) => {
  const msg = {
    to: requestData.toEmail,
    from: 'hello@tryplannly.com',
    subject: requestData.subject,
    html: '<strong>html template content here</strong>',
  };
  try {
    const response = await SendgridMail.send(msg);
    return response
  } catch (error) {
    return error;
  }
}

export const sendEmailWithTemplateService = async (requestData: any) => {
  const msg = {
    to: requestData.toEmail,
    from: 'hello@tryplannly.com',
    templateId: templateIds[requestData.type],
    dynamic_template_data: requestData.data,
  };
  try {
    const response = await SendgridMail.send(msg);
    return response
  }
  catch (error) {
    return error;
  }
}