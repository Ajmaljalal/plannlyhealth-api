import SendgridMail from '@sendgrid/mail';
SendgridMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default SendgridMail;