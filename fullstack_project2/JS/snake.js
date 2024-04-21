const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

// משתנה המציין אם המשחק נגמר או לא
let gameOver = false;

// נקודת האוכל ומיקומה הנוכחי
let foodX, foodY;

// נקודת הראש של הנחש ומיקומה הנוכחי
let snakeX = 5, snakeY = 5;

// מהירות התנועה של הנחש בצירי X ו-Y
let velocityX = 0, velocityY = 0;

// מערך הנחש
let snakeBody = [];

// מזהה ל- setInterval
let setIntervalId;

// ניקוד
let score = 0;

// קבלת הניקוד הגבוה מנקודות האחסון המקומיות
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `הכי טוב : ${highScore}`;

// עדכון מיקום האוכל
const updateFoodPosition = () => {
    // בחירת מיקום אקראי לאוכל בטווח 1-30
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// טיפול במצב של סיום המשחק
const handleGameOver = () => {
    // עצירת הטיימר והפעלת דיאלוג אזהרה למשתמש
    clearInterval(setIntervalId);
    alert("נגמר המשחק, נסה שוב !");
    location.reload();

    let username = localStorage.getItem('currentuser');
    let scores = JSON.parse(localStorage.getItem(username));
    scores.snake.push(score);
    localStorage.setItem(username, JSON.stringify(scores));
}

// שינוי כיוון הנחש על פי לחיצת מקש
const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// הוספת אירוע טיפול בלחיצת מקשים לכל מקש בפאנל הבקרה
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

// פונקציה להתחלת המשחק
const initGame = () => {
    if(gameOver) return handleGameOver();
    
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    // בדיקה האם הנחש אכל את האוכל
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    
    // עדכון מיקום הראש של הנחש
    snakeX += velocityX;
    snakeY += velocityY;
    
    // עדכון גוף הנחש
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];
    
    // בדיקה האם הנחש פגע בקיר, אם כן סיום המשחק
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }
    
    // בדיקה האם הנחש פגע בגוף שלו, אם כן סיום המשחק
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

// עדכון מיקום האוכל ראשונית
updateFoodPosition();

// הפעלת המשחק במשך זמן קבוע
setIntervalId = setInterval(initGame, 100);

// הוספת אירוע טיפול בלחיצת מקשים לכל המסמכים
document.addEventListener("keyup", changeDirection);
