#!/usr/bin/env python3
import json
import pathlib
import re
from urllib.parse import parse_qs, unquote, urlparse

CRAWL_FILE = pathlib.Path(
    "/Users/ankush.saxena/Library/Application Support/Code/User/workspaceStorage/"
    "b3cf130b562a3708e721f406d8e9d870/GitHub.copilot-chat/chat-session-resources/"
    "3f321689-230a-418d-a8f8-ced46542033e/call_blE78LaxdKYXJ7k5xnfaZats__vscode-1774618347845/content.txt"
)
PATTERNS_FILE = pathlib.Path("/Users/ankush.saxena/ai-ux-patterns/src/content/patterns.json")

TITLE_TO_ID = {
    "Raw Text Input": "open-input",
    "Image Input": "attachments",
    "Inline Help": "nudges",
    "Voice Input": "voice-input",
    "Inline Suggestions": "suggestions",
    "Prompt Quality Feedback": "prompt-enhancer",
    "Editing Assistance": "prompt-enhancer",
    "Structured Prompt": "madlibs",
    "Paginated Prompt": "madlibs",
    "Cloze Passage": "madlibs",
    "Prompt Placeholder Values": "madlibs",
    "Configurable Controls": "parameters",
    "Reference Material": "attachments",
    "Prompt Templates": "templates",
    "Model Selection": "model-management",
    "Thread Options": "thread-options",
    "Thread History": "thread-history",
    "Generation Tokens": "cost-estimates",
    "Result Options": "result-options",
    "Result Variations": "variations",
    "Result Actions": "result-actions",
    "Show Citations": "citations",
    "Result Rendered Preview": "result-rendered-preview",
    "Full Result Regeneration": "regenerate",
    "Partial Regeneration": "inpainting",
}


def decode_figma_href(embed_url: str) -> str:
    if "url=" in embed_url:
        parsed = urlparse(embed_url)
        q = parse_qs(parsed.query)
        if q.get("url"):
            return unquote(q["url"][0])
    return embed_url


def load_crawl_rows():
    text = CRAWL_FILE.read_text(encoding="utf-8")
    start = text.find('{"totalSubpages"')
    if start == -1:
        raise RuntimeError("Failed to locate crawl JSON in playwright output")

    decoder = json.JSONDecoder()
    try:
        obj, _ = decoder.raw_decode(text[start:])
    except json.JSONDecodeError as exc:
        raise RuntimeError("Failed to parse crawl JSON from playwright output") from exc

    return obj["results"]


def build_embed_map(rows):
    by_id: dict[str, list[dict]] = {}

    for row in rows:
        title = row.get("title", "").replace(" | Notion", "").strip()
        figma_links = row.get("figmaLinks") or []
        if title not in TITLE_TO_ID or not figma_links:
            continue

        pattern_id = TITLE_TO_ID[title]
        by_id.setdefault(pattern_id, [])

        for embed_url in figma_links:
            by_id[pattern_id].append(
                {
                    "type": "embed",
                    "title": title,
                    "description": f"Interactive Figma prototype reference for {title.lower()}.",
                    "embedUrl": embed_url,
                    "href": decode_figma_href(embed_url),
                    "provider": "Figma",
                    "aspectRatio": "16 / 10",
                }
            )

    # De-duplicate by embedUrl per pattern
    deduped: dict[str, list[dict]] = {}
    for pattern_id, embeds in by_id.items():
        seen = set()
        deduped[pattern_id] = []
        for embed in embeds:
            key = embed["embedUrl"]
            if key in seen:
                continue
            seen.add(key)
            deduped[pattern_id].append(embed)

    return deduped


def apply_embeds(by_id):
    data = json.loads(PATTERNS_FILE.read_text(encoding="utf-8"))
    updated = 0

    for pattern in data["patterns"]:
        pattern_id = pattern["id"]
        if pattern_id not in by_id:
            continue

        existing_examples = pattern["content"].get("examples", [])
        existing_embed_urls = {
            ex.get("embedUrl")
            for ex in existing_examples
            if isinstance(ex, dict) and ex.get("type") == "embed"
        }

        to_add = [ex for ex in by_id[pattern_id] if ex["embedUrl"] not in existing_embed_urls]
        if not to_add:
            continue

        # Prototypes first, then existing screenshots/examples
        pattern["content"]["examples"] = to_add + existing_examples
        updated += 1

    PATTERNS_FILE.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    return updated


def main():
    rows = load_crawl_rows()
    embed_map = build_embed_map(rows)
    updated = apply_embeds(embed_map)
    print(f"patterns updated: {updated}")
    print("pattern ids with extracted embeds:", ", ".join(sorted(embed_map.keys())))


if __name__ == "__main__":
    main()
