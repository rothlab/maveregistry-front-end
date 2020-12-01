![](./src/assets/image/logo.png)

# The Frontend of MaveRegistry

[MaveRegistry](https://registry.varianteffect.org) is a collaborative resource to catalyze collaboration, reduce redundant efforts, allow stakeholders to nominate targets, and enable tracking and sharing of progress on ongoing MAVE projects.

This repository contains the development environment of the frontend service of MaveRegistry (the Service).

## Setup

### Install Node.js

The development environment requires [Node.js](https://nodejs.org/en/). We recommend using Node.js version 14, which can be downloaded from [here](https://nodejs.org/en/download/).

### Checkout the code base and install dependencies

To run the Service, download the source code from this repo and install dependencies:

```
# Check out source code
git checkout git@github.com:kvnkuang/maveregistry-front-end.git
cd maveregistry-front-end

# Install dependencies
npm install
```

### Compiles and hot-reloads for development

During development, the Service maintains a development server using [Vue CLI](https://cli.vuejs.org/) to provide a "hot-reload" feature where when changes are made, the affected web pages are updated automatically.

**Do not deploy the development server for production as it is not optimized and may cause degraded performance.**

Start the development server:

```
npm run serve
```

### Compiles and minifies for production

The Service uses [Webpack](https://webpack.js.org/) to create an optimized code bundle for running in a production environment.

```
npm run build
```

### Lints and fixes files

The Service uses [ESLint](https://github.com/vuejs/eslint-plugin-vue) to check and fix syntax errors and violations of [Vue.js Style Guide](https://vuejs.org/v2/style-guide/).

```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Contribute to the codebase

To ensure quality and accountability of code contribution, ths Service uses a continuous integration and automatic deployment pipeline:

1. Push code to development branches
2. Merge code into the production branch
3. Submit a Pull Request for deployment

### 1. Push code to development branches

Code can be pushed to any development branches as you wish. For example, `main` is the current active development branch at the time of writing this manual. However, you will not be able to push code directly to the production branch (`prod`).

### 2. Merge code into the production branch

In short, you will not be able to add code directly to the `prod` branch. Instead, you will have to push code to a development branch and merge code into the `prod` branch with a pull request.

This design minimizes human errors, such as those ones that contaminate the production codebase with debugging and/or incomplete code. Since the `prod` branch hosts code running in a production environment, we want to maintain a high code quality standard in this particular branch.

#### 3. Submit a Pull Request for deployment

Once you are happy with your code in a development branch, you can inititate a [pull request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-requests). Please take a look at [previous pull requests](https://github.com/kvnkuang/maveregistry-front-end/pulls?q=is%3Apr+is%3Aclosed) and understand how they are normally formatted.

Moderators of this repository can choose to accept or decline the pull request. Once accepted, code changes will be merged into the `prod` branch.

The Service uses [GitHub Actions](https://github.com/features/actions) to monitor accepted pull requests and automaically deploy them to the production server.

## Contact me

Please feel free to [contact me](kvn.kuang@mail.utoronto.ca) if you still have questions.

This manual was last updated on 2020-11-30.