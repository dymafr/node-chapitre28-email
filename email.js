const nodemailer = require("nodemailer");
const sparkPostTransport = require("nodemailer-sparkpost-transport");
const pug = require("pug");

class Email {
  constructor() {
    this.prodTransporter = nodemailer.createTransport(
      sparkPostTransport({
        sparkPostApiKey: "",
        endpoint: "https://api.eu.sparkpost.com"
      })
    );
    this.devTransporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2b12eba88d4e55",
        pass: "8b5337745d35d6"
      }
    });
  }

  async getTemplate(templateName, options, prod = false) {
    try {
      const template = pug.renderFile(
        `./email-templates/${templateName}.pug`,
        options.metaData
      );
      let data;
      if (prod) {
        data = await this.prodTransporter.sendMail({
          from: "Dyma-projects <no-reply@dyma-projects.site>",
          to: options.to,
          subject: options.subject,
          html: template
        });
      } else {
        data = await this.devTransporter.sendMail({
          from: "Dyma-projects <no-reply@dyma-projects.site>",
          to: options.to,
          subject: options.subject,
          html: template
        });
      }
      console.log("EMAIL OK ! : ", data);
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new Email();
