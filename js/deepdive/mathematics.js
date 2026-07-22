/* Deep dive — Mathematics for AI */
window.AtlasRef && window.AtlasRef.register('mathematics', {
  color: '#34D399',
  title: 'The mathematics behind every model',
  lead: 'Four pillars — linear algebra, calculus, probability and statistics — plus the information theory that ties them to machine learning. This is the full course: each topic with intuition, the exact formulas, a worked example, and code.',
  sections: [

    { h: 'Scalars, vectors, matrices & tensors', p: [
      'Everything a model touches is one of four shapes. A <b>scalar</b> is a single number (a learning rate). A <b>vector</b> is an ordered list — one data point, or the weights of one neuron. A <b>matrix</b> is a grid — a batch of vectors, or a linear map. A <b>tensor</b> generalises to any number of axes — a batch of RGB images is a 4-D tensor <code>(batch, height, width, channels)</code>.',
      'The <b>shape</b> is the tuple of dimension sizes, and 90% of deep-learning bugs are shape mismatches. Reading shapes fluently is the single most useful math skill in practice.'],
      terms: [['Rank / order', 'the number of axes (0=scalar, 1=vector, 2=matrix).'], ['Shape', 'sizes along each axis, e.g. (32, 784).'], ['Broadcasting', 'stretching a smaller array to match a larger one without copying.'], ['Element-wise', 'operations applied position-by-position (Hadamard product ⊙).']],
      ex: [{ h: 'Reading a shape', p: ['A batch of 32 grayscale 28×28 images flattened for an MLP has shape <code>(32, 784)</code>. Multiplying by a weight matrix <code>W</code> of shape <code>(784, 128)</code> gives <code>(32, 128)</code> — the inner dimensions (784) must match and cancel.'],
        code: 'import numpy as np\nX = np.random.randn(32, 784)   # 32 images\nW = np.random.randn(784, 128)  # layer weights\nb = np.zeros(128)\nZ = X @ W + b                  # (32,128), b broadcast over rows' }] },

    { h: 'Vectors: dot product, norm & cosine similarity', p: [
      'The <b>dot product</b> a·b = Σ aᵢbᵢ is the workhorse of ML — every neuron computes one. Geometrically a·b = |a||b|cos θ, so it measures alignment: positive when vectors point the same way, zero when perpendicular, negative when opposed.',
      'A <b>norm</b> measures length. The L2 norm |a|=√(Σaᵢ²) is Euclidean distance; the L1 norm Σ|aᵢ| is used in Lasso for sparsity. <b>Cosine similarity</b> divides out length to compare pure direction — the standard way to compare embeddings.'],
      eqn: 'a·b = Σ aᵢbᵢ = |a||b| cos θ        cosine_sim(a,b) = a·b / (|a| |b|)',
      ex: [{ h: 'Are two documents similar?', p: ['Embed two sentences as vectors and take cosine similarity. Values near 1 mean “about the same thing”, near 0 mean unrelated. Length is ignored, so a long and short doc about the same topic still score high.'],
        code: 'def cosine(a, b):\n    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nu = np.array([1., 2., 3.])\nv = np.array([2., 4., 6.])   # same direction, 2x length\ncosine(u, v)  # -> 1.0  (identical direction)' }],
      note: 'In a transformer, attention scores are scaled dot products between query and key vectors — similarity, softmaxed into weights.' },

    { h: 'Matrices as transformations', p: [
      'A matrix is a <b>function that reshapes space</b> linearly: rotate, scale, shear, reflect, project. Multiplying a matrix by a vector moves that point; multiplying two matrices <b>composes</b> their transformations. Order matters — <code>AB ≠ BA</code> in general.',
      'The columns of a matrix are simply where it sends the basis vectors. That is the whole intuition: to know what a matrix does, look at where it sends <code>(1,0)</code> and <code>(0,1)</code>.'],
      eqn: '[a b; c d] · [x; y] = [ax + by ; cx + dy]',
      ex: [{ h: 'A 90° rotation', p: ['The matrix <code>[0 −1; 1 0]</code> sends (1,0)→(0,1) and (0,1)→(−1,0): a quarter-turn counter-clockwise. Chaining it four times returns to the identity.'],
        code: 'R = np.array([[0, -1],\n              [1,  0]])\nR @ np.array([1, 0])       # -> [0, 1]\nnp.linalg.matrix_power(R, 4)  # -> identity' }],
      terms: [['Identity I', 'the do-nothing matrix; Iv = v.'], ['Transpose Aᵀ', 'flip rows and columns.'], ['Inverse A⁻¹', 'undoes A; exists only if det ≠ 0.'], ['Orthogonal matrix', 'rotation/reflection; preserves lengths (AᵀA = I).']] },

    { h: 'Determinant, rank & solving linear systems', p: [
      'The <b>determinant</b> is the factor by which a matrix scales area/volume. det = 0 means the transform collapses space onto a lower dimension — it is <b>singular</b>, non-invertible, and the system has no unique solution. A negative determinant means the space was flipped.',
      'The <b>rank</b> is the number of independent directions the columns span. Full rank ⇒ invertible ⇒ a unique solution to <code>Ax = b</code>. Machine learning constantly solves or approximates such systems (e.g. the normal equations of linear regression).'],
      eqn: 'det[a b; c d] = ad − bc        solve Ax = b  ⇒  x = A⁻¹b   (if det ≠ 0)',
      ex: [{ h: 'Least squares via the normal equations', p: ['Linear regression finds β minimising |Xβ − y|². Setting the gradient to zero gives the closed form below. In practice we use a QR/SVD solver (numpy <code>lstsq</code>) for numerical stability rather than inverting directly.'],
        eqn: 'β = (XᵀX)⁻¹ Xᵀ y',
        code: 'X = np.c_[np.ones(len(x)), x]        # add bias column\nbeta = np.linalg.lstsq(X, y, rcond=None)[0]  # stable solve' }] },

    { h: 'Eigenvectors, eigenvalues & PCA', p: [
      'An <b>eigenvector</b> of a matrix is a direction that the matrix only stretches, never rotates: <code>Av = λv</code>. The scalar λ is its <b>eigenvalue</b> — the stretch factor. Eigen-decomposition reveals the “natural axes” of a transformation.',
      '<b>Principal Component Analysis</b> is the flagship application: the eigenvectors of the data’s covariance matrix are the directions of greatest variance. Keeping the top-k gives the best k-dimensional linear compression of the data — the basis for denoising, visualisation, and dimensionality reduction.'],
      eqn: 'A v = λ v        PCA: eigen-decompose Cov(X); keep top-k eigenvectors',
      ex: [{ h: 'Compressing data with PCA', p: ['Project 50-dimensional data onto its 2 principal components to plot it, retaining the most variance possible in 2-D. The explained-variance ratio tells you how much information survived.'],
        code: 'from sklearn.decomposition import PCA\npca = PCA(n_components=2).fit(X)   # X: (n, 50)\nZ = pca.transform(X)              # (n, 2)\npca.explained_variance_ratio_.sum()  # e.g. 0.86 -> 86% kept' }],
      note: 'SVD (A = UΣVᵀ) generalises eigen-decomposition to any matrix and underlies PCA, recommender systems, and low-rank adapters like LoRA.' },

    { h: 'Derivatives & gradients', p: [
      'A <b>derivative</b> f′(x) is the instantaneous rate of change — the slope of the tangent line. For a function of many inputs, the <b>gradient</b> ∇f is the vector of partial derivatives; it points in the direction of steepest increase, and its negative is the direction training moves.',
      'Training a model = minimising a loss L(θ) over millions of parameters θ. We never solve ∇L = 0 by hand; we follow −∇L downhill iteratively. Everything hinges on being able to compute that gradient efficiently.'],
      eqn: 'f′(x) = lim(h→0) [f(x+h) − f(x)] / h        ∇f = [∂f/∂x₁, …, ∂f/∂xₙ]',
      ex: [{ h: 'Gradient of a simple loss', p: ['For squared error L = (wx − y)², the derivative w.r.t. w is 2x(wx − y). That single number tells us how to nudge w to reduce the error for this example — the atom of gradient descent.'],
        eqn: 'L = (wx − y)²   ⇒   dL/dw = 2x(wx − y)' }] },

    { h: 'The chain rule & backpropagation', p: [
      'Neural networks are deep compositions f(g(h(x))). The <b>chain rule</b> says the derivative of a composition is the product of the derivatives: dL/dx = (dL/df)(df/dg)(dg/dx). <b>Backpropagation</b> is just the chain rule applied right-to-left through the computation graph, reusing intermediate results so the whole gradient costs about the same as one forward pass.',
      'This is why deep learning is feasible at all: reverse-mode automatic differentiation computes gradients for millions of parameters in one sweep.'],
      eqn: 'dL/dx = (dL/df)·(df/dg)·(dg/dx)      # multiply local gradients backward',
      ex: [{ h: 'Backprop through one neuron', p: ['With z = wx + b, a = σ(z), L = (a − y)², the gradient w.r.t. w chains three local derivatives. Frameworks build this graph automatically; understanding it explains vanishing gradients and why activation choice matters.'],
        code: 'import torch\nx = torch.tensor(1.5); w = torch.tensor(0.8, requires_grad=True)\nb = torch.tensor(0.1, requires_grad=True); y = torch.tensor(1.0)\nz = w*x + b; a = torch.sigmoid(z); L = (a - y)**2\nL.backward()          # autograd applies the chain rule\nw.grad, b.grad        # dL/dw, dL/db' }] },

    { h: 'Optimization: gradient descent & its variants', p: [
      'Gradient descent updates parameters by a small step against the gradient: θ ← θ − η∇L. The <b>learning rate</b> η is the most important knob — too large and it diverges, too small and it crawls. Real training uses <b>mini-batches</b> (SGD) for speed and helpful noise.',
      'Modern optimizers add <b>momentum</b> (accumulate velocity to power through ravines) and <b>adaptivity</b> (per-parameter step sizes). <b>Adam/AdamW</b> combines both and is the default for deep learning.'],
      eqn: 'θ ← θ − η ∇L(θ)        momentum: v ← βv + ∇L ; θ ← θ − ηv',
      table: { cols: ['Optimizer', 'Idea', 'When'], rows: [
        ['SGD', 'plain step on a mini-batch', 'simple, well-understood, needs tuning'],
        ['SGD + Momentum', 'velocity through ravines', 'vision CNNs'],
        ['RMSProp', 'per-parameter adaptive rate', 'RNNs'],
        ['Adam / AdamW', 'momentum + adaptivity (+ decoupled decay)', 'default for transformers']] },
      note: 'Convex problems (one bowl) have a single global minimum; deep nets are non-convex (many valleys), yet SGD reliably finds good ones — a deep and useful empirical fact.' },

    { h: 'Probability foundations', p: [
      'Probability is the language of uncertainty. A <b>random variable</b> takes values with a distribution. The key rules: probabilities sum to 1, the <b>joint</b> P(A,B) = P(A|B)P(B), and events are <b>independent</b> when P(A,B) = P(A)P(B).',
      '<b>Bayes’ theorem</b> inverts conditionals — it updates a prior belief into a posterior given evidence. It underlies Naive Bayes, Bayesian inference, and the very notion of learning from data.'],
      eqn: 'P(A|B) = P(B|A) P(A) / P(B)        posterior ∝ likelihood × prior',
      ex: [{ h: 'The classic medical test', p: ['A disease affects 1% of people. A test is 99% sensitive and 99% specific. If you test positive, the probability you actually have it is only ~50% — because the healthy majority produces many false positives. Base rates dominate; this is why calibration matters.'],
        eqn: 'P(sick|+) = (.99·.01) / (.99·.01 + .01·.99) = 0.5' }] },

    { h: 'Distributions you must know', p: [
      'A handful of distributions appear everywhere. The <b>Normal (Gaussian)</b> is the default for continuous noise; the <b>68–95–99.7 rule</b> says that share of mass lies within 1/2/3 standard deviations of the mean. The <b>Central Limit Theorem</b> explains its ubiquity: sums of many independent effects tend to normal.'],
      table: { cols: ['Distribution', 'Models', 'Used in'], rows: [
        ['Bernoulli', 'a single yes/no', 'binary classification'],
        ['Binomial', 'count of successes in n trials', 'A/B testing'],
        ['Categorical', 'one of k classes', 'softmax outputs'],
        ['Normal', 'continuous, symmetric noise', 'weights init, priors'],
        ['Poisson', 'counts per interval', 'events, arrivals'],
        ['Exponential', 'time between events', 'survival, waiting times']] },
      ex: [{ h: 'Sampling & the empirical rule', p: ['Draw from a normal and check that ~95% of samples fall within 2σ. Weight initialisation (e.g. He/Xavier) draws from carefully-scaled normals so signals neither vanish nor explode across layers.'],
        code: 'x = np.random.normal(loc=0, scale=1, size=100000)\nnp.mean(np.abs(x) < 2)   # -> ~0.954  (95% within 2 sigma)' }] },

    { h: 'Statistics: estimation & inference', p: [
      'Statistics turns a finite sample into claims about the world. <b>Estimators</b> guess parameters (the sample mean estimates the true mean). <b>Bias</b> is systematic error; <b>variance</b> is sensitivity to the particular sample — the same bias–variance tension that governs over/underfitting.',
      '<b>Maximum likelihood estimation (MLE)</b> picks parameters that make the observed data most probable. Minimising cross-entropy loss <i>is</i> MLE for a classifier; minimising squared error <i>is</i> MLE under Gaussian noise. Statistics and ML are the same subject in different dialects.'],
      eqn: 'θ̂_MLE = argmax_θ  Π P(xᵢ | θ) = argmin_θ  −Σ log P(xᵢ | θ)',
      ex: [{ h: 'Confidence intervals & p-values', p: ['A 95% confidence interval is a range that would contain the true value 95% of the time under repeated sampling. A p-value is the probability of data this extreme if nothing were going on — small p-values cast doubt on the null hypothesis. Always report effect size and uncertainty, not just a point estimate.'] }],
      terms: [['Bias', 'expected estimate minus truth.'], ['Variance', 'spread of the estimate across samples.'], ['Standard error', 'σ/√n — precision improves with more data.'], ['Bootstrap', 'resample the data to estimate uncertainty empirically.']] },

    { h: 'Information theory & ML loss functions', p: [
      '<b>Entropy</b> H(p) = −Σ p log p is the average surprise of a distribution — maximal when outcomes are equally likely, zero when certain. <b>Cross-entropy</b> H(p,q) = −Σ p log q measures the cost of using distribution q to encode data that truly follows p — which is exactly the loss we minimise when training a classifier against one-hot labels.',
      '<b>KL divergence</b> is the extra cost, KL(p‖q) = H(p,q) − H(p): a directed “distance” between distributions used in variational inference, VAEs, and policy-gradient RL (e.g. PPO’s trust region).'],
      eqn: 'H(p) = −Σ pᵢ log pᵢ      CE(p,q) = −Σ pᵢ log qᵢ      KL(p‖q) = Σ pᵢ log(pᵢ/qᵢ)',
      ex: [{ h: 'Why cross-entropy is the classification loss', p: ['For a true label (one-hot p) and predicted probabilities q from softmax, cross-entropy reduces to −log(q_correct): the loss is small when the model is confident and right, and explodes when it is confidently wrong — precisely the training signal we want.'],
        code: 'def cross_entropy(p_true_index, q):   # q: predicted probs\n    return -np.log(q[p_true_index] + 1e-12)\n\nq = np.array([0.1, 0.7, 0.2])   # model thinks class 1\ncross_entropy(1, q)   # -> 0.357  (confident & correct -> low loss)' }] },
  ]
});
