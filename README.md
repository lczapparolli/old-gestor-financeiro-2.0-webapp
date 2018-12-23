For more informations about this project motivations and objectives take a look at the API repository: [gestor-financeiro-2.0-api](https://github.com/lczapparolli/gestor-financeiro-2.0-api)

# Table of contents

- [Info](#info)
- [Tecnologies used](#tecnologies-used)
- [Setup](#setup)
- [Run](#run)
- [Deploy](#deploy)

## Info

This is the frontend part of the project. It was separated from the API for better organization, so they are independent.

## Tecnologies used

This is built mainly with React environment and is using the following libraries:

- [React](https://reactjs.org) as frontend framework
- [React-router](https://reacttraining.com/react-router/) for url routing
- [Axios](https://github.com/axios/axios) for API calls
- [Dexie](https://dexie.org/) for indexDB use
- [Node-Sass](https://github.com/sass/node-sass) for Sass pre-processing
- [Jest](https://jestjs.io/) for test running
- [Chai](https://www.chaijs.com/) for test assertions
- [Enzyme](https://airbnb.io/enzyme/) to help testing React components

## Setup

This was initialized with `create-react-app`. You just need to install dependencies:

`npm install`

## Run

`npm start` and you are good to go.

## Deploy

Just use react-script build: `npm build`