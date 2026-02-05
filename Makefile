ci:
	git clean -dfx && \
	pnpm install --frozen-lockfile && \
	moon ci

up:
	proto outdated --latest --update --yes && \
	proto install && \
	pnpm up --latest --interactive --recursive && \
	pnpm dedupe && \
	moon ci

dev:
	moon :dev

infra:
	moon :infra

preview:
	moon :preview
