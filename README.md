# cmi-iiif-frontend

- [cmi-viaduc](https://github.com/SwissFederalArchives/cmi-viaduc)
  - [cmi-viaduc-web-core](https://github.com/SwissFederalArchives/cmi-viaduc-web-core)
  - [cmi-viaduc-web-frontend](https://github.com/SwissFederalArchives/cmi-viaduc-web-frontend)
  - [cmi-viaduc-web-management](https://github.com/SwissFederalArchives/cmi-viaduc-web-management)
  - [cmi-viaduc-backend](https://github.com/SwissFederalArchives/cmi-viaduc-backend)
  - **[cmi-iiif-frontend](https://github.com/SwissFederalArchives/cmi-iiif-frontend)** :triangular_flag_on_post:
  - [cmi-iiif-backend](https://github.com/SwissFederalArchives/cmi-iiif-backend)

# Context

The [Viaduc](https://github.com/SwissFederalArchives/cmi-viaduc) project includes 6 code repositories. This current repository `cmi-iiif-frontend` is the IIIF viewer that allows the user to view digital content online in the browser. It is focused on tree views but also works with single manifests. It's based on the open-source project [Archival IIIF Viewer](https://github.com/archival-IIIF/viewer).
 The viewer uses services that are provided by the _backend_ ([cmi-iiif-backend](https://github.com/SwissFederalArchives/cmi-iiif-backend)).
The other repositories include the applications _public access_ ([cmi-viaduc-web-frontend](https://github.com/SwissFederalArchives/cmi-viaduc-web-frontend)) and the _internal management_ ([cmi-viaduc-web-management](https://github.com/SwissFederalArchives/cmi-viaduc-web-management));  both are Angular applications that access basic services of another Angular library called [cmi-viaduc-web-core](https://github.com/SwissFederalArchives/cmi-viaduc-web-core). The Angular applications are hosted in an `ASP.NET` container (see backend repository [cmi-viaduc-backend](https://github.com/SwissFederalArchives/cmi-viaduc-backend)) and communicate with the system via web API.

![The Big-Picture](docs/imgs/context.svg)

> Note: A general description of the repositories can be found in the repository [cmi-viaduc](https://github.com/SwissFederalArchives/cmi-viaduc).

# Development

## Installation

1. Install [Node.js](https://nodejs.org/en/https://nodejs.org/en/)
1. Install [yarn](https://yarnpkg.com)
1. Install [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm)
1. ```nvm use``` to use the correct node version. Follow installation instructions, if the target node version is not installed yet.

## Watch process
1. ```yarn``` to install dependencies
1. ```yarn start``` to run the watch process based on `webpack-dev-server`

## Build

!! Please read the chapter [Environment Configuration](#environment-configuration) first, to make sure you choose the right build task for your usecase. !!

### Specific Build

This build has to be run, if we want the content of [.env](./.env) to be compiled into [`./public/config.json`](./public/config.json)

 ```
 yarn build
 ```

### Specific Build

 This build job has to be run, if the environment configuration file needs to be left as it is. (see: [`./public/config.json`](./public/config.json))


 ```
 yarn build:generic
 ```

# Environment Configuration

The configuration of an application usually changes depending on the environment it is running in.

To allow this flexibility, the package [dotenv](https://www.npmjs.com/package/dotenv) is often used. It allows the definition of dedicated `.env` files per environment. The values defined there are replacing the placeholders in the code during the watch and build process. This leads to hardcoded values throughout the codebase.

This approach is fine in most cases, but has the disadvantage that a build cannot be used across multiple environments.

In this project, however, it is required that a build can be installed on multiple environments. 

Therefore, it's necessary:
- to decouple the environment variables from the code so that during the build they are not written directly to the source code.
- to provide a way for these variables to be written to the server at runtime.
- further, to provide the ability to conveniently set the environment variables via `.env` so as not to make local development more complex than necessary.

## Decoupling the environment variables from the code

To decouple the environment variables from the code, a logic was introduced that swaps the content of the `.env` variable into a `config.json`. This `config.json` is loaded via Ajax call when the application is loaded and is thus available in the JavaScript code at runtime.

## Variables should be able to be written by the server at runtime

The `config.json` should contain placeholders instead of actual values if required. These placeholders are then replaced with the actual values on the target environment.

# Authors

- [4eyes GmbH](https://www.4eyes.ch/)
- [CM Informatik AG](https://cmiag.ch)
- [Evelix GmbH](https://evelix.ch)

# License

GNU Affero General Public License (AGPLv3), see [LICENSE](LICENSE.TXT)

# Contribute

This repository is a copy which is updated regularly - therefore contributions via pull requests are not possible. However, independent copies (forks) are possible under consideration of the AGPLV3 license.

# Contact

- For general questions (and technical support), please contact the Swiss Federal Archives by e-mail at bundesarchiv@bar.admin.ch.
- Technical questions or problems concerning the source code can be posted here on GitHub via the "Issues" interface.



