
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
  // card = { tag, title, lead, pts:[ [term, desc] ], detail?:{...} }
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
        ['Components & dimensions', 'one ordered value per measurable feature.'],
        ['Addition & scaling', 'combine directions or change their strength.'],
        ['Magnitude & distance', 'measure vector length and separation.'],
        ['Unit vectors', 'keep direction while normalizing length to one.'],
        ['Dot product & cosine', 'measure alignment and semantic similarity.'],
        ['Projection', 'resolve one vector along the direction of another.'],
      ], detail: {
        intro: 'A vector is an ordered list of numbers with both magnitude and direction. In machine learning, those numbers may represent raw features, model weights, gradients, pixels, or learned embeddings.',
        concepts: [
          { n: '01', title: 'Representation', body: 'A vector in ℝⁿ has n components. Each component occupies a fixed dimension, so its meaning depends on the coordinate system or feature schema.', formula: 'x = [x₁, x₂, …, xₙ] ∈ ℝⁿ', note: 'Example: a house can be represented as [area, bedrooms, age].' },
          { n: '02', title: 'Addition & scalar multiplication', body: 'Add vectors component by component. Multiplying by a scalar stretches, shrinks, or reverses a vector without changing the line it lies on.', formula: 'u + v = [u₁+v₁, …, uₙ+vₙ]   ·   αu = [αu₁, …, αuₙ]', note: 'Neural networks repeatedly form weighted sums of vectors.' },
          { n: '03', title: 'Magnitude, normalization & distance', body: 'The L2 norm measures length. Dividing by that norm creates a unit vector. The norm of a difference measures Euclidean distance.', formula: '‖v‖₂ = √Σvᵢ²   ·   v̂ = v/‖v‖₂   ·   d(u,v) = ‖u−v‖₂', note: 'Normalization lets direction matter independently of scale.' },
          { n: '04', title: 'Dot product & cosine similarity', body: 'The dot product mixes length with alignment. Cosine similarity removes length and compares direction only: 1 means aligned, 0 perpendicular, and −1 opposite.', formula: 'u·v = Σuᵢvᵢ = ‖u‖‖v‖cosθ   ·   cosθ = (u·v)/(‖u‖‖v‖)', note: 'Embedding search ranks documents using this geometric idea.' },
          { n: '05', title: 'Projection', body: 'Projection asks how much of one vector points along another. It splits a signal into a component explained by a chosen direction and a perpendicular remainder.', formula: 'projᵥ(u) = ((u·v)/(v·v))v', note: 'Projection underlies least squares, attention scores, and PCA.' },
          { n: '06', title: 'Vectors throughout AI', body: 'A dataset row is a feature vector; a neural layer transforms activation vectors; training follows gradient vectors; language and images become embedding vectors.', formula: 'features → activations → embeddings → gradients', note: 'The interpretation changes, but the same vector operations remain.' },
        ],
        example: {
          title: 'Worked example: the playground’s starting vectors',
          setup: 'Let u = (2, 1) and v = (−1, 2).',
          steps: [
            ['Add', 'u + v = (2−1, 1+2) = (1, 3)'],
            ['Measure', '‖u‖ = ‖v‖ = √5 ≈ 2.24'],
            ['Compare', 'u·v = 2(−1) + 1(2) = 0'],
            ['Interpret', 'A zero dot product means θ = 90°: the vectors are perpendicular.'],
          ],
        },
        practice: [
          ['Align them', 'Drag v into the same direction as u. The dot product becomes positive and cosine approaches 1.'],
          ['Make them perpendicular', 'Find another placement where the dot product is exactly zero.'],
          ['Reverse direction', 'Point v against u. The dot product becomes negative and the angle exceeds 90°.'],
          ['Build the parallelogram', 'Toggle u + v and connect vector addition to the diagonal rule.'],
        ],
      }},
      tensor: { tag: 'linear algebra · dimensions', title: 'Tensors — data with shape', lead: 'Scalars, vectors, matrices and higher-dimensional arrays are all tensors. This topic follows how shape, axes, indexing and broadcasting organize data for neural networks.', pts: [
        ['Rank & shape', 'scalar → vector → matrix → higher-order tensor.'],
        ['Axes & indexing', 'address values across batches, channels and features.'],
        ['Reshape & transpose', 'change views and reorder dimensions safely.'],
        ['Broadcasting', 'combine compatible shapes without copying data.'],
        ['Tensor operations', 'element-wise math, reductions and contractions.'],
        ['AI data layouts', 'batches, images, sequences and attention heads.'],
      ]},
      matops: { tag: 'linear algebra · computation', title: 'Matrix operations', lead: 'Matrices store structured numbers and compose linear relationships. Learn the operations used by every dense layer, embedding lookup and attention block.', pts: [
        ['Shape compatibility', 'why inner dimensions must agree.'],
        ['Matrix multiplication', 'row-by-column weighted combinations.'],
        ['Transpose', 'swap axes to change how dimensions align.'],
        ['Identity & inverse', 'do nothing, or undo a transformation.'],
        ['Systems of equations', 'solve Ax = b.'],
        ['Batched multiplication', 'apply the same operation across many examples.'],
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
      eigen: { tag: 'linear algebra · structure', title: 'Eigenvalues, eigenvectors & PCA', lead: 'Some directions survive a matrix transformation without turning. Those eigenvectors reveal stable structure; PCA uses them to find the directions containing the most variation.', pts: [
        ['Eigenvectors', 'directions preserved by a transformation.'],
        ['Eigenvalues', 'the scale applied along each eigenvector.'],
        ['Eigendecomposition', 'factor a matrix into its natural axes.'],
        ['Covariance matrix', 'how features vary together.'],
        ['Principal components', 'orthogonal directions of maximum variance.'],
        ['Dimensionality reduction', 'compress while preserving useful structure.'],
      ]},
      calc: { tag: 'calculus · change', title: 'Calculus for learning systems', lead: 'Machine learning depends on measuring change. Build intuition for slopes, partial derivatives and the chain rule before using them to train a model.', pts: [
        ['Functions & limits', 'describe relationships and local behavior.'],
        ['Derivative', 'instantaneous rate of change.'],
        ['Partial derivatives', 'change one input while holding others fixed.'],
        ['Chain rule', 'differentiate nested computations.'],
        ['Gradient & Jacobian', 'derivatives of multivariable functions.'],
        ['Backpropagation', 'reuse the chain rule through a computation graph.'],
      ]},
      prob: { tag: 'probability · uncertainty', title: 'Probability for machine learning', lead: 'Probability gives models a language for uncertainty. Move from events and conditional probability to Bayes’ rule and the distributions used in learning.', pts: [
        ['Events & sample spaces', 'describe possible outcomes.'],
        ['Joint, marginal & conditional', 'different views of related variables.'],
        ['Bayes’ rule', 'update beliefs using evidence.'],
        ['Random variables', 'map uncertain outcomes to numbers.'],
        ['Common distributions', 'Bernoulli, categorical, Gaussian and more.'],
        ['Expectation & variance', 'summarize center, spread and risk.'],
      ]},
      stats: { tag: 'probability · statistics', title: 'Distributions & uncertainty', lead: 'Reasoning under uncertainty. Slide μ and σ below to reshape the normal curve and see the 68–95–99.7 empirical rule appear.', pts: [
        ['Distributions', 'how outcomes spread out.'],
        ['Mean & variance', 'center and spread.'],
        ['Empirical rule', '68 / 95 / 99.7% within 1 / 2 / 3σ.'],
        ['Sampling', 'estimate a population from observations.'],
        ['Confidence intervals', 'express uncertainty around an estimate.'],
        ['Hypothesis tests', 'separate evidence from random variation.'],
      ]},
      info: { tag: 'information theory', title: 'Information, surprise & learning', lead: 'Information theory measures uncertainty and the cost of being wrong. It connects probability distributions directly to the losses used to train classifiers and language models.', pts: [
        ['Self-information', 'rare events carry more surprise.'],
        ['Entropy', 'average uncertainty in a distribution.'],
        ['Cross-entropy', 'penalize predictions that miss the target distribution.'],
        ['KL divergence', 'measure how one distribution differs from another.'],
        ['Mutual information', 'how much two variables reveal about each other.'],
        ['Compression & coding', 'short codes for likely events.'],
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
      clean: { tag: 'data quality', title: 'Clean before you calculate', lead: 'Real datasets contain missing fields, duplicate records and extreme values. Apply explicit cleaning rules and inspect exactly what changed.', pts: [
        ['Missing values', 'drop, impute, or preserve with a reason.'],
        ['Duplicates', 'define the key before removing repeats.'],
        ['Outliers', 'investigate, cap, transform, or retain.'],
        ['Type & category checks', 'make values consistent and valid.'],
        ['Data lineage', 'record every transformation.'],
        ['Leakage prevention', 'fit cleaning rules on training data only.'],
      ]},
      eda: { tag: 'exploratory analysis', title: 'Learn the shape of the data', lead: 'Explore distributions before modeling. Filter the orders dataset and watch its center, spread, skew and outliers respond.', pts: [
        ['Summary statistics', 'mean, median, range and quantiles.'],
        ['Distributions', 'see concentration, skew and multiple modes.'],
        ['Segmentation', 'compare meaningful slices of the data.'],
        ['Outlier detection', 'use context alongside statistical rules.'],
        ['Questions before charts', 'let the decision choose the view.'],
        ['EDA vs confirmation', 'discover patterns, then test them separately.'],
      ]},
      dash: { tag: 'bi dashboard', title: 'Dashboards that cross-filter', lead: 'Turn queries into a picture. Click a region below and watch every KPI and chart update in real time.', pts: [
        ['KPIs', 'the headline numbers that matter.'],
        ['Cross-filtering', 'one click, every view responds.'],
        ['Chart choice', 'the right encoding for the question.'],
        ['EDA', 'distributions, correlation, outliers.'],
      ]},
      dist: { tag: 'descriptive statistics', title: 'Reason with distributions', lead: 'Move the mean and standard deviation to see how location and spread reshape a normal distribution and its familiar probability bands.', pts: [
        ['Center', 'mean, median and mode summarize location.'],
        ['Spread', 'variance, standard deviation and IQR.'],
        ['Normal distribution', 'a symmetric model for continuous values.'],
        ['Standard scores', 'express distance in standard deviations.'],
        ['Empirical rule', '68–95–99.7% within one, two and three σ.'],
        ['Assumptions', 'check shape before using normal-theory tools.'],
      ]},
      corr: { tag: 'relationships', title: 'Measure variables moving together', lead: 'Control the underlying relationship and noise to see what Pearson correlation captures—and what it cannot establish.', pts: [
        ['Scatterplots', 'inspect form, direction and unusual points.'],
        ['Covariance', 'signed joint variation.'],
        ['Pearson r', 'standardized linear association from −1 to 1.'],
        ['R²', 'variance explained by a linear relationship.'],
        ['Nonlinear patterns', 'strong relationships can still have r near zero.'],
        ['Correlation ≠ causation', 'confounding and direction remain unresolved.'],
      ]},
      ab: { tag: 'experimentation', title: 'Decide whether a lift is real', lead: 'Change traffic and conversions for two variants. The two-proportion test updates conversion rates, uplift and statistical significance immediately.', pts: [
        ['Control & treatment', 'change one deliberate factor.'],
        ['Null hypothesis', 'assume no real difference initially.'],
        ['P-value', 'compatibility of results with the null.'],
        ['Practical significance', 'a real effect must also matter.'],
        ['Sample size & power', 'detect worthwhile effects reliably.'],
        ['Guardrail metrics', 'protect outcomes beyond the primary KPI.'],
      ]},
      time: { tag: 'time series', title: 'Separate trend from seasonality', lead: 'Construct a signal from long-term direction and repeating cycles, then extend those components into a simple forecast horizon.', pts: [
        ['Temporal order', 'past and future cannot be shuffled freely.'],
        ['Trend', 'long-run movement in the series.'],
        ['Seasonality', 'patterns repeating at a known frequency.'],
        ['Lag features', 'use earlier values as predictors.'],
        ['Forecast horizon', 'uncertainty grows farther into the future.'],
        ['Backtesting', 'validate by rolling forward through time.'],
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
      eval: { tag: 'generalization', title: 'Evaluate models on unseen data', lead: 'Adjust model complexity and cross-validation folds to see the gap between fitting the training set and generalizing beyond it.', pts: [
        ['Train / validation / test', 'separate fitting, selection and final evaluation.'],
        ['Cross-validation', 'rotate validation folds for a steadier estimate.'],
        ['Underfitting', 'the model is too simple to capture the signal.'],
        ['Overfitting', 'training improves while validation degrades.'],
        ['Baseline comparison', 'prove the model beats a simple reference.'],
        ['Metric choice', 'match evaluation to the real decision cost.'],
      ]},
      regz: { tag: 'model control', title: 'Constrain complexity with regularization', lead: 'Increase the penalty and watch coefficients shrink. Compare Ridge’s smooth shrinkage with Lasso’s sparse feature selection.', pts: [
        ['L2 · Ridge', 'penalize squared coefficient magnitude.'],
        ['L1 · Lasso', 'encourage exact zeros and sparsity.'],
        ['λ strength', 'trade data fit against simpler weights.'],
        ['Coefficient scale', 'standardize features before comparing penalties.'],
        ['Bias–variance tradeoff', 'accept some bias to reduce instability.'],
        ['Hyperparameter search', 'select λ using validation data.'],
      ]},
      feat: { tag: 'representation', title: 'Make features comparable and useful', lead: 'Transform differently scaled inputs and add an extreme value to see why preprocessing changes distances, optimization and model behavior.', pts: [
        ['Standardization', 'center at zero and scale by standard deviation.'],
        ['Min–max scaling', 'map observed values into a fixed range.'],
        ['Categorical encoding', 'represent labels without inventing order.'],
        ['Feature interactions', 'expose relationships between variables.'],
        ['Leakage-safe transforms', 'fit preprocessing only on training folds.'],
        ['Pipelines', 'apply identical steps during training and inference.'],
      ]},
      anom: { tag: 'unsupervised detection', title: 'Find observations that do not belong', lead: 'Tune sensitivity and compare global distance with local density. Watch recall and false alarms trade places as the detector flags more points.', pts: [
        ['Distance methods', 'flag observations far from the center.'],
        ['Local density', 'compare each point with nearby neighbors.'],
        ['Isolation Forest', 'anomalies are easier to separate.'],
        ['Contamination', 'estimate the expected anomaly rate.'],
        ['Threshold selection', 'balance missed events against alert volume.'],
        ['Human review', 'feed confirmed cases back into the system.'],
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
      act: { tag: 'non-linearity', title: 'Activations shape what a network can learn', lead: 'Change the activation and weight scale. Watch the output curve, local gradient and saturation regime update together.', pts: [
        ['ReLU', 'fast sparse activations with a dead region.'],
        ['Sigmoid & tanh', 'smooth gates that can saturate.'],
        ['GELU', 'a smooth default in modern transformers.'],
        ['Initialization', 'keep signal and gradients at useful scales.'],
      ]},
      opt: { tag: 'training dynamics', title: 'Optimizers navigate the loss landscape', lead: 'Release the parameter point and compare SGD, momentum and Adam as they descend the same curved loss surface.', pts: [
        ['SGD', 'follow the current gradient directly.'],
        ['Momentum', 'accumulate velocity through shallow valleys.'],
        ['Adam', 'adapt the step size per parameter.'],
        ['Learning rate', 'too small crawls; too large oscillates.'],
      ]},
      reg: { tag: 'generalization', title: 'Control capacity before it memorizes', lead: 'Balance model capacity, dropout and weight decay. The live curves show the gap between fitting the training set and generalizing.', pts: [
        ['Dropout', 'randomly mask units during training.'],
        ['Weight decay', 'discourage unnecessarily large weights.'],
        ['Early stopping', 'stop when validation loss turns upward.'],
        ['Data augmentation', 'teach invariances with transformed examples.'],
      ]},
      transfer: { tag: 'reuse', title: 'Fine-tune a pretrained backbone', lead: 'Freeze early feature extractors, choose how much data you have, and see the tradeoff between trainable parameters, time and accuracy.', pts: [
        ['Frozen backbone', 'reuse generic learned features cheaply.'],
        ['Fine-tuning', 'adapt later layers with a small learning rate.'],
        ['Domain shift', 'unfreeze more when the new task differs.'],
        ['Small datasets', 'transfer reduces the amount of labelled data needed.'],
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
      ngram: { tag: 'language modelling', title: 'Predict from counted context', lead: 'Before neural language models, N-grams predicted the next word by counting how often short contexts appeared in a corpus.', pts: [
        ['Unigram', 'predict from overall word frequency.'],
        ['Bigram & trigram', 'condition on one or two prior words.'],
        ['Sparsity', 'longer contexts are specific but rarely observed.'],
        ['Smoothing', 'reserve probability for unseen sequences.'],
      ]},
      embed: { tag: 'representation', title: 'Meaning becomes geometry', lead: 'Choose an anchor and inspect its semantic neighbourhood. Words used in similar contexts settle near one another in vector space.', pts: [
        ['Dense vectors', 'a learned coordinate for each word.'],
        ['Cosine similarity', 'compare direction rather than magnitude.'],
        ['Semantic neighbourhoods', 'related usage produces nearby vectors.'],
        ['Vector relationships', 'directions can encode useful analogies.'],
      ]},
      cls: { tag: 'nlp task', title: 'Classify text from its evidence', lead: 'Edit the review and watch individual words push a sentiment decision positive or negative.', pts: [
        ['Text features', 'turn tokens into predictive evidence.'],
        ['Negation', 'context can reverse a word’s polarity.'],
        ['Thresholds', 'the operating point changes the final label.'],
        ['Confidence', 'probability is not the same as correctness.'],
      ]},
      ner: { tag: 'information extraction', title: 'Find named entities in context', lead: 'Entity recognition identifies spans such as people, organisations, places and dates, then assigns each a type.', pts: [
        ['Span detection', 'find where an entity starts and ends.'],
        ['Entity typing', 'assign person, organisation, place or time.'],
        ['Domain schemas', 'medical and legal text need specialised labels.'],
        ['Context', 'the same surface word can mean different things.'],
      ]},
      seq2seq: { tag: 'conditional generation', title: 'Decode an output sequence', lead: 'Step through translation as a decoder scores several candidate continuations and keeps the strongest beams.', pts: [
        ['Encoder', 'compress the source into contextual features.'],
        ['Autoregressive decoder', 'produce one target token at a time.'],
        ['Beam search', 'keep several promising partial sequences.'],
        ['Sequence score', 'balance token likelihood across the output.'],
      ]},
    }},

    /* 8 ── Transformers & LLMs ── */
    'transformers': { color: '#A855F7', mode: 'tabs', panels: {
      attn: { tag: 'architecture', title: 'Self-attention', lead: 'Every token looks at every other and decides what to focus on. Select a token below to inspect its attention weights.', pts: [
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
      pos: { tag: 'sequence order', title: 'Give attention a sense of position', lead: 'Attention alone cannot tell first from last. Compare sinusoidal, learned and rotary position signals across a sequence.', pts: [
        ['Sinusoidal encoding', 'fixed waves at several frequencies.'],
        ['Learned positions', 'a trainable lookup table.'],
        ['RoPE', 'rotate queries and keys by position.'],
        ['Relative distance', 'often matters more than absolute index.'],
      ]},
      block: { tag: 'architecture', title: 'Walk through a transformer block', lead: 'Advance a signal through attention, residual connections, normalization and the position-wise feed-forward network.', pts: [
        ['Attention', 'mix information across tokens.'],
        ['Residual paths', 'preserve the original signal.'],
        ['Layer normalization', 'keep activations well scaled.'],
        ['Feed-forward network', 'transform each token independently.'],
      ]},
      next: { tag: 'generation', title: 'Next-token prediction', lead: 'A language model is a next-token predictor. Enter a prompt below and watch the probability distribution over what comes next.', pts: [
        ['Softmax over vocab', 'a probability for every token.'],
        ['Temperature', 'sharpen or flatten the choices.'],
        ['Sampling', 'greedy, beam, nucleus.'],
        ['Emergence', 'scale unlocks new abilities.'],
      ]},
      context: { tag: 'memory budget', title: 'Fit a conversation into context', lead: 'Adjust the window and see which earlier tokens are retained or truncated when a prompt exceeds the model’s working memory.', pts: [
        ['Context window', 'the tokens visible for one inference.'],
        ['Truncation', 'oldest content may fall out.'],
        ['Token budget', 'input and generated output share capacity.'],
        ['Long-context strategies', 'summarize, chunk or retrieve.'],
      ]},
      rag: { tag: 'retrieval', title: 'RAG & embeddings', lead: 'Give the model a search engine. Embed a query below and retrieve the nearest documents by cosine similarity, then generate a grounded answer.', pts: [
        ['Embeddings', 'text as vectors that cluster by meaning.'],
        ['Vector DB', 'FAISS, Pinecone, Chroma, Weaviate.'],
        ['Chunk & retrieve', 'split docs, fetch the nearest.'],
        ['Re-ranking', 'grounded, cited answers.'],
      ]},
      arch: { tag: 'model families', title: 'Encoder, decoder or both?', lead: 'Switch architectures and inspect the attention mask that determines which tokens can exchange information.', pts: [
        ['Encoder-only', 'bidirectional understanding, like BERT.'],
        ['Decoder-only', 'causal generation, like GPT.'],
        ['Encoder–decoder', 'conditional generation, like T5.'],
        ['Attention masks', 'control permitted information flow.'],
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
      prompt: { tag: 'prompting', title: 'Design the model’s instructions', lead: 'Edit the system and user roles, choose an output contract, and see how constraints shape model behaviour.', pts: [
        ['System role', 'establish behaviour and boundaries.'],
        ['User role', 'supply the current task and context.'],
        ['Output contracts', 'request concise, stepwise or structured data.'],
        ['Temperature', 'control output variance, not factuality.'],
      ]},
      tools: { tag: 'function calling', title: 'Connect the model to tools', lead: 'Turn a natural-language request into a structured function call, then inspect the result returned to the model.', pts: [
        ['JSON schema', 'define function names and typed arguments.'],
        ['Validation', 'reject malformed or unauthorized calls.'],
        ['Execution', 'the application—not the model—runs the tool.'],
        ['Tool result', 'feed observations back into context.'],
      ]},
      agent: { tag: 'agents', title: 'An LLM in a loop', lead: 'Agents wrap a model with tools and memory. Wire one up below and watch it plan, act, observe and repeat.', pts: [
        ['Plan → act → observe', 'the agent control loop.'],
        ['Tool use', 'function calling — code, APIs, search.'],
        ['Memory', 'context window + vector DB.'],
        ['Multi-agent', 'agents that collaborate.'],
      ]},
      memory: { tag: 'state', title: 'Manage what an agent remembers', lead: 'Add facts, adjust the token budget, and compare sliding-window, summary and vector-retrieval memory strategies.', pts: [
        ['Working memory', 'recent turns inside the context window.'],
        ['Summaries', 'compress older history at a loss of detail.'],
        ['Vector memory', 'retrieve semantically relevant facts.'],
        ['Privacy & expiry', 'store only what is allowed and useful.'],
      ]},
      tune: { tag: 'fine-tuning', title: 'Fine-tune & LoRA', lead: 'Adapt a base model cheaply. Below, see how LoRA injects a few trainable weights instead of retraining the whole network.', pts: [
        ['Full fine-tune vs. PEFT', 'all weights vs. a few.'],
        ['LoRA / QLoRA', 'low-rank adapters, quantised.'],
        ['RLHF & DPO', 'align to human preferences.'],
        ['Fine-tune vs. RAG', 'teach style vs. supply facts.'],
      ]},
      eval: { tag: 'quality & safety', title: 'Gate a model release with evidence', lead: 'Compare candidate models across quality, safety and groundedness, then adjust the release threshold and test-set size.', pts: [
        ['Task metrics', 'measure the capabilities users need.'],
        ['Safety evaluations', 'probe misuse, refusal and harmful outputs.'],
        ['Regression suites', 'repeat stable cases before every release.'],
        ['Human review', 'inspect nuanced quality and high-impact failures.'],
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
      libs: { tag: 'frameworks', title: 'Assemble the AI library stack', lead: 'Choose a project goal and deployment target to see which tools belong in a compact, practical stack.', pts: [
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
      git: { tag: 'version control', title: 'Branch, commit, and merge', lead: 'Change the branching strategy, build a commit history, and merge the work while keeping model code reproducible.', pts: [
        ['Commits', 'small snapshots with useful messages.'],
        ['Branches', 'isolate changes without duplicating files.'],
        ['Merges', 'combine reviewed work safely.'],
        ['Data boundaries', 'version metadata, not large raw datasets.'],
      ]},
      api: { tag: 'service interfaces', title: 'Call an AI service', lead: 'Compose requests, include authentication, and inspect status codes and response payloads.', pts: [
        ['HTTP methods', 'GET, POST, PATCH, and DELETE.'],
        ['Endpoints', 'stable paths around resources.'],
        ['Authentication', 'tokens prove who is calling.'],
        ['Contracts', 'validate request and response schemas.'],
      ]},
      containers: { tag: 'portable runtime', title: 'Package a repeatable service', lead: 'Choose an image profile, replicas, and memory limits to see how containers make the same application portable.', pts: [
        ['Images', 'immutable application and dependency layers.'],
        ['Containers', 'isolated processes created from images.'],
        ['Resource limits', 'bound memory and compute usage.'],
        ['Replicas', 'scale identical service instances.'],
      ]},
      compute: { tag: 'infrastructure', title: 'Match workload to hardware', lead: 'Adjust model size, concurrency, and latency needs to estimate memory and select suitable compute.', pts: [
        ['CPU', 'general-purpose preprocessing and small models.'],
        ['GPU', 'parallel tensor operations.'],
        ['Memory', 'model weights, activations, and batches.'],
        ['Cost', 'right-size before scaling out.'],
      ]},
      test: { tag: 'software quality', title: 'Catch failures before release', lead: 'Inject a data or API fault, change coverage, and run a layered test suite to decide whether a release is safe.', pts: [
        ['Unit tests', 'verify small deterministic functions.'],
        ['Data tests', 'enforce schemas and distributions.'],
        ['Integration tests', 'exercise component boundaries.'],
        ['Smoke tests', 'probe the deployed service quickly.'],
      ]},
    }},

    /* 10 ── Generative AI ── */
    'generative': { color: '#FB7185', mode: 'tabs', panels: {
      generative: { tag: 'diffusion', title: 'Denoising into an image', lead: 'Diffusion models start from pure noise and remove a little at each step until an image emerges. Scrub the denoiser below to watch it happen.', pts: [
        ['Forward process', 'add Gaussian noise during training.'],
        ['Reverse process', 'predict and remove noise during sampling.'],
        ['Prompt conditioning', 'steer the denoiser toward a concept.'],
        ['Guidance scale', 'trade diversity for prompt alignment.'],
      ]},
      schedule: { tag: 'diffusion dynamics', title: 'Schedule signal and noise', lead: 'Compare how linear, cosine and Karras-style schedules distribute useful denoising work across timesteps.', pts: [
        ['Beta schedule', 'control how quickly signal is destroyed.'],
        ['Signal-to-noise ratio', 'what the model can recover at each step.'],
        ['Cosine schedule', 'preserve signal longer early on.'],
        ['Sampler efficiency', 'spend steps where detail changes most.'],
      ]},
      latent: { tag: 'representation', title: 'Navigate latent space', lead: 'Move between concepts and visual styles by interpolating continuous coordinates rather than switching discrete labels.', pts: [
        ['Latent vectors', 'compressed coordinates for generated content.'],
        ['Interpolation', 'blend nearby concepts smoothly.'],
        ['Autoencoder', 'encode pixels, diffuse latents, decode pixels.'],
        ['Semantic directions', 'some axes correlate with meaningful changes.'],
      ]},
      guidance: { tag: 'conditioning', title: 'Balance alignment and diversity', lead: 'Adjust classifier-free guidance and negative prompting to see why stronger conditioning is not always better.', pts: [
        ['Conditional score', 'predict noise using the prompt.'],
        ['Unconditional score', 'provide a diversity baseline.'],
        ['CFG', 'extrapolate toward prompt-conditioned output.'],
        ['Oversaturation', 'very high guidance can create artifacts.'],
      ]},
      prompt: { tag: 'creative control', title: 'Compose a generation prompt', lead: 'Build prompts from subject, composition, medium, lighting and constraints, then compare model-specific additions.', pts: [
        ['Subject first', 'state the central content clearly.'],
        ['Composition & style', 'describe framing and visual medium.'],
        ['Constraints', 'exclude unwanted text or artifacts.'],
        ['Model differences', 'image, audio and video need different cues.'],
      ]},
      control: { tag: 'structural guidance', title: 'Control and inpaint a generation', lead: 'Switch between edge, depth and mask conditioning, then balance structural fidelity against generative freedom.', pts: [
        ['Edge control', 'preserve outlines and pose.'],
        ['Depth control', 'preserve scene geometry.'],
        ['Inpainting', 'regenerate only a masked region.'],
        ['Control strength', 'trade fidelity for creative variation.'],
      ]},
      audio: { tag: 'audio generation', title: 'Generate sound from a prompt', lead: 'Change mood and duration, then regenerate a waveform to see how audio synthesis models create temporal signals.', pts: [
        ['Waveform or codec tokens', 'represent sound for generation.'],
        ['Text conditioning', 'describe instruments, mood and environment.'],
        ['Temporal structure', 'maintain rhythm and long-range form.'],
        ['Applications', 'music, speech, effects and restoration.'],
      ]},
      video: { tag: 'video generation', title: 'Keep generated frames coherent', lead: 'Adjust motion and consistency to explore the tension between visible movement and frame-to-frame stability.', pts: [
        ['Temporal attention', 'connect information across frames.'],
        ['Motion conditioning', 'control camera and subject movement.'],
        ['Identity consistency', 'preserve objects over time.'],
        ['Flicker', 'small frame errors become visible instability.'],
      ]},
    }},

    /* 11 ── Explainable AI ── */
    'xai': { color: '#F59E0B', mode: 'tabs', panels: {
      xai: { tag: 'local attribution', title: 'Attributing a decision', lead: 'Toggle applicant features and watch their SHAP or LIME contributions move one loan prediction away from its baseline.', pts: [
        ['SHAP values', 'sum from baseline to prediction.'],
        ['Positive evidence', 'pushes the decision upward.'],
        ['Negative evidence', 'pushes the decision downward.'],
        ['Local explanation', 'describes this case, not every case.'],
      ]},
      lime: { tag: 'local surrogate', title: 'Fit a simple model nearby', lead: 'Change the perturbation radius and sample count to see how LIME balances locality, stability and fidelity.', pts: [
        ['Perturbations', 'sample synthetic neighbours around one case.'],
        ['Local weights', 'nearby samples matter more.'],
        ['Sparse surrogate', 'fit an interpretable linear approximation.'],
        ['Fidelity', 'measure how well it matches the black box locally.'],
      ]},
      global: { tag: 'global behaviour', title: 'Rank features across the dataset', lead: 'Compare permutation, tree-gain and mean absolute SHAP importance to see how method choice changes the global story.', pts: [
        ['Permutation importance', 'measure performance loss after shuffling.'],
        ['Tree gain', 'count split improvements inside an ensemble.'],
        ['Mean |SHAP|', 'aggregate local attribution magnitudes.'],
        ['Correlated features', 'can divide or hide importance.'],
      ]},
      pdp: { tag: 'feature effects', title: 'Trace partial dependence and ICE', lead: 'Move along a feature and compare the average response curve with individual conditional-expectation paths.', pts: [
        ['PDP', 'average prediction as one feature varies.'],
        ['ICE', 'one curve per individual example.'],
        ['Interactions', 'different ICE slopes reveal heterogeneity.'],
        ['Extrapolation risk', 'avoid regions unsupported by data.'],
      ]},
      gradcam: { tag: 'vision attribution', title: 'See where a CNN looked', lead: 'Change the predicted class, layer depth and opacity to inspect a simplified Grad-CAM heatmap.', pts: [
        ['Activation maps', 'spatial features from a convolutional layer.'],
        ['Class gradients', 'weight maps by relevance to one class.'],
        ['Layer depth', 'trade detail for semantic abstraction.'],
        ['Sanity checks', 'a plausible heatmap is not proof of reasoning.'],
      ]},
      counter: { tag: 'actionable explanation', title: 'Find a counterfactual decision', lead: 'Adjust an applicant profile and ask for the smallest allowed change that would flip the model’s outcome.', pts: [
        ['Minimal change', 'stay close to the original case.'],
        ['Actionability', 'change only features a person can influence.'],
        ['Feasibility', 'respect valid ranges and dependencies.'],
        ['Recourse', 'turn explanation into a possible next step.'],
      ]},
      fairness: { tag: 'responsible ai', title: 'Audit group-level outcomes', lead: 'Compare approval and error rates, then apply mitigations and inspect the accuracy–fairness tradeoff.', pts: [
        ['True-positive-rate gap', 'compare opportunity across groups.'],
        ['False-positive rate', 'compare exposure to harmful errors.'],
        ['Threshold mitigation', 'adjust operating points by policy.'],
        ['Metric conflicts', 'not all fairness definitions can hold together.'],
      ]},
      llm: { tag: 'language model internals', title: 'Inspect predictions through depth', lead: 'Move a logit lens across transformer layers and intervene on an attention head or concept direction.', pts: [
        ['Logit lens', 'decode intermediate residual representations.'],
        ['Ablation', 'remove a component and measure the effect.'],
        ['Activation steering', 'add a learned concept direction.'],
        ['Circuit analysis', 'trace cooperating heads and neurons.'],
      ]},
    }},

    /* 14 ── ETL & Data Engineering ── */
    'etl': { color: '#22D3EE', mode: 'tabs', panels: {
      etl: { tag: 'pipelines', title: 'ETL as a DAG', lead: 'Extract → Transform → Load, wired as a directed acyclic graph. Run the canvas and watch records move through dependent stages.', pts: [
        ['Sources', 'APIs, databases, files, and event logs.'],
        ['Transforms', 'clean, join, deduplicate, and aggregate.'],
        ['Dependencies', 'a DAG prevents cycles and orders work.'],
        ['Bottlenecks', 'the slowest stage limits throughput.'],
      ]},
      ingest: { tag: 'data ingestion', title: 'Batch or stream?', lead: 'Change event volume and delivery windows to compare scheduled batch, micro-batch, and continuous streaming ingestion.', pts: [
        ['Batch', 'efficient scheduled processing of bounded files.'],
        ['Micro-batch', 'small frequent groups of records.'],
        ['Streaming', 'continuous low-latency event processing.'],
        ['Backpressure', 'slow consumers must control incoming load.'],
      ]},
      transform: { tag: 'data preparation', title: 'Make raw records trustworthy', lead: 'Apply null handling, deduplication, and type validation to see which rows satisfy a clean output contract.', pts: [
        ['Cleaning', 'repair or quarantine invalid values.'],
        ['Deduplication', 'make retries and repeated events idempotent.'],
        ['Type safety', 'parse values into explicit schemas.'],
        ['dbt models', 'version SQL transformations and tests.'],
      ]},
      warehouse: { tag: 'analytics modeling', title: 'Shape a warehouse for questions', lead: 'Compare star, snowflake, and wide-table models as dimensions, joins, and redundancy change.', pts: [
        ['Fact tables', 'business events and numeric measures.'],
        ['Dimensions', 'descriptive context for analysis.'],
        ['Star schema', 'simple joins around a central fact.'],
        ['Lakehouse', 'warehouse semantics over open data files.'],
      ]},
      spark: { tag: 'distributed compute', title: 'Scale beyond one machine', lead: 'Partition a large dataset across workers and increase key skew to reveal stragglers and lost cluster efficiency.', pts: [
        ['Partitions', 'independent chunks scheduled across workers.'],
        ['Shuffle', 'move records between stages by key.'],
        ['Skew', 'hot keys create oversized slow tasks.'],
        ['Fault tolerance', 'recompute lost partitions from lineage.'],
      ]},
      orchestrate: { tag: 'workflow control', title: 'Schedule and recover pipelines', lead: 'Inject a task failure, select retry policy, and run the dependency chain to see whether downstream work can continue.', pts: [
        ['Schedules', 'trigger work at the right cadence.'],
        ['Retries', 'recover safely from transient failures.'],
        ['Backfills', 'reprocess historical partitions.'],
        ['Observability', 'record state, duration, and logs.'],
      ]},
      quality: { tag: 'data contracts', title: 'Stop bad data at the boundary', lead: 'Run schema, uniqueness, null, and volume checks against clean and broken datasets before deciding to publish or quarantine.', pts: [
        ['Schema checks', 'columns and types match expectations.'],
        ['Freshness', 'data arrives within its promised window.'],
        ['Completeness', 'required values are present.'],
        ['Quarantine', 'isolate failures without silently publishing.'],
      ]},
      features: { tag: 'machine-learning data', title: 'Keep training and serving aligned', lead: 'Compare batch, streaming, and request-time materialization across offline and online feature stores.', pts: [
        ['Offline store', 'historical features for training.'],
        ['Online store', 'low-latency values for inference.'],
        ['Point-in-time joins', 'prevent future-data leakage.'],
        ['Feature registry', 'share versioned definitions.'],
      ]},
    }},

    /* 15 ── MLOps ── */
    'mlops': { color: '#34D399', mode: 'tabs', panels: {
      mlops: { tag: 'operations', title: 'Ship it, then watch it', lead: 'Move time forward and compare live traffic with the training distribution until drift crosses an operational threshold.', pts: [
        ['Data drift', 'input distributions move over time.'],
        ['Concept drift', 'relationships between inputs and outcomes change.'],
        ['Performance decay', 'quality can fall while the API remains healthy.'],
        ['Retraining', 'refresh only with representative validated data.'],
      ]},
      experiments: { tag: 'reproducibility', title: 'Track every training run', lead: 'Change a model and learning rate, log a new run, and compare it with previous parameters and metrics.', pts: [
        ['Parameters', 'record the configuration that produced a run.'],
        ['Metrics', 'compare evaluation results consistently.'],
        ['Artifacts', 'store models, plots, and reports.'],
        ['Provenance', 'link code, environment, and data versions.'],
      ]},
      registry: { tag: 'model lifecycle', title: 'Promote versioned artifacts', lead: 'Select a candidate, set a quality gate, and promote only versions that meet the registry policy.', pts: [
        ['Versions', 'immutable model artifacts with metadata.'],
        ['Stages', 'candidate, production, archived.'],
        ['Approval', 'record who accepted the evidence.'],
        ['Rollback', 'keep a known-good production version available.'],
      ]},
      deploy: { tag: 'safe release', title: 'Control production exposure', lead: 'Compare canary, blue/green, and shadow releases while changing candidate traffic and watching guardrails.', pts: [
        ['Canary', 'increase real traffic gradually.'],
        ['Blue/green', 'switch between complete environments.'],
        ['Shadow', 'copy requests without serving candidate responses.'],
        ['Rollback', 'restore a stable version quickly.'],
      ]},
      observe: { tag: 'production signals', title: 'Monitor service and model health', lead: 'Inject latency or quality incidents to see why infrastructure, data, and model signals must be observed together.', pts: [
        ['Service metrics', 'latency, errors, saturation, availability.'],
        ['Data metrics', 'schema, drift, and freshness.'],
        ['Model metrics', 'quality, calibration, and fairness.'],
        ['Alerts', 'tie thresholds to actionable runbooks.'],
      ]},
      cicd: { tag: 'delivery automation', title: 'Gate a model release', lead: 'Run unit, data, build, security, staging, and production jobs with failures and approval requirements.', pts: [
        ['Continuous integration', 'validate code and data changes.'],
        ['Image build', 'package reproducible dependencies.'],
        ['Security scan', 'block known vulnerable artifacts.'],
        ['Approval gate', 'require authority for production impact.'],
      ]},
      retrain: { tag: 'automation policy', title: 'Trigger retraining carefully', lead: 'Compare drift, schedule, and performance triggers while keeping validation guardrails between training and release.', pts: [
        ['Drift triggers', 'respond to a changing input population.'],
        ['Schedules', 'refresh at a predictable cadence.'],
        ['Performance triggers', 'use delayed ground truth when available.'],
        ['Validation', 'automation must not bypass release evidence.'],
      ]},
      govern: { tag: 'accountability', title: 'Preserve lineage and evidence', lead: 'Add model cards, dataset lineage, ownership, and risk review to satisfy governance requirements at different risk tiers.', pts: [
        ['Model cards', 'document purpose, limits, and evaluation.'],
        ['Lineage', 'trace data, code, run, artifact, and deployment.'],
        ['Ownership', 'name accountable maintainers and reviewers.'],
        ['Risk controls', 'increase evidence for higher-impact systems.'],
      ]},
    }},

    /* 12 ── Systems & Research ── */
    'research': { color: '#8B8CF6', mode: 'tabs', panels: {
      research: { tag: 'generalization', title: 'Balance bias and variance', lead: 'Change model complexity and watch bias fall, variance rise, and total error form the familiar U-shaped tradeoff.', pts: [
        ['Bias', 'systematic error from assumptions that are too simple.'],
        ['Variance', 'sensitivity to noise in the training sample.'],
        ['Underfitting', 'high bias misses the true structure.'],
        ['Overfitting', 'high variance memorizes accidental detail.'],
      ]},
      cv: { tag: 'validation', title: 'Estimate generalization honestly', lead: 'Compare K-fold, stratified, and chronological splits while changing the number of held-out folds.', pts: [
        ['Held-out data', 'evaluate on examples not used for fitting.'],
        ['K-fold', 'rotate each subset through validation.'],
        ['Stratification', 'preserve class proportions across folds.'],
        ['Time splits', 'never validate a forecast on its own past.'],
      ]},
      bootstrap: { tag: 'uncertainty', title: 'Resample to build an interval', lead: 'Change sample count, dataset size, and confidence level to see a bootstrap distribution and interval move.', pts: [
        ['Resampling', 'sample observations with replacement.'],
        ['Sampling distribution', 'approximate estimator variability.'],
        ['Confidence interval', 'report plausible values, not certainty.'],
        ['Sample size', 'more observations usually narrow uncertainty.'],
      ]},
      hypothesis: { tag: 'statistical testing', title: 'Test a difference against chance', lead: 'Adjust observed effect, sample size, and significance level before deciding whether evidence rejects the null hypothesis.', pts: [
        ['Null hypothesis', 'formalize the no-effect reference.'],
        ['P-value', 'probability of equally extreme data under the null.'],
        ['Alpha', 'predeclare the false-positive tolerance.'],
        ['Effect size', 'statistical significance is not practical importance.'],
      ]},
      power: { tag: 'experimental design', title: 'Plan before collecting data', lead: 'Choose a minimum detectable effect, sample size, and noise level to estimate whether the design can find a real effect.', pts: [
        ['Power', 'probability of detecting an effect that exists.'],
        ['Sample size', 'larger groups improve sensitivity.'],
        ['Noise', 'measurement variability hides small effects.'],
        ['Pre-registration', 'commit to the analysis before results arrive.'],
      ]},
      ablation: { tag: 'causal contribution', title: 'Remove components to test claims', lead: 'Toggle model components and measure how the held-out score changes while the remaining setup stays fixed.', pts: [
        ['Controlled removal', 'change one component at a time.'],
        ['Baseline', 'compare with a meaningful simpler system.'],
        ['Multiple seeds', 'distinguish contribution from run variance.'],
        ['Interactions', 'components may matter differently together.'],
      ]},
      reproduce: { tag: 'research artifacts', title: 'Make the experiment reproducible', lead: 'Audit whether code, environment, data, seeds, and configuration are available to another researcher.', pts: [
        ['Code version', 'identify the exact implementation.'],
        ['Environment', 'lock dependency and hardware assumptions.'],
        ['Data provenance', 'publish a version or generation procedure.'],
        ['Configuration', 'record every material experimental choice.'],
      ]},
      report: { tag: 'scientific communication', title: 'Match claims to evidence', lead: 'Change evidence strength and claim language to practise cautious reporting with explicit limitations.', pts: [
        ['Claim scope', 'do not generalize beyond evaluated conditions.'],
        ['Limitations', 'state failure modes and uncertainty openly.'],
        ['Negative results', 'reduce repeated dead ends and publication bias.'],
        ['Peer review', 'make evidence inspectable and contestable.'],
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

  function detailHTML(color, detail, id) {
    const concepts = detail.concepts.map((item) => `<article class="td-concept">
      <span class="td-num">${item.n}</span>
      <h4>${item.title}</h4>
      <p>${item.body}</p>
      <div class="td-formula">${item.formula}</div>
      <p class="td-note">${item.note}</p>
    </article>`).join('');
    const steps = detail.example.steps.map(([term, text]) => `<div class="td-step"><b>${term}</b><span>${text}</span></div>`).join('');
    const practice = detail.practice.map(([term, text], index) => `<li><span class="td-check">${index + 1}</span><div><b>${term}</b><p>${text}</p></div></li>`).join('');
    return `<section class="topic-detail" style="--c:${color}" aria-labelledby="detail-${id}">
      <div class="td-head">
        <span class="tc-eyebrow">complete lesson</span>
        <h3 id="detail-${id}">Understand vectors, not just the arrows</h3>
        <p>${detail.intro}</p>
      </div>
      <div class="td-concepts">${concepts}</div>
      <div class="td-bottom">
        <article class="td-example">
          <span class="tc-eyebrow">worked example</span>
          <h4>${detail.example.title}</h4>
          <p>${detail.example.setup}</p>
          <div class="td-steps">${steps}</div>
        </article>
        <article class="td-practice">
          <span class="tc-eyebrow">try it above</span>
          <h4>Four experiments to lock it in</h4>
          <ol>${practice}</ol>
        </article>
      </div>
    </section>`;
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
        if (c.detail && !panel.querySelector(':scope > .topic-detail')) {
          panel.insertAdjacentHTML('beforeend', detailHTML(T.color, c.detail, page + '-' + id));
        }
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
