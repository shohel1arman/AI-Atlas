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
    'Step': 'ধাপ',

    /* ===== module tab labels (all modules) ===== */
    'A/B Testing': 'এ/বি টেস্টিং', 'AI Libraries': 'এআই লাইব্রেরি', 'AI Workflow Pipeline': 'এআই ওয়ার্কফ্লো পাইপলাইন',
    'APIs & Services': 'এপিআই ও সার্ভিস', 'Ablation Studies': 'অ্যাবলেশন স্টাডি', 'Activations': 'অ্যাক্টিভেশন',
    'Agent Builder': 'এজেন্ট বিল্ডার', 'Agent Memory': 'এজেন্ট মেমরি', 'Alignment & Safety': 'অ্যালাইনমেন্ট ও নিরাপত্তা',
    'Anomaly Detection': 'অ্যানোমালি ডিটেকশন', 'Audio Generation': 'অডিও জেনারেশন', 'Autocorrelation': 'অটোকোরিলেশন',
    'Autoencoders · GANs': 'অটোএনকোডার · GAN', 'Automated Retraining': 'স্বয়ংক্রিয় রিট্রেনিং', 'Backtesting': 'ব্যাকটেস্টিং',
    'Batch & Streaming': 'ব্যাচ ও স্ট্রিমিং', 'Bias & Variance': 'বায়াস ও ভ্যারিয়েন্স', 'Bootstrap & CI': 'বুটস্ট্র্যাপ ও CI',
    'Build an LLM': 'একটি এলএলএম তৈরি করুন', 'CI/CD for ML': 'এমএলের জন্য CI/CD', 'CNN Architectures': 'CNN আর্কিটেকচার',
    'Calculus': 'ক্যালকুলাস', 'Classification': 'ক্লাসিফিকেশন', 'Cloud & Compute': 'ক্লাউড ও কম্পিউট',
    'Clustering (K-Means)': 'ক্লাস্টারিং (K-Means)', 'Containers': 'কন্টেইনার', 'Context Window': 'কনটেক্সট উইন্ডো',
    'Control & Inpainting': 'কন্ট্রোল ও ইনপেইন্টিং', 'Convolution & Filters': 'কনভল্যুশন ও ফিল্টার', 'Convolutions': 'কনভল্যুশন',
    'Correlation': 'কোরিলেশন', 'Counterfactuals': 'কাউন্টারফ্যাকচুয়াল', 'Cross-Validation': 'ক্রস-ভ্যালিডেশন',
    'Dashboard': 'ড্যাশবোর্ড', 'Data Augmentation': 'ডেটা অগমেন্টেশন', 'Data Cleaning': 'ডেটা ক্লিনিং',
    'Data Quality': 'ডেটা কোয়ালিটি', 'Data Transforms': 'ডেটা ট্রান্সফর্ম', 'Decoding Params': 'ডিকোডিং প্যারামিটার',
    'Decomposition': 'ডিকম্পোজিশন', 'Deployment Strategies': 'ডিপ্লয়মেন্ট কৌশল', 'Detection & IoU': 'ডিটেকশন ও IoU',
    'Diffusion Denoiser': 'ডিফিউশন ডিনয়েজার', 'Discount & Return': 'ডিসকাউন্ট ও রিটার্ন', 'Distributions': 'ডিস্ট্রিবিউশন',
    'Drift Monitor': 'ড্রিফট মনিটর', 'ETL DAG Builder': 'ইটিএল DAG বিল্ডার', 'Eigenvalues & PCA': 'আইগেনভ্যালু ও PCA',
    'Encoder vs Decoder': 'এনকোডার বনাম ডিকোডার', 'Ensembles': 'এনসেম্বল', 'Evaluation & Safety': 'মূল্যায়ন ও নিরাপত্তা',
    'Experiment Tracking': 'এক্সপেরিমেন্ট ট্র্যাকিং', 'Experimental Power': 'এক্সপেরিমেন্টাল পাওয়ার', 'Exploration': 'এক্সপ্লোরেশন',
    'Exploratory Analysis': 'এক্সপ্লোরেটরি বিশ্লেষণ', 'Fairness Audit': 'ফেয়ারনেস অডিট', 'Fairness Metrics': 'ফেয়ারনেস মেট্রিক',
    'Feature Engineering': 'ফিচার ইঞ্জিনিয়ারিং', 'Feature Stores': 'ফিচার স্টোর', 'Few-shot & CoT': 'ফিউ-শট ও CoT',
    'Fine-tune & LoRA': 'ফাইন-টিউন ও LoRA', 'Forecasting': 'ফোরকাস্টিং', 'Git & Versioning': 'Git ও ভার্সনিং',
    'Global Importance': 'গ্লোবাল ইম্পর্ট্যান্স', 'Governance': 'গভর্নেন্স', 'Governance & Lineage': 'গভর্নেন্স ও লিনিয়েজ',
    'Grad-CAM': 'Grad-CAM', 'Grounding & RAG': 'গ্রাউন্ডিং ও RAG', 'Guidance': 'গাইডেন্স', 'History of AI': 'এআইয়ের ইতিহাস',
    'Hypothesis Testing': 'হাইপোথিসিস টেস্টিং', 'Image as Numbers': 'ছবি সংখ্যা হিসেবে', 'Impossibility': 'অসম্ভাব্যতা',
    'Information Theory': 'ইনফরমেশন থিওরি', 'Injection & Safety': 'ইনজেকশন ও নিরাপত্তা', 'LIME Neighbourhood': 'LIME নেইবারহুড',
    'LLM Interpretability': 'এলএলএম ইন্টারপ্রিটেবিলিটি', 'Latent Space': 'ল্যাটেন্ট স্পেস', 'Learn & Run': 'শিখুন ও চালান',
    'MDPs & Gridworld': 'MDP ও গ্রিডওয়ার্ল্ড', 'Matrix Operations': 'ম্যাট্রিক্স অপারেশন', 'Matrix Transform': 'ম্যাট্রিক্স ট্রান্সফর্ম',
    'Message Roles': 'মেসেজ রোল', 'Model Evaluation': 'মডেল মূল্যায়ন', 'Model Registry': 'মডেল রেজিস্ট্রি',
    'Multi-Armed Bandit': 'মাল্টি-আর্মড ব্যান্ডিট', 'N-gram Models': 'N-গ্রাম মডেল', 'Named Entities': 'নেমড এনটিটি',
    'Neural Net Playground': 'নিউরাল নেট প্লেগ্রাউন্ড', 'Next-Token': 'নেক্সট-টোকেন', 'Noise Schedules': 'নয়েজ শিডিউল',
    'Optimizers': 'অপটিমাইজার', 'Orchestration': 'অর্কেস্ট্রেশন', 'PDP & ICE': 'PDP ও ICE', 'Policy Gradients': 'পলিসি গ্রেডিয়েন্ট',
    'Pooling & Stride': 'পুলিং ও স্ট্রাইড', 'Position Encoding': 'পজিশন এনকোডিং', 'Privacy & DP': 'প্রাইভেসি ও DP',
    'Probability': 'সম্ভাব্যতা', 'Production Monitoring': 'প্রোডাকশন মনিটরিং', 'Prompt Anatomy': 'প্রম্পট অ্যানাটমি',
    'Prompt Design': 'প্রম্পট ডিজাইন', 'Q-Learning': 'Q-লার্নিং', 'RAG & Embeddings': 'RAG ও এমবেডিং', 'RNN · LSTM': 'RNN · LSTM',
    'Reasoning Patterns': 'রিজনিং প্যাটার্ন', 'Red-teaming': 'রেড-টিমিং', 'Regularization': 'রেগুলারাইজেশন',
    'Regulation Map': 'রেগুলেশন ম্যাপ', 'Reproducibility': 'রিপ্রোডিউসিবিলিটি', 'Research Reporting': 'গবেষণা রিপোর্টিং',
    'Run on Your PC': 'নিজের পিসিতে চালান', 'SARSA vs Q-Learning': 'SARSA বনাম Q-লার্নিং', 'SHAP Attribution': 'SHAP অ্যাট্রিবিউশন',
    'SQL Explorer': 'SQL এক্সপ্লোরার', 'SQL vs NoSQL': 'SQL বনাম NoSQL', 'Sampling & Temperature': 'স্যাম্পলিং ও টেম্পারেচার',
    'Segmentation': 'সেগমেন্টেশন', 'Seq2Seq Decoding': 'Seq2Seq ডিকোডিং', 'Smoothing': 'স্মুদিং', 'Sources of Bias': 'বায়াসের উৎস',
    'Spark & Scale': 'Spark ও স্কেল', 'Stationarity': 'স্টেশনারিটি', 'Statistics': 'পরিসংখ্যান', 'Structured Output': 'স্ট্রাকচার্ড আউটপুট',
    'Tensors': 'টেনসর', 'Testing & Debugging': 'টেস্টিং ও ডিবাগিং', 'Text Classification': 'টেক্সট ক্লাসিফিকেশন',
    'The RL Loop': 'আরএল লুপ', 'Tokenization': 'টোকেনাইজেশন', 'Tokenizer': 'টোকেনাইজার', 'Tool Calling': 'টুল কলিং',
    'Transfer Learning': 'ট্রান্সফার লার্নিং', 'Transformer Block': 'ট্রান্সফরমার ব্লক', 'Vectors': 'ভেক্টর',
    'Video Generation': 'ভিডিও জেনারেশন', 'Vision Transformers': 'ভিশন ট্রান্সফরমার', 'Warehouse Modeling': 'ওয়্যারহাউস মডেলিং',
    'Word Embeddings': 'ওয়ার্ড এমবেডিং',

    /* ===== lesson tags ===== */
    'accountability': 'জবাবদিহিতা', 'actionable explanation': 'কার্যকর ব্যাখ্যা', 'agents': 'এজেন্ট',
    'analytics modeling': 'অ্যানালিটিক্স মডেলিং', 'architecture': 'আর্কিটেকচার', 'audio generation': 'অডিও জেনারেশন',
    'automation policy': 'অটোমেশন পলিসি', 'bi dashboard': 'বিআই ড্যাশবোর্ড', 'build': 'বিল্ড',
    'calculus · change': 'ক্যালকুলাস · পরিবর্তন', 'calculus · optimization': 'ক্যালকুলাস · অপটিমাইজেশন',
    'causal contribution': 'কার্যকারণ অবদান', 'conditional generation': 'কন্ডিশনাল জেনারেশন', 'conditioning': 'কন্ডিশনিং',
    'creative control': 'ক্রিয়েটিভ কন্ট্রোল', 'data contracts': 'ডেটা কন্ট্রাক্ট', 'data ingestion': 'ডেটা ইনজেশন',
    'data preparation': 'ডেটা প্রস্তুতি', 'data quality': 'ডেটা কোয়ালিটি', 'data stores': 'ডেটা স্টোর',
    'delivery automation': 'ডেলিভারি অটোমেশন', 'descriptive statistics': 'বর্ণনামূলক পরিসংখ্যান', 'diffusion': 'ডিফিউশন',
    'diffusion dynamics': 'ডিফিউশন ডাইনামিক্স', 'distributed compute': 'ডিস্ট্রিবিউটেড কম্পিউট', 'ensembles': 'এনসেম্বল',
    'experimental design': 'এক্সপেরিমেন্টাল ডিজাইন', 'experimentation': 'এক্সপেরিমেন্টেশন', 'exploratory analysis': 'এক্সপ্লোরেটরি বিশ্লেষণ',
    'feature effects': 'ফিচার ইফেক্ট', 'fine-tuning': 'ফাইন-টিউনিং', 'frameworks': 'ফ্রেমওয়ার্ক',
    'function calling': 'ফাংশন কলিং', 'fundamentals': 'মৌলিক বিষয়', 'generalization': 'জেনারালাইজেশন',
    'generation': 'জেনারেশন', 'generative': 'জেনারেটিভ', 'global behaviour': 'গ্লোবাল আচরণ',
    'history · 4 eras': 'ইতিহাস · ৪ যুগ', 'inference': 'ইনফারেন্স', 'information extraction': 'ইনফরমেশন এক্সট্রাকশন',
    'information theory': 'ইনফরমেশন থিওরি', 'infrastructure': 'ইনফ্রাস্ট্রাকচার', 'language model internals': 'ল্যাঙ্গুয়েজ মডেল ইন্টারনাল',
    'language modelling': 'ল্যাঙ্গুয়েজ মডেলিং', 'linear algebra': 'লিনিয়ার অ্যালজেবরা',
    'linear algebra · computation': 'লিনিয়ার অ্যালজেবরা · কম্পিউটেশন', 'linear algebra · dimensions': 'লিনিয়ার অ্যালজেবরা · ডাইমেনশন',
    'linear algebra · structure': 'লিনিয়ার অ্যালজেবরা · স্ট্রাকচার', 'local attribution': 'লোকাল অ্যাট্রিবিউশন',
    'local surrogate': 'লোকাল সারোগেট', 'machine-learning data': 'মেশিন-লার্নিং ডেটা', 'memory budget': 'মেমরি বাজেট',
    'model control': 'মডেল কন্ট্রোল', 'model families': 'মডেল ফ্যামিলি', 'model lifecycle': 'মডেল লাইফসাইকেল',
    'nlp basics': 'এনএলপি বেসিক', 'nlp task': 'এনএলপি টাস্ক', 'non-linearity': 'নন-লিনিয়ারিটি', 'operations': 'অপারেশন',
    'pipelines': 'পাইপলাইন', 'portable runtime': 'পোর্টেবল রানটাইম', 'probability · statistics': 'সম্ভাব্যতা · পরিসংখ্যান',
    'probability · uncertainty': 'সম্ভাব্যতা · অনিশ্চয়তা', 'process · 6 stages': 'প্রক্রিয়া · ৬ ধাপ',
    'production signals': 'প্রোডাকশন সিগন্যাল', 'prompting': 'প্রম্পটিং', 'python for ai': 'এআইয়ের জন্য পাইথন',
    'quality & safety': 'গুণমান ও নিরাপত্তা', 'relationships': 'সম্পর্ক', 'representation': 'রিপ্রেজেন্টেশন',
    'reproducibility': 'রিপ্রোডিউসিবিলিটি', 'research artifacts': 'গবেষণা আর্টিফ্যাক্ট', 'responsible ai': 'দায়িত্বশীল এআই',
    'retrieval': 'রিট্রিভাল', 'reuse': 'পুনর্ব্যবহার', 'safe release': 'নিরাপদ রিলিজ',
    'scientific communication': 'বৈজ্ঞানিক যোগাযোগ', 'sequence': 'সিকোয়েন্স', 'sequence order': 'সিকোয়েন্স অর্ডার',
    'service interfaces': 'সার্ভিস ইন্টারফেস', 'software quality': 'সফটওয়্যার কোয়ালিটি', 'sql explorer': 'এসকিউএল এক্সপ্লোরার',
    'state': 'স্টেট', 'statistical testing': 'পরিসংখ্যানিক পরীক্ষা', 'structural guidance': 'স্ট্রাকচারাল গাইডেন্স',
    'supervised · classification': 'সুপারভাইজড · ক্লাসিফিকেশন', 'supervised · regression': 'সুপারভাইজড · রিগ্রেশন',
    'text generation': 'টেক্সট জেনারেশন', 'time series': 'টাইম সিরিজ', 'tokenization': 'টোকেনাইজেশন',
    'training dynamics': 'ট্রেনিং ডাইনামিক্স', 'uncertainty': 'অনিশ্চয়তা', 'unsupervised detection': 'আনসুপারভাইজড ডিটেকশন',
    'unsupervised · clustering': 'আনসুপারভাইজড · ক্লাস্টারিং', 'validation': 'ভ্যালিডেশন', 'version control': 'ভার্সন কন্ট্রোল',
    'video generation': 'ভিডিও জেনারেশন', 'vision': 'ভিশন', 'vision attribution': 'ভিশন অ্যাট্রিবিউশন',
    'workflow control': 'ওয়ার্কফ্লো কন্ট্রোল',

    /* ===== lesson titles ===== */
    'A network, trained by backprop': 'ব্যাকপ্রপ দিয়ে প্রশিক্ষিত একটি নেটওয়ার্ক',
    'Activations shape what a network can learn': 'অ্যাক্টিভেশন ঠিক করে একটি নেটওয়ার্ক কী শিখতে পারে',
    'Addition & scalar multiplication': 'যোগ ও স্কেলার গুণ', 'An LLM in a loop': 'লুপের মধ্যে একটি এলএলএম',
    'An LLM, end to end': 'একটি এলএলএম, শুরু থেকে শেষ', 'Assemble the AI library stack': 'এআই লাইব্রেরি স্ট্যাক সাজান',
    'Attributing a decision': 'একটি সিদ্ধান্তের কারণ নির্ণয়', 'Audit group-level outcomes': 'গ্রুপ-পর্যায়ের ফলাফল অডিট করুন',
    'Balance alignment and diversity': 'অ্যালাইনমেন্ট ও বৈচিত্র্যের ভারসাম্য', 'Balance bias and variance': 'বায়াস ও ভ্যারিয়েন্সের ভারসাম্য',
    'Batch or stream?': 'ব্যাচ নাকি স্ট্রিম?', 'Branch, commit, and merge': 'ব্রাঞ্চ, কমিট ও মার্জ',
    'Calculus for learning systems': 'লার্নিং সিস্টেমের জন্য ক্যালকুলাস', 'Call an AI service': 'একটি এআই সার্ভিস কল করুন',
    'Catch failures before release': 'রিলিজের আগেই ব্যর্থতা ধরুন', 'Classify text from its evidence': 'প্রমাণ থেকে টেক্সট শ্রেণিবদ্ধ করুন',
    'Clean before you calculate': 'হিসাবের আগে পরিষ্কার করুন', 'Compose a generation prompt': 'একটি জেনারেশন প্রম্পট সাজান',
    'Connect the model to tools': 'মডেলকে টুলের সাথে যুক্ত করুন',
    'Constrain complexity with regularization': 'রেগুলারাইজেশন দিয়ে জটিলতা নিয়ন্ত্রণ করুন',
    'Control and inpaint a generation': 'একটি জেনারেশন নিয়ন্ত্রণ ও ইনপেইন্ট করুন',
    'Control capacity before it memorizes': 'মুখস্থ করার আগেই ক্যাপাসিটি নিয়ন্ত্রণ করুন',
    'Control production exposure': 'প্রোডাকশন এক্সপোজার নিয়ন্ত্রণ করুন', 'Convolutions scan for patterns': 'কনভল্যুশন প্যাটার্ন খোঁজে',
    'Dashboards that cross-filter': 'ড্যাশবোর্ড যা ক্রস-ফিল্টার করে', 'Decide whether a lift is real': 'লিফট সত্যিকারের কিনা নির্ধারণ করুন',
    'Decode an output sequence': 'একটি আউটপুট সিকোয়েন্স ডিকোড করুন', 'Denoising into an image': 'নয়েজ সরিয়ে একটি ছবিতে',
    'Design the model’s instructions': 'মডেলের নির্দেশনা ডিজাইন করুন', 'Distributions & uncertainty': 'ডিস্ট্রিবিউশন ও অনিশ্চয়তা',
    'Dot product & cosine similarity': 'ডট প্রোডাক্ট ও কোসাইন সিমিলারিটি', 'Draw a decision boundary': 'একটি ডিসিশন বাউন্ডারি আঁকুন',
    'ETL as a DAG': 'DAG হিসেবে ইটিএল', 'Eigenvalues, eigenvectors & PCA': 'আইগেনভ্যালু, আইগেনভেক্টর ও PCA',
    'Encoder, decoder or both?': 'এনকোডার, ডিকোডার নাকি দুটোই?', 'Estimate generalization honestly': 'জেনারালাইজেশন সৎভাবে নিরূপণ করুন',
    'Evaluate models on unseen data': 'অদেখা ডেটায় মডেল মূল্যায়ন করুন', 'Find a counterfactual decision': 'একটি কাউন্টারফ্যাকচুয়াল সিদ্ধান্ত খুঁজুন',
    'Find groups without labels': 'লেবেল ছাড়াই গ্রুপ খুঁজুন', 'Find named entities in context': 'প্রসঙ্গে নেমড এনটিটি খুঁজুন',
    'Find observations that do not belong': 'বেমানান পর্যবেক্ষণ খুঁজুন', 'Fine-tune & LoRA': 'ফাইন-টিউন ও LoRA',
    'Fine-tune a pretrained backbone': 'একটি প্রিট্রেইনড ব্যাকবোন ফাইন-টিউন করুন', 'Fit a conversation into context': 'একটি কথোপকথন কনটেক্সটে আঁটান',
    'Fit a curve to points': 'পয়েন্টে একটি কার্ভ ফিট করুন', 'Fit a simple model nearby': 'কাছাকাছি একটি সরল মডেল ফিট করুন',
    'Fit it on your GPU': 'আপনার GPU-তে ফিট করুন', 'From text to tokens': 'টেক্সট থেকে টোকেন',
    'Gate a model release': 'একটি মডেল রিলিজ গেট করুন', 'Gate a model release with evidence': 'প্রমাণসহ একটি মডেল রিলিজ গেট করুন',
    'Generate sound from a prompt': 'একটি প্রম্পট থেকে শব্দ তৈরি করুন', 'Give attention a sense of position': 'অ্যাটেনশনকে অবস্থানের বোধ দিন',
    'Gradient descent': 'গ্রেডিয়েন্ট ডিসেন্ট', 'Information, surprise & learning': 'ইনফরমেশন, বিস্ময় ও শেখা',
    'Inspect predictions through depth': 'গভীরতার মধ্য দিয়ে প্রেডিকশন পরীক্ষা করুন', 'Keep generated frames coherent': 'জেনারেটেড ফ্রেম সামঞ্জস্যপূর্ণ রাখুন',
    'Keep training and serving aligned': 'ট্রেনিং ও সার্ভিং সঙ্গতিপূর্ণ রাখুন', 'Learn & run': 'শিখুন ও চালান',
    'Learn the shape of the data': 'ডেটার আকৃতি জানুন', 'Magnitude, normalization & distance': 'ম্যাগনিটিউড, নরমালাইজেশন ও দূরত্ব',
    'Make features comparable and useful': 'ফিচারকে তুলনাযোগ্য ও উপযোগী করুন', 'Make raw records trustworthy': 'কাঁচা রেকর্ডকে নির্ভরযোগ্য করুন',
    'Make the experiment reproducible': 'এক্সপেরিমেন্টকে পুনরুৎপাদনযোগ্য করুন', 'Manage what an agent remembers': 'একটি এজেন্ট কী মনে রাখে তা পরিচালনা করুন',
    'Many weak models, one strong one': 'অনেক দুর্বল মডেল, একটি শক্তিশালী', 'Match claims to evidence': 'দাবিকে প্রমাণের সাথে মেলান',
    'Match workload to hardware': 'ওয়ার্কলোডকে হার্ডওয়্যারের সাথে মেলান', 'Matrices bend space': 'ম্যাট্রিক্স স্থানকে বাঁকায়',
    'Matrix operations': 'ম্যাট্রিক্স অপারেশন', 'Meaning becomes geometry': 'অর্থ হয়ে ওঠে জ্যামিতি',
    'Measure variables moving together': 'একসাথে চলা চলরাশি পরিমাপ করুন', 'Monitor service and model health': 'সার্ভিস ও মডেলের স্বাস্থ্য মনিটর করুন',
    'Navigate latent space': 'ল্যাটেন্ট স্পেসে চলাচল করুন', 'Networks that create': 'যে নেটওয়ার্ক সৃষ্টি করে',
    'Networks with memory': 'মেমরিসহ নেটওয়ার্ক', 'Next-token prediction': 'নেক্সট-টোকেন প্রেডিকশন',
    'Optimizers navigate the loss landscape': 'অপটিমাইজার লস ল্যান্ডস্কেপে পথ চলে', 'Package a repeatable service': 'একটি পুনরাবৃত্তিযোগ্য সার্ভিস প্যাকেজ করুন',
    'Plan before collecting data': 'ডেটা সংগ্রহের আগে পরিকল্পনা করুন', 'Predict from counted context': 'গণনাকৃত প্রসঙ্গ থেকে প্রেডিক্ট করুন',
    'Preserve lineage and evidence': 'লিনিয়েজ ও প্রমাণ সংরক্ষণ করুন', 'Probability for machine learning': 'মেশিন লার্নিংয়ের জন্য সম্ভাব্যতা',
    'Projection': 'প্রজেকশন', 'Promote versioned artifacts': 'ভার্সনকৃত আর্টিফ্যাক্ট প্রমোট করুন', 'Query the data': 'ডেটা কোয়েরি করুন',
    'RAG & embeddings': 'RAG ও এমবেডিং', 'Rank features across the dataset': 'ডেটাসেট জুড়ে ফিচার র‍্যাঙ্ক করুন',
    'Reason with distributions': 'ডিস্ট্রিবিউশন দিয়ে যুক্তি করুন', 'Remove components to test claims': 'দাবি যাচাইয়ে উপাদান সরান',
    'Resample to build an interval': 'ইন্টারভাল গড়তে রিস্যাম্পল করুন', 'SQL vs. NoSQL': 'SQL বনাম NoSQL',
    'Sampling the next token': 'পরবর্তী টোকেন স্যাম্পলিং', 'Scale beyond one machine': 'একটি মেশিনের বাইরে স্কেল করুন',
    'Schedule and recover pipelines': 'পাইপলাইন শিডিউল ও পুনরুদ্ধার করুন', 'Schedule signal and noise': 'সিগন্যাল ও নয়েজ শিডিউল করুন',
    'See where a CNN looked': 'CNN কোথায় তাকিয়েছে দেখুন', 'Self-attention': 'সেলফ-অ্যাটেনশন',
    'Separate trend from seasonality': 'ট্রেন্ডকে সিজনালিটি থেকে আলাদা করুন', 'Shape a warehouse for questions': 'প্রশ্নের জন্য ওয়্যারহাউস সাজান',
    'Ship it, then watch it': 'রিলিজ করুন, তারপর নজর রাখুন', 'Stop bad data at the boundary': 'খারাপ ডেটা সীমানায় আটকান',
    'Tensors — data with shape': 'টেনসর — আকৃতিসহ ডেটা', 'Test a difference against chance': 'একটি পার্থক্যকে দৈবের বিপরীতে যাচাই করুন',
    'Text becomes token IDs': 'টেক্সট হয়ে ওঠে টোকেন আইডি', 'The AI workflow pipeline': 'এআই ওয়ার্কফ্লো পাইপলাইন',
    'Trace partial dependence and ICE': 'পার্শিয়াল ডিপেন্ডেন্স ও ICE ট্রেস করুন', 'Track every training run': 'প্রতিটি ট্রেনিং রান ট্র্যাক করুন',
    'Trigger retraining carefully': 'সাবধানে রিট্রেনিং চালু করুন', 'Vectors throughout AI': 'এআই জুড়ে ভেক্টর',
    'Vectors — the language of data': 'ভেক্টর — ডেটার ভাষা', 'Walk through a transformer block': 'একটি ট্রান্সফরমার ব্লকের মধ্য দিয়ে চলুন',
    'Weighing words by signal': 'সিগন্যাল অনুযায়ী শব্দের ওজন', 'What AI is, and how it got here': 'এআই কী, আর কীভাবে এখানে এলো',
    'Worked example: the playground’s starting vectors': 'সমাধানকৃত উদাহরণ: প্লেগ্রাউন্ডের শুরুর ভেক্টর',

    /* ===== module descriptions ===== */
    'A vision model turns a grid of pixels into meaning — an edge, an object, a boundary. Slide a kernel across an image and watch a feature map appear, drag a detection box until its IoU snaps into place, then threshold an image into segmentation masks. Three lessons, each a live sandbox.':
      'একটি ভিশন মডেল পিক্সেলের গ্রিডকে অর্থে রূপান্তর করে — একটি প্রান্ত, একটি বস্তু, একটি সীমানা। একটি ছবির উপর দিয়ে একটি কার্নেল সরান আর ফিচার ম্যাপ তৈরি হতে দেখুন, একটি ডিটেকশন বক্স টানুন যতক্ষণ না এর IoU সঠিক জায়গায় বসে, তারপর একটি ছবিকে সেগমেন্টেশন মাস্কে থ্রেশহোল্ড করুন। তিনটি পাঠ, প্রতিটিই একটি লাইভ স্যান্ডবক্স।',
    'A real multilayer perceptron, training live in your browser. Pick a dataset, shape the hidden layers, choose an activation, and press play — watch the decision boundary form as gradients reshape every weight.':
      'একটি বাস্তব মাল্টিলেয়ার পারসেপট্রন, আপনার ব্রাউজারে লাইভ প্রশিক্ষিত হচ্ছে। একটি ডেটাসেট বাছুন, হিডেন লেয়ার সাজান, একটি অ্যাক্টিভেশন বেছে নিন, আর প্লে চাপুন — গ্রেডিয়েন্ট প্রতিটি ওয়েট নতুন করে গড়ার সাথে সাথে ডিসিশন বাউন্ডারি গঠিত হতে দেখুন।',
    'Trace data through a DAG, compare ingestion modes, clean records, model a warehouse, distribute work, orchestrate retries, enforce quality, and keep features aligned.':
      'একটি DAG-এর মধ্য দিয়ে ডেটা অনুসরণ করুন, ইনজেশন মোড তুলনা করুন, রেকর্ড পরিষ্কার করুন, একটি ওয়্যারহাউস মডেল করুন, কাজ বণ্টন করুন, রিট্রাই অর্কেস্ট্রেট করুন, গুণমান বজায় রাখুন, আর ফিচার সঙ্গতিপূর্ণ রাখুন।',
    'Every model in the Atlas rides the same pipeline and answers to the same responsibilities. Step through the AI workflow, then scrub the history of the field.':
      'অ্যাটলাসের প্রতিটি মডেল একই পাইপলাইনে চলে আর একই দায়িত্বের কাছে জবাবদিহি করে। এআই ওয়ার্কফ্লোর ধাপগুলো দেখুন, তারপর এই ক্ষেত্রের ইতিহাস ঘেঁটে দেখুন।',
    'Reverse noise into structure, explore latent representations and guidance, design prompts and controls, then see how the same generative principles extend from images to audio and video.':
      'নয়েজকে উল্টো করে কাঠামোয় আনুন, ল্যাটেন্ট রিপ্রেজেন্টেশন ও গাইডেন্স অন্বেষণ করুন, প্রম্পট ও কন্ট্রোল ডিজাইন করুন, তারপর দেখুন একই জেনারেটিভ নীতি ছবি থেকে অডিও ও ভিডিওতে কীভাবে বিস্তৃত হয়।',
    'Follow the full LLM lifecycle: train and size a model, design its prompt, connect tools, step through an agent loop, manage memory, fine-tune adapters, and gate releases with evaluation.':
      'সম্পূর্ণ এলএলএম লাইফসাইকেল অনুসরণ করুন: একটি মডেল প্রশিক্ষণ ও আকার নির্ধারণ করুন, এর প্রম্পট ডিজাইন করুন, টুল যুক্ত করুন, একটি এজেন্ট লুপের ধাপে চলুন, মেমরি পরিচালনা করুন, অ্যাডাপ্টার ফাইন-টিউন করুন, আর মূল্যায়ন দিয়ে রিলিজ গেট করুন।',
    'Drag the data and watch the model chase it. Fit a regression line, raise the polynomial degree until it overfits, or watch K-Means centroids settle into clusters step by step.':
      'ডেটা টেনে আনুন আর মডেলকে তা অনুসরণ করতে দেখুন। একটি রিগ্রেশন রেখা ফিট করুন, ওভারফিট না হওয়া পর্যন্ত পলিনোমিয়াল ডিগ্রি বাড়ান, অথবা K-Means সেন্ট্রয়েডকে ধাপে ধাপে ক্লাস্টারে থিতু হতে দেখুন।',
    'Linear algebra and calculus you can grab. Drag the vectors to feel the dot product change sign; release a ball on a loss surface and watch gradient descent find the valley.':
      'লিনিয়ার অ্যালজেবরা ও ক্যালকুলাস, যা হাতে ধরা যায়। ভেক্টর টেনে ডট প্রোডাক্টের চিহ্ন বদলানো অনুভব করুন; লস সারফেসে একটি বল ছাড়ুন আর গ্রেডিয়েন্ট ডিসেন্টকে উপত্যকা খুঁজে পেতে দেখুন।',
    'Track experiments, register versions, release gradually, monitor service and model health, gate delivery, automate retraining, and preserve governance evidence.':
      'এক্সপেরিমেন্ট ট্র্যাক করুন, ভার্সন রেজিস্টার করুন, ধীরে ধীরে রিলিজ করুন, সার্ভিস ও মডেলের স্বাস্থ্য মনিটর করুন, ডেলিভারি গেট করুন, রিট্রেনিং স্বয়ংক্রিয় করুন, আর গভর্নেন্স প্রমাণ সংরক্ষণ করুন।',
    'Turn text into tokens, count statistical patterns, map meaning into vectors, classify language, extract entities, and decode generated sequences one decision at a time.':
      'টেক্সটকে টোকেনে রূপান্তর করুন, পরিসংখ্যানিক প্যাটার্ন গণনা করুন, অর্থকে ভেক্টরে ম্যাপ করুন, ভাষা শ্রেণিবদ্ধ করুন, এনটিটি বের করুন, আর জেনারেটেড সিকোয়েন্স একটি একটি সিদ্ধান্তে ডিকোড করুন।',
    'Run code, assemble the library stack, choose data stores, practise Git and APIs, package containers, size compute, and test an AI service before release.':
      'কোড চালান, লাইব্রেরি স্ট্যাক সাজান, ডেটা স্টোর বাছুন, Git ও এপিআই অনুশীলন করুন, কন্টেইনার প্যাকেজ করুন, কম্পিউট আকার নির্ধারণ করুন, আর রিলিজের আগে একটি এআই সার্ভিস পরীক্ষা করুন।',
    'No dataset of right answers — just an agent, an environment, and a reward signal. It acts, sees what happens, and adjusts. Run value iteration until a policy emerges, pull the arms of a slot machine to feel the explore–exploit tension, then watch Q-learning discover a path from scratch.':
      'সঠিক উত্তরের কোনো ডেটাসেট নেই — শুধু একটি এজেন্ট, একটি পরিবেশ আর একটি রিওয়ার্ড সিগন্যাল। এটি কাজ করে, কী ঘটে তা দেখে, আর নিজেকে সামঞ্জস্য করে। পলিসি তৈরি না হওয়া পর্যন্ত ভ্যালু ইটারেশন চালান, এক্সপ্লোর–এক্সপ্লয়েট টানাপড়েন অনুভব করতে স্লট মেশিনের হাতল টানুন, তারপর Q-লার্নিংকে শূন্য থেকে একটি পথ আবিষ্কার করতে দেখুন।',
    'Balance bias and variance, validate honestly, quantify uncertainty, test hypotheses, plan power, isolate contributions, reproduce results, and report claims responsibly.':
      'বায়াস ও ভ্যারিয়েন্সের ভারসাম্য রাখুন, সৎভাবে ভ্যালিডেট করুন, অনিশ্চয়তা পরিমাপ করুন, হাইপোথিসিস যাচাই করুন, পাওয়ার পরিকল্পনা করুন, অবদান আলাদা করুন, ফলাফল পুনরুৎপাদন করুন, আর দাবি দায়িত্বশীলভাবে উপস্থাপন করুন।',
    'When time is an axis, order carries meaning: a trend drifts, a season repeats, noise wobbles on top. Pull a series apart into its components, smooth away the jitter, then project the next stretch with a confidence band that honestly widens as you look further ahead.':
      'সময় যখন একটি অক্ষ, তখন ক্রম অর্থ বহন করে: একটি ট্রেন্ড সরে যায়, একটি ঋতু পুনরাবৃত্তি হয়, উপরে নয়েজ দোলে। একটি সিরিজকে তার উপাদানে ভাগ করুন, ঝাঁকুনি মসৃণ করুন, তারপর পরবর্তী অংশ পূর্বাভাস দিন এমন একটি কনফিডেন্স ব্যান্ডসহ যা সামনে তাকালে সৎভাবে চওড়া হয়।',
    'Follow text through tokenization, position encoding, attention and transformer blocks; then explore next-token prediction, context limits, retrieval and the masks behind encoder and decoder models.':
      'টোকেনাইজেশন, পজিশন এনকোডিং, অ্যাটেনশন ও ট্রান্সফরমার ব্লকের মধ্য দিয়ে টেক্সট অনুসরণ করুন; তারপর নেক্সট-টোকেন প্রেডিকশন, কনটেক্সট সীমা, রিট্রিভাল আর এনকোডার ও ডিকোডার মডেলের পেছনের মাস্ক অন্বেষণ করুন।',
    'Explain individual predictions, audit global behaviour, inspect curves and vision heatmaps, generate counterfactuals, measure group fairness, and trace how language models form answers.':
      'স্বতন্ত্র প্রেডিকশন ব্যাখ্যা করুন, গ্লোবাল আচরণ অডিট করুন, কার্ভ ও ভিশন হিটম্যাপ পরীক্ষা করুন, কাউন্টারফ্যাকচুয়াল তৈরি করুন, গ্রুপ ফেয়ারনেস পরিমাপ করুন, আর ভাষা মডেল কীভাবে উত্তর গঠন করে তা অনুসরণ করুন।',

    /* ===== lesson leads (card body paragraphs) ===== */
    'A language model is a next-token predictor. Enter a prompt below and watch the probability distribution over what comes next.': 'একটি ভাষা মডেল হলো একটি নেক্সট-টোকেন প্রেডিক্টর। নিচে একটি প্রম্পট লিখুন আর পরবর্তীতে কী আসবে তার সম্ভাব্যতা বণ্টন দেখুন।',
    'A matrix is a function that transforms space. Move the a, b, c, d sliders below and watch the grid and unit square rotate, scale, shear and flip.': 'একটি ম্যাট্রিক্স হলো একটি ফাংশন যা স্থানকে রূপান্তর করে। নিচের a, b, c, d স্লাইডার সরান আর গ্রিড ও একক বর্গকে ঘুরতে, স্কেল হতে, শিয়ার হতে ও উল্টে যেতে দেখুন।',
    'A model can’t read letters — only token IDs. Type below and watch a subword tokenizer keep common words whole and split rare ones.': 'একটি মডেল অক্ষর পড়তে পারে না — শুধু টোকেন আইডি। নিচে টাইপ করুন আর দেখুন একটি সাবওয়ার্ড টোকেনাইজার সাধারণ শব্দ অখণ্ড রাখে আর বিরল শব্দ ভাগ করে।',
    'A model must fit in VRAM to run. Size a model to your hardware below and watch quantization shrink its footprint.': 'চালানোর জন্য একটি মডেলকে VRAM-এ আঁটতে হবে। নিচে আপনার হার্ডওয়্যারের জন্য একটি মডেলের আকার নির্ধারণ করুন আর কোয়ান্টাইজেশনকে এর ফুটপ্রিন্ট ছোট করতে দেখুন।',
    'A stack of weighted sums and non-linearities. Watch activations light up on the forward pass and gradients flow backward below.': 'ওয়েটেড যোগফল ও নন-লিনিয়ারিটির একটি স্ট্যাক। ফরওয়ার্ড পাসে অ্যাক্টিভেশন জ্বলে উঠতে আর নিচে গ্রেডিয়েন্ট পেছনে বইতে দেখুন।',
    'AI didn’t arrive fully formed. Scrub the timeline below to trace four eras — each absorbing the last, each with less hand-coding and more learning.': 'এআই পুরোপুরি গঠিত হয়ে আসেনি। নিচের টাইমলাইন ঘুরিয়ে চারটি যুগ অনুসরণ করুন — প্রতিটি আগেরটিকে ধারণ করে, প্রতিটিতে কম হাতে-কোডিং আর বেশি শেখা।',
    'Adapt a base model cheaply. Below, see how LoRA injects a few trainable weights instead of retraining the whole network.': 'একটি বেস মডেল সস্তায় মানিয়ে নিন। নিচে দেখুন LoRA কীভাবে পুরো নেটওয়ার্ক পুনঃপ্রশিক্ষণের বদলে কয়েকটি ট্রেনযোগ্য ওয়েট যোগ করে।',
    'Add facts, adjust the token budget, and compare sliding-window, summary and vector-retrieval memory strategies.': 'তথ্য যোগ করুন, টোকেন বাজেট সমন্বয় করুন, আর স্লাইডিং-উইন্ডো, সামারি ও ভেক্টর-রিট্রিভাল মেমরি কৌশল তুলনা করুন।',
    'Add model cards, dataset lineage, ownership, and risk review to satisfy governance requirements at different risk tiers.': 'বিভিন্ন ঝুঁকি স্তরে গভর্নেন্স চাহিদা মেটাতে মডেল কার্ড, ডেটাসেট লিনিয়েজ, মালিকানা ও ঝুঁকি পর্যালোচনা যোগ করুন।',
    'Add trees to the forest below and watch the blocky, overfit boundary of a single tree smooth into a stable one.': 'নিচের ফরেস্টে ট্রি যোগ করুন আর দেখুন একটি একক ট্রির খাপছাড়া, ওভারফিট বাউন্ডারি কীভাবে একটি স্থিতিশীল বাউন্ডারিতে মসৃণ হয়।',
    'Adjust an applicant profile and ask for the smallest allowed change that would flip the model’s outcome.': 'একটি আবেদনকারীর প্রোফাইল সমন্বয় করুন আর মডেলের ফলাফল উল্টে দিতে পারে এমন সবচেয়ে ছোট অনুমোদিত পরিবর্তন জিজ্ঞাসা করুন।',
    'Adjust classifier-free guidance and negative prompting to see why stronger conditioning is not always better.': 'ক্লাসিফায়ার-ফ্রি গাইডেন্স ও নেগেটিভ প্রম্পটিং সমন্বয় করে দেখুন কেন শক্তিশালী কন্ডিশনিং সবসময় ভালো নয়।',
    'Adjust model complexity and cross-validation folds to see the gap between fitting the training set and generalizing beyond it.': 'মডেল জটিলতা ও ক্রস-ভ্যালিডেশন ফোল্ড সমন্বয় করে ট্রেনিং সেটে ফিট করা আর তার বাইরে জেনারালাইজ করার মধ্যকার ব্যবধান দেখুন।',
    'Adjust model size, concurrency, and latency needs to estimate memory and select suitable compute.': 'মেমরি অনুমান করতে আর উপযুক্ত কম্পিউট বাছতে মডেল আকার, কনকারেন্সি ও লেটেন্সি চাহিদা সমন্বয় করুন।',
    'Adjust motion and consistency to explore the tension between visible movement and frame-to-frame stability.': 'দৃশ্যমান গতি আর ফ্রেম-থেকে-ফ্রেম স্থিতিশীলতার মধ্যকার টানাপড়েন অন্বেষণ করতে মোশন ও কনসিসটেন্সি সমন্বয় করুন।',
    'Adjust observed effect, sample size, and significance level before deciding whether evidence rejects the null hypothesis.': 'প্রমাণ নাল হাইপোথিসিস খারিজ করে কিনা সিদ্ধান্ত নেওয়ার আগে পর্যবেক্ষিত ইফেক্ট, স্যাম্পল সাইজ ও সিগনিফিক্যান্স লেভেল সমন্বয় করুন।',
    'Adjust the window and see which earlier tokens are retained or truncated when a prompt exceeds the model’s working memory.': 'উইন্ডো সমন্বয় করুন আর দেখুন একটি প্রম্পট মডেলের কার্যকরী মেমরি ছাড়িয়ে গেলে কোন আগের টোকেনগুলো রাখা হয় বা ছাঁটা হয়।',
    'Advance a signal through attention, residual connections, normalization and the position-wise feed-forward network.': 'অ্যাটেনশন, রেসিডুয়াল কানেকশন, নরমালাইজেশন ও পজিশন-ওয়াইজ ফিড-ফরওয়ার্ড নেটওয়ার্কের মধ্য দিয়ে একটি সিগন্যাল এগিয়ে নিন।',
    'Agents wrap a model with tools and memory. Wire one up below and watch it plan, act, observe and repeat.': 'এজেন্ট একটি মডেলকে টুল ও মেমরি দিয়ে মুড়ে দেয়। নিচে একটি সংযুক্ত করুন আর দেখুন এটি পরিকল্পনা করে, কাজ করে, পর্যবেক্ষণ করে ও পুনরাবৃত্তি করে।',
    'Apply null handling, deduplication, and type validation to see which rows satisfy a clean output contract.': 'কোন সারিগুলো একটি পরিচ্ছন্ন আউটপুট কন্ট্রাক্ট মেটায় তা দেখতে নাল হ্যান্ডলিং, ডিডুপ্লিকেশন ও টাইপ ভ্যালিডেশন প্রয়োগ করুন।',
    'Ask a table a question. Edit the query below and run it against a live orders dataset — the result auto-charts itself.': 'একটি টেবিলকে একটি প্রশ্ন করুন। নিচের কোয়েরি এডিট করুন আর একটি লাইভ অর্ডার ডেটাসেটের বিপরীতে চালান — ফলাফল নিজেই চার্ট হয়ে যায়।',
    'Assemble the pieces of a large language model below — from data and tokenizer to the decoder-only transformer stack.': 'নিচে একটি বৃহৎ ভাষা মডেলের অংশগুলো সাজান — ডেটা ও টোকেনাইজার থেকে ডিকোডার-অনলি ট্রান্সফরমার স্ট্যাক পর্যন্ত।',
    'Attention alone cannot tell first from last. Compare sinusoidal, learned and rotary position signals across a sequence.': 'শুধু অ্যাটেনশন প্রথম ও শেষ আলাদা করতে পারে না। একটি সিকোয়েন্স জুড়ে সাইনুসয়ডাল, লার্নড ও রোটারি পজিশন সিগন্যাল তুলনা করুন।',
    'Audit whether code, environment, data, seeds, and configuration are available to another researcher.': 'কোড, এনভায়রনমেন্ট, ডেটা, সিড ও কনফিগারেশন অন্য গবেষকের কাছে উপলব্ধ কিনা তা অডিট করুন।',
    'Balance model capacity, dropout and weight decay. The live curves show the gap between fitting the training set and generalizing.': 'মডেল ক্যাপাসিটি, ড্রপআউট ও ওয়েট ডিকের ভারসাম্য রাখুন। লাইভ কার্ভগুলো ট্রেনিং সেটে ফিট করা আর জেনারালাইজ করার মধ্যকার ব্যবধান দেখায়।',
    'Before neural language models, N-grams predicted the next word by counting how often short contexts appeared in a corpus.': 'নিউরাল ভাষা মডেলের আগে, N-গ্রাম একটি কর্পাসে ছোট প্রসঙ্গ কতবার দেখা দিয়েছে তা গুনে পরবর্তী শব্দ পূর্বাভাস দিত।',
    'Build prompts from subject, composition, medium, lighting and constraints, then compare model-specific additions.': 'বিষয়, কম্পোজিশন, মাধ্যম, আলো ও সীমাবদ্ধতা থেকে প্রম্পট তৈরি করুন, তারপর মডেল-নির্দিষ্ট সংযোজন তুলনা করুন।',
    'Change a model and learning rate, log a new run, and compare it with previous parameters and metrics.': 'একটি মডেল ও লার্নিং রেট বদলান, একটি নতুন রান লগ করুন, আর আগের প্যারামিটার ও মেট্রিকের সাথে তুলনা করুন।',
    'Change event volume and delivery windows to compare scheduled batch, micro-batch, and continuous streaming ingestion.': 'শিডিউলড ব্যাচ, মাইক্রো-ব্যাচ ও ক্রমাগত স্ট্রিমিং ইনজেশন তুলনা করতে ইভেন্ট ভলিউম ও ডেলিভারি উইন্ডো বদলান।',
    'Change evidence strength and claim language to practise cautious reporting with explicit limitations.': 'স্পষ্ট সীমাবদ্ধতাসহ সতর্ক রিপোর্টিং অনুশীলন করতে প্রমাণের শক্তি ও দাবির ভাষা বদলান।',
    'Change model complexity and watch bias fall, variance rise, and total error form the familiar U-shaped tradeoff.': 'মডেল জটিলতা বদলান আর দেখুন বায়াস কমছে, ভ্যারিয়েন্স বাড়ছে, আর মোট ত্রুটি পরিচিত U-আকৃতির ট্রেডঅফ গড়ছে।',
    'Change mood and duration, then regenerate a waveform to see how audio synthesis models create temporal signals.': 'মুড ও সময়কাল বদলান, তারপর একটি ওয়েভফর্ম পুনরায় তৈরি করে দেখুন অডিও সিন্থেসিস মডেল কীভাবে টেম্পোরাল সিগন্যাল তৈরি করে।',
    'Change sample count, dataset size, and confidence level to see a bootstrap distribution and interval move.': 'একটি বুটস্ট্র্যাপ ডিস্ট্রিবিউশন ও ইন্টারভাল সরতে দেখতে স্যাম্পল সংখ্যা, ডেটাসেট আকার ও কনফিডেন্স লেভেল বদলান।',
    'Change the activation and weight scale. Watch the output curve, local gradient and saturation regime update together.': 'অ্যাক্টিভেশন ও ওয়েট স্কেল বদলান। আউটপুট কার্ভ, লোকাল গ্রেডিয়েন্ট ও স্যাচুরেশন রেজিম একসাথে হালনাগাদ হতে দেখুন।',
    'Change the branching strategy, build a commit history, and merge the work while keeping model code reproducible.': 'মডেল কোড পুনরুৎপাদনযোগ্য রেখে ব্রাঞ্চিং কৌশল বদলান, একটি কমিট ইতিহাস গড়ুন, আর কাজ মার্জ করুন।',
    'Change the perturbation radius and sample count to see how LIME balances locality, stability and fidelity.': 'LIME কীভাবে লোকালিটি, স্থিতিশীলতা ও ফিডেলিটির ভারসাম্য রাখে তা দেখতে পার্টারবেশন রেডিয়াস ও স্যাম্পল সংখ্যা বদলান।',
    'Change the predicted class, layer depth and opacity to inspect a simplified Grad-CAM heatmap.': 'একটি সরলীকৃত Grad-CAM হিটম্যাপ পরীক্ষা করতে প্রেডিক্টেড ক্লাস, লেয়ার গভীরতা ও অপাসিটি বদলান।',
    'Change traffic and conversions for two variants. The two-proportion test updates conversion rates, uplift and statistical significance immediately.': 'দুটি ভ্যারিয়েন্টের ট্রাফিক ও কনভার্সন বদলান। টু-প্রোপোরশন টেস্ট কনভার্সন রেট, আপলিফট ও পরিসংখ্যানিক সিগনিফিক্যান্স তৎক্ষণাৎ হালনাগাদ করে।',
    'Choose a minimum detectable effect, sample size, and noise level to estimate whether the design can find a real effect.': 'ডিজাইনটি একটি বাস্তব ইফেক্ট খুঁজে পেতে পারে কিনা অনুমান করতে একটি ন্যূনতম শনাক্তযোগ্য ইফেক্ট, স্যাম্পল সাইজ ও নয়েজ লেভেল বাছুন।',
    'Choose a project goal and deployment target to see which tools belong in a compact, practical stack.': 'একটি কম্প্যাক্ট, ব্যবহারিক স্ট্যাকে কোন টুলগুলো মানানসই তা দেখতে একটি প্রজেক্ট লক্ষ্য ও ডিপ্লয়মেন্ট টার্গেট বাছুন।',
    'Choose an anchor and inspect its semantic neighbourhood. Words used in similar contexts settle near one another in vector space.': 'একটি অ্যাঙ্কর বাছুন আর এর সিম্যান্টিক প্রতিবেশ পরীক্ষা করুন। একই প্রসঙ্গে ব্যবহৃত শব্দ ভেক্টর স্পেসে একে অপরের কাছে থিতু হয়।',
    'Choose an image profile, replicas, and memory limits to see how containers make the same application portable.': 'কন্টেইনার কীভাবে একই অ্যাপ্লিকেশনকে পোর্টেবল করে তা দেখতে একটি ইমেজ প্রোফাইল, রেপ্লিকা ও মেমরি সীমা বাছুন।',
    'Compare K-fold, stratified, and chronological splits while changing the number of held-out folds.': 'হেল্ড-আউট ফোল্ডের সংখ্যা বদলানোর সময় K-ফোল্ড, স্ট্রাটিফাইড ও কালানুক্রমিক স্প্লিট তুলনা করুন।',
    'Compare approval and error rates, then apply mitigations and inspect the accuracy–fairness tradeoff.': 'অনুমোদন ও ত্রুটির হার তুলনা করুন, তারপর প্রশমন প্রয়োগ করুন আর অ্যাকুরেসি–ফেয়ারনেস ট্রেডঅফ পরীক্ষা করুন।',
    'Compare batch, streaming, and request-time materialization across offline and online feature stores.': 'অফলাইন ও অনলাইন ফিচার স্টোর জুড়ে ব্যাচ, স্ট্রিমিং ও রিকোয়েস্ট-টাইম ম্যাটেরিয়ালাইজেশন তুলনা করুন।',
    'Compare canary, blue/green, and shadow releases while changing candidate traffic and watching guardrails.': 'ক্যান্ডিডেট ট্রাফিক বদলানোর ও গার্ডরেল দেখার সময় ক্যানারি, ব্লু/গ্রিন ও শ্যাডো রিলিজ তুলনা করুন।',
    'Compare candidate models across quality, safety and groundedness, then adjust the release threshold and test-set size.': 'গুণমান, নিরাপত্তা ও গ্রাউন্ডেডনেস জুড়ে ক্যান্ডিডেট মডেল তুলনা করুন, তারপর রিলিজ থ্রেশহোল্ড ও টেস্ট-সেট আকার সমন্বয় করুন।',
    'Compare drift, schedule, and performance triggers while keeping validation guardrails between training and release.': 'ট্রেনিং ও রিলিজের মাঝে ভ্যালিডেশন গার্ডরেল রেখে ড্রিফট, শিডিউল ও পারফরম্যান্স ট্রিগার তুলনা করুন।',
    'Compare how linear, cosine and Karras-style schedules distribute useful denoising work across timesteps.': 'লিনিয়ার, কোসাইন ও Karras-স্টাইল শিডিউল টাইমস্টেপ জুড়ে কীভাবে উপযোগী ডিনয়েজিং কাজ বণ্টন করে তা তুলনা করুন।',
    'Compare permutation, tree-gain and mean absolute SHAP importance to see how method choice changes the global story.': 'পদ্ধতি বাছাই গ্লোবাল গল্প কীভাবে বদলায় তা দেখতে পারমুটেশন, ট্রি-গেইন ও মিন অ্যাবসোলিউট SHAP ইম্পর্ট্যান্স তুলনা করুন।',
    'Compare star, snowflake, and wide-table models as dimensions, joins, and redundancy change.': 'ডাইমেনশন, জয়েন ও রিডানডেন্সি বদলানোর সাথে স্টার, স্নোফ্লেক ও ওয়াইড-টেবিল মডেল তুলনা করুন।',
    'Compose requests, include authentication, and inspect status codes and response payloads.': 'রিকোয়েস্ট সাজান, অথেন্টিকেশন যুক্ত করুন, আর স্ট্যাটাস কোড ও রেসপন্স পেলোড পরীক্ষা করুন।',
    'Construct a signal from long-term direction and repeating cycles, then extend those components into a simple forecast horizon.': 'দীর্ঘমেয়াদি দিক ও পুনরাবৃত্ত চক্র থেকে একটি সিগন্যাল গঠন করুন, তারপর সেই উপাদানগুলো একটি সরল ফোরকাস্ট হরাইজনে বিস্তৃত করুন।',
    'Control the underlying relationship and noise to see what Pearson correlation captures—and what it cannot establish.': 'পিয়ারসন কোরিলেশন কী ধরে—আর কী প্রতিষ্ঠা করতে পারে না তা দেখতে অন্তর্নিহিত সম্পর্ক ও নয়েজ নিয়ন্ত্রণ করুন।',
    'Diffusion models start from pure noise and remove a little at each step until an image emerges. Scrub the denoiser below to watch it happen.': 'ডিফিউশন মডেল বিশুদ্ধ নয়েজ থেকে শুরু করে আর প্রতি ধাপে একটু করে সরায় যতক্ষণ না একটি ছবি উদিত হয়। এটি ঘটতে দেখতে নিচের ডিনয়েজার ঘুরিয়ে দেখুন।',
    'Edit the review and watch individual words push a sentiment decision positive or negative.': 'রিভিউ এডিট করুন আর দেখুন স্বতন্ত্র শব্দ একটি সেন্টিমেন্ট সিদ্ধান্তকে ইতিবাচক বা নেতিবাচক দিকে ঠেলছে।',
    'Edit the system and user roles, choose an output contract, and see how constraints shape model behaviour.': 'সিস্টেম ও ইউজার রোল এডিট করুন, একটি আউটপুট কন্ট্রাক্ট বাছুন, আর দেখুন সীমাবদ্ধতা কীভাবে মডেলের আচরণ গড়ে।',
    'Entity recognition identifies spans such as people, organisations, places and dates, then assigns each a type.': 'এনটিটি রিকগনিশন ব্যক্তি, প্রতিষ্ঠান, স্থান ও তারিখের মতো অংশ শনাক্ত করে, তারপর প্রতিটিকে একটি টাইপ দেয়।',
    'Every data point is a vector, and models constantly ask how two of them relate. Drag the handles below and watch the dot product flip sign as the angle passes 90°.': 'প্রতিটি ডেটা পয়েন্ট একটি ভেক্টর, আর মডেল প্রতিনিয়ত জিজ্ঞাসা করে দুটি কীভাবে সম্পর্কিত। নিচের হ্যান্ডেল টানুন আর কোণ ৯০° পার হলে ডট প্রোডাক্টের চিহ্ন উল্টে যেতে দেখুন।',
    'Every project — churn prediction, a chatbot, a vision model — runs this same loop. Step through each stage below to see what actually happens.': 'প্রতিটি প্রজেক্ট — চার্ন প্রেডিকশন, একটি চ্যাটবট, একটি ভিশন মডেল — এই একই লুপে চলে। আসলে কী ঘটে তা দেখতে নিচের প্রতিটি ধাপে চলুন।',
    'Every token looks at every other and decides what to focus on. Select a token below to inspect its attention weights.': 'প্রতিটি টোকেন অন্য প্রতিটির দিকে তাকায় আর কীসে মনোযোগ দেবে তা ঠিক করে। এর অ্যাটেনশন ওয়েট পরীক্ষা করতে নিচে একটি টোকেন বাছুন।',
    'Explore distributions before modeling. Filter the orders dataset and watch its center, spread, skew and outliers respond.': 'মডেলিংয়ের আগে ডিস্ট্রিবিউশন অন্বেষণ করুন। অর্ডার ডেটাসেট ফিল্টার করুন আর এর কেন্দ্র, বিস্তার, স্কিউ ও আউটলায়ার সাড়া দিতে দেখুন।',
    'Extract → Transform → Load, wired as a directed acyclic graph. Run the canvas and watch records move through dependent stages.': 'Extract → Transform → Load, একটি ডিরেক্টেড অ্যাসাইক্লিক গ্রাফ হিসেবে সংযুক্ত। ক্যানভাস চালান আর রেকর্ডকে নির্ভরশীল ধাপের মধ্য দিয়ে সরতে দেখুন।',
    'Freeze early feature extractors, choose how much data you have, and see the tradeoff between trainable parameters, time and accuracy.': 'আগের ফিচার এক্সট্রাক্টর ফ্রিজ করুন, আপনার কত ডেটা আছে বাছুন, আর ট্রেনযোগ্য প্যারামিটার, সময় ও অ্যাকুরেসির মধ্যকার ট্রেডঅফ দেখুন।',
    'Generation draws from a probability distribution over the vocabulary. Turn the temperature dial below to go from greedy to chaotic.': 'জেনারেশন শব্দভাণ্ডারের উপর একটি সম্ভাব্যতা বণ্টন থেকে নেয়। গ্রিডি থেকে বিশৃঙ্খলে যেতে নিচের টেম্পারেচার ডায়াল ঘোরান।',
    'Give the model a search engine. Embed a query below and retrieve the nearest documents by cosine similarity, then generate a grounded answer.': 'মডেলকে একটি সার্চ ইঞ্জিন দিন। নিচে একটি কোয়েরি এমবেড করুন আর কোসাইন সিমিলারিটি দিয়ে নিকটতম ডকুমেন্ট রিট্রিভ করুন, তারপর একটি গ্রাউন্ডেড উত্তর তৈরি করুন।',
    'Increase the penalty and watch coefficients shrink. Compare Ridge’s smooth shrinkage with Lasso’s sparse feature selection.': 'পেনাল্টি বাড়ান আর কোএফিশিয়েন্ট সংকুচিত হতে দেখুন। Ridge-এর মসৃণ সংকোচনকে Lasso-র স্পার্স ফিচার নির্বাচনের সাথে তুলনা করুন।',
    'Information theory measures uncertainty and the cost of being wrong. It connects probability distributions directly to the losses used to train classifiers and language models.': 'ইনফরমেশন থিওরি অনিশ্চয়তা আর ভুল হওয়ার খরচ পরিমাপ করে। এটি সম্ভাব্যতা বণ্টনকে সরাসরি ক্লাসিফায়ার ও ভাষা মডেল প্রশিক্ষণে ব্যবহৃত লসের সাথে যুক্ত করে।',
    'Inject a data or API fault, change coverage, and run a layered test suite to decide whether a release is safe.': 'একটি রিলিজ নিরাপদ কিনা সিদ্ধান্ত নিতে একটি ডেটা বা API ফল্ট ঢোকান, কভারেজ বদলান, আর একটি স্তরবদ্ধ টেস্ট স্যুট চালান।',
    'Inject a task failure, select retry policy, and run the dependency chain to see whether downstream work can continue.': 'ডাউনস্ট্রিম কাজ চালিয়ে যেতে পারে কিনা দেখতে একটি টাস্ক ব্যর্থতা ঢোকান, রিট্রাই পলিসি বাছুন, আর ডিপেন্ডেন্সি চেইন চালান।',
    'Inject latency or quality incidents to see why infrastructure, data, and model signals must be observed together.': 'কেন ইনফ্রাস্ট্রাকচার, ডেটা ও মডেল সিগন্যাল একসাথে পর্যবেক্ষণ করা জরুরি তা দেখতে লেটেন্সি বা কোয়ালিটি ইনসিডেন্ট ঢোকান।',
    'Instead of labelling data, these produce it. Explore how an autoencoder compresses and a GAN learns to forge below.': 'ডেটা লেবেল করার বদলে এগুলো তা তৈরি করে। নিচে অন্বেষণ করুন একটি অটোএনকোডার কীভাবে সংকুচিত করে আর একটি GAN কীভাবে জাল বানাতে শেখে।',
    'Machine learning depends on measuring change. Build intuition for slopes, partial derivatives and the chain rule before using them to train a model.': 'মেশিন লার্নিং পরিবর্তন পরিমাপের উপর নির্ভর করে। একটি মডেল প্রশিক্ষণে ব্যবহারের আগে ঢাল, পার্শিয়াল ডেরিভেটিভ ও চেইন রুলের অন্তর্দৃষ্টি গড়ুন।',
    'Matrices store structured numbers and compose linear relationships. Learn the operations used by every dense layer, embedding lookup and attention block.': 'ম্যাট্রিক্স কাঠামোবদ্ধ সংখ্যা সংরক্ষণ করে আর লিনিয়ার সম্পর্ক গঠন করে। প্রতিটি ডেন্স লেয়ার, এমবেডিং লুকআপ ও অ্যাটেনশন ব্লকে ব্যবহৃত অপারেশন শিখুন।',
    'Move a logit lens across transformer layers and intervene on an attention head or concept direction.': 'ট্রান্সফরমার লেয়ার জুড়ে একটি লজিট লেন্স সরান আর একটি অ্যাটেনশন হেড বা কনসেপ্ট দিকের উপর হস্তক্ষেপ করুন।',
    'Move along a feature and compare the average response curve with individual conditional-expectation paths.': 'একটি ফিচার বরাবর সরুন আর গড় রেসপন্স কার্ভকে স্বতন্ত্র কন্ডিশনাল-এক্সপেক্টেশন পথের সাথে তুলনা করুন।',
    'Move between concepts and visual styles by interpolating continuous coordinates rather than switching discrete labels.': 'বিচ্ছিন্ন লেবেল বদলানোর বদলে ক্রমাগত স্থানাঙ্ক ইন্টারপোলেট করে ধারণা ও ভিজ্যুয়াল স্টাইলের মধ্যে চলাচল করুন।',
    'Move the mean and standard deviation to see how location and spread reshape a normal distribution and its familiar probability bands.': 'লোকেশন ও বিস্তার কীভাবে একটি নরমাল ডিস্ট্রিবিউশন ও এর পরিচিত সম্ভাব্যতা ব্যান্ড পুনর্গঠন করে তা দেখতে মিন ও স্ট্যান্ডার্ড ডেভিয়েশন সরান।',
    'Move time forward and compare live traffic with the training distribution until drift crosses an operational threshold.': 'সময় সামনে এগিয়ে নিন আর ড্রিফট একটি অপারেশনাল থ্রেশহোল্ড পার না করা পর্যন্ত লাইভ ট্রাফিককে ট্রেনিং ডিস্ট্রিবিউশনের সাথে তুলনা করুন।',
    'Not all words matter equally. Pick a document below and watch ubiquitous words score near zero while distinctive ones rise.': 'সব শব্দ সমানভাবে গুরুত্বপূর্ণ নয়। নিচে একটি ডকুমেন্ট বাছুন আর দেখুন সর্বব্যাপী শব্দ প্রায় শূন্য স্কোর পায় আর স্বতন্ত্র শব্দ উঠে আসে।',
    'Partition a large dataset across workers and increase key skew to reveal stragglers and lost cluster efficiency.': 'ওয়ার্কারদের মধ্যে একটি বড় ডেটাসেট ভাগ করুন আর স্ট্র্যাগলার ও হারানো ক্লাস্টার দক্ষতা প্রকাশ করতে কী স্কিউ বাড়ান।',
    'Pick the right store for the job. Compare the relational and document models below.': 'কাজের জন্য সঠিক স্টোর বাছুন। নিচে রিলেশনাল ও ডকুমেন্ট মডেল তুলনা করুন।',
    'Predict a continuous number. Raise the polynomial degree below until R² climbs and the curve snakes through every point — that’s overfitting.': 'একটি অবিচ্ছিন্ন সংখ্যা পূর্বাভাস দিন। নিচে পলিনোমিয়াল ডিগ্রি বাড়ান যতক্ষণ না R² ওঠে আর কার্ভ প্রতিটি পয়েন্টের মধ্য দিয়ে এঁকেবেঁকে যায় — সেটাই ওভারফিটিং।',
    'Predict a discrete label. Place points near the border below and watch precision and recall move in the confusion matrix.': 'একটি বিচ্ছিন্ন লেবেল পূর্বাভাস দিন। নিচে সীমানার কাছে পয়েন্ট রাখুন আর কনফিউশন ম্যাট্রিক্সে প্রিসিশন ও রিকল সরতে দেখুন।',
    'Probability gives models a language for uncertainty. Move from events and conditional probability to Bayes’ rule and the distributions used in learning.': 'সম্ভাব্যতা মডেলকে অনিশ্চয়তার জন্য একটি ভাষা দেয়। ঘটনা ও কন্ডিশনাল প্রোবাবিলিটি থেকে বেইজের নিয়ম আর শেখায় ব্যবহৃত ডিস্ট্রিবিউশনে যান।',
    'Real datasets contain missing fields, duplicate records and extreme values. Apply explicit cleaning rules and inspect exactly what changed.': 'বাস্তব ডেটাসেটে অনুপস্থিত ফিল্ড, ডুপ্লিকেট রেকর্ড ও চরম মান থাকে। স্পষ্ট ক্লিনিং নিয়ম প্রয়োগ করুন আর ঠিক কী বদলালো তা পরীক্ষা করুন।',
    'Reasoning under uncertainty. Slide μ and σ below to reshape the normal curve and see the 68–95–99.7 empirical rule appear.': 'অনিশ্চয়তার মধ্যে যুক্তি। নরমাল কার্ভ পুনর্গঠন করতে নিচে μ ও σ স্লাইড করুন আর ৬৮–৯৫–৯৯.৭ এম্পিরিক্যাল নিয়ম দেখা দিতে দেখুন।',
    'Recurrent networks carry state across an ordered sequence. See how information persists — and where it fades — below.': 'রিকারেন্ট নেটওয়ার্ক একটি ক্রমানুসারী সিকোয়েন্স জুড়ে স্টেট বহন করে। নিচে দেখুন তথ্য কীভাবে টিকে থাকে — আর কোথায় মিলিয়ে যায়।',
    'Release the parameter point and compare SGD, momentum and Adam as they descend the same curved loss surface.': 'প্যারামিটার পয়েন্ট ছাড়ুন আর একই বাঁকানো লস সারফেস বেয়ে নামার সময় SGD, মোমেন্টাম ও Adam তুলনা করুন।',
    'Run schema, uniqueness, null, and volume checks against clean and broken datasets before deciding to publish or quarantine.': 'প্রকাশ বা কোয়ারেন্টাইন সিদ্ধান্তের আগে পরিচ্ছন্ন ও ভাঙা ডেটাসেটের বিপরীতে স্কিমা, ইউনিকনেস, নাল ও ভলিউম চেক চালান।',
    'Run unit, data, build, security, staging, and production jobs with failures and approval requirements.': 'ব্যর্থতা ও অনুমোদন চাহিদাসহ ইউনিট, ডেটা, বিল্ড, সিকিউরিটি, স্টেজিং ও প্রোডাকশন জব চালান।',
    'Scalars, vectors, matrices and higher-dimensional arrays are all tensors. This topic follows how shape, axes, indexing and broadcasting organize data for neural networks.': 'স্কেলার, ভেক্টর, ম্যাট্রিক্স ও উচ্চমাত্রিক অ্যারে সবই টেনসর। এই বিষয়টি অনুসরণ করে কীভাবে শেপ, অক্ষ, ইনডেক্সিং ও ব্রডকাস্টিং নিউরাল নেটওয়ার্কের জন্য ডেটা সাজায়।',
    'Select a candidate, set a quality gate, and promote only versions that meet the registry policy.': 'একটি ক্যান্ডিডেট বাছুন, একটি কোয়ালিটি গেট সেট করুন, আর শুধু সেই ভার্সন প্রমোট করুন যা রেজিস্ট্রি পলিসি মেটায়।',
    'Some directions survive a matrix transformation without turning. Those eigenvectors reveal stable structure; PCA uses them to find the directions containing the most variation.': 'কিছু দিক একটি ম্যাট্রিক্স রূপান্তরে না ঘুরে টিকে থাকে। সেই আইগেনভেক্টর স্থিতিশীল কাঠামো প্রকাশ করে; PCA সবচেয়ে বেশি তারতম্যযুক্ত দিক খুঁজতে এগুলো ব্যবহার করে।',
    'Step K-Means below: assign each point to its nearest centroid, move each centroid to the mean of its members, repeat until nothing moves.': 'নিচে K-Means ধাপে চালান: প্রতিটি পয়েন্টকে তার নিকটতম সেন্ট্রয়েডে বরাদ্দ করুন, প্রতিটি সেন্ট্রয়েডকে তার সদস্যদের গড়ে সরান, কিছু না নড়া পর্যন্ত পুনরাবৃত্তি করুন।',
    'Step through translation as a decoder scores several candidate continuations and keeps the strongest beams.': 'একটি ডিকোডার যখন কয়েকটি ক্যান্ডিডেট ধারাবাহিকতা স্কোর করে ও সবচেয়ে শক্তিশালী বিম রাখে তখন অনুবাদের ধাপে চলুন।',
    'Switch architectures and inspect the attention mask that determines which tokens can exchange information.': 'আর্কিটেকচার বদলান আর সেই অ্যাটেনশন মাস্ক পরীক্ষা করুন যা নির্ধারণ করে কোন টোকেনগুলো তথ্য বিনিময় করতে পারে।',
    'Switch between edge, depth and mask conditioning, then balance structural fidelity against generative freedom.': 'এজ, ডেপথ ও মাস্ক কন্ডিশনিংয়ের মধ্যে বদলান, তারপর স্ট্রাকচারাল ফিডেলিটি আর জেনারেটিভ স্বাধীনতার ভারসাম্য রাখুন।',
    'The lingua franca of ML, running live below. Write and execute Python (and R, Go) right in the browser.': 'এমএলের সাধারণ ভাষা, নিচে লাইভ চলছে। ব্রাউজারেই পাইথন (এবং R, Go) লিখুন ও চালান।',
    'The transformer’s first step: split text into subword tokens and map each to an embedding. Type below to see it happen.': 'ট্রান্সফরমারের প্রথম ধাপ: টেক্সটকে সাবওয়ার্ড টোকেনে ভাগ করুন আর প্রতিটিকে একটি এমবেডিংয়ে ম্যাপ করুন। এটি ঘটতে দেখতে নিচে টাইপ করুন।',
    'Toggle applicant features and watch their SHAP or LIME contributions move one loan prediction away from its baseline.': 'আবেদনকারীর ফিচার টগল করুন আর দেখুন তাদের SHAP বা LIME অবদান একটি ঋণ প্রেডিকশনকে তার বেসলাইন থেকে সরাচ্ছে।',
    'Toggle model components and measure how the held-out score changes while the remaining setup stays fixed.': 'মডেল উপাদান টগল করুন আর মাপুন বাকি সেটআপ স্থির থাকা অবস্থায় হেল্ড-আউট স্কোর কীভাবে বদলায়।',
    'Training is rolling downhill on an error surface. Drop the ball below, then add momentum to escape a ravine or a local minimum.': 'প্রশিক্ষণ হলো একটি ত্রুটি সারফেসে ঢাল বেয়ে গড়িয়ে পড়া। নিচে বল ছাড়ুন, তারপর একটি খাদ বা লোকাল মিনিমাম থেকে বেরোতে মোমেন্টাম যোগ করুন।',
    'Transform differently scaled inputs and add an extreme value to see why preprocessing changes distances, optimization and model behavior.': 'ভিন্নভাবে স্কেল করা ইনপুট রূপান্তর করুন আর একটি চরম মান যোগ করে দেখুন কেন প্রিপ্রসেসিং দূরত্ব, অপটিমাইজেশন ও মডেলের আচরণ বদলায়।',
    'Tune sensitivity and compare global distance with local density. Watch recall and false alarms trade places as the detector flags more points.': 'সেনসিটিভিটি টিউন করুন আর গ্লোবাল দূরত্বকে লোকাল ঘনত্বের সাথে তুলনা করুন। ডিটেক্টর আরও পয়েন্ট ফ্ল্যাগ করার সাথে রিকল ও ফলস অ্যালার্ম স্থান বদল করতে দেখুন।',
    'Turn a natural-language request into a structured function call, then inspect the result returned to the model.': 'একটি স্বাভাবিক-ভাষার অনুরোধকে একটি স্ট্রাকচার্ড ফাংশন কলে পরিণত করুন, তারপর মডেলে ফেরত আসা ফলাফল পরীক্ষা করুন।',
    'Turn queries into a picture. Click a region below and watch every KPI and chart update in real time.': 'কোয়েরিকে একটি ছবিতে পরিণত করুন। নিচে একটি অঞ্চলে ক্লিক করুন আর প্রতিটি KPI ও চার্ট রিয়েল-টাইমে হালনাগাদ হতে দেখুন।',
    'Weight-sharing filters slide across an image to detect edges, textures and shapes. Watch a kernel convolve across the input below.': 'ওয়েট-শেয়ারিং ফিল্টার এজ, টেক্সচার ও আকৃতি শনাক্ত করতে একটি ছবির উপর দিয়ে সরে। নিচে একটি কার্নেলকে ইনপুটের উপর দিয়ে কনভল্ভ করতে দেখুন।',

    /* ===== in-playground control labels ===== */
    'AR order p': 'AR অর্ডার p', 'Activation': 'অ্যাক্টিভেশন', 'Angle': 'কোণ', 'Audio prompt': 'অডিও প্রম্পট',
    'Axis size': 'অক্ষ আকার', 'Beam width': 'বিম প্রস্থ', 'Bootstrap samples': 'বুটস্ট্র্যাপ স্যাম্পল', 'Brightness': 'উজ্জ্বলতা',
    'CFG scale': 'CFG স্কেল', 'CNN layer depth': 'CNN লেয়ার গভীরতা', 'Candidate traffic': 'ক্যান্ডিডেট ট্রাফিক',
    'Cell value': 'সেল মান', 'Commits on branch': 'ব্রাঞ্চে কমিট', 'Concept': 'ধারণা', 'Concurrent jobs': 'সমসাময়িক জব',
    'Control strength': 'কন্ট্রোল শক্তি', 'Conversation': 'কথোপকথন', 'Conversions': 'কনভার্সন',
    'Current signal': 'বর্তমান সিগন্যাল', 'Current token': 'বর্তমান টোকেন', 'Current value': 'বর্তমান মান',
    'Data spread': 'ডেটা বিস্তার', 'Data — sampling skew': 'ডেটা — স্যাম্পলিং স্কিউ', 'Dataset size': 'ডেটাসেট আকার',
    'Days since deployment': 'ডিপ্লয়মেন্টের পর থেকে দিন', 'Debt ratio': 'ঋণ অনুপাত', 'Decision threshold': 'ডিসিশন থ্রেশহোল্ড',
    'Delivery window': 'ডেলিভারি উইন্ডো', 'Deploy — feedback loop': 'ডিপ্লয় — ফিডব্যাক লুপ', 'Differencing d': 'ডিফারেন্সিং d',
    'Dimensions': 'ডাইমেনশন', 'Direction & strength': 'দিক ও শক্তি', 'Discount γ': 'ডিসকাউন্ট γ', 'Dropout': 'ড্রপআউট',
    'Duration': 'সময়কাল', 'Endpoint': 'এন্ডপয়েন্ট', 'Era': 'যুগ', 'Event volume': 'ইভেন্ট ভলিউম', 'Explore ε': 'এক্সপ্লোর ε',
    'FFN expansion': 'FFN এক্সপ্যানশন', 'Filter rows': 'সারি ফিল্টার', 'Forecast horizon': 'ফোরকাস্ট হরাইজন',
    'Frame consistency': 'ফ্রেম কনসিসটেন্সি', 'Frozen backbone layers': 'ফ্রোজেন ব্যাকবোন লেয়ার', 'Guidance scale': 'গাইডেন্স স্কেল',
    'Heatmap opacity': 'হিটম্যাপ অপাসিটি', 'Height': 'উচ্চতা', 'Hidden layers': 'হিডেন লেয়ার', 'Horizon H': 'হরাইজন H',
    'Income outlier': 'আয় আউটলায়ার', 'Input x': 'ইনপুট x', 'Inspect timestep': 'টাইমস্টেপ পরীক্ষা', 'Key skew': 'কী স্কিউ',
    'Labelled examples': 'লেবেলযুক্ত উদাহরণ', 'Labels — annotator bias': 'লেবেল — অ্যানোটেটর বায়াস',
    'Latent dimensions': 'ল্যাটেন্ট ডাইমেনশন', 'Learning rate': 'লার্নিং রেট', 'Learning rate α': 'লার্নিং রেট α',
    'Lesson code editor': 'পাঠ কোড এডিটর', 'Polynomial degree': 'পলিনোমিয়াল ডিগ্রি', 'Temperature': 'টেম্পারেচার',
    'Tree depth': 'ট্রি গভীরতা', 'Number of trees': 'ট্রির সংখ্যা', 'Neighbors k': 'প্রতিবেশী k', 'Model complexity': 'মডেল জটিলতা',
    'Sensitivity': 'সেনসিটিভিটি', 'Hidden neurons': 'হিডেন নিউরন', 'Strength λ': 'শক্তি λ', 'Penalty': 'পেনাল্টি'
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
