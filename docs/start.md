# Quick Start

## Install stuff

```bash
npm install
```

## Run it

```bash
node src/server.js
```

## Try it out

Create a poll:

```bash
curl -X POST http://localhost:3000/polls -H "Content-Type: application/json" -d "{\"question\":\"favorite language?\",\"options\":[\"js\",\"python\",\"go\"]}"
```

Vote:

```bash
curl -X POST http://localhost:3000/polls/1/vote -H "Content-Type: application/json" -d "{\"user_id\":\"bob\",\"option_id\":1}"
```

Get results:

```bash
curl http://localhost:3000/polls/1
```
