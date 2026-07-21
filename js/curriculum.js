/* ============================================================
   AI ATLAS — Curriculum engine
   Renders the full topic tree from modules/readme.md as an
   interactive, WHMCS-docs-style accordion. Each module page
   mounts it with:  <div data-curriculum="machine-learning"></div>
   (comma-separate keys to render several blocks on one page).
   ============================================================ */
(function () {
  'use strict';

  // key -> { title, color, blurb, sections:[{ t, tag, d, pts:[{t,d}] }] }
  const CURRICULUM = {

    /* 1 ── Foundations ───────────────────────────────────── */
    'foundations': {
      title: 'Foundations', color: '#8B8CF6',
      blurb: 'The vocabulary, history and responsible-use frame every other module builds on.',
      sections: [
        { t: 'What is AI?', tag: 'concept', d: 'Start here: pin down what "intelligence" means for a machine and trace how the field got here.', pts: [
          { t: 'Definitions', d: 'AI as systems that perceive, reason and act toward goals.' },
          { t: 'Narrow vs. general AI', d: 'today’s task-specific models vs. the still-hypothetical general intelligence.' },
          { t: 'History of AI', d: 'symbolic → statistical → deep learning → generative eras.' },
        ]},
        { t: 'Types of AI', tag: 'taxonomy', d: 'Sort systems by how much of the world they remember and model.', pts: [
          { t: 'Reactive machines', d: 'no memory — map inputs straight to outputs (Deep Blue).' },
          { t: 'Limited memory', d: 'use recent history — nearly every model in production today.' },
          { t: 'Theory of mind / self-aware', d: 'aspirational stages that model others’ and their own state.' },
        ]},
        { t: 'AI Workflow Pipeline', tag: 'process', d: 'The loop every project runs: define → collect → model → evaluate → deploy → monitor. Walk the interactive stepper above to see each stage.', pts: [
          { t: 'Problem definition', d: 'frame the task and the metric before touching data.' },
          { t: 'Data → model → evaluation', d: 'the core build loop you’ll repeat all curriculum.' },
          { t: 'Deployment & monitoring', d: 'ship it, then watch it drift in the real world.' },
        ]},
        { t: 'Ethics & Responsible AI', tag: 'critical', d: 'Every model is a decision about people. Know the failure modes before you ship.', pts: [
          { t: 'Bias & fairness', d: 'skewed data → skewed outcomes; measure across groups.' },
          { t: 'Transparency & privacy', d: 'explainability and data minimisation as defaults.' },
          { t: 'Regulation & alignment', d: 'the EU AI Act, and keeping goals matched to intent.' },
        ]},
        { t: 'AI in Industry', tag: 'applied', d: 'See where the theory lands — the sectors already running on models.', pts: [
          { t: 'Healthcare & finance', d: 'diagnosis, risk scoring, fraud detection.' },
          { t: 'Autonomous systems & robotics', d: 'perception + control in the physical world.' },
          { t: 'Creative industries', d: 'generative tools for text, image, audio and video.' },
        ]},
      ],
    },

    /* 2 ── Mathematics ───────────────────────────────────── */
    'mathematics': {
      title: 'Mathematics', color: '#34D399',
      blurb: 'The four pillars under every model. Grab the vectors and drop the ball above — then read the map below.',
      sections: [
        { t: 'Linear Algebra', tag: 'core', d: 'The language of data: everything is a vector or a matrix. Drag the vectors above to feel the dot product flip sign.', pts: [
          { t: 'Vectors & matrices', d: 'data points and the operations that move them.' },
          { t: 'Matrix operations', d: 'multiply, transpose, invert — the mechanics of every layer.' },
          { t: 'Eigenvalues & PCA intuition', d: 'the directions data stretches along.' },
        ]},
        { t: 'Calculus', tag: 'core', d: 'How a model knows which way to improve — the slope of its error.', pts: [
          { t: 'Derivatives & gradients', d: 'the direction of steepest change in the loss.' },
          { t: 'Partial derivatives', d: 'sensitivity to one weight while others are held fixed.' },
          { t: 'Chain rule', d: 'the single idea backpropagation is built from.' },
        ]},
        { t: 'Probability & Statistics', tag: 'core', d: 'Reasoning under uncertainty. Slide μ and σ above to reshape the bell curve.', pts: [
          { t: 'Distributions & random variables', d: 'how outcomes spread out.' },
          { t: 'Bayes’ theorem', d: 'updating belief as evidence arrives.' },
          { t: 'Hypothesis testing & CIs', d: 'is the effect real or noise?' },
        ]},
        { t: 'Optimization', tag: 'core', d: 'Training = minimising a loss. Drop the ball on the loss surface above and add momentum to escape ravines.', pts: [
          { t: 'Gradient descent', d: 'batch, stochastic and mini-batch variants.' },
          { t: 'Learning rates', d: 'step size — too big overshoots, too small crawls.' },
          { t: 'Convex vs. non-convex', d: 'one valley vs. a landscape full of them.' },
        ]},
        { t: 'Information Theory', tag: 'advanced', d: 'Measuring surprise — where classification loss functions come from.', pts: [
          { t: 'Entropy', d: 'the average information content of a distribution.' },
          { t: 'Cross-entropy', d: 'the standard loss for classification and language models.' },
          { t: 'KL divergence', d: 'the distance between two distributions.' },
        ]},
      ],
    },

    /* 3 ── Data Analysis ─────────────────────────────────── */
    'data-analysis': {
      title: 'Data Analysis', color: '#2EC4DE',
      blurb: 'Turn raw rows into understanding. Run the SQL and cross-filter the dashboard above, then work through the toolkit.',
      sections: [
        { t: 'Exploratory Data Analysis', tag: 'start here', d: 'Always look before you model — summarise, plot and hunt for patterns first.', pts: [
          { t: 'Summary statistics', d: 'mean, median, spread, quantiles.' },
          { t: 'Distributions', d: 'shape, skew and outliers per column.' },
          { t: 'Correlation analysis', d: 'which features move together.' },
        ]},
        { t: 'Data Visualization', tag: 'skill', d: 'A good chart is an argument. Learn which plot answers which question.', pts: [
          { t: 'Matplotlib / Seaborn / Plotly', d: 'static to interactive plotting stacks.' },
          { t: 'Chart best practice', d: 'right encoding, honest axes, minimal ink.' },
        ]},
        { t: 'Data Preprocessing', tag: 'essential', d: 'Models are only as clean as their inputs — fix the data before it fixes you.', pts: [
          { t: 'Missing values & outliers', d: 'impute, drop or cap.' },
          { t: 'Scaling', d: 'standardisation and normalisation.' },
          { t: 'Encoding', d: 'one-hot and label encoding for categories.' },
        ]},
        { t: 'Feature Engineering', tag: 'high impact', d: 'Often the biggest lever on accuracy — build the columns the model needs.', pts: [
          { t: 'Selection & extraction', d: 'keep signal, drop noise.' },
          { t: 'Polynomial & domain features', d: 'encode expert knowledge as inputs.' },
        ]},
        { t: 'Pandas & NumPy', tag: 'toolkit', d: 'The workhorse libraries — vectorise instead of looping.', pts: [
          { t: 'DataFrames & Series', d: 'labelled tables and columns.' },
          { t: 'Merge, group, pivot', d: 'reshape and aggregate at speed.' },
        ]},
        { t: 'Statistical Modeling', tag: 'analysis', d: 'Classical stats that explain, not just predict.', pts: [
          { t: 'Linear regression (as stats)', d: 'coefficients you can interpret.' },
          { t: 'ANOVA & A/B testing', d: 'is the difference significant?' },
        ]},
      ],
    },

    /* 4 ── SQL ───────────────────────────────────────────── */
    'sql': {
      title: 'SQL', color: '#22D3EE',
      blurb: 'The language of data at rest. Everything here you can try in the SQL Explorer above.',
      sections: [
        { t: 'SQL Basics', tag: 'start here', d: 'Ask a table a question. Edit the query above and hit Run.', pts: [
          { t: 'SELECT / WHERE', d: 'pick columns, filter rows.' },
          { t: 'ORDER BY / LIMIT / DISTINCT', d: 'sort, trim and dedupe results.' },
        ]},
        { t: 'Joins & Relationships', tag: 'core', d: 'Combine tables that share a key — the heart of relational data.', pts: [
          { t: 'INNER / LEFT / RIGHT / FULL', d: 'which unmatched rows survive the join.' },
          { t: 'One-to-many & many-to-many', d: 'how entities relate.' },
        ]},
        { t: 'Aggregation & Grouping', tag: 'core', d: 'Collapse many rows into a summary — try GROUP BY on the orders table.', pts: [
          { t: 'GROUP BY / HAVING', d: 'bucket rows, then filter the buckets.' },
          { t: 'COUNT / SUM / AVG', d: 'the everyday aggregates.' },
          { t: 'Window functions', d: 'running totals and rankings without collapsing rows.' },
        ]},
        { t: 'Subqueries & CTEs', tag: 'intermediate', d: 'Build queries from readable building blocks.', pts: [
          { t: 'Nested queries', d: 'a query as an input to another.' },
          { t: 'WITH clauses & recursion', d: 'name steps; walk hierarchies.' },
        ]},
        { t: 'Database Design', tag: 'foundation', d: 'Structure data so it stays correct as it grows.', pts: [
          { t: 'Normalization (1NF–3NF)', d: 'remove redundancy.' },
          { t: 'Keys & indexes', d: 'identity and fast lookups.' },
        ]},
        { t: 'SQL for Data Science', tag: 'applied', d: 'Push work to the database instead of pulling everything into Python.', pts: [
          { t: 'Query optimization', d: 'read the plan, add the index.' },
          { t: 'SQL + Python', d: 'SQLite and PostgreSQL from a notebook.' },
        ]},
      ],
    },

    /* 5 ── Machine Learning ──────────────────────────────── */
    'machine-learning': {
      title: 'Machine Learning', color: '#22D3EE',
      blurb: 'Classic models, each a live sandbox above. Fit the curve, move the centroids, then dig into the theory.',
      sections: [
        { t: 'Regression', tag: 'supervised', d: 'Predict a number. Raise the polynomial degree above until R² climbs and the curve starts overfitting.', pts: [
          { t: 'Linear → polynomial', d: 'straight lines to bendy curves.' },
          { t: 'Ridge / Lasso / Elastic Net', d: 'regularisation to fight overfitting.' },
          { t: 'MSE / RMSE / MAE / R²', d: 'how far off, on average.' },
        ]},
        { t: 'Classification', tag: 'supervised', d: 'Predict a label. Place points near the boundary above and watch precision and recall move.', pts: [
          { t: 'Logistic regression & SVM', d: 'linear and margin-based boundaries.' },
          { t: 'Trees, k-NN, Naive Bayes', d: 'rules, neighbours and probabilities.' },
          { t: 'Precision / recall / ROC-AUC', d: 'beyond raw accuracy.' },
        ]},
        { t: 'Clustering', tag: 'unsupervised', d: 'Find groups with no labels. Step K-Means above and try the wrong k.', pts: [
          { t: 'K-Means', d: 'assign to nearest centroid, then move it.' },
          { t: 'Hierarchical & DBSCAN', d: 'trees of clusters; density-based shapes.' },
          { t: 'Silhouette & elbow', d: 'how many clusters is right?' },
        ]},
        { t: 'Dimensionality Reduction', tag: 'unsupervised', d: 'Squeeze many features into a few you can plot.', pts: [
          { t: 'PCA', d: 'project onto the directions of most variance.' },
          { t: 't-SNE & UMAP', d: 'non-linear maps for visualising clusters.' },
        ]},
        { t: 'Ensembles', tag: 'power tool', d: 'Many weak models beat one strong one. Add trees to the forest above and watch the boundary smooth.', pts: [
          { t: 'Bagging (Random Forest)', d: 'average many trees on bootstrap samples.' },
          { t: 'Boosting (XGBoost, LightGBM)', d: 'each model fixes the last one’s mistakes.' },
          { t: 'Stacking & voting', d: 'combine diverse models.' },
        ]},
        { t: 'Model Selection & Validation', tag: 'discipline', d: 'The difference between a demo and a model that ships.', pts: [
          { t: 'Cross-validation', d: 'k-fold and stratified splits.' },
          { t: 'Bias–variance tradeoff', d: 'under- vs. over-fitting.' },
          { t: 'Hyperparameter tuning', d: 'grid, random and Bayesian search.' },
        ]},
        { t: 'Unsupervised Learning', tag: 'extra', d: 'Structure without labels beyond clustering.', pts: [
          { t: 'Association rules', d: 'Apriori — what goes with what.' },
          { t: 'Anomaly detection', d: 'flag the points that don’t fit.' },
        ]},
      ],
    },

    /* 6 ── Deep Learning ─────────────────────────────────── */
    'deep-learning': {
      title: 'Deep Learning Lab', color: '#6366F1',
      blurb: 'Build networks by hand. Watch the forward pass and backprop above, then explore the full architecture zoo.',
      sections: [
        { t: 'Neural Network Fundamentals', tag: 'start here', d: 'A stack of weighted sums and non-linearities. Watch activations light up and gradients flow back above.', pts: [
          { t: 'Perceptron → MLP', d: 'one neuron to many layers.' },
          { t: 'Activations', d: 'ReLU, sigmoid, tanh, softmax, GELU.' },
          { t: 'Forward & backward propagation', d: 'predict, then assign blame.' },
          { t: 'Loss functions', d: 'MSE, cross-entropy, hinge.' },
        ]},
        { t: 'Optimization for Deep Learning', tag: 'training', d: 'Adam and friends — gradient descent that adapts per weight.', pts: [
          { t: 'SGD+momentum, RMSprop, Adam', d: 'the standard optimisers.' },
          { t: 'LR scheduling', d: 'step decay, cosine annealing, warm restarts.' },
        ]},
        { t: 'Regularization Techniques', tag: 'essential', d: 'Keep a big network from memorising the training set.', pts: [
          { t: 'Dropout & early stopping', d: 'randomly drop units; stop before overfit.' },
          { t: 'Batch / layer norm', d: 'stabilise and speed up training.' },
          { t: 'Data augmentation', d: 'more data for free via transforms.' },
        ]},
        { t: 'Convolutional Neural Networks', tag: 'vision', d: 'Weight-sharing filters that scan images for patterns.', pts: [
          { t: 'Convolutions & pooling', d: 'local features, then downsample.' },
          { t: 'ResNet, EfficientNet', d: 'the architectures that made depth work.' },
          { t: 'Transfer learning', d: 'reuse a pretrained backbone.' },
          { t: 'Detection & segmentation', d: 'YOLO, R-CNN, pixel masks.' },
        ]},
        { t: 'Recurrent Neural Networks', tag: 'sequence', d: 'Networks with memory for ordered data.', pts: [
          { t: 'RNN, LSTM, GRU', d: 'gated cells that carry state.' },
          { t: 'Seq2seq', d: 'encode a sequence, decode another.' },
          { t: 'Time series & text', d: 'the classic applications.' },
        ]},
        { t: 'Generative Models', tag: 'creative', d: 'Networks that produce new data, not just labels.', pts: [
          { t: 'Autoencoders & VAEs', d: 'compress, then reconstruct or sample.' },
          { t: 'GANs', d: 'generator vs. discriminator arms race.' },
          { t: 'Diffusion models', d: 'denoise pure noise into images.' },
        ]},
        { t: 'Frameworks', tag: 'tooling', d: 'The libraries that run the maths on a GPU.', pts: [
          { t: 'PyTorch vs. TensorFlow/Keras', d: 'dynamic vs. graph styles.' },
          { t: 'Training loops & CUDA', d: 'GPU acceleration in practice.' },
        ]},
      ],
    },

    /* 7 ── Language & Generation (NLP) ───────────────────── */
    'nlp': {
      title: 'Language & Generation', color: '#A855F7',
      blurb: 'How machines read and write. Tokenise text and score TF-IDF above, then follow the path to RAG.',
      sections: [
        { t: 'NLP Basics', tag: 'start here', d: 'Turn messy text into numbers a model can use. Try the tokenizer above.', pts: [
          { t: 'Tokenization & lemmatization', d: 'split and normalise words.' },
          { t: 'n-grams, bag-of-words, TF-IDF', d: 'count-based text features.' },
          { t: 'Word2Vec, GloVe, FastText', d: 'words as dense vectors.' },
        ]},
        { t: 'Sequence Modeling for NLP', tag: 'core', d: 'Model word order, then learn to focus.', pts: [
          { t: 'RNNs/LSTMs for text', d: 'read left to right with memory.' },
          { t: 'Attention (Bahdanau, Luong)', d: 'weight the words that matter — the seed of the transformer.' },
        ]},
        { t: 'Advanced Embeddings', tag: 'representation', d: 'Meaning that depends on context, not just the word.', pts: [
          { t: 'Contextual embeddings (ELMo)', d: 'the same word, different vectors.' },
          { t: 'Sentence embeddings', d: 'Sentence-BERT, USE for whole sentences.' },
        ]},
        { t: 'Text Generation', tag: 'generative', d: 'Predict the next token — and control how you sample it.', pts: [
          { t: 'N-gram & neural LMs', d: 'from counts to networks.' },
          { t: 'Beam search & nucleus sampling', d: 'greedy vs. diverse decoding.' },
          { t: 'Temperature', d: 'the creativity dial.' },
        ]},
        { t: 'NLP Tasks', tag: 'applied', d: 'The jobs language models actually do.', pts: [
          { t: 'Sentiment, NER, POS', d: 'classify, extract, tag.' },
          { t: 'Translation & summarization', d: 'sequence in, sequence out.' },
          { t: 'Question answering', d: 'find or generate the answer.' },
        ]},
        { t: 'RAG', tag: 'modern', d: 'Give an LLM a search engine — retrieve facts, then generate grounded answers.', pts: [
          { t: 'Vector databases', d: 'FAISS, Pinecone, Chroma, Weaviate.' },
          { t: 'Chunking & retrieval', d: 'split docs, embed, fetch the nearest.' },
          { t: 'Re-ranking & pipelines', d: 'assemble the full RAG loop.' },
        ]},
      ],
    },

    /* 8 ── Transformers & LLMs ───────────────────────────── */
    'transformers': {
      title: 'Transformers & LLMs', color: '#A855F7',
      blurb: 'The architecture behind modern AI. Watch attention connect tokens above, then trace the model families.',
      sections: [
        { t: 'Transformer Architecture', tag: 'start here', d: 'Attention replaced recurrence. Hover the tokens above to see which words attend to which.', pts: [
          { t: 'Self- & multi-head attention', d: 'every token looks at every other.' },
          { t: 'Positional encodings', d: 'sinusoidal, learned, RoPE — order without recurrence.' },
          { t: 'Encoder / decoder', d: 'BERT-style vs. GPT-style stacks.' },
          { t: 'Residuals & layer norm', d: 'what makes deep stacks trainable.' },
        ]},
        { t: 'BERT Family', tag: 'encoder', d: 'Read the whole sentence at once — great for understanding tasks.', pts: [
          { t: 'Pre-training (MLM, NSP)', d: 'fill in masked words.' },
          { t: 'RoBERTa, ALBERT, DistilBERT', d: 'faster, lighter variants.' },
        ]},
        { t: 'GPT Family', tag: 'decoder', d: 'Predict the next token — the recipe behind ChatGPT.', pts: [
          { t: 'GPT-1 → GPT-4 evolution', d: 'scale changed everything.' },
          { t: 'Scaling laws & emergence', d: 'abilities that appear only at size.' },
        ]},
        { t: 'Other Architectures', tag: 'variants', d: 'Not everything is encoder-only or decoder-only.', pts: [
          { t: 'T5 & BART', d: 'encoder-decoder for translation and summarisation.' },
          { t: 'Longformer, XLNet', d: 'longer context, different objectives.' },
        ]},
        { t: 'LLM Training', tag: 'build', d: 'How a base model becomes a helpful assistant.', pts: [
          { t: 'Pre-training', d: 'next-token prediction on a curated corpus.' },
          { t: 'Fine-tuning & LoRA/QLoRA', d: 'adapt cheaply with a few parameters.' },
          { t: 'Instruction tuning', d: 'teach it to follow prompts.' },
        ]},
        { t: 'LLM Inference', tag: 'serving', d: 'Make a huge model fast and cheap enough to run.', pts: [
          { t: 'Quantization', d: 'INT8, INT4, GGUF — smaller weights.' },
          { t: 'KV caching & speculative decoding', d: 'skip redundant work.' },
          { t: 'vLLM, TensorRT-LLM', d: 'production serving engines.' },
        ]},
      ],
    },

    /* 9 ── LLM & Agents Lab ──────────────────────────────── */
    'llm-agents': {
      title: 'LLM & Agents Lab', color: '#818CF8',
      blurb: 'Make LLMs act, not just answer. Orchestrate tool-using agents above, then study the patterns.',
      sections: [
        { t: 'Prompt Engineering', tag: 'start here', d: 'The cheapest way to change model behaviour — change the prompt.', pts: [
          { t: 'Zero-/few-shot', d: 'examples in the prompt steer the output.' },
          { t: 'Chain-of-thought', d: '“let’s think step by step.”' },
          { t: 'Self-consistency & ToT', d: 'sample many reasoning paths, vote.' },
        ]},
        { t: 'AI Agents', tag: 'core', d: 'An LLM in a loop with memory, tools and a goal.', pts: [
          { t: 'Plan → act → observe', d: 'the agent control loop.' },
          { t: 'Multi-agent systems', d: 'agents that talk to each other.' },
          { t: 'Frameworks', d: 'LangChain, LlamaIndex, CrewAI, AutoGen.' },
        ]},
        { t: 'Tool Use & Function Calling', tag: 'capability', d: 'Let the model call code, APIs and search.', pts: [
          { t: 'Function calling', d: 'the model picks a tool and its arguments.' },
          { t: 'Code execution', d: 'agents that write and run programs.' },
        ]},
        { t: 'Agent Memory', tag: 'state', d: 'What the agent remembers between and within tasks.', pts: [
          { t: 'Short- vs. long-term', d: 'context window vs. vector DB.' },
          { t: 'Episodic / semantic / procedural', d: 'events, facts and skills.' },
        ]},
        { t: 'Agent Evaluation', tag: 'quality', d: 'Judge the whole trajectory, not just the final answer.', pts: [
          { t: 'Trajectory & task metrics', d: 'did it get there, and how.' },
          { t: 'Safety & alignment', d: 'keep autonomous agents in bounds.' },
        ]},
        { t: 'Building Production Agents', tag: 'ship it', d: 'The engineering around the model that makes it reliable.', pts: [
          { t: 'Orchestration & error handling', d: 'retries, fallbacks, human-in-the-loop.' },
          { t: 'Cost & latency', d: 'budget tokens and time.' },
        ]},
      ],
    },

    /* 10 ── Generative AI ────────────────────────────────── */
    'generative': {
      title: 'Generative AI', color: '#FB7185',
      blurb: 'Create across every modality. Scrub the diffusion denoiser above, then survey text, image, audio and video.',
      sections: [
        { t: 'Text Generation', tag: 'language', d: 'Shape an LLM to your domain and your preferences.', pts: [
          { t: 'Domain fine-tuning', d: 'specialise a base model.' },
          { t: 'RLHF & Constitutional AI', d: 'align to human feedback and rules.' },
          { t: 'DPO', d: 'simpler preference optimisation.' },
        ]},
        { t: 'Image Generation', tag: 'vision', d: 'Denoise structure out of noise. See the diffusion scrubber above.', pts: [
          { t: 'Stable Diffusion, DALL·E', d: 'prompt-to-image diffusion models.' },
          { t: 'ControlNet & LoRA', d: 'guide and personalise generation.' },
          { t: 'Inpainting & img2img', d: 'edit and transform existing images.' },
        ]},
        { t: 'Audio & Speech', tag: 'sound', d: 'Generate and transcribe voice and music.', pts: [
          { t: 'TTS (Tacotron, Bark)', d: 'text to natural speech.' },
          { t: 'STT (Whisper)', d: 'speech to text.' },
          { t: 'Music (MusicLM, Suno)', d: 'prompt to song.' },
        ]},
        { t: 'Video Generation', tag: 'frontier', d: 'The hardest modality — space and time together.', pts: [
          { t: 'Sora, Runway, Pika', d: 'text-to-video diffusion.' },
          { t: 'Temporal consistency', d: 'keep frames coherent over time.' },
        ]},
        { t: 'Multimodal Models', tag: 'unified', d: 'One model across images, text and sound.', pts: [
          { t: 'CLIP, BLIP, LLaVA, GPT-4V', d: 'vision + language.' },
          { t: 'Any-to-any architectures', d: 'toward unified multimodal models.' },
        ]},
        { t: 'Generative AI Applications', tag: 'applied', d: 'Where generation creates real value.', pts: [
          { t: 'Content & synthetic data', d: 'create, and create training data.' },
          { t: 'Code generation', d: 'Copilot, CodeT5.' },
          { t: 'Science', d: 'drug discovery, material design.' },
        ]},
      ],
    },

    /* 11 ── Explainable AI ───────────────────────────────── */
    'xai': {
      title: 'Explainable AI (XAI)', color: '#F59E0B',
      blurb: 'Open the black box. Toggle features and watch SHAP move the decision above, then learn every method.',
      sections: [
        { t: 'Model Interpretability', tag: 'start here', d: 'Two roads: models that are clear by design, or explanations bolted on after.', pts: [
          { t: 'Inherent interpretability', d: 'linear models and decision trees you can read.' },
          { t: 'LIME & SHAP', d: 'post-hoc explanations for any model — try SHAP above.' },
          { t: 'Feature importance & PDPs', d: 'what mattered, and how it bends the output.' },
        ]},
        { t: 'Attention Visualization', tag: 'transformers', d: 'See what a transformer looked at.', pts: [
          { t: 'Attention maps', d: 'token-to-token weight heatmaps.' },
          { t: 'Token attribution', d: 'credit the input tokens for an output.' },
        ]},
        { t: 'Concept-Based Explanations', tag: 'advanced', d: 'Explain in human concepts, not raw features.', pts: [
          { t: 'TCAV', d: 'test whether a concept drives a prediction.' },
          { t: 'Probing classifiers', d: 'what a layer has learned to encode.' },
        ]},
        { t: 'Fairness & Bias Detection', tag: 'critical', d: 'Explanations are also an audit — find who the model treats unfairly.', pts: [
          { t: 'Demographic parity, equalized odds', d: 'formal fairness criteria.' },
          { t: 'Fairlearn, AIF360', d: 'toolkits for auditing bias.' },
        ]},
        { t: 'XAI for LLMs', tag: 'frontier', d: 'Reverse-engineer what’s happening inside a language model.', pts: [
          { t: 'Logit lens & attention heads', d: 'peek at intermediate predictions.' },
          { t: 'Mechanistic interpretability', d: 'circuits and superposition.' },
          { t: 'Sparse autoencoders', d: 'pull out human-readable features.' },
        ]},
      ],
    },

    /* 12 ── Systems & Research ───────────────────────────── */
    'research': {
      title: 'Systems & Research', color: '#8B8CF6',
      blurb: 'How the field advances — and how to work at its edge. Run the statistical tools above, then read the frontier.',
      sections: [
        { t: 'AI Research Methodology', tag: 'start here', d: 'Read, reproduce, then push. The habits of a researcher.', pts: [
          { t: 'Papers & reproducibility', d: 'literature review, replicating results.' },
          { t: 'Benchmarks', d: 'GLUE, MMLU, HumanEval.' },
          { t: 'Ablation studies', d: 'remove a piece to prove it matters.' },
        ]},
        { t: 'Scaling Laws & Efficiency', tag: 'core', d: 'More compute predictably buys more capability — up to a point.', pts: [
          { t: 'Compute-optimal (Chinchilla)', d: 'balance model size and data.' },
          { t: 'Pruning & distillation', d: 'shrink models without losing much.' },
          { t: 'Mixture of Experts', d: 'route each token to a few sub-networks.' },
        ]},
        { t: 'Advanced Architectures', tag: 'frontier', d: 'What might come after the transformer.', pts: [
          { t: 'State space models (Mamba, S4)', d: 'linear-time sequence models.' },
          { t: 'RetNet, RWKV', d: 'linear-attention alternatives.' },
          { t: 'Test-time compute (o1, o3)', d: 'think longer to reason better.' },
        ]},
        { t: 'Multimodal Research', tag: 'frontier', d: 'Beyond single modalities toward world models.', pts: [
          { t: 'Any-to-any models', d: 'unified across modalities.' },
          { t: 'World models & embodied AI', d: 'agents that model and act in environments.' },
        ]},
        { t: 'AI Safety & Alignment', tag: 'critical', d: 'Make powerful systems do what we actually want.', pts: [
          { t: 'Red-teaming & robustness', d: 'attack it before others do.' },
          { t: 'Interpretability', d: 'understand to control.' },
          { t: 'Governance & policy', d: 'the rules around deployment.' },
        ]},
      ],
    },

    /* 13 ── Code & Stack ─────────────────────────────────── */
    'programming': {
      title: 'Code & Stack', color: '#F59E0B',
      blurb: 'The developer toolkit under every model. Run code and compare stacks above, then map the ecosystem.',
      sections: [
        { t: 'Python for AI', tag: 'start here', d: 'The lingua franca of ML — and its scientific stack.', pts: [
          { t: 'Core Python', d: 'OOP and functional style.' },
          { t: 'NumPy, Pandas, scikit-learn', d: 'the classic data + ML libraries.' },
        ]},
        { t: 'Deep Learning Frameworks', tag: 'core', d: 'Where tensors meet autograd and GPUs.', pts: [
          { t: 'PyTorch', d: 'tensors, autograd, nn.Module, DataLoader.' },
          { t: 'TensorFlow / Keras', d: 'model API and training loops.' },
          { t: 'JAX / Flax', d: 'functional, XLA-compiled.' },
        ]},
        { t: 'MLOps Tools', tag: 'workflow', d: 'Track experiments and version everything.', pts: [
          { t: 'W&B, MLflow, TensorBoard', d: 'log runs and metrics.' },
          { t: 'DVC, Git LFS', d: 'version data and models.' },
          { t: 'Docker for ML', d: 'reproducible environments.' },
        ]},
        { t: 'APIs & Serving', tag: 'deploy', d: 'Wrap a model in an endpoint others can call.', pts: [
          { t: 'FastAPI / Flask', d: 'serve predictions over HTTP.' },
          { t: 'REST vs. gRPC', d: 'pick the protocol.' },
          { t: 'Batch vs. real-time', d: 'throughput vs. latency.' },
        ]},
        { t: 'Cloud Platforms', tag: 'scale', d: 'Run training and inference on managed infra.', pts: [
          { t: 'SageMaker, Vertex, Azure ML', d: 'end-to-end ML platforms.' },
          { t: 'Serverless inference', d: 'Lambda, Cloud Functions.' },
        ]},
        { t: 'Version Control & Collaboration', tag: 'craft', d: 'Ship ML code that a team can trust.', pts: [
          { t: 'Git for data science', d: 'branch, review, merge.' },
          { t: 'Testing & linting ML code', d: 'quality gates for notebooks and pipelines.' },
        ]},
      ],
    },

    /* 14 ── ETL & Data Engineering ───────────────────────── */
    'etl': {
      title: 'ETL & Data Engineering', color: '#22D3EE',
      blurb: 'Move and shape data at scale. Wire up the DAG above, then learn each stage of the pipeline.',
      sections: [
        { t: 'Data Ingestion', tag: 'start here', d: 'Get data in — in batches or as it streams.', pts: [
          { t: 'Batch vs. streaming', d: 'scheduled loads vs. continuous flow.' },
          { t: 'APIs, scraping, DB extract', d: 'the common sources.' },
          { t: 'File formats', d: 'CSV, JSON, Parquet, Avro, ORC.' },
        ]},
        { t: 'Data Transformation', tag: 'core', d: 'Clean and reshape raw data into usable tables.', pts: [
          { t: 'ETL vs. ELT', d: 'transform before or after loading.' },
          { t: 'Pandas, Spark, dbt', d: 'transformation engines by scale.' },
          { t: 'Validation', d: 'Great Expectations, Pandera.' },
        ]},
        { t: 'Data Orchestration', tag: 'core', d: 'Schedule and wire pipelines into DAGs — build one above.', pts: [
          { t: 'Airflow, Prefect, Dagster', d: 'the orchestrators.' },
          { t: 'Scheduling & dependencies', d: 'run steps in the right order.' },
        ]},
        { t: 'Big Data Processing', tag: 'scale', d: 'When data no longer fits on one machine.', pts: [
          { t: 'Apache Spark (PySpark)', d: 'distributed DataFrames and SQL.' },
          { t: 'Dask', d: 'parallel Python.' },
        ]},
        { t: 'Data Lakes & Warehouses', tag: 'storage', d: 'Where processed data lives to be queried.', pts: [
          { t: 'Lakehouse (Delta, Iceberg, Hudi)', d: 'warehouse reliability on a lake.' },
          { t: 'S3, GCS, Azure Blob', d: 'cloud object storage.' },
          { t: 'BigQuery, Snowflake, Athena', d: 'query engines.' },
        ]},
        { t: 'Feature Stores', tag: 'ml-ops', d: 'Serve the same features to training and production.', pts: [
          { t: 'Feast, Tecton', d: 'offline vs. online features.' },
          { t: 'Versioning & monitoring', d: 'keep features consistent.' },
        ]},
      ],
    },

    /* 15 ── MLOps ────────────────────────────────────────── */
    'mlops': {
      title: 'MLOps', color: '#34D399',
      blurb: 'From notebook to production and back. Watch drift on the monitor above, then run the full lifecycle.',
      sections: [
        { t: 'ML Lifecycle Management', tag: 'start here', d: 'A repeatable process, not a one-off script.', pts: [
          { t: 'CRISP-ML', d: 'the standard project lifecycle.' },
          { t: 'Notebook → pipeline', d: 'productionise the experiment.' },
        ]},
        { t: 'Experiment Tracking & Registry', tag: 'core', d: 'Know exactly which model, data and params produced a result.', pts: [
          { t: 'MLflow tracking & registry', d: 'log runs, promote models.' },
          { t: 'Artifact management', d: 'store weights and metrics.' },
        ]},
        { t: 'Model Training at Scale', tag: 'scale', d: 'Train models too big for one GPU.', pts: [
          { t: 'Data / model / pipeline parallel', d: 'ways to split the work.' },
          { t: 'DeepSpeed, FSDP, Horovod', d: 'distributed training libraries.' },
          { t: 'Spot & checkpointing', d: 'cheap compute, resumable runs.' },
        ]},
        { t: 'Model Deployment', tag: 'ship it', d: 'Roll models out safely.', pts: [
          { t: 'Shadow, canary, A/B', d: 'de-risk the rollout.' },
          { t: 'TorchServe, Triton, BentoML', d: 'serving frameworks.' },
          { t: 'Edge & mobile', d: 'TF Lite, Core ML.' },
        ]},
        { t: 'Monitoring & Observability', tag: 'critical', d: 'Models decay silently — watch for it. See the drift monitor above.', pts: [
          { t: 'Data / concept / label drift', d: 'the world moves; the model doesn’t.' },
          { t: 'Latency & throughput', d: 'performance in production.' },
          { t: 'Evidently, WhyLabs, Arize', d: 'monitoring and alerting tools.' },
        ]},
        { t: 'CI/CD for ML', tag: 'automation', d: 'Automate testing, training and deployment.', pts: [
          { t: 'GitOps & Kubeflow Pipelines', d: 'declarative ML pipelines.' },
          { t: 'Automated retraining', d: 'triggers on drift or schedule.' },
          { t: 'Testing ML systems', d: 'unit, integration, model quality.' },
        ]},
        { t: 'Governance & Compliance', tag: 'trust', d: 'Document and audit models for the real world.', pts: [
          { t: 'Model cards & datasheets', d: 'document intent and limits.' },
          { t: 'Lineage & audit trails', d: 'trace every decision.' },
          { t: 'Regulatory compliance', d: 'meet the rules in production.' },
        ]},
      ],
    },
  };

  // ---- icon (simple, colour-inherited) ----
  const ICON = '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="10" cy="10" r="2.2" fill="currentColor"/></svg>';

  function esc(s) { return s; }

  function renderModule(key, idx) {
    const m = CURRICULUM[key];
    if (!m) return '';
    const items = m.sections.map((s, i) => {
      const num = String(i + 1).padStart(2, '0');
      const pts = (s.pts || []).map(p =>
        `<li><b>${p.t}</b> — ${p.d}</li>`).join('');
      const open = i === 0 ? ' open' : '';
      return `<div class="curr-item${open}">
        <button class="curr-item-head" type="button" aria-expanded="${i === 0}">
          <span class="curr-num">${num}</span>
          <span class="curr-t">${s.t}</span>
          ${s.tag ? `<span class="curr-badge">${s.tag}</span>` : ''}
          <svg class="curr-chev" width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="curr-item-body"><div class="curr-item-inner">
          <p class="curr-d">${s.d}</p>
          ${pts ? `<ul class="curr-pts">${pts}</ul>` : ''}
        </div></div>
      </div>`;
    }).join('');

    return `<div class="curr-mod" style="--c:${m.color}">
      <div class="curr-mod-head">
        <span class="curr-ic">${ICON}</span>
        <div class="curr-mod-title">
          <h2>${m.title}</h2>
          <p>${m.blurb}</p>
        </div>
        <span class="curr-count">${m.sections.length} topics</span>
      </div>
      <div class="curr-list">${items}</div>
    </div>`;
  }

  function mount(el) {
    const keys = (el.dataset.curriculum || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!keys.length) return;
    const heading = el.dataset.currHeading;
    let html = '';
    if (heading !== 'none') {
      html += `<div class="curr-head">
        <span class="eyebrow">Curriculum</span>
        <h2>${heading || 'Every topic in this module'}</h2>
        <p class="muted">Expand any topic for a one-line brief and its sub-sections — the full map from foundations to the frontier.</p>
      </div>`;
    }
    html += keys.map(renderModule).join('');
    el.innerHTML = `<div class="curr">${html}</div>`;

    // accordion behaviour (event delegation)
    el.addEventListener('click', (e) => {
      const head = e.target.closest('.curr-item-head');
      if (!head) return;
      const item = head.parentElement;
      const isOpen = item.classList.toggle('open');
      head.setAttribute('aria-expanded', isOpen);
    });
  }

  function init() {
    document.querySelectorAll('[data-curriculum]').forEach(mount);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  // expose for pages that want the data (e.g. hub counts)
  window.ATLAS_CURRICULUM = CURRICULUM;
})();
