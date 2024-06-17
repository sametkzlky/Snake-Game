const container = document.getElementById("container");
const snakeContainer = document.getElementById("snake-container");
const scoreDisplay = document.getElementById("score");
const modal = document.getElementById("myModal");
const eatContainer = document.getElementById("eat-container");
const clearScore = document.getElementById("resetButton");
let snakeParts = [];

let snakeX = 5;
let snakeY = 5;
let routex = 0;
let routey = 0;
let score = 0;
let gameStarted = false;

snakeContainer.style.left = `${snakeX * 10}px`;
snakeContainer.style.top = `${snakeY * 10}px`;

document.addEventListener("keydown",  (event) =>{
  if (!gameStarted) {
    startGame();
    gameStarted = true;
  }
  switch (event.key) {
    case "ArrowUp":
      if (routey !== 1) {
        routex = 0;
        routey = -1;
      }
      break;
    case "ArrowDown":
      if (routey !== -1) {
        routex = 0;
        routey = 1;
      }
      break;
    case "ArrowLeft":
      if (routex !== 1) {
        routex = -1;
        routey = 0;
      }
      break;
    case "ArrowRight":
      if (routex !== -1) {
        routex = 1;
        routey = 0;
      }
      break;
  }
});

updateScore = () => {
  score++;
  scoreDisplay.innerText = "Score : " + score;
  // Skoru local storage'a kaydet
  localStorage.setItem("snakeScore", score);
}

createEat = () => {
  if (!eatContainer) {
    console.error("eat-container elementi bulunamadı.");
    return;
  }
  const eatX = Math.floor(Math.random() * 50);
  const eatY = Math.floor(Math.random() * 50);
  eatContainer.style.left = `${eatX * 10}px`;
  eatContainer.style.top = `${eatY * 10}px`;

  if (snakeParts.length === 0) {
     growSnake();
  }
}
// Oyunu başlat

createEat();

// Yemi yedikten sonra skoru güncelle ve yerel depolama alanında sakla
 checkEat = () => {
  if (snakeX === parseInt(eatContainer.style.left) / 10 && snakeY === parseInt(eatContainer.style.top) / 10) {    
    updateScore();
  }
}
moveSnake = () => {
  snakeX += routex;
  snakeY += routey;

  if (snakeX < 0 || snakeX >= 50 || snakeY < 0 || snakeY >= 50 || checkCollisionWithTail()) {         
    endGame();
    return;
  }
  snakeContainer.style.left = `${snakeX * 10}px`;
  snakeContainer.style.top = `${snakeY * 10}px`;

  if (snakeX === parseInt(eatContainer.style.left) / 10 && snakeY === parseInt(eatContainer.style.top) / 10) {
    score++;
    scoreDisplay.innerText = "Score : " + score;
    createEat();
    const newPart = growSnake();
    // Skoru local storage'a kaydet
    localStorage.setItem("snakeScore", score);
  }
  moveSnakeParts();
}
// Sayfa yüklendiğinde skoru local storage'dan al ve ekrana yansıt
window.onload = () => {
  const savedScore = localStorage.getItem("snakeScore");
  if (savedScore !== null) {
    // .onload mantığı nedir sor !!!
    score = parseInt(savedScore);
    scoreDisplay.innerText = "Score : " + score;
  }
};

checkCollisionWithSnake = () => {
  for (let i = 1; i < snakeParts.length; i++) {
    if (snakeX === snakeParts[i].x && snakeY === snakeParts[i].y) {      
      return true; // Çarpışma varsa true döndür
    }
  }
  return false; // Çarpışma yoksa false döndür
}

// Yılanın parçalarını hareket ettiren fonksiyon
function moveSnakeParts () {
  for (let i = snakeParts.length - 1; i > 0; i--) {
    snakeParts[i].x = snakeParts[i - 1].x;
    snakeParts[i].y = snakeParts[i - 1].y;
    snakeParts[i].element.style.left = `${snakeParts[i].x * 10}px`;
    snakeParts[i].element.style.top = `${snakeParts[i].y * 10}px`; 
  }
  if (snakeParts.length > 0) {
    snakeParts[0].x = snakeX;
    snakeParts[0].y = snakeY;
    snakeParts[0].element.style.left = `${snakeX * 10}px`;
    snakeParts[0].element.style.top = `${snakeY * 10}px`;
  }
}

// Yılanın başının kuyruğuna değip değmediğini kontrol eden fonksiyon
checkCollisionWithTail = () => {
  for (let i = 1; i < snakeParts.length; i++) {
    if (snakeX === snakeParts[i].x && snakeY === snakeParts[i].y) {     
      return true; // Yılanın başı kuyruğuna değdi
    }
  }
  return false; // Yılanın başı kuyruğuna değmedi
}

// Yeni bir yılan parçası oluştur ve konumunu ayarla
function growSnake() {   
  const newPart = document.createElement("div");
  newPart.className = "snake-part";
  newPart.style.width = "10px";
  newPart.style.height = "10px";
  newPart.style.backgroundColor = "green"; 
  newPart.style.position = "absolute";
  newPart.style.left = `${snakeX * 10}px`;
  newPart.style.top = `${snakeY * 10}px`;
  // Yeni parçayı yılan konteynırına ekle
  container.appendChild(newPart);
  // Yeni parçayı snakeParts dizisine ekle
  snakeParts.push({ x: snakeX, y: snakeY, element: newPart });
  return newPart; // newPart değişkenini döndür
}

endGame = () => {
  modal.style.display = "block"; // Modalı görünür hale getir
}

resetScore = () => {
  score = 0;
  scoreDisplay.innerText = "Score : " + score;
  localStorage.removeItem("snakeScore");
}

// Oyunu yeniden başlatan fonksiyon
restartGame = () =>  {
  modal.style.display = "none"; // Modalı gizle
  snakeX = 5;
  snakeY = 5;
  routex = 0;
  routey = 0;
  score = 0;
  scoreDisplay.innerText = "Score : " + score;
  snakeContainer.style.left = `${snakeX * 10}px`;
  snakeContainer.style.top = `${snakeY * 10}px`;
  snakeParts.forEach((part) => part.element.remove());
  snakeParts = [];
  createEat();
  const savedScore = localStorage.getItem("snakeScore");
  if (savedScore !== null) {
    score = parseInt(savedScore);
    scoreDisplay.innerText = "Score : " + score;
  }
}
// Oyun döngüsü
gameLoop = () => {
  moveSnake();
  setTimeout(gameLoop, 80);
}
// Oyunu başlatan fonksiyon
startGame = () => {
  gameLoop();
}
