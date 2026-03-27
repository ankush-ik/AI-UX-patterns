#!/usr/bin/env python3
"""
Enrich patterns.json with aiuxpatterns.com content:
1. Replace sourceUrl with sources array for 14 merged patterns
2. Add userArchetype field
3. Append aiuxpatterns design considerations
4. Add 6 new patterns
"""

import json, sys, pathlib

PATTERNS_FILE = pathlib.Path(__file__).parent.parent / "src/content/patterns.json"

# --- enrichments keyed on pattern id ---

ENRICHMENTS = {
    "open-input": {
        # sources already done; only append to designConsiderations
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "The key consideration here is whether your user needs direct control, "
            "or whether they could benefit from abstraction of UI input controls. "
            "Consider if users need assistance with prompting from an educational standpoint, "
            "feedback on prompt quality, or would benefit from highly abstracted UI inputs "
            "to craft complex prompts."
        ),
    },
    "nudges": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/nudges"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-inline-help.html"},
        ],
        "userArchetype": (
            "Best suited for users unfamiliar with AI or unsure of the requirements. "
            "Not applicable for all users as this succinct guidance does not lead users "
            "through a process like a tutorial would."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "A passive approach to providing users guidance on authoring a prompt. "
            "While the simple guidance can point users in the right direction, consider "
            "adding a link to further resources that provide deeper detail. "
            "Keep content succinct but detailed enough to be helpful on its own. "
            "Consider what is critical information for your users in a particular context."
        ),
    },
    "suggestions": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/suggestions"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-dynamic-suggestions.html"},
        ],
        "userArchetype": (
            "As a passive pattern, many user types can benefit from quality suggestions. "
            "Being that you can accept or ignore these suggestions, novice users can benefit "
            "from quality examples, while advanced users can save time when authoring."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "This pattern analyses the user's current incomplete input and uses AI to provide "
            "suggestions for prompt completions — similar to grammar suggestions but also "
            "directing users toward quality prompt authoring. "
            "Tuning these suggestions is key to ensuring their relevance. "
            "While suggestions are useful, if a user does not want them, they can become "
            "annoying quickly. Consider how many suggestions should be provided and whether "
            "this pattern benefits your particular workflow and UI."
        ),
    },
    "attachments": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/attachments"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-image.html"},
        ],
        "userArchetype": (
            "Users of all technical abilities are mostly familiar with images and visual files. "
            "The ability to attach and query an image should be ubiquitous for all user types, "
            "though the level of detail and sophistication will vary. "
            "For reference material, all users will have an intuitive sense of what material "
            "they'd like the AI to focus on, though understanding the difference between "
            "training data, publicly accessible data, and reference material may take time."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "When providing file uploads, consider core metrics of size and resolution. "
            "For image analysis, a minimum resolution should likely be set — formats like .gif "
            "aren't generally capable of high resolution and therefore aren't as useful as JPG "
            "or PNG. Consider whether your users need to identify a focal point or a specified "
            "area within the image for the AI to focus on. "
            "For reference material, the key variables are how many, how large, and what file "
            "types you allow users to add — these choices are highly contextual to your users' "
            "use case."
        ),
    },
    "madlibs": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/madlibs"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-structured-prompt.html"},
        ],
        "userArchetype": (
            "A great pattern for novice users — this highly scaffolded approach provides "
            "strong guidance because all prompt sections are required before submission. "
            "Equally, it works well for users who frequently author prompts in tightly "
            "defined contexts. A paginated variant focuses attention on one section at a time "
            "and is optimised for first-time or onboarding users. "
            "A two-user variant (placeholder values) also exists: user A composes a complex "
            "prompt and parameterises key values; user B fills out only those key values "
            "and submits the full prompt."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "For a structured prompt to be effective, the overall prompt structure must be "
            "well defined and required for every submission. Potentially some sections could "
            "be marked optional, but this should be limited as this pattern optimises users' "
            "focus on content over prompt structure. "
            "For paginated variants, consider carefully the content required for a quality "
            "prompt and whether it can be compartmentalised reliably — while paginated "
            "workflows focus users, they can also take longer to complete. "
            "For cloze-passage variants, keep the total number of answers low (in the 3–6 "
            "range) and think carefully about the volume of available answers per question "
            "to keep the interaction intuitive."
        ),
    },
    "templates": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/templates"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-prompt-templates.html"},
        ],
        "userArchetype": (
            "For novice users, a library of pre-written prompts can be highly effective, "
            "helping avoid the arresting barrier of a blank page and providing immediately "
            "effective results for them to build confidence. "
            "Advanced users benefit from saving and re-using their own prompts, leveraging "
            "their previous hard work and making experimentation easier."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "A well-crafted prompt can take time and experimentation, so allowing users to "
            "save and access a library of pre-written prompts boosts effectiveness. "
            "Saving templates can be a simple feature; however, consider how it can best "
            "support your users' workflow. Are they able to update an existing template? "
            "A library of pre-written prompts is only effective if the prompts align with "
            "your users' goals."
        ),
    },
    "prompt-enhancer": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/prompt-enhancer"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-quality-feedback.html"},
        ],
        "userArchetype": (
            "Both novice and experienced users can benefit from prompt enhancement. "
            "Any generation — whether image or text — takes time, so allowing users to "
            "author quality prompts faster benefits all skill levels. "
            "Novice users particularly benefit from AI-assisted authoring: having inline, "
            "instant assistance can even boost some users' confidence to start writing in "
            "the first place. "
            "Advanced users gain efficiency by seeing how AI processes and improves their "
            "intent into an optimised form."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "Providing feedback on the overall quality of a user's prompt allows them to "
            "adjust it in real time before submitting for generation. "
            "What determines prompt quality can vary across multiple dimensions — for example "
            "length, detail, specificity, or context description. Consider providing feedback "
            "on multiple dimensions if it empowers users. "
            "AI-assisted editing leverages the model's language ability to refine quickly "
            "typed thoughts. Consider what types of writing enhancements would help your "
            "users most — not only for their prompt writing but also to enhance the quality "
            "of their generated results."
        ),
    },
    "parameters": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/parameters"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-configure-controls.html"},
        ],
        "userArchetype": (
            "Like all highly abstracted interfaces, this pattern allows users to quickly "
            "author a prompt far beyond the complexity possible with direct text input. "
            "Users who understand the meaning of the available options benefit not only from "
            "the initial speed of selection but also from the rapid experimentation it enables."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "A highly abstracted pattern that prioritises user selections from available "
            "controls mapped to pre-existing prompt snippets. The key consideration is "
            "defining appropriate options and being confident in their effectiveness for your "
            "users' context. Even a simple set of options can provide a wide variety of "
            "output possibilities — for example, 3 inputs with 3 options each can produce "
            "27 possible prompt variations. For larger sets of inputs, some conditional logic "
            "may be required."
        ),
    },
    "model-management": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/model-management"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-modal-selection.html"},
        ],
        "userArchetype": (
            "Another advanced-user pattern — to fully utilise a model selection feature "
            "requires some understanding of what models exist, their intended purpose, and "
            "what data they have been trained on. "
            "Most user interfaces are designed with a particular goal defined, so the "
            "appropriate model would typically be pre-selected for less experienced users."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "Whilst a broad AI model brought the pattern into the mainstream, the long-term "
            "landscape will feature varied models trained for particular domains. "
            "Choosing between models may be done automatically based on desired output, "
            "but providing manual selection offers flexibility for accuracy or experimentation. "
            "As the list of available models grows, this option may become more relevant "
            "even for general-purpose interfaces."
        ),
    },
    "cost-estimates": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/cost-estimates"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-generation-tokens.html"},
        ],
        "userArchetype": (
            "Primarily employed for non-paying users to preview a product with compute "
            "limitations — clearly communicating the allocation and how/when it is spent "
            "is important for a positive user experience. "
            "Technical users in API or playground contexts may prefer currency-based estimates, "
            "while non-technical users benefit from a clear product-based credit system."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "AI generations cost compute which is not free, so tokens or credits are a way "
            "to control a user's allocation when each generation costs a different amount. "
            "The key elements in not making tokens frustrating for users are: making the "
            "allocation clear, explaining when and how it is spent, and showing when it "
            "replenishes. Ensure your UI includes: token allocation, remaining allocation, "
            "cost per prompt before execution, token replenishment interval, and an upgrade CTA."
        ),
    },
    "variations": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/variations"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-result-variations.html"},
        ],
        "userArchetype": (
            "Most users may find extended results useful, although context is key. "
            "Consider whether the user's workflow and use case requires experimentation "
            "and creativity, or whether it calls for more accurate, defined results — "
            "more is not always better."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "AI's probabilistic nature means it can provide useful variations to a single "
            "prompt, allowing users to compare and contrast results. "
            "Not all users understand why an AI can deliver multiple responses to the same "
            "question. Consider whether these extra results build or damage trust for your "
            "product. Ensure users understand probabilities and why they can provide a range "
            "of useful results."
        ),
    },
    "citations": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/citations"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-result-citations.html"},
        ],
        "userArchetype": (
            "Citations apply to all users. They are a fundamental aspect of making users "
            "feel comfortable utilising AI output for which they are still likely accountable. "
            "Citations also provide a clear path forward for users to investigate sources "
            "directly or provide their own documented references."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "Providing clear insights into where and how an AI has generated its results is "
            "one of the biggest builders of trust and understanding for users — avoiding the "
            "'black box' perception is key to users staying with a product long term. "
            "Two common approaches: appending cited sources after the result, or displaying "
            "a citation indicator inline that opens a sidebar."
        ),
    },
    "regenerate": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/regenerate"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-full-regeneration.html"},
        ],
        "userArchetype": (
            "This pattern is more applicable to the context of the content than to the "
            "user's ability level. It is primarily a question of the user's expectation of "
            "the system's flexibility. More technically proficient users may want more "
            "granular control."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "AI usually provides a single result per prompt; this pattern re-submits and "
            "regenerates the entire previous prompt result. "
            "Consider if the results your users are generating are more subjective and "
            "whether full regeneration could assist ideation. Also consider whether "
            "regenerating the results requires edits to the initial prompt, or whether "
            "users would benefit from contextually relevant pre-canned prompts "
            "such as 'make more succinct' or 'make less technical'."
        ),
    },
    "inpainting": {
        "sources": [
            {"name": "shapeof.ai", "url": "https://www.shapeof.ai/patterns/inpainting"},
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-partial-regeneration.html"},
        ],
        "userArchetype": (
            "While intuitively this pattern may appear more suited to technically proficient "
            "users, it is broadly applicable because of how commonplace it is to review and "
            "edit text. Selecting only the third paragraph or the second half of a sentence "
            "is an intuitive action for most users."
        ),
        "append_design": (
            "\n\n### From aiuxpatterns.com\n\n"
            "With AI capable of generating long, multi-paragraph results, this pattern allows "
            "for granular editing control over specific selected text. "
            "The key consideration is how granular your users need to edit their results. "
            "Is selection down to the individual letter, word, or whole paragraph? "
            "For example, limiting selection resolution to whole paragraphs is a balanced "
            "trade-off between a simple user experience and a meaningful amount of content "
            "for the AI to regenerate."
        ),
    },
}

