# Strapi Upload Provider for Pixelbin.io

works with Strapi 4.

---

PixelBin.io: <https://www.pixelbin.io/>

Docs: <https://www.pixelbin.io/docs/>

Pre-install: create Pixelbin.io account.

## Installation

```
# using npm
npm install @pixelbin/strapi-provider-upload --save
```

## Parameters

| Parameter  | Description | Example |
| ------------- | ------------- | ------------- |
| PIXELBIN_SECRET | api secret | `a89a57f1-09f3-4z56-a282-4a746ce6cb6e` |

## Example

:zero:

Create Strapi project: ([docs](https://docs.strapi.io/dev-docs/quick-start)).

After successfully creating the project stop the dev server: `CTRL + C`.

:one:

Install upload plugin: `npm install @pixelbin/strapi-provider-upload --save`.

NOTE: Be sure that you are in a folder with your Strapi project: `cd strapi-pixelbin-cloud-project`.

After successful installation your package.json file will have a code:

```
"dependencies": {
    ...
    "@pixelbin/strapi-provider-upload": "^1.0.0",
    ...
  },
```

:two:

Go to code editor to your project folder and create config file for your bucket: `./config/plugins.js` (file `plugins.js` in `config` folder in the root of your Strapi project) with the code:



*Strapi v4*:

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "@pixelbin/strapi-provider-upload",
      providerOptions: {
        apiSecret: env("PIXELBIN_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
```

*Strapi v4: Security Middleware Configuration*

Go to code editor to your project folder and create config file for your bucket: `./config/middlewares.js` (file `middlewares.js` in `config` folder in the root of your Strapi project) with the code:

```javascript

module.exports = [
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
   {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "cdn.pixelbin.io",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "cdn.pixelbin.io",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
```


:three:

Create a .env file in the root of your Strapi project.

Example of `.env.local`:

```
HOST=0.0.0.0
PORT=1337

PIXELBIN_SECRET=a89a57f1-09f3-4z56-a282-4a746ce6cb6e
```

:four:

Test the new uploader.

1. Start Strapi dev server: `npm run develop`.

2. Open [Strapi media library v4](http://localhost:1337/admin/settings/media-library) in a browser and upload a test image.