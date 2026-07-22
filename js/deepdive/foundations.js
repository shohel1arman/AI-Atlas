/* Deep dive — Foundations of AI */
window.AtlasRef && window.AtlasRef.register('foundations', {
  color: '#8B8CF6',
  title: 'Foundations: a full orientation to the field',
  lead: 'Before the math and the models, the map. What AI, machine learning and deep learning actually are and how they nest; the kinds of learning; the end-to-end lifecycle of a real project; how to pick a metric; when NOT to use ML at all; and the history that got us here. This is the conceptual course that everything else builds on.',
  sections: [

    { h: 'What AI, ML and deep learning are — and how they nest', p: [
      '<b>Artificial Intelligence</b> is the broadest idea: getting machines to perform tasks that would normally require human intelligence — perceiving, reasoning, planning, understanding language, acting. It includes approaches that involve <i>no learning at all</i>, such as hand-written rules, search algorithms and logic engines.',
      '<b>Machine Learning</b> is a subset of AI: rather than programming the rules by hand, we let a system <b>learn patterns from data</b>. You supply examples and a way to measure success, and an algorithm fits a model that generalises to new cases. <b>Deep Learning</b> is in turn a subset of ML that uses <b>neural networks with many layers</b>, learning its own features directly from raw data (pixels, audio, text) instead of relying on human-engineered features.',
      'The relationship is strictly nested: <code>Deep Learning ⊂ Machine Learning ⊂ Artificial Intelligence</code>. A chess engine using brute-force search is AI but not ML. A spam filter trained on labelled emails is ML. A large language model is deep learning. Keeping this hierarchy straight prevents most confused conversations about the field.'],
      terms: [['AI', 'any technique that makes machines act intelligently, learned or not.'], ['ML', 'AI that improves at a task by learning from data rather than explicit rules.'], ['Deep learning', 'ML using multi-layer neural networks that learn features automatically.'], ['Feature', 'a measurable input signal; classic ML uses hand-crafted ones, deep learning learns them.']],
      note: 'A useful test: if removing the training data would break the system, it is machine learning. If it would still work, it is rule-based AI.' },

    { h: 'AI vs ML vs DL vs data science', p: [
      'These four terms overlap but answer different questions. <b>AI</b> asks “can the machine behave intelligently?”. <b>ML</b> asks “can it learn the behaviour from data?”. <b>Deep learning</b> asks “can a neural network learn it end-to-end from raw signals?”. <b>Data science</b> is a different axis entirely: it is the practice of <b>extracting insight and decisions from data</b>, using statistics, visualisation, experiment design and often ML as one tool among many.',
      'A data scientist might spend most of their time cleaning data, running an A/B test, and building a dashboard — never training a neural network. An ML engineer might spend theirs shipping and monitoring a model in production. The roles blur, but the emphasis differs: <b>data science optimises for understanding and decisions; ML engineering optimises for reliable predictions at scale.</b>'],
      table: { cols: ['Field', 'Core question', 'Typical output', 'Signature tools'], rows: [
        ['Artificial Intelligence', 'How do we make machines act intelligently?', 'An agent or system that performs a task', 'Search, logic, planning, ML'],
        ['Machine Learning', 'How do we learn the behaviour from data?', 'A trained predictive model', 'scikit-learn, XGBoost, PyTorch'],
        ['Deep Learning', 'Can a neural net learn it from raw data?', 'A neural network (CNN, transformer)', 'PyTorch, TensorFlow, GPUs'],
        ['Data Science', 'What can data tell us, and what should we do?', 'Insights, metrics, experiments, models', 'SQL, pandas, statistics, viz'] ] },
      note: 'None of these owns the others. Data science <i>uses</i> ML; ML is a <i>way of doing</i> AI; deep learning is a <i>kind of</i> ML.' },

    { h: 'Types of machine learning', p: [
      'ML is usually organised by <b>what kind of feedback the learner gets</b>. The classic split is supervised, unsupervised and reinforcement learning, with two hugely important middle grounds — self-supervised and semi-supervised — that power most modern systems.',
      '<b>Supervised learning</b> uses labelled examples (input → correct output) and learns a mapping; it splits into <b>classification</b> (discrete labels, e.g. spam/not-spam) and <b>regression</b> (continuous values, e.g. house price). <b>Unsupervised learning</b> finds structure in unlabelled data — clustering customers, reducing dimensions, detecting anomalies. <b>Reinforcement learning</b> learns by trial and error: an agent takes actions in an environment and maximises a cumulative <b>reward</b> signal.',
      '<b>Self-supervised learning</b> is the engine behind modern foundation models: the data supplies its own labels. Hide a word and predict it; mask a patch of an image and reconstruct it. No human annotation is needed, so it scales to internet-sized corpora. <b>Semi-supervised learning</b> mixes a small labelled set with a large unlabelled one — valuable when labels are expensive (e.g. medical images).'],
      table: { cols: ['Type', 'Feedback signal', 'Example task', 'Example algorithm'], rows: [
        ['Supervised', 'Labelled input → output pairs', 'Classify email as spam', 'Logistic regression, XGBoost'],
        ['Unsupervised', 'No labels; structure only', 'Segment customers into groups', 'k-means, PCA'],
        ['Self-supervised', 'Labels derived from the data itself', 'Predict the next word', 'GPT, BERT, masked autoencoders'],
        ['Semi-supervised', 'Few labels + many unlabelled', 'Diagnose from scarce labelled scans', 'Pseudo-labelling, FixMatch'],
        ['Reinforcement', 'Delayed scalar reward', 'Learn to play a game / control a robot', 'Q-learning, PPO'] ] },
      ex: [{ h: 'Classification vs regression in one line each', p: ['The same labelled data can pose different problems. Predicting <i>which</i> of three species an iris is, is classification (discrete output). Predicting a house’s <i>price in dollars</i> is regression (continuous output). The choice determines the loss, the metric and the output layer.'],
        code: 'from sklearn.linear_model import LogisticRegression, LinearRegression\n\n# Classification: discrete label\nclf = LogisticRegression().fit(X_train, y_class)   # y in {0,1,2}\nspecies = clf.predict(X_new)\n\n# Regression: continuous value\nreg = LinearRegression().fit(X_train, y_price)     # y in dollars\nprice = reg.predict(X_new)' }] },

    { h: 'The end-to-end ML project lifecycle', p: [
      'A model is a small part of a real ML project. The work is a <b>loop</b>, not a line, and most of it is not modelling. The stages below are where projects actually succeed or fail — usually in framing and data, rarely in the choice of algorithm.',
      '<b>1. Problem framing & metric choice.</b> Translate a business goal into a precise ML task. Is it classification or regression? What single number defines success, and what are the costs of each kind of error? Getting this wrong invalidates everything downstream. <b>2. Data collection & labelling.</b> Gather representative data and, for supervised tasks, obtain trustworthy labels. Annotation guidelines, inter-annotator agreement and label quality matter more than model tweaks.',
      '<b>3. Splitting into train / validation / test.</b> Partition the data so you can tune honestly and estimate real-world performance. The <b>training</b> set fits parameters; the <b>validation</b> set tunes hyperparameters and selects models; the <b>test</b> set is touched <i>once</i>, at the end, to estimate generalisation. For time series, split by time, never randomly, or the future leaks into the past. <b>4. Modelling.</b> Start with a simple baseline, then iterate toward more capacity only if the data justifies it.',
      '<b>5. Evaluation.</b> Measure against the chosen metric on held-out data, slice by subgroup to catch hidden failures, and compare to the baseline. <b>6. Deployment.</b> Ship the model behind an API or into a batch job, handling latency, versioning and rollback. <b>7. Monitoring.</b> Production data drifts; watch inputs and predictions for <b>data drift</b> and <b>concept drift</b>, track live metrics, and retrain on a schedule or trigger. Then the loop starts again.'],
      terms: [['Data leakage', 'information from the target or future sneaking into training features — inflates offline scores, collapses in production.'], ['Data drift', 'the input distribution shifts over time; the model sees inputs unlike its training data.'], ['Concept drift', 'the input→output relationship itself changes (e.g. buying behaviour after a shock).'], ['Retraining trigger', 'a rule (schedule or metric threshold) that kicks off a fresh training run.']],
      ex: [{ h: 'A leakage trap in the lifecycle', p: ['A team predicted hospital readmission and scaled every feature using the mean and standard deviation of the <i>whole</i> dataset before splitting. That let statistics from the test rows influence training, quietly leaking information. The offline AUC looked great and cratered in production. The fix: fit all preprocessing on the training split only, inside a pipeline, then apply it to validation and test.'],
        code: 'from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2,\n                                          random_state=0)\n# Scaler is fit ONLY on training data inside the pipeline -> no leakage\npipe = make_pipeline(StandardScaler(), LogisticRegression())\npipe.fit(X_tr, y_tr)\nprint(pipe.score(X_te, y_te))   # honest estimate' }],
      note: 'Rule of thumb for effort: expect ~60% of a project on data, ~15% on framing and metrics, ~15% on modelling, and the rest on deployment and monitoring.' },

    { h: 'Choosing a success metric & baselines', p: [
      'A model is only as good as the number you chose to optimise. <b>Accuracy is a trap on imbalanced data:</b> if 99% of transactions are legitimate, a model that predicts “legit” every time is 99% accurate and completely useless. You must pick a metric that reflects the real costs of the mistakes you care about.',
      'For classification, work from the <b>confusion matrix</b>: <b>precision</b> (of the cases I flagged, how many were right?) trades off against <b>recall</b> (of the real positives, how many did I catch?), combined by the <b>F1 score</b>. Rank-quality is captured by <b>ROC-AUC</b> or, on imbalanced data, <b>PR-AUC</b>. For regression, use <b>MAE</b>, <b>RMSE</b> (which punishes large errors more) or <b>R²</b>. Always pair the metric with a <b>baseline</b>: the trivial majority-class or mean predictor, or a simple rule. If your fancy model can’t beat the baseline, it isn’t adding value.'],
      eqn: 'precision = TP / (TP + FP)\nrecall    = TP / (TP + FN)\nF1        = 2 · precision · recall / (precision + recall)',
      table: { cols: ['Situation', 'Prefer', 'Because'], rows: [
        ['Balanced classes', 'Accuracy', 'errors are roughly symmetric'],
        ['Rare positive, false alarms costly', 'Precision', 'you must trust each alert'],
        ['Rare positive, misses costly (fraud, cancer)', 'Recall', 'a missed case is expensive'],
        ['Need one balanced number', 'F1 / PR-AUC', 'harmonises precision and recall'],
        ['Regression, outliers matter', 'RMSE', 'squares penalise big misses'],
        ['Regression, robust to outliers', 'MAE', 'linear in the error'] ] },
      ex: [{ h: 'Why accuracy lies, and what to do', p: ['On a fraud dataset that is 1% positive, a “predict legit” model scores 0.99 accuracy but 0.0 recall — it catches no fraud. Reporting recall and precision exposes this instantly, and the majority-class baseline gives you the bar any real model must clear.'],
        code: 'from sklearn.metrics import classification_report\nfrom sklearn.dummy import DummyClassifier\n\n# Baseline: always predict the majority class\nbase = DummyClassifier(strategy=\'most_frequent\').fit(X_tr, y_tr)\nprint(\'baseline acc:\', base.score(X_te, y_te))     # ~0.99, useless\n\n# Real report exposes recall = 0 for the fraud class\nprint(classification_report(y_te, model.predict(X_te)))' }] },

    { h: 'Training vs inference', p: [
      '<b>Training</b> and <b>inference</b> are two distinct phases with different costs and constraints. Training is the <b>learning</b> phase: the model sees data, computes a loss, and updates its parameters via gradient descent — repeatedly, over many epochs. It is compute-heavy, done offline, and produces a fixed set of weights.',
      '<b>Inference</b> (also called serving or prediction) is <b>using</b> the trained model: feed in a new input, run a single forward pass, get an output. The weights are frozen — no learning happens. Inference must often be fast, cheap and reliable, running millions of times in production, sometimes on a phone. This is why techniques like <b>quantisation</b>, <b>distillation</b> and <b>pruning</b> exist: they shrink a model for cheap inference without paying the full training cost again.'],
      terms: [['Epoch', 'one full pass over the training data during training.'], ['Forward pass', 'computing outputs from inputs; the whole of inference, one step of training.'], ['Backward pass', 'computing gradients to update weights; happens only in training.'], ['Latency vs throughput', 'time for one prediction vs predictions per second — the two serving budgets.']],
      ex: [{ h: 'Same weights, two modes', p: ['Frameworks distinguish the modes explicitly. In training mode, dropout and batch-norm behave one way and gradients are tracked; in eval mode they switch off and gradient tracking is disabled for speed. Forgetting to call eval mode is a classic bug that quietly degrades production accuracy.'],
        code: 'import torch\n\n# --- Training: weights update ---\nmodel.train()\nfor xb, yb in loader:\n    optimizer.zero_grad()\n    loss = loss_fn(model(xb), yb)\n    loss.backward()          # backward pass -> gradients\n    optimizer.step()         # update weights\n\n# --- Inference: weights frozen ---\nmodel.eval()\nwith torch.no_grad():        # no gradients, faster, less memory\n    prediction = model(x_new)' }] },

    { h: 'Generalization, overfitting & underfitting', p: [
      'The whole point of ML is <b>generalization</b>: performing well on data you have never seen, not just memorising the training set. The two ways to fail are symmetric. <b>Underfitting</b> means the model is too simple to capture the pattern — high error on both training and test data (high <b>bias</b>). <b>Overfitting</b> means the model memorised noise and quirks of the training set — low training error but high test error (high <b>variance</b>).',
      'This is the <b>bias–variance trade-off</b>. As you add capacity, training error keeps falling but test error follows a U-shape: down as the model captures real signal, then back up as it starts fitting noise. The sweet spot is the bottom of that U. The tools to steer it — more data, regularisation, cross-validation, early stopping — are all really ways to manage this trade-off. The tell-tale sign of overfitting is a <b>large gap between training and validation performance</b>.'],
      eqn: 'Expected test error  ≈  Bias²  +  Variance  +  Irreducible noise',
      table: { cols: ['Symptom', 'Train error', 'Test error', 'Diagnosis', 'Fix'], rows: [
        ['Too simple', 'High', 'High', 'Underfitting (high bias)', 'More capacity / features'],
        ['Just right', 'Low', 'Low', 'Good generalisation', 'Ship it'],
        ['Memorising', 'Very low', 'High', 'Overfitting (high variance)', 'More data, regularise, early stop'] ] },
      ex: [{ h: 'Reading a learning curve', p: ['Plot training and validation error against model complexity (or training epochs). If both are high and close, you are underfitting — add capacity. If training error is tiny but validation error is high and the gap is widening, you are overfitting — add data or regularisation and stop training earlier. Cross-validation gives a more stable read than a single split.'],
        code: 'from sklearn.model_selection import cross_val_score\nimport numpy as np\n\n# 5-fold CV estimates generalisation more robustly than one split\nscores = cross_val_score(model, X, y, cv=5, scoring=\'f1_macro\')\nprint(f\'CV F1: {scores.mean():.3f} +/- {scores.std():.3f}\')\n# A big gap vs training F1 signals overfitting' }],
      note: 'More data is the most reliable cure for overfitting; a bigger model is the most reliable cure for underfitting. Diagnose which one you have before acting.' },

    { h: 'When NOT to use machine learning', p: [
      'ML is a powerful tool and a poor default. It adds data dependencies, opacity, monitoring burden and failure modes that plain code does not have. Reach for a <b>rules-based or analytic solution first</b> whenever the logic is known, stable and explainable.',
      'Skip ML when: the rule is simple and deterministic (tax brackets, business logic, input validation); you have too little data to learn from; you need exact, auditable, 100%-correct answers (accounting, safety interlocks); the relationship never changes, so hand-written rules won’t rot; or the cost of a wrong prediction is unacceptable and unmodelled. Conversely, ML earns its keep when the rules are <b>unknown or too numerous to write</b> (recognising cats, translating language), when patterns <b>shift over time</b> so rules would need constant rewriting, or when you must <b>personalise at a scale</b> no human could hand-tune.'],
      table: { cols: ['Prefer rules / plain code when…', 'Prefer ML when…'], rows: [
        ['The logic is known and stable', 'The rules are unknown or unwritable'],
        ['You need exact, auditable answers', 'An approximate answer is acceptable'],
        ['Data is scarce or unavailable', 'You have abundant relevant data'],
        ['Errors are unacceptable / unsafe', 'Errors are tolerable and measurable'],
        ['The relationship never changes', 'Patterns drift and must adapt'] ] },
      ex: [{ h: 'A one-line rule beats a model', p: ['To flag orders over a credit limit, no model is needed — the rule is exact, explainable and never wrong. Training a classifier here would be slower, less accurate, harder to audit and would need monitoring for drift that will never come. Save ML for the genuinely fuzzy decision, like scoring the <i>risk</i> of default.'],
        code: '# Rules-based: exact, auditable, zero training data\ndef needs_review(order, customer):\n    return order.total > customer.credit_limit\n\n# ML would be strictly worse here: approximate where exact is possible.\n# Reserve a model for the fuzzy question, e.g. P(default | features).' }],
      note: 'A good heuristic: if you can write the rules down in an afternoon and they won’t change, don’t train a model.' },

    { h: 'Data is the foundation', p: [
      'Models are commodities; <b>data is the moat</b>. Almost every large gain in a real project comes from better data, not a cleverer algorithm. Four properties govern whether data can support learning at all.',
      '<b>Quantity:</b> enough examples to cover the patterns — deep models are especially data-hungry. <b>Quality:</b> accurate labels, few errors, consistent formatting; noisy labels cap the achievable accuracy. <b>Representativeness:</b> the training data must match the distribution the model will face in production — a model trained only on daytime photos fails at night. <b>Leakage-free:</b> features must not encode the answer or information unavailable at prediction time.',
      '<b>Leakage</b> deserves special fear because it is invisible until deployment: the model looks brilliant offline, then fails live. Common sources are target-derived features, using future information, and preprocessing (scaling, imputation, feature selection) fit on the full dataset before splitting. The discipline is simple to state and easy to violate: <b>only ever learn from information that will genuinely be available at prediction time.</b>'],
      terms: [['Representative sample', 'training data drawn from the same distribution as production inputs.'], ['Label noise', 'incorrect or inconsistent labels that limit achievable accuracy.'], ['Class imbalance', 'one class vastly outnumbers another; distorts naive training and metrics.'], ['Ground truth', 'the trusted correct answer used to train and evaluate.']],
      ex: [{ h: 'Garbage in, garbage out — quantified', p: ['If 10% of your labels are wrong at random, no model can reliably exceed ~90% accuracy on those cases, however sophisticated. Cleaning labels often beats months of model tuning. Before reaching for a bigger network, audit a random sample of your data by hand — it is the highest-leverage hour in most projects.'] }],
      note: 'The order of impact in practice: better data > better framing > better features > better model > better hyperparameters.' },

    { h: 'Responsible AI from day one', p: [
      'Ethics is not a final checklist; it is a design constraint present from the first framing meeting. Models learn from historical data, so they <b>inherit and can amplify the biases</b> baked into that data. A responsible practitioner treats four concerns as first-class from the start.',
      '<b>Fairness:</b> does the model perform equitably across groups (gender, race, age)? A model that is 95% accurate overall but 70% accurate for one subgroup is not acceptable — always evaluate <b>sliced by subgroup</b>, not just in aggregate. <b>Transparency:</b> can you explain why a decision was made? High-stakes uses (lending, hiring, justice) demand interpretability and clear documentation of a model’s intended use and limits. <b>Privacy:</b> was the data collected with consent, minimised, and protected? Techniques like anonymisation and differential privacy help. <b>Accountability:</b> who is responsible when it fails, how is that failure detected, and how can a person contest or override a decision?'],
      terms: [['Bias (fairness sense)', 'systematic disadvantage to a group, often inherited from historical data.'], ['Disparate impact', 'a policy that harms a protected group even without intent to.'], ['Explainability', 'the ability to give human-understandable reasons for a prediction.'], ['Human-in-the-loop', 'a person reviews or can override high-stakes automated decisions.']],
      ex: [{ h: 'Aggregate accuracy hides harm', p: ['A hiring model scored 92% accuracy and was nearly shipped. Slicing the evaluation revealed 96% accuracy for one group and 68% for another — the training data under-represented the second group. The aggregate number concealed a serious fairness failure. The habit that catches this is simple: report every metric broken down by subgroup before declaring success.'],
        code: 'import pandas as pd\n\n# Never trust a single aggregate metric — slice it\nresults = pd.DataFrame({\'group\': groups, \'y\': y_true,\n                        \'pred\': y_pred})\nby_group = results.groupby(\'group\').apply(\n    lambda d: (d.y == d.pred).mean())\nprint(by_group)   # exposes per-group accuracy gaps early' }],
      note: 'The cheapest time to address bias, privacy and accountability is during problem framing. The most expensive time is after a public failure.' },

    { h: 'A history of AI in seven eras', p: [
      'AI has moved in waves of optimism and “winters”. Knowing the arc explains why today’s methods look the way they do — each era reacted to the limits of the last. The field swung from hand-coded logic, to learning from data, to learning representations from raw data at massive scale.',
      'The through-line: as <b>compute and data grew</b>, the winning approach shifted from <b>encoding human knowledge by hand</b> (symbolic AI, expert systems) to <b>learning statistical patterns from data</b> (classical ML), to <b>learning the features themselves</b> (deep learning), and finally to <b>general-purpose models pre-trained on the whole internet</b> (foundation models). Each transition was unlocked less by a single idea than by scale meeting a method that could use it.'],
      table: { cols: ['Era', 'Period', 'Dominant idea', 'Landmark'], rows: [
        ['Birth & symbolic AI', '1950s–60s', 'Intelligence as logic and search over hand-coded rules', 'Turing test (1950); Dartmouth workshop (1956) coins “AI”'],
        ['First AI winter', '1970s', 'Early promise hits combinatorial and funding walls', 'Cuts after over-promising'],
        ['Expert systems', '1980s', 'Encode a specialist’s rules in an inference engine', 'MYCIN, XCON; commercial boom then bust (2nd winter)'],
        ['Statistical ML', '1990s–2000s', 'Learn from data rather than encode rules', 'SVMs, random forests; IBM Deep Blue beats Kasparov (1997)'],
        ['Deep learning', '2012–', 'Deep neural nets learn features from raw data at scale', 'AlexNet wins ImageNet (2012); GPUs + big data'],
        ['Transformers', '2017–', 'Attention enables scalable sequence models', '“Attention Is All You Need” (2017); BERT, GPT'],
        ['Generative & foundation models', '2020s', 'Internet-scale pre-training; general-purpose models', 'GPT-3 (2020), ChatGPT (2022), diffusion image models'] ] },
      note: 'Two “AI winters” (late 1970s and late 1980s) followed cycles of hype and disappointment. The lesson practitioners carry: separate what a method can demonstrably do from what it is promised to do.' },

    { h: 'Narrow vs general AI, and types of AI systems', p: [
      'Everything deployed today is <b>Narrow AI (ANI)</b>: systems that excel at <b>one specific task</b> — translation, image recognition, playing Go, generating text. A model that beats every human at chess cannot make you coffee or even play checkers; its competence does not transfer. <b>Artificial General Intelligence (AGI)</b> — a system that matches human ability across the full range of cognitive tasks and transfers knowledge between them — does not exist and remains speculative. <b>Artificial Superintelligence (ASI)</b>, surpassing humans at everything, is further still and purely hypothetical.',
      'A separate, older taxonomy sorts AI by <b>capability</b>, and it is worth knowing honestly because it is often quoted as if it described real products. Only the first two categories exist. <b>Reactive machines</b> respond to the current input with no memory (Deep Blue). <b>Limited-memory</b> systems use recent history and are what essentially all modern ML is — a self-driving car using the last few seconds, or an LLM attending to its context window. The remaining two are aspirational: <b>theory-of-mind</b> AI that models others’ beliefs and intentions, and <b>self-aware</b> AI with consciousness — neither exists, and the second is philosophy, not engineering.'],
      table: { cols: ['Type', 'Capability', 'Status', 'Example'], rows: [
        ['Reactive machines', 'React to current input, no memory', 'Exists', 'Deep Blue, simple game bots'],
        ['Limited memory', 'Use recent past + learned data', 'Exists — all modern ML', 'Self-driving cars, LLMs, recommenders'],
        ['Theory of mind', 'Model others’ beliefs, emotions, intent', 'Research / not achieved', '—'],
        ['Self-aware', 'Possess consciousness and self-model', 'Hypothetical / philosophical', '—'] ] },
      note: 'Be skeptical of any product marketed as “AGI” or “conscious”. Today’s frontier is powerful, general-purpose Narrow AI — remarkable, but still narrow.' },

    { h: 'Key vocabulary every practitioner needs', p: [
      'A shared vocabulary is what lets you read papers, docs and error messages without stalling. These terms recur constantly across every module in the Atlas; internalise them and the rest of the field becomes readable.',
      'They fall into a few clusters: the <b>things you learn</b> (parameters, features, labels), the <b>things you set</b> (hyperparameters), the <b>ingredients of training</b> (loss, gradient, epoch, batch), and the <b>failure and evaluation vocabulary</b> (overfitting, generalisation, baseline). You will meet each in depth elsewhere; this is the glossary to anchor them.'],
      terms: [
        ['Model', 'the learned function mapping inputs to outputs.'],
        ['Parameter (weight)', 'a value learned from data during training.'],
        ['Hyperparameter', 'a setting you choose before training (learning rate, depth).'],
        ['Feature', 'an input variable the model reads.'],
        ['Label / target', 'the correct answer in supervised learning.'],
        ['Loss function', 'the number training tries to minimise; measures error.'],
        ['Gradient descent', 'the algorithm that nudges parameters to reduce loss.'],
        ['Epoch / batch', 'one full pass over data / a subset used per update step.'],
        ['Overfitting', 'memorising training data and failing to generalise.'],
        ['Generalisation', 'performing well on unseen data — the real goal.'],
        ['Baseline', 'a simple reference model any real model must beat.'],
        ['Inference', 'using a trained model to make predictions.']],
      note: 'If a sentence in any AI paper stops making sense, it is usually one of these twelve words being used precisely. Learn them once and read everything faster.' },
  ]
});
