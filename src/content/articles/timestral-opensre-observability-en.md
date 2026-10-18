---
title: "Timestral and OpenSRE: adding an agent to my observability stack"
locale: "en"
articleSlug: "timestral-opensre-observability"
translationKey: "timestral-opensre-observability"
publishedAt: "2026-10-19"
label: "Experiment / Agentic SRE"
readTime: "9 min"
excerpt: "My data is already in ClickHouse. I connect Timestral to flag unusual behavior, then OpenSRE to start investigating. Here is what I am seeing on my applications and what I am keeping in my workflow."
seoTitle: "Timestral and OpenSRE: adding an agent to my observability stack"
seoDescription: "Testing Timestral forecasts and OpenSRE investigations with ClickHouse telemetry: initial observations, tool access, budgets, and the limits of my setup."
heroImage: "/blog/timestral-opensre-observability/cover.png"
heroImageAlt: "The engineer examines a chart and the results of his investigation."
---

I've just come across Timestral, Mistral's time series forecasting model, and I immediately want to connect it to my metrics. I already have ClickHouse in my observability stack, with data to feed it. The idea is fairly simple: see whether the model can highlight unusual behavior in my applications, then use an agent to start investigating.

In my previous workflow, I mostly got involved when someone reported a problem. Then I worked through the checks manually: fetch the data, find the service involved, check how it is deployed, and work out what is happening. I want to automate some of that work and look at my metrics more regularly.

So I'm adding two components to what I already have: Timestral for forecasts, and OpenSRE for the investigation. ClickHouse remains the telemetry source I already use.

This also relates to my freelance work: I'm currently helping a client with SRE agents. Testing what is available in open source lets me step outside that client's environment for a while, look at other approaches, and try them against my own applications. And, honestly, I want to see how far I can push this setup.

<figure class="explanatory-diagram">
  <a href="/blog/timestral-opensre-observability/workflow-en.svg" aria-label="Open the full-size diagram"><img src="/blog/timestral-opensre-observability/workflow-en.svg" alt="Applications feed ClickHouse, then Timestral and OpenSRE, with documentation, read-only tools, a report, and a human decision." width="720" height="1140" loading="lazy" decoding="async" /></a>
  <figcaption>The daily workflow connects forecasts to a consolidated investigation. OpenSRE also uses documentation and bounded tools to produce a report I can check.</figcaption>
</figure>

## What I give Timestral, and what it returns

A time series, here, is a sequence of measurements taken over time: request duration, server load, or the number of queued jobs. I give Timestral that history and the number of points I want it to forecast. It calculates the expected values for what comes next.

For example, with one measurement every five minutes, asking for six points means forecasting the next half hour. I can then compare that forecast with the six measurements actually collected. If the job queue grows much more than expected, I have something to look into.

The output contains several forecasts, called quantiles. The median gives the middle of the forecast distribution; lower and upper quantiles let me draw a band around it. The wider the band, the more spread out the forecast values are. That gives an indication of the model's uncertainty, which I still need to check against my data.

