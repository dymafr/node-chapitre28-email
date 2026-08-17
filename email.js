const { Resend } = require("resend");
const nodemailer = require("nodemailer");
const pug = require("pug");

class Email {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.devTransporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }

  async getTemplate(templateName, options, prod = false) {
    const template = pug.renderFile(
      `./email-templates/${templateName}.pug`,
      options.metaData
    );
    const from = "Dyma-projects <no-reply@dyma-projects.site>";

    if (prod) {
      const { data, error } = await this.resend.emails.send({
        from,
        to: [options.to],
        subject: options.subject,
        html: template
      });
      if (error) {
        throw error;
      }
      console.log("EMAIL OK ! : ", data);
      return;
    }

    const info = await this.devTransporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: template
    });
    console.log("EMAIL OK ! : ", info);
  }
}

module.exports = new Email();
