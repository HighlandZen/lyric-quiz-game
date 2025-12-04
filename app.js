const lyrics = [
  { lyric: "Just a small town girl, livin' in a lonely world", answer: "Don't Stop Believin" },
  { lyric: "Because I'm happy, clap along if you feel like a room without a roof", answer: "Happy" },
  { lyric: "Hello from the other side", answer: "Hello" }
];

let index = 0;
let score = 0;
let time = 15;
let timer;

const lyricEl = document.getElementById("lyric");
const answerEl = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");

function loadQuestion() {
  if (index >= lyrics.length) return endGame();
  lyricEl.textContent = lyrics[index].lyric;
  answerEl.value = "";
  feedbackEl.textContent = "";
  resetTimer();
}

function resetTimer() {
  time = 15;
  document.getElementById("time").textContent = time;
  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    document.getElementById("time").textContent = time;
    if (time <= 0) {
      score -= 5;
      index++;
      loadQuestion();
    }
  }, 1000);
}

document.getElementById("submitBtn").onclick = () => {
  const guess = answerEl.value.trim().toLowerCase();
  const correct = lyrics[index].answer.toLowerCase();
  if (guess === correct) {
    let bonus = time * 2;
    score += 20 + bonus;
    feedbackEl.textContent = "Correct! +" + (20 + bonus);
  } else {
    score -= 5;
    feedbackEl.textContent = "Wrong!";
  }
  document.getElementById("score").textContent = score;
  index++;
  setTimeout(loadQuestion, 800);
};

document.getElementById("skipBtn").onclick = () => {
  score -= 10;
  index++;
  document.getElementById("score").textContent = score;
  loadQuestion();
};

function endGame() {
  clearInterval(timer);
  document.getElementById("card").classList.add("hidden");
  document.getElementById("endScreen").classList.remove("hidden");
  document.getElementById("finalScore").textContent = score;
}

document.getElementById("saveScoreBtn").onclick = async () => {
  const name = document.getElementById("playerName").value || "Anonymous";

  await fetch("/.netlify/functions/leaderboard", {
    method: "POST",
    body: JSON.stringify({ name, score }),
  });

  document.getElementById("saveMsg").textContent = "Saved!";
};

document.getElementById("refreshLeaderboard").onclick = loadLeaderboard;

async function loadLeaderboard() {
  const res = await fetch("/.netlify/functions/leaderboard");
  const data = await res.json();
  const list = document.getElementById("scoresList");
  list.innerHTML = "";
  data.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name} — ${s.score}`;
    list.appendChild(li);
  });
}

document.getElementById("playAgainBtn").onclick = () => location.reload();

loadQuestion();
loadLeaderboard();
