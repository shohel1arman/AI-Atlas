/* ============================================================
   AI ATLAS — lightweight chrome i18n (English · বাংলা)
   Translates marked chrome only ([data-i18n] / [data-i18n-ph]).
   Keys are the English source text. Missing keys fall back to
   English, so partial coverage never breaks a page.
   Playground/lesson internals are intentionally left in English.
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'atlas-lang';

  var BN = {
    /* ---- sidebar groups ---- */
    'Overview': 'সংক্ষিপ্ত বিবরণ',
    'Foundations': 'ভিত্তি',
    'Language & Generation': 'ভাষা ও জেনারেশন',
    'Applied & Frontier': 'ফলিত ও অগ্রভাগ',
    'Systems & Research': 'সিস্টেম ও গবেষণা',

    /* ---- sidebar / nav items ---- */
    'Atlas Home': 'অ্যাটলাস হোম',
    'Mathematics': 'গণিত',
    'Data Analysis': 'ডেটা বিশ্লেষণ',
    'Machine Learning': 'মেশিন লার্নিং',
    'Deep Learning Lab': 'ডিপ লার্নিং ল্যাব',
    'Deep Learning': 'ডিপ লার্নিং',
    'Transformers & LLMs': 'ট্রান্সফরমার ও এলএলএম',
    'Transformers': 'ট্রান্সফরমার',
    'LLM & Agents Lab': 'এলএলএম ও এজেন্ট ল্যাব',
    'Generative AI': 'জেনারেটিভ এআই',
    'Explainable AI': 'ব্যাখ্যাযোগ্য এআই',
    'Computer Vision': 'কম্পিউটার ভিশন',
    'Reinforcement Learning': 'রিইনফোর্সমেন্ট লার্নিং',
    'Time Series': 'টাইম সিরিজ',
    'Prompt Engineering': 'প্রম্পট ইঞ্জিনিয়ারিং',
    'AI Ethics & Safety': 'এআই নৈতিকতা ও নিরাপত্তা',
    'Code & Stack': 'কোড ও স্ট্যাক',
    'ETL & Data Eng.': 'ইটিএল ও ডেটা ইঞ্জিনিয়ারিং',
    'ETL Pipelines': 'ইটিএল পাইপলাইন',
    'MLOps': 'এমএলঅপস',
    'Research Lab': 'গবেষণা ল্যাব',
    'Statistics & Data': 'পরিসংখ্যান ও ডেটা',
    'Ask Atlas…': 'অ্যাটলাসকে জিজ্ঞাসা করুন…',
    'Your Atlas': 'আপনার অ্যাটলাস',
    'Free explorer': 'ফ্রি এক্সপ্লোরার',
    'All Modules': 'সব মডিউল',
    'Atlas': 'অ্যাটলাস',
    'Home': 'হোম',

    /* ---- landing nav + CTAs ---- */
    'ML': 'এমএল',
    'Sign in': 'সাইন ইন',
    'Open Atlas ›': 'অ্যাটলাস খুলুন ›',
    'Enter the Atlas': 'অ্যাটলাসে প্রবেশ করুন',
    'Enter the Atlas →': 'অ্যাটলাসে প্রবেশ করুন →',
    'Watch attention flow': 'অ্যাটেনশন ফ্লো দেখুন',
    'Interactive AI Learning OS': 'ইন্টারঅ্যাক্টিভ এআই লার্নিং ওএস',
    'Interactive AI learning OS': 'ইন্টারঅ্যাক্টিভ এআই লার্নিং ওএস',

    /* ---- hero ---- */
    'Learn AI visually through simulations, playgrounds, animations, and interactive mathematical intuition — from a single vector all the way to a transformer.':
      'সিমুলেশন, প্লেগ্রাউন্ড, অ্যানিমেশন এবং ইন্টারঅ্যাক্টিভ গাণিতিক অন্তর্দৃষ্টির মাধ্যমে এআই দৃশ্যমানভাবে শিখুন — একটিমাত্র ভেক্টর থেকে শুরু করে ট্রান্সফরমার পর্যন্ত।',
    'interactive playgrounds': 'ইন্টারঅ্যাক্টিভ প্লেগ্রাউন্ড',
    'core disciplines': 'মূল শাখা',
    'real-time simulation': 'রিয়েল-টাইম সিমুলেশন',

    /* ---- footer column headings ---- */
    'Learn': 'শিখুন',
    'Build': 'তৈরি করুন',
    'AI Assistant': 'এআই সহকারী',
    'Community': 'কমিউনিটি',
    'Language & Generation ': 'ভাষা ও জেনারেশন ',

    /* ---- module eyebrows ---- */
    'Machine Learning Playground': 'মেশিন লার্নিং প্লেগ্রাউন্ড',
    'Mathematics Playground': 'গণিত প্লেগ্রাউন্ড',
    'MLOps Playground': 'এমএলঅপস প্লেগ্রাউন্ড',
    'Generative AI Lab': 'জেনারেটিভ এআই ল্যাব',
    'Language & Generation (NLP)': 'ভাষা ও জেনারেশন (এনএলপি)',
    'AI Research Lab': 'এআই গবেষণা ল্যাব',
    'Time Series & Forecasting': 'টাইম সিরিজ ও ফোরকাস্টিং',
    'ETL & Data Engineering': 'ইটিএল ও ডেটা ইঞ্জিনিয়ারিং',
    'Explainable AI (XAI)': 'ব্যাখ্যাযোগ্য এআই (এক্সএআই)',

    /* ---- module headings ---- */
    'Powerful systems, real consequences': 'শক্তিশালী সিস্টেম, বাস্তব পরিণতি',
    'Teaching machines to see': 'যন্ত্রকে দেখতে শেখানো',
    'Query, visualize, and reason about data': 'ডেটা নিয়ে কোয়েরি, ভিজ্যুয়ালাইজ ও যুক্তি করুন',
    'Build a neural network with your hands': 'নিজের হাতে একটি নিউরাল নেটওয়ার্ক তৈরি করুন',
    'Build reliable paths from raw data to useful data': 'কাঁচা ডেটা থেকে উপযোগী ডেটায় নির্ভরযোগ্য পথ তৈরি করুন',
    'The map before the territory': 'ভূখণ্ডের আগে মানচিত্র',
    'Create images, audio, and motion from learned distributions': 'শেখা ডিস্ট্রিবিউশন থেকে ছবি, অডিও ও মোশন তৈরি করুন',
    'Build, run, tune, and orchestrate language models': 'ভাষা মডেল তৈরি, চালনা, টিউন ও অর্কেস্ট্রেট করুন',
    'Classic models, each a live sandbox': 'ক্লাসিক মডেল, প্রতিটিই একটি লাইভ স্যান্ডবক্স',
    'The intuition behind every equation': 'প্রতিটি সমীকরণের পেছনের অন্তর্দৃষ্টি',
    'Operate models with evidence and safe controls': 'প্রমাণ ও নিরাপদ নিয়ন্ত্রণসহ মডেল পরিচালনা করুন',
    'How machines read and write': 'যন্ত্র কীভাবে পড়ে ও লেখে',
    'The languages and systems that power AI': 'যে ভাষা ও সিস্টেম এআইকে শক্তি দেয়',
    'The interface is language': 'ইন্টারফেসটাই ভাষা',
    'Learning from reward, not labels': 'লেবেল নয়, পুরস্কার থেকে শেখা',
    'Turn observations into defensible evidence': 'পর্যবেক্ষণকে রূপান্তর করুন রক্ষণযোগ্য প্রমাণে',
    'Data that remembers its order': 'যে ডেটা তার ক্রম মনে রাখে',
    'See attention think': 'অ্যাটেনশনকে ভাবতে দেখুন',
    'Open the black box': 'ব্ল্যাক বক্স খুলুন'
  };

  function get() {
    try { return localStorage.getItem(KEY) === 'bn' ? 'bn' : 'en'; }
    catch (e) { return 'en'; }
  }

  function apply(lang) {
    var map = lang === 'bn' ? BN : null;
    try { document.documentElement.setAttribute('lang', lang === 'bn' ? 'bn' : 'en'); } catch (e) {}
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var en = el.getAttribute('data-i18n');
      if (!en) return;
      el.textContent = (map && map[en]) ? map[en] : en;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var en = el.getAttribute('data-i18n-ph');
      if (!en) return;
      el.setAttribute('placeholder', (map && map[en]) ? map[en] : en);
    });
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      var on = b.getAttribute('data-lang-btn') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  function set(lang) {
    lang = lang === 'bn' ? 'bn' : 'en';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang);
  }

  window.AtlasI18n = { get: get, set: set, apply: apply };

  function boot() {
    apply(get());
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-lang-btn]') : null;
      if (b) { e.preventDefault(); set(b.getAttribute('data-lang-btn')); }
    });
    /* re-apply after late chrome (sidebar is injected by app-shell.js) */
    setTimeout(function () { apply(get()); }, 80);
    setTimeout(function () { apply(get()); }, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
