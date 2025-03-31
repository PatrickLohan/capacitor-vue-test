# capacitor-vue-test

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

- LazyVim (neovim distro)
  config on request

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### CapacitorJS

Set up using [Installing Capacitor - Sync your web code to your native project](https://capacitorjs.com/docs/getting-started#sync-your-web-code-to-your-native-project)

#### Run cap

Now we have a dist folder and the files have been sync'd, use `npx cap sync && npx cap run android` or ios on macos.
