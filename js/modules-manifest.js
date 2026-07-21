/* ============================================================
   AI ATLAS — module & lesson manifest
   ------------------------------------------------------------
   Single source of truth for progress tracking. Each module
   lists its lessons (one per tab; single-interaction pages get
   one lesson). Progress % = completed lessons / total lessons.
   `id` matches <body data-page="..."> and each lesson `id`
   matches a tab's data-tab (or the page id for single pages).
   ============================================================ */
window.ATLAS_MODULES = [
  { id: 'foundations', title: 'Foundations', color: '#8B8CF6', href: 'modules/foundations.html', lessons: [
    { id: 'flow', label: 'AI Workflow Pipeline' },
    { id: 'time', label: 'History of AI' },
  ]},
  { id: 'mathematics', title: 'Mathematics', color: '#34D399', href: 'modules/mathematics.html', lessons: [
    { id: 'vec',  label: 'Vectors' },
    { id: 'grad', label: 'Gradient Descent' },
    { id: 'mat',  label: 'Matrix Transform' },
    { id: 'prob', label: 'Statistics' },
  ]},
  { id: 'data-analysis', title: 'Data Analysis', color: '#2EC4DE', href: 'modules/data-analysis.html', lessons: [
    { id: 'sql',  label: 'SQL Explorer' },
    { id: 'dash', label: 'Dashboard' },
  ]},
  { id: 'machine-learning', title: 'Machine Learning', color: '#22D3EE', href: 'modules/machine-learning.html', lessons: [
    { id: 'reg',  label: 'Regression' },
    { id: 'km',   label: 'Clustering (K-Means)' },
    { id: 'cls',  label: 'Classification' },
    { id: 'tree', label: 'Ensembles' },
  ]},
  { id: 'deep-learning', title: 'Deep Learning Lab', color: '#6366F1', href: 'modules/deep-learning.html', lessons: [
    { id: 'nn',  label: 'Neural Net Playground' },
    { id: 'cnn', label: 'Convolutions' },
    { id: 'seq', label: 'RNN · LSTM' },
    { id: 'gen', label: 'Autoencoders · GANs' },
  ]},
  { id: 'nlp', title: 'Language & Generation', color: '#A855F7', href: 'modules/nlp.html', lessons: [
    { id: 'tok',   label: 'Tokenizer' },
    { id: 'tfidf', label: 'TF-IDF' },
    { id: 'samp',  label: 'Sampling & Temperature' },
  ]},
  { id: 'transformers', title: 'Transformers & LLMs', color: '#A855F7', href: 'modules/transformers.html', lessons: [
    { id: 'attn', label: 'Self-Attention' },
    { id: 'tok',  label: 'Tokenization' },
    { id: 'next', label: 'Next-Token' },
    { id: 'rag',  label: 'RAG & Embeddings' },
  ]},
  { id: 'llm-agents', title: 'LLM & Agents Lab', color: '#818CF8', href: 'modules/llm-agents.html', lessons: [
    { id: 'build', label: 'Build an LLM' },
    { id: 'local', label: 'Run on Your PC' },
    { id: 'agent', label: 'Agent Builder' },
    { id: 'tune',  label: 'Fine-tune & LoRA' },
  ]},
  { id: 'generative', title: 'Generative AI', color: '#FB7185', href: 'modules/generative.html', lessons: [
    { id: 'generative', label: 'Diffusion Denoiser' },
  ]},
  { id: 'xai', title: 'Explainable AI', color: '#F59E0B', href: 'modules/xai.html', lessons: [
    { id: 'xai', label: 'SHAP Attribution' },
  ]},
  { id: 'etl', title: 'ETL & Data Eng.', color: '#22D3EE', href: 'modules/etl.html', lessons: [
    { id: 'etl', label: 'ETL DAG Builder' },
  ]},
  { id: 'programming', title: 'Code & Stack', color: '#F59E0B', href: 'modules/programming.html', lessons: [
    { id: 'lang', label: 'Learn & Run' },
    { id: 'libs', label: 'The Stack' },
    { id: 'db',   label: 'SQL vs NoSQL' },
  ]},
  { id: 'mlops', title: 'MLOps', color: '#34D399', href: 'modules/mlops.html', lessons: [
    { id: 'mlops', label: 'Drift Monitor' },
  ]},
  { id: 'research', title: 'AI Research Lab', color: '#8B8CF6', href: 'modules/research.html', lessons: [
    { id: 'research', label: 'Statistical Methods' },
  ]},
];

/* quick lookup by page id */
window.ATLAS_MODULE_BY_ID = window.ATLAS_MODULES.reduce((m, x) => (m[x.id] = x, m), {});