# --- 6 new patterns ---

NEW_PATTERNS = [
    {
        "id": "voice-input",
        "title": "Voice Input",
        "description": "A natural spoken-language alternative to text, allowing users to prompt AI using their voice.",
        "thumbnail": "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e91c0634999bad82eb61cd_direct_input_card.webp",
        "categoryId": "input-modalities",
        "sources": [
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-voice-input.html"}
        ],
        "content": {
            "userArchetype": "Speaking is a natural form of expression (for those capable) which means it is widely applicable for many user types. However, it still inherently requires users to understand how to author an effective prompt.",
            "description": "A modal variation of the raw text input, prompt authoring using natural language can be fast and intuitive in the right circumstances. Voice input allows users to dictate prompts verbally, reducing the friction of typing and enabling hands-free or accessibility-driven interactions.\n\nVoice input is closely related to the open text input pattern but differs in modality. The spoken word is transcribed and used as the prompt, making it especially useful in mobile or ambient contexts where typing is inconvenient.\n\n### Common affordances\n\n- A microphone icon or button to trigger recording\n- Visual feedback (waveform, animation) to confirm the system is listening\n- Transcription preview so users can review and edit before submitting\n- Auto-submit option for fast, frictionless flows",
            "designConsiderations": "### Design for environmental context\n\nThe context in which users will speak becomes critical: Is it polite for the user to speak out loud? Can they be heard — is their context reasonably quiet? Does the user want others hearing the input?\n\n### Provide a transcription review step\n\nSpeech recognition is not perfect. Allow users to review and edit the transcription before it is submitted to the model to avoid embarrassing or inaccurate prompts.\n\n### Pair with open text as a fallback\n\nVoice input should complement, not replace, text input. Always provide a keyboard alternative and make switching between modalities seamless.\n\n### Set expectations for processing time\n\nTranscription and potential prompt enhancement add latency. Show clear loading states so users understand the system is working.\n\n### Consider accessibility carefully\n\nVoice input is powerful for users with motor or typing difficulties, but prohibitive for users with speech impairments. Never make it the only input method.",
            "relatedPatterns": ["open-input", "nudges", "suggestions"],
            "examples": []
        }
    },
    {
        "id": "thread-options",
        "title": "Thread Options",
        "description": "Provide users control over whether each prompt continues an existing thread or starts a fresh one.",
        "thumbnail": "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e983e10d03dc12cdcccedc_connectors_card.webp",
        "categoryId": "settings",
        "sources": [
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-threading-options.html"}
        ],
        "content": {
            "userArchetype": "This option is likely suited to users with a good understanding of how AI systems work and the impact of this setting on their results. Whilst providing the option is fairly passive, the impact on results could be large and confuse novice users.",
            "description": "A key aspect of prompting AI is whether the prompt thread is cached or 'remembered' by the AI, or treated as a fresh input. Depending on the context, users may want each prompt to be a new, independent input for the AI.\n\nMost conversational AI products default to a threaded (continued) context, but some use cases — such as independent queries, privacy-sensitive tasks, or debugging — benefit from resetting the context between prompts.",
            "designConsiderations": "### Default to threaded context\n\nA continual thread is the most common interaction model with AI, via a conversational interface using natural language. Default to threading unless the use case explicitly calls for independence.\n\n### Provide a clear refresh action\n\nEven when threading is desired, having the ability to clear the history for a fresh start is valuable. Provide a prominent 'New conversation' or 'Clear context' action.\n\n### Communicate the impact clearly\n\nThe difference between a fresh prompt and a continued thread can significantly affect results. Use helpful copy or tooltips to explain the tradeoff to users who may not understand it.\n\n### Scope thread options to your context\n\nProviding this option heavily depends on your use case. Not all products benefit from exposing this setting — evaluate whether your users have sufficient understanding to use it meaningfully.",
            "relatedPatterns": ["thread-history", "memory", "open-input"],
            "examples": []
        }
    },
    {
        "id": "thread-history",
        "title": "Thread History",
        "description": "Let users review and resume a history of their previous AI conversation threads.",
        "thumbnail": "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e983e10d03dc12cdcccedc_connectors_card.webp",
        "categoryId": "settings",
        "sources": [
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-threading-history.html"}
        ],
        "content": {
            "userArchetype": "Skewed toward more frequent or advanced users — this pattern requires a user to have enough usage to warrant using the thread history feature.",
            "description": "A widely expected account management feature, thread history is not only convenient but even more relevant for AI workflows. Since AI has such a multifaceted skill set, users' interactions will also broaden over time. A clear thread history helps users switch between various topics without losing prior context.\n\nThread history is a key differentiator for products that want to serve as long-term AI companions or work assistants rather than single-session tools.",
            "designConsiderations": "### Organise threads with sensible heuristics\n\nThread histories can be segmented easily if a 'new thread' button is provided. Consider whether simple heuristics can help organise threads, such as grouping by date, topic, or project.\n\n### Name threads automatically and allow renaming\n\nDefault thread names derived from the first prompt help users identify content at a glance. Allow users to rename threads for better organisation.\n\n### Consider history as a retention lever\n\nA thread history encourages return visits and investment in the product. Consider how long history is maintained and whether extended history retention could be a paid account feature.\n\n### Manage privacy expectations\n\nThread history raises privacy implications. Be transparent about what is stored, how long it is kept, and provide easy deletion controls.",
            "relatedPatterns": ["thread-options", "memory", "open-input"],
            "examples": []
        }
    },
    {
        "id": "result-options",
        "title": "Result Options",
        "description": "Provide contextual utilities alongside generated results so users can quickly act on them.",
        "thumbnail": "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ec26da7a5a255bad19b622_variant_card.webp",
        "categoryId": "results",
        "sources": [
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-result-options.html"}
        ],
        "content": {
            "userArchetype": "All users want to quickly action their results, so common actions like copy help everyone. Other functions like auto-play can be highly convenient for anyone and also make products more accessible.",
            "description": "Providing options alongside each result allows users to easily utilise them. The options vary between contexts, but common utilities like copy text are obvious to include.\n\nResult options are the persistent or on-hover controls that appear relative to a generated output. They reduce the friction of common follow-up tasks and keep users in the flow of work.\n\n### Common result options\n\n- **Copy**: Copy the result text or file to the clipboard\n- **Download**: Save a generated file or image\n- **Share**: Share the result with others\n- **Thumbs up/down**: Quick quality feedback\n- **Regenerate**: Re-run the same prompt for a different result\n- **Auto-play**: For audio or video, trigger immediate playback",
            "designConsiderations": "### Keep options close to the result\n\nPlace result options relative to the generated content, not in a distant toolbar. Inline or hover-revealed options reduce the distance between seeing a result and acting on it.\n\n### Prioritise the most common actions\n\nSurface the one or two most used actions prominently and group others in an overflow menu. Avoid cluttering the result surface with rarely used options.\n\n### Use result options as feedback mechanisms\n\nThumb ratings and similar signals allow users to provide feedback on individual results, which products can correlate to the prompt and analyse for quality improvements.\n\n### Include regenerate as an option\n\nA counter-intuitive but important option — because LLMs can provide different results for the same prompt, regenerate allows users to compare and contrast multiple outputs from the same input.",
            "relatedPatterns": ["result-actions", "regenerate", "variations"],
            "examples": []
        }
    },
    {
        "id": "result-actions",
        "title": "Result Actions",
        "description": "Offer contextually relevant, task-specific actions per generated result to accelerate the user's workflow.",
        "thumbnail": "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ec26da7a5a255bad19b622_variant_card.webp",
        "categoryId": "results",
        "sources": [
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-result-actions.html"}
        ],
        "content": {
            "userArchetype": "Depending on the actions provided, novice users can benefit from pre-canned options like 'more succinct'. More advanced users would appreciate these actions being tailored to their specific workflows and potentially even performing multi-step actions.",
            "description": "Result actions serve to provide a quick and easy workflow for complex actions a user might take. Similar to result options, they are more specific to context and usually represent a more complex task than simple utilities like 'copy'.\n\nResult actions are a key place to personalise your product's quick options to simplify complex workflows for your user. Unlike generic options, result actions are derived from domain knowledge about what users typically want to do next with generated content.\n\n### Examples of result actions\n\n- 'Make more succinct' on a text result\n- 'Export to Figma' on a design generation\n- 'Convert to code' on a pseudocode result\n- 'Create ticket from this' on a task description\n- 'Send as email' on a drafted message",
            "designConsiderations": "### Context is everything\n\nWhat do you know about your users and what are they trying to achieve? Can you provide actions that go beyond evolving the immediate result and support their larger workflow?\n\n### Separate options from actions\n\nGeneric utilities (copy, download, share) belong in result options. Specific, domain-relevant tasks with workflow impact belong in result actions. Keeping these visually distinct helps users quickly find the right affordance.\n\n### Support multi-step actions\n\nPower users appreciate result actions that perform multiple steps atomically — for example, summarising and then sending as a Slack message. Design these as clearly-named compound actions rather than exposing each intermediate step.\n\n### Make actions reversible or previewed\n\nSince result actions often have downstream effects (exporting, sending, overwriting), consider showing a preview or requiring confirmation for high-impact actions.",
            "relatedPatterns": ["result-options", "inline-action", "chained-action"],
            "examples": []
        }
    },
    {
        "id": "result-rendered-preview",
        "title": "Result Rendered Preview",
        "description": "Instantly render and display generated content — code, markup, or media — so users can review the live output.",
        "thumbnail": "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ec26da7a5a255bad19b622_variant_card.webp",
        "categoryId": "results",
        "sources": [
            {"name": "aiuxpatterns.com", "url": "https://www.aiuxpatterns.com/pattern-result-rendered-preview.html"}
        ],
        "content": {
            "userArchetype": "Likely for more technical users, this pattern is most commonly used for coded results which require rendering to actually see and review the result's accuracy.",
            "description": "As AI improved its ability to generate varied content types, a rendered preview allows users to instantly see not only the initial result but any iterations made as well.\n\nInstead of presenting raw code, markup, or media files, the rendered preview shows the living, interactive output. This dramatically reduces the cognitive load of evaluating generated content and shortens the feedback loop.\n\n### Common use cases\n\n- **Code/HTML preview**: Generated web components or applications rendered in an iframe or sandbox\n- **Markdown preview**: Formatted text shown alongside the raw markup\n- **SVG/diagram preview**: Vector-based output rendered visually\n- **Audio/video preview**: Generated media played inline without needing to download\n- **Data visualisation**: Generated charts or tables rendered from raw data",
            "designConsiderations": "### Show the preview when it adds value, hide it when it doesn't\n\nNot all file types or results require a preview. A preview is highly effective when relevant but adds friction when it is not required. Define clearly what presents in the preview pane.\n\n### Use split-pane layout for editable content\n\nFor content that users will iterate on (code, markup), show the source on one side and the rendered output on the other. Changes should propagate in near real-time.\n\n### Consider result complexity and length\n\nVery long or complex outputs may be slow to render. Consider pagination, virtual rendering, or progressive loading for large results to keep the interface responsive.\n\n### Sandbox rendered content\n\nFor code previews in particular, render output in a sandboxed environment to prevent security risks from executing untrusted generated code in the main application context.",
            "relatedPatterns": ["result-options", "result-actions", "inpainting"],
            "examples": []
        }
    },
]


