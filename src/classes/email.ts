import sgClient = require("@sendgrid/client");
import get = require("lodash.get");
import fs = require("fs");

import { ClientResponse } from "@sendgrid/client/src/response";
import { EmailAddress, Personalization } from "@sendgrid/helpers/classes";
import { EmailJSON, EmailData } from "@sendgrid/helpers/classes/email-address";
import { MailContent, MailData } from "@sendgrid/helpers/classes/mail";
import { PersonalizationData } from "@sendgrid/helpers/classes/personalization";

import Configuration, { ConfigurationData } from "./configuration";
import Mail from "./mail";

export default class Email {
  protected configuration: Configuration;
  protected client: any;
  public mail: Mail;

  constructor(configurationData: ConfigurationData) {
    this.configuration = new Configuration(configurationData);

    this.client = sgClient;
    this.client.setApiKey(this.configuration.apiKey);

    this.mail = new Mail({
      from: this.configuration.from,
      to: this.configuration.to,
      subject: this.configuration.subject
    });

    if (this.configuration.template) {
      this.personalization.setSubstitutionWrappers(
        get(this.configuration, ["template", "wrappers"], ["{{", "}}"]) // default to {{ }}
      );
      this.setTemplateData(get(this.configuration, ["template", "data"], {}));
      this.setTemplateFile(get(this.configuration, ["template", "filePath"]));
    }
  }

  public get personalization(): Personalization {
    return this.mail.personalizations[0];
  }

  private addSubstitution(key: string, value: string): void {
    this.personalization.addSubstitution(key, value);
  }

  private setTemplateFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `[Email.addTemplate] The template file does not exist {path: ${filePath}}.`
      );
    }

    const value = fs.readFileSync(filePath).toString();

    this.mail.addContent({
      type: "text/html",
      value
    });
  }

  private setTemplateData(templateData: { [key: string]: string }): void {
    Object.keys(templateData).forEach(key => {
      this.addSubstitution(key, templateData[key]);
    });
  }

  public send(): Promise<[ClientResponse, any]> {
    return this.client
      .request({
        method: "POST",
        url: "/v3/mail/send",
        body: this.mail.toJSON()
      })
      .then(([response]: [ClientResponse]) => {
        // We can confirm the validity or invalidity of the action by checking the response statusCode
        if (response.statusCode !== 202) {
          // TODO: determine the different types of errors we may receive here
          // and throw specific error if we can figure out what went wrong
          // https://sendgrid.com/docs/API_Reference/api_v3.html
          throw new Error(
            "[Email post] received an error response from the sendgrid API."
          );
        }
      });
  }
}
