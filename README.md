# Home Library Service

## Prerequisites
1. Install [Node.js](https://nodejs.org/en/download/), [Git](https://git-scm.com/downloads).
2. Clone this repository: https://github.com/9fogel/nodejs2023Q2-service.git
3. Switch to `develop` branch
4. To install all dependencies use [`npm install`](https://docs.npmjs.com/cli/install)

## Running application with Docker
1. Install [Docker Desktop](https://docs.docker.com/engine/install/)
2. Make sure Docker Desktop is opened and is running
3. Run the following command in terminal

```
docker-compose up
```
## Stopping application with Docker
1. Run the following command in terminal

```
docker-compose down
```
## Vulnerabilities scanning with Docker
1. Run the following command in terminal (works both with running and stopped container)

```
npm run scan
```
**NB:** This functionality require login into your DockerHub account, otherwise it will be suggested to login within terminal

## Problem solving with Docker
1. In case of issues with Docker please clean docker cashe

```
docker builder prune

OR

docker system prune
```
##
App served at http://localhost:4000

Port value and variables are stored in `.env` file

_After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/._

For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Endpoints
The following endpoints are available:
```
http://localhost:4000/user
http://localhost:4000/artist
http://localhost:4000/track
http://localhost:4000/album
http://localhost:4000/favs
```
Detailed description of expected behaviour can be found in [task assignment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/rest-service/assignment.md).

## Testing

After application running open new terminal and enter:

To run all tests without authorization (docker container must be running)

```
npm run test
```

To run only one of all test suites (docker container must be running)

```
npm run test -- <path to suite>
```

To run all test with authorization - NOT NEEDED FOR THIS TASK

```
npm run test:auth
```

To run only specific test suite with authorization - NOT NEEDED FOR THIS TASK

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging