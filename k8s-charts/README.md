# Kubernetes manifests

Plain Kubernetes manifests for running the email service (`src/index.mjs`, port `3003`). All resources go in the `emails` namespace.

| File | Contents |
|---|---|
| `config.yaml` | `ConfigMap` `email-service-config` (non-secret settings) and `Secret` `email-service-secrets` (passwords, tokens) |
| `deployment.yaml` | `Deployment` `email-service` and `Service` `email-service` (port 80 → container 3003) |
| `ingress.yaml` | Traefik `IngressRoute` `email-service-http` (port 80, redirects to HTTPS), `IngressRoute` `email-service-https` (port 443, TLS) and `Middleware` `email-service-security-headers` |

## Prerequisites

- Traefik with the `traefik.io/v1alpha1` CRDs, `web` and `websecure` entry points, and a certificate resolver named `myresolver`
- A `redirect-to-https` `Middleware` in the `emails` namespace (shared, not defined here)
- DNS for `email.dev.quantumshift.qzz.io` pointing at Traefik
- If the GHCR package is private, a pull secret named `ghcr-secret`:

  ```sh
  kubectl create secret docker-registry ghcr-secret -n emails \
    --docker-server=ghcr.io \
    --docker-username=<github-user> \
    --docker-password=<PAT with read:packages>
  ```

## Configure

1. In `deployment.yaml` and `../docker-compose.yaml`, set `image` to the tag the pipeline pushed, e.g. `ghcr.io/<org>/<repo>/email-service:dev-v0.0.12` (see [the pipeline README](../.github/workflows/README.md#image-tags)).
2. If the host is not `email.dev.quantumshift.qzz.io`, change it in both `IngressRoute`s in `ingress.yaml` and in `OUTLOOK_REDIRECT_URI` in `config.yaml`.
3. In `config.yaml`, set the `ConfigMap` values. `OUTLOOK_REDIRECT_URI` must match the ingress host and the redirect URI registered in Azure.
4. Create the real secrets. Do not commit them to `config.yaml`; either remove the `Secret` block from that file or leave its placeholders and create it separately:

   ```sh
   kubectl create secret generic email-service-secrets -n emails \
     --from-literal=MAIL_PASS=... \
     --from-literal=SMTP_PASSWORD=... \
     --from-literal=OUTLOOK_PASSWORD=... \
     --from-literal=OUTLOOK_CLIENT_SECRET=... \
     --from-literal=OUTLOOK_REFRESH_TOKEN=... \
     --from-literal=KEYCLOAK_SECRET=...
   ```

### Environment variables

| Variable | Where | Used by |
|---|---|---|
| `PORT` | ConfigMap | HTTP port (default `3003`) |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER` / `MAIL_PASS` | ConfigMap / Secret | Custom SMTP (default `emailType`) |
| `SMTP_USER` / `SMTP_PASSWORD` | ConfigMap / Secret | Gmail transport |
| `OUTLOOK_USER` / `OUTLOOK_PASSWORD` | ConfigMap / Secret | Outlook SMTP and Graph app-only sender |
| `OUTLOOK_TENANT_ID`, `OUTLOOK_CLIENT_ID` / `OUTLOOK_CLIENT_SECRET` | ConfigMap / Secret | Microsoft Graph |
| `OUTLOOK_AUTH_TENANT`, `OUTLOOK_REDIRECT_URI` / `OUTLOOK_REFRESH_TOKEN` | ConfigMap / Secret | Graph delegated (OAuth) sending |
| `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID` / `KEYCLOAK_SECRET` | ConfigMap / Secret | Keycloak middleware |

## Deploy

```sh
kubectl apply -f k8s-charts/
kubectl -n emails rollout status deployment/email-service
```

To roll out a new image:

```sh
kubectl -n emails set image deployment/email-service email-service=ghcr.io/<org>/<repo>/email-service:<branch>-v<version>
```

After changing `config.yaml`, re-apply and restart, since pods read env vars only at startup:

```sh
kubectl apply -f k8s-charts/config.yaml
kubectl -n emails rollout restart deployment/email-service
```

## Verify

```sh
kubectl -n emails get pods -l app=email-service
kubectl -n emails logs -l app=email-service
kubectl -n emails get ingressroute,middleware
kubectl -n emails port-forward svc/email-service 3003:80   # then open http://localhost:3003/api-docs
curl -I https://email.dev.quantumshift.qzz.io/api-docs/          # check the security headers
```

## Notes

- **Single replica.** Sessions and Outlook OAuth tokens are held in memory, so scaling beyond one pod gives inconsistent behaviour.
- **Refresh token storage.** The OAuth callback writes the refresh token to `src/.env` inside the container, which is lost on restart. Copy it into `OUTLOOK_REFRESH_TOKEN` in the Secret to persist it.
- **Probes** are TCP checks on the HTTP port; the app has no health endpoint.
- **Authentication is not enforced** on the API routes yet (no `keycloak.protect()`). Do not expose the ingress publicly until it is.
