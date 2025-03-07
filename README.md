![Node.js CI](https://github.com/imranq2/node-fhir-server-mongo/workflows/Node.js%20CI/badge.svg)

![publish_docker](https://github.com/imranq2/node-fhir-server-mongo/workflows/publish_docker/badge.svg)

## Intro

This projects implements the Helix FHIR Server which is a highly scalable FHIR server implementation with real-time data streaming, change event tracking and modern APIs such as GraphQL.

For example:

1. Added support for every FHIR resource
2. Added support for merging data via $merge
3. Added support for $graph endpoint
4. Added support for authentication
5. Added support for checking user/x.x and access/x.x scopes
6. Provides a WebUI to explore the FHIR data using the web browser
7. Support GraphQL access to FHIR resources
8. Added support for all FHIR search parameters
9. Delayed processing for updating history table and creating audit logs to speed up the response to the client.
10. Change events are (optionally) sent to a Kafka queue to enable any client to respond to and also enables realtime streaming.

## Cheat sheet

[Cheatsheet](cheatsheet.md)

## Security

[Security](security.md)

## Optimizing Performance

[Performance](performance.md)

## FHIR GraphDefinition Support (We recommend using graphql below whenever possible instead)

[Graph](graph.md)

## GraphQL Support

[GraphQL](graphql.md)

## Merge functionality

[Merge](merge.md)

## Streaming functionality

[Streaming](streaming.md)

## Optimistic Concurrency Support
[Optimistic Concurrency](concurrency.md)

## Contributing

[Contributing](CONTRIBUTING.md)

## Continous Integration

This project has continuous integration set up so GitHub will automatically run tests on your Pull Requests.

## Building the Docker image and pushing to DockerHub

To deploy this code:

1. Create a new release in GitHub and choose the next available version number as the release name. This builds the docker image and pushes it to two locations: DockerHub (public) and AWS ECR(private for b.well). https://hub.docker.com/repository/docker/imranq2/node-fhir-server-mongo
2. Once step 1 finishes, you can pull this docker image to wherever you're running the fhir server.

## Deploying inside b.well

b.well has automated deployment set up. After the docker image is built and pushed:

1. Run the GitHub Action for the appropriate environment: https://github.com/icanbwell/helm.helix-service/actions and input the version number to deploy

To set environment variables for desired environment update the *environment-name*-ue1.values.yaml in https://github.com/icanbwell/helm.helix-service/tree/main/.helm/

## Checking version of deployed fhir server

Go to `/version` to see what version you're running.

## Health check

Use `/health` as the url for health check in Kubernetes or other systems

## OAuth

The FHIR server implements OAuth. You can set these environment variables:

1. AUTH_JWKS_URL: Where to get the public keys of the OAuth provider (e.g., https://cognito-idp.us-east-1.amazonaws.com/us-east-1_yV7wvD4xD/.well-known/jwks.json)
2. AUTH_CODE_FLOW_URL:
3. AUTH_CODE_FLOW_CLIENT_ID:
4. REDIRECT_TO_LOGIN: whether to redirect a GET call from a web browser to the OAuth Provider login page

## Change Events

The FHIR server can optionally send change events to a Kafka queue:
[Change Events](changeEvents.md)
