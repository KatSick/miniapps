# Deploy

Check that you have cloned [signoz/signoz](https://github.com/signoz/signoz)
and currently are in `signoz/deploy` folder.

## Docker

If you don't have docker set up, please follow [this guide](https://docs.docker.com/engine/install/)
to set up docker before proceeding with the next steps.

### Using Docker Compose

If you don't have docker compose set up, please follow [this guide](https://docs.docker.com/compose/install/)
to set up docker compose before proceeding with the next steps.

```sh
cd deploy/docker
docker compose up -d
```

Open http://localhost:8080 in your favourite browser.

In a couple of minutes, you should see the data generated from hotrod in SigNoz UI.

For more details, please refer to the [SigNoz documentation](https://signoz.io/docs/install/docker/).
