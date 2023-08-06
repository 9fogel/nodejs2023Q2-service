# Home Library Service

## Prerequisites
1. Install [Node.js](https://nodejs.org/en/download/), [Git](https://git-scm.com/downloads).
2. Clone this repository: https://github.com/9fogel/nodejs2023Q2-service.git
3. Switch to `develop` branch
4. To install all dependencies use [`npm install`](https://docs.npmjs.com/cli/install)

## Running application

```
npm start
```
App served at http://localhost:4000

Port value is stored in `.env` file

_After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/._

For more information about OpenAPI/Swagger please visit https://swagger.io/.

**Please note:** The database already has some default values at start

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

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

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