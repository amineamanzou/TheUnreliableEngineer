---
title: "Who actually pays for generative AI in the enterprise?"
locale: "en"
articleSlug: "cout-ia-generative-entreprise"
translationKey: "generative-ai-enterprise-cost"
publishedAt: "2026-09-07"
label: "AI / FinOps"
readTime: "8 min"
excerpt: "Seats, tokens, context, evaluations and human rework: an AI bill becomes useful when it is attached to a completed unit of work."
seoTitle: "The real cost of generative AI in the enterprise"
seoDescription: "Calculate the full cost of generative AI across licenses, tokens, RAG, evaluations, human review and completed work."
heroImage: "/blog/cout-ia-generative-entreprise/hero-cost-ledger.svg"
heroImageAlt: "One completed task connected to access, usage, system and human-control costs"
---

Open three billing pages on the same morning. GitHub lists a per-user price for Copilot Business and Enterprise, then adds pooled usage credits and overage charges. OpenAI charges for input, cached input, and output tokens, with a cheaper Batch option when the answer can wait. AWS Bedrock presents a different map again: model inference, provisioned capacity, evaluations, knowledge bases, and guardrails can each produce their own line item.

They are all sold under the label “AI cost,” as if there were one obvious unit. There is not. A seat buys access. A token measures billable model work. A credit turns several activities into an internal currency. Provisioned capacity buys predictability. None of those objects tells you whether a useful piece of work was completed.

The first payer is easy to find: they receive the vendor invoice. The second appears later: the team turning an available model into a usable system. The third appears when the result is wrong, slow, impossible to audit, or simply ignored by the people who were supposed to use it.

### A seat buys access, not an outcome

As of August 30, 2026, [GitHub documents Copilot Business at $19 per user per month and Copilot Enterprise at $39](https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises). Each seat also contributes credits to a shared pool. Additional use can be charged after that pool is exhausted. Basic code suggestions and some features remain unlimited, while agents, models, and other interactions consume credits.

The bill already combines two models: a predictable subscription and variable consumption. A company may show 500 active licenses without knowing whether 40 people account for most usage, 200 seats are dormant, or the heaviest users are completing work that matters. Finance likes a per-seat number because it fits neatly into a column. It becomes misleading when it is mistaken for cost per job completed.

Reserved capacity creates a similar problem. [Azure separates pay-as-you-go usage from provisioned throughput units](https://azure.microsoft.com/en-us/pricing/details/azure-openai/): one tracks consumption, while the other reserves processing capacity for more predictable cost and performance. Buying that predictability may be entirely rational for a steady, critical service. For a pilot used for two hours on Friday, it is a tidy way to pay for empty space.

### Tokens measure the model, not the product

API billing looks more honest: input tokens multiplied by their rate, plus cached input and output. At least the formula is traceable. It is still incomplete.

One request may trigger web search, document retrieval, code execution, a second model judging the first, and two retries because the JSON schema was not respected. The visible unit price covers inference. The system pays for the whole chain.

Vendor documentation makes this shift concrete. [OpenAI advertises a 50% discount for Batch jobs completed within 24 hours](https://help.openai.com/en/articles/9197833-batch-api-faq.gz). That saving does not come from writing a cleverer prompt. It comes from an architecture decision: accepting that the answer is not immediate. On AWS, [guardrail evaluation can be billed in addition to model inference](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-how.html), and an output blocked after generation has already consumed model compute. Cost depends partly on when the system discovers that it does not want the answer it generated.

Two teams using the same model at the same token rates can land on very different bills. One sends a small context, reuses cache entries, and processes overnight. The other resends an 80,000-token conversation, demands low latency, and automatically retries every uncertain output. The model is identical. The bill mostly describes the decisions around it.

### The expensive part may generate no tokens at all

An enterprise application has to find the right documents, preserve access controls, remove stale versions, record decisions, and let someone investigate a disputed answer. That requires data ingestion, indexing, authorization, evaluations, monitoring, support, and a procedure for failure.

[AWS documents both automated and human model evaluations](https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation.html). The distinction matters. An automated judge consumes model compute. A human evaluation consumes the time of someone able to recognize a good answer in that domain. In banking, legal work, or platform engineering, that expertise can cost far more than the few cents spent on the request being evaluated.

Context has a cost too. The model does not know the latest internal procedure, the current service names, or the exception granted to a customer. Someone has to organize that information, decide what may leave the system, maintain connectors, and handle the documents the parser mangled. The acronym RAG compresses all this into three letters. The invoice expands it again, step by step.

The [2025 FinOps Framework](https://www.finops.org/wp-content/uploads/2025/05/English-FinOps-Framework-2025.pdf) emphasizes unit economics and shared accountability across engineering, finance, and business. Applied to generative AI, that prevents a team from tracking only a cloud budget. Spending has to connect to a unit of work the organization understands.

### The price page does not include the cost of a bad answer

Imagine an assistant summarizing 10,000 case files. The cost per summary may be tiny. If 15% are read in full because nobody trusts them, that review belongs in the system cost. If 2% contain an error serious enough to reopen the case, add the rework. If the team cannot recover the exact source behind an answer, add the investigation. If an incorrect answer reaches a customer, the discussion moves into another category.

This risk cost is not an argument to reject AI. It means an error rate is useful only when attached to a consequence. Misclassifying an internal ticket may cost a few minutes. An error in access control, a contract, or a production decision may cause an incident. Averaging those tasks together produces a polished number and a poor decision.

Teams often add human review. That can be the right choice, provided it is counted. “Human in the loop” is not a compliance sticker. You need to know who reviews the result, how long it takes, which errors they can actually detect, and what happens when they approve too quickly.

### A useful bill is attached to a unit of work

To leave the abstract debate behind, pick one bounded flow: handling a support ticket, preparing a brief, migrating a test, or classifying a document. For a few weeks, record five groups of data:

1. access, including seats, subscriptions, and reserved capacity;
2. usage, including tokens, tool calls, cache, retries, and models;
3. system costs, including storage, retrieval, evaluation, security, and observability;
4. human work, including data preparation, review, correction, and support;
5. consequences, including completed volume, elapsed time, rework, and errors reaching the user.

Now the team can calculate cost per completed case or accepted change, using a distribution instead of a lonely average. The high percentile shows cases exploding because of huge context or six retries. Unused seats expose access waste. Human-review rates show how much autonomy the system actually has.

The resulting decisions are more precise. Move work to a batch queue. Use a smaller model for classification. Cache stable context. Remove inactive licenses. Or accept a more expensive model because it sharply reduces human rework. The vendor is no longer the only lever.

The first total on the invoice will remain the one sent by the cloud provider or software vendor. The number that supports a decision comes later: full-flow cost divided by a completed unit of work, with human time and risk visible. Until that second bill exists, the company knows what it spends to call AI. It does not yet know what it pays to get an outcome.

## Sources

- [GitHub Docs — billing for Copilot in organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises)
- [OpenAI — Batch API FAQ](https://help.openai.com/en/articles/9197833-batch-api-faq.gz)
- [AWS — Amazon Bedrock pricing](https://aws.amazon.com/bedrock/pricing/)
- [AWS — How Bedrock Guardrails works](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-how.html)
- [AWS — Model evaluation](https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation.html)
- [Azure OpenAI pricing](https://azure.microsoft.com/en-us/pricing/details/azure-openai/)
- [FinOps Foundation — FinOps Framework 2025](https://www.finops.org/wp-content/uploads/2025/05/English-FinOps-Framework-2025.pdf)
