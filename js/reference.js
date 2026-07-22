/* ============================================================
   AI ATLAS — Deep reference layer
   ------------------------------------------------------------
   Appends a comprehensive, collapsible "Full reference" section
   to the bottom of each module's .page. Pure content — every
   subtopic for a module lives here so nothing is missing, even
   what the interactive playgrounds don't cover. Keyed by the
   page id (<body data-page="...">). Self-styling; no CSS edits.
   ============================================================ */
(function () {
  'use strict';

  // section = { h, p:[...], terms:[[t,d]], table:{cols:[],rows:[[]]}, eqn }
  const REF = {

    /* ───────────────────────── Foundations ───────────────────────── */
    'foundations': { color: '#8B8CF6', lead: 'What artificial intelligence is, the shape of every project, and how the field arrived here.', sections: [
      { h: 'What AI actually is', p: ['Artificial intelligence is the study of systems that perform tasks we associate with intelligence — perception, reasoning, language, decision-making. Machine learning is the dominant sub-field: rather than hand-coding rules, we fit a model to data so it generalises to new cases. Deep learning is ML with many-layered neural networks that learn their own features.'],
        terms: [['Narrow AI', 'task-specific systems — every deployed model today.'], ['General AI (AGI)', 'hypothetical human-level breadth; not yet achieved.'], ['ML vs rules', 'learn patterns from data vs encode logic by hand.'], ['Symbolic vs connectionist', 'logic/knowledge vs learned weights.']] },
      { h: 'Types of machine learning', terms: [['Supervised', 'labelled data → predict a target (classification, regression).'], ['Unsupervised', 'no labels → find structure (clustering, dimensionality reduction).'], ['Self-supervised', 'labels derived from the data itself — how LLMs pre-train.'], ['Reinforcement', 'learn from reward through interaction.'], ['Semi-/weakly-supervised', 'a little labelled data plus lots of unlabelled.']] },
      { h: 'The project lifecycle', p: ['Every project runs the same loop: frame the problem and metric, gather and clean data, model, evaluate on held-out data, deploy, then monitor — feeding drift back into the next iteration.'],
        table: { cols: ['Stage', 'Question it answers'], rows: [['Problem definition', 'What decision are we improving, measured how?'], ['Data', 'What raw material, how labelled and split?'], ['Modelling', 'Which family, trained how?'], ['Evaluation', 'Does it work on unseen data, fairly?'], ['Deployment', 'How does it reach users safely?'], ['Monitoring', 'Is it still working as the world shifts?']] } },
      { h: 'Responsible AI from day one', p: ['Fairness, transparency, privacy and accountability are not a final checkbox — bias can enter at every stage. Data can be unrepresentative, labels can encode prejudice, and deployment can create feedback loops. See the Ethics & Safety module for the full treatment.'] },
      { h: 'A short history', terms: [['1956 Symbolic AI', 'Dartmouth workshop; logic, expert systems, ELIZA.'], ['1990s Statistical ML', 'SVMs, decision trees, learning from data.'], ['2012 Deep learning', 'AlexNet wins ImageNet; representation learning.'], ['2017 Transformers', '"Attention Is All You Need" reshapes NLP.'], ['2020s Generative AI', 'GPT, diffusion, multimodal models at scale.']] },
    ]},

    /* ───────────────────────── Mathematics ───────────────────────── */
    'mathematics': { color: '#34D399', lead: 'The linear algebra, calculus, probability and statistics under every model.', sections: [
      { h: 'Linear algebra', p: ['Data lives in vector spaces. A vector is a point/direction; a matrix is a linear map that rotates, scales, shears or projects space.'],
        terms: [['Dot product', 'a·b = Σaᵢbᵢ = |a||b|cosθ — similarity & projection.'], ['Norm', 'vector length; L1 (sum of |·|), L2 (Euclidean).'], ['Matrix multiply', 'compose linear maps; the workhorse of nets.'], ['Determinant', 'signed volume scaling; 0 ⇒ singular.'], ['Eigenvectors/values', 'directions unchanged in orientation; basis of PCA.'], ['SVD', 'factor any matrix into rotate·scale·rotate.']] },
      { h: 'Calculus & optimization', p: ['Training minimises a loss by following the negative gradient downhill. The gradient is the vector of partial derivatives; the chain rule (backpropagation) computes it through a deep network.'],
        terms: [['Derivative/gradient', 'direction & rate of steepest increase.'], ['Chain rule', 'differentiate compositions — powers backprop.'], ['Learning rate', 'step size; too big diverges, too small crawls.'], ['Convex vs non-convex', 'single global min vs many local minima.'], ['Momentum/Adam', 'accelerate and adapt the step.']] },
      { h: 'Probability', terms: [['Random variable', 'a quantity with a distribution.'], ['Distributions', 'Bernoulli, Binomial, Normal, Poisson, Uniform.'], ['Bayes\' theorem', 'P(A|B)=P(B|A)P(A)/P(B) — update beliefs.'], ['Expectation/variance', 'mean and spread.'], ['MLE/MAP', 'fit parameters by maximising likelihood (± prior).']] },
      { h: 'Statistics & information', p: ['Statistics turns data into honest conclusions; information theory hands ML its loss functions.'],
        terms: [['Empirical rule', '68/95/99.7% within 1/2/3σ of a normal.'], ['Central limit theorem', 'sums tend to normal.'], ['Entropy', 'expected surprise of a distribution.'], ['Cross-entropy', 'the standard classification loss.'], ['KL divergence', 'distance between two distributions.']] },
    ]},

    /* ───────────────────────── Data Analysis ───────────────────────── */
    'data-analysis': { color: '#2EC4DE', lead: 'Getting, querying, and understanding data before any model is trained.', sections: [
      { h: 'SQL — the query language', p: ['SQL asks tabular data questions declaratively. The logical order of a query is FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT, even though you write SELECT first.'],
        terms: [['SELECT/WHERE', 'pick columns, filter rows.'], ['GROUP BY + aggregates', 'SUM, AVG, COUNT, MIN, MAX over buckets.'], ['JOINs', 'INNER, LEFT, RIGHT, FULL on a shared key.'], ['Window functions', 'ROW_NUMBER, RANK, running totals over partitions.'], ['CTEs & subqueries', 'name and compose intermediate results.']] },
      { h: 'Exploratory data analysis (EDA)', terms: [['Univariate', 'distributions, histograms, outliers.'], ['Bivariate', 'scatter, correlation, cross-tabs.'], ['Missingness', 'MCAR/MAR/MNAR; impute or drop.'], ['Data types', 'numeric, categorical, ordinal, datetime, text.'], ['Summary stats', 'mean, median, quantiles, std, skew.']] },
      { h: 'Data quality & cleaning', p: ['Most analysis time goes to cleaning: deduplication, type coercion, handling nulls, fixing encodings, normalising categories, and detecting outliers (IQR, z-score).'] },
      { h: 'Visualization & BI', terms: [['Chart choice', 'bar (compare), line (trend), scatter (relationship), histogram (distribution).'], ['Cross-filtering', 'one selection updates every linked view.'], ['KPIs', 'the few headline numbers that matter.'], ['Dashboards', 'Tableau, Power BI, Looker, Metabase.'], ['Encoding pitfalls', 'truncated axes, dual axes, rainbow scales.']] },
    ]},

    /* ───────────────────────── Machine Learning ───────────────────────── */
    'machine-learning': { color: '#22D3EE', lead: 'Classical supervised and unsupervised learning — the workhorses before deep nets.', sections: [
      { h: 'Regression', p: ['Predict a continuous value. Linear regression fits y = Xβ by least squares; polynomial features bend the curve; regularisation controls overfitting.'],
        terms: [['Linear/polynomial', 'lines to curves.'], ['Ridge (L2) / Lasso (L1)', 'shrink weights; Lasso zeroes some (feature selection).'], ['MSE/RMSE/MAE/R²', 'error magnitude & variance explained.'], ['Assumptions', 'linearity, independence, homoscedasticity.']] },
      { h: 'Classification', terms: [['Logistic regression', 'linear boundary via the sigmoid.'], ['k-NN', 'vote of nearest neighbours; no training.'], ['SVM', 'max-margin boundary; kernels for non-linearity.'], ['Naive Bayes', 'fast probabilistic baseline for text.'], ['Metrics', 'accuracy, precision, recall, F1, ROC-AUC, PR-AUC.'], ['Confusion matrix', 'TP, FP, FN, TN — the source of all metrics.']] },
      { h: 'Clustering & unsupervised', terms: [['K-Means', 'assign to nearest centroid, update, repeat.'], ['Choosing k', 'elbow, silhouette, gap statistic.'], ['Hierarchical', 'dendrograms; agglomerative/divisive.'], ['DBSCAN', 'density clusters + noise; no k needed.'], ['PCA / t-SNE / UMAP', 'reduce dimensions to see structure.']] },
      { h: 'Ensembles', p: ['Combine many weak models into a strong one. Bagging averages independent trees (Random Forest); boosting builds trees sequentially, each fixing the last (XGBoost, LightGBM, CatBoost).'],
        terms: [['Decision tree', 'axis-aligned splits; interpretable, overfits.'], ['Random Forest', 'bagged trees + feature randomness.'], ['Gradient boosting', 'state-of-the-art on tabular data.'], ['Stacking/voting', 'blend diverse model families.']] },
      { h: 'Model selection & validation', terms: [['Train/val/test split', 'never tune on the test set.'], ['Cross-validation', 'k-fold for honest estimates.'], ['Bias–variance', 'underfit vs overfit trade-off.'], ['Hyperparameter search', 'grid, random, Bayesian.'], ['Leakage', 'future/target info sneaking into features.']] },
    ]},

    /* ───────────────────────── Deep Learning ───────────────────────── */
    'deep-learning': { color: '#6366F1', lead: 'Neural networks: how they compute, how they learn, and the major architectures.', sections: [
      { h: 'The neuron & the network', p: ['A neuron computes a weighted sum plus bias, then a non-linear activation. Stack them into layers (an MLP) and, with enough width/depth, approximate almost any function.'],
        terms: [['Perceptron → MLP', 'one neuron to many layers.'], ['Activations', 'ReLU, LeakyReLU, GELU, sigmoid, tanh, softmax.'], ['Universal approximation', 'why non-linearity matters.']] },
      { h: 'Training', p: ['Forward pass predicts; a loss scores the error; backpropagation computes gradients via the chain rule; an optimizer updates the weights.'],
        terms: [['Loss', 'cross-entropy (classify), MSE (regress).'], ['Optimizers', 'SGD, Momentum, RMSProp, Adam/AdamW.'], ['Backprop', 'reverse-mode autodiff.'], ['Batch/epoch', 'samples per step / passes over data.'], ['LR schedules', 'warmup, cosine decay.']] },
      { h: 'Regularization & stability', terms: [['Overfitting', 'memorising train, failing test.'], ['Dropout', 'randomly zero units in training.'], ['Batch/Layer norm', 'stabilise activations.'], ['Weight decay', 'L2 penalty in the optimizer.'], ['Early stopping', 'halt when val loss rises.'], ['Vanishing/exploding gradients', 'why residuals & gates exist.']] },
      { h: 'Architectures', table: { cols: ['Family', 'Built for'], rows: [['MLP', 'tabular / general vectors'], ['CNN', 'images & grid data (LeNet→ResNet→EfficientNet)'], ['RNN/LSTM/GRU', 'sequences with memory'], ['Transformer', 'sequences via attention (now dominant)'], ['Autoencoder/VAE', 'compression & generation'], ['GAN/Diffusion', 'image & data generation']] } },
    ]},

    /* ───────────────────────── NLP ───────────────────────── */
    'nlp': { color: '#A855F7', lead: 'Turning language into numbers a model can work with, and generating it back.', sections: [
      { h: 'Text preprocessing', terms: [['Tokenization', 'split into words/subwords (BPE, WordPiece, SentencePiece).'], ['Normalization', 'lowercase, stemming, lemmatization.'], ['Stop words', 'high-frequency, low-signal words.'], ['n-grams', 'contiguous token sequences.']] },
      { h: 'Representations', p: ['From sparse counts to dense meaning. TF-IDF weights a term by how frequent it is here and how rare it is elsewhere. Word embeddings (word2vec, GloVe) place words in a space where geometry encodes meaning; contextual embeddings (BERT) give a word a different vector per sentence.'],
        terms: [['Bag-of-words / TF-IDF', 'sparse, order-free counts.'], ['word2vec / GloVe', 'static dense vectors.'], ['Contextual (BERT)', 'meaning depends on context.'], ['Cosine similarity', 'compare embedding vectors.']] },
      { h: 'Classic NLP tasks', terms: [['Classification', 'sentiment, topic, spam.'], ['NER', 'tag people, places, orgs.'], ['POS tagging / parsing', 'grammar structure.'], ['Summarization / translation', 'seq-to-seq.'], ['QA & retrieval', 'find and answer.']] },
      { h: 'Generation & sampling', p: ['A language model outputs a probability over the next token via softmax. Decoding turns that into text.'],
        terms: [['Temperature', 'low = focused, high = diverse.'], ['Greedy / beam', 'most-likely token / best sequence.'], ['Top-k / nucleus (top-p)', 'sample from the likely set.'], ['Repetition penalty', 'discourage loops.']] },
    ]},

    /* ───────────────────────── Transformers ───────────────────────── */
    'transformers': { color: '#A855F7', lead: 'The architecture behind modern LLMs — attention, and everything built on it.', sections: [
      { h: 'Self-attention', p: ['Each token projects to a Query, Key and Value. Attention weights come from Query·Key similarity (scaled, softmaxed), then mix the Values. Every token can look at every other in one step — no recurrence.'],
        eqn: 'Attention(Q,K,V) = softmax(QKᵀ / √dₖ) V',
        terms: [['Multi-head', 'several attention patterns in parallel.'], ['Self vs cross', 'attend within one sequence vs between two.'], ['Causal mask', 'decoder can\'t peek at the future.']] },
      { h: 'The block & the stack', terms: [['Positional encoding', 'inject order — sinusoidal, learned, RoPE, ALiBi.'], ['Residual connections', 'add input back; enable depth.'], ['Layer norm', 'pre-norm stabilises training.'], ['Feed-forward', 'per-token MLP (often the most params).'], ['Encoder/decoder/decoder-only', 'BERT / T5 / GPT.']] },
      { h: 'Model families', table: { cols: ['Type', 'Example', 'Good at'], rows: [['Encoder-only', 'BERT, RoBERTa', 'understanding, classification, embeddings'], ['Decoder-only', 'GPT, Llama, Claude', 'generation, chat, few-shot'], ['Encoder-decoder', 'T5, BART', 'translation, summarization']] } },
      { h: 'RAG & embeddings', p: ['Retrieval-Augmented Generation grounds a model in external documents: embed text into vectors, store them in a vector DB, retrieve the nearest chunks for a query, and condition generation on them — reducing hallucination and adding fresh, citable knowledge.'],
        terms: [['Vector DB', 'FAISS, Pinecone, Chroma, Weaviate, pgvector.'], ['Chunking', 'split docs; balance context vs precision.'], ['Re-ranking', 'reorder retrieved hits for relevance.'], ['Context window', 'the token budget for prompt + output.']] },
    ]},

    /* ───────────────────────── LLM & Agents ───────────────────────── */
    'llm-agents': { color: '#818CF8', lead: 'Building, running, adapting and orchestrating large language models.', sections: [
      { h: 'How LLMs are built', p: ['Pre-training does self-supervised next-token prediction on a huge corpus. Instruction tuning teaches it to follow prompts; alignment (RLHF/DPO) shapes helpful, harmless behaviour.'],
        terms: [['Pre-training', 'next-token prediction at scale.'], ['Scaling laws', 'loss falls predictably with data×params×compute (Chinchilla-optimal).'], ['Emergence', 'abilities appearing past a scale threshold.'], ['Instruction tuning', 'follow tasks, not just continue text.']] },
      { h: 'Running models locally', p: ['A model must fit in memory: params × bytes-per-param, plus the KV cache that grows with context. Quantization shrinks the footprint.'],
        eqn: 'VRAM ≈ params × precision + KV-cache(context)',
        terms: [['Quantization', 'FP16 → INT8 → INT4; GGUF, AWQ, GPTQ.'], ['KV cache', 'memory grows with sequence length.'], ['Runtimes', 'llama.cpp, Ollama, vLLM, TGI.'], ['Context vs memory', 'longer context costs quadratically-ish.']] },
      { h: 'Fine-tuning & adaptation', terms: [['Full fine-tune', 'update all weights — expensive.'], ['PEFT / LoRA / QLoRA', 'train a few low-rank adapters cheaply.'], ['RLHF / DPO', 'align to human preferences.'], ['Fine-tune vs RAG', 'teach style/skills vs supply facts.']] },
      { h: 'Agents', p: ['An agent wraps an LLM in a loop: plan → act (call a tool) → observe → repeat, until the goal is met. Tools are functions the model can call (search, code, APIs). Memory combines the context window with a vector store.'],
        terms: [['Tool / function calling', 'structured calls to external systems.'], ['ReAct', 'interleave reasoning and actions.'], ['Planning', 'decompose goals into steps.'], ['Multi-agent', 'specialised agents that collaborate.'], ['Guardrails', 'validate inputs, outputs, and tool use.']] },
    ]},

    /* ───────────────────────── Computer Vision (NEW) ───────────────────────── */
    'cv': { color: '#22D3EE', lead: 'How machines turn pixels into edges, objects and boundaries.', sections: [
      { h: 'Convolutions', p: ['A convolution slides a small learned kernel over the image, multiplying and summing each neighbourhood into one output pixel — a feature map. Weight-sharing makes it translation-equivariant and parameter-efficient.'],
        terms: [['Kernel / filter', 'the small weight matrix.'], ['Feature map', 'the convolved output.'], ['Stride & padding', 'step size; keep or shrink size.'], ['Pooling', 'downsample (max/avg) for invariance.'], ['Receptive field', 'input region one output sees.']] },
      { h: 'CNN architectures', table: { cols: ['Model', 'Idea'], rows: [['LeNet', 'first practical CNN (digits)'], ['AlexNet', 'ReLU + GPUs won ImageNet 2012'], ['VGG', 'deep stacks of 3×3'], ['ResNet', 'skip connections enable 100+ layers'], ['EfficientNet', 'balanced depth/width/resolution scaling'], ['ViT', 'image patches as tokens for a transformer']] } },
      { h: 'Object detection', p: ['Detection localises and classifies multiple objects. Two-stage detectors (R-CNN → Faster R-CNN) propose then classify; one-stage (YOLO, SSD, RetinaNet) predict boxes directly for speed.'],
        terms: [['Bounding box + class', 'the detection output.'], ['Anchors', 'prior box shapes.'], ['IoU', 'overlap = intersection / union.'], ['NMS', 'suppress duplicate boxes.'], ['mAP', 'mean average precision (COCO).']] },
      { h: 'Segmentation & beyond', terms: [['Semantic', 'label every pixel by class.'], ['Instance', 'separate each object (Mask R-CNN).'], ['Panoptic', 'semantic + instance combined.'], ['U-Net / FCN / DeepLab', 'encoder–decoder segmenters.'], ['DETR / SAM', 'transformer detection; promptable segmentation.'], ['Transfer learning', 'reuse a pretrained backbone.']] },
    ]},

    /* ───────────────────────── Reinforcement Learning (NEW) ───────────────────────── */
    'rl': { color: '#FB7185', lead: 'Learning to act from reward through trial and error.', sections: [
      { h: 'The RL setting', p: ['An agent observes a state, takes an action, receives a reward and a new state — the interaction loop. A Markov Decision Process (MDP) formalises it: states, actions, transition probabilities, rewards, and a discount γ.'],
        terms: [['Policy π', 'the agent\'s action strategy.'], ['Value V(s)', 'expected return from a state.'], ['Q(s,a)', 'expected return of an action.'], ['Discount γ', 'weight on future reward.'], ['Return', 'sum of discounted rewards.']] },
      { h: 'Solving MDPs', p: ['If the model is known, dynamic programming (value/policy iteration) solves the Bellman equations exactly. When it\'s unknown, we learn from experience.'],
        eqn: 'V*(s) = maxₐ Σ P(s\'|s,a)[ r + γ V*(s\') ]  (Bellman optimality)',
        terms: [['Value iteration', 'iterate the Bellman backup.'], ['Policy iteration', 'evaluate then improve.'], ['Model-based vs free', 'know the dynamics vs learn from samples.']] },
      { h: 'Exploration', terms: [['Explore vs exploit', 'try new vs use the best known.'], ['ε-greedy', 'random action with prob ε.'], ['UCB', 'optimism under uncertainty.'], ['Thompson sampling', 'sample from a posterior.'], ['Regret', 'gap vs the optimal choice.']] },
      { h: 'Learning algorithms', terms: [['TD learning', 'bootstrap a value from the next guess.'], ['Q-learning', 'off-policy; learn greedy value while exploring.'], ['SARSA', 'on-policy; learn the followed policy.'], ['DQN', 'neural Q with replay buffer + target net.'], ['Policy gradients', 'REINFORCE, A2C/A3C, PPO.'], ['Actor-critic', 'a policy plus a value baseline.'], ['RLHF', 'RL aligns LLMs to human preferences.']] },
    ]},

    /* ───────────────────────── Time Series (NEW) ───────────────────────── */
    'timeseries': { color: '#34D399', lead: 'Modelling and forecasting data indexed by time.', sections: [
      { h: 'Structure of a series', p: ['A time series is observations ordered by time. Classical decomposition splits it into trend, seasonality, and residual — additively (y = T + S + R) or multiplicatively.'],
        terms: [['Trend', 'long-run direction.'], ['Seasonality', 'fixed-period repetition.'], ['Cyclicity', 'non-fixed long swings.'], ['Residual', 'what\'s left — ideally noise.'], ['Stationarity', 'stable mean/variance over time.'], ['ACF / PACF', 'autocorrelation at lags.']] },
      { h: 'Smoothing & transforms', terms: [['Moving average', 'mean over a window.'], ['Exponential smoothing', 'decay weights (SES, Holt, Holt-Winters).'], ['Differencing', 'remove trend/seasonality → stationarity.'], ['Log / Box-Cox', 'stabilise variance.']] },
      { h: 'Forecasting models', table: { cols: ['Method', 'When to use'], rows: [['Naive / seasonal-naive', 'baseline to beat'], ['ARIMA (p,d,q) / SARIMA', 'autocorrelated, stationary-after-differencing'], ['ETS / Holt-Winters', 'trend + seasonality'], ['Prophet', 'business series with holidays'], ['Gradient boosting on lags', 'many features, non-linear'], ['LSTM / TFT', 'long, complex, multivariate']] } },
      { h: 'Evaluation', p: ['Never shuffle time. Split chronologically and backtest with a rolling/expanding origin. Beware look-ahead leakage.'],
        terms: [['Rolling-origin CV', 'walk-forward validation.'], ['MAE / RMSE', 'absolute / squared error.'], ['MAPE / sMAPE', 'percentage errors.'], ['Prediction interval', 'uncertainty that widens with horizon.']] },
    ]},

    /* ───────────────────────── Prompt Engineering (NEW) ───────────────────────── */
    'prompting': { color: '#A855F7', lead: 'Steering model behaviour with well-designed instructions.', sections: [
      { h: 'Anatomy of a prompt', terms: [['Role / persona', 'set expertise and voice.'], ['Context', 'the background and inputs.'], ['Instruction', 'the specific task.'], ['Constraints', 'length, tone, do/don\'t.'], ['Examples', 'demonstrate the pattern.'], ['Output format', 'exact shape to return.'], ['Delimiters', 'fence data from instructions.']] },
      { h: 'Reasoning strategies', p: ['Prompting patterns dramatically change reliability on hard tasks.'],
        terms: [['Zero-shot', 'just ask.'], ['Few-shot (ICL)', 'show worked examples.'], ['Chain-of-thought', '"think step by step".'], ['Self-consistency', 'sample many chains, vote.'], ['ReAct', 'reason + act with tools.'], ['Least-to-most / decomposition', 'break into sub-problems.'], ['Prompt chaining', 'pipe one output into the next.']] },
      { h: 'Structured & grounded output', terms: [['JSON / schemas', 'ask for a parseable shape.'], ['Function / tool calling', 'API-enforced structured args.'], ['Grounding (RAG)', '"answer only from the context, and cite".'], ['Refusals', 'let the model say "I don\'t know".'], ['System vs user vs assistant', 'message roles.']] },
      { h: 'Pitfalls & safety', terms: [['Prompt injection', 'malicious input hijacking instructions.'], ['Leaking the system prompt', 'guard against extraction.'], ['Over-long context', 'lost-in-the-middle; token cost.'], ['Evaluation', 'test prompts on a labelled set, not by vibes.']] },
    ]},

    /* ───────────────────────── AI Ethics (NEW) ───────────────────────── */
    'ethics': { color: '#F59E0B', lead: 'Making powerful systems fair, safe, private and accountable.', sections: [
      { h: 'Sources of bias', terms: [['Historical', 'the world\'s inequities in the data.'], ['Representation', 'groups under-sampled.'], ['Measurement', 'proxy labels that mislead.'], ['Aggregation', 'one model for distinct groups.'], ['Deployment', 'feedback loops that amplify.']] },
      { h: 'Fairness definitions (and their limits)', p: ['Different notions of fairness can conflict — you generally cannot satisfy demographic parity, equalized odds, and calibration simultaneously when base rates differ (an impossibility result).'],
        terms: [['Demographic parity', 'equal selection rates.'], ['Equal opportunity', 'equal true-positive rates.'], ['Equalized odds', 'equal TPR and FPR.'], ['Calibration', 'scores mean the same across groups.'], ['Mitigation', 'pre-, in-, and post-processing (Fairlearn, AIF360).']] },
      { h: 'Alignment & safety', terms: [['Alignment problem', 'get systems to do what we truly want.'], ['Reward hacking', 'exploiting the metric, not the goal.'], ['RLHF / DPO / Constitutional AI', 'shape behaviour to preferences/principles.'], ['Red-teaming', 'adversarial testing before release.'], ['Jailbreaks / injection', 'attacks that bypass guardrails.'], ['Hallucination', 'confident falsehoods.'], ['Interpretability', 'understand internal computation.']] },
      { h: 'Privacy & governance', terms: [['PII & minimisation', 'collect only what\'s needed.'], ['Differential privacy', 'provable per-record protection.'], ['Federated learning', 'train without centralising data.'], ['Model cards / datasheets', 'document intent, limits, data.'], ['Human oversight', 'a person accountable for decisions.'], ['Regulation', 'EU AI Act, NIST AI RMF, GDPR, ISO 42001.']] },
    ]},

    /* ───────────────────────── Generative AI ───────────────────────── */
    'generative': { color: '#FB7185', lead: 'Models that create — images, audio, video — not just classify.', sections: [
      { h: 'Diffusion models', p: ['Diffusion learns to reverse a gradual noising process. Training adds noise to real images and teaches a network to predict/remove it; sampling starts from pure noise and denoises step by step into an image.'],
        terms: [['Forward process', 'progressively add Gaussian noise.'], ['Reverse process', 'learned denoising.'], ['Latent diffusion', 'diffuse in a compressed space (Stable Diffusion).'], ['Guidance', 'classifier-free guidance steers toward the prompt.'], ['Schedulers', 'DDPM, DDIM — speed vs quality.']] },
      { h: 'Other generative families', terms: [['VAEs', 'encode to a probabilistic latent, sample, decode.'], ['GANs', 'generator vs discriminator; sharp but unstable (mode collapse).'], ['Autoregressive', 'generate pixels/tokens in sequence.'], ['Flow / consistency models', 'invertible / few-step sampling.']] },
      { h: 'Conditioning & control', terms: [['Text-to-image', 'CLIP-guided prompts.'], ['ControlNet', 'pose/edge/depth conditioning.'], ['Inpainting/outpainting', 'edit or extend.'], ['LoRA / DreamBooth', 'personalise a subject or style.']] },
      { h: 'Beyond images & risks', terms: [['Audio/video', 'Whisper, MusicGen, Sora.'], ['Multimodal', 'text+image+audio jointly.'], ['Deepfakes', 'misuse & provenance (watermarking, C2PA).'], ['Copyright & data', 'training-data provenance debates.']] },
    ]},

    /* ───────────────────────── XAI ───────────────────────── */
    'xai': { color: '#F59E0B', lead: 'Opening the black box — why a model made a decision.', sections: [
      { h: 'Why explainability', p: ['High-stakes decisions (credit, health, justice) need reasons, not just outputs — for trust, debugging, fairness auditing, and regulation (a "right to explanation").'],
        terms: [['Global vs local', 'the whole model vs one prediction.'], ['Intrinsic vs post-hoc', 'transparent models vs explaining opaque ones.'], ['Model-agnostic vs specific', 'works on any model vs one type.']] },
      { h: 'Attribution methods', terms: [['SHAP', 'Shapley values; fair credit that sums to the output.'], ['LIME', 'fit a simple model locally around one point.'], ['Permutation importance', 'shuffle a feature, watch performance drop.'], ['Partial dependence / ICE', 'how output bends with a feature.'], ['Counterfactuals', 'the smallest change that flips the decision.']] },
      { h: 'Deep-model interpretability', terms: [['Saliency / Grad-CAM', 'which pixels mattered.'], ['Integrated gradients', 'attribution along a path.'], ['Attention maps', 'what a transformer attended to (with care).'], ['Probing', 'what a layer encodes.']] },
      { h: 'For LLMs & fairness', terms: [['Logit lens', 'decode intermediate layers.'], ['Circuits', 'reverse-engineer sub-computations.'], ['Sparse autoencoders', 'find interpretable features.'], ['Fairness toolkits', 'Fairlearn, AIF360, equalized-odds audits.']] },
    ]},

    /* ───────────────────────── ETL & Data Eng ───────────────────────── */
    'etl': { color: '#22D3EE', lead: 'Moving and shaping data reliably at scale.', sections: [
      { h: 'Extract → Transform → Load', p: ['ETL (transform before load) and ELT (load raw, transform in the warehouse) move data from sources to a store. Modeled as a DAG — a directed acyclic graph of tasks with dependencies.'],
        terms: [['Ingestion', 'batch vs streaming; CDC.'], ['Transformation', 'clean, join, dedupe, aggregate (dbt, Spark).'], ['Load', 'into warehouse/lake.'], ['Idempotency', 'safe reruns; exactly-once vs at-least-once.']] },
      { h: 'Orchestration', terms: [['DAG', 'tasks + dependencies.'], ['Airflow / Prefect / Dagster', 'schedule & monitor pipelines.'], ['Backfills', 'reprocess history.'], ['SLAs & retries', 'reliability guarantees.']] },
      { h: 'Storage & processing', table: { cols: ['Layer', 'Tools'], rows: [['Warehouse', 'Snowflake, BigQuery, Redshift'], ['Lake / lakehouse', 'S3 + Delta Lake, Iceberg, Hudi'], ['Batch compute', 'Spark, Dask'], ['Streaming', 'Kafka, Flink, Spark Streaming'], ['Feature store', 'Feast, Tecton (offline+online)']] } },
      { h: 'Modeling & quality', terms: [['Star/snowflake schema', 'facts & dimensions.'], ['Normalization', 'reduce redundancy.'], ['Data contracts', 'agreed schemas between teams.'], ['Great Expectations', 'automated data tests.'], ['Lineage', 'trace data origin & flow.']] },
    ]},

    /* ───────────────────────── MLOps ───────────────────────── */
    'mlops': { color: '#34D399', lead: 'Shipping, serving and maintaining models in production.', sections: [
      { h: 'The MLOps lifecycle', p: ['MLOps is DevOps for ML: reproducible training, versioned data/models, automated deployment, and continuous monitoring — closing the loop back to retraining.'],
        terms: [['Experiment tracking', 'MLflow, W&B — runs, params, metrics.'], ['Model registry', 'versioned, staged models.'], ['Data/version control', 'DVC, lakeFS.'], ['Reproducibility', 'pin data, code, seeds, environment.']] },
      { h: 'Deployment patterns', terms: [['Batch vs online', 'scheduled scoring vs real-time API.'], ['Shadow', 'run silently alongside production.'], ['Canary / A-B', 'gradual, measured rollout.'], ['Serving', 'FastAPI, TorchServe, Triton, KServe.'], ['Latency/throughput', 'p50/p95, batching, quantization.']] },
      { h: 'Monitoring & drift', p: ['Models decay as the world shifts. Watch inputs and outputs, not just uptime.'],
        terms: [['Data drift', 'input distribution changes.'], ['Concept drift', 'input→output relationship changes.'], ['Label drift', 'target distribution shifts.'], ['Detection', 'PSI, KS test, population stability.'], ['Retraining triggers', 'schedule or drift-based.']] },
      { h: 'Scale & governance', terms: [['Distributed training', 'data/model parallel, FSDP, DeepSpeed.'], ['CI/CD for ML', 'test data, models & code.'], ['Model cards & lineage', 'documentation and audit trails.'], ['Cost & carbon', 'track compute spend and footprint.']] },
    ]},

    /* ───────────────────────── Programming / Code & Stack ───────────────────────── */
    'programming': { color: '#F59E0B', lead: 'The languages, libraries and stores that AI is built with.', sections: [
      { h: 'Python for ML', terms: [['Core', 'OOP, functions, comprehensions, typing.'], ['NumPy', 'n-dim arrays, vectorised math, broadcasting.'], ['Pandas / Polars', 'dataframes, joins, groupby.'], ['scikit-learn', 'classic ML: fit/predict, pipelines.'], ['Notebooks', 'Jupyter for the iterate-and-inspect workflow.']] },
      { h: 'Deep-learning frameworks', table: { cols: ['Framework', 'Character'], rows: [['PyTorch', 'dynamic graphs, autograd, nn.Module — research default'], ['TensorFlow/Keras', 'production graph, tf.data, TF Serving'], ['JAX/Flax', 'functional, XLA-compiled, great for TPUs'], ['Hugging Face', 'transformers, datasets, tokenizers hub']] } },
      { h: 'Other languages', terms: [['R', 'statistics & viz (tidyverse, ggplot2).'], ['SQL', 'the data-access lingua franca.'], ['Go / Rust', 'fast services & tooling.'], ['C++/CUDA', 'kernels behind the frameworks.']] },
      { h: 'Data stores', terms: [['Relational (SQL)', 'rows, joins, ACID — Postgres, MySQL.'], ['Document', 'JSON-ish — MongoDB.'], ['Key-value', 'fast lookups — Redis.'], ['Columnar', 'analytics — ClickHouse, Parquet.'], ['Vector DB', 'embeddings for RAG — pgvector, Pinecone.'], ['CAP / ACID vs BASE', 'consistency trade-offs.']] },
    ]},

    /* ───────────────────────── Research Lab ───────────────────────── */
    'research': { color: '#8B8CF6', lead: 'The methodology that separates a real result from luck.', sections: [
      { h: 'Generalization theory', terms: [['Bias–variance', 'underfit vs overfit.'], ['Overfitting', 'fit noise, not signal.'], ['Regularization', 'constrain to generalise.'], ['Double descent', 'test error can fall again past interpolation.'], ['No free lunch', 'no model wins on every problem.']] },
      { h: 'Honest evaluation', p: ['Rigorous claims need proper validation, uncertainty, and controls.'],
        terms: [['Cross-validation', 'k-fold, stratified, grouped.'], ['Bootstrap', 'resample to estimate uncertainty.'], ['Confidence intervals', 'report ranges, not point estimates.'], ['Hypothesis testing', 'p-values, effect size, multiple-comparison correction.'], ['Ablations', 'remove a part to prove it matters.']] },
      { h: 'Benchmarks & reproducibility', terms: [['Benchmarks', 'GLUE, MMLU, ImageNet, HELM.'], ['Data splits & leakage', 'keep test truly held-out.'], ['Seeds & variance', 'report across runs.'], ['Reproducibility', 'release code, data, configs.']] },
      { h: 'Frontier topics', terms: [['Scaling laws', 'Chinchilla-optimal compute allocation.'], ['Mixture-of-Experts', 'sparse, conditional compute.'], ['Distillation', 'a small student mimics a big teacher.'], ['Alignment & safety', 'red-teaming, interpretability, governance.']] },
    ]},

  };

  /* ---- render ---- */
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function sectionHTML(color, s) {
    let body = '';
    if (s.p) body += s.p.map(function(t){ return '<p class="rf-p">'+t+'</p>'; }).join('');
    if (s.eqn) body += '<div class="rf-eqn">'+esc(s.eqn)+'</div>';
    if (s.terms) body += '<div class="rf-terms">'+s.terms.map(function(kv){
      return '<div class="rf-term"><b>'+kv[0]+'</b><span>'+kv[1]+'</span></div>'; }).join('')+'</div>';
    if (s.table) {
      body += '<div class="rf-tablewrap"><table class="rf-table"><thead><tr>'+
        s.table.cols.map(function(c){ return '<th>'+esc(c)+'</th>'; }).join('')+'</tr></thead><tbody>'+
        s.table.rows.map(function(r){ return '<tr>'+r.map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+
        '</tbody></table></div>';
    }
    return '<details class="rf-sec"><summary><span class="rf-dot"></span>'+esc(s.h)+
      '<svg class="rf-chev" width="14" height="14" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>'+
      '<div class="rf-body">'+body+'</div></details>';
  }
  function blockHTML(page, R) {
    return '<section class="rf-wrap" style="--rc:'+R.color+'">'+
      '<div class="rf-head"><span class="rf-eyebrow">Full reference</span>'+
      '<h2>Everything in this module</h2>'+
      '<p class="rf-lead">'+esc(R.lead)+' Expand any section — this is the complete written companion to the playgrounds above.</p></div>'+
      R.sections.map(function(s){ return sectionHTML(R.color, s); }).join('')+
      '</section>';
  }

  function injectStyles() {
    if (document.getElementById('rf-css')) return;
    var css = ''+
      '.rf-wrap{margin:48px 0 8px;border-top:1px solid var(--stroke);padding-top:34px}'+
      '.rf-head{margin-bottom:20px}'+
      '.rf-eyebrow{font-family:var(--mono);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--rc);opacity:.9}'+
      '.rf-head h2{font-size:24px;margin:8px 0 8px;letter-spacing:-.01em}'+
      '.rf-lead{color:var(--ink-soft);font-size:14.5px;line-height:1.6;max-width:780px;margin:0}'+
      '.rf-sec{border:1px solid var(--stroke);border-radius:14px;background:var(--glass);margin-bottom:10px;overflow:hidden}'+
      '.rf-sec[open]{background:var(--glass-2);border-color:var(--stroke-hi)}'+
      '.rf-sec summary{display:flex;align-items:center;gap:11px;cursor:pointer;padding:15px 18px;font-family:var(--display);font-weight:600;font-size:15.5px;color:var(--ink);list-style:none;user-select:none}'+
      '.rf-sec summary::-webkit-details-marker{display:none}'+
      '.rf-dot{width:8px;height:8px;border-radius:50%;background:var(--rc);flex:0 0 auto;box-shadow:0 0 10px var(--rc)}'+
      '.rf-chev{margin-left:auto;color:var(--ink-mute);transition:transform .2s}'+
      '.rf-sec[open] .rf-chev{transform:rotate(180deg)}'+
      '.rf-body{padding:2px 18px 18px 37px}'+
      '.rf-p{color:var(--ink-soft);font-size:14px;line-height:1.7;margin:0 0 12px}'+
      '.rf-eqn{font-family:var(--mono);font-size:13px;color:var(--cyan);background:#0c0c16;border:1px solid var(--stroke);border-radius:10px;padding:12px 14px;margin:0 0 14px;overflow-x:auto}'+
      '.rf-terms{display:grid;grid-template-columns:1fr 1fr;gap:9px 22px;margin-top:4px}'+
      '.rf-term{font-size:13px;line-height:1.5;color:var(--ink-mute);padding-left:14px;position:relative}'+
      '.rf-term::before{content:"▸";position:absolute;left:0;top:0;color:var(--rc);font-size:10px}'+
      '.rf-term b{color:var(--ink);font-weight:600;display:inline;margin-right:4px}'+
      '.rf-tablewrap{overflow-x:auto;margin-top:6px}'+
      '.rf-table{width:100%;border-collapse:collapse;font-size:13px}'+
      '.rf-table th,.rf-table td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--stroke);color:var(--ink-soft);vertical-align:top}'+
      '.rf-table th{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-mute)}'+
      '@media(max-width:720px){.rf-terms{grid-template-columns:1fr}.rf-body{padding-left:18px}}';
    var st = document.createElement('style'); st.id = 'rf-css'; st.textContent = css;
    document.head.appendChild(st);
  }

  function init() {
    var page = document.body.dataset.page || '';
    var R = REF[page];
    if (!R) return;
    var pageEl = document.querySelector('.page');
    if (!pageEl || pageEl.querySelector('.rf-wrap')) return;
    injectStyles();
    pageEl.insertAdjacentHTML('beforeend', blockHTML(page, R));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
