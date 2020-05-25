import path from 'path';
import nodemailer from 'nodemailer';
import expresshbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

import mailConfig from '../config/mail';

interface MailMessage {
  to: string;
  subject: string;
  template: string;
  context: {
    provider: string;
    user: string;
    date: string;
  };
}

class Mail {
  transporter!: any;
  constructor() {
    const { host, auth } = mailConfig;

    this.transporter = nodemailer.createTransport(
      `smtp://${auth.user}:${auth.pass}@${host}`
    );

    this.configureTemplate();
  }

  configureTemplate() {
    const viewPath = path.resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: expresshbs.create({
          layoutsDir: path.resolve(viewPath, 'layouts'),
          partialsDir: path.resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        extName: '.hbs',
        viewPath,
      })
    );
  }

  sendMail(message: MailMessage) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
