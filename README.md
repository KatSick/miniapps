# miniapps

## Install proto (one time)

1. Install [proto](https://moonrepo.dev/docs/proto/install): `bash <(curl -fsSL https://moonrepo.dev/install/proto.sh)`
2. [Linux/MacOS] Ensure `export PROTO_HOME="$HOME/.proto"; export PATH="$PROTO_HOME/shims:$PROTO_HOME/bin:$PATH";` is in your `~/.zshrc`
3. [Linux/MacOS] Add `eval "$(proto activate zsh)"` to the end of your `~/.zshrc`

## Run development

1. Run: `proto use`
2. Run: `moon :dev` for dev server

## To run (and see) OTEL

- Run `git clone -b main https://github.com/SigNoz/signoz.git && cd signoz/deploy/docker`
- Run `docker compose up`
- Go to http://localhost:8080/, register and login

## quirks for Windows

1. [Install Latest PowerShell in ADMIN Terminal](https://learn.microsoft.com/uk-ua/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.5): `winget install --id Microsoft.PowerShell --source winget`
2. Run `irm https://moonrepo.dev/install/proto.ps1 | iex` in Admin terminal also
3. Setup is as default shell (in Terminal and Visual Studio Code)
4. Run the proto install command (read all the steps there)
5. e.g. ensure `proto --version` works

## Pro tips:

- Install recommended extensions (moonrepo, vitest, editorconfig, etc)
