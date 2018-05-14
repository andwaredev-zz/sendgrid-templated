import get = require("lodash.get");

import { EmailJSON } from "@sendgrid/helpers/classes/email-address";

export interface ConfigurationTemplate {
  filePath: string;
  data?: {
    [key: string]: string;
  };
  wrappers?: string[];
}

export interface ConfigurationData {
  apiKey?: string;
  from?: EmailJSON;
  to: EmailJSON | EmailJSON[];
  template?: ConfigurationTemplate;
  subject?: string;
}

export default class Configuration {
  public apiKey: string;
  public from: EmailJSON;
  public to: EmailJSON | EmailJSON[];
  public template?: ConfigurationTemplate;
  public subject?: string;

  constructor(data: ConfigurationData) {
    const apiKey = get(data, "apiKey", process.env.SENDGRID_API_KEY);
    if (!apiKey) {
      throw new Error("[ProductionConfiguration.constructor] apiKey required.");
    }

    this.apiKey = apiKey;

    const from = {
      email: get(data, ["from", "email"], process.env.SENDGRID_FROM_EMAIL),
      name: get(data, ["from", "name"], process.env.SENDGRID_FROM_NAME)
    };

    if (!from.email) {
      throw new Error(
        "[ProductionConfiguration.constructor] from email required."
      );
    }

    this.from = from;

    if (Array.isArray(data.to) ? data.to.some(t => !t.email) : !data.to.email) {
      throw new Error(
        "[ProductionConfiguration.constructor] to email required."
      );
    }

    this.to = data.to;

    if (get(data, "template") && !get(data, ["template", "filePath"])) {
      throw new Error(
        "[ProductionConfiguration.constructor] template filePath required."
      );
    }

    this.template = get(data, "template");
    this.subject = get(data, "subject");
  }
}
