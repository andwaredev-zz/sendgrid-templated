[![Build Status](https://travis-ci.org/andrew-ware/sendgrid-templated.svg?branch=master)](https://travis-ci.org/andrew-ware/sendgrid-templated)
[![npm version](https://badge.fury.io/js/sendgrid-templated.svg)](https://badge.fury.io/js/sendgrid-templated)
[![Coverage Status](https://coveralls.io/repos/github/andrew-ware/sendgrid-templated/badge.svg?branch=master)](https://coveralls.io/github/andrew-ware/sendgrid-templated?branch=master)

# sendgrid-templated

`sendgrid-templated` extends `@sendgrid/client` and `@sendgrid/helpers` to allow for easy use with html templates and data injection.

### Installation

Use `npm i sendgrid-templated` to install the package via NPM.

### Useage

```js
import Email from "sendgrid-templated";

const email = new Email({
  apiKey: "SENDGRID_API_KEY",
  from: { email: "foo@bar.xyz", name: "Jane Doe" },
  to: { email: "fizz@buzz.io", name: "John Doe" },
  subject: "Welcome",
  template: {
    filePath: path.join(__dirname, "templates/welcome.html"),
    data: { firstName: "John", message: "Thanks for joining!" }
  }
});

email
  .send()
  .then(() => {
    // Success!
  })
  .catch(err => {
    // Handle err
  });
```

Assuming `templates/welcome.html` looks something like:

```html
<div>
  <h1>Welcome, {{firstName}}!</h1>
  <div>{{message}}</div>
</div>
```

#### Config Options

The config object supplied to the contructor has the following options:

* `apiKey`: The API key you receive from sendgrid. Defaults to `process.env.SENDGRID_API_KEY`
* `from`: Object containing the `email` and [optional] `name` for the email's `from` info. Defaults to `process.env.SENDGRID_FROM_EMAIL` and `process.env.SENDGRID_FROM_NAME`
* `to`: Object containing the `email` and [optional] `name` for the email's `to` info.
* `subject`: The subject of the email.
* `template`: [optional] Object containing info about the template to be used. See `Template Config Options` below for more details.

#### Template Config Options

The template config object has the following options:

* `filePath`: The path to the html file to be used as the email template.
* `data`: [optional] Object containing key/value pairs of injections to be made into the template.
* `wrappers`: [optional] A tuple of opening and closing char(s) to denote a template variable. (e.g. `["%", "%"]` would denote a template var of format `%firstName%`)

### Contributions

Contributions are welcome!

To continue development on `sendgrid-templated`, clone this repo, then run `npm i` to install all necessary dependencies.

You can run `npm build` to build the project, and `npm test` to run tests.
