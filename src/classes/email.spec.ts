import fs = require("fs");

import Email from "./email";

describe("Email", () => {
  const filePath = "main.html";
  const fileContent = "<div>Hello, World!</div>";
  fs.writeFileSync(filePath, fileContent, "utf8");

  afterAll(() => {
    fs.unlinkSync(filePath);
  });

  const apiKey = "xxx";
  const from = {
    email: "foo@bar.xyz"
  };
  const templateData: { [key: string]: string } = { foo: "bar" };
  const to = { email: "abc@xyz.xyz", name: "abc" };
  const subject = "foobar";
  const wrappers: [string, string] = ["-", "-"];
  const configurationData = {
    apiKey,
    from,
    to,
    template: { data: templateData, filePath, wrappers },
    subject
  };

  describe("Valid", () => {
    const email = new Email(configurationData);

    it("create", () => {
      expect(email).toBeInstanceOf(Email);
    });

    it("should have mail", () => {
      expect(email).toHaveProperty("mail");
    });

    it("should set mail.from", () => {
      expect(email.mail).toHaveProperty("from", from);
    });

    it("should set mail.subject", () => {
      expect(email.mail).toHaveProperty("subject", subject);
    });

    it("should have personalization", () => {
      expect(email).toHaveProperty("personalization");
    });

    it("should set personalization.to", () => {
      expect(email.personalization).toHaveProperty("to", [to]);
    });

    it("should set substitutionWrappers from template.wrappers", () => {
      expect(email.mail).toHaveProperty("substitutionWrappers", wrappers);
    });

    it("should add substitutions from template.data", () => {
      expect(email.personalization).toHaveProperty(
        "substitutions",
        templateData
      );
    });

    it("should set content from template file", () => {
      expect(email.mail).toHaveProperty("content", [
        {
          type: "text/html",
          value: fileContent
        }
      ]);
    });

    it("should send", () => {
      expect(email.send()).resolves.toEqual(undefined);
    });
  });

  describe("Errors", () => {
    it("throws error if no apiKey", () => {
      expect(() => new Email({ to: { email: "abc@xyz.xyz" } })).toThrow();
    });

    it("throws error if provide a template without a valid filePath", () => {
      expect(
        () =>
          new Email({
            ...configurationData,
            template: { filePath: "cats.html" }
          })
      ).toThrow();
    });

    it("should throw error if calls send with bad request ", () => {
      const env = Object.assign({}, process.env);
      process.env.SENDGRID_API_KEY = "xxx";
      process.env.SENDGRID_FROM_EMAIL = "foo@bar.xyz";

      // no email content
      expect(
        new Email({ to: { email: "abc@xyz.xyz" } }).send()
      ).rejects.toThrow();

      process.env = env;
    });
  });
});
