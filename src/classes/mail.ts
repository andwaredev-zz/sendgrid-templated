import SGMail from "@sendgrid/helpers/classes/mail";
import { Personalization } from "@sendgrid/helpers/classes";
import { EmailData } from "@sendgrid/helpers/classes/email-address";
import { MailContent } from "@sendgrid/helpers/classes/mail";

/**
 * The sendgrid typing for this class does not provide
 * any of the public props that the class implements.
 * Hence, this little class extension to expose the ones we need.
 */
export default class Mail extends SGMail {
  content: MailContent[];
  from: EmailData;
  personalizations: Personalization[];
  substitutionWrappers: [string, string];
}