def enrich(data: dict) -> dict:
    patterns = data["patterns"]
    
    for p in patterns:
        pid = p["id"]
        if pid not in ENRICHMENTS:
            continue
        
        e = ENRICHMENTS[pid]
        
        # 1. Replace sourceUrl with sources array (if not already done)
        if "sources" in e and "sourceUrl" in p:
            del p["sourceUrl"]
            p["sources"] = e["sources"]
        
        # 2. Add userArchetype to content (if provided)
        if "userArchetype" in e:
            p["content"]["userArchetype"] = e["userArchetype"]
        
        # 3. Append to designConsiderations
        if "append_design" in e:
            p["content"]["designConsiderations"] += e["append_design"]
    
    # Add 6 new patterns (only if not already present)
    existing_ids = {p["id"] for p in patterns}
    for np in NEW_PATTERNS:
        if np["id"] not in existing_ids:
            patterns.append(np)
    
    return data


def main():
    raw = PATTERNS_FILE.read_text(encoding="utf-8")
    data = json.loads(raw)
    
    enriched = enrich(data)
    
    out = json.dumps(enriched, indent=2, ensure_ascii=False)
    PATTERNS_FILE.write_text(out + "\n", encoding="utf-8")
    print(f"Done. Wrote {PATTERNS_FILE}")


if __name__ == "__main__":
    main()
