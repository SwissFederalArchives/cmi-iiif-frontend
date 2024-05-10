<h1 align="center"><a href="https://material-ui.com/" rel="noopener" target="_blank"><img valign="middle" width="32" src="src/images/swiss.svg" alt="Material-UI logo"></a> <span>WebOZ IIIF Viewer</span></h1>

# Description

This software is an open-source and web-based viewer for [IIIF](https://iiif.io/). It is focused on tree views but also works with single manifests. 

It's based on the open-source project [Archival IIIF Viewer](https://github.com/archival-IIIF/viewer).

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