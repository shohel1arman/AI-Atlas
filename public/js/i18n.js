/* ============================================================
   AI ATLAS — site i18n (English · বাংলা)
   Full text-node translation: any text whose English matches a
   dictionary key is shown in Bangla when বাংলা is selected, and
   restored to English when EN is selected. Originals are kept per
   node so switching is lossless. Code, math, formulas and inputs
   are skipped. A MutationObserver re-translates content that the
   playground scripts inject after load, so the page never mixes.
   Coverage grows as the dictionary grows; untranslated strings
   simply stay English (never break).
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'atlas-lang';

  /* Elements/classes whose text must never be translated (code, math, formulas). */
  var SKIP_TAG = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, TEXTAREA: 1, CANVAS: 1, NOSCRIPT: 1, SVG: 1 };
  var SKIP_CLASS = /(?:^|\s)(?:eqn|mono|td-formula|cs-console|cs-editor|tok|hljs|no-i18n|katex)(?:\s|$)/;

  var BN = {
    /* ===== chrome: sidebar groups ===== */
    'Overview': 'সংক্ষিপ্ত বিবরণ', 'Foundations': 'ভিত্তি',
    'Language & Generation': 'ভাষা ও জেনারেশন', 'Applied & Frontier': 'ফলিত ও অগ্রভাগ',
    'Systems & Research': 'সিস্টেম ও গবেষণা',
    /* ===== chrome: nav / sidebar items ===== */
    'Atlas Home': 'অ্যাটলাস হোম', 'Mathematics': 'গণিত', 'Data Analysis': 'ডেটা বিশ্লেষণ',
    'Machine Learning': 'মেশিন লার্নিং', 'Deep Learning Lab': 'ডিপ লার্নিং ল্যাব', 'Deep Learning': 'ডিপ লার্নিং',
    'Transformers & LLMs': 'ট্রান্সফরমার ও এলএলএম', 'Transformers': 'ট্রান্সফরমার',
    'LLM & Agents Lab': 'এলএলএম ও এজেন্ট ল্যাব', 'LLM & Agents': 'এলএলএম ও এজেন্ট',
    'Generative AI': 'জেনারেটিভ এআই', 'Explainable AI': 'ব্যাখ্যাযোগ্য এআই',
    'Computer Vision': 'কম্পিউটার ভিশন', 'Reinforcement Learning': 'রিইনফোর্সমেন্ট লার্নিং',
    'Time Series': 'টাইম সিরিজ', 'Prompt Engineering': 'প্রম্পট ইঞ্জিনিয়ারিং',
    'AI Ethics & Safety': 'এআই নৈতিকতা ও নিরাপত্তা', 'Code & Stack': 'কোড ও স্ট্যাক',
    'ETL & Data Eng.': 'ইটিএল ও ডেটা ইঞ্জিনিয়ারিং', 'ETL Pipelines': 'ইটিএল পাইপলাইন',
    'ETL & Data Engineering': 'ইটিএল ও ডেটা ইঞ্জিনিয়ারিং', 'MLOps': 'এমএলঅপস',
    'Research Lab': 'গবেষণা ল্যাব', 'Statistics & Data': 'পরিসংখ্যান ও ডেটা',
    'Ask Atlas…': 'অ্যাটলাসকে জিজ্ঞাসা করুন…', 'Your Atlas': 'আপনার অ্যাটলাস',
    'Free explorer': 'ফ্রি এক্সপ্লোরার', 'All Modules': 'সব মডিউল', 'Atlas': 'অ্যাটলাস', 'Home': 'হোম',

    /* ===== landing: nav + CTAs ===== */
    'ML': 'এমএল', 'Sign in': 'সাইন ইন', 'Open Atlas ›': 'অ্যাটলাস খুলুন ›',
    'Enter the Atlas': 'অ্যাটলাসে প্রবেশ করুন', 'Watch attention flow': 'অ্যাটেনশন ফ্লো দেখুন',
    'Interactive AI learning OS': 'ইন্টারঅ্যাক্টিভ এআই লার্নিং ওএস',
    'Interactive AI Learning OS': 'ইন্টারঅ্যাক্টিভ এআই লার্নিং ওএস',

    /* ===== landing: hero ===== */
    'Learn AI visually through simulations, playgrounds, animations, and interactive mathematical intuition — from a single vector all the way to a transformer.':
      'সিমুলেশন, প্লেগ্রাউন্ড, অ্যানিমেশন এবং ইন্টারঅ্যাক্টিভ গাণিতিক অন্তর্দৃষ্টির মাধ্যমে এআই দৃশ্যমানভাবে শিখুন — একটিমাত্র ভেক্টর থেকে শুরু করে ট্রান্সফরমার পর্যন্ত।',
    'interactive playgrounds': 'ইন্টারঅ্যাক্টিভ প্লেগ্রাউন্ড', 'core disciplines': 'মূল শাখা',
    'real-time simulation': 'রিয়েল-টাইম সিমুলেশন', 'SCROLL': 'স্ক্রল',
    'forward pass': 'ফরওয়ার্ড পাস', 'activations · 8 units': 'অ্যাক্টিভেশন · ৮ ইউনিট',
    'attention': 'অ্যাটেনশন', 'head 2': 'হেড ২',

    /* ===== landing: marquee ===== */
    'Linear Algebra': 'লিনিয়ার অ্যালজেবরা', 'Gradient Descent': 'গ্রেডিয়েন্ট ডিসেন্ট',
    'Backpropagation': 'ব্যাকপ্রোপাগেশন', 'Self-Attention': 'সেলফ-অ্যাটেনশন',
    'Diffusion': 'ডিফিউশন', 'Random Forests': 'র‍্যান্ডম ফরেস্ট', 'Convolutions': 'কনভল্যুশন',
    'Bayes Theorem': 'বেইজ থিওরেম', 'Vector Databases': 'ভেক্টর ডেটাবেস', 'Drift Detection': 'ড্রিফট ডিটেকশন',

    /* ===== landing: sections ===== */
    'Section 01 — Playground showcase': 'সেকশন ০১ — প্লেগ্রাউন্ড শোকেস',
    "Don't read about AI.": 'এআই নিয়ে শুধু পড়বেন না।', 'Play': 'খেলুন', 'with it.': 'এর সাথে।',
    'Every concept is a live, manipulable instrument. Drag the inputs, push the sliders, and watch the math respond in real time — the way TensorFlow Playground meets Distill.':
      'প্রতিটি ধারণা একটি জীবন্ত, হাতে-চালানো যন্ত্র। ইনপুট টেনে আনুন, স্লাইডার সরান, আর দেখুন গণিত রিয়েল-টাইমে সাড়া দিচ্ছে — টেনসরফ্লো প্লেগ্রাউন্ড ও Distill-এর মেলবন্ধনের মতো।',
    'flagship · deep learning lab': 'ফ্ল্যাগশিপ · ডিপ লার্নিং ল্যাব',
    'Build a neural network with your hands': 'নিজের হাতে একটি নিউরাল নেটওয়ার্ক তৈরি করুন',
    'Drag neurons onto layers, pick activations, hit train, and watch the forward pass light up and gradients ripple backward — frame by frame.':
      'লেয়ারে নিউরন টেনে আনুন, অ্যাক্টিভেশন বাছুন, ট্রেন চাপুন, আর দেখুন ফরওয়ার্ড পাস জ্বলে উঠছে ও গ্রেডিয়েন্ট পেছনে ছড়িয়ে পড়ছে — ফ্রেম ধরে ধরে।',
    'activations': 'অ্যাক্টিভেশন', 'live loss': 'লাইভ লস', 'flagship · transformers': 'ফ্ল্যাগশিপ · ট্রান্সফরমার',
    'See attention think': 'অ্যাটেনশনকে ভাবতে দেখুন',
    'Type a sentence and watch every token decide what to look at, head by head.':
      'একটি বাক্য লিখুন আর দেখুন প্রতিটি টোকেন কী দেখবে তা ঠিক করছে, হেড ধরে ধরে।',
    'multi-head': 'মাল্টি-হেড', 'machine learning': 'মেশিন লার্নিং', 'Regression, live': 'রিগ্রেশন, লাইভ',
    'Drag points; the line and loss surface chase your data.':
      'পয়েন্ট টেনে আনুন; রেখা ও লস সারফেস আপনার ডেটাকে অনুসরণ করবে।',
    'mathematics': 'গণিত', 'Vectors you can grab': 'ভেক্টর যা ধরা যায়',
    'Rotate, add, and project vectors with your cursor.': 'কার্সর দিয়ে ভেক্টর ঘোরান, যোগ করুন ও প্রজেক্ট করুন।',
    'generative ai': 'জেনারেটিভ এআই', 'Watch noise become image': 'নয়েজকে ছবি হতে দেখুন',
    'Scrub the diffusion denoising timeline step by step.': 'ডিফিউশন ডিনয়েজিং টাইমলাইন ধাপে ধাপে ঘুরিয়ে দেখুন।',

    'Section 02 — Mathematics': 'সেকশন ০২ — গণিত',
    'The intuition behind every equation': 'প্রতিটি সমীকরণের পেছনের অন্তর্দৃষ্টি',
    'Linear algebra and calculus stop being symbols and become things you can move. Drag a vector and watch its coordinates update; tilt a matrix and see space shear; release a ball on a loss surface and watch gradient descent find the valley.':
      'লিনিয়ার অ্যালজেবরা আর ক্যালকুলাস আর কেবল প্রতীক থাকে না — হয়ে ওঠে এমন জিনিস যা নাড়াচাড়া করা যায়। একটি ভেক্টর টানুন, এর স্থানাঙ্ক বদলাতে দেখুন; একটি ম্যাট্রিক্স হেলান, স্থান বিকৃত হতে দেখুন; লস সারফেসে একটি বল ছাড়ুন, গ্রেডিয়েন্ট ডিসেন্টকে উপত্যকা খুঁজে পেতে দেখুন।',
    'Gradient fields & descent': 'গ্রেডিয়েন্ট ফিল্ড ও ডিসেন্ট', 'Eigenvectors, visualized': 'আইগেনভেক্টর, দৃশ্যমান',
    'Bayes & distributions': 'বেইজ ও ডিস্ট্রিবিউশন', 'Chain rule, animated': 'চেইন রুল, অ্যানিমেটেড',
    'Open Mathematics Playground ›': 'গণিত প্লেগ্রাউন্ড খুলুন ›', 'gradient descent': 'গ্রেডিয়েন্ট ডিসেন্ট',
    'loss surface': 'লস সারফেস',

    'Section 03 — Machine Learning': 'সেকশন ০৩ — মেশিন লার্নিং',
    '25+ classic algorithms, each a sandbox': '২৫+ ক্লাসিক অ্যালগরিদম, প্রতিটিই একটি স্যান্ডবক্স',
    'Generate a dataset, drag the points, and watch decision boundaries breathe. From linear regression to gradient-boosted trees and DBSCAN clustering — every model is interactive.':
      'একটি ডেটাসেট তৈরি করুন, পয়েন্ট টানুন, আর ডিসিশন বাউন্ডারিকে নিঃশ্বাস নিতে দেখুন। লিনিয়ার রিগ্রেশন থেকে গ্রেডিয়েন্ট-বুস্টেড ট্রি ও DBSCAN ক্লাস্টারিং — প্রতিটি মডেলই ইন্টারঅ্যাক্টিভ।',
    'supervised': 'সুপারভাইজড', 'Regression': 'রিগ্রেশন', 'classification': 'ক্লাসিফিকেশন',
    'Boundaries': 'বাউন্ডারি', 'trees': 'ট্রি', 'Ensembles': 'এনসেম্বল', 'unsupervised': 'আনসুপারভাইজড',
    'Clustering': 'ক্লাস্টারিং', 'Explore all ML playgrounds ›': 'সব এমএল প্লেগ্রাউন্ড দেখুন ›',

    'Section 04 — Deep Learning': 'সেকশন ০৪ — ডিপ লার্নিং',
    'From a single perceptron to diffusion': 'একটি পারসেপট্রন থেকে ডিফিউশন পর্যন্ত',
    'Watch a convolution kernel slide across an image, a forward pass illuminate, and gradients flow backward through the chain rule. Build the architecture, then press play.':
      'একটি কনভল্যুশন কার্নেলকে ছবির উপর দিয়ে সরতে দেখুন, ফরওয়ার্ড পাস জ্বলে উঠতে দেখুন, আর চেইন রুলের মধ্য দিয়ে গ্রেডিয়েন্ট পেছনে বইতে দেখুন। আর্কিটেকচার তৈরি করুন, তারপর প্লে চাপুন।',
    'Perceptron': 'পারসেপট্রন', 'Autoencoder': 'অটোএনকোডার', 'Open Deep Learning Lab ›': 'ডিপ লার্নিং ল্যাব খুলুন ›',

    'Section 05 — Transformers & LLMs': 'সেকশন ০৫ — ট্রান্সফরমার ও এলএলএম',
    'The architecture that changed everything': 'যে আর্কিটেকচার সবকিছু বদলে দিয়েছে',
    'Tokenize text, embed it into vectors, add positional encoding, and route it through self-attention. Inspect every head, watch next-token probabilities form, and simulate retrieval-augmented generation.':
      'টেক্সট টোকেনাইজ করুন, ভেক্টরে এমবেড করুন, পজিশনাল এনকোডিং যোগ করুন, আর সেলফ-অ্যাটেনশনের মধ্য দিয়ে পাঠান। প্রতিটি হেড পরীক্ষা করুন, নেক্সট-টোকেন সম্ভাবনা গঠিত হতে দেখুন, আর রিট্রিভাল-অগমেন্টেড জেনারেশন সিমুলেট করুন।',
    'Multi-head heatmaps': 'মাল্টি-হেড হিটম্যাপ', 'embeddings': 'এমবেডিং', 'Semantic space': 'সিম্যান্টিক স্পেস',
    'decoding': 'ডিকোডিং', 'Next token': 'নেক্সট টোকেন',
    'From a tokenizer to a tool-using agent — the whole stack': 'একটি টোকেনাইজার থেকে টুল-ব্যবহারকারী এজেন্ট — পুরো স্ট্যাক',
    'Open LLM & Agents Lab ›': 'এলএলএম ও এজেন্ট ল্যাব খুলুন ›',

    'Section 06 — Explainable AI': 'সেকশন ০৬ — ব্যাখ্যাযোগ্য এআই', 'Open the black box': 'ব্ল্যাক বক্স খুলুন',
    'why': 'কেন',
    'a model decided what it did. Toggle a feature and watch its attribution push the prediction up or down.':
      'একটি মডেল কেন যা করেছে তা করল। একটি ফিচার টগল করুন আর দেখুন এর অ্যাট্রিবিউশন প্রেডিকশনকে উপরে বা নিচে ঠেলছে।',
    'Open Explainable AI ›': 'ব্যাখ্যাযোগ্য এআই খুলুন ›', 'SHAP values': 'SHAP মান',
    'income': 'আয়', 'tenure': 'মেয়াদ', 'age': 'বয়স', 'region': 'অঞ্চল',

    'Section 07 — Data Engineering & MLOps': 'সেকশন ০৭ — ডেটা ইঞ্জিনিয়ারিং ও এমএলঅপস',
    'The systems that keep AI alive': 'যে সিস্টেমগুলো এআইকে সচল রাখে',
    'Build an ETL DAG by dragging nodes and connecting them, then watch data flow through. On the MLOps side: deploy, monitor, and catch drift before it hurts.':
      'নোড টেনে এনে ও সংযুক্ত করে একটি ইটিএল DAG তৈরি করুন, তারপর ডেটা প্রবাহিত হতে দেখুন। এমএলঅপসের দিকে: ডিপ্লয় করুন, মনিটর করুন, আর ক্ষতি হওয়ার আগেই ড্রিফট ধরুন।',
    'ETL · data engineering': 'ইটিএল · ডেটা ইঞ্জিনিয়ারিং', 'Drag-and-drop pipeline builder': 'ড্র্যাগ-অ্যান্ড-ড্রপ পাইপলাইন বিল্ডার',
    'Compose Extract → Transform → Load DAGs and simulate streaming data, Airflow-style.':
      'Extract → Transform → Load DAG সাজান আর স্ট্রিমিং ডেটা সিমুলেট করুন, Airflow-স্টাইলে।',
    'Drift, before it bites': 'ড্রিফট, কামড় বসানোর আগেই',
    'Monitor live models and watch the distribution shift in real time.':
      'লাইভ মডেল মনিটর করুন আর রিয়েল-টাইমে ডিস্ট্রিবিউশন সরে যেতে দেখুন।',

    'Section 08 — AI Research Lab': 'সেকশন ০৮ — এআই গবেষণা ল্যাব', 'Think like a researcher': 'গবেষকের মতো ভাবুন',
    'Bias vs. variance, cross-validation, bootstrap sampling, uncertainty estimation, and statistical testing — the methods that separate a demo from a result.':
      'বায়াস বনাম ভ্যারিয়েন্স, ক্রস-ভ্যালিডেশন, বুটস্ট্র্যাপ স্যাম্পলিং, অনিশ্চয়তা নিরূপণ, আর পরিসংখ্যানিক পরীক্ষা — যে পদ্ধতিগুলো একটি ডেমো আর একটি ফলাফলের মধ্যে পার্থক্য গড়ে।',
    'Cross-validation': 'ক্রস-ভ্যালিডেশন', 'Bootstrap': 'বুটস্ট্র্যাপ', 'Uncertainty': 'অনিশ্চয়তা',
    'Active learning': 'অ্যাক্টিভ লার্নিং', 'A/B testing': 'এ/বি টেস্টিং', 'Open Research Lab ›': 'গবেষণা ল্যাব খুলুন ›',

    'Section 09 — Community': 'সেকশন ০৯ — কমিউনিটি', 'Learn alongside 40,000 builders': '৪০,০০০ নির্মাতার সাথে শিখুন',
    'Fork playgrounds, publish your own simulations, and follow guided learning paths curated by researchers and practitioners.':
      'প্লেগ্রাউন্ড ফর্ক করুন, নিজের সিমুলেশন প্রকাশ করুন, আর গবেষক ও অনুশীলনকারীদের সাজানো গাইডেড লার্নিং পথ অনুসরণ করুন।',
    'Join the Atlas ›': 'অ্যাটলাসে যোগ দিন ›',

    'Section 10 — AI Assistant': 'সেকশন ১০ — এআই সহকারী',
    'An assistant that opens the right door': 'একটি সহকারী যা সঠিক দরজা খুলে দেয়',
    'Ask a question in plain language. The Atlas assistant explains the concept, then takes you straight to the live playground — and highlights exactly what to look at.':
      'সহজ ভাষায় প্রশ্ন করুন। অ্যাটলাস সহকারী ধারণাটি বুঝিয়ে দেয়, তারপর সরাসরি লাইভ প্লেগ্রাউন্ডে নিয়ে যায় — আর ঠিক কোথায় তাকাতে হবে তা তুলে ধরে।',
    'you ask →': 'আপনি জিজ্ঞাসা করুন →', 'atlas →': 'অ্যাটলাস →',
    'Opens the Transformer Playground · highlights the attention heatmap · explains Q·K·V · starts the simulation.':
      'ট্রান্সফরমার প্লেগ্রাউন্ড খোলে · অ্যাটেনশন হিটম্যাপ তুলে ধরে · Q·K·V বোঝায় · সিমুলেশন শুরু করে।',
    'Try the assistant ›': 'সহকারী ব্যবহার করে দেখুন ›', 'Atlas Assistant': 'অ্যাটলাস সহকারী', 'online': 'অনলাইন',
    'Explain self-attention': 'সেলফ-অ্যাটেনশন বোঝাও',
    'Every token emits a': 'প্রতিটি টোকেন একটি নির্গত করে', 'query': 'কোয়েরি', 'key': 'কী', ', and': ', আর', 'value': 'ভ্যালু',
    '. The dot-product of queries and keys becomes the attention weight — opening the playground with the heatmap live →':
      '। কোয়েরি ও কী-এর ডট-প্রোডাক্ট হয়ে ওঠে অ্যাটেনশন ওয়েট — হিটম্যাপসহ প্লেগ্রাউন্ড লাইভ খুলছে →',
    'Open Transformers ›': 'ট্রান্সফরমার খুলুন ›',

    /* ===== landing: footer ===== */
    'The interactive universe of artificial intelligence. Built for visual, hands-on learners.':
      'কৃত্রিম বুদ্ধিমত্তার ইন্টারঅ্যাক্টিভ মহাবিশ্ব। দৃশ্যনির্ভর, হাতে-কলমে শিক্ষার্থীদের জন্য তৈরি।',
    'Learn': 'শিখুন', 'Build': 'তৈরি করুন', 'AI Assistant': 'এআই সহকারী', 'Community': 'কমিউনিটি',
    '· AI Atlas — The future of AI education': '· এআই অ্যাটলাস — এআই শিক্ষার ভবিষ্যৎ',
    'Atlas Ronin': 'অ্যাটলাস রনিন', 'online · your AI samurai guide': 'অনলাইন · আপনার এআই সামুরাই গাইড',
    'Transformer attention': 'ট্রান্সফরমার অ্যাটেনশন', 'Neural networks': 'নিউরাল নেটওয়ার্ক',
    'Linear regression': 'লিনিয়ার রিগ্রেশন', 'ETL pipeline': 'ইটিএল পাইপলাইন',

    /* ===== module eyebrows ===== */
    'Machine Learning Playground': 'মেশিন লার্নিং প্লেগ্রাউন্ড', 'Mathematics Playground': 'গণিত প্লেগ্রাউন্ড',
    'MLOps Playground': 'এমএলঅপস প্লেগ্রাউন্ড', 'Generative AI Lab': 'জেনারেটিভ এআই ল্যাব',
    'Language & Generation (NLP)': 'ভাষা ও জেনারেশন (এনএলপি)', 'AI Research Lab': 'এআই গবেষণা ল্যাব',
    'Time Series & Forecasting': 'টাইম সিরিজ ও ফোরকাস্টিং', 'Explainable AI (XAI)': 'ব্যাখ্যাযোগ্য এআই (এক্সএআই)',

    /* ===== module headings ===== */
    'Powerful systems, real consequences': 'শক্তিশালী সিস্টেম, বাস্তব পরিণতি',
    'Teaching machines to see': 'যন্ত্রকে দেখতে শেখানো',
    'Query, visualize, and reason about data': 'ডেটা নিয়ে কোয়েরি, ভিজ্যুয়ালাইজ ও যুক্তি করুন',
    'Build reliable paths from raw data to useful data': 'কাঁচা ডেটা থেকে উপযোগী ডেটায় নির্ভরযোগ্য পথ তৈরি করুন',
    'The map before the territory': 'ভূখণ্ডের আগে মানচিত্র',
    'Create images, audio, and motion from learned distributions': 'শেখা ডিস্ট্রিবিউশন থেকে ছবি, অডিও ও মোশন তৈরি করুন',
    'Build, run, tune, and orchestrate language models': 'ভাষা মডেল তৈরি, চালনা, টিউন ও অর্কেস্ট্রেট করুন',
    'Classic models, each a live sandbox': 'ক্লাসিক মডেল, প্রতিটিই একটি লাইভ স্যান্ডবক্স',
    'Operate models with evidence and safe controls': 'প্রমাণ ও নিরাপদ নিয়ন্ত্রণসহ মডেল পরিচালনা করুন',
    'How machines read and write': 'যন্ত্র কীভাবে পড়ে ও লেখে',
    'The languages and systems that power AI': 'যে ভাষা ও সিস্টেম এআইকে শক্তি দেয়',
    'The interface is language': 'ইন্টারফেসটাই ভাষা', 'Learning from reward, not labels': 'লেবেল নয়, পুরস্কার থেকে শেখা',
    'Turn observations into defensible evidence': 'পর্যবেক্ষণকে রূপান্তর করুন রক্ষণযোগ্য প্রমাণে',
    'Data that remembers its order': 'যে ডেটা তার ক্রম মনে রাখে',

    /* ===== common module controls / buttons (shared across playgrounds) ===== */
    'Reset data': 'ডেটা রিসেট করুন', 'Reset': 'রিসেট', 'New data': 'নতুন ডেটা', 'Clear': 'মুছুন',
    'New Data': 'নতুন ডেটা', 'Generate new sample': 'নতুন নমুনা তৈরি করুন', 'Resample folds': 'ফোল্ড রিস্যাম্পল করুন',
    'Mark this lesson complete': 'এই পাঠটি সম্পন্ন চিহ্নিত করুন', 'complete lesson': 'পাঠ সম্পন্ন',
    'worked example': 'সমাধানকৃত উদাহরণ', 'try it above': 'উপরে চেষ্টা করুন', 'Model': 'মডেল',
    'Step': 'ধাপ'
  };

  /* Whole-element HTML swaps (for text split into animated spans etc.). */
  var HTMLBN = {
    'hero-title': '<span class="w">কৃত্রিম</span> <span class="w">বুদ্ধিমত্তার</span> <span class="w">ইন্টারঅ্যাক্টিভ</span><br/><span class="w gradient-text">মহাবিশ্ব</span>'
  };

  var orig = new WeakMap();

  function skipped(node) {
    var p = node.parentNode;
    while (p && p.nodeType === 1) {
      if (SKIP_TAG[p.tagName]) return true;
      var cls = p.getAttribute && p.getAttribute('class');
      if (cls && SKIP_CLASS.test(' ' + cls + ' ')) return true;
      if (p.hasAttribute && p.hasAttribute('data-no-i18n')) return true;
      p = p.parentNode;
    }
    return false;
  }

  function walk(root, map) {
    if (!root) return;
    if (root.nodeType === 3) { translateNode(root, map); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = tw.nextNode())) nodes.push(n);
    nodes.forEach(function (node) { translateNode(node, map); });
  }

  function translateNode(node, map) {
    var raw = node.nodeValue;
    if (!raw || !raw.trim()) return;
    if (skipped(node)) return;
    if (!orig.has(node)) orig.set(node, raw);
    var source = orig.get(node);
    var st = source.trim();
    if (map) {
      if (Object.prototype.hasOwnProperty.call(map, st)) {
        var out = source.replace(st, map[st]);
        if (node.nodeValue !== out) node.nodeValue = out;
      }
    } else if (node.nodeValue !== source) {
      node.nodeValue = source;
    }
  }

  function applyHTML(lang) {
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      if (el.__origHTML == null) el.__origHTML = el.innerHTML;
      var k = el.getAttribute('data-i18n-html');
      el.innerHTML = (lang === 'bn' && HTMLBN[k]) ? HTMLBN[k] : el.__origHTML;
      if (el.id === 'hero-title') el.classList.add('in');
    });
  }

  var observer = null;
  function apply(lang) {
    var map = lang === 'bn' ? BN : null;
    try { document.documentElement.setAttribute('lang', lang === 'bn' ? 'bn' : 'en'); } catch (e) {}
    if (observer) observer.disconnect();
    walk(document.body, map);
    applyHTML(lang);
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var en = el.getAttribute('data-i18n-ph');
      el.setAttribute('placeholder', (map && map[en]) ? map[en] : en);
    });
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      var on = b.getAttribute('data-lang-btn') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    if (observer) observer.observe(document.body, { childList: true, subtree: true });
  }

  function get() { try { return localStorage.getItem(KEY) === 'bn' ? 'bn' : 'en'; } catch (e) { return 'en'; } }
  function set(lang) { lang = lang === 'bn' ? 'bn' : 'en'; try { localStorage.setItem(KEY, lang); } catch (e) {} apply(lang); }
  window.AtlasI18n = { get: get, set: set, apply: apply, dict: BN };

  function boot() {
    var pending = null;
    observer = new MutationObserver(function (muts) {
      if (get() !== 'bn') return;
      var added = [];
      muts.forEach(function (m) { m.addedNodes && m.addedNodes.forEach(function (x) { added.push(x); }); });
      if (!added.length) return;
      clearTimeout(pending);
      pending = setTimeout(function () {
        observer.disconnect();
        added.forEach(function (x) { walk(x, BN); });
        observer.observe(document.body, { childList: true, subtree: true });
      }, 60);
    });
    apply(get());
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-lang-btn]') : null;
      if (b) { e.preventDefault(); set(b.getAttribute('data-lang-btn')); }
    });
    setTimeout(function () { apply(get()); }, 120);
    setTimeout(function () { apply(get()); }, 600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
