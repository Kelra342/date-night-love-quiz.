const questions = [
  { q: "Do you love me?", sub: "Let's start with a tiny, very important question.", emoji: "💌", caption: "a tiny question for you", sticker: "BE HONEST ♡", yes: "Yes, obviously", no: "No 😶" },
  { q: "Would you choose me again?", sub: "Out of everyone in this little universe... me?", emoji: "🌷", caption: "in every universe", sticker: "PICK ME?", yes: "Every single time", no: "Hmm... no" },
  { q: "Do I make your days better?", sub: "Even the boring Tuesdays and sleepy mornings?", emoji: "☀️", caption: "you make it brighter", sticker: "SUNSHINE CHECK", yes: "You know it", no: "Not really" },
  { q: "Would you share your last bite with me?", sub: "This one is serious. Snacks are precious.", emoji: "🍓", caption: "sharing is caring", sticker: "SNACK TEST", yes: "Of course!", no: "That's my bite" },
  { q: "Would you hold my hand in public?", sub: "Extra points if you hold it a little tighter.", emoji: "🫶", caption: "hand in hand", sticker: "SO CUTE", yes: "Come here ♡", no: "I'm shy" },
  { q: "Would you hug me on a bad day?", sub: "No fixing everything needed. A hug would do.", emoji: "🧸", caption: "emergency hug kit", sticker: "HUG PLEASE", yes: "Biggest hug", no: "No hugs" },
  { q: "Can I be your favorite notification?", sub: "Ding! It's me again. You're welcome.", emoji: "💗", caption: "ding! it's your person", sticker: "NEW MESSAGE", yes: "Always you", no: "Muted 😭" },
  { q: "Will you make cute memories with me?", sub: "Silly photos, late talks, and little adventures?", emoji: "📸", caption: "little things, forever", sticker: "MEMORY MAKERS", yes: "Let's make a million", no: "No memories" },
  { q: "Will you still like me on my grumpy days?", sub: "When I'm sleepy, dramatic, or stealing the blanket?", emoji: "🐻", caption: "cute even when grumpy", sticker: "REAL LOVE TEST", yes: "Especially then", no: "Blanket thief!" },
  { q: "So... will you go on a date with me?", sub: "One date, lots of laughs, and maybe something sweet?", emoji: "🌹", caption: "one sweet little date", sticker: "THE BIG QUESTION", yes: "YES, LET'S GO!", no: "Let me think" }
];

const introScreen = document.querySelector('#introScreen');
const quizScreen = document.querySelector('#quizScreen');
const resultScreen = document.querySelector('#resultScreen');
const startBtn = document.querySelector('#startBtn');
const yesBtn = document.querySelector('#yesBtn');
const noBtn = document.querySelector('#noBtn');
const answerStage = document.querySelector('#answerStage');
const questionTitle = document.querySelector('#questionTitle');
const questionSubtitle = document.querySelector('#questionSubtitle');
const questionNumber = document.querySelector('#questionNumber');
const progressText = document.querySelector('#progressText');
const progressPercent = document.querySelector('#progressPercent');
const progressFill = document.querySelector('#progressFill');
const artEmoji = document.querySelector('#artEmoji');
const artCaption = document.querySelector('#artCaption');
const artSticker = document.querySelector('#artSticker');
const tinyHint = document.querySelector('#tinyHint');
const copyBtn = document.querySelector('#copyBtn');
const copyStatus = document.querySelector('#copyStatus');
const restartBtn = document.querySelector('#restartBtn');

let currentIndex = 0;
let noDodges = 0;
let yesAnswers = 0;

function showScreen(screen) {
  [introScreen, quizScreen, resultScreen].forEach((item) => {
    item.hidden = item !== screen;
    item.classList.toggle('active', item === screen);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion() {
  const item = questions[currentIndex];
  const num = String(currentIndex + 1).padStart(2, '0');
  const percent = Math.round(((currentIndex + 1) / questions.length) * 100);
  questionTitle.textContent = item.q;
  questionSubtitle.textContent = item.sub;
  questionNumber.textContent = num;
  progressText.textContent = `QUESTION ${num} / ${questions.length}`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
  artEmoji.textContent = item.emoji;
  artCaption.textContent = item.caption;
  artSticker.textContent = item.sticker;
  yesBtn.innerHTML = `${item.yes} <span>♡</span>`;
  noBtn.textContent = item.no;
  noBtn.style.left = '';
  noBtn.style.top = '';
  noDodges = 0;
  tinyHint.textContent = currentIndex === 0
    ? 'Psst... the pink button is the correct answer. Just saying.'
    : 'That “No” button looks nervous. Can you catch it?';
}

function dodgeNo() {
  if (quizScreen.hidden) return;
  const stageRect = answerStage.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const maxX = Math.max(0, stageRect.width - noRect.width);
  const maxY = Math.max(0, stageRect.height - noRect.height - 4);
  let x = Math.random() * maxX;
  let y = Math.random() * maxY;
  // Keep the fleeing button from landing directly on top of the Yes button.
  for (let attempt = 0; attempt < 12; attempt++) {
    const overlapsYes = x < (yesRect.right - stageRect.left + 8) && x + noRect.width > (yesRect.left - stageRect.left - 8) && y < 55;
    if (!overlapsYes) break;
    x = Math.random() * maxX;
    y = Math.random() * maxY;
  }
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noDodges++;
  if (noDodges === 3) tinyHint.textContent = 'HAHA! It is getting away. Maybe try the pink button?';
  if (noDodges === 7) tinyHint.textContent = 'The “No” button has entered its shy era. Good luck!';
}

startBtn.addEventListener('click', () => {
  currentIndex = 0;
  yesAnswers = 0;
  renderQuestion();
  showScreen(quizScreen);
});

yesBtn.addEventListener('click', () => {
  yesAnswers++;
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showScreen(resultScreen);
  }
});

// Playfully evasive No button: it moves when approached, hovered, touched, or clicked.
noBtn.addEventListener('pointerenter', dodgeNo);
noBtn.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' || event.pointerType === 'pen') {
    event.preventDefault();
    dodgeNo();
  }
});
noBtn.addEventListener('click', (event) => {
  event.preventDefault();
  dodgeNo();
});
noBtn.addEventListener('focus', dodgeNo);

copyBtn.addEventListener('click', async () => {
  const message = `I passed the very serious J/K love quiz! 💗 I said YES to all ${questions.length} questions. Now, about that date... ♡`;
  try {
    await navigator.clipboard.writeText(message);
    copyStatus.textContent = 'Copied! Send it to your special person. ♡';
  } catch {
    copyStatus.textContent = message;
  }
});

restartBtn.addEventListener('click', () => {
  currentIndex = 0;
  yesAnswers = 0;
  renderQuestion();
  copyStatus.textContent = '';
  showScreen(introScreen);
});
