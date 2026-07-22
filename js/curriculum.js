
/* ============================================================
   AI ATLAS — Topic content
   Injects a short, topic-related content card ABOVE each
   interaction. On tabbed pages every tab gets its own card
   (rendered inside that tab's panel, so it swaps with the tab).
   On single-interaction pages one card sits under the header.
   No HTML edits needed — everything mounts by page + panel id.
   ============================================================ */
(function () {
  'use strict';

  // page -> { color, mode:'tabs'|'single', panels:{ id:{...} } | card:{...} }
  // card = { tag, title, lead, pts:[ [term, desc] ] }
  const TOPICS = {

    /* 1 ── Foundations ── */
    'foundations': { color: '#8B8CF6', mode: 'tabs', panels: {
      flow: { tag: 'process · 6 stages', title: 'The AI workflow pipeline', lead: 'Every project — churn prediction, a chatbot, a vision model — runs this same loop. Step through each stage below to see what actually happens.', pts: [
        ['Problem definition', 'frame the task and the metric before any code.'],
        ['Data → model → evaluation', 'the core build loop you repeat.'],
        ['Deployment & monitoring', 'ship it, then watch it drift.'],
        ['Responsible AI', 'bias, fairness and privacy at every stage.'],
      ]},
      time: { tag: 'history · 4 eras', title: 'What AI is, and how it got here', lead: 'AI didn’t arrive fully formed. Scrub the timeline below to trace four eras — each absorbing the last, each with less hand-coding and more learning.', pts: [
        ['Narrow vs. general AI', 'today’s task-specific models vs. the hypothetical general one.'],
        ['Symbolic → statistical', 'hand-written rules gave way to learning from data.'],
        ['Deep → generative', 'networks that learn features, then ones that create.'],
        ['Types of AI', 'reactive, limited-memory, and beyond.'],
      ]},
    }},

    /* 2 ── Mathematics ── */
    'mathematics': { color: '#34D399', mode: 'tabs', panels: {
      vec: { tag: 'linear algebra', title: 'Vectors — the language of data', lead: 'Every data point is a vector, and models constantly ask how two of them relate. Drag the handles below and watch the dot product flip sign as the angle passes 90°.', pts: [
        ['Vectors & matrices', 'data points and the operations that move them.'],
        ['Dot product & angle', 'how similar two vectors are.'],
        ['Magnitude (norm)', 'a vector’s length.'],
      ]},
      grad: { tag: 'calculus · optimization', title: 'Gradient descent', lead: 'Training is rolling downhill on an error surface. Drop the ball below, then add momentum to escape a ravine or a local minimum.', pts: [
        ['Derivatives & gradients', 'the direction of steepest descent.'],
        ['Learning rate', 'step size — overshoot vs. crawl.'],
        ['Momentum', 'carry velocity through ravines.'],
        ['Convex vs. non-convex', 'one valley vs. a landscape of them.'],
      ]},
      mat: { tag: 'linear algebra', title: 'Matrices bend space', lead: 'A matrix is a function that transforms space. Move the a, b, c, d sliders below and watch the grid and unit square rotate, scale, shear and flip.', pts: [
        ['Matrix as transform', 'rotate, scale, shear, reflect.'],
        ['Determinant', 'how much area scales — negative flips space.'],
        ['Eigenvectors', 'directions that don’t change orientation.'],
        ['PCA intuition', 'the axes data varies along most.'],
      ]},
      prob: { tag: 'probability · statistics', title: 'Distributions & uncertainty', lead: 'Reasoning under uncertainty. Slide μ and σ below to reshape the normal curve and see the 68–95–99.7 empirical rule appear.', pts: [
        ['Distributions', 'how outcomes spread out.'],
        ['Mean & variance', 'center and spread.'],
        ['Empirical rule', '68 / 95 / 99.7% within 1 / 2 / 3σ.'],
        ['Cross-entropy', 'the loss information theory hands to ML.'],
      ]},
    }},

    /* 3 ── Data Analysis ── */
    'data-analysis': { color: '#2EC4DE', mode: 'tabs', panels: {
      sql: { tag: 'sql explorer', title: 'Query the data', lead: 'Ask a table a question. Edit the query below and run it against a live orders dataset — the result auto-charts itself.', pts: [
        ['SELECT / WHERE / ORDER BY', 'pick, filter, sort rows.'],
        ['GROUP BY & aggregates', 'SUM, AVG, COUNT over buckets.'],
        ['Joins', 'combine tables on a shared key.'],
        ['SQL for data science', 'push work to the database.'],
      ]},
      dash: { tag: 'bi dashboard', title: 'Dashboards that cross-filter', lead: 'Turn queries into a picture. Click a region below and watch every KPI and chart update in real time.', pts: [
        ['KPIs', 'the headline numbers that matter.'],
        ['Cross-filtering', 'one click, every view responds.'],
        ['Chart choice', 'the right encoding for the question.'],
        ['EDA', 'distributions, correlation, outliers.'],
      ]},
    }},

    /* 5 ── Machine Learning ── */
    'machine-learning': { color: '#22D3EE', mode: 'tabs', panels: {
      reg: { tag: 'supervised · regression', title: 'Fit a curve to points', lead: 'Predict a continuous number. Raise the polynomial degree below until R² climbs and the curve snakes through every point — that’s overfitting.', pts: [
        ['Linear → polynomial', 'straight lines to bendy curves.'],
        ['Ridge / Lasso', 'regularisation to fight overfitting.'],
        ['MSE / RMSE / R²', 'how far off, on average.'],
        ['Model selection', 'cross-validation & the bias–variance tradeoff.'],
      ]},
      km: { tag: 'unsupervised · clustering', title: 'Find groups without labels', lead: 'Step K-Means below: assign each point to its nearest centroid, move each centroid to the mean of its members, repeat until nothing moves.', pts: [
        ['K-Means', 'assign, then update centroids.'],
        ['Choosing k', 'elbow method & silhouette score.'],
        ['Hierarchical & DBSCAN', 'trees of clusters; density shapes.'],
        ['Dimensionality reduction', 'PCA / t-SNE to visualise clusters.'],
      ]},
      cls: { tag: 'supervised · classification', title: 'Draw a decision boundary', lead: 'Predict a discrete label. Place points near the border below and watch precision and recall move in the confusion matrix.', pts: [
        ['Logistic regression', 'one straight boundary.'],
        ['k-NN', 'a jagged boundary hugging the points.'],
        ['Precision / recall / F1', 'beyond raw accuracy.'],
        ['Confusion matrix', 'TP, FP, FN, TN.'],
      ]},
      tree: { tag: 'ensembles', title: 'Many weak models, one strong one', lead: 'Add trees to the forest below and watch the blocky, overfit boundary of a single tree smooth into a stable one.', pts: [
        ['Decision tree', 'blocky, axis-aligned cuts.'],
        ['Bagging (Random Forest)', 'average many bootstrap trees.'],
        ['Boosting (XGBoost)', 'each model fixes the last one’s errors.'],
        ['Voting & stacking', 'combine diverse models.'],
      ]},
    }},

    /* 6 ── Deep Learning ── */
    'deep-learning': { color: '#6366F1', mode: 'tabs', panels: {
      nn: { tag: 'fundamentals', title: 'A network, trained by backprop', lead: 'A stack of weighted sums and non-linearities. Watch activations light up on the forward pass and gradients flow backward below.', pts: [
        ['Perceptron → MLP', 'one neuron to many layers.'],
        ['Activations', 'ReLU, sigmoid, softmax, GELU.'],
        ['Forward & backprop', 'predict, then assign blame.'],
        ['Loss & optimizers', 'cross-entropy, SGD, Adam.'],
      ]},
      cnn: { tag: 'vision', title: 'Convolutions scan for patterns', lead: 'Weight-sharing filters slide across an image to detect edges, textures and shapes. Watch a kernel convolve across the input below.', pts: [
        ['Convolution & pooling', 'local features, then downsample.'],
        ['Stride & padding', 'how the filter moves and fits.'],
        ['ResNet, EfficientNet', 'the architectures that made depth work.'],
        ['Transfer learning', 'reuse a pretrained backbone.'],
      ]},
      seq: { tag: 'sequence', title: 'Networks with memory', lead: 'Recurrent networks carry state across an ordered sequence. See how information persists — and where it fades — below.', pts: [
        ['RNN, LSTM, GRU', 'gated cells that carry state.'],
        ['Vanishing gradients', 'why gates were needed.'],
        ['Seq2seq', 'encode one sequence, decode another.'],
        ['Applications', 'time series and text.'],
      ]},
      gen: { tag: 'generative', title: 'Networks that create', lead: 'Instead of labelling data, these produce it. Explore how an autoencoder compresses and a GAN learns to forge below.', pts: [
        ['Autoencoders & VAEs', 'compress, then reconstruct or sample.'],
        ['GANs', 'generator vs. discriminator arms race.'],
        ['Mode collapse', 'the classic GAN failure.'],
        ['Diffusion', 'denoise pure noise into images.'],
      ]},
    }},

    /* 7 ── Language & Generation (NLP) ── */
    'nlp': { color: '#A855F7', mode: 'tabs', panels: {
      tok: { tag: 'nlp basics', title: 'Text becomes token IDs', lead: 'A model can’t read letters — only token IDs. Type below and watch a subword tokenizer keep common words whole and split rare ones.', pts: [
        ['Subword tokens', 'common words whole, rare ones split (##).'],
        ['Token IDs → embeddings', 'each token maps to a vector row.'],
        ['~4 chars per token', 'why context is counted in tokens.'],
        ['Cost & limits', 'tokens, not words, fill the window.'],
      ]},
      tfidf: { tag: 'representation', title: 'Weighing words by signal', lead: 'Not all words matter equally. Pick a document below and watch ubiquitous words score near zero while distinctive ones rise.', pts: [
        ['Term frequency', 'rewards words frequent in this doc.'],
        ['Inverse document frequency', 'punishes words that appear everywhere.'],
        ['Stop words', 'the, a, of — no signal.'],
        ['Classic search', 'how relevance was ranked pre-neural.'],
      ]},
      samp: { tag: 'text generation', title: 'Sampling the next token', lead: 'Generation draws from a probability distribution over the vocabulary. Turn the temperature dial below to go from greedy to chaotic.', pts: [
        ['Softmax', 'probabilities over every next token.'],
        ['Temperature', 'sharpen (low) or flatten (high).'],
        ['Greedy / beam / nucleus', 'decoding strategies.'],
        ['Same model, different output', 'only the sampling changed.'],
      ]},
    }},

    /* 8 ── Transformers & LLMs ── */
    'transformers': { color: '#A855F7', mode: 'tabs', panels: {
      attn: { tag: 'architecture', title: 'Self-attention', lead: 'Every token looks at every other and decides what to focus on. Hover the tokens below to see the attention weights connecting them.', pts: [
        ['Self-attention', 'query · key similarity, weighted values.'],
        ['Multi-head', 'several attention patterns in parallel.'],
        ['Positional encoding', 'order without recurrence (RoPE).'],
        ['Residuals & layer norm', 'what makes deep stacks trainable.'],
      ]},
      tok: { tag: 'tokenization', title: 'From text to tokens', lead: 'The transformer’s first step: split text into subword tokens and map each to an embedding. Type below to see it happen.', pts: [
        ['Subword tokenization', 'common words whole, rare ones split.'],
        ['Vocabulary & IDs', 'each token indexes the embedding table.'],
        ['~4 chars per token', 'the rule of thumb for English.'],
      ]},
      next: { tag: 'generation', title: 'Next-token prediction', lead: 'A language model is a next-token predictor. Enter a prompt below and watch the probability distribution over what comes next.', pts: [
        ['Softmax over vocab', 'a probability for every token.'],
        ['Temperature', 'sharpen or flatten the choices.'],
        ['Sampling', 'greedy, beam, nucleus.'],
        ['Emergence', 'scale unlocks new abilities.'],
      ]},
      rag: { tag: 'retrieval', title: 'RAG & embeddings', lead: 'Give the model a search engine. Embed a query below and retrieve the nearest documents by cosine similarity, then generate a grounded answer.', pts: [
        ['Embeddings', 'text as vectors that cluster by meaning.'],
        ['Vector DB', 'FAISS, Pinecone, Chroma, Weaviate.'],
        ['Chunk & retrieve', 'split docs, fetch the nearest.'],
        ['Re-ranking', 'grounded, cited answers.'],
      ]},
    }},

    /* 9 ── LLM & Agents Lab ── */
    'llm-agents': { color: '#818CF8', mode: 'tabs', panels: {
      build: { tag: 'build', title: 'An LLM, end to end', lead: 'Assemble the pieces of a large language model below — from data and tokenizer to the decoder-only transformer stack.', pts: [
        ['Pre-training', 'next-token prediction on a huge corpus.'],
        ['Architecture', 'a decoder-only transformer.'],
        ['Scaling laws', 'balance data, parameters and compute.'],
        ['Instruction tuning', 'teach it to follow prompts.'],
      ]},
      local: { tag: 'inference', title: 'Fit it on your GPU', lead: 'A model must fit in VRAM to run. Size a model to your hardware below and watch quantization shrink its footprint.', pts: [
        ['Parameters × precision', 'the memory equation.'],
        ['Quantization', 'INT8, INT4, GGUF.'],
        ['KV cache', 'memory grows with context length.'],
        ['Local runtimes', 'llama.cpp, Ollama, vLLM.'],
      ]},
      agent: { tag: 'agents', title: 'An LLM in a loop', lead: 'Agents wrap a model with tools and memory. Wire one up below and watch it plan, act, observe and repeat.', pts: [
        ['Plan → act → observe', 'the agent control loop.'],
        ['Tool use', 'function calling — code, APIs, search.'],
        ['Memory', 'context window + vector DB.'],
        ['Multi-agent', 'agents that collaborate.'],
      ]},
      tune: { tag: 'fine-tuning', title: 'Fine-tune & LoRA', lead: 'Adapt a base model cheaply. Below, see how LoRA injects a few trainable weights instead of retraining the whole network.', pts: [
        ['Full fine-tune vs. PEFT', 'all weights vs. a few.'],
        ['LoRA / QLoRA', 'low-rank adapters, quantised.'],
        ['RLHF & DPO', 'align to human preferences.'],
        ['Fine-tune vs. RAG', 'teach style vs. supply facts.'],
      ]},
    }},

    /* 13 ── Code & Stack ── */
    'programming': { color: '#F59E0B', mode: 'tabs', panels: {
      lang: { tag: 'python for ai', title: 'Learn & run', lead: 'The lingua franca of ML, running live below. Write and execute Python (and R, Go) right in the browser.', pts: [
        ['Core Python', 'OOP and functional style.'],
        ['NumPy & Pandas', 'vectorised data, no loops.'],
        ['scikit-learn', 'the classic ML toolkit.'],
        ['Notebooks', 'the everyday ML workflow.'],
      ]},
      libs: { tag: 'frameworks', title: 'The deep-learning stack', lead: 'From NumPy arrays to PyTorch tensors on a GPU. Compare the layers of the stack below.', pts: [
        ['PyTorch', 'tensors, autograd, nn.Module.'],
        ['TensorFlow / Keras', 'the model API.'],
        ['JAX / Flax', 'functional, XLA-compiled.'],
        ['MLOps tools', 'W&B, MLflow, Docker.'],
      ]},
      db: { tag: 'data stores', title: 'SQL vs. NoSQL', lead: 'Pick the right store for the job. Compare the relational and document models below.', pts: [
        ['SQL', 'rows, joins, ACID guarantees.'],
        ['NoSQL', 'document, key-value, graph.'],
        ['When to use which', 'structure vs. flexibility.'],
        ['Vector DBs', 'for embeddings & RAG.'],
      ]},
    }},

    /* 10 ── Generative AI (single) ── */
    'generative': { color: '#FB7185', mode: 'single', card: {
      tag: 'diffusion', title: 'Denoising into an image', lead: 'Diffusion models start from pure noise and remove a little at each step until an image emerges. Scrub the denoiser below to watch it happen.', pts: [
        ['Forward vs. reverse', 'add noise vs. learn to remove it.'],
        ['Guidance & prompts', 'steer what the image becomes.'],
        ['Latent space', 'diffuse in a compressed space.'],
        ['Image models', 'Stable Diffusion, DALL·E, ControlNet.'],
        ['Beyond images', 'audio (Whisper), video (Sora), multimodal.'],
        ['Applications', 'content, synthetic data, code, science.'],
      ]},
    },

    /* 11 ── Explainable AI (single) ── */
    'xai': { color: '#F59E0B', mode: 'single', card: {
      tag: 'interpretability', title: 'Attributing a decision', lead: 'SHAP splits a prediction fairly across its features. Toggle each applicant feature below and watch its attribution push the loan decision up or down from the baseline.', pts: [
        ['SHAP', 'game-theory Shapley values that sum to the output.'],
        ['LIME', 'a simple local model around one prediction.'],
        ['Feature importance & PDPs', 'what mattered, and how it bends the output.'],
        ['Attention & attribution', 'what a transformer looked at.'],
        ['Fairness auditing', 'Fairlearn, AIF360, equalized odds.'],
        ['XAI for LLMs', 'logit lens, circuits, sparse autoencoders.'],
      ]},
    },

    /* 14 ── ETL & Data Engineering (single) ── */
    'etl': { color: '#22D3EE', mode: 'single', card: {
      tag: 'pipelines', title: 'ETL as a DAG', lead: 'Extract → Transform → Load, wired as a directed acyclic graph. Press run below and watch records stream through each node like Airflow.', pts: [
        ['Ingestion', 'batch vs. streaming; APIs & Kafka.'],
        ['Transformation', 'clean, join, dedupe with dbt / Spark.'],
        ['Orchestration', 'Airflow, Prefect, Dagster.'],
        ['Big data', 'Spark & Dask when it won’t fit on one box.'],
        ['Warehouse & lake', 'Snowflake, BigQuery, Delta Lake.'],
        ['Feature stores', 'Feast, Tecton — offline & online.'],
      ]},
    },

    /* 15 ── MLOps (single) ── */
    'mlops': { color: '#34D399', mode: 'single', card: {
      tag: 'operations', title: 'Ship it, then watch it', lead: 'Models decay silently as the world shifts. Watch the monitor below flag when live data drifts away from what the model trained on.', pts: [
        ['Data / concept / label drift', 'the world moves; the model doesn’t.'],
        ['Experiment tracking', 'MLflow, W&B, model registry.'],
        ['Deployment', 'shadow, canary, A/B rollouts.'],
        ['Training at scale', 'data/model parallel, DeepSpeed, FSDP.'],
        ['CI/CD for ML', 'automated retraining triggers.'],
        ['Governance', 'model cards, lineage, audit trails.'],
      ]},
    },

    /* 12 ── Systems & Research (single) ── */
    'research': { color: '#8B8CF6', mode: 'single', card: {
      tag: 'methodology', title: 'Telling signal from noise', lead: 'The statistical tools that separate a real result from luck. Explore bias–variance, cross-validation and bootstrap uncertainty below.', pts: [
        ['Bias–variance tradeoff', 'under- vs. over-fitting.'],
        ['Cross-validation', 'honest performance estimates.'],
        ['Bootstrap', 'uncertainty from resampling.'],
        ['Benchmarks & ablations', 'GLUE, MMLU; remove a piece to prove it matters.'],
        ['Scaling laws', 'Chinchilla, MoE, distillation.'],
        ['Safety & alignment', 'red-teaming, interpretability, governance.'],
      ]},
    },

    /* 16 ── Computer Vision ── */
    'cv': { color: '#22D3EE', mode: 'tabs', panels: {
      conv: { tag: 'convolutions', title: 'Sliding a kernel over pixels', lead: 'A convolution multiplies a small weight matrix across every neighbourhood of an image to build a feature map. Pick a kernel below and watch edges, blur or sharpening appear.', pts: [
        ['Kernels & feature maps', 'learned filters that detect structure.'],
        ['Stride, padding, pooling', 'how the filter moves and downsamples.'],
        ['CNN architectures', 'LeNet, AlexNet, VGG, ResNet, EfficientNet.'],
        ['Transfer learning', 'reuse a pretrained backbone.'],
      ]},
      detect: { tag: 'object detection', title: 'Localise and classify', lead: 'Detection draws a box around each object and labels it. Drag the prediction box below until its IoU with ground truth snaps high.', pts: [
        ['One- vs two-stage', 'YOLO/SSD speed vs R-CNN accuracy.'],
        ['Anchors & NMS', 'prior boxes; suppress duplicates.'],
        ['IoU', 'intersection over union.'],
        ['mAP', 'the COCO benchmark metric.'],
      ]},
      segment: { tag: 'segmentation', title: 'Label every pixel', lead: 'Segmentation classifies each pixel, not just a box. Threshold the image below into masks, then read how ViTs treat patches as tokens.', pts: [
        ['Semantic / instance / panoptic', 'class map, per-object, both.'],
        ['U-Net, Mask R-CNN, DeepLab', 'the segmenters.'],
        ['Vision Transformers', 'patches → tokens → attention.'],
        ['DETR & SAM', 'transformer detection; promptable masks.'],
      ]},
    }},

    /* 17 ── Reinforcement Learning ── */
    'rl': { color: '#FB7185', mode: 'tabs', panels: {
      mdp: { tag: 'mdp · value iteration', title: 'Learning from reward', lead: 'An agent acts in a world of states and rewards. Run value iteration below and watch a policy of arrows fall out of the Bellman equation.', pts: [
        ['MDP', 'states, actions, rewards, transitions, γ.'],
        ['Policy, V and Q', 'strategy and expected returns.'],
        ['Bellman equation', 'value = best action + discounted future.'],
        ['Model-based vs free', 'know the world vs learn it.'],
      ]},
      bandit: { tag: 'explore vs exploit', title: 'The multi-armed bandit', lead: 'The simplest RL problem: which arm to pull? Auto-play the ε-greedy policy below and watch estimates converge on the true win rates.', pts: [
        ['Explore vs exploit', 'try new vs use the best.'],
        ['ε-greedy', 'random with probability ε.'],
        ['UCB & Thompson', 'smarter exploration.'],
        ['Regret', 'the cost of not being optimal.'],
      ]},
      qlearn: { tag: 'model-free', title: 'Q-learning from scratch', lead: 'No map — just trial and error. Train the agent below over episodes and watch Q-values and a good path emerge.', pts: [
        ['TD learning', 'bootstrap from the next guess.'],
        ['Q-learning vs SARSA', 'off- vs on-policy.'],
        ['DQN', 'neural Q + replay + target net.'],
        ['Policy gradients', 'REINFORCE, A2C, PPO, RLHF.'],
      ]},
    }},

    /* 18 ── Time Series ── */
    'timeseries': { color: '#34D399', mode: 'tabs', panels: {
      decomp: { tag: 'decomposition', title: 'Pull a series apart', lead: 'Observed = trend + seasonality + residual. Move the sliders below and watch a series split into its three components.', pts: [
        ['Trend & seasonality', 'drift and repetition.'],
        ['Additive vs multiplicative', 'sum vs product of parts.'],
        ['Stationarity', 'stable mean and variance.'],
        ['ACF / PACF', 'autocorrelation at lags.'],
      ]},
      smooth: { tag: 'smoothing', title: 'Taming the noise', lead: 'Trade responsiveness for stability. Compare a moving average and an exponential smoother below as you tune the window and α.', pts: [
        ['Moving average', 'equal-weight window.'],
        ['Exponential smoothing', 'decay-weighted (Holt-Winters).'],
        ['Differencing', 'remove trend for stationarity.'],
        ['Rolling statistics', 'windowed mean and variance.'],
      ]},
      forecast: { tag: 'forecasting', title: 'Projecting forward', lead: 'Extend the series into the future with a confidence band that honestly widens with the horizon. Tune H below.', pts: [
        ['Baselines', 'naive, seasonal-naive, drift, mean.'],
        ['ARIMA / ETS', 'classical statistical models.'],
        ['Prophet & ML', 'lag features, LSTM, TFT.'],
        ['Backtesting', 'rolling-origin; MAE/RMSE/MAPE.'],
      ]},
    }},

    /* 19 ── Prompt Engineering ── */
    'prompting': { color: '#A855F7', mode: 'tabs', panels: {
      anatomy: { tag: 'prompt design', title: 'The parts of a prompt', lead: 'Role, context, instruction, constraints, examples, format. Build a prompt below and watch a quality score climb as the parts appear.', pts: [
        ['Role & context', 'set expertise and background.'],
        ['Instruction & constraints', 'the task and its limits.'],
        ['Examples', 'demonstrate the pattern.'],
        ['Output format & delimiters', 'shape and fencing.'],
      ]},
      shots: { tag: 'reasoning', title: 'Zero-shot to chain-of-thought', lead: 'The same task gets more reliable as you add examples and ask for step-by-step reasoning. Toggle the modes below.', pts: [
        ['Zero-shot', 'just ask.'],
        ['Few-shot (ICL)', 'show worked examples.'],
        ['Chain-of-thought', 'reason before answering.'],
        ['ReAct & self-consistency', 'act with tools; vote over chains.'],
      ]},
      structured: { tag: 'structured output', title: 'Output you can parse', lead: 'When code consumes the answer, demand a schema. Pick a format below and validate the JSON live.', pts: [
        ['JSON & schemas', 'a parseable shape.'],
        ['Function/tool calling', 'API-enforced arguments.'],
        ['Grounding (RAG)', 'answer only from context, cite.'],
        ['Prompt injection', 'the key safety risk.'],
      ]},
    }},

    /* 20 ── AI Ethics & Safety ── */
    'ethics': { color: '#F59E0B', mode: 'tabs', panels: {
      fair: { tag: 'fairness', title: 'When fairness metrics collide', lead: 'Tune two groups’ thresholds below and watch demographic parity, equal opportunity and equalized odds fight each other — you can’t satisfy them all.', pts: [
        ['Sources of bias', 'historical, representation, measurement.'],
        ['Fairness definitions', 'parity, equal opportunity, odds, calibration.'],
        ['Impossibility', 'they conflict when base rates differ.'],
        ['Mitigation', 'pre-, in-, post-processing; Fairlearn, AIF360.'],
      ]},
      align: { tag: 'safety', title: 'Defence in depth', lead: 'No single guardrail is enough. Stack safety layers below and see how many risky requests still slip through.', pts: [
        ['Alignment problem', 'do what we truly want.'],
        ['RLHF / DPO / Constitutional AI', 'shape behaviour.'],
        ['Red-teaming & jailbreaks', 'attack before shipping.'],
        ['Hallucination & guardrails', 'filter and verify.'],
      ]},
      govern: { tag: 'governance', title: 'Responsible release', lead: 'Can you show the model is safe to deploy? Check the practices below and build a readiness score, then meet the frameworks.', pts: [
        ['Privacy', 'PII, differential privacy, federated learning.'],
        ['Documentation', 'model cards, datasheets, lineage.'],
        ['Human oversight', 'accountability for decisions.'],
        ['Regulation', 'EU AI Act, NIST AI RMF, GDPR.'],
      ]},
    }},
  };

  function cardHTML(color, c) {
    const pts = c.pts.map(([t, d]) => `<div class="tc-pt"><b>${t}</b> — ${d}</div>`).join('');
    return `<div class="topic-card" style="--c:${color}">
      <span class="tc-eyebrow">${c.tag}</span>
      <h3>${c.title}</h3>
      <p class="tc-lead">${c.lead}</p>
      <div class="tc-pts">${pts}</div>
    </div>`;
  }

  function init() {
    const page = document.body.dataset.page || '';
    const T = TOPICS[page];
    if (!T) return;

    if (T.mode === 'tabs') {
      Object.entries(T.panels).forEach(([id, c]) => {
        const panel = document.getElementById('panel-' + id);
        if (!panel || panel.querySelector(':scope > .topic-card')) return;
        panel.insertAdjacentHTML('afterbegin', cardHTML(T.color, c));
      });
    } else if (T.mode === 'single') {
      const head = document.querySelector('.page-head');
      if (head && !head.parentElement.querySelector('.topic-card')) {
        head.insertAdjacentHTML('afterend', cardHTML(T.color, T.card));
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
