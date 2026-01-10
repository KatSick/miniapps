up:
	proto outdated --latest --update --yes && \
	proto install && \
	pnpm up --latest --interactive && \
	pnpm dedupe && \
	moon ci
