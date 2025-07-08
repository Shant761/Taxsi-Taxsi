
let score = 0;
let paused = false;
let gameInterval;
const car = document.getElementById('car');
const game = document.getElementById('game');
const menu = document.getElementById('menu');
const scoreText = document.getElementById('score');
const music = document.getElementById('bg-music');
const musicLoader = document.getElementById('musicLoader');

const coffeeQuotes = [
  "Ահա՛, էս էր պակաս ☕",
  "Էս սուրճից հետո վինգաճիկ կշարժվի",
  "Բալասով մերսի"
];
const passengerQuotes = [
  "Քարը քովդ նստի 🧍",
  "Իջեցնեմ Բանգլադեշ",
  "Էս անգամ մոլոր չգնաս"
];
const obstacleQuotes = [
  "Վարորդի իրավունքս մոռացա...",
  "Ջարդեցիր шавերմաջանը",
  "Գայի տեսավ, չկարացավ"
];

function showPopup(text) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerText = text;
  game.appendChild(popup);
  setTimeout(() => game.removeChild(popup), 2000);
}

function moveCarWithTouch(e) {
  if (paused) return;
  const x = e.touches[0].clientX;
  const percent = (x / window.innerWidth) * 100;
  const clamped = Math.min(90, Math.max(10, percent));
  car.style.left = `${clamped}%`;

  if (clamped < 50) car.style.transform = 'translateX(-50%) rotate(-5deg)';
  else if (clamped > 50) car.style.transform = 'translateX(-50%) rotate(5deg)';
  else car.style.transform = 'translateX(-50%)';
}

function spawnEntity() {
  if (paused) return;
  const entity = document.createElement('div');
  const r = Math.random();
  let type = '';

  if (r < 0.4) {
    type = 'coffee';
    entity.classList.add('item', 'coffee');
    entity.innerHTML = '☕';
  } else if (r < 0.8) {
    type = 'passenger';
    entity.classList.add('item', 'passenger');
    entity.innerHTML = '🧍';
  } else {
    type = 'obstacle';
    entity.classList.add('obstacle');
    entity.innerHTML = '💥';
  }

  entity.dataset.type = type;
  entity.style.left = Math.floor(Math.random() * 90) + '%';
  game.appendChild(entity);

  let pos = -40;
  const interval = setInterval(() => {
    if (paused) return;
    pos += 5;
    entity.style.top = pos + 'px';

    const carRect = car.getBoundingClientRect();
    const itemRect = entity.getBoundingClientRect();

    if (
      itemRect.top + itemRect.height > carRect.top &&
      itemRect.left < carRect.right &&
      itemRect.right > carRect.left
    ) {
      if (type === 'coffee') {
        score += 1;
        showPopup(coffeeQuotes[Math.floor(Math.random() * coffeeQuotes.length)]);
      } else if (type === 'passenger') {
        score += 3;
        showPopup(passengerQuotes[Math.floor(Math.random() * passengerQuotes.length)]);
      } else {
        score = Math.max(0, score - 5);
        showPopup(obstacleQuotes[Math.floor(Math.random() * obstacleQuotes.length)]);
      }
      scoreText.textContent = 'Միավոր: ' + score;
      clearInterval(interval);
      game.removeChild(entity);
    }

    if (pos > window.innerHeight) {
      clearInterval(interval);
      game.removeChild(entity);
    }
  }, 50);
}

function startGame() {
  menu.style.display = "none";
  game.style.display = "block";
  score = 0;
  scoreText.textContent = 'Միավոր: 0';
  paused = false;
  gameInterval = setInterval(spawnEntity, 1000);
}

function restartGame() {
  location.reload();
}

function pauseGame() {
  paused = !paused;
}

window.addEventListener('touchmove', moveCarWithTouch);
musicLoader.addEventListener("change", function() {
  const file = this.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    music.src = url;
    music.play().catch(() => {});
  }
});
