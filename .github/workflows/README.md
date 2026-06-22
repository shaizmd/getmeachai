## GitHub Actions Setup

This project now includes two GitHub Actions workflows:

- `deploy.yml`
  Runs on pushes to `main`, builds the app, pushes the Docker image to Docker Hub, and redeploys the EC2 server.
- `pull-request-check.yml`
  Runs on pull requests to `main` and makes sure the app still builds.
  I have made changes here to check the github actions ci/cd pipeline and make sure it works as expected.
  I have made changes here to check the github actions ci/cd pipeline and make sure it works as expected.

### Required GitHub repository secrets

Add these in GitHub:
`Repo -> Settings -> Secrets and variables -> Actions`

Application secrets:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `MONGODB_URI`
- `GH_OAUTH_CLIENT_ID`
- `GH_OAUTH_CLIENT_SECRET`
- `AWS_REGION`
- `AWS_S3_BUCKET_NAME`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_PUBLIC_BASE_URL`

Deployment secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `EC2_HOST`
- `EC2_USERNAME`
- `EC2_SSH_KEY`

### Important notes

- `EC2_HOST` should be your current EC2 public IP or domain.
- `EC2_USERNAME` is usually `ubuntu`.
- `EC2_SSH_KEY` should be the full private key content from your `.pem` file.
- The EC2 server is expected to have the project in `~/getmeachai`.
- The EC2 server is expected to use `docker-compose.yml` with the Docker Hub image:
  `DOCKERHUB_USERNAME/getmeachai:latest`
