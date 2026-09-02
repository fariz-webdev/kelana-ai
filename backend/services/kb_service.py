import json
import os

import boto3
from dotenv import load_dotenv

# Load .env from the backend directory (one level up from services/)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
AWS_ACCESS_KEY_ID        = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY    = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION               = os.getenv("AWS_REGION", "ap-southeast-2")
KNOWLEDGE_BASE_ID        = os.getenv("KNOWLEDGE_BASE_ID")
MODEL_ID                 = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")


def _agent_runtime_client():
    """boto3 client for bedrock-agent-runtime (Retrieve API)."""
    return boto3.client(
        service_name="bedrock-agent-runtime",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )


def _bedrock_runtime_client():
    """boto3 client for bedrock-runtime (InvokeModel API)."""
    return boto3.client(
        service_name="bedrock-runtime",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )


def _extract_filename(uri: str) -> str:
    """
    Extract a human-readable filename from an S3 URI or HTTPS URL.

    s3://bucket/docs/Tokyo-Guide-Book.pdf          →  Tokyo-Guide-Book.pdf
    https://bucket.s3.amazonaws.com/Bali.pdf       →  Bali.pdf
    ""                                              →  Unknown source
    """
    if not uri:
        return "Unknown source"
    return uri.rstrip("/").split("/")[-1]


def retrieve_passages(question: str, num_results: int = 5) -> list[dict]:
    """
    Call the Bedrock Agent Runtime Retrieve API (managed KB).

    Returns a list of dicts:
        - text:     passage text
        - score:    relevance score
        - source:   full URI / URL
        - filename: human-readable filename
    """
    if not KNOWLEDGE_BASE_ID:
        raise ValueError("KNOWLEDGE_BASE_ID is not set. Check your .env file.")

    client = _agent_runtime_client()

    response = client.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalQuery={"text": question},
        retrievalConfiguration={
            "managedSearchConfiguration": {
                "numberOfResults": num_results,
            }
        },
    )

    passages = []
    for item in response.get("retrievalResults", []):
        uri = (
            item.get("location", {})
                .get("s3Location", {})
                .get("uri", "")
        )
        passages.append(
            {
                "text":     item.get("content", {}).get("text", "").strip(),
                "score":    item.get("score", 0.0),
                "source":   uri,
                "filename": _extract_filename(uri),
            }
        )

    return passages


def _generate_answer(question: str, context_passages: list[dict]) -> str:
    """
    Send retrieved passages + question to the Bedrock model and return
    the generated answer string.
    """
    context = "\n\n---\n\n".join(
        f"[Source: {p['filename']}]\n{p['text']}"
        for p in context_passages
        if p["text"]
    )

    prompt = (
        "You are a helpful travel assistant. "
        "Answer the user's question using ONLY the information in the provided documents. "
        "If the documents do not contain enough information, say so clearly.\n\n"
        f"Documents:\n{context}\n\n"
        f"Question: {question}\n\n"
        "Answer:"
    )

    client = _bedrock_runtime_client()

    body = {
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}],
            }
        ],
        "inferenceConfig": {
            "maxTokens": 1024,
            "temperature": 0.3,
        },
    }

    response = client.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json",
    )

    result = json.loads(response["body"].read())
    return result["output"]["message"]["content"][0]["text"]


def ask_knowledge_base(question: str) -> dict:
    """
    Main entry point for POST /api/v1/ask.

    1. Retrieve relevant passages from the managed Knowledge Base.
    2. Send passages + question to the Bedrock model for answer generation.
    3. Return answer + deduplicated source list.

    Returns:
        {
            "answer":  str,
            "sources": [{ "filename": str, "source": str }, ...]
        }
    """
    # Step 1: retrieve
    passages = retrieve_passages(question)

    # Step 2: generate answer from retrieved context
    answer = _generate_answer(question, passages)

    # Step 3: deduplicate sources by filename, preserving relevance order
    seen: set[str] = set()
    unique_sources: list[dict] = []
    for p in passages:
        if p["filename"] not in seen:
            seen.add(p["filename"])
            unique_sources.append(
                {
                    "filename": p["filename"],
                    "source":   p["source"],
                }
            )

    return {
        "answer":  answer,
        "sources": unique_sources,
    }
