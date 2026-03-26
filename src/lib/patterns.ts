export interface Pattern {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  sourceUrl?: string;
  content: {
    description: string;
    designConsiderations: string;
     relatedPatterns: string[];
    examples: Array<{
      image: string;
      description: string;
    }>;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "wayfinders",
    name: "Wayfinders",
    description: "Help users construct their first prompt and get started",
    icon: "compass",
  },
  {
    id: "prompt-actions",
    name: "Prompt Actions",
    description: "Different actions that users can direct AI to complete",
    icon: "zap",
  },
  {
    id: "settings",
    name: "Settings",
    description: "Adjust and tune contextual data, token weights, and input details to refine the prompt and results",
    icon: "settings",
  },
  {
    id: "results",
    name: "Results",
    description: "Different ways to present outcomes",
    icon: "layout",
  },
  {
    id: "editing",
    name: "Editing",
    description: "Options to tweak and remixing results",
    icon: "edit",
  },
  {
    id: "governors",
    name: "Governors",
    description: "Human-in-the-loop features to maintain user oversight and agency",
    icon: "shield",
  },
  {
    id: "trust-builders",
    name: "Trust Builders",
    description: "Give users confidence that the AI's results are ethical, accurate, and trustworthy",
    icon: "check-circle",
  },
  {
    id: "identifiers",
    name: "Identifiers",
    description: "Distinct qualities of AI that can be modified at the brand or model level to stand out",
    icon: "tag",
  },
];

