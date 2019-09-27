const email = require("./email");

email.getTemplate("email-welcome", {
  to: "dyma.learning@gmail.com",
  subject: "Bienvenue sur Dyma-projects",
  metaData: {
    name: "Jean"
  }
});
