/* Deep dive — Deep Learning */
window.AtlasRef && window.AtlasRef.register('deep-learning', {
  color: '#6366F1',
  title: 'Neural networks from the neuron up',
  lead: 'A complete tour of deep learning — the artificial neuron, multilayer networks and why they can approximate anything, the forward pass, backpropagation and autograd, optimizers, the tricks that make training stable, and the great architectures (CNNs, RNNs, transformers, autoencoders, GANs, diffusion). Every topic with intuition, exact formulas, worked numbers and runnable PyTorch.',
  sections: [

    { h: 'The artificial neuron & the perceptron', p: [
      'A neuron is a tiny function: take inputs <code>x</code>, weight them, add a bias, then squash the result. Formally <code>z = w·x + b = Σ wᵢxᵢ + b</code>, followed by an activation <code>a = f(z)</code>. The weights say how much each input matters; the bias shifts the threshold. That is the entire atom of deep learning — everything else is billions of these wired together.',
      'Rosenblatt&rsquo;s 1958 <b>perceptron</b> used a step activation (fire if <code>z &gt; 0</code>) and a simple learning rule: on a mistake, nudge the weights toward the correct answer, <code>w ← w + η(y − ŷ)x</code>. It <i>provably</i> converges when the data is <b>linearly separable</b> — but a single neuron draws only a straight decision boundary, so it famously cannot learn XOR. That limitation stalled the field until multilayer networks and backprop arrived.'],
      eqn: 'z = Σ wᵢ xᵢ + b        a = f(z)        perceptron update: w ← w + η (y − ŷ) x',
      terms: [['Weight wᵢ', 'learned importance of input i.'], ['Bias b', 'shifts the activation threshold; like a weight on a constant 1.'], ['Activation f', 'the nonlinearity applied to z.'], ['Linearly separable', 'two classes a single straight line/plane can divide.']],
      ex: [{ h: 'A neuron computing an AND gate', p: ['With weights <code>w = [1, 1]</code> and bias <code>b = −1.5</code>, a step neuron fires only when <i>both</i> inputs are 1: <code>1+1−1.5 = 0.5 &gt; 0</code> → 1, while <code>1+0−1.5 = −0.5</code> → 0. Two numbers and a threshold reproduce a logic gate.'],
        eqn: 'AND(1,1): 1·1 + 1·1 − 1.5 = 0.5 → fires\nAND(1,0): 1·1 + 1·0 − 1.5 = −0.5 → silent',
        code: 'import numpy as np\ndef neuron(x, w, b):\n    return 1 if (w @ x + b) > 0 else 0\nw, b = np.array([1., 1.]), -1.5\n[neuron(np.array(x), w, b) for x in [(0,0),(0,1),(1,0),(1,1)]]  # -> [0,0,0,1]' }] },

    { h: 'Multilayer perceptron & universal approximation', p: [
      'Stack neurons into <b>layers</b> and feed one layer&rsquo;s outputs into the next: that is a <b>multilayer perceptron (MLP)</b>, or feedforward network. A hidden layer computes <code>h = f(W₁x + b₁)</code>, the output layer <code>ŷ = W₂h + b₂</code>. The hidden layers learn <i>features</i> — reusable intermediate representations — that later layers combine.',
      'The <b>universal approximation theorem</b> says an MLP with a single hidden layer and a nonlinear activation can approximate <i>any</i> continuous function to arbitrary accuracy, given enough hidden units. Crucially the nonlinearity is what buys this power: stack linear layers with no activation and <code>W₂(W₁x) = (W₂W₁)x</code> collapses to one linear map. Depth matters in practice because deep networks represent complex functions <i>far</i> more parameter-efficiently than a single enormous wide layer.'],
      eqn: 'h⁽¹⁾ = f(W₁x + b₁)      h⁽²⁾ = f(W₂h⁽¹⁾ + b₂)      ŷ = W₃h⁽²⁾ + b₃',
      note: 'Universal approximation is an existence result, not a recipe. It promises a network exists; it says nothing about whether gradient descent will find it, or how many neurons you need.',
      ex: [{ h: 'Why depth beats width', p: ['To carve <code>2ⁿ</code> linear regions of input space, a shallow net may need exponentially many neurons, while a deep net reuses features and needs roughly <code>O(n)</code>. This compositional reuse — edges → textures → parts → objects — is why deep beats shallow on real data.'],
        code: 'import torch.nn as nn\nmlp = nn.Sequential(\n    nn.Linear(784, 256), nn.ReLU(),\n    nn.Linear(256, 128), nn.ReLU(),\n    nn.Linear(128, 10))          # 784 -> 10 classes\nsum(p.numel() for p in mlp.parameters())  # ~235k learnable params' }] },

    { h: 'Activation functions & when to use each', p: [
      'The activation is the nonlinearity that lets a network bend space. <b>Sigmoid</b> squashes to (0,1) — good for a single probability, but it <b>saturates</b>: for large |z| its gradient ≈ 0, killing learning. <b>Tanh</b> is a zero-centred sigmoid mapping to (−1,1); better for hidden layers but still saturates.',
      '<b>ReLU</b> — <code>max(0, z)</code> — is the modern default for hidden layers: cheap, non-saturating for positive inputs, and it makes deep nets trainable. Its weakness is <b>dead neurons</b> (stuck at 0). <b>LeakyReLU</b> leaks a small slope for negatives to avoid that; <b>GELU</b> is a smooth, probabilistic ReLU that dominates transformers. <b>Softmax</b> is special: it turns a vector of scores (logits) into a probability distribution over classes, used at the <i>output</i> of a classifier.'],
      eqn: 'sigmoid(z) = 1/(1+e⁻ᶻ)     tanh(z) = (eᶻ−e⁻ᶻ)/(eᶻ+e⁻ᶻ)     ReLU(z) = max(0,z)\nLeakyReLU(z) = max(αz, z)     GELU(z) ≈ z·Φ(z)     softmax(z)ᵢ = eᶻⁱ / Σⱼ eᶻʲ',
      table: { cols: ['Activation', 'Range', 'Use it for', 'Watch out for'], rows: [
        ['<b>Sigmoid</b>', '(0, 1)', 'binary output probability', 'saturation, not zero-centred'],
        ['<b>Tanh</b>', '(−1, 1)', 'older RNN hidden states', 'saturation at extremes'],
        ['<b>ReLU</b>', '[0, ∞)', 'default hidden layers (CNN/MLP)', 'dead neurons'],
        ['<b>LeakyReLU</b>', '(−∞, ∞)', 'when ReLU units die', 'extra α hyperparameter'],
        ['<b>GELU</b>', '(−0.17, ∞)', 'transformers, modern nets', 'slightly costlier'],
        ['<b>Softmax</b>', '(0, 1), sums to 1', 'multi-class output layer', 'only at the output']] },
      ex: [{ h: 'Softmax turns logits into probabilities', p: ['Logits <code>[2.0, 1.0, 0.1]</code> exponentiate to <code>[7.39, 2.72, 1.11]</code>, sum 11.22, so softmax gives <code>[0.659, 0.242, 0.099]</code> — a valid distribution favouring class 0. Subtracting the max before exponentiating avoids overflow without changing the result.'],
        eqn: 'softmax([2,1,0.1]) = [0.659, 0.242, 0.099]   (sums to 1)',
        code: 'def softmax(z):\n    z = z - z.max()          # numerical stability\n    e = np.exp(z)\n    return e / e.sum()\nsoftmax(np.array([2.0, 1.0, 0.1]))  # -> [0.659, 0.242, 0.099]' }] },

    { h: 'The forward pass & loss functions', p: [
      'The <b>forward pass</b> pushes data through the network layer by layer to produce a prediction. The <b>loss function</b> then scores how wrong that prediction is with a single number — the quantity training minimises. Choose the loss to match the task.',
      'For regression use <b>mean squared error</b> <code>MSE = (1/n)Σ(ŷ−y)²</code> (penalises large errors quadratically) or MAE for robustness to outliers. For classification use <b>cross-entropy</b> <code>−Σ y log ŷ</code>, which for a one-hot label reduces to <code>−log(ŷ_correct)</code>: near-zero when confident and right, exploding when confidently wrong. In PyTorch, <code>nn.CrossEntropyLoss</code> takes raw logits and fuses log-softmax with the loss for numerical stability — do not add a softmax yourself.'],
      eqn: 'MSE = (1/n) Σ (ŷᵢ − yᵢ)²        CE = − Σ yᵢ log(ŷᵢ)  →  −log(ŷ_correct)',
      ex: [{ h: 'Cross-entropy rewards calibrated confidence', p: ['True class is 1. A confident-correct model predicting <code>ŷ₁ = 0.7</code> pays <code>−log(0.7) = 0.357</code>. A confident-<i>wrong</i> model that put <code>0.7</code> on the wrong class and only <code>0.1</code> on the truth pays <code>−log(0.1) = 2.303</code> — over 6× the penalty. That steep slope is exactly the training signal.'],
        eqn: 'right & confident: −log(0.7) = 0.357\nwrong & confident: −log(0.1) = 2.303',
        code: 'import torch, torch.nn.functional as F\nlogits = torch.tensor([[2.0, 1.0, 0.1]])   # one sample, 3 classes\ntarget = torch.tensor([0])                 # true class = 0\nF.cross_entropy(logits, target)            # -> 0.417  (logits, not probs!)' }] },

    { h: 'Backpropagation & autograd', p: [
      'Training needs the gradient of the loss with respect to <i>every</i> weight. <b>Backpropagation</b> is the chain rule applied right-to-left through the network&rsquo;s computation graph: compute the loss, then propagate the error backward, multiplying local derivatives and reusing intermediate results. The whole gradient costs about the same as one forward pass — the fact that makes deep learning feasible.',
      'Modern frameworks do this automatically with <b>reverse-mode autodiff (autograd)</b>. Every operation records itself on a graph; calling <code>.backward()</code> walks the graph in reverse, filling in <code>.grad</code> for each parameter. You write only the forward pass; the gradients come for free.'],
      eqn: 'dL/dW₁ = (dL/dŷ)·(dŷ/dh)·(dh/dz)·(dz/dW₁)      # multiply local grads backward',
      ex: [{ h: 'Backprop through one neuron by hand', p: ['With <code>z = wx+b</code>, <code>a = σ(z)</code>, <code>L = (a−y)²</code>, the chain rule gives <code>dL/dw = 2(a−y)·σ(z)(1−σ(z))·x</code>. Autograd builds this product for you; understanding it explains why saturating activations (tiny <code>σ(1−σ)</code>) cause vanishing gradients.'],
        eqn: 'dL/da = 2(a−y)    da/dz = σ(z)(1−σ(z))    dz/dw = x\n⇒ dL/dw = 2(a−y)·σ(z)(1−σ(z))·x',
        code: 'import torch\nx = torch.tensor(1.5)\nw = torch.tensor(0.8, requires_grad=True)\nb = torch.tensor(0.1, requires_grad=True)\ny = torch.tensor(1.0)\nz = w*x + b; a = torch.sigmoid(z); L = (a - y)**2\nL.backward()              # autograd applies the chain rule\nw.grad, b.grad            # dL/dw, dL/db filled in automatically' }],
      note: 'Call <code>optimizer.zero_grad()</code> each step — PyTorch <i>accumulates</i> gradients by default, so stale grads add up if you forget.' },

    { h: 'Optimizers: SGD, momentum & Adam', p: [
      '<b>Gradient descent</b> steps against the gradient: <code>θ ← θ − η∇L</code>. The <b>learning rate</b> η is the single most important knob — too big diverges, too small crawls. In practice we use <b>stochastic gradient descent (SGD)</b> on mini-batches: cheaper, and the noise helps escape bad minima.',
      '<b>Momentum</b> accumulates a velocity vector so training powers through ravines and small bumps: <code>v ← βv + ∇L; θ ← θ − ηv</code>. <b>Adam</b> adds per-parameter adaptive step sizes by tracking running means of the gradient and its square, so each weight gets its own effective rate. <b>AdamW</b> fixes Adam&rsquo;s weight-decay coupling and is the default for transformers.'],
      eqn: 'SGD:      θ ← θ − η ∇L\nMomentum: v ← βv + ∇L ;  θ ← θ − η v\nAdam:     m ← β₁m + (1−β₁)g ;  v ← β₂v + (1−β₂)g² ;  θ ← θ − η m̂ / (√v̂ + ε)',
      table: { cols: ['Optimizer', 'Idea', 'Typical use'], rows: [
        ['<b>SGD</b>', 'plain step on a mini-batch', 'simple baselines'],
        ['<b>SGD + momentum</b>', 'velocity through ravines', 'vision CNNs (with LR schedule)'],
        ['<b>RMSProp</b>', 'per-parameter adaptive rate', 'RNNs, older setups'],
        ['<b>Adam / AdamW</b>', 'momentum + adaptivity (+ decoupled decay)', 'transformers, default choice']] },
      ex: [{ h: 'One Adam step', p: ['Adam keeps two moving averages per weight — <code>m</code> (mean gradient) and <code>v</code> (mean squared gradient) — bias-corrects them early in training, then divides the step by <code>√v</code> so noisy, large-gradient directions take smaller, steadier steps. Good defaults: <code>β₁=0.9, β₂=0.999, ε=1e-8</code>.'],
        code: 'import torch.optim as optim\nopt = optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)\nloss.backward()   # fill grads\nopt.step()        # m,v updated; each weight steps adaptively\nopt.zero_grad()   # reset for next batch' }] },

    { h: 'Weight init & vanishing / exploding gradients', p: [
      'Backprop multiplies many local gradients together. If they are mostly &lt; 1 the product shrinks toward zero across depth — the <b>vanishing gradient</b> problem, where early layers barely learn. If they are mostly &gt; 1 the product blows up — <b>exploding gradients</b>, giving NaNs. Both scale exponentially with depth.',
      'Careful <b>weight initialization</b> keeps the signal variance stable layer to layer. <b>Xavier/Glorot</b> init (variance <code>2/(nᵢₙ+nₒᵤₜ)</code>) suits tanh/sigmoid; <b>He/Kaiming</b> init (variance <code>2/nᵢₙ</code>) suits ReLU, which zeroes half its inputs. Other fixes: ReLU-family activations, residual/skip connections, normalization layers, and <b>gradient clipping</b> to cap explosions.'],
      eqn: 'Xavier:  Var(W) = 2 / (nᵢₙ + nₒᵤₜ)        He (ReLU):  Var(W) = 2 / nᵢₙ',
      ex: [{ h: 'Why all-zero (or all-equal) init fails', p: ['Initialise every weight to the same value and every neuron in a layer computes the same output and receives the same gradient — they update identically forever and the layer can never differentiate. Random asymmetric init <i>breaks symmetry</i>; He/Xavier just picks the right scale so signals neither vanish nor explode.'],
        code: 'import torch.nn as nn\nlayer = nn.Linear(256, 256)\nnn.init.kaiming_normal_(layer.weight, nonlinearity=\'relu\')  # He init\nnn.init.zeros_(layer.bias)\n# grad clipping guards against explosions during training:\n# torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)' }] },

    { h: 'Normalization: batch norm & layer norm', p: [
      'Normalization layers keep activations well-scaled as they flow through the network, which stabilises and speeds up training. They standardise a set of activations to roughly zero mean and unit variance, then apply a learnable scale <code>γ</code> and shift <code>β</code> so the network can undo the normalization if it needs to.',
      '<b>Batch normalization</b> normalises each feature across the <i>batch</i> dimension — powerful in CNNs, but it depends on batch statistics (awkward for tiny batches, and it behaves differently at train vs eval time, using running averages). <b>Layer normalization</b> normalises across the <i>features</i> of a single example, so it is batch-independent — the standard choice in transformers and RNNs.'],
      eqn: 'x̂ = (x − μ) / √(σ² + ε)        y = γ x̂ + β\nBatchNorm: μ,σ over the batch     LayerNorm: μ,σ over the features',
      ex: [{ h: 'Where the mean is taken', p: ['For activations of shape <code>(batch=32, features=512)</code>: BatchNorm computes 512 means/variances (one per feature, across the 32 examples); LayerNorm computes 32 means/variances (one per example, across the 512 features). Same formula, orthogonal axis — that is the whole difference.'],
        code: 'import torch, torch.nn as nn\nx = torch.randn(32, 512)\nbn = nn.BatchNorm1d(512)   # stats across the batch (dim 0)\nln = nn.LayerNorm(512)     # stats across features (dim 1)\nbn(x).shape, ln(x).shape   # both (32, 512)' }],
      note: 'BatchNorm must switch behaviour between <code>model.train()</code> and <code>model.eval()</code>; forgetting <code>.eval()</code> at inference is a classic bug that quietly wrecks accuracy.' },

    { h: 'Regularization: fighting overfitting', p: [
      'A model <b>overfits</b> when it memorises training noise and fails to generalise — low train loss, high validation loss. Regularization biases the model toward simpler solutions that transfer. Combine several in practice.',
      '<b>Dropout</b> randomly zeroes a fraction of activations each step, forcing redundant, robust features (disabled at eval, where activations are scaled instead). <b>Weight decay (L2)</b> adds <code>λΣw²</code> to the loss, shrinking weights toward zero. <b>Early stopping</b> halts when validation loss stops improving. <b>Data augmentation</b> synthesises new training examples (flips, crops, colour jitter, noise), the cheapest and often most effective regularizer of all.'],
      eqn: 'L_total = L_data + λ Σ w²        dropout: keep each unit with prob (1 − p)',
      table: { cols: ['Technique', 'Mechanism', 'Note'], rows: [
        ['<b>Dropout</b>', 'randomly zero activations', 'p ≈ 0.1–0.5; off at eval'],
        ['<b>Weight decay (L2)</b>', 'penalise large weights', 'λ ≈ 1e-4–1e-2'],
        ['<b>Early stopping</b>', 'stop at best val loss', 'needs a validation set'],
        ['<b>Data augmentation</b>', 'expand the dataset', 'domain-specific transforms'],
        ['<b>Label smoothing</b>', 'soften one-hot targets', 'ε ≈ 0.1, better calibration']] },
      ex: [{ h: 'Dropout in a classifier head', p: ['Placing <code>Dropout(0.5)</code> between dense layers means each forward pass trains a different random sub-network; averaging them at test time acts like a cheap ensemble. If train accuracy far exceeds validation accuracy, raise dropout or weight decay, or add augmentation.'],
        code: 'net = nn.Sequential(\n    nn.Linear(512, 256), nn.ReLU(), nn.Dropout(0.5),\n    nn.Linear(256, 10))\nnet.train()   # dropout ACTIVE\nnet.eval()    # dropout OFF, activations scaled instead' }] },

    { h: 'Convolutional networks (CNNs)', p: [
      'For images, wiring every pixel to every neuron is wasteful and ignores spatial structure. A <b>convolution</b> slides a small learnable <b>kernel</b> across the image, computing a dot product at each position to build a <b>feature map</b>. Two big wins: <b>parameter sharing</b> (the same kernel everywhere → far fewer weights) and <b>translation equivariance</b> (an edge is detected wherever it appears).',
      '<b>Pooling</b> (usually max-pool) downsamples feature maps, adding a little translation invariance and shrinking compute. Stacking conv → activation → pool builds a hierarchy: early layers detect edges, deeper layers detect textures, parts, then whole objects. The lineage runs <b>LeNet</b> (1998) → <b>AlexNet</b> (2012, the ImageNet breakthrough) → <b>VGG</b> (deep 3×3 stacks) → <b>ResNet</b>, whose <b>residual/skip connections</b> <code>y = f(x) + x</code> let gradients flow through 100+ layers by giving them a shortcut path.'],
      eqn: '(I * K)[i,j] = Σₘ Σₙ I[i+m, j+n] · K[m,n]        out = (n + 2p − k)/s + 1',
      ex: [{ h: 'Output size of a conv layer', p: ['A 32×32 input, kernel <code>k=3</code>, padding <code>p=1</code>, stride <code>s=1</code> gives <code>(32 + 2·1 − 3)/1 + 1 = 32</code> — &ldquo;same&rdquo; padding preserves spatial size. A conv from 3 to 16 channels with a 3×3 kernel has only <code>3·16·3·3 + 16 = 448</code> parameters, independent of image size — the payoff of weight sharing.'],
        eqn: '(32 + 2·1 − 3)/1 + 1 = 32     params = 3·16·9 + 16 = 448',
        code: 'import torch, torch.nn as nn\nconv = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1)\nx = torch.randn(8, 3, 32, 32)    # (batch, C, H, W)\nfeat = conv(x)                   # -> (8, 16, 32, 32)\npooled = nn.MaxPool2d(2)(feat)   # -> (8, 16, 16, 16)' }],
      note: 'A residual block learns the <i>difference</i> from the identity, so the easiest thing for it to do is nothing — which is why very deep ResNets train stably.' },

    { h: 'Recurrent networks: RNN, LSTM & GRU', p: [
      'Sequences (text, audio, time series) need memory. A <b>recurrent neural network (RNN)</b> keeps a hidden state <code>h</code> and updates it at each step from the current input and the previous state: <code>hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁ + b)</code>. In principle it can remember the whole past — but backprop through many steps multiplies gradients repeatedly, so plain RNNs suffer badly from vanishing/exploding gradients and forget long-range context.',
      'The <b>LSTM</b> fixes this with a protected <b>cell state</b> and three learned <b>gates</b> — forget, input, output — that control what to erase, write, and read. The additive cell update gives gradients a highway across time. The <b>GRU</b> is a lighter two-gate variant (reset, update) that often matches LSTM with fewer parameters. These powered machine translation and speech before transformers largely replaced them for long sequences.'],
      eqn: 'RNN:  hₜ = tanh(Wₓ xₜ + Wₕ hₜ₋₁ + b)\nLSTM gates: fₜ, iₜ, oₜ = σ(·)   cₜ = fₜ⊙cₜ₋₁ + iₜ⊙c̃ₜ   hₜ = oₜ⊙tanh(cₜ)',
      terms: [['Hidden state hₜ', 'the running summary of the sequence so far.'], ['Cell state cₜ', 'the LSTM&rsquo;s long-term memory conveyor belt.'], ['Forget gate', 'decides what to erase from the cell.'], ['BPTT', 'backpropagation through time — unrolling the loop to get gradients.']],
      ex: [{ h: 'Sequence-to-vector with an LSTM', p: ['Feed a batch of length-50 embedded sequences into an LSTM and read the final hidden state as a summary vector for classification (e.g. sentiment). PyTorch returns all step outputs plus the final <code>(hₙ, cₙ)</code>.'],
        code: 'import torch, torch.nn as nn\nlstm = nn.LSTM(input_size=128, hidden_size=256, batch_first=True)\nx = torch.randn(32, 50, 128)      # (batch, seq_len, features)\nout, (h_n, c_n) = lstm(x)\nout.shape, h_n.shape              # (32,50,256), (1,32,256)' }] },

    { h: 'Attention & the transformer (in brief)', p: [
      'RNNs process sequences step by step, which is slow and leaks long-range information. <b>Attention</b> lets every position look directly at every other position in one parallel operation. Each token emits a <b>query</b>, <b>key</b> and <b>value</b>; the query dot-products against all keys to score relevance, softmax turns scores into weights, and the output is the weighted sum of values — the model learns <i>what to attend to</i>.',
      'The <b>transformer</b> stacks multi-head self-attention with position-wise MLPs, residual connections and layer norm, adding positional encodings since attention itself is order-agnostic. Fully parallel and scalable, it is the backbone of modern LLMs and vision models. This is only the sketch — see the dedicated <b>Transformers</b> module for the full treatment.'],
      eqn: 'Attention(Q,K,V) = softmax( Q Kᵀ / √dₖ ) V',
      ex: [{ h: 'Scaled dot-product attention', p: ['Scores are scaled by <code>√dₖ</code> so large-dimension dot products don&rsquo;t push softmax into saturated, near-one-hot regions with vanishing gradients. For sequence length <code>n</code>, the <code>QKᵀ</code> matrix is <code>n×n</code> — the quadratic cost that motivates efficient-attention research.'],
        code: 'import torch, torch.nn.functional as F\ndef attention(Q, K, V):\n    d_k = Q.size(-1)\n    scores = (Q @ K.transpose(-2, -1)) / d_k**0.5\n    return F.softmax(scores, dim=-1) @ V\nQ = K = V = torch.randn(1, 10, 64)   # (batch, seq, d_k)\nattention(Q, K, V).shape             # -> (1, 10, 64)' }],
      note: 'Self-attention: Q, K, V all come from the same sequence. Cross-attention: queries from one sequence attend to keys/values from another (e.g. decoder attending to encoder).' },

    { h: 'Generative models: autoencoders, VAEs, GANs, diffusion', p: [
      'Generative models learn the data distribution itself so they can create new samples. An <b>autoencoder</b> compresses input to a small <b>latent code</b> with an encoder and rebuilds it with a decoder, trained by reconstruction loss — great for compression and denoising, but its latent space has gaps you can&rsquo;t sample from cleanly.',
      'A <b>variational autoencoder (VAE)</b> makes the latent space a smooth probability distribution by encoding to a mean and variance and adding a <b>KL divergence</b> term that pulls the latents toward a standard normal; you then sample that normal to generate. <b>GANs</b> pit a <b>generator</b> against a <b>discriminator</b> in a minimax game — the generator learns to fool a critic that learns to spot fakes — yielding sharp images but tricky, unstable training. <b>Diffusion models</b> add Gaussian noise to data over many steps, then train a network to reverse it step by step; starting from pure noise and denoising produces state-of-the-art images (Stable Diffusion, DALL·E). They trade slow multi-step sampling for high quality and stable training.'],
      eqn: 'VAE:  L = reconstruction + KL( q(z|x) ‖ N(0,I) )        z = μ + σ ⊙ ε,  ε ~ N(0,I)\nGAN:  minG maxD  E[log D(x)] + E[log(1 − D(G(z)))]',
      table: { cols: ['Model', 'How it generates', 'Trade-off'], rows: [
        ['<b>Autoencoder</b>', 'decode a learned code', 'not truly generative'],
        ['<b>VAE</b>', 'sample a smooth latent, decode', 'blurrier samples'],
        ['<b>GAN</b>', 'generator fools a discriminator', 'sharp but unstable to train'],
        ['<b>Diffusion</b>', 'iteratively denoise from noise', 'top quality, slow sampling']] },
      ex: [{ h: 'The VAE reparameterization trick', p: ['You cannot backprop through a random sample <code>z ~ N(μ, σ²)</code>. The trick rewrites it as <code>z = μ + σ ⊙ ε</code> with <code>ε ~ N(0, I)</code> — now the randomness sits in <code>ε</code> (no gradient needed) and the gradient flows cleanly through <code>μ</code> and <code>σ</code>.'],
        code: 'import torch\ndef reparameterize(mu, logvar):\n    std = torch.exp(0.5 * logvar)\n    eps = torch.randn_like(std)      # random, no grad\n    return mu + eps * std            # grad flows via mu, std\nmu, logvar = torch.zeros(1, 20), torch.zeros(1, 20)\nz = reparameterize(mu, logvar)       # sampled latent, differentiable' }] },

    { h: 'Transfer learning & fine-tuning', p: [
      'Training from scratch needs huge data and compute. <b>Transfer learning</b> reuses a model already pretrained on a large corpus (ImageNet for vision, web text for language) and adapts it to your task — because early features (edges, syntax) are broadly useful. This is why a few hundred labelled examples can now solve problems that once needed millions.',
      'Two common strategies: <b>feature extraction</b> freezes the pretrained backbone and trains only a new head on top (fast, little data, small changes); <b>fine-tuning</b> unfreezes some or all layers and continues training at a <i>small</i> learning rate so you refine rather than destroy the learned weights. For giant models, <b>parameter-efficient</b> methods like <b>LoRA</b> train tiny added adapters and leave the base frozen — cheap and modular.'],
      eqn: 'strategy ≈ f(data size, similarity to pretraining):  little/similar → freeze;  much/different → fine-tune more',
      ex: [{ h: 'Fine-tuning a pretrained ResNet', p: ['Load ImageNet-pretrained ResNet-18, replace the 1000-class head with a 10-class one, and either freeze the backbone (feature extraction) or fine-tune it all at a low LR. Use a smaller learning rate on pretrained layers than on the fresh head so you nudge, not clobber, the transferred features.'],
        code: 'import torch, torch.nn as nn, torchvision.models as models\nnet = models.resnet18(weights=\'IMAGENET1K_V1\')\nfor p in net.parameters():      # freeze backbone\n    p.requires_grad = False\nnet.fc = nn.Linear(net.fc.in_features, 10)   # new trainable head\n# fine-tune instead: unfreeze & use a small lr, e.g. 1e-5' }] },

    { h: 'Hyperparameters & an end-to-end training loop', p: [
      'Weights are learned; <b>hyperparameters</b> are set by you and control <i>how</i> learning happens. The big three: <b>learning rate</b> (most important — start ~<code>3e-4</code> for Adam, tune by factors of 10, and use a schedule like warmup then decay); <b>batch size</b> (larger = smoother, faster per epoch, more memory; interacts with LR); and <b>epochs</b> (passes over the data — use early stopping rather than guessing). Tune the learning rate first, always watch a held-out validation curve, and change one thing at a time.',
      'Everything so far assembles into the same loop: forward pass → compute loss → <code>zero_grad</code> → <code>backward</code> → <code>step</code>, repeated over mini-batches for several epochs, evaluating on validation between epochs. Memorise this skeleton — every PyTorch project is a variation of it.'],
      table: { cols: ['Hyperparameter', 'Effect', 'Sensible start'], rows: [
        ['<b>Learning rate</b>', 'step size; too high diverges', '3e-4 (Adam), tune ×10'],
        ['<b>Batch size</b>', 'gradient noise vs memory/speed', '32–256, powers of 2'],
        ['<b>Epochs</b>', 'total passes over data', 'use early stopping'],
        ['<b>Weight decay</b>', 'regularization strength', '1e-4 – 1e-2'],
        ['<b>Hidden size / depth</b>', 'model capacity', 'grow until it overfits, then regularize']] },
      ex: [{ h: 'A complete PyTorch training loop', p: ['The full skeleton: set the model to train mode, loop epochs and batches, run the five-step update, then evaluate on validation with gradients disabled. Note <code>model.eval()</code> + <code>torch.no_grad()</code> at validation, and <code>CrossEntropyLoss</code> taking raw logits.'],
        code: 'import torch, torch.nn as nn, torch.optim as optim\n\nmodel = nn.Sequential(nn.Linear(784,256), nn.ReLU(),\n                      nn.Dropout(0.2), nn.Linear(256,10))\ncriterion = nn.CrossEntropyLoss()          # expects raw logits\noptimizer = optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-2)\n\nfor epoch in range(10):\n    model.train()\n    for xb, yb in train_loader:            # xb:(B,784) yb:(B,)\n        optimizer.zero_grad()              # 1. clear old grads\n        logits = model(xb)                 # 2. forward pass\n        loss = criterion(logits, yb)       # 3. compute loss\n        loss.backward()                    # 4. backprop (autograd)\n        optimizer.step()                   # 5. update weights\n\n    model.eval()                           # validation\n    correct = 0\n    with torch.no_grad():                  # no graph, faster\n        for xb, yb in val_loader:\n            preds = model(xb).argmax(dim=1)\n            correct += (preds == yb).sum().item()\n    print(f\'epoch {epoch}: val acc = {correct/len(val_loader.dataset):.3f}\')' }],
      note: 'A healthy run shows training and validation loss both falling together. If train keeps dropping while validation rises, you are overfitting — add regularization or stop earlier.' },
  ]
});
