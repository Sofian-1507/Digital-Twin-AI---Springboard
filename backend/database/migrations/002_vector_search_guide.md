# MongoDB Atlas Vector Search Setup Guide (HNSW Indexes)

Because Mongoose ODM and Node.js MongoDB drivers cannot programmatically create Vector Search indexes, you must deploy the HNSW (Hierarchical Navigable Small World) indexes using the MongoDB Atlas UI or Admin API.

---

## Step 1: Atlas UI Configuration

1. Log into your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. Select your Target Cluster (`DigitalTwinAI-Prod` or `Cluster0`).
3. Navigate to **Atlas Search** in the left-hand navigation bar, or click **Browse Collections** -> **Search Indexes**.
4. Click the **Create Search Index** button.
5. Choose **Atlas Vector Search** as the index type and click **Next**.
6. Select **JSON Editor**.

---

## Step 2: Create Recommendations Vector Index

1. Select Database: `digital_twin_ai_prod`
2. Select Collection: `recommendations`
3. Set Index Name: `idx_rec_vector_search`
4. Paste the following JSON configuration:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    { "type": "filter", "path": "user_id" },
    { "type": "filter", "path": "category" },
    { "type": "filter", "path": "status" }
  ]
}
```

5. Click **Next** -> **Create Search Index**. Wait 1–3 minutes for index status to reach `Active`.

---

## Step 3: Create Chat History Vector Index

1. Repeat the steps for Collection: `chat_history`
2. Set Index Name: `idx_chat_vector_search`
3. Paste the following JSON configuration:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "messages.embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    { "type": "filter", "path": "user_id" }
  ]
}
```

4. Click **Create Search Index**.

---

## Verification

Once active, test semantic similarity queries in your TypeScript terminal:

```bash
npm run build
ts-node database/connections/vector_client.ts
```
