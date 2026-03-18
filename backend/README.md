# Identity Character MVP — Backend

<!-- API, services, models, validators, and tests. See docs/ and memory-bank/ for context. -->

## Run locally

1. Copy `.env.example` to `.env` and set `DDB_TABLE_NAME` and `BEDROCK_MODEL_ID` (use real values once DynamoDB and Bedrock are set up).
2. `npm install` then `npm run dev`. Server listens on `http://localhost:3000` (or `PORT` from env).
3. Open `http://localhost:3000/docs` for Swagger UI; `http://localhost:3000/health` for health check.