I use [Timestral-5M](https://huggingface.co/mistralai/Timestral-5M), which returns 21 quantiles per point. The model is pretrained: I can give it a new series directly, without a training phase specific to my application. Its Transformer architecture processes measurements in groups of points. The model family can also use multiple series together and additional variables; my first setup analyzes each metric separately. [The repository shows the API inputs and outputs](https://github.com/mistralai/timestral).

For my daily review, I retrieve forty-eight hours of measurements. The first day provides context, then I work through the second in thirty-minute windows. At each step, Timestral receives only the points preceding the window being evaluated. That lets me examine the previous day's deviations without giving it the answer in advance.

I keep increases that exceed the upper bound at the 99th percentile, with a deviation that is significant for the metric, for at least three five-minute intervals. That 99% refers to the forecast distribution of values. Assessing the incident comes later, using the other signals. For healthcheck success, a fixed rule is already enough to check for the expected result.

<figure class="explanatory-diagram">
  <a href="/blog/timestral-opensre-observability/forecast-en.svg" aria-label="Open the full-size diagram"><img src="/blog/timestral-opensre-observability/forecast-en.svg" alt="Illustrative thirty-minute forecast showing the median, quantile band, and observed measurements exceeding the upper bound." width="720" height="1060" loading="lazy" decoding="async" /></a>
  <figcaption>Illustrative data. Six measurements taken five minutes apart are compared with the forecast. Persistent, significant deviations above the upper bound provide a signal to examine alongside the other data.</figcaption>
</figure>

## A few reference points from existing tools

Time series forecasting already has pretrained models: [Google's TimesFM](https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/), [Amazon's Chronos](https://arxiv.org/abs/2403.07815), and [Salesforce's Moirai](https://www.salesforce.com/blog/moirai/), all introduced in 2024. They learn from many series so they can forecast how new data will evolve. Timestral joins this family of tools we can try on our own metrics.

Observability platforms have their own approaches too. [Dynatrace offers adaptive thresholds and seasonal baselines](https://docs.dynatrace.com/docs/discover-dynatrace/platform/davis-ai/anomaly-detection/concepts/anomaly-detection-configuration): these account for usual variations, such as a peak that returns during working hours. [Elastic combines approaches including time series decomposition and probabilistic models](https://www.elastic.co/guide/en/machine-learning/current/ml-ad-algorithms.html) to learn a baseline and score deviations from it.

These tools give me points of comparison for later. In this experiment, what interests me about Timestral is being able to fit it into my existing workflow, choose the series, and decide for myself what triggers an investigation. Comparing them on my incidents will take more experience with the setup.

## Connecting OpenSRE to the tools and documentation

Once a deviation has been flagged, [OpenSRE, the project from Tracer Cloud](https://github.com/Tracer-Cloud/opensre), takes over. It is the harness: the program that lets the language model work with tools, retrieves their responses, and continues the investigation. In my integration, the reasoning runs on Sol 6.1.

I give it access to four things: infrastructure documentation, ClickHouse queries, host status checks, and application healthchecks. Data access goes through [MCP ClickHouse](https://github.com/ClickHouse/mcp-clickhouse), with limits on query duration and volume.

The context explains which service runs where, how I deploy it, and which dependencies it uses. The runbooks provide useful checks. If a preview fails, the agent can find the relevant worker, inspect its job queue, and look for associated errors in ClickHouse. Those connections let it move from a hypothesis to a check.

This is a very familiar way of working. The [Effective Troubleshooting chapter of Google's SRE book](https://sre.google/sre-book/effective-troubleshooting/) describes that progression: observe, form hypotheses based on your knowledge of the system, then look for evidence that supports or rules them out. In my setup, tool calls and their results are recorded so I can review the path the agent took.

I'm also using this as an opportunity to fill gaps in the instrumentation. To understand an asynchronous process, I need its queue, its errors, and traces of its operations. An HTTP healthcheck verifies that the route responds; worker metrics show how the work is progressing. That is the combination of external and internal observation described in [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/), applied to a fairly concrete case.

## A first case on Media Review

Media Review is my application for listening back to my articles and commenting on videos I edit with an agent. Among other things, it prepares previews in the background. If that processing gets stuck, I can still open the interface, but I'm left waiting for my content.

In the test environment, a metric shows one failed job. OpenSRE then checks pending jobs, running jobs, and recent worker activity. The monitored queues remain empty, operations are succeeding, and the failed-job count stays unchanged. That points the investigation toward a failure already recorded; the worker is still doing its job.

The investigation also turns up a more interesting lead: fifteen database errors, fifteen failed transactions, and fifteen failed previews over the same period. Those three categories may describe the same operations. They need to be cross-checked before counting the same problem three times.

Some previews succeed during that period. So I focus the next steps on the path taken by the failing operations: find their traces, see where the error appears, and compare with a successful operation. I have a specific area to investigate, with the data already gathered.

<figure class="explanatory-diagram">
  <a href="/blog/timestral-opensre-observability/investigation-en.svg" aria-label="Open the full-size diagram"><img src="/blog/timestral-opensre-observability/investigation-en.svg" alt="Media Review investigation: a stable counter, ongoing activity, three counts of fifteen to cross-check, and traces to compare." width="720" height="1240" loading="lazy" decoding="async" /></a>
  <figcaption>The Media Review case: the three counts of fifteen may describe the same operations. The next step is to correlate the traces and compare a failed preview with a successful operation.</figcaption>
</figure>

On another application, which I'm keeping anonymous, the check picks up a different problem: the healthcheck returns HTTP 200, but ClickHouse returns no metrics, logs, or traces for that application over the hour examined. That gives me a place to start: check telemetry export so I can see what the worker is doing again.

These tests also reveal an adjustment I need to make. The daily review examines the previous day, while the agent's current tools can read at most the last hour. To explain a problem that occurred overnight, they need access to the relevant period. That is especially necessary when cross-checking healthcheck failures and increases in load observed during the same period.

## Triggers and budgets are part of the setup

I now have two entry points. Each day, Timestral analyzes the metrics, and the workflow launches a consolidated investigation with OpenSRE. Alongside that, a reader monitors the folder that receives email alerts. When a new, recognized alert is still recent and open, it can trigger an investigation directly.

Message handling follows deterministic rules. The model gets involved when it is time to investigate. Duplicates and reminders for an episode already handled are grouped or ignored, and a recovery message closes the episode. That avoids starting another investigation for every reminder.

The budget is explicit: an investigation gets up to 24 tool calls and fifteen minutes. The daily review allows two attempts, with only one needed when everything goes well. The alert path allows two additional investigations per day. That puts the ceiling at four automated attempts, including failures, and a lock prevents investigations from overlapping.

Those limits bound the work requested from the model. Token cost then depends on each investigation; I keep the results to assess what I get out of those calls. The agent works in read-only mode and gives me a report. Fixes and deployments remain under my control.

## Why I'm keeping this experiment

I admit I don't yet have numbers to compare resolution times before and after. Before, I mostly reacted to problems that were reported. Now I also have regular analysis of the metrics and an agent that starts gathering data when a signal deserves investigation. That makes my workflow more proactive, and it is already enough reason to keep going.

I expect to save time on troubleshooting, especially on the first checks I repeat for every incident. The next reports will help me see which checks are useful, where the agent goes in circles, and what context it is missing. I can then adjust the tools and budget based on cases I know.

What I'd like to try next is taking it as far as a PR: find the right repository, propose a fix, and test it against the observed problem. For now, I'm keeping this workflow in my toolkit and will continue running it on my applications. I already have preview errors to give it and historical data access to improve.

Thanks for taking the time to read this. You can find [my other articles on The Unreliable Engineer](https://theunreliable.engineer/en/blog/), including my series on managing OpenTelemetry agents.

If you're looking to make your telemetry more useful or bring an investigation agent into your team, my professional site describes [my work in observability and Agentic SRE](https://amineamanzou.fr/en/).

## Sources

References are linked throughout the text: Timestral, OpenSRE, and MCP ClickHouse documentation; the TimesFM, Chronos, and Moirai publications; Dynatrace and Elastic documentation; and chapters from Google's SRE book.

The observations and settings described here reflect my experiment on October 18, 2026. The other tools are mentioned to put the approaches in context; mentioning them does not constitute a performance comparison on my applications.