export const patterns: Pattern[] = [
  // Wayfinders
  {
    id: "example-gallery",
    title: "Example Gallery",
    description: "Share sample generations, prompts, and parameters to educate and inspire users.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c16353b034124655be4b_gallery_card.webp",
    categoryId: "wayfinders",
    sourceUrl: "https://www.shapeof.ai/patterns/gallery",
    content: {
      description: "When you open a new app, tool, or creative product, one of the hardest things is knowing how to start. Galleries are collections of sample generations that help users avoid the intimidation of a blank slate by letting them browse examples of what is possible. From the first experience through continuous onboarding, galleries help users spark ideas, understand how the product works, and encourage engagement.\n\n### Gallery variations\n\n**Curated gallery**: Hand-selected by the platform team to highlight capability, quality, or brand direction. Good for first impressions or to set a standard.\n\n**Community gallery**: Built from user submissions, often with voting, trending, or remix options. These are particularly empowering because they show what real users have been capable of making.\n\n**Dynamic gallery**: Algorithmically surfaced examples based on current trends, user profile, or previous activity. Content tends to be fresh but may get stuck in a bubble of the user's own preferences.\n\n### Common traits of galleries\n\nFor galleries to be helpful, they must both inspire and instruct. They may be organized and filterable by theme, use cases, popularity, or temporality. Give users the ability to interact with the examples and pull other generations in as attached sources for their own work.\n\n**Clear previews**: Thumbnails, short clips, or snippets should make the example instantly legible. Users scan quickly and choose based on first impression.\n\n**Structured organization**: Categories, tags, and filters (e.g. by task, theme, or popularity) prevent overload and help users find what's relevant.\n\n**Actionable examples**: Good galleries let users \"start from here\" or remix with one click, and expose the prompt, parameters, and sample references transparently.\n\n**Varied samples**: Mixing polished, curated highlights with everyday, practical examples created by other users sets realistic expectations while broadening a user's perception of what they are capable of creating.\n\n**Attribution and context**: Showing the name and profile of the person who created the example incentivizes sharing to keep examples timely and relevant to recent trends, while helping new users uncover tastemakers and visualize the product's capabilities through an expert lens.\n\nWhen building a gallery, consider whether your goal is to highlight community engagement or emphasize generative quality. The most effective galleries balance real-world examples with curated seeds, putting the product in its best light while still inspiring creativity.",
      designConsiderations: "### Make browsing easy\nProvide search, categories, and filters so examples are easy to browse and relevant to the task at hand, and so they pull users toward creation. Make every tile an entry point by letting users copy prompts, adjust parameters, or remix the example into their workspace.\n\n### Use metadata as teaching material\nExpose the prompt, model, style, and key parameters that produced the sample. This helps users reverse-engineer how results were achieved and understand more complicated functionality.\n\n### Reflect your product's strengths\nA gallery should highlight what differentiates the platform, not just generic or commodity use cases. This helps users connect with your product's distinct value and capabilities. For instance, Copy.ai emphasizes tone control, while ElevenLabs spotlights voice range and fidelity.\n\n### Balance curation and community\nCurated content ensures quality and sets a bar for style or brand direction. Community contributions drive engagement and authenticity. Decide which matters for your purpose or include both.\n\n### Maintain freshness\nRotate galleries regularly, retire outdated items, and highlight timely themes or trends to keep content alive. Static galleries may quickly signal neglect, especially in creative tools where novelty is part of the draw.\n\n### Moderate and protect\nIn community galleries, manage submissions carefully so harmful or off-brand content never reaches the frontend. Respect licensing and IP, allowing contributors to control visibility and view how their work is reused.\n\n### Use the gallery as onboarding\nFor new users, a well-curated first page can double as a tutorial. Pair example galleries with quick actions like \"Try this,\" \"See prompt,\" or \"Modify input.\" This turns exploration into guided learning rather than passive browsing.\n\n### Encourage ongoing engagement\nFeatures like favoriting, saving, and sharing turn galleries into active tools rather than static showcases, keeping users involved over time.",
       relatedPatterns: ["initial-cta", "templates", "prompt-details", "suggestions", "preset-styles"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d19458c9bae3c06a0253c2_gallery_copyai.webp",
          description: "Copy.ai supports a prompt templates gallery, which makes it easy for users to get started while demonstrating what great writing prompts look like to less experienced users.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d188c5ba268d0b2ddfe26e_gallery_elevenlabs.webp",
          description: "ElevenLabs presents their gallery as a collection of projects using their various tools to show how different voices, formats, and modes can be applied across multiple contexts.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d1890a11784a3e9bb3d1ea_gallery_lindy.webp",
          description: "Lindy's workflows gallery is organized by use case, so users can understand how different AI-powered steps can be used towards a specific goal.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d18954f6c27e4b4a20167d_gallery_lovable.webp",
          description: "Lovable shows fully built-out projects in its \"Made with Lovable\" gallery, emphasizing the clout-oriented metric of how many times it has been remixed.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d155f182d8492601671f53_gallery_sora.webp",
          description: "Sora features video and image galleries in its core product, with a focus on curated examples. Users can view, modify, or copy the prompt or remix direct from an image.",
        },
      ],
    },
  },
  {
    id: "follow-up",
    title: "Follow Up",
    description: "Get more information from the user when the initial prompt isn't sufficiently clear.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c1789bfbe47c600c3211_follow_up_card.webp",
    categoryId: "wayfinders",
    sourceUrl: "https://www.shapeof.ai/patterns/follow-up",
    content: {
      description: "In an ideal scenario, the user is so good at prompting that they can reach a great outcome on their first try. In reality, that's often not the case. Follow ups are prompts, questions, or inline actions that help users refine or extend their initial interaction with the model so the model can better understand their intent.\n\nA well-timed follow up saves compute cycles, prevents wasted effort, and communicates that the AI is working alongside the user rather than starting over.\n\n**In open conversation or unstructured search**: follow ups are used to probe deeper into the user's interests and needs.\n\n**During deep research or other compute-heavy tasks**: follow ups are used to precede the generation, ensuring the AI has a thorough understanding of the user's intent to avoid wasted energy.\n\n**In action-oriented flows**: follow ups are used as nudges and inline actions to engage the user further.\n\nSuccessful follow ups can serve as a psuedo sample prompt, borrowing context from the initial request and giving the user the sense that the AI is moving forward with them. Consider combining follow ups with an Action plan to provide even more upfront transparency and control to the user.\n\n### Follow ups throughout the user lifecycle\n\nFollow ups are especially important early in the user journey, when the AI has the least amount of information about the them, their interests, and the context they are operating in. The more AI has to guess, the more likely it will waste compute power (and the user's time) on the wrong direction.\n\nAs the AI builds its memory of the user, or when the user assists by providing attachments and other context up front, the AI has to guess less. Follow ups then become less important, and can become more personalized to the user when used.\n\n### Variations and forms\n\n**Conversation extenders**: Suggest additional questions, topics, or actions for the user to take after completing the previous action.\n\n**Clarifying questions**: Ask about missing information or ambiguous phrasing. Example: \"Do you want results for Europe only?\"\n\n**Depth probes**: Offer to drill into a persona, scenario, or detail. Example: \"Should I expand on budget trade-offs or only summarize the budget overall?\"\n\n**Comparisons**: Suggest pros and cons, alternatives, or benchmarks. Example: \"Would you like to see side-by-side comparisons?\"\n\n**Action nudges**: Turn a generative result into an actionable step. Example: \"Send an email draft?\"\n\n**Share/Export options**: Extend the work into other formats. Example: \"Would you like me to generate a slide of this concept?\"",
      designConsiderations: "### Anchor follow ups in what just happened\n\nBase suggested next prompts on the system's last response or the user's prior action. Avoid generic next steps. For instance, Perplexity's follow ups reference specific facts from the answer to guide further exploration, which keeps continuity and trust intact.\n\n### Show why you're suggesting something\n\nMake it clear what connects the follow up to the previous exchange. Use subtle phrasing cues like \"You could also ask…\" or \"Related topics include…\" so users understand the logic behind the suggestion rather than seeing it as arbitrary automation.\n\n### Keep the list short and scannable\n\nOffer a small set of high-value follow ups, and prompt models to intelligently reserve this pattern when it's necessary to verify certain details before proceeding, or as a way of extending a conversation.\n\n### Balance depth and breadth\n\nMix one or two \"zoom in\" suggestions (to refine or elaborate) with one \"zoom out\" option (to pivot or generalize). This gives users directional control without overwhelming them.\n\n### Preserve the conversational rhythm\n\nVisually separate follow ups from the model's main output so users can distinguish new content from next step prompts. Treat them as light invitations, not part of the generated answer.\n\n### Let users select\n\nFor follow ups intended to probe deeper, allow users to regenerate the list of options to choose from to explore new aspects and uncover potential next-steps they aren't already considering.",
       relatedPatterns: ["sample-response", "memory", "action-plan"],
      examples: [],
    },
  },
  {
    id: "initial-cta",
    title: "Initial CTA",
    description: "Large, open-ended input inviting the user to start their first interaction with the AI.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c2fadd268b0617c6d3cd_omni_box_card.webp",
    categoryId: "wayfinders",
    sourceUrl: "https://www.shapeof.ai/patterns/cta",
    content: {
      description: "For many products, the first touchpoint with AI is through the Initial CTA: A prominent collection of inputs and actions that allow a user to start prompting. From here, the user works with the model through regenerations, variants, and other actions in order to reach their intended goal.\n\nThe most common implementation of this pattern is a large direct input box, where the system goal is to understand the user's context and intent as quickly as possible while minimizing the amount of work they have to do to express it. The implementation of this pattern varies depending on the context and capabilities of the surrounding application.\n\n### What is the likelihood that five words are enough to describe your creative vision?\n\nThe direct input has become the default starting point in AI products. It's approachable, lowers the barrier to entry, and shows off the product's flexibility and capabilities. However, it also surfaces the hardest part of prompt engineering: most people don't know how to phrase what they want, and a short prompt rarely captures the nuance of their intent.\n\nEven experienced users often need multiple iterations to get to a strong first draft. This can frustrate users. It also has a real cost: running those unstructured queries isn't free, and compute costs rise quickly when the system is forced to guess.\n\nThe more reliable path is to keep the input box at the center but surround it with supportive actions operating as scaffolding. Instead of relying on a single sentence, users can layer context, choose modes, or start from predefined actions. This shifts the work from prompt engineering toward selection and refinement, while still keeping intent capture in the text field.\n\n### Scaffolding examples\n\n**Suggestions**: Common prompts or quick actions surfaced near the input to help users get started.\n\n**Galleries**: Collections of example outputs that show range and possibility, giving users confidence and reducing blank slate anxiety.\n\n**Prompt enhancers**: Manual or background actions that take the user's initial prompt and reformat it into a version better suited to the AI.\n\n**Modes and selectors**: Options to switch between basic queries, deeper reasoning, or different models when the task demands it.\n\n**Attachments and connections**: Dropping in a PDF, link, or file to give the system richer context.\n\n**Templates**: Pre-built entry points that let users construct their input bit-by-bit or by using variables.\n\nThe input box still captures intent, but the surrounding scaffolding carries the weight. This approach makes the system more forgiving, reduces wasted compute, and dramatically increases the odds that the first output feels useful.\n\n### Action-First CTA\n\nFor products where AI is a feature but not the foundation, its functionality is introduced alongside foundational features. In these contexts, the open-ended functionality is presented as an easy way to complete a task. Supportive features are used for action-oriented CTAs as well, but focus specifically on completing the action using wizards, templates, and workflows.\n\n### Contextual CTA\n\nIn these cases, AI functionality is often introduced through a dialog or banner, but again, discoverable in context. Some products hold back the AI until there's something useful to act on. Instead of prompting cold, the system waits until data exists, like a transcript, a backlog, or a set of files, then surfaces AI as the natural next step. This approach avoids wasted queries, reduces compute load, and ensures the first output feels relevant.\n\n### Playful CTA\n\nFinally, some products lean on play as the best entry point. Instead of making users stress over phrasing the \"right\" prompt, they invite experimentation through humor, randomness, or creative surprise. This lowers pressure, shows range, and turns the first interaction into something memorable.\n\nPlayful scaffolding often comes through whimsical suggestions, randomized galleries, or one-click transformations. Udio, for example, seeds the input with absurd but delightful ideas like \"a motown-esque song about how much I hate work\" or \"indie-rock ballad about a cat in love with a bird\" FigJam uses quirky templates and remixable starters to spark creativity without requiring any writing. Other products lean on immediate examples or instant variants, so users can explore possibilities without worrying about precision.\n\nThe design lesson is that delight can be scaffolding too. By offering playful prompts, galleries, or remix tools, you reduce the risk of wasted compute on unworkable input and encourage users to explore without fear. This approach may not deliver precision, but it does elicit curiosity and confidence, important emotions to help users feel engaged.",
      designConsiderations: "**Make the first step forgiving**: The initial CTA should lower risk and anxiety. Scaffold short prompts with examples, galleries, and regenerations so users can succeed without having to know prompt engineering.\n\n**Spend compute wisely**: Structure the input so the system isn't forced to guess at vague intent. Encourage attachments, templates, or modes that provide richer context, ensuring compute power is spent refining rather than searching.\n\n**Show range before depth**: Use galleries and suggestions to demonstrate what's possible. This builds confidence and helps users discover value without needing to invent their own prompts from scratch.\n\n**Adapt to the product's role**: If AI is the core product, an input box with scaffolding makes sense. If AI is a feature, start with workflows or context and introduce AI at the moment of leverage.\n\n**Balance novelty and clarity**: Playful CTAs can spark delight, but they should not obscure the path to productive use. Treat fun as an on-ramp, not the only road.",
       relatedPatterns: ["example-gallery", "filters", "attachments", "templates", "suggestions"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c2fadd268b0617c6d3cd_omni_box_card.webp",
          description: "Suggestions: Common prompts or quick actions surfaced near the input to help users get started.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c2fadd268b0617c6d3cd_omni_box_card.webp",
          description: "Galleries: Collections of example outputs that show range and possibility, giving users confidence and reducing blank slate anxiety.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c2fadd268b0617c6d3cd_omni_box_card.webp",
          description: "Prompt enhancers: Manual or background actions that take the user's initial prompt and reformat it into a version better suited to the AI.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c2fadd268b0617c6d3cd_omni_box_card.webp",
          description: "Modes and selectors: Options to switch between basic queries, deeper reasoning, or different models when the task demands it.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c2fadd268b0617c6d3cd_omni_box_card.webp",
          description: "Attachments and connections: Dropping in a PDF, link, or file to give the system richer context.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c2fadd268b0617c6d3cd_omni_box_card.webp",
          description: "Templates: Pre-built entry points that let users construct their input bit-by-bit or by using variables.",
        },
      ],
    },
  },
  {
    id: "nudges",
    title: "Nudges",
    description: "Alert users to actions they can take to use AI, especially if they are just getting started.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c30b8fe9a7fece15ec66_nudges_card.webp",
    categoryId: "wayfinders",
    sourceUrl: "https://www.shapeof.ai/patterns/nudges",
    content: {
      description: "Nudges are contextual prompts or notifications that guide users toward AI features they might not have discovered. They're especially useful for onboarding new users or highlighting recently added capabilities.\n\n### Types of Nudges\n- Feature discovery tooltips\n- Contextual suggestions\n- Tutorial prompts\n- New feature announcements",
      designConsiderations: "### Timing and Frequency\n- Show at relevant moments, not randomly\n- Limit frequency to avoid annoyance\n- Allow users to dismiss or disable\n- Track which nudges have been seen\n\n### Visual Treatment\n- Use subtle but noticeable styling\n- Include clear dismiss option\n- Provide \"Learn more\" and \"Try it\" actions\n- Consider using animation to draw attention",
       relatedPatterns: ["suggestions", "modes", "inline-action"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68adec68f57031d5d987680c_68ab6a123c845e8640a3883c_65de364a84406eb72b374ced_CleanShot-2024-02-27-at-12.20.10-2x.png",
          description: "Sample nudges from GitHub Copilot, Adobe, Figma, and Grammarly showing inline completions, AI buttons, and lightweight banners.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68adec68f57031d5d9876807_68ab690b2c715a7bbb0d7101_65de35e145d72ed91222a07a_CleanShot-2024-02-27-at-07.38.35-2x.png",
          description: "Hypotenuse and Writer both include a long list of use cases in their app, some of which require integrations or advanced features.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68adec68f57031d5d9876816_68ab68cc9d68fd1441d8bc6f_65de360b481a2699dfb3eea9_CleanShot-2024-02-27-at-12.04.40-2x.png",
          description: "Grammarly makes it easy to perform basic tasks from your existing content, such as generating a reference.",
        },
      ],
    },
  },
  {
    id: "prompt-details",
    title: "Prompt Details",
    description: "Show users what is actually happening behind the scenes.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c31aacdd998d22024610_prompt_details_card.webp",
    categoryId: "wayfinders",
    sourceUrl: "https://www.shapeof.ai/patterns/prompt-details",
    content: {
      description: "Prompt details reveal the actual prompt sent to the AI, including any system instructions, context, or modifications made to the user's input. This transparency helps users understand how to craft better prompts and builds trust.\n\n### What to Show\n- Final prompt sent to model\n- System instructions or context added\n- Parameters and settings used\n- Any preprocessing or formatting",
      designConsiderations: "### Presentation\n- Make it easy to expand/collapse details\n- Use clear formatting to distinguish parts\n- Allow copying of the full prompt\n- Consider showing a diff of user input vs final prompt\n\n### Progressive Disclosure\nStart with summary, allow drilling into full details for advanced users.",
       relatedPatterns: ["example-gallery", "restructure", "describe"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8a42953537622239383c1_midjourney-prompt-visilibty.png",
          description: "Midjourney exposes the prompt details associated with each example in the gallery, including the prompt itself as well as parameters and custom styles.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8a544afc3383eccd58440_668494d2a8e7cb1b761bf7f7_CleanShot-2024-07-02-at-18.00.52-2x.png",
          description: "Suno shows the prompt used for each sample song in its gallery so users can understand how prompt tokens and parameters mix to create a new generation.",
        },
      ],
    },
  },
  {
    id: "randomize",
    title: "Randomize",
    description: "Kickstart the prompting experience with a low bar and fun results",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e653d4c7ee4abac06504e4_wayfinder_random_card.webp",
    categoryId: "wayfinders",
    sourceUrl: "https://www.shapeof.ai/patterns/randomize",
    content: {
      description: "A randomize feature generates unexpected prompts or results to help users explore possibilities without committing to a specific direction. It's particularly effective for creative applications where serendipity is valuable.\n\n### Use Cases\n- Spark creative inspiration\n- Lower barriers to getting started\n- Discover unexpected combinations\n- Make exploration playful and fun",
      designConsiderations: "### Implementation\n- Create a diverse pool of random options\n- Ensure quality of random outputs\n- Allow refining or re-rolling results\n- Consider themed random sets\n\n### Visual Design\n- Use playful iconography (dice, shuffle icons)\n- Add subtle animations on click\n- Show what was randomized\n- Make it easy to try again",
       relatedPatterns: ["prompt-details", "templates"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c8b9afc3383eccdeaf38_krea-random.png",
          description: "Krea extends the random feature to the style gallery, allowing users to randomly select from the presets.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c7faa331147fcf9a974a_random-scenario.png",
          description: "Scenario includes the dice icon \"randomizer\" in its prompt box for generating images.",
        },
      ],
    },
  },
  {
    id: "suggestions",
    title: "Suggestions",
    description: "Solves the blank canvas dilemma with clues for how to prompt.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c333ab62c9a68525be3c_suggestions_card.webp",
    categoryId: "wayfinders",
    sourceUrl: "https://www.shapeof.ai/patterns/suggestions",
    content: {
      description: "Suggestions provide contextual prompt ideas that help users overcome the blank canvas problem. Unlike random options, suggestions are tailored to the context, user history, or common use cases.\n\n### Types of Suggestions\n- Starter prompts for new users\n- Contextual suggestions based on current work\n- Follow-up suggestions after a generation\n- Category-specific templates",
      designConsiderations: "### Relevance\n- Personalize based on user behavior and history\n- Update based on current context\n- Show a diverse range of suggestions\n- Refresh periodically\n\n### Interaction\n- Make suggestions clickable to auto-fill\n- Allow editing before submission\n- Show preview of what the suggestion will do\n- Track which suggestions are most used",
       relatedPatterns: ["inline-action", "follow-up"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8326e283b8365c033ac0f_CleanShot-2024-02-28-at-12.47.28-2x.png",
          description: "Canva's AI-generated search suggestions map keywords based on the user's search query.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e853b88d323dc62d4c0aea_CleanShot-2025-09-05-at-08.40.41-2x.png",
          description: "Gemini search can read the information on the page and propose suggested questions the user might have without them having to dig.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e85445491c2df85cf5ff11_CleanShot-2025-10-09-at-16.09.30-2x.png",
          description: "Granola provides standard suggested recipes that reflect common questions someone might have while reviewing a transcribed meeting.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ace5a34626801554c463c0_668300879b08961718e5a4d1_CleanShot%25202024-07-01%2520at%252013.14.31%25402x.png",
          description: "LinkedIn suggestions draw from the context of the post they sit beneath, increasing the likelihood that they are relevant to the viewer.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e833486dd9bcbcbbf367fd_suggestions-miro.png",
          description: "Miro calls context from the content of the canvas when suggesting actions to the user.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8326879dc877403aeb996_CleanShot-2024-03-20-at-07.16.02-2x.png",
          description: "Typeform's AI suggestions are provided before the user has given any context about their intended form, so they are likely to be irrelevant to the user.",
        },
      ],
    },
  },
  {
    id: "templates",
    title: "Templates",
    description: "Structured templates that can be filled by the user or pre-filled by the AI.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8c346c3728899c96c0d22_templates_card.webp",
    categoryId: "wayfinders",
    sourceUrl: "https://www.shapeof.ai/patterns/templates",
    content: {
      description: "Templates provide structured prompt frameworks with fillable fields. They help users craft effective prompts by breaking down the task into specific components and ensuring all necessary information is included.\n\n### Template Components\n- Labeled input fields\n- Dropdown selections for common options\n- Optional vs required fields\n- Preview of final prompt\n- Option to customize template structure",
      designConsiderations: "### Template Library\n- Organize by use case or category\n- Allow users to save custom templates\n- Provide both simple and advanced templates\n- Show example outputs for each template\n\n### Flexibility\n- Let users modify templates\n- Allow switching between template and freeform\n- Support progressive complexity\n- Enable template sharing",
       relatedPatterns: ["madlibs", "example-gallery"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e89b5642cb7a1a762d70d4_coda-template.jpeg",
          description: "Coda supports simple templates to easily generate content without overthinking it.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e896226ce781a036a7eb13_62f79fcf071b67c312c67a4b_62ab3353dc11277708b39deb_jasper-repetitive-content-20.png",
          description: "Jasper uses a templated layout to help users build effective prompts step by step.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e89af0ce25cdeef08e2129_writer.png",
          description: "Writer makes a library of prompts available to new users in the form of templates. This reduces the burden of early users needing to learn to write effective prompts and focuses instead on letting them fill out critical pieces of information.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68adec60065170c1c3bf385f_65df92ff6958e4148dbb6217_CleanShot-2024-02-28-at-13.09.01-2x.png",
          description: "Zapier offers several sample templates to build on the front side of Zaps. Here, a user is prompted to give specific parameters that will feed into the image generator.",
        },
      ],
    },
  },

  // Prompt Actions
  {
    id: "auto-fill",
    title: "Auto-Fill",
    description: "Extend a prompt to multiple fields or inputs at once.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e91bb75290d4da0c19e51b_autofill_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/auto-fill",
    content: {
      description: "Auto-fill uses the user's direct or inferred intent to automatically run prompts and other actions across multiple fields or records at once. This action makes most sense where inputs are repetitive or predictable, such as within spreadsheets, when translating data into a form, or when drafting multiple content generations that share similarities like emails.\n\nAuto-fill has been present in software for years in a simple form. AI shifts the pattern to be more than just a repeater, expanding it to include looping through logic and complicated, ambiguous actions contained in a prompt.\n\n**Before:** A user of Google Sheets might insert a date in the first cell of a column and be prompted to auto-fill dates for the remaining cells in order or based off of some formula\n\n**Now:** A user might tell the system to capture the date of incorporation for every company in a database, and rely on the model to autonomously search for, identify, and return those dates into the table.\n\nWhile this action adds convenience to the user's experience, the harm of a mistake can be severe: lost work, wasted tokens, and annoyance. Consider showing sample responses for the first few records, verify with the user, and then apply the prompt to the rest.\n\n### Common forms of auto-fill\n\n**Inline ghost text:** offers predictions as users type, often based on the surrounding context.\n\n**Prompt replication:** extends a prompt across rows or sequences. This is commonly used in spreadsheets or may be constructed as a repeating step in a workflow.\n\n**Form completion:** Extracts information from text and populates it into structured fields or variables. Examples include filling out forms, passing text into workflow variables, pre-filling CRM and similar records, etc.\n\n**Cross-surface transfer:** Carries context from one modality or surface into another, for example using a meeting transcript to pre-fill an action-item tracker.",
      designConsiderations: "**Make predictions visible.**\n\nUsers should see what the system proposes before it takes effect. Sample responses or a test run allow users to verify the prompt's efficacy before proceeding.\n\n**Balance autonomy with convenience.**\n\nAllow users to create an auto-fill column themselves (Notion), or use default smart columns to make it even easier (Attio). For even more control, allow users to see the default prompt in automated columns so they can clone and modify it to meet their needs.\n\n**Prioritize human-created content.**\n\nDon't write over existing content without permission. Use variations, branching, or verification when modifying the prompt and re-running it across fields.\n\n**Distinguish auto-filled fields from manually written content.**\n\nUsers should be able to quickly identify content suggested by the model. Retain a visual distinction until the user accepts the generated content or overrides it.",
       relatedPatterns: ["verification", "chained-action", "sample-response"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b39155b5afd3daedbcf15f_inputs_auto_fill_attio.avif",
          description: "Attio comes pre-seeded with auto-fill columns that extract contextual data for every new record",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3919391c2184f7d3db5ad_inputs_auto_fill_clearfeed.avif",
          description: "Clearfeed uses contextual cues from the conversation to auto-fill fields",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b372475018e2a26bfd2981_65dde5b8e864ef5999342b11_Auto-fill-AI.gif",
          description: "Coda uses pattern recognition to auto-fill empty cells based on existing data",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b396e3bc323cdc81882c4d_inputs_auto_fill_linear.avif",
          description: "Linear reviews new issues and auto-fills the assigned owner for humans to review and accept. The AI also provides a justification explaining its decision to help users understand the logic and, presumably, adjust the training if needed.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b392e869993d8326dc4012_inputs_auto_fill_logicgate.avif",
          description: "LogicGate uses contextual information to auto-fill fields in forms for humans to review and verify. Once a human has confirmed the information is accurate, the AI symbol is removed.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b372e25018e2a26bfd6b81_inputs_auto_fill_relay.avif",
          description: "Relay allows users to generate content for fields based on a single prompt",
        },
      ],
    },
  },
  {
    id: "chained-action",
    title: "Chained Action",
    description: "Plan, execute, and review a multi-step prompt sequence.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ec422118ea4b8aa232a25f_workflows_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/chained-action",
    content: {
      description: "Chained actions connect multiple inputs in a single thread of work. This can support convergent workflows, aiming to reproduce similar outputs on demand, or divergent workflows, supporting creative exploration or comparison.\n\nIn this multi-step action, prompts, parameters, and tools live as nodes on an infinite board and connect through their edges, like a flow diagram. Users can map a run ahead of time, branch on any step, and see how each decision influences downstream results.\n\nThis maintains legibility and oversight. A chain that would vanish into a chat log becomes a visual map that supports side-by-side comparison, reuse, and deliberate forks.\n\nUse this when the task benefits from structured work with multiple inputs or outputs.\n\n### Forms and characteristics of chains\n\n**Linear chains:** Each prompt feeds into the next in a straight sequence. This is a good example to start with during onboarding, but fails to highlight the full power of the pattern.\n\n**Branching chains:** A single prompt leads to multiple diverging paths. This causes the generation to fork into variants and compare them side by side.\n\n**Convergent chains:** Multiple prompts are converged into a single output, such as blending a stylistic description derived from a style reference with a subject reference with the intent of retheming it.\n\n**Side-by-side exploration:** By creating parallel chains, different prompt paths can be compared against the same input for contrast.\n\n**Cross-modal chaining:** Prompts don't have to stay in the same medium. A text description can produce an image, which can then be re-prompted into a video or an audio narration.\n\n### Chained prompts in traditional workflows\n\nThe most common application of chained actions is in traditional workflows that integrate AI steps. In this context, chained actions can be configured to incorporate information from data sources or user inputs as variables into AI-powered steps.\n\nWorkflows can be constructed out of AI-enabled steps alone, but there is no requirement that they only occur in AI-native tools. Examples include Zapier, Gumloop, and other popular workflow tools.\n\n### Chained prompts in creative workflows\n\nSome AI-native workflow tools are designed to make generative iteration more manageable by allowing multiple variations across chained prompts to process simultaneously on the canvas.\n\nBranches can be used to create variants, inputs can be remixed with slight differences to evaluate similar prompts for quality, and users can move seamlessly between modalities without losing sight of the underlying prompt details. Examples include FloraFauna and Weavy.\n\n### Chained prompts in agentic workflows\n\nVisual workflows help manage the flow of information across complicated agentive jobs, serving as both a plan of action and an obervation dashboard when the agents are live. By visually tracking work in progress, users can follow the agent's logic and actions and intervene where necessary.\n\nAgentic workflows allow users to gate information and access controls to specific subflows and tune model selections and parameter temperatures to the task, providing maximum user control.",
      designConsiderations: "**Educate through micro copy.**\n\nWriting a single prompt effectively is itself a difficult task. Teaching users how to cascade prompts together is a much more advanced skill. Use copy and other affordances to guide users on how to inject references, variables, and other context to get an effective result.\n\n**Make onboarding actionable.**\n\nDon't simply teach the interface during onboarding. Provide users with enough space to construct a functioning, multi-step program so they can be coached on putting this pattern into practice.\n\n**Reward engagement with credits.**\n\nThe worst thing you can do to generate engagement is use up all of a user's first tranche of default credits during onboarding. Reward completion with a gift of extra credits so they have plenty of compute spend to explore the product before they need to commit to buy.\n\n**Make costs easy to understand.**\n\nCompute costs add up for complicated workflows. Follow the pattern of showing transparent spend and estimate the credit cost for individual steps and the workflow as a whole. Make parameter changes like model selection clear in terms of how they impact cost. Consider an audit function to identify compute-heavy actions.\n\n**Support lightweight tests.**\n\nFor flows that are expected to run multiple times, make sure users have a method to evaluate the flow for accuracy and effectiveness before turning it on. Ensure this is available at the step and workflow level.\n\n**Build with natural language.**\n\nSometimes someone has an idea of what they want to do but lack the skills in your product to build it. Allow users to describe their goal and generate a first draft of chained actions for them to modify.\n\n**Show errors of all types.**\n\nHelp users avoid low-context errors that result in hallucinations or poor results by showing affordances for prompts that need enhancement. Give options for fallback states or follow-up steps to assist in real time if the model needs additional tokens or context to operate effectively.",
       relatedPatterns: ["sample-response", "transform", "verification", "madlibs"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68c5a4fa3ea09a53473e4126_copyai.png",
          description: "Copy.ai chains multiple prompts together in one workflow to generate a draft email.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68c5a60e206ae92437d4cc78_lindy2.png",
          description: "Lindy shows the cost of each action within a workflow so users can anticipate how heavy of a compute task each step will be",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68eceb4565429c1d5bf007cc_weavy2.png",
          description: "Weavvy's node demonstrates the empty state of setting up different inputs of prompts and references chain together to produce an output",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ece9adb7124ab0033c00a6_gumloop.png",
          description: "Gumloop follows a common pattern of letting variables from previous steps pass through as context to the AI in later steps",
        },
      ],
    },
  },
  {
    id: "describe",
    title: "Describe",
    description: "Decomposes the course into its fundamental tokens and suggested prompt.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e9366c780015bc9b055b39_describe_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/describe",
    content: {
      description: "The best way to understand how to produce high-quality or consistent generations, or troubleshoot generations gone awry, is to look under the hood. Describe is a user-invoked action that breaks a generated result into the components that likely produced it, revealing the prompt or a best-guess reconstruction, parameters, and sometimes token or selection details.\n\nDescribe is typically triggered by a button or link action. In API-centric tools it shows inputs and logs for a single run. Evidence for this pattern is strongest in image products and developer consoles. Where products do not expose prompts or tokens per run, this action should not appear.\n\nAs of late 2025, only a few platforms make use of this as an interface pattern. Notably Midjourney's /describe function reveals the tokens and implied prompt behind an image. This can be applied to images that the generator produced, or human-created files. Using the variations pattern, Midjourney reveals four different interpretations of the image, and makes it easy for the user to reproduce each option to evaluate how closely it can reproduce the original tone, subject, and context.\n\nAfter using token layering and inpainting to generate this abstract image, I tried to reverse engineer it to see the tokens the generator relied on. A similar action is available from the web interface.\n\nAlternatively, when interacting directly with an AI, you can simply ask it to share the tokens it relied on. This is not a technique layman users will be familiar with however, so it's unreliable as a solution. Furthermore, unless you are using the direct input to communicate with the AI, there is no mechanism to ask for its intent. This leaves the user blind.\n\nThe describe action is closely related to prompt visibility. However, the former is a user-initiated action while the latter supports the visibility of the prompt, tokens, and parameters that went into a generation from shared examples and galleries.",
      designConsiderations: "**Prefer exact extraction over inference.**\n\nIf the artifact contains the original prompt or parameters, show those first. This reduces ambiguity and gives users a faithful starting point. Only infer when exact data is missing.\n\n**Choose a default detail level, then gate depth.**\n\nShip a compact view by default, with an expand for advanced details. This balances legibility for most users against the needs of power users who want logs or probabilities.\n\n**Limit inferred prompts to a small, distinct set.**\n\nReturn three to four materially different descriptions, not a long list of near-duplicates. This speeds comparison without overwhelming people.\n\n**Include only parameters that change reproduction in your product.**\n\nShow the fields that alter outcomes when re-running in your system, such as model or version, seed, guidance, size, or sampler. Omit decorative or non-functional metadata.\n\n**Make descriptions actionable.**\n\nGive users an easy path to transform one or all of the generated descriptions into new image prompts.",
       relatedPatterns: ["prompt-enhancer", "prompt-details"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db6cddee67ee35e7e4ff34_decompose_openai.webp",
          description: "ChatGPT can be prompted to generate a prompt to describe an uploaded image or file.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db6cd793d63e5ef72523cb_decompose_chatgpt.webp",
          description: "ChatGPT can break a description into individual tokens it reads from within a referenced piece of content.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db6ccb17a69bef9bccd86c_decompose_ideogram.webp",
          description: "Ideogram shows the Describe action on the right side pane when reviewing an image.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db6ccb17a69bef9bccd865_decompose_leonardo.webp",
          description: "Leonardo nests the describe action in a drawer contained in the main CTA.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db6cd793d63e5ef72523d7_decompose_midjourney2.webp",
          description: "Midjourney triggers the describe actions when right-clicking on an image.",
        },
      ],
    },
  },
  {
    id: "expand",
    title: "Expand",
    description: "Lengthen the underlying content or add depth and details.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e990d8ab35aa53e32fa037_expand_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/expand",
    content: {
      description: "The Expand action lets AI build on an existing piece of content while still respecting its original form or intent. Use cases where this action is appropriate include extending the boundaries or ratio of an image, constructing a larger generation from a clip, or building upon a concept.\n\nPeople don't always have an end goal in mind when in generative mode. Expanding takes a starting point and then builds upon it, often in multiple directions. Throughout this, the initial seed is kept intact, allowing creative exploration while maintaining connection with the original.\n\n### General flow\n\nExpand starts with a starting point, which might include a previous generation, a rough draft, audio or video snippets, or a placeholder prompt. Users should be able to lengthen the original content while remaining true to the original form, or modify the new content through revised prompts, references, and parameters.\n\nThis supports an iterative process, and limits how much compute power is used on early concepts or verifying details. Users might use smaller or less refined generations as drafts and work towards a larger construction through multiple expand actions, paired with inpainting and other more convergent actions to fine-tune details as the work grows.\n\n### Variations and forms\n\nExpansion takes different shapes depending on the medium:\n\n**Images:** Extending boundaries to meet new aspect ratios, or widening the focal lens and filling the artboard.\n\n**Video:** Starting from a short clip, additional frames are added to lengthen the video, often guided by an artboard or script.\n\n**Audio:** An audio sample may be extended based on the central prompt, or structured sections may be added like intros, outros, or choruses without altering the existing track.\n\n**Text:** From a rough outline or first draft, the text is modified to go deeper into a topic, lengthen the original reference, or move from draft to higher-fidelity form.\n\n**Code:** From an existing code snippet or comment, code is written to expand upon a function or extend the functionality.\n\n**Prompts:** Essentially the prompt enhancer pattern where a short input is refined into a longer, more structured instruction.\n\n**Conversation:** From the flow of conversation, AI is directed to go deeper into a topic, consider different perspectives, or expand to include new references.\n\nAt its core, expand turns fragments into wholes. It is a copilot pattern that keeps users in control while exploring what comes next.",
      designConsiderations: "**Anchor the expansion to what matters.**\n\nKeep the original draft or image intact and make clear which parts are being elaborated. This prevents the \"good parts\" from being overwritten and reassures users that expansion won't undo progress.\n\n**Let users define scope.**\n\nExpansion should not always apply to the entire output. Give people the option to expand a paragraph, a selected image region, or a clip segment. Targeted scope keeps control with the user and avoids ballooning irrelevant content.\n\n**Show how much more is coming.**\n\nIndicate the length, size, or duration of the planned expansion before it runs. Users should know whether \"expand\" means two more sentences or doubling the word count, so they can decide if the trade-off is worth the cost.\n\n**Make added content visible.**\n\nIf all changes are not visible from one view, highlight or annotate what has been expanded so people can scan differences quickly.\n\n**Expose costs early.**\n\nExpansion often increases token use, render time, or GPU cost. Show these trade-offs up front so users can weigh richness against efficiency.",
       relatedPatterns: ["variations", "draft-mode", "open-input"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b63e8a4e369b1c3e0e398c_expand_canva.webp",
          description: "Canva's \"Magic Expand\" feature expands an image to the size of the artboard (or a custom size, if the user chooses)",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b63f0f732fb871d8443dbf_expand_udio.webp",
          description: "Udio allows the user to select where to add the expansion of the track within the existing structure",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Wordtune's expand sentence feature",
        },
      ],
    },
  },
  {
    id: "inline-action",
    title: "Inline Action",
    description: "Ask or interact with AI contextually based on something already available on the page.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e91bdc12015b9b7167b06f_inline_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/inline-action",
    content: {
      description: "Sometimes a user only wants to adjust or respond to a small part of a larger piece of content or canvas without regenerating the entire response. Inline actions provide a direct way to target specific content, whether by replying, editing, or inserting new material, without breaking the flow of interaction. This gives people more precise control and positions AI as a copilot rather than a system that must always be directed wholesale.\n\n### Common actions\n\nWhat distinguishes inline actions from similar patterns like inpainting is their opinionated nature. These are preset actions, hard coded or recommended contextually as follow ups, that cover a variety of prompt types:\n\n**Suggested prompts** that open a conversational thread or new line of discussion\n\n**Restructuring actions** to rewrite, reframe, or otherwise adjust the underlying structure of the content\n\n**Restyling actions** that change the tone or aesthetic quality of the content\n\n**Transformational actions** that change the modality of the content (e.g. highlighting text for the AI to read out loud)\n\nIn essence, these act as shortcuts: a pointer to constrain the AI's focus and an associated prompt to make action easy.\n\n### Multi-modality\n\nInline actions are not limited to text. In multimodal systems, targeted prompts can be applied to images, audio, or even live conversations. For example, during the GPT-4o launch demo, a presenter redirected the model mid-interaction by instructing it over video to forget an earlier statement and focus on the current question.\n\nThis last example illustrates the real strength of inline actions: when users can fully direct the AI's attention, they shift from training the system to using it as a tool to accomplish specific goals.",
      designConsiderations: "**Offer concise, high-value defaults.**\n\nInclude a few dependable one-click actions like shorten, expand, summarize, or translate that can be applied instantly. These reinforce the product's core utility and make it feel responsive. Broader commands belong in side panels or full editors where users can customize them.\n\n**Rely on context to make actions relevant.**\n\nConsider the history of the interaction thus far and the overall context of the content on the page when prioritizing actions to show instead of providing a large, generic list of choices.\n\n**Enable granular selection and scoping.**\n\nLet users decide the level of detail—word, sentence, section, or block—before invoking the AI. This prevents over-generation and preserves authorship. Fine-grained control is especially important for longform or multimodal content where replacements can cascade.\n\n**Preview before commit.**\n\nAlways show the AI's result inline as a suggestion layer, not an overwrite. Require verification to accept, reject, or refine. This creates a continuous sense of authorship and accountability.\n\n**Surface reasoning when stakes are high.**\n\nFor edits that alter factual claims, citations, or data, include a quick \"see how this was changed\" view. This supports trust and makes AI rewriting traceable within context rather than hidden behind logs.",
       relatedPatterns: ["transform", "footprints", "verification"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3c9befa59e289e3ae8649_inputs_inline_action_jira.avif",
          description: "This example from Atlassian intelligence shows a distinct benefit of inline actions: they allow users to see a preview of the AI's output targeted to specific part of the canvas without updating the canvas as a whole",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3c8e2b3bbfef5ad33dab4_inputs_inline_action_figmamake.avif",
          description: "Figma Make allows users to select a specific area on the canvas, where inline actions appear to take input with that specific focus.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3c91e9b501c0754370c37_inputs_inline_action_github.avif",
          description: "Github Copilot allows multiple inline actions like /explain to allow the AI to focus where the user wants them",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3ca4c433a171687426c76_isaac.webp",
          description: "Isaac shows the example of a large panel of inline actions appearing when text is highlighted",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3c91e9b501c0754370c3b_inputs_inline_action_lovable.avif",
          description: "Lovable follows a familiar pattern of showing inline actions when individual items are selected on the canvas",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3ca13fa59e289e3aebd7e_inputs_inline_action_sourcetable.avif",
          description: "Inline actions are not limited to writing. Here in Sourcetable the user can take action on a single cell's content easily from the spreadsheet itself instead of relying on chat",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3c4d229f10dea33ceb413_inputs_inline_action_wordo.avif",
          description: "Wordo shows another example of inline actions appearing when text is selected",
        },
      ],
    },
  },
  {
    id: "inpainting",
    title: "Inpainting",
    description: "Target specific areas of the AI's result to regenerate or remix.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ecf945e87c1ea19ee6dd9c_inpainting_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/inpainting",
    content: {
      description: "Inpainting gives users the ability to let AI adjust parts of a piece of content without regenerating or impacting the whole. This makes collaboration with AI more predictable and controllable, reduces rework, and speeds iteration.\n\nThis pattern applies across all types of content, and can be used for interacting with existing content or remixing AI-generated content during a session.\n\nFor example,\n\n**When writing an essay:** I may ask AI to adjust the tone of a paragraph that I feel I am not getting quite right to see how it would reflect back my overall tone to me.\n\n**When AI generates text:** I can direct it to make changes in situ to the conversation itself.\n\n**When generating creative assets** like visuals or audio, I can isolate a part of the interface and have the AI apply new tokens only to that area.\n\nAdobe Firefly and Notion are two examples of tools that use inpainting effectively. The action is clearly identifiable from the interface with suggested prompts and nudges to help the user iterate on their generation\n\nThe discoverability and usability of this pattern depends on part on the existing paradigms of the underlying medium.\n\nImage editors already come with an eraser brush to make spot edits, and associating the erased area with options to prompt for what should replace it may feel familiar.\n\nText editors don't have a similar paradigm of erasing content in situ to a highlight, so inline actions are used as an affordance to take action on the highlighted text.\n\nIn any case, you can maintain user agency over their experience by allowing them to verify generations before overwriting the original, making undo easy, and giving people the option to replace the original or add the new generation into the text inline.",
      designConsiderations: "**Make it easy to find and view the area to be edited.**\n\nGive users precision tools to select the precise area they wish to adjust. This might include a brush size slider in image tools, or a time-based selector in audio tools that goes down to the tenth of a second. Provide both quick, rough tools (brush, auto-select) and precision options (lasso, feathering) so users can choose the right level of control.\n\n**Anchor edits in surrounding context.**\n\nBlend seamlessly with adjacent areas, but give users the option to widen or narrow the context window so they can prioritize realism or control.\n\n**Allow users to adjust the prompt.**\n\nGive users full control to change the core prompt, parameters, model, references, and so on to get their intended result out of the action.\n\n**Provide variations.**\n\nWhile subsequent prompts benefit from the surrounding context and generative history, the model still might not get it perfectly right. Providing variants speeds up the iterative process by letting users choose the option closest to their intent and move forward from there.\n\n**Verify to commit.**\n\nFor inpainting that occurs inline, such as a change to text or code, ensure the user verifies the change before overwriting their work.",
       relatedPatterns: ["watermark", "inline-action", "verification"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b49e4bc7df9527ecde3d7a_tuners_inpainting_adobe.avif",
          description: "Adobe Firefly uses familiar image editing tools to allow prompts to be adjusted on a specific part of the canvas",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b49ef92684d65d97cc7172_tuners_inpainting_jira.jpeg",
          description: "Text in Jira tickets can be edited directly from the canvas. Users are asked to verify the AI's work before it's accepted",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b49f9f879d5e7bff72e921_tuners_inpainting_elevenlabs.avif",
          description: "ElevenLabs breaks their constructed songs into standard sections like verse, pre-chorus, chorus, etc. Users can edit the overall style of the song or make surgical changes to lyrics and tokens within each section",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b49ef1e1e68d30813ddeb8_tuners_inpainting_grammarly.avif",
          description: "Grammarly shows inline actions when text is selected in the canvas",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b49f34144ceded19d7b5ad_tuners_inpainting_lovable.avif",
          description: "Lovable allows users to point at specific items on the canvas instead of relying on the chat bar to make changes. Updates to the targeted divs don't impact the rest of the site",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b49e7ab229ca22caf2e780_tuners_inpainting_midjourney.avif",
          description: "Midjourney set the convention for image editors to follow by allowing inpainting directly on the canvas",
        },
      ],
    },
  },
  {
    id: "madlibs",
    title: "Madlibs",
    description: "Repeatedly run generative tasks without compromising on the format or accuracy.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e91bef82d5b7f1a7e954a7_madlibs_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/madlibs",
    content: {
      description: "Madlibs make prompt-writing easier by breaking a task into structured input fields. Instead of composing a full instruction from scratch, users fill in variables such as names, product details, or tone. This reduces errors and keeps outputs consistent across a team.\n\nFor example, an AI might draft an email using a template where the recipient's name and context are supplied directly, avoiding mistakes like misaddressed messages.\n\nThis pattern works best when the task is known, the inputs are predictable, and the process repeats often. Creating a product requirements document, drafting release notes, or writing standard outreach emails all fit this mold. The underlying structure is fixed, but specific values shift each time.\n\nBy shaping the input up front, madlibs shift the work from correcting outputs to guiding inputs. This makes runs more reliable, and gives teams a shared library of prompts that match their brand and workflows.\n\n### Setting them up\n\nMadlibs are formatted as a collection of inputs and variables. Users specify their prompt but leave some inputs open-ended that the user will fill out. For example, a PRD template may include a link to a collection of insights by customers about a specific product area. They can be as simple as including a single reference link, or they can use multiple sources built via integration.\n\n### Putting them to work\n\nMadlibs are commonly seen in workflows. The user may enter a trigger (or it may be automated), and the rest of the workflow fires off seamlessly. Examples could include syncing notes from a meeting captured in Gong into Salesforce notes.\n\nWorkflows are set up to run off of information integrated from other sources as well as AI-generated information\n\nThese are used in templates to unblock users getting started with content generation. Writer.com and Copy.ai are good examples of how this can be used to build a prompt library within your company. Details like tone of voice, audience, and so on only need to be captured once and put into the prompt template.",
      designConsiderations: "**Let the context determine the flexibility.**\n\nA Madlib can feel like a form that forces exact inputs or like a suggestive scaffold. Rigid inputs drive consistency, but they can frustrate when the task requires nuance. Flexible fields invite creativity, but risk sloppy outputs. Pick the balance based on whether the pattern is used for repeatable workflows or for creative drafting.\n\n**Clarify which inputs are critical and which are optional.**\n\nIf everything looks equal, users may waste time filling in unnecessary fields. Make critical variables prominent and give clear signals about what can be skipped. This keeps the experience fast and reduces cognitive load.\n\n**Show the underlying prompt structure.**\n\nHiding the \"bones\" of the template makes madlibs feel magical but opaque. Exposing the structure helps users learn and adjust. Consider whether your audience values transparency (teams building prompt libraries) or simplicity (casual users who just want results).\n\n**Plan for multi-step reuse.**\n\nA single madlib can carry information forward into later outputs (brief → outline → draft). Designers should think about what gets locked at each step versus what can be revised or carried forward.\n\n**Treat Madlibs as a teaching tool.**\n\nThey aren't just time-savers. Well-structured Madlibs show novices how to phrase strong prompts and give experts reusable scaffolds. Decide how much you want the madlib to \"train\" the user versus simply produce outputs.",
       relatedPatterns: ["chained-action", "templates"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3d27cf9219208c2b7cc0c_inputs_madlibs_coda.avif",
          description: "Coda shows an experimental approach to madlibs that relies on sliders instead of specific inputs in the variables of a madlibs input",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3d021f82248b824d69243_inputs_madlibs_copy_ai.avif",
          description: "Copy.ai uses variables in their templates to make it easy for anyone to build an effective prompt using the madlibs method.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3d0919a4bd338f5f8bdbf_inputs_madlibs_concept.avif",
          description: "Google put together this concept of a simple prompt builder using madlibs to let users easily select from a clear set of defaults, or construct their own inputs",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3d01f54904f411b4f39a8_inputs_madlibs_jasper.avif",
          description: "Jasper runs madlibs in the background, using the input of the first prompt as a variable later in the workflow",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3d2bcbc323cdc8195460a_relay.png",
          description: "Relay uses madlibs in their agent instruction steps, filling in variables with other context from the workflow",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3d05164ca6366bfda45c8_inputs_madlibs_writer.avif",
          description: "Writer shows another example of making it easy for any user to benefit from a strong prompt without knowing how to construct it by focusing only on the variables using madlibs",
        },
      ],
    },
  },
  {
    id: "open-input",
    title: "Open Input",
    description: "Open ended prompt inputs that can be used in AI conversations and other natural language prompting",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e91c0634999bad82eb61cd_direct_input_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/open-input",
    content: {
      description: "Open input has become the cornerstone of interactive AI design, fostering a dialogue between users and AI systems. This pattern is characterized by its simple interface that feels familiar, inviting the user to converse with the model underneath.\n\nBy using natural language, it doesn't take long for someone to get comfortable with the general interactivity. Where the pattern's limitations show is after the first few interactions, when someone doesn't know what to say next.\n\n### Variations and forms\n\nThis action is versatile and appears in multiple contexts across AI experiences. Some parameters and other selectors may not be appropriate in all contexts so ensure you design each case thoughtfully.\n\n**Chat box:** A persistent input at the bottom of a conversation. Best for back-and-forth tasks, discovery, and follow-ups.\n\n**Inline composer:** A prompt that operates on a selection or cursor position inside an editor, such as when text is highlighted. Good for precise edits like Generative Fill and inpainting.\n\n**Command-style prompt with parameters:** Single line prompt plus structured flags or controls, common in image models like Midjourney. Good for experts who want precision.\n\n**Side panel composer:** A prompt in a panel that can pull in files, tools, and settings, used for longer tasks and multi-source grounding. Common in Workspace side panels and IDEs.\n\n### Supporting features\n\nThere's a false perception that simple means easy. When someone knows what they are looking for then this way of interacting with the model makes sense. This could apply to use cases like a search portal, or customer support.\n\nHowever, when someone reaches an open chat bar and doesn't know what they are looking for (content generation sites, ChatGPT, etc), it can lead them to feel crippled by the choices (the blank canvas effect).\n\nOn top of that, prompting skills are not widespread. Most users will not understand how to craft a prompt to get the result they have in their head.\n\nHelp users get the most out of open inputs to the AI through wayfinders that get them started and tuners that help them easily build their prompt.\n\n**Templates** can help users craft better prompts without having the full skill set\n\n**Nudges** to improve your prompt can show users what \"better\" looks like\n\nPutting **filters and parameters** at the users' fingertips can make this more complicated feature feel accessible",
      designConsiderations: "**Set a clear default scope, and make scope switching a single-step action.**\n\nFor open inputs after the initial prompt, make the target of the action clear. This prevents accidental whole-document edits and allows users to precisely communicate their intent.\n\n**Handle limits and gaps with constructive guidance.**\n\nLike inline errors in more analog experiences, avoid generic errors or silent fail states. For example, if the input is too long or underspecified, say what is missing and offer a fix.\n\n**Support novice prompters.**\n\nDo not rely on users to be expert prompt or context engineers. Provide wayfinding tools to help users get started, like example galleries, and continue to support the flow of work with automated suggestions, follow ups to maintain an understanding of the user's intent, and templates for more complicated inputs.\n\n**Retain user control at all stages.**\n\nContinue to offer parameters, model selection, modes, and other precision controls when open inputs continue in the flow of work or conversation. Do not limit these powerful features to the initial prompt alone.",
       relatedPatterns: ["controls", "inline-action", "parameters"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3a27b8de865a19415bc7c_inputs_open_input_julius.avif",
          description: "Open text is the most common input type, made popular initially by ChatGPT. Almost immediately, companies started adding complications to the open text approach, adding parameters, modes, and contextual attachments, shown here in Julius.ai",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3a5540db07d545ae1fd6c_inputs_open_input_lovable.avif",
          description: "Lovable explicitly allows users to flip between build and chat mode, so a single open text input serves to direct the AI and communicate with it.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b3a4eccc8051e6b5fbc8ed_inputs_open_input_personal.avif",
          description: "Open text inputs are used outside of conversations, such as for generating prompts to train the AI itself, seen here in Personal AI",
        },
      ],
    },
  },
  {
    id: "regenerate",
    title: "Regenerate",
    description: "Have the AI reproduce its response to the prompt without additional input",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e91c786a04865d268318d2_regenerate_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/regenerate",
    content: {
      description: "When AI doesn't meet your needs with its initial generation, you can instruct it to regenerate the output while keeping the same prompt and context. Common labels for this action include \"Regenerate,\" \"Rerun,\" or \"Try again.\"\n\nBy default, the system reruns your request through the model's internal process, which is designed to allow variation. That's why a new draft may use different words, reasoning, or details even though you didn't change anything.\n\nSome tools offer a \"seed\" setting that locks in part of this process. Using the same seed makes the model more likely to produce consistent results across regenerations. Changing or omitting the seed lets the system explore other possibilities, which can be useful for brainstorming or creative work, but can frustrate users expecting consistent results.\n\nUnlike more intentional controls such as \"Edit prompt\" or \"Refine,\" regeneration is a blunt tool. It sacrifices precision for speed. Its design must be carefully balanced against adjacent patterns like branching, inline edits, or parameter controls, so that it remains helpful rather than overwhelming or destructive.\n\n### Regenerative modes\n\nProduct designers must decide how to support the relationship between the original generation and additional versions:\n\n**Overwrite:** The new output replaces the old one. This is common in chat tools where only the latest answer remains visible in-line. If inline-variants are supported, users can cycle through past variations.\n\n**Branching:** Each retry creates a separate version. This mode is common in video and text editors, and recently has had some adoption in conversational tools like ChatGPT. This mode supports comparison and exploration but can quickly fill up a workspace if not well organized.\n\nDesigners also must determine how much control users will have over the form of regenerations as they iterate:\n\n**Guided:** Instead of blindly rerunning, the user can adjust a parameter or style first. Tools like Jasper's \"Rephrase\" or Notion AI's \"Try again with…\" fall here. It gives users more precision without needing a full new prompt.\n\n**Random seed:** Users may also be allowed to regenerate without specifying changes to the prompt. This is common when the thing being regenerated is incidental, like a list of suggestions. However, this lack of control can lead to frustration and a lack of agency.\n\nFinally, systems may be prompted to regenerate automatically after an error or timeout. This is common in coding tools, where the assistant silently retries a completion that fails. It reduces friction but must be transparent so users know what happened.",
      designConsiderations: "**Set clear expectations for what will change.**\n\nUsers should know whether regeneration will overwrite the old output or create a new branch. Hiding this choice can cause confusion or accidental data loss.\n\n**Make past results easy to recover.**\n\nIf regeneration writes over the existing content when accepted, make it easy to cycle through previous iterations and retrieve, view, and copy them. This preserves exploration while keeping the interface uncluttered.\n\n**Balance speed with control.**\n\nA one-click regenerate should be fast, but allow users to first adjust the prompt, attachments, or parameters when extra control is needed.\n\n**Use seeds to control randomness.**\n\nMake it clear that regenerations may differ even with the same prompt. If consistency is important, support the use of seeds through direct input or UI controls to maintain predictable outcomes.\n\n**Be opinionated over iterative support.**\n\nFor creative or exploratory work, users are more likely to value multiple regenerations to that allow them to iterate through different options. In more convergent work, quick regenerations can help users reach their intended need quickly and efficiently. Know which makes the most sense for your use case and support it in all touchpoints.",
       relatedPatterns: ["draft-mode", "variations", "randomize"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c2269495e8efc1959e81_regenerate_chatgpt.webp",
          description: "ChatGPT provides more than just a simple regenerate option for its Deep Research summaries. Users can also force constraints, change the model, or adjust the length.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c536bc3d67c175049895_regenerate_chatgpt_error.webp",
          description: "Regeneration is not limited to positive-state events. Here, ChatGPT offers the option to regenerate as a way of working through an error state caused by the server.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c2706fd88fa29584bd63_regenerate_elevenlabs.webp",
          description: "ElevenLabs makes it easy to regenerate audio. Each attempt is stored as its own record in the history.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c52ac030647c505badf2_regenerate_flora.webp",
          description: "Canvas-based tools like FloraFauna will re-run an entire chain of actions or workflows to regenerate a creation (here, via the Play button). Users also have the choice of adding additional branches off the main trunk to create variations.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c414c030647c505b3933_regenerate_krea.webp",
          description: "Regenerate is one of the highlighted options that Krea provides under its compositions.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c40c839b5e977586e4f8_regenerate_krea2.webp",
          description: "Krea offers the option to regenerate with a similar seed (\"vary\") which carries the original image forward as a token source for additional iterations on this single style.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c46ac030647c505b5094_copilot-coaching.webp",
          description: "Microsoft Copilot offers guided recommendations in coaching mode when reviewing existing content and tuning regenerations.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c52ac030647c505badeb_copilot-draft.webp",
          description: "Microsoft Copilot can accept directed instructions to the model to guide regenerations.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c148b8da071cdcd18a5a_regenerate_notionredo.webp",
          description: "When generating a draft or revision of writing, Notion gives users the option to accept or regenerate the content.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b5e9e0046dd8000f90806b_color_notion.webp",
          description: "When regenerating, Notion offers a blanket of choices that can vary the tone, length, and style of the original.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c1e208cac3f324805ce2_regenerate_perplexity_now.webp",
          description: "Perplexity shows the option to regenerate search results and their associated summary.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c1e56fd88fa2958499e6_regenerate_sana.webp",
          description: "When creating content in the canvas, Sana offers the choice to regenerate the content. This overwrites the entire content of the canvas.",
        },
      ],
    },
  },
  {
    id: "restructure",
    title: "Restructure",
    description: "Use existing content as the starting point for prompting.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e91c933a156f995f26f814_restructure_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/restructure",
    content: {
      description: "Restructuring actions are a broad category that change the structural form of an existing piece of content. This is closely related to Restyling actions that change the surface qualities of content (tone, mood, palette, or voice) while leaving its structure intact, and to Transforming actions which go further, shifting the modality altogether like converting a text summary into a slideshow. Retructuring sits in the middle: more structural than Restyle, but bounded within the same medium unlike Transform.\n\nExamples include:\n\n**Condensing:** Make the content shorter while keeping the main points intact. Notion AI's Summarize and Descript's Remove filler words both let you shrink text or transcripts into something tighter and easier to scan.\n\n**Expanding:** Add more detail or context to make something fuller. Jasper can turn a short outline into a full blog post, and Notion AI's Expand command fleshes out bullet points into paragraphs.\n\n**Reordering:** Change the sequence of ideas or clips without changing their content. Adobe Premiere Pro's Text-Based Editing lets you reorder video clips by rearranging lines in the transcript, and Copilot Labs can reorganize code functions for clarity.\n\n**Perspective shifting:** Rewrite for a different audience or point of view. Jasper can convert marketing copy for executives into a customer-facing version, and ChatGPT-style tools can change first-person narration into third-person.\n\n**Extraction:** Pull out specific elements from a larger body of content. Coda AI and Notion AI both extract action items from meeting notes, while Descript can isolate speaker quotes from transcripts.\n\n**Aggregation:** Combine multiple sources into a coherent structure. Perplexity AI aggregates results into outlines with references, and tools like Runway let you merge multiple video clips into a highlight reel.\n\n**Segmentation:** Break a large piece into smaller, structured units. Descript and Riverside both cut long recordings into short clips, and GitHub Copilot can split large functions into smaller ones for maintainability.\n\n**Substitution:** Swap elements without rewriting the whole thing. Midjourney's Vary Region swaps part of an image while keeping the rest, and Copilot lets you replace a code snippet with an alternate implementation.\n\nExample from Descript showing the number of use cases for restructuring that they support\n\nThe value of restructuring lies in iteration. Instead of forcing users to re-prompt from scratch, it allows them to build new versions on top of existing drafts. This reduces prompt engineering demands, surfaces more creative possibilities, and helps users treat AI as a collaborator rather than a generator of single shots. Done well, restructuring flows give people precise levers for reworking content without overwhelming them with raw parameters.",
      designConsiderations: "**Use presets to make actions clear.**\n\nInline actions and related nudges can help expose different options for changing the structure of content and make them easier to apply. Actions like \"make shorter\" or \"remove filler words\" are clear and actionable and don't require long, instructional prompts to enact.\n\n**Support nuance with sliders.**\n\nInstead of single-shot actions, allow users to select from preset actions to restructure their content, like setting the reading level to align to instead of simply offering the opaque action \"make more technical.\"\n\n**Make what changed legible.**\n\nShow diffs, highlights, or callouts so users can see exactly what was added, removed, or reordered. This helps them trust the system and learn how different restructure actions behave.\n\n**Allow user review and selective action.**\n\nSince changing the structure of content can impact its clarity or continuity, ensure users retain control by verifying changes, selecting from different versions, or at least having an option to undo.\n\n**Maintain stylistic tokens.**\n\nChanging the style or tone of content and the structure itself require separate actions. When changing structure, maintain the overall style and form of the underlying content.",
       relatedPatterns: ["inpainting", "variations"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9f9e7283902db9568be93_remix_flora.webp",
          description: "FloraFauna shows the paths of connection to remix multiple prompts and inputs on the same canvas",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9f9d1e91d4de579d1a5f5_regenerate_jasper2.webp",
          description: "Jasper includes common restructuring tools to adjust the length of selected content.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9fa28aaf7c13b2af50ce6_remix_jasper.webp",
          description: "Jasper supports restructuring directly on the canvas in blend mode, where new attachments and instructions can be added before regeneration at any time.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9c52ac030647c505badeb_copilot-draft.webp",
          description: "Microsoft Copilot allows users to restructure content on regeneration with new instructions and prompts for the model to pull from.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9f94a48d846dc08a5d5b8_remix_midjourney.webp",
          description: "Midjourney makes restructuring a core part of its user experience, from adjusting tokens to blending images. Its omni references tool lets users focus generations on specific subjects, and change the subjects or intensity of focus on subsequent actions.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9f904cb780581f4e3f3cf_remix_notion.webp",
          description: "Notion AI includes several inline actions to restructure the selected content or the content on the page",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d9f904cb780581f4e3f3cc_remix_udio.webp",
          description: "Udio supports restructuring as a core action when working with a pre-composed song. From the canvas, users can use sliders to adjust the intensity of different parameters or the tokens for the regenerated creation",
        },
      ],
    },
  },
  {
    id: "restyle",
    title: "Restyle",
    description: "Transfer styles without changing the underlying structure of a generation.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e91dbd3433a63c2a83bc0f_restyle_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/restyle",
    content: {
      description: "Just as people shift their tone depending on context, AI can alter the surface style of its outputs without changing their underlying content. Restyling makes a piece of writing, an image, or a song look or sound different while leaving its structure and meaning intact.\n\nRestyling is convergent. While the surface level of the content changes, the substance stays the same. A blog post can be rewritten in a playful brand voice, a photo can adopt a watercolor effect, or a song can be filtered into a jazz arrangement. The function is not to create something new but to regenerate the same thing in a different skin.\n\nThe actual changes in style can be explicit or inferred. Users may pick a style directly via codes, palettes, tokens, or guides, or they may let the system infer intent through inline prompts like \"Make it more formal\" or by attaching a reference sample. The pattern works across modalities:\n\n**Writing:** switch tone, voice, or register while keeping claims intact.\n\n**Images:** apply a brand palette or emulate a reference look.\n\n**Audio:** clean noise, change vocal style, or apply a genre.\n\n**Code and UI:** align with linting rules or system tokens.\n\nExample of changing the style on a single image to tell a brand story, by Dixonbaxi.com\n\nRestyling sits alongside two adjacent patterns: Restructure alters structure while staying in the same medium, such as condensing or expanding text. Transform changes modality while keeping structure intact, such as turning a written outline into a slideshow. Together, they form a spectrum of control over form and presentation.",
      designConsiderations: "**Separate style from structure.**\n\nRestyle should not change claims, sequence, or layout of the underlying content. Clearly separate actions that change the presentation of content from actions that change its substance.\n\n**Use preset actions for quick access.**\n\nRestyle actions built into the interface like \"Make more casual\" let users play around with stylistic choices without needing to have a specific goal or reference in mind.\n\n**Offer intensity, not just on or off.**\n\nPeople need gradations. Provide tiers or a slider, for example \"slight, medium, strong,\" for tone or visual effects. This reduces back-and-forth regenerations and helps teams hold a consistent look while still exploring.\n\n**Support easy defaults or advanced customization.**\n\nDemonstrate the power of your restyling capabilities with sample galleries anyone can choose from. For more advanced users, allow the cloning or creation of custom styles, easily accessible from personal galleries.\n\n**Incentivize social remixing.**\n\nLet users see what style tokens were used for featured content in galleries or direct links. Seed tokens and profiles give users reason to share their creations and bring others inspired by their work into the product experience.",
       relatedPatterns: ["memory", "preset-styles", "transform", "restructure"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b446c6be0c511439a875f0_inputs_remix-blend_blend_florafauna.avif",
          description: "FloraFauna.ai allows users to explicitly state which parts of the reference photo they want to use to adjust the style of the original. Users can create as many variations as they want by adding new cards to the canvas",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b445e6280615307ae8d262_inputs_remix-blend_midjourney.avif",
          description: "Midjourney's Retexture capabilities make it easy to adjust the style of an image using style references",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b44af0bbe4ca6887eaf26d_inputs_remix-blend_blend_notion.avif",
          description: "Notion allows you to adjust the tone of your writing. Small changes are introduced but the general structure of the writing remains the same",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b47df6ae4fa1ac9412ce7b_inputs_remix-blend_restyle_udio.avif",
          description: "Udio allows you to adapt the style of a song as a style token to apply to other creations",
        },
      ],
    },
  },
  {
    id: "summary",
    title: "Summary",
    description: "Have AI distill a topic or resource down to its essence.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e91eec3f5cf52ba387b454_summary_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/summary",
    content: {
      description: "The summary action condenses and organizes information to make it easier to understand, recall, and act on. This action may span one or many sources, but it remains faithful to the original material with an emphasis on isolating key points or relevant information.\n\nWhen data is presented as a summary, users should have confidence that the model is accurately capturing and compressing the source material, and not interpreting it or injecting opinion. This makes the resulting summary more reliable. The synthesis action can be helpful, but users need to be able to confidently distinguish between automated summaries of human-created content, and machine-generated interpolations.\n\nTo ensure users can trust that the summary is an objective reflection of the source material, combine summaries with governors that help users retain agency in the experience.\n\n**Citations** help users understand which sources map to which parts of the summary\n\n**References** guide users to the source material where they can review and verify the cited information\n\n**Follow ups** recommend additional ways to interact with the source material, such as providing and alternative view or researching terms and ideas.",
      designConsiderations: "**Prioritize fidelity over brevity.**\n\nThe goal of a summary is not compression at all costs, but clarity without distortion. Shorter must still mean true. Ensure summarization captures all key claims and context so the user can trust that nothing essential has been lost.\n\n**Expose scope and source.**\n\nEnsure the viewer can identify what is being summarized (a document, chat thread, page section, or selection). Make the boundary explicit so users know what's included and what's not. Cite or link to the original material so details can be verified.\n\n**Provide automatic summarization with caution.**\n\nAutomatic summaries can speed scanning for long or routine material like email threads, meeting notes, or chat histories, but they're risky for dynamic or opinionated content such as news articles, search results, or social feeds. In those settings, auto-summaries may distort tone or prematurely frame interpretation. Always make it clear whether a summary is AI-generated, and give users the option to expand, refine, or disable it entirely to encourage critical discovery.\n\n**Match granularity to context.**\n\nA chat recap, a research digest, and a paragraph summary each demand different levels of compression. Offer presets like \"short,\" \"detailed,\" or \"key points.\" Users should be able to adjust summary depth rather than accept a single fixed form.\n\n**Make attribution automatic.**\n\nWhen summarizing sourced material, attach citations as inline references or backlinks. Citation links reinforce credibility, allowing users to verify critical information and guarding against hallucination.\n\n**Preserve the original language when precision matters.**\n\nIn legal, scientific, or contractual contexts, verbatim phrasing can be essential. Provide a \"quote and condense\" mode that lists key passages with light framing instead of rewriting.\n\n**Audit and test for omission bias.**\n\nPeriodically compare machine summaries against expert-written ones to detect consistent blind spots—such as omitting counterpoints or minority perspectives. Adjust weighting or training data accordingly.",
       relatedPatterns: ["references", "citations", "synthesis"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b484f0433a171687758e54_inputs_summary_apple.avif",
          description: "Apple's attempt to summarize conversations can lead to surprising results",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4806b16ca1c2dad104e8f_bloomberg_bloomberg_ai_suggestions_small.avif",
          description: "Bloomberg shows how AI Summaries can be integrated into products that otherwise are not oriented towards AI as a core feature. Consider deep linking from summaries into the article to encourage deeper engagement and thoughtful reading",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b483abb880fd41e6993a74_inputs_summary_notion.avif",
          description: "Notion uses summary in two different ways: inline, to remix text into a summarization, and applied to the full page, to generate a summary of all content",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b485292b30fefee7b04c4b_inputs_summary_perplexity.avif",
          description: "Perplexity's success largely stemmed from their re-invention of the search paradigm, focusing on summarizing results instead of providing a ranked list",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b48309b880fd41e698e963_inputs_summary_slackai.avif",
          description: "Slack has added the ability to summarize a thread of content. Adding deep linking to individual posts via citations would make it even easier to follow up on what needs action vs. what is noise",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4837a9b0f6bbef42e50dc_inputs_summary_zoom.avif",
          description: "Zoom uses the summary pattern in live meetings to let users quickly catch up on context they may have missed",
        },
      ],
    },
  },
  {
    id: "synthesis",
    title: "Synthesis",
    description: "Distill or reorganize complicated information into simple structure.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e920da515cea7a4a309935_synthesize_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/synthesis",
    content: {
      description: "The synthesize action combines data from multiple sources and restructures or reorganizes it to extract patterns, insights, or themes. This sets synthesis apart from summarization, which compresses the original information without introducing any new interpretation.\n\nBecause of its more opinionated nature, AI completing a synthesis can distort evidence or overstate confidence. The UX challenge is to make the act of reasoning visible and reviewable. Users should see what was combined, how it was weighed, and where the AI is speculating.\n\n### Variations\n\nAll synthesis actions are distinctly sensitive because they introduce reasoning, injecting a layer of synthetic interpretation onto the source material. Depending on the context, supporting features and information become critical to maintaining user agency and oversight:\n\n**Aggregated Synthesis** gathers findings from multiple sources to rephrase and report without added interpretation. Examples include search result interfaces like Perplexity, Google, or Notion AI. This use case is closest to the summary action, varied only by inferred prioritization or narrative structure generated by the AI. Provide citations and a list of references for users to verify.\n\n**Comparitive Synthesis** aligns, contrasts, or reconcile multiple viewpoints or data sets, seen in document review in tools like ChatGPT or legal platforms. Allow for visual diffs to support the AI's claims and allow the user to verify.\n\n**Thematic synthesis** extracts underlying patterns or categories from a set of information, like customer feedback or research notes. To ensure the user can facilitate this process and analyze the results for bias, combine this action with a conversational interface or other surface where the AI can share its logic. Always allow user overrides in grouping and labeling.\n\n**Generative synthesis** allows the model to build new interpretations or implications from references and communicate them objectively, such as \"Key findings\" presented after a deep research run in Perplexity or ChatGPT. This form of synthesis is highly susceptible to hallucinations and erroneous conclusions. Ensure users have access to the model's stream of thought, including reasoning steps, reference analysis, and conclusive findings.",
      designConsiderations: "**Keep reasoning visible.**\n\nTreat synthesis as a transparent process, not a polished result. Show how the system grouped sources, what evidence it used, and which logic connects them. Visibility turns AI reasoning from a black box into a tool users can inspect and trust.\n\n**Separate evidence from interpretation.**\n\nPresent factual statements and inferred insights differently. Use distinct sections or visual cues to signal when the AI is quoting, summarizing, or speculating. Users should always know which ideas come from the data and which from the model's reasoning.\n\n**Expose uncertainty.**\n\nSynthesis should acknowledge when confidence is low or evidence is incomplete. Visual confidence indicators work on cards and in dahshboards, where in written form cues like \"limited support\" or \"conflicting data\" are effective.\n\n**Verify key decisions.**\n\nAllow users to check the model's conclusions and verify them for accuracy before adopting synthesized findings or structure. This might take the form of verifying labels on data clusters or synthesized data columns, or reviewing key themes in user research and support tickets before adding additional data.",
       relatedPatterns: ["stream-of-thought", "citations", "summary"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b488d83b1d06de8b3ebfb0_inputs_synthesis_granola.avif",
          description: "Granola helps users make sense of dense transcripts by easily synthesizing actions",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4872c2684d65d97c548bf_miro.gif",
          description: "Miro AI demonstrates how synthesis can be applied to unstructured data, like stickies on a canvas",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b489062919b5d0096acb6e_inputs_synthesis_plot.avif",
          description: "Plot synthesizes information across social channels and returns the video clips that are most relevant to the customer",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4876db229ca22caea7b64_inputs_synthesis_shopify.avif",
          description: "Shopify uses generative UI to create graphs that synthesize data in real time for easy consumption",
        },
      ],
    },
  },
  {
    id: "change-form",
    title: "Transform",
    description: "Use AI to change the modality of content.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e9210fff950ae996814161_transform_card.webp",
    categoryId: "prompt-actions",
    sourceUrl: "https://www.shapeof.ai/patterns/change-form",
    content: {
      description: "Converting content from one modality to another while preserving intent, constraints, and fidelity is a keystone feature of generative AI. Examples include audio to text, text to audio, text to image, image to text (OCR or captioning), text to video, document to slides, code to diagram, and screenshot to HTML.\n\nDifferent modalities are useful for different purposes. Text is the best tool for working through outlines and narrative. Seeing tokens translated into image can reveal tone and mood, while transforming text or data into diagrams allows users to review it easily. In this way, the transform pattern serves as a creative pipeline between the user and the AI.\n\n### Where to find the action\n\nRight-click menus or inline actions (Midjourney)\n\nChained together on an open canvas (FloraFauna)\n\nDirect generation via open input (Krea)\n\nBackground helpers, such as transcription (Descript)\n\nBuilt into the core interface (Chronicle)",
      designConsiderations: "**Maintain a connection to the original.**\n\nShow outlines, prompts, and blended sources and make them accessible for additional iteration, even if the form of the generation has changed.\n\n**Add stop points between modalities.**\n\nAs transformational actions tend to be more expensive to fulfill, put action plans, sample responses, and verifications in front of the user before committing to a broader generative run.\n\n**Start small and work up.**\n\nShow drafts of the transformed generation before committing to a full run, like generating an outline or snippet first.",
       relatedPatterns: ["branches", "draft-mode"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b5b0edfabda1e101fdc0a5_transform_figma_make.avif",
          description: "Figma Make transforms visual designs into code",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b5af412158bbdb9b0e3d03_transform_florafauna_transform-2.avif",
          description: "FloraFauna's canvas cards support transformation between text, image, and video modalities",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b5b0aa2158bbdb9b0f0f1e_transform_granola_transforma.avif",
          description: "Granola is one of many audio-to-text transcription tools, supported by AI features of synthesis and summarization",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b5b0729c2f978ee46b3cf5_transform_juliustransform.avif",
          description: "Julius can transform data tables into charts so users can visualize and interact with the data within the tool instead of moving it elsewhere",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b5ae8b35aca9c2972970b9_transform_krea_transform.avif",
          description: "Text to media is a fundamental transformational mode of generators. Here, Krea transforms from text to video",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b5af09983c2cd944e7ad69_transform_midjourney.avif",
          description: "Midjourney supports image to text transformation, using an image to generate a prompt that can be used for further generation",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b5afbc7384eeb5fdc895aa_transform_midjourney_transform.avif",
          description: "Midjourney supports image to video transformation as an easy-to-reach inline action",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b5afbc7384eeb5fdc895a3_transform_perplexity_transform.avif",
          description: "Perplexity allows users to generate images of different styles from a search result",
        },
      ],
    },
  },

  // Settings
  {
    id: "attachments",
    title: "Attachments",
    description: "Give the AI a specific reference to anchor its response.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e9837cf2b132f71e96b5e7_attachment_card.webp",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/attachments",
    content: {
      description: "Attachments allow users to shape a model's logic by providing specific information for it to reference when building its response to the prompt. This grounds the AI's response in a denser and more reliable context, reducing ambiguity, counteracting hallucinations, and helping users feel more in control of the generation.\n\nUsers can add attachments when shaping their initial prompt, as part of a follow up, or applied in a canvas or other shared space. These impact the model's behavior in subtle ways like shifting token weights, or in explicit ways like limiting answers to a provided PDF.\n\n### Attachment methods\n\nWhile a paperclip icon has become ubiquitous in most direct input fields, uploading a file is far from the only way of sharing contextual sources with the AI:\n\n**Direct upload**: Added via file upload, connection (e.g. Google Docs or Notion page), or by @-mentioning a file, tab, agent, or conversation directly into the open text input box. Use when it's unclear which reference to pull from behind the scenes and where user-initiated intent is necessary such as for the initial prompt.\n\n**Inline action**: Commonly implemented as text selection, where inline actions appear relative to the highlighted area. Media content (image, video, audio) often includes overlays or menu options that start a new generation with the media file as an attached source. In conversational experiences, an action to quote the text may appear when text is highlighted. When selected, the action injects the copied quote into the text box.\n\n**URL embed**: Added by pasting a link into the input box. The AI fetches the page and treats it as context while forming its generation. Be clear whether the AI will reference only the linked page or all connected pages.\n\n**Canvas block**: Use the pointer action to select a single div, node, drawing, etc. on an open canvas surface. Depending on the context, the AI may prioritize this content for its next generation, or limit its regeneration and subsequent actions to the constraint of the selected area.\n\n**Live capture**: Supplied by recording or snapping media in the moment, such as taking a screenshot, photo, or audio clip or allowing an agent to interact with your browser. In many modes this will result in the selection being attached as a direct upload. In agentic mode, the attachment guides the AI's logic to form its next step, and may not require human interaction.\n\n### Using attachments as a style guide\n\nAttachments can provide the model with tokens that help convey the user's intent without requiring or relying on the user to detail them in full. This helps the model infer the user's intended content, structure, tone, style, etc., saving the user time while making it more likely the initial generation suits their intent.\n\nTo maximize user control and oversight, explore how you might let users understand what tokens the attachment is likely to contribute to the prompt, such as by providing a describe action for attachments.\n\nAttachments can be used to guide the generation of something, like examples attached to a prompt to direct Claude, writing samples to generate a brand voice, or image samples to maintain tone across a set of generations.\n\n### Using attachments as the primary source or subject\n\nAttachments can be used to focus the AI on its contents, such as when summarizing an idea or report, conveying a script or outline, or to constrain search to a specific area of a subject. The AI may be directed to focus only on the attachment, or to combine it with other sources it finds on its own. All sources should be listed as references to the final generation.\n\nVisually separate attachments used for guides vs. primary sources. In this case, provide citations to the areas of the attachment the AI leveraged in its generation. If the model retreives additional sources, distinguish those added directly by the user.\n\nAttachments can be used as the central object of a prompt, like asking GitHub Copilot to explain some piece of code, having Adobe PDF explain what is happening in a document, or having Perplexity expand on the ideas contained in a white paper.",
      designConsiderations: "### Allow attachments at any time\n\nLet users include files when first composing a prompt or during later regenerations so they can refine results without losing work.\n\n### Use multiple input methods\n\nNot every attachment needs to be a file. Enable uploads, @ mentions, clipboard paste, drag-and-drop, and canvas references to reduce friction across devices and workflows.\n\n### Let users give attachments a purpose\n\nMake clear whether a reference will guide style, serve as the subject under analysis, or act as a hybrid. Midjourney's attachment pane offers a good example, where users can specify whether it should direct the prompt, style, or subject.\n\n### Provide citations when referencing files\n\nQuote, annotate, or link back to attachment content so users can trace the AI's outputs directly to their sources, as Granola does with transcripts.\n\n### Protect organizational data\n\nEncrypt attachments in transit and at rest, separate them from training data pipelines by default, and allow enterprises to enforce stricter controls.",
       relatedPatterns: ["connectors", "citations", "describe"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bc8b294a2dc81a9e73f376_attachments_claude_attached_quote.webp",
          description: "When text is pasted into Claude, it adds the copied text as an attachment instead of filling up the input",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bc8d7c34ae3a60ca15f3fc_attachments_figmamake.webp",
          description: "Figma Make can import a Figma Design file as an attachment and use it as a direct reference for generations",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bc8dadfe4f592932b0d847_attachments_loveable.webp",
          description: "Lovable accepts images as attached references",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bc8deb9cd79d2d09e88d5f_attachments_midjourneyattach.webp",
          description: "Midjourney accepts attachments with multiple purposes, from style guides to composition, and even to identify a specific subject",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bc8d3f5e051b3680099e74_attachments_miro.webp",
          description: "Miro can interact with files or other context on the canvas as it generates new objects to interact with.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bc8b6467f3b690b1b94695_attachments_perplexity_active.webp",
          description: "As demonstrated by Perplexity, some products interact with the document within the surface of the interaction as a way of showing progress and making it clear how it is using the attached source",
        },
      ],
    },
  },
  {
    id: "connectors",
    title: "Connectors",
    description: "Allow AI to reference external data and context.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e983e10d03dc12cdcccedc_connectors_card.webp",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/connectors",
    content: {
      description: "Connectors establish links between an AI and external systems of record, authorizing the product or agent to read and act on data from tools like Drive, Slack, Jira, calendars, CRMs, and internal wikis.\n\nIn chat and other open text surfaces, connectors let people ask natural questions and get grounded answers from their own files, messages, and records. Connectors also power background actions like joining meetings, filing tickets, or drafting emails from context.\n\nA well-designed connector makes its scope explicit: what sources are linked, what permissions apply, and whether the AI is retrieving content or making changes. A poor connector hides this, producing answers without showing which system they came from, or allowing actions without confirmation.\n\nAcross products, the pattern shows up in three places:\n\n**Account-level syncs** that index sources for grounded answers in chat, like Google Drive in ChatGPT or Slack data in Slack AI.\n\n**App-side panels** that pull context from your suite, like Gemini in Gmail, Docs, and Calendar.\n\n**Enterprise connectors** configured by admins, such as Microsoft Graph connectors or Atlassian Rovo, that unify search and AI across sanctioned tools.\n\n### Prompt injection risks\n\nConnecting AI to real data means it will read content that may include hidden instructions. Malicious instructions in calendar invites, emails, docs, tickets, and wiki pages can all try to steer the model. If those instructions trigger tools through a connector, the AI can exfiltrate data or make unintended changes. Be intentional with your design to secure your experience:\n\n**Treat connected content as untrusted**: Parse and summarize first, then gate any tool use behind explicit user intent. Show when the model is about to act on instructions found in retrieved content, and require confirmation with a human-readable preview.\n\n**Give users simple controls to neutralize risk**: Let them exclude specific sources or fields, turn off tool access for a connector, and switch a thread to \"read-only\" mode. Provide a per-message \"Using: Drive, Jira, Slack\" chip so they can pause a source mid-flow.\n\n**Design visible guardrails**: Strip or escape prompt-like strings from retrieved content, disable function calls from quoted text, and cap what metadata can be echoed back. Log which sources influenced a proposed action, so people and admins can audit what happened.\n\n**Plan for failure modes**: Flag suspected injection, return a safe summary instead of executing, and offer next steps like \"open the source\" or \"ask a narrower question.\" Keep a kill switch to revoke a connector instantly when something looks off.\n\nThe familiarity and ease of use that AI relies upon can cause users to let down their guard. Be mindful that designing a secure experience is necessary to gaining continuous access to the user's context over time.",
      designConsiderations: "### Aim the connector\n\nServices like Notion and Google Drive include many layers of data, not all of which a user might want to have accessible to the AI. Allow source pickers and scoping toggles so users can specify where the AI should look, like specific workspaces.\n\n### Give connectors a clear visual identity\n\nRepresent each integration consistently—icon, color, or short label—so users form quick associations between connectors and data types. Treat connectors as visible participants in the workspace, not invisible pipelines.\n\n### Design graceful degradation\n\nWhen a connector fails, rate-limits, or partially loads, communicate it directly in-flow (\"Drive not reachable,\" \"Notion token expired\"). Offer next actions like \"Retry,\" \"Reconnect,\" or \"Attach manually.\" Avoid blank states that imply success.\n\n### Expose freshness and state\n\nIn settings or elsewhere, display when data was last synced or fetched. If results are cached, label them as such and offer a refresh control. Freshness cues build confidence that the AI is using up-to-date information.\n\n### Use deep links in citations\n\nLink AI references directly to source records in the user's own systems so they can verify facts, explore context, and navigate their organization's knowledge graph.",
       relatedPatterns: ["filters", "references", "citations"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db1050ef4e5a882f5d6c20_connectors_chatgpt.webp",
          description: "ChatGPT places connectors prominently in the footer of the open text box, demonstrating their importance to the user experience from the company's perspective.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db1bcbbbcfd2ef20a15d58_connectors_chatgpt_dev.webp",
          description: "ChatGPT suppresses connections that could violate user security behind an advanced setting.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db197b385559d60a965aa2_connectors_claude_connectors_panel.webp",
          description: "Claude offers connectors that attach into external services as well as on-device services for desktop use.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db1cc1fde965989cbf6b32_connectors_cofounder.webp",
          description: "Cofounder introduces connections inline to the input box when they are relevant based on the user's prompt.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db1c1864dffc4c484edb77_connectors_intercom2.webp",
          description: "Intercom Fin includes conversation histories as an option for connections.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db1d1a405a93b3d24b6552_connectors_perplexty.webp",
          description: "Perplexity includes its list of connectors in its filter menu, changing the sources the model should pull from.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68db1c75ced480a7d77160e2_connectors_poke.webp",
          description: "Poke's connectors allow the agent to combine context from the user's data to create a personalized experience.",
        },
      ],
    },
  },
  {
    id: "filters",
    title: "Filters",
    description: "Constrain the inputs or the outputs of the AI by source, type, modality, etc.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e983f8624b080028524418_filter_card.webp",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/filters",
    content: {
      description: "Filters give users the ability to control which sources, tokens, or inputs an AI system should prioritize or avoid. They act as governors on the generation process, shaping the boundaries of what the AI considers before it produces an output. Without filters, AI may surface irrelevant sources, generate unwanted styles, or waste compute on directions that don't align with user intent.\n\nFilters apply in two primary contexts:\n\n**Source filters**: Limit where the AI can draw context from. In search or retrieval systems, this might mean restricting queries to academic sources, documentation, or a particular database. In conversation, it can mean pointing the AI only to recent chats or specific files.\n\n**Token filters**: Negative prompting tells the AI to down-weight specific tokens that influence the composition, subject, or styles of the generation. This is most common in image and video tools, where the model might be told \"no blur\" or \"or text.\" In writing tools, filters can block certain words or phrases from being used, such as brand-inappropriate terms, jargon, or unwanted topics.\n\nLeakage is possible, and filters do not avoid hallucinations. Combine filters with proactive tuners such as attachments and editable references for the AI to rely on.\n\n### Source filtering\n\nIn open-ended contexts, filters help users guide AI to relevant sources. For example:\n\n**Perplexity**: Lets users filter results to scholarly sources or exclude Reddit threads.\n\n**Notion**: Supports the ability to limit AI queries by team or workspace.\n\n**ChatGPT with browsing**: Can be instructed to \"search only official documentation\" or \"ignore blog posts.\"\n\n**Enterprise copilots**: Allow users to confine retrieval to specific knowledge bases, like internal wikis or Jira tickets.\n\n### Token-level filtering\n\nWhen generating content across modalities, filters are used to prevent unwanted outcomes. For example:\n\n**Stable Diffusion / Midjourney**: Support negative prompts like \"no blur, no watermark, no text\" to suppress undesired tokens and traits.\n\n**LLM generation**: Some tools let you block certain words or phrases from ever appearing in the AI's output. For example, a company might stop the model from using profanity or language that doesn't fit their brand.\n\n**Code copilots**: Can filter out insecure functions or deprecated libraries.",
      designConsiderations: "### Make filters explicit\n\nLet users see when a filter is active and how it shapes the results. For token-based filters especially, give users a method to understand relative token weights to adjust negative prompts effectively.\n\n### Support natural language\n\nLet users express filters in natural terms (\"ignore blog posts\") instead of forcing them into rigid menus. Natural phrasing increases adoption and accuracy.\n\n### Design for recovery\n\nIf a filter yields no results, show an empty state with options to relax constraints, not a silent failure.\n\n### Set defaults but adjust each time\n\nFrom an ease-of-use perspective, remember the user's preferences, but have smart mechanisms to ensure users don't unintentionally filter out valuable information. Most open inputs reset to a default state with each new conversation. If filters are impairing results, like reducing context to the point of low-confidence, consider a nudge to remind users that there may be other results in excluded sources.",
       relatedPatterns: ["attachments", "describe", "references", "modes"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd87f9bc605953bbd03208_filters_ideogram.webp",
          description: "Ideogram allows users to set a negative prompt from the open input box",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd8884eba65e9420ef49c0_filters_midjourney.webp",
          description: "Midjourney allows users to down-weight tokens from the input box directly using the --no parameter",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd87b9aae6af2d675f751e_filters_perplexityinput.webp",
          description: "Perplexity's initial CTA includes a dropdown for users to filter the sources for their search to specific categories",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd88349869f24c13373fef_filters_stablediffusion.webp",
          description: "Stable Diffusion has supported negative prompting from the start",
        },
      ],
    },
  },
  {
    id: "model-management",
    title: "Model management",
    description: "Let users specify what model to use for their prompts.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e9840f9d0a014a76716a8b_model_management_card.webp",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/model-management",
    content: {
      description: "There are many reasons why a user may want to switch the model they are using for generation. Different models come with different capabilities and tradeoffs. Giving users the ability to change their model on the fly, or at least know which one the AI is using at any given time, has become a standardized pattern across AI products.\n\n### Why users might switch models\n\n**Accuracy and reliability**: Some models are more prone to hallucinations or errors depending on their training data and foundational prompts.\n\n**Recency of knowledge**: Newer models often contain more recent references and larger training sets, which can lead to more relevant outputs.\n\n**Cost considerations**: Advanced models typically carry higher token or subscription costs. Users may prototype prompts on cheaper models before scaling them on premium ones.\n\n**Aesthetic differences**: In image generation, different models carry distinct styles. Users may choose a specific model for its \"look,\" much like preferring vinyl for its character even if digital audio is technically higher fidelity.\n\n**Remixing across models**: Some tools allow users to generate in one model for its style and then refine or re-render in another for structure or predictability.\n\n**Security concerns**: Users may avoid certain models when handling sensitive or proprietary data depending on how the provider manages training, storage, and compliance.\n\n**Research and comparison**: Engineers, analysts, and researchers often run the same task across multiple models to benchmark performance.\n\nModel management is no longer optional. As models proliferate and differentiate, users expect the ability to select, compare, and control which system is powering their results.\n\n### Model tiers\n\nModel choice is often structured into tiers, each with its own tradeoffs:\n\n**Free models**: Typically smaller, cheaper, and more limited. Useful for casual exploration, onboarding, or testing prompts before scaling.\n\n**Pro models**: Larger, more up-to-date, and more capable. These are often gated behind subscriptions or pay-per-use pricing.\n\n**Enterprise models**: Scoped for compliance, security, and governance. Organizations may lock users into enterprise models to enforce retention, privacy, or regional restrictions.\n\n**Domain-specialized models**: Built or fine-tuned for specific tasks like coding, medical, legal, creative domains. These provide focused strengths but may sacrifice general-purpose ability.\n\nThe tier system creates a predictable progression for users, but it also shapes how they perceive value. A free or lighter model may be \"good enough,\" saving money and compute, while a more powerful option can unlock higher quality if the product makes that difference visible.",
      designConsiderations: "### Make the active model visible at the point of generation\n\nUsers should always know which model is powering their output, especially when multiple options are available. Hiding this detail saves space but risks confusion when results vary in quality, tone, or speed.\n\n### Explain model differences in human terms\n\n\"GPT-4o, Claude Sonnet, Llama-3\" means little to most users. Translate distinctions into accuracy, recency of knowledge, creativity, cost, or latency.\n\n### Support seamless model switching without loss of context\n\nRestarting a conversation or re-uploading files just to change models is a major usability hit. Let users change models in between prompts wherever possible to ramp up (or drop down) compute where needed.\n\n### Provide routing as a default, but keep manual override\n\nMany users prefer the system to choose the \"best\" model for their task. But power users and enterprises demand control. Offering both reduces friction while avoiding lock-in to opaque model behavior.\n\n### Encourage cost-aware prototyping\n\nLet users run drafts on cheaper, lighter models before escalating to premium ones. This lowers experimentation costs but requires surfacing where fidelity may drop. Be explicit about what corners are cut on lower-tier runs.\n\n### Expose usage and cost impacts before selection\n\nToken limits, latency differences, and billing tiers should appear when choosing a model, not after. Hiding costs makes onboarding smoother, but it also undermines trust when unexpected bills or truncations occur.\n\n### Align permissions with context and audience\n\nIn enterprise, admins may need to restrict which models can be used to meet compliance. In consumer tools, explore defaults that protect against runaway costs while still letting curious users try new options.\n\n### Consider aesthetic and brand alignment\n\nIn creative domains, models have \"styles\" as much as capabilities. Presenting them only as technical tiers misses the emotional and brand implications of choosing one over another.",
       relatedPatterns: ["cost-estimates", "filters", "parameters"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4bc373e9c24345f8f955f_tuners_model_selector_adobe.avif",
          description: "Adobe helps users select their model with descriptions about what each model specializes in",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4b85a3be39756a8d0f239_tuners_model_selector_chatgpt.avif",
          description: "ChatGPT relies on an auto-router to select the model it thinks is best for the task, but users can override it. The details it provides are not super helpful to the user though",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4b72d3be39756a8d08165_claude.png",
          description: "Claude provides some information for each model in its selector to help users select which one they need for their task",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4b8cdd926e06b898566fd_tuners_model_selector_gemini.avif",
          description: "Gemini provides some information about the differences between models in their selector, particularly setting models for math and coding apart",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4b8947e7535b1e0bf2796_tuners_model_selector_perplexity.avif",
          description: "Perplexity relies on an auto-router but otherwise does not provide information to the user for which to pick. This leaves users solely responsible to figure out how to pick from this long list of options",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4bb1afbd0f57252152c8b_tuners_model_selector_vercel.avif",
          description: "Vercel allows you to switch between model weights in the flow of work so you can save compute power for more challenging tasks or getting unstuck",
        },
      ],
    },
  },
  {
    id: "modes",
    title: "Modes",
    description: "Adjust the underlying training, constraints, and persona to a specific context of use.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e9842dd0614e6ac131d551_modes_card.webp",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/modes",
    content: {
      description: "AI can operate in different modes to give users quick access to change the model and training configurations based on their intent. Each mode represents a distinct way the AI behaves, the type of results it produces, or the features that are available.\n\nBy selecting a mode, users can align the system with their current task, whether that's deep research, learning, or general conversation. Modes can be set at the start of an interaction or toggled as needed.\n\n### Types of modes\n\nAs AI tools expand in scope, modes have become essential for managing complexity. A single model may be capable of casual conversation, academic research, code generation, and structured workflows, but each requires different balances of reasoning, context, and output style. Modes make those differences explicit and actionable.\n\nCommon examples include:\n\n**Open conversation**: The default mode of most AI tools, optimized for flexible back-and-forth.\n\n**Deep research**: Runs longer, more compute-intensive queries to surface synthesized insights with citations rather than shallow answers.\n\n**Study or tutor mode**: Provides instructive, step-by-step explanations optimized for learning, often scaffolding reasoning.\n\n**Copilot**: Opens a canvas or IDE where the user and AI collaborate on an asset.\n\n**Build vs. chat**: Within copilot experiences, tools like Bolt let users toggle between chat for open discussion and build mode for structured creation.\n\n**Creative modes**: Offer stylistic variance (for example, \"concise vs. elaborate\" or \"factual vs. imaginative\") as selectable states.\n\n**Agentive or operator mode**: Lets the AI take control of tasks or interfaces, operating from a shared canvas or orchestration layer.\n\n**Specialized domains**: Many products expose domain-specific modes, such as \"legal brief,\" \"math solver,\" or \"design critique,\" each tuned for a narrow set of workflows.\n\nThe iconography of modes demonstrates the variety of implementations and metaphors used, even across similar products\n\n### Effects of changing modes\n\nModes are more than cosmetic. They influence:\n\n**Model behavior**: Context length, reasoning depth, or system prompts may be altered per mode.\n\n**Output type**: A research mode may return structured evidence, while a casual chat mode offers plain summaries.\n\n**Feature set**: Attachments, plugins, or integrations may be enabled or hidden depending on mode.\n\n**Cost and performance**: Some modes consume more tokens, GPU cycles, or latency, raising tradeoffs for users and providers.\n\n**User expectations**: Switching modes sets a promise. If the AI is in research mode, people expect rigor and traceability. If it's in creative mode, they expect variation and freedom.\n\nUltimately, modes let users decide how much power, risk, or creativity they want to unleash at a given moment. Designing them well means balancing flexibility with clarity, making sure users always know what state they're in, and what they can expect the AI to deliver.",
      designConsiderations: "### Treat a mode as a contract, not a theme\n\nA mode changes how the system interprets input and what the same action does, so the promise must be explicit and stable. If behavior drifts outside that promise, users experience classic mode errors and lose trust.\n\n### Design explicit entry and exit paths\n\nMake switching intentional and make exiting obvious. Borrow from selection/edit-mode patterns: clear affordances to enter, visible state while active, and predictable ways to leave. This reduces accidental state carryover.\n\n### Reconfigure the surface when the mode changes\n\nIf the behavior changes, the tools should too. In research-like modes, foreground evidence and citations, and de-emphasize styling controls. In creative or build modes, expose composing and variation controls. Copilot's inline vs. chat views illustrate how surfaces can reconfigure around task intent.\n\n### Set inheritance rules and stick to them\n\nDecide which parts of the session carry across modes, for example memory, attachments, or citations, and which reset, like tone or formatting. Unclear inheritance creates the conditions for mode errors. Make the rules visible at switch time.\n\n### Balance defaults, routing, and manual control\n\nMost people will stay in the default. Offer a safe, versatile default and optional auto-routing, with a clear override. Microsoft's Creative, Balanced, Precise styles show how a default anchors behavior while alternatives remain available.\n\n### Make modes discoverable, but add guardrails for costly states\n\nPlace high-value modes where they can be found, yet preview tradeoffs like longer runs, higher token use, or narrower sources. Perplexity's Focus modes and academic filter demonstrate scoped, labeled states tuned to user intent.",
       relatedPatterns: ["model-management", "attachments", "parameters"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd77b861307822f773e0de_modes_boltmode.webp",
          description: "By supporting two different modes, Bolt allows users to stay in the flow of work or stop to discuss with the AI",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd7645f82d6b951ba8588a_modes_chatgpt.webp",
          description: "ChatGPT offers multiple modes from the input box of its initial CTA",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd76f95b1fcb704ca8ea4a_claude2.png",
          description: "Conversational products like Claude allow you to toggle some modes from within the flow of an existing chat",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd77779869f24c133157c2_modes_cursormodes.webp",
          description: "Cursor's modes change how the IDE responds to their input, pausing new code generation and switching to conversation on demand",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd77fb5b1fcb704ca97a61_modes_duolingo.webp",
          description: "Duolingo Max supports \"explain my answer\" mode, opening a conversational interface where the user can understand the logic behind the lesson",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd76f68746685dc5076384_modes_geminimodes.webp",
          description: "Gemini follows the convention of allowing modes to be toggled on and off from the input box at the start, or in the flow of conversation",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd773b11d875a984693cb1_modes_grammarlymode.webp",
          description: "Grammarly's agents allow the user to switch modes of editing and review within a doc",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd7685cd13bf39d3bb9cba_modes_perplex.webp",
          description: "Perplexity modes are presented as tabs in its initial CTA, and include web search, deep research, and labs (build)",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd78cb661722f68a05f9f1_modes_replit.webp",
          description: "Replit hosts a large assortment of modes to adapt to whether the user is getting started, editing, or understanding code",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68bd78c79869f24c13322b07_modes_superwhisper.webp",
          description: "Superwhisper allows the user to define their own modes from the settings panel",
        },
      ],
    },
  },
  {
    id: "parameters",
    title: "Parameters",
    description: "Include constraints with your prompt for the AI to reference when generating its result.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e9843fc0c8bd03a9a69183_parameters_card.webp",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/parameters",
    content: {
      description: "Parameters sit between the user's intent and the model's generation process, helping to guide how the AI interprets the input, weights different aspects, and commits to an answer. Essentially, they act as the knobs on the machine that let users control how tightly or loosely the AI behaves, how exploratory or constrained it should be, and how much initiative it should take.\n\nThe earliest form of parameters was raw flags typed into prompts. Midjourney popularized this with inline commands like --v 4 to switch model versions or --no dogs to exclude unwanted tokens.\n\nSince then, this pattern has become more user-friendly. Parameters migrated into interfaces: sliders for temperature, dropdowns for model versions, quick chips for tone or length.\n\n### Parameter forms\n\nParameters are used across all content formats and use cases.\n\n**Inline flags**: These include typed tokens inside of the prompt. They offer high precision, but also a high learning curve. Examples include Midjourney's --no to exclude tokens, --v for model version, or --ar for aspect ratio. These can be added manually, or reflect in the prompt box after being added from within the UI.\n\n**Toggles and switches**: When parameters have only two values, a toggle makes adjusting it easy. Copy.ai offers a toggle to make the writing more casual or more formal, and Jasper provides the option to bias for speed vs. quality. This parameter can also impact model behavior, such as the option to enable linting by coding copilots.\n\n**Sliders**: To dial up or down the weights associated with different parameters, sliders have become a common UI option. These can be open-ended or have set tick marks to represent common values. For example, OpenAI has recently introduced sliders in their canvas tools to control reading level with set levels to choose from, while Midjourney's OmniReference weight is open ended.\n\n**Matrix controls**: To add an additional dimension, two related sliders can be combined in a 2x2 matrix, granting more granular control over the balance between the two. The tradeoff to this heightened precision is a more complicated interface. Figma Slides uses this UI when using AI to adjust voice and tone.\n\n### Location and visibility\n\nParameters may become critical tools for more advanced users, but people who are just learning your interface and product may find them distracting or confusing. Balance visibility with ease of access.\n\nOptions that control cost or speed of generation, or the general format of the final generation such as length or aspect ratio may need to be more visible or even available by default from the input field.\n\nGroup more complicated parameters in panels and consider how progressive disclosure or relative association might be utilized to expose advanced options at the moment they apply.",
      designConsiderations: "### Make defaults transparent and meaningful\n\nMost users will never touch parameters. Focus defaults on easy-to-understand, common options. Avoid making the interface feel like a black box for newer users, and offer more advanced options when relevant.\n\n### Bundle complexity when possible\n\nUse presets or modes to wrap multiple parameters into a clear choice like \"draft vs. publish\" or \"quality vs. speed.\" These wrappers should be transparent, showing which dials move under the hood when someone inspects further.\n\n### Expose depth progressively\n\nBeginners need one or two approachable controls, not a wall of knobs. Keep advanced parameters in drawers or side panels. Let power users drop into inline flags or multi-parameter panels. This separation avoids overwhelming novices while still respecting experts.\n\n### Treat autonomy as a parameter, not a surprise\n\nInitiative should never be hidden in the model's behavior. Let people set whether the AI should only suggest, ask for approval, or execute directly. Make these modes visible and easy to adjust mid-task so the AI doesn't feel inconsistent\n\n### Call out expensive choices\n\nSome options take longer to run or use up more credits. Label these clearly so people know when they're asking the AI to work harder, and what they'll get in return.\n\n### Design for edge cases\n\nParameters can create failure modes if set too high or low. Anticipate these extremes. For example, warn users when high temperature risks nonsense, or when long token limits may cut off mid-response. Provide guardrails without blocking exploration.",
       relatedPatterns: ["memory", "controls", "modes"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4d49d5bcdf3f6cf787f33_tuners_parameters_adobefirefly.avif",
          description: "Adobe Firefly makes use of the canvas to make parameters like the chosen voice and accent easy to see and edit",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68adec60065170c1c3bf384c_68aa2579519dc28ddecdfc32_Chronicle_-_parameters.png",
          description: "Before generating a presentation, Chronicle allows the user to select from a small set of parameters that will guide the generation of the presentation. Details like the number of chapters and the presentation type can be revised later. Re-write gives the option to direct the AI to subtly adjust the content, creatively adjust the content, or leave the content as is.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4da7e64b5afd9f331b284_tuners_parameters_chronicle.avif",
          description: "Chronicle's parameters are relevant to its use of helping users easily build a presentation",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68adec60065170c1c3bf384c_68aa2579519dc28ddecdfc32_Chronicle_-_parameters.png",
          description: "ElevenLabs combines parameters with the token cost pattern by noting how many credits will be spent for the generation (200, in this case)",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4d9285bcdf3f6cf78f73d_tuners_parameters_elevenlabs.avif",
          description: "Hypotenuse uses a simple toggle instead of a model selector to allow the user to prioritize speed or quality.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4d964ae4fa1ac942a0537_tuners_parameters_hypoteneuse.avif",
          description: "Krea places its parameters inside the input box",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4d428a6d861d7fdf48fd2_tuners_parameters_krea.avif",
          description: "Midjourney's parameters can be added inline to the prompt (a call back to its roots in Discord?) or from the parameters dropdown",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68b4d8ea464044463538e3fd_tuners_parameters_midjourney.avif",
          description: "Midjourney's parameters can be added inline to the prompt (a call back to its roots in Discord?) or from the parameters dropdown",
        },
      ],
    },
  },
  {
    id: "preset-styles",
    title: "Preset styles",
    description: "Provide default options to change the texture, aesthetic, or tone of generative media.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e9845c49aec29bd0f0475d_style_gallery_card.webp",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/preset-styles",
    content: {
      description: "Style presets provide a guided entry point into creative control. They let users apply established visual, tonal, or behavioral characteristics to a generation without needing to understand the technical mechanics of prompt design or model fine-tuning. This lowers the barrier to expressive output, especially for early or non-technical users.\n\nAcross modalities, preset galleries act as an onboarding bridge to deeper customization. In image tools like Midjourney, Krea, or Leonardo, users can browse curated styles with example images, often grouped by medium, theme, or creator. In writing and audio tools such as Jasper, ElevenLabs, and Udio, presets convey tone, voice, or genre. Each preset typically includes a name, description, and one or more examples, with filters or sort options to help users find relevant styles quickly.\n\nPreset styles can be applied directly to prompts or used to generate new variations within a consistent aesthetic. They may also unlock more advanced features. Some systems allow users to remix multiple presets, layer them, or add reference inputs to refine or evolve a style. Others support user-generated galleries, turning the preset system into a social surface where community styles can be shared, rated, and adapted.\n\nIn systems that support community or organizational sharing, presets become a shared vocabulary. Public galleries allow creators to publish styles with attribution and version tags, while internal libraries keep teams aligned around brand or production standards.",
      designConsiderations: "### Design for fast discovery\n\nOrganize galleries around categories that mirror how users actually search. Facets like lighting, camera, material, dialect, tempo, or mood help users scan quickly. Support search with autocomplete for names, tags, and creators, and let people sort by recency, popularity, or staff picks.\n\n### Use realistic previews to model the style\n\nPeople decide by seeing, not reading. Show each preset with inline thumbnails or hover previews, and allow \"auditioning\" that temporarily applies the style without overwriting their work. Ensure applying a preset takes one clear action with an immediate undo.\n\n### Show what a preset controls\n\nReveal the relationship between presets and underlying parameters. Clarify which elements are affected, such as composition, color, lighting, cadence, tone, and let users adjust intensity or blend it with prompt text. When presets build on references or other inputs, keep those connections visible.\n\n### Encourage community participation\n\nExpand the size of the preset library while encouraging engagement with users and creators by showcasing community styles. Be sure to share the username and profile details of the creator for attribution. Where free and paid styles are surfaced together, ensure users have an easy way to filter out premium listings.\n\n### Support portability and versioning\n\nAllow saving, pinning, and sharing presets within a project or organization. Tag presets with version information and model dependencies, and display compatibility warnings when models change. This keeps teams aligned even as systems evolve.\n\n### Keep presets composable\n\nUsers should be able to layer presets with manual edits, prompt text, or parameter tuning. Avoid locking them into predefined looks. Expose controls for \"strength\" or \"blend\" so styles can adapt rather than overwrite.",
       relatedPatterns: ["example-gallery", "parameters", "saved-styles"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e82592d6d7b5ecaa650a93_668446c0c51ab5624fe2ba2e_CleanShot-2024-07-02-at-12.25.34-2x-p-1600.png",
          description: "ChatGPT's audio mode comes preset with different voice styles to choose from.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e825e57a046af9053ebf58_eleven-style-gallery.png",
          description: "ElevenLabs organizes its library of pre-set styles by language, application, and common parameters.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e82544d3ec97f6b2635aca_style-gallery-gamma.png",
          description: "Gamma reveals a collection of pre-set styles in the slide wizard view, ensuring any generated images across the presentation follow a consistent theme.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e82551d3ec97f6b2636404_styleg-allery-udio2.png",
          description: "Udio's collection of styles is vast and can be filtered by genre and creator.",
        },
      ],
    },
  },
  {
    id: "prompt-enhancer",
    title: "Prompt enhancer",
    description: "Rewrite or expand user prompts to improve generation quality.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e651504a4a87aeb3219e70_prompt_tuner_prompt_improver_card.webp",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/prompt-enhancer",
    content: {
      description: "Models already rewrite our prompts. Most systems take what you type, adjust it, then send a stronger instruction to the model. A prompt enhancer brings that process into the open. It sits near the input, suggests concrete additions or rewrites, and turns a rough intent into a clear, constrained prompt before anything runs.\n\nEnhancers support a better user experience and more efficient use of compute power:\n\nAI systems feel more approachable by externalizing the \"hidden rules\" of prompting\n\nThe user can understand how the AI logically produced its generation, learning to control for bias, improve their own prompting capabilities, and remain in control.\n\nA strengthened input inceases the liklihood of getting to a good first result on the first go.\n\nWhile parameters tune model behavior after the fact, Prompt enhancers improve the instruction itself up front. Tools that expand, clarify, or score prompt completeness move from passive guidance to active assistance, closing skill gaps for non-experts.\n\nEnhancers show up across modalities. In text tools you see \"optimize\" or \"rewrite\" controls in editors and playgrounds. In image and video tools you see style chips, prompt expanders, and reference helpers that add structure behind the scenes while keeping the user's goal intact.\n\n### Co-generation\n\nFoundational models and many AI products include a workspace or playground for users to test various prompts against the model. Anthropic includes the option to have AI co-write your prompt with you, taking the user's input and using advanced prompt techniques to include it. In this way, a user can understand how AI processes their prompt into an improved form to logically get the best outcome.",
      designConsiderations: "### Make enhancement explicit and reviewable\n\nWhen the system rewrites the prompt, show the new prompt and allow users to continue editing before submitting. In this way, the prompt enhancement feature allows the user to quickly get to a first draft of their intent without abdicating agency over the prompt itself.\n\n### Replace follow up prompts with actions\n\nInstead of requiring a direct input, systems can use plain-language inline actions like \"more concise,\" \"add examples,\" or \"cinematic lighting,\" then translate them to model-specific syntax under the hood. This reduces cognitive load without hiding capability.\n\n### Require just enough input before enhancing\n\nIf the tool needs a minimum amount of context in order to accurately refine the bar, show a clear character count or relative affordance instead of rendering the action disabled until the arbitary floor is met.\n\n### Keep user intent and voice intact\n\nPreserve key nouns, constraints, and style cues from the user's text. Avoid adding facts, opinions, or scope changes unless the user opts in, and highlight any material expansions for easy review.\n\n### Keep the raw prompt accessible\n\nLet users view, copy, and export the final prompt that will be sent to the model. For power users, expose token count and key parameters so they can manage cost and context.\n\n### Offer control levels that match expertise\n\nDefault to a single \"Enhance\" action with sensible presets. Provide an \"Advanced\" drawer for users who want fine-grained knobs like tone, audience, structure, references, or safety filters.",
       relatedPatterns: ["parameters", "preset-styles"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8a782f32c56334dd98a12_firefly-enhance2-copy.png",
          description: "Firefly supports prompt enhancement from the input box and labels it clearly after the prompt has been updated.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8a67c7c8efea961fcb6a9_enhance-prompt-bolt.png",
          description: "Bolt prominently offers a prompt improvement functionality from the input box.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8a9135353762223950b5d_CleanShot-2025-09-12-at-17.15.31-2x-copy.png",
          description: "Cofounder labels the prompt enhancement feature as auto improve from the input box.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8a5c46a1ba1d174240cd0_668487bd095ceda570148d86_Frame-108.png",
          description: "Copy places the action to improve the prompt within the toolfar and updates the user's prompt within the input box.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8aa3bf32c56334ddab7c3_Florafauna.png",
          description: "FloraFauna places the enhance prompt icon prominently in the toolbar of each card.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8a6d78d323dc62d66996d_leonardo-improve-copy.png",
          description: "Leonardo.ai lists prompt improvement as an action within the input box instead of running the operation quietly in the background.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e8a7d8be224b4b6609cae7_CleanShot-2025-10-10-at-00.28.22-2x.png",
          description: "v0 proactively includes a prompt enhancement feature from the input box.",
        },
      ],
    },
  },
  {
    id: "saved-styles",
    title: "Saved styles",
    description: "Allow users to define their own style presets for re-use.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e9846e42e1a2f38a6de915_saved_style_card.webp",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/saved-styles",
    content: {
      description: "Giving users the ability to train the model on different styles they can recall for use later helps make AI tools stickier and more useful. Users and account managers need tools to product outputs that match their team's brand or taste personal taste without rebuilding prompts each time. Saved styles allow users to reduce manual work while producing reliably similar outputs that match their intent.\n\n### Saved styles across modalities\n\nWhile parameters and training methods vary across content types, saved styles can be useful in all forms:\n\n**Writing styles**: Users can define preset writing styles with distinct voice and tone, depth of detail, technicality, and so on. A piece of marketing content written to appeal to hiring managers on LinkedIn and a technical paper for researchers may draw from similar context sources, but need to sound completely different.\n\n**Audio voices**: Depending on the context, users may want voices with different pacing, emotional projection, or characteristics like inferred age. Examples include creating different characters for an audio book, or different personas for AI presenters.\n\n**Visual styles**: Custom trained styles provide consistent art direction by bundling parameters, references, prompt fragments, and seeds, ensuring reliably similar outputs across multiple runs. These may be remixed for artistic effect.\n\n**Video treatments**: Saved detailed like camera, grade, and look cut down on post processing and ensures a consistent look and feel across the film. This application is still emerging.\n\n### Creating new styles\n\nDefining new custom styles may be as simple as using natural language to communicate a general demeanor. More advanced tools can lead to precise controls and more reliable results:\n\n**Contextual attachments** like sample images or voices give the AI references to draw from when selecting tokens and weights.\n\n**Negative prompts** such as words to avoid or tokens to demote serve as controls for unknown applications and compliant behavior.\n\n**Setting safe or known words and tokens**, such as specific pronunciations of proper nouns or consistent character visuals ensure consistency across multiple runs.\n\n**Set parameters for form and structure** like emotion or vibe, technical depth, composition, pacing, etc. This ensures details across multiple generative compositions remain intact.\n\n**General prompts** to guide token production of aesthetic details, levels of detail and realism, etc can be precise and detailed or general. Ensure the prompt is visible and editable.\n\nAdditionally, users may wish to set the temperature of the style when in use, choosing to restrain the model to a strict interpretation and usage, or allow the model to reference the style but veer off into randomized seeds as well\n\n### Applying custom styles\n\nMany products come with a style gallery for users to choose from for pre-set options. It's common for saved styles to be added to this gallery at the account or user level for users to apply when needed.\n\nFor more advanced users, custom LoRA models can be created to extend saved styles beyond prompt-level preferences. LoRA models take a saved style and turn it into something the AI actually learns, embedding tone, aesthetic, or structure directly into its behavior. This allows teams to produce consistently on-brand or personalized outputs across text, image, audio, and video without rebuilding or re-prompting each time.\n\nWhether managed through individual options or a full model, saved styles operate as an extension of a brand system, creating a shared language teams can use across workstreams.",
      designConsiderations: "### Ensure easy retrieval\n\nAllow styles to be accessible from the prompt input to support discovery and ease of use. Consider other methods as well, such as enabling styles to be copied into the input with a click or tap when shared as a parameter in a gallery or history view.\n\n### Use previews to make styles tangible\n\nShow sample images of the style being applied, voice clips, and other clues of the style's form and function from where it is saved, allowing users to easily browse and compare multiple styles.\n\n### Add supportive details\n\nHelp users select the right style for the job with additional information like usage notes, sample avatars or names that give clues to a style's training, etc. Especially in team settings, the consistent usage of saved styles for the right job preserves its value.\n\n### Show styles in use and their source\n\nMake the current style visible near the input, along with its source (personal, team, or system) so users can check their work, avoid mistakes, or make changes confidently.\n\n### Support generative creativity\n\nAllow styles to be blended with each other or other references to give users maximum control and encourage exploration.",
       relatedPatterns: ["parameters", "preset-styles"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e81be5114825c47db978ef_eleven.png",
          description: "ElevenLabs allows users to generate custom voices, starting from scratch or blending existing voices from style presets.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e81d68a792f294d2d12ba4_elevenlabs-saved-style2.png",
          description: "ElevenLabs supports direct voice cloning to create custom voice styles that directly mimic the reference.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e81ca2939f545f035f72f6_CleanShot-2025-08-30-at-08.45.50-2x.png",
          description: "FloraFauna allows users to define their own styles from the style presets menu.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68e81d12a9ba85f7d9526c14_CleanShot-2025-09-01-at-05.33.18-2x.png",
          description: "Krea's video editor can generate a seed tag that can be used as a custom style to generate additional videos with the same characteristics.",
        },
      ],
    },
  },
  {
    id: "voice-and-tone",
    title: "Voice and tone",
    description: "Ensure outputs match your voice, tone, and preferences in a consistent way.",
    thumbnail: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68ecf91a038a532eb6f83233_Custom%20Personality%20feature.png",
    categoryId: "settings",
    sourceUrl: "https://www.shapeof.ai/patterns/voice-and-tone",
    content: {
      description: "For AI to be used professionally, people need confidence that its outputs can be shaped and kept consistent. This includes ensuring that a consistent voice and tone can be maintained across channels and content:\n\nA marketing team can't afford one group sounding casual while another sounds formal.\n\nAn individual doesn't want writing that feels off-brand or unlike them.\n\nA creative group wants to produce consistent artifacts across an account while splitting up the work.\n\nMost generative platforms begin with simple presets. Text editing tools allow users to select whether the AI should be witty, professional, or concise, while image generators allow you to select from a style gallery. These quick toggles work well at the moment of generation, but they aren't enough for teams that need precision.\n\nCustom voice and tone modifiers allow users and teams to define their own presets and save them to use later. These presets can be saved and reused, modified, and allow for rapid and consistent generation across multiple prompts or account users.\n\n### Sample traits\n\nDepending on the modality, custom styles can incorporate a broad array of defining traits:\n\nGeneral tone and perspective (formal, casual, witty, empathetic, academic)\n\nVocabulary preferences (preferred terms, banned terms, jargon level)\n\nSentence length and structure (short/concise vs. long/complex)\n\nLevel of detail or depth (high-level summary vs. in-depth explanation)\n\nFormatting style (headings, bullet use, citation format, code commenting style)\n\nVisual aesthetic (hand-drawn, cinematic, photorealistic, minimalist)\n\nAudio qualities (accent, pitch, pacing, warmth, formality of speech)\n\nCoding conventions (indentation, naming schemes, documentation style)\n\nError tolerance and strictness (lenient vs. precise in adhering to rules)\n\nInstructional stance (encouraging coach, critical reviewer, neutral explainer)\n\nCultural or regional variants (US vs. UK spelling, metric vs. imperial units, localized idioms)\n\n### Configured voices vs. native personalities\n\nConfiguring tone of voice is different from the AI's own personality. Personality comes from training data and system prompts, shaping how the AI interacts with you. Modifying the AI's default voice and tone shapes how it reflects you back in its outputs.\n\nKeeping these roles distinct matters. People rarely care about the AI's character, but they do care whether its writing sounds right for the context.",
      designConsiderations: "### Start with clear entry points\n\nUsers shouldn't have to dig through settings to shape how the AI sounds or writes. Lightweight selectors at the point of generation (make this more formal / more casual) lower friction and make voice controls visible from the start.\n\n### Layer in depth for custom voices or styles\n\nOnce people see the value, they'll want richer control. Provide a dedicated space where they can define rules, set phrases to use or avoid, and specify tonal markers. Treat this like a brand kit, with previews that show how outputs will look in practice.\n\n### Handle persistence with intention\n\nDecide if voices should follow users globally or stay tied to specific projects. Global persistence is convenient but risky if tone carries into the wrong context. Project-scoped settings reduce this risk but require more setup. If you support both, make the scope obvious and easy to switch.\n\n### Make conflicts visible\n\nIf multiple voices could apply, such as a personal default and a team brand voice, don't apply overrides silently. Show which voice is active and why. A simple label like \"Using: Team Brand Voice\" prevents confusion.\n\n### Always provide a reset\n\nUsers need confidence that they can return to neutral. An explicit \"Reset to default voice\" gives them permission to experiment without worrying about permanent changes.",
       relatedPatterns: ["saved-styles", "model-management", "memory"],
      examples: [
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d6dc7050cb4b2d4e3233de_custom_voice_hubspot.webp",
          description: "The Dia browser accepts details such as references and influences and specific instructions for how you code in its settings panel.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d7415d98147c5d739147c4_custom_voice_elevenlabs.webp",
          description: "ElevenLabs supports the creation of multiple voices that can be saved and used on demand.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d6dc7850cb4b2d4e323a28_custom_voice_grammar_voice.webp",
          description: "Grammarly makes it easy to set up a voice using simple parameters. More advanced options are found in settings.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d6dccf97e7f693dc959152_custom_voice_jasper.webp",
          description: "Once users have created custom voices in Jasper, they can select from their available list from the input field.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d7410f98147c5d73910968_custom_voice_midjourney.webp",
          description: "Midjourney allows users to create multiple custom profiles trained on preferences between styles, or generated from scratch using moodboards. Each profile can be added and blended as a parameter to influence the final generation.",
        },
        {
          image: "https://cdn.prod.website-files.com/65db6dd21591364dfcb8ae36/68d767c8b839f24790f393ba_custom_voice_tabnine.webp",
          description: "Tabnine supports different rules for the IDE to follow constraining stylistic instructions for writing code.",
        },
      ],
    },
  },

  // Governors
  {
    id: "action-plan",
    title: "Action Plan",
    description: "Have the AI show the steps it will take to respond to the user's prompt before it executes its response",
    thumbnail: "https://images.unsplash.com/photo-1640077597161-3ba5101624ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBwbGFuJTIwc3RyYXRlZ3klMjBzdGVwc3xlbnwxfHx8fDE3NzEzMjgyODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "An action plan shows users the specific steps the AI will take before executing them. This preview builds trust, allows course correction, and helps users understand the AI's reasoning process.\n\n### Plan Components\n- Numbered or ordered steps\n- Expected outcome for each step\n- Resources or data needed\n- Estimated time or complexity\n- Opportunity to approve or modify",
      designConsiderations: "### Presentation\n- Use clear, scannable format\n- Show plan before execution\n- Allow editing individual steps\n- Provide approve/reject options\n- Support saving plans for reuse\n\n### Execution Control\n- Allow proceeding step-by-step\n- Support pausing mid-execution\n- Enable canceling remaining steps\n- Show progress through plan",
       relatedPatterns: ["stream-of-thought", "verification"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "ChatGPT showing planned steps before executing code",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Claude's task breakdown preview",
        },
      ],
    },
  },
  {
    id: "branches",
    title: "Branches",
    description: "Support iterative prompting while retaining footprints and visibility back to the original",
    thumbnail: "https://images.unsplash.com/photo-1611841502288-4470571cebaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwYnJhbmNoZXMlMjBzcGxpdCUyMGZvcmt8ZW58MXx8fHwxNzcxMzI4Mjg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Branches allow users to explore different directions from any point in a conversation or workflow while maintaining a tree structure that shows all paths taken. This supports experimentation without losing work.\n\n### Branch Features\n- Create new branch from any point\n- Visual tree or timeline view\n- Name/label branches\n- Switch between branches\n- Compare branches side-by-side\n- Merge branches if needed",
      designConsiderations: "### Visualization\n- Clear tree structure showing relationships\n- Highlight current branch\n- Show branch points clearly\n- Use color coding or icons\n- Support collapsing/expanding\n\n### Navigation\n- Easy switching between branches\n- Quick jump to any point\n- Search across branches\n- Show branch metadata (created, modified)",
       relatedPatterns: ["variations", "footprints"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
          description: "ChatGPT's conversation branching visualization",
        },
        {
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
          description: "Claude's branch exploration interface",
        },
      ],
    },
  },
  {
    id: "citations",
    title: "Citations",
    description: "Lets the AI give inline annotations to cite its sources",
    thumbnail: "https://images.unsplash.com/photo-1752697589128-f8e110a86af3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXRhdGlvbiUyMHJlZmVyZW5jZSUyMHNvdXJjZXN8ZW58MXx8fHwxNzcxMzI4Mjg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Citations provide inline references showing which sources informed specific parts of the AI's response. This enables verification, builds trust, and helps users explore topics more deeply.\n\n### Citation Formats\n- Inline numbered references [1]\n- Superscript links to sources\n- Hover tooltips with source preview\n- Highlighted text with source links\n- Footnote-style references",
      designConsiderations: "### Source Information\n- Title and author\n- Publication date\n- Direct link to source\n- Excerpt or relevant quote\n- Credibility indicators\n\n### Interaction\n- Clickable citations open source\n- Show all citations in sidebar\n- Filter by source type\n- Search within cited sources",
       relatedPatterns: ["references", "footprints"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
          description: "Perplexity's inline numbered citations",
        },
        {
          image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&h=600&fit=crop",
          description: "Bing Chat's source cards with citations",
        },
      ],
    },
  },
  {
    id: "controls",
    title: "Controls",
    description: "Manage the flow of information or pause a request mid-stream to adjust the prompt",
    thumbnail: "https://images.unsplash.com/photo-1720036237584-7fd0f37db499?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250cm9scyUyMHBhdXNlJTIwc3RvcCUyMGJ1dHRvbnN8ZW58MXx8fHwxNzcxMzI4Mjg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Controls give users the ability to manage AI execution in real-time, including pausing, stopping, or modifying requests mid-stream. This maintains user agency and prevents wasted resources.\n\n### Control Types\n- Stop/Cancel generation\n- Pause and resume\n- Adjust parameters mid-generation\n- Skip to next step\n- Modify prompt during execution",
      designConsiderations: "### Visibility\n- Always-accessible stop button\n- Clear state indicators (running, paused)\n- Show what will happen when stopped\n- Confirm destructive actions\n\n### Responsiveness\n- Immediate response to controls\n- Save partial work when stopped\n- Allow resuming from pause point\n- Show progress and remaining work",
       relatedPatterns: ["stream-of-thought", "cost-estimates"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "ChatGPT's stop generating button",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Midjourney's cancel and modify controls",
        },
      ],
    },
  },
  {
    id: "cost-estimates",
    title: "Cost Estimates",
    description: "Help users proactively modulate compute power through transparent cost estimates for actions",
    thumbnail: "https://images.unsplash.com/photo-1650821414390-276561abd95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3N0JTIwbW9uZXklMjBlc3RpbWF0ZSUyMGJ1ZGdldHxlbnwxfHx8fDE3NzEzMjgyODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Cost estimates show users the expected computational or monetary cost before executing AI actions. This transparency helps users make informed decisions and manage their usage.\n\n### Cost Information\n- Estimated tokens or credits\n- Approximate execution time\n- Monetary cost (if applicable)\n- Comparison to similar past actions\n- Budget impact",
      designConsiderations: "### Presentation\n- Show before committing to action\n- Use clear, understandable units\n- Provide context (% of daily budget)\n- Update estimates if prompt changes\n- Alert when costs are unusually high\n\n### User Control\n- Allow setting budget limits\n- Warn before expensive operations\n- Suggest cost-saving alternatives\n- Track spending over time",
       relatedPatterns: ["draft-mode", "model-management"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
          description: "OpenAI Playground's token counter and cost display",
        },
        {
          image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
          description: "Anthropic Console's usage metrics",
        },
      ],
    },
  },
  {
    id: "draft-mode",
    title: "Draft Mode",
    description: "Support exploration and iterative prompting while reducing compute costs until a final form is ready",
    thumbnail: "https://images.unsplash.com/photo-1727812100173-b33044cd3071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFmdCUyMHNrZXRjaCUyMG91dGxpbmUlMjBtb2RlfGVufDF8fHx8MTc3MTMyODI4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Draft mode enables faster, lower-cost iterations by using simplified processing or lower-quality settings during exploration. Users can switch to high-quality mode when they're satisfied with the result.\n\n### Draft Mode Features\n- Faster generation speed\n- Lower computational cost\n- Reduced quality or resolution\n- Quick iteration cycles\n- Easy upgrade to full quality",
      designConsiderations: "### Mode Switching\n- Clear indication of current mode\n- Easy toggle between draft and final\n- Show differences between modes\n- Confirm before expensive final render\n\n### Quality Indicators\n- Show draft quality level\n- Preview what final will look like\n- Estimate time/cost for final render\n- Warn about draft limitations",
       relatedPatterns: ["cost-estimates", "sample-response"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
          description: "Midjourney's fast mode vs standard mode",
        },
        {
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
          description: "Runway's draft quality preview",
        },
      ],
    },
  },
  {
    id: "memory",
    title: "Memory",
    description: "Control what details the AI knows about you",
    thumbnail: "https://images.unsplash.com/photo-1679842115390-8084bbb1d4a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW1vcnklMjBicmFpbiUyMHJlbWVtYmVyJTIwcmVjYWxsfGVufDF8fHx8MTc3MTMyODI4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Memory controls let users manage what information the AI retains about them across sessions. This includes viewing, editing, and deleting stored information to maintain privacy and relevance.\n\n### Memory Features\n- View all stored information\n- Edit or delete specific memories\n- Control what gets remembered\n- Clear all memory\n- Temporary sessions without memory",
      designConsiderations: "### Transparency\n- Show clearly what's being remembered\n- Explain how memory is used\n- Indicate when memory influences responses\n- Provide memory export\n\n### Control Granularity\n- Topic-based memory management\n- Time-based memory retention\n- Importance-based prioritization\n- Context-specific memory settings",
       relatedPatterns: ["incognito-mode", "data-ownership"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "ChatGPT's memory management interface",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Claude's conversation memory settings",
        },
      ],
    },
  },
  {
    id: "references",
    title: "References",
    description: "See and manage what additional sources the AI references to generate its response",
    thumbnail: "https://images.unsplash.com/photo-1769092992803-ee97d235ba87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZlcmVuY2VzJTIwZG9jdW1lbnRzJTIwbGlicmFyeXxlbnwxfHx8fDE3NzEzMjgyODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "References show all sources the AI used to generate its response, allowing users to verify, explore, and manage what information influences AI outputs.\n\n### Reference Management\n- View all referenced sources\n- Add custom reference materials\n- Remove or exclude sources\n- Set source priorities\n- Upload documents to reference",
      designConsiderations: "### Source Display\n- List all sources with metadata\n- Show which parts used which sources\n- Indicate source credibility\n- Provide direct links to sources\n- Group related references\n\n### User Control\n- Pin important references\n- Exclude unreliable sources\n- Weight certain sources higher\n- Save reference sets for reuse",
       relatedPatterns: ["citations", "attachments"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
          description: "Perplexity's source panel with all references",
        },
        {
          image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&h=600&fit=crop",
          description: "Claude's attached document references",
        },
      ],
    },
  },
  {
    id: "sample-response",
    title: "Sample Response",
    description: "Confirm the user's intent for complicated prompts",
    thumbnail: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9pY2UlMjBtdWx0aXBsZSUyMG9wdGlvbnN8ZW58MXx8fHwxNzcxMzI4Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Sample response provides a quick preview or abbreviated version of what the AI will generate, allowing users to confirm the direction is correct before committing to full generation.\n\n### When to Use\n- Complex or lengthy generations\n- Expensive computations\n- Ambiguous prompts\n- High-stakes outputs",
      designConsiderations: "### Preview Format\n- Show representative sample\n- Indicate it's a preview, not final\n- Include key elements that will appear\n- Estimate how final will differ\n\n### User Actions\n- Approve and continue\n- Modify prompt based on preview\n- Cancel if preview shows wrong direction\n- Request different sample",
       relatedPatterns: ["verification", "action-plan"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "Midjourney's low-res preview before upscaling",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Runway's quick preview before full render",
        },
      ],
    },
  },
  {
    id: "shared-vision",
    title: "Shared Vision",
    description: "Live visibility into the AI's action in a shared canvas or workspace",
    thumbnail: "https://images.unsplash.com/photo-1684217875364-35ed8311d463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjB2aXNpb24lMjBjb2xsYWJvcmF0aW9uJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3MTMyODI4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Shared vision provides real-time visibility into the AI's work process within a collaborative workspace, allowing users to see and potentially intervene as the AI generates or modifies content.\n\n### Features\n- Live preview of AI's work\n- Real-time updates as AI progresses\n- Show AI cursor or active area\n- Display current action or step\n- Allow interruption or guidance",
      designConsiderations: "### Collaboration\n- Clear distinction between AI and human edits\n- Show who/what made each change\n- Enable smooth handoffs between AI and human\n- Support simultaneous work\n\n### Performance\n- Optimize for real-time streaming\n- Handle network latency gracefully\n- Batch updates appropriately\n- Indicate sync status",
       relatedPatterns: ["stream-of-thought", "controls"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "Figma AI showing design changes in real-time",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Notion AI collaboratively editing documents",
        },
      ],
    },
  },
  {
    id: "stream-of-thought",
    title: "Stream of Thought",
    description: "Reveals the AI's logic thought process, tool use, and decisions for oversight and auditability",
    thumbnail: "https://images.unsplash.com/photo-1768413911275-a7bc7b59b52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aG91Z2h0JTIwcHJvY2VzcyUyMHRoaW5raW5nJTIwcmVhc29uaW5nfGVufDF8fHx8MTc3MTMyODI4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Stream of thought exposes the AI's internal reasoning process, showing how it breaks down tasks, makes decisions, and arrives at conclusions. This transparency enables oversight and builds trust.\n\n### What to Show\n- Step-by-step reasoning\n- Decision points and rationale\n- Tools or functions being called\n- Information being retrieved\n- Confidence levels for decisions",
      designConsiderations: "### Presentation\n- Collapsible detailed view\n- Clear visual hierarchy\n- Real-time streaming of thoughts\n- Distinguish reasoning from output\n- Use appropriate technical level\n\n### Interactivity\n- Allow expanding reasoning details\n- Enable intervention at decision points\n- Support asking about reasoning\n- Provide feedback on reasoning quality",
      relatedPatterns: ["action-plan", "footprints"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
          description: "ChatGPT's code interpreter showing execution steps",
        },
        {
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
          description: "Claude's thinking process display",
        },
      ],
    },
  },
  {
    id: "variations",
    title: "Variations",
    description: "Trace through multiple variations of a result to choose the one that works best for them",
    thumbnail: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9pY2UlMjBtdWx0aXBsZSUyMG9wdGlvbnN8ZW58MXx8fHwxNzcxMzI4Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Variations generate multiple versions of a result simultaneously, allowing users to compare options and choose the best one. This reduces iteration time and helps users explore possibilities.\n\n### Variation Types\n- Generate multiple at once\n- Create variations from selected result\n- Systematic parameter variations\n- Random explorations",
      designConsiderations: "### Display\n- Show all variations side-by-side\n- Enable easy comparison\n- Support grid or carousel view\n- Indicate differences between variations\n- Allow sorting or filtering\n\n### Selection and Refinement\n- Clear selection mechanism\n- Create variations from chosen result\n- Combine aspects of multiple variations\n- Save favorites",
       relatedPatterns: ["regenerate", "branches"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
          description: "Midjourney's 4-image variation grid",
        },
        {
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
          description: "DALL-E's multiple generation options",
        },
      ],
    },
  },
  {
    id: "verification",
    title: "Verification",
    description: "Allow users to confirm AI decisions and actions before proceeding",
    thumbnail: "https://images.unsplash.com/photo-1632961974688-fae53de3cabc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVzdCUyMGNvbmZpZGVuY2UlMjBhY2N1cmFjeXxlbnwxfHx8fDE3NzEzMjgyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "governors",
    content: {
      description: "Verification requires user confirmation before the AI executes certain actions, particularly those that are irreversible, expensive, or high-stakes. This maintains human oversight for critical decisions.\n\n### When to Verify\n- Destructive actions (delete, overwrite)\n- Expensive operations\n- External actions (sending emails, API calls)\n- High-stakes decisions\n- Batch operations",
      designConsiderations: "### Confirmation UI\n- Clear description of what will happen\n- Show preview of effects\n- Highlight irreversible actions\n- Provide cancel option\n- Avoid confirmation fatigue\n\n### Smart Verification\n- Only verify when necessary\n- Remember user preferences\n- Batch similar verifications\n- Allow trusted actions to skip",
       relatedPatterns: ["action-plan", "sample-response"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "ChatGPT confirming before running code",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Zapier's AI action confirmation dialogs",
        },
      ],
    },
  },

  // Trust Builders
  {
    id: "caveat",
    title: "Caveat",
    description: "Inform users about shortcomings or risks in the model or the technology overall",
    thumbnail: "https://images.unsplash.com/photo-1578867769967-dbb3ee278b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXZlYXQlMjB3YXJuaW5nJTIwbGltaXRhdGlvbnxlbnwxfHx8fDE3NzEzMjgyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "trust-builders",
    content: {
      description: "Caveats clearly communicate the limitations, potential errors, and risks associated with AI-generated content. This manages expectations and helps users make informed decisions about trusting and using AI outputs.",
      designConsiderations: "### Placement and Timing\n- Show caveats when most relevant\n- Don't hide behind fine print\n- Use clear, non-technical language\n- Make caveats dismissible but accessible",
       relatedPatterns: ["disclosure", "citations"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "ChatGPT's accuracy disclaimer",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Google Bard's experimental warning",
        },
      ],
    },
  },
  {
    id: "consent",
    title: "Consent",
    description: "Only capture data from others with their knowledge and permission",
    thumbnail: "https://images.unsplash.com/photo-1695370993558-35ca1d62c8dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zZW50JTIwcGVybWlzc2lvbiUyMGFwcHJvdmFsfGVufDF8fHx8MTc3MTMyODI5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "trust-builders",
    content: {
      description: "Consent ensures that data about or from others is only used with their explicit permission. This is especially important for AI features that might process or generate content involving other people.",
      designConsiderations: "### Clear Requests\n- Explain what data will be used and how\n- Make consent opt-in, not opt-out\n- Allow granular consent choices\n- Provide easy way to revoke consent",
       relatedPatterns: ["data-ownership", "memory"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "Notion's workspace consent for AI features",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Zoom's AI companion consent dialog",
        },
      ],
    },
  },
  {
    id: "data-ownership",
    title: "Data Ownership",
    description: "Control how the model remembers and uses your data",
    thumbnail: "https://images.unsplash.com/photo-1762330465065-af76f23809db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwb3duZXJzaGlwJTIwcHJpdmFjeXxlbnwxfHx8fDE3NzEzMjgyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "trust-builders",
    content: {
      description: "Data ownership gives users control over how their information is stored, used, and potentially used for training AI models. This includes options to export, delete, or opt-out of certain uses.",
      designConsiderations: "### Transparency\n- Clearly explain data usage policies\n- Show what data is stored\n- Indicate if data is used for training\n- Provide data export functionality",
       relatedPatterns: ["memory", "incognito-mode"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "ChatGPT's data controls and export",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Claude's conversation data settings",
        },
      ],
    },
  },
  {
    id: "disclosure",
    title: "Disclosure",
    description: "Clearly mark content and interactions guided or delivered by AI",
    thumbnail: "https://images.unsplash.com/photo-1644718195302-cb82d9dfb366?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjbG9zdXJlJTIwdHJhbnNwYXJlbmN5JTIwaW5mb3JtYXRpb258ZW58MXx8fHwxNzcxMzI4Mjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "trust-builders",
    content: {
      description: "Disclosure clearly indicates when content is AI-generated or when users are interacting with an AI system. This transparency helps users contextualize information and make informed decisions.",
      designConsiderations: "### Visual Indicators\n- Consistent AI badges or labels\n- Subtle but noticeable markers\n- Accessible to all users\n- Present without being intrusive",
       relatedPatterns: ["watermark", "caveat"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "LinkedIn's AI-assisted label on posts",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Gmail's AI-generated reply indicator",
        },
      ],
    },
  },
  {
    id: "footprints",
    title: "Footprints",
    description: "Let users trace the AI's steps from prompt to result",
    thumbnail: "https://images.unsplash.com/photo-1758565141468-e346d32d050c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290cHJpbnRzJTIwdHJhY2UlMjBzdGVwcyUyMHBhdGh8ZW58MXx8fHwxNzcxMzI4Mjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "trust-builders",
    content: {
      description: "Footprints provide a traceable record of how the AI arrived at its output, including the steps taken, data accessed, and decisions made. This auditability builds trust and enables learning.",
      designConsiderations: "### Trace Information\n- Chronological record of steps\n- Data sources accessed\n- Decisions and reasoning\n- Timestamps and versioning",
       relatedPatterns: ["stream-of-thought", "citations"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
          description: "Perplexity's search and reasoning trail",
        },
        {
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
          description: "Claude's step-by-step execution history",
        },
      ],
    },
  },
  {
    id: "incognito-mode",
    title: "Incognito Mode",
    description: "Interact with the AI outside of its memory",
    thumbnail: "https://images.unsplash.com/photo-1633486294746-5a14ae585ff7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmNvZ25pdG8lMjBwcml2YXRlJTIwYW5vbnltb3VzfGVufDF8fHx8MTc3MTMyODI5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "trust-builders",
    content: {
      description: "Incognito mode allows users to interact with AI without the system remembering the conversation or using it to personalize future interactions. This provides privacy for sensitive topics.",
      designConsiderations: "### Clear Mode Indication\n- Visual indicator of incognito state\n- Explain what's not being saved\n- Easy toggle on/off\n- Confirm before exiting mode",
       relatedPatterns: ["memory", "data-ownership"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "ChatGPT's temporary chat mode",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Claude's private conversation option",
        },
      ],
    },
  },
  {
    id: "watermark",
    title: "Watermark",
    description: "Identifiers on AI Generative content that humans, software, or programs can read",
    thumbnail: "https://images.unsplash.com/photo-1631173254100-888e34f1a890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcm1hcmslMjBzaWduYXR1cmUlMjBtYXJrfGVufDF8fHx8MTc3MTMyODI5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "trust-builders",
    content: {
      description: "Watermarks embed imperceptible or subtle markers in AI-generated content that can be detected by software, helping identify synthetic media and combat misinformation.",
      designConsiderations: "### Implementation\n- Invisible to humans but machine-readable\n- Robust against common manipulations\n- Include metadata about generation\n- Provide verification tools",
       relatedPatterns: ["disclosure", "footprints"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
          description: "Google's SynthID watermarking system",
        },
        {
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
          description: "OpenAI's digital watermarking for DALL-E",
        },
      ],
    },
  },

  // Identifiers
  {
    id: "avatar",
    title: "Avatar",
    description: "Visual identifier of the AI itself to help it be recognizable, memorable, and on-brand.",
    thumbnail: "https://images.unsplash.com/photo-1585972949687-48eff8b879a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmF0YXIlMjBpZGVudGl0eSUyMHByb2ZpbGUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzcxMzI4Mjk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "identifiers",
    content: {
      description: "An avatar provides a visual representation of the AI, making it more recognizable and giving it personality. The avatar appears consistently across the interface to identify AI-generated content and interactions.",
      designConsiderations: "### Design Principles\n- Simple and recognizable at small sizes\n- Consistent with brand identity\n- Distinguishable from user avatars\n- Scalable across contexts",
       relatedPatterns: ["personality", "name"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
          description: "Claude's friendly avatar icon",
        },
        {
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
          description: "Character.AI's diverse character avatars",
        },
      ],
    },
  },
  {
    id: "color",
    title: "Color",
    description: "Visual cues to help users identify AI features or content.",
    thumbnail: "https://images.unsplash.com/photo-1557777586-f6682739fcf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsZSUyMGRlc2lnbiUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NzEzMjgyODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "identifiers",
    content: {
      description: "Color coding helps users quickly identify AI-related features, actions, and content. Consistent use of specific colors creates strong visual associations with AI functionality.",
      designConsiderations: "### Color Selection\n- Distinct from other interface colors\n- Accessible (meets WCAG standards)\n- Consistent across all AI features\n- Culturally appropriate",
       relatedPatterns: ["iconography", "disclosure"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "Notion's purple highlights for AI features",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Figma's gradient accents on AI tools",
        },
      ],
    },
  },
  {
    id: "iconography",
    title: "Iconography",
    description: "Images that represent AI-powered actions throughout the interface.",
    thumbnail: "https://images.unsplash.com/photo-1764418086770-322884489f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY29ub2dyYXBoeSUyMHN5bWJvbHMlMjBpY29uc3xlbnwxfHx8fDE3NzEzMjgyOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "identifiers",
    content: {
      description: "Iconography provides consistent visual symbols for AI actions and features, making them instantly recognizable and improving usability through visual language.",
      designConsiderations: "### Icon Design\n- Clear and recognizable at small sizes\n- Consistent style across all AI icons\n- Distinct from non-AI icons\n- Include common AI symbols (sparkles, stars, etc.)",
       relatedPatterns: ["color", "avatar"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          description: "Notion's sparkle icon for AI features",
        },
        {
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
          description: "Adobe's AI star icon across products",
        },
      ],
    },
  },
  {
    id: "name",
    title: "Name",
    description: "How the AI is referred to through the product and across the overall customer experience.",
    thumbnail: "https://images.unsplash.com/photo-1759563874667-73fd773d33d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYW1lJTIwYnJhbmQlMjBpZGVudGl0eSUyMGxhYmVsfGVufDF8fHx8MTc3MTMyODI5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "identifiers",
    content: {
      description: "The AI's name creates identity and helps users form a relationship with the system. A good name is memorable, pronounceable, and aligned with brand values.",
      designConsiderations: "### Naming Strategy\n- Memorable and easy to pronounce\n- Reflects brand personality\n- Culturally sensitive\n- Not generic (avoid just 'AI' or 'Assistant')",
       relatedPatterns: ["personality", "avatar"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
          description: "Claude by Anthropic - friendly, approachable name",
        },
        {
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
          description: "Copilot by Microsoft/GitHub - collaborative name",
        },
      ],
    },
  },
  {
    id: "personality",
    title: "Personality",
    description: "Characteristics that distinguish the AI's personality and vibe.",
    thumbnail: "https://images.unsplash.com/photo-1585972949687-48eff8b879a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmF0YXIlMjBpZGVudGl0eSUyMHByb2ZpbGUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzcxMzI4Mjk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    categoryId: "identifiers",
    content: {
      description: "Personality defines how the AI communicates and behaves, including its tone, manner, and the characteristics that make it distinct. A consistent personality makes interactions more engaging and human.",
      designConsiderations: "### Personality Traits\n- Define clear personality dimensions\n- Maintain consistency across interactions\n- Align with brand and user expectations\n- Adapt appropriately to context",
       relatedPatterns: ["voice-and-tone", "name"],
      examples: [
        {
          image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
          description: "Claude's thoughtful, careful personality",
        },
        {
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
          description: "Replika's empathetic, supportive personality",
        },
      ],
    },
  },
];
