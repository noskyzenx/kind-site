'use strict';

/* EDIT HERE to add/remove lines. */
const LINES = [
  { en: "You are enough, exactly as you are.", zh: "你本来就足够好了。" },
  { en: "Breathe in calm; breathe out tension.", zh: "吸入平静，呼出紧张。" },
  { en: "Progress, not perfection.", zh: "追求进步，而非完美。" },
  { en: "Small steps count; keep going.", zh: "小步也重要，继续前行。" },
  { en: "Your feelings are valid.", zh: "你的感受是合理的。" },
  { en: "You can do hard things.", zh: "你可以做成困难的事。" },
  { en: "Let today be gentle.", zh: "让今天温柔一些。" },
  { en: "One moment at a time.", zh: "一次只专注此刻。" },
  { en: "Rest is productive, too.", zh: "休息也是一种有效前进。" },
  { en: "You are growing in the right direction.", zh: "你正朝着正确的方向成长。" },
  { en: "Be kind to your mind.", zh: "善待你的内心。" },
  { en: "Your pace is perfect for you.", zh: "你的节奏正好适合你。" },
  { en: "Softness is strength.", zh: "温柔也是力量。" },
  { en: "You deserve the space you take.", zh: "你值得拥有你所占据的空间。" },
  { en: "Trust the process; trust yourself.", zh: "相信过程，也相信自己。" },
  { en: "Your presence is a gift.", zh: "你的存在就是礼物。" },
  { en: "Inhale confidence; exhale doubt.", zh: "吸入自信，呼出怀疑。" },
  { en: "You are allowed to start again.", zh: "你可以重新开始。" },
  { en: "You are learning; that’s enough.", zh: "你正在学习，这已经足够。" },
  { en: "Notice one thing you’re grateful for.", zh: "留意一件让你心怀感激的事。" },
  { en: "You belong here.", zh: "你属于这里。" },
  { en: "May you be safe and well.", zh: "愿你平安顺遂。" },
  { en: "Let your shoulders drop.", zh: "放松肩膀。" },
  { en: "Choose curiosity over judgment.", zh: "多些好奇，少些评判。" },
  { en: "Your voice matters.", zh: "你的声音很重要。" },
  { en: "It’s okay to ask for help.", zh: "请求帮助没有问题。" },
  { en: "You have come so far.", zh: "你已经走了很远。" },
  { en: "Your body deserves kindness.", zh: "你的身体值得被善待。" },
  { en: "You can take up space.", zh: "你可以放心地占据空间。" },
  { en: "You are worthy of good things.", zh: "你值得拥有美好。" },
  { en: "Let go of what you can’t carry.", zh: "放下那些无法再承受的负担。" },
  { en: "You are doing better than you think.", zh: "你比自己以为的更好。" },
  { en: "Give yourself permission to rest.", zh: "允许自己休息。" },
  { en: "Today, start where you are.", zh: "就从当下所在开始。" }
];

const quoteEl = document.getElementById('quote');
const quoteEnEl = document.getElementById('quote-en');
const quoteZhEl = document.getElementById('quote-zh');
const buttonEl = document.getElementById('quoteButton');

// Shuffle helper (Fisher–Yates)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let deck = [];
let lastIndex = -1;
let animating = false;

function refillDeck(excludeIdx) {
  deck = Array.from({ length: LINES.length }, (_, i) => i).filter(i => i !== excludeIdx);
  shuffle(deck);
}

function pickInitialText() {
  lastIndex = Math.floor(Math.random() * LINES.length);
  return LINES[lastIndex];
}

function nextIndex() {
  if (deck.length === 0) {
    refillDeck(lastIndex);
  }
  const idx = deck.shift();
  lastIndex = idx;
  return idx;
}

function nextLine() {
  return LINES[nextIndex()];
}

function updateQuoteAnimated(nextText) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    quoteEnEl.textContent = nextText.en;
    quoteZhEl.textContent = nextText.zh;
    return;
  }
  if (animating) return;
  animating = true;

  // Fade out, then swap text, then fade in
  quoteEl.classList.add('hide');
  quoteEl.addEventListener('transitionend', () => {
    quoteEnEl.textContent = nextText.en;
    quoteZhEl.textContent = nextText.zh;
    // Force reflow to ensure next transition plays in some browsers
    void quoteEl.offsetWidth;
    quoteEl.classList.remove('hide');
    quoteEl.addEventListener('transitionend', () => {
      animating = false;
    }, { once: true });
  }, { once: true });
}

function showNext() {
  updateQuoteAnimated(nextLine());
}

// Initialize
(function init() {
  const initial = pickInitialText();
  quoteEnEl.textContent = initial.en;
  quoteZhEl.textContent = initial.zh;
  refillDeck(lastIndex);

  buttonEl.addEventListener('click', showNext);

  // Also allow Space/Enter globally when not on controls or the button
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const active = document.activeElement;
    const tag = (active && active.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (active && active.isContentEditable)) return;
    if (active === buttonEl || (active && buttonEl.contains(active))) return; // rely on native button behavior
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      showNext();
    }
  });
})();
