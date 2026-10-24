# CI pipeline

## `build.yaml`: Build and push image

Builds the email service and pushes a Docker image to GitHub Container Registry (GHCR).

### Triggers

- Push to `dev`, `testing`, `main` or `master`
- Manual run: **Actions → Build and push image → Run workflow**

A newer push to the same branch cancels a run that is still in progress.

### Jobs

**`build`** validates the code:

1. Check out the code and set up Node 22 with the npm cache
2. `npm ci --prefer-offline --no-audit`
3. `node --check` on every `src/**/*.mjs` outside `tests/` folders (the project has no build step or tests, so this is the only validation)

**`build-push`** runs only if `build` passes:

1. Check out the code with full history (needed for versioning)
2. Compute the next semantic version with [`paulhatch/semantic-version`](https://github.com/PaulHatch/semantic-version)
3. Log in to `ghcr.io` with the `TOKEN` repository secret
4. Build the `Dockerfile` at the repo root for `linux/amd64` and push it, using the GitHub Actions cache for layers
5. Write the pushed image reference to the run summary

### Image tags

```
ghcr.io/<organization>/<repo>/email-service:<branch>-v<version>
```

For example `ghcr.io/dokumazw/node-email-engine/email-service:dev-v0.0.7`.

- `<organization>/<repo>` is the repository name in lowercase (GHCR requires lowercase).
- `<branch>` is the last segment of the branch name (`feature/x` becomes `x`).
- `<version>` comes from `paulhatch/semantic-version` with `bump_each_commit: true`. It starts from the latest `v*` git tag (or `0.0.0` if there is none) and bumps the patch number once per commit since that tag. Commit messages containing `(MAJOR)` or `(MINOR)` bump those parts instead. To start a new base version, push a tag such as `v1.0.0`.

There is no `latest` tag; deploy by explicit tag. The tag pushed is shown in the run summary and on the repo's **Packages** page.

### Setup

- Add a repository secret named `TOKEN` (**Settings → Secrets and variables → Actions**) holding a personal access token with the `write:packages` scope.
- In **Settings → Actions → General → Workflow permissions**, the organization must allow workflows to write packages (or the explicit `permissions:` block must not be overridden by an org policy).
- New GHCR packages are private by default. To pull from Kubernetes, either make the package public (**Package settings → Change visibility**) or create the `ghcr-secret` pull secret described in [`k8s-charts/README.md`](../../k8s-charts/README.md).

### Deploying a built image

```sh
kubectl -n emails set image deployment/email-service email-service=ghcr.io/<org>/<repo>/email-service:<branch>-v<version>
```

Or update `image:` in `k8s-charts/deployment.yaml` and `docker-compose.yaml`.

### Running the image locally

```sh
docker pull ghcr.io/<org>/<repo>/email-service:<branch>-v<version>
docker run --env-file .env -p 3003:3003 ghcr.io/<org>/<repo>/email-service:<branch>-v<version>
```
