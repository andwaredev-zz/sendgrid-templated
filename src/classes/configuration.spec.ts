import Configuration from "./configuration";

describe("Configuration", () => {
  describe("Valid", () => {
    it("create with process.env.SENDGRID_API_KEY", () => {
      const env = Object.assign({}, process.env);
      process.env.SENDGRID_API_KEY = "xxx";
      process.env.SENDGRID_FROM_EMAIL = "foo@bar.xyz";

      expect(
        new Configuration({
          to: { email: "abc@xyz.xyz" },
          template: { filePath: "/templates/main" }
        })
      ).toBeInstanceOf(Configuration);

      process.env = env;
    });

    const configurationData = {
      apiKey: "yyy",
      from: { email: "foo@bar.xyz", name: "foo" },
      to: { email: "abc@xyz.xyz", name: "abc" },
      template: {
        filePath: "/templates/main",
        data: { foo: "bar" },
        wrappers: ["%", "%"]
      }
    };

    it("create with provided apiKey prop", () => {
      expect(new Configuration(configurationData)).toBeInstanceOf(
        Configuration
      );
    });

    it("should have apiKey", () => {
      expect(new Configuration(configurationData).apiKey).toEqual("yyy");
    });

    it("should have from", () => {
      expect(new Configuration(configurationData).from).toEqual({
        email: "foo@bar.xyz",
        name: "foo"
      });
    });

    it("should have to", () => {
      expect(new Configuration(configurationData).to).toEqual({
        email: "abc@xyz.xyz",
        name: "abc"
      });
    });

    it("should have template", () => {
      expect(new Configuration(configurationData).template).toEqual({
        filePath: "/templates/main",
        data: { foo: "bar" },
        wrappers: ["%", "%"]
      });
    });

    it("should have suject", () => {
      expect(
        new Configuration({ ...configurationData, subject: "SUBJECT" }).subject
      ).toEqual("SUBJECT");
    });
  });

  describe("Error", () => {
    it("throws error if no apiKey", () => {
      expect(
        () => new Configuration({ to: { email: "foo@bar.xyz" } })
      ).toThrow();
    });

    it("throws error if no from email", () => {
      expect(
        () =>
          new Configuration({
            apiKey: "xxx",
            to: { email: "abc@xyz.xyz" },
            template: { filePath: "/templates/main" }
          })
      ).toThrow();
    });

    it("throws error if no to email", () => {
      expect(
        () =>
          new Configuration({
            apiKey: "xxx",
            from: { email: "foo@bar.xyz" },
            to: [{ email: "" }],
            template: { filePath: "/templates/main" }
          })
      ).toThrow();
    });

    it("throws error if no to template filePath", () => {
      expect(
        () =>
          new Configuration({
            apiKey: "xxx",
            from: { email: "foo@bar.xyz" },
            to: { email: "abc@xyz.xyz" },
            template: { filePath: "" }
          })
      ).toThrow();
    });
  });
});
