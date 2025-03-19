// this file is generated — do not edit it

/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 *
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 *
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 *
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 *
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 *
 * You can override `.env` values from the command line like so:
 *
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const NVM_INC: string;
	export const STARSHIP_SHELL: string;
	export const MANPATH: string;
	export const GHOSTTY_RESOURCES_DIR: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const NVM_CD_FLAGS: string;
	export const SHELL: string;
	export const TERM: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_config_local_prefix: string;
	export const ZSH: string;
	export const NVM_DIR: string;
	export const USER: string;
	export const LS_COLORS: string;
	export const COMMAND_MODE: string;
	export const SSH_AUTH_SOCK: string;
	export const HOMEBREW_NO_AUTO_UPDATE: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const PAGER: string;
	export const LSCOLORS: string;
	export const NPM_TOKEN: string;
	export const PATH: string;
	export const npm_package_json: string;
	export const _: string;
	export const LaunchInstanceID: string;
	export const __CFBundleIdentifier: string;
	export const npm_command: string;
	export const PWD: string;
	export const npm_lifecycle_event: string;
	export const npm_package_name: string;
	export const LANG: string;
	export const XPC_FLAGS: string;
	export const npm_package_version: string;
	export const XPC_SERVICE_NAME: string;
	export const HOME: string;
	export const SHLVL: string;
	export const GHOSTTY_SHELL_INTEGRATION_NO_SUDO: string;
	export const TERMINFO: string;
	export const JFROG_IDENTITY_TOKEN: string;
	export const HOMEBREW_PREFIX: string;
	export const STARSHIP_SESSION_KEY: string;
	export const LESS: string;
	export const LOGNAME: string;
	export const npm_lifecycle_script: string;
	export const ATUIN_SESSION: string;
	export const XDG_DATA_DIRS: string;
	export const YARN_NPM_AUTH_IDENT: string;
	export const GHOSTTY_BIN_DIR: string;
	export const BUN_INSTALL: string;
	export const HOMEBREW_CASK_OPTS: string;
	export const NVM_BIN: string;
	export const npm_config_user_agent: string;
	export const BROWSER: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const SECURITYSESSIONID: string;
	export const NODE_EXTRA_CA_CERTS: string;
	export const npm_node_execpath: string;
	export const COLORTERM: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 *
 * Values are replaced statically at build time.
 *
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 *
 * This module cannot be imported into client-side code.
 *
 * Dynamic environment variables cannot be used during prerendering.
 *
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 *
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		NVM_INC: string;
		STARSHIP_SHELL: string;
		MANPATH: string;
		GHOSTTY_RESOURCES_DIR: string;
		TERM_PROGRAM: string;
		NODE: string;
		NVM_CD_FLAGS: string;
		SHELL: string;
		TERM: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		TERM_PROGRAM_VERSION: string;
		npm_config_local_prefix: string;
		ZSH: string;
		NVM_DIR: string;
		USER: string;
		LS_COLORS: string;
		COMMAND_MODE: string;
		SSH_AUTH_SOCK: string;
		HOMEBREW_NO_AUTO_UPDATE: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		PAGER: string;
		LSCOLORS: string;
		NPM_TOKEN: string;
		PATH: string;
		npm_package_json: string;
		_: string;
		LaunchInstanceID: string;
		__CFBundleIdentifier: string;
		npm_command: string;
		PWD: string;
		npm_lifecycle_event: string;
		npm_package_name: string;
		LANG: string;
		XPC_FLAGS: string;
		npm_package_version: string;
		XPC_SERVICE_NAME: string;
		HOME: string;
		SHLVL: string;
		GHOSTTY_SHELL_INTEGRATION_NO_SUDO: string;
		TERMINFO: string;
		JFROG_IDENTITY_TOKEN: string;
		HOMEBREW_PREFIX: string;
		STARSHIP_SESSION_KEY: string;
		LESS: string;
		LOGNAME: string;
		npm_lifecycle_script: string;
		ATUIN_SESSION: string;
		XDG_DATA_DIRS: string;
		YARN_NPM_AUTH_IDENT: string;
		GHOSTTY_BIN_DIR: string;
		BUN_INSTALL: string;
		HOMEBREW_CASK_OPTS: string;
		NVM_BIN: string;
		npm_config_user_agent: string;
		BROWSER: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		SECURITYSESSIONID: string;
		NODE_EXTRA_CA_CERTS: string;
		npm_node_execpath: string;
		COLORTERM: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	};
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 *
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 *
 * Dynamic environment variables cannot be used during prerendering.
 *
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	};
}
