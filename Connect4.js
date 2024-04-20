// הגדרת משתנים ראשוניים
var gameField = new Array(); // מערך שמייצג את המגרש של המשחק
var board = document.getElementById("game-table"); // משתנה שמצביע לאלמנט ה-HTML של לוח המשחק
var currentCol; // משתנה שמציין את העמודה הנוכחית של התור
var currentRow; // משתנה שמציין את השורה הנוכחית של התור
var currentPlayer; // משתנה שמציין את השחקן הנוכחי של התור
var id = 1; // מזהה ייחודי של כל קלף

newgame(); //התחלת משחק חדש

// פונקציה להתחלת משחק חדש
function newgame(){
    prepareField(); // יצירת המגרש למשחק חדש
    placeDisc(Math.floor(Math.random()*2)+1); // מקום קלף באקראי לשחקן הנוכחי
}

// פונקציה לבדיקת ניצחון
function checkForVictory(row,col){
    if(getAdj(row,col,0,1)+getAdj(row,col,0,-1) > 2){
        return true; // אם יש רצפים של 4 קלפים או יותר אופקית, יש ניצחון
    } else {
        if(getAdj(row,col,1,0) > 2){
            return true; // אם יש רצפים של 4 קלפים או יותר אנכית, יש ניצחון
        } else {
            if(getAdj(row,col,-1,1)+getAdj(row,col,1,-1) > 2){
                return true; // אם יש רצפים של 4 קלפים או יותר אלכסונית מימין לשמאל, יש ניצחון
            } else {
                if(getAdj(row,col,1,1)+getAdj(row,col,-1,-1) > 2){
                    return true; // אם יש רצפים של 4 קלפים או יותר אלכסונית משמאל לימין, יש ניצחון
                } else {
                    return false; // אחרת, אין ניצחון
                }
            }
        }           
    }
}

// פונקציה לבדיקת כמות הקלפים הסמוכים
function getAdj(row,col,row_inc,col_inc){
    if(cellVal(row,col) == cellVal(row+row_inc,col+col_inc)){
        return 1+getAdj(row+row_inc,col+col_inc,row_inc,col_inc); // אם הקלף הנוכחי זהה לקלף הסמוך אליו, מחזיר 1 פלוס כמות הקלפים הסמוכים
    } else {
        return 0; // אחרת, אין קלפים סמוכים
    }
}

// פונקציה להחזרת ערך התא במערך
function cellVal(row,col){
    if(gameField[row] == undefined || gameField[row][col] == undefined){
        return -1; // אם השורה או העמודה אינם קיימים, מחזיר -1
    } else {
        return gameField[row][col]; // אחרת, מחזיר את ערך התא במערך
    }
}

// פונקציה למציאת השורה הראשונה פנויה בעמודה
function firstFreeRow(col,player){
    for(var i = 0; i<6; i++){
        if(gameField[i][col]!=0){
            break; // מוצא תא ריק, מפסיק את הלולאה
        }
    }
    gameField[i-1][col] = player; // מציין את התא בשורה הראשונה שאינו ריק כשל שחקן
    return i-1; // מחזיר את השורה הראשונה הפנויה
}

// פונקציה למציאת העמודות האפשריות למהלך
function possibleColumns(){
    var moves_array = new Array();
    for(var i=0; i<7; i++){
        if(gameField[0][i] == 0){
            moves_array.push(i); // מכניס את העמודה למערך המהלכים האפשריים
        }
    }
    return moves_array; // מחזיר את מערך העמודות האפשריות
}

// פונקציה לחשיבת המהלך של המחשב
function think(){
var possibleMoves = possibleColumns();
var aiMoves = new Array();
var blocked;
var bestBlocked = 0;

for(var i=0; i<possibleMoves.length; i++){
    for(var j=0; j<6; j++){
        if(gameField[j][possibleMoves[i]] != 0){
        break; // מוצא תא ריק, מפסיק את הלולאה
        }
    }

    gameField[j-1][possibleMoves[i]] = 1; // מנסה את המהלך האפשרי
    blocked = getAdj(j-1,possibleMoves[i],0,1)+getAdj(j-1,possibleMoves[i],0,-1);
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,0));
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],-1,1));
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,1)+getAdj(j-1, possibleMoves[i],-1,-1));

    if(blocked >= bestBlocked){
        if(blocked>bestBlocked){
        bestBlocked = blocked;
        aiMoves = new Array();
        }
        aiMoves.push(possibleMoves[i]);
    }
gameField[j-1][possibleMoves[i]] = 0; // ביטול המהלך
}

return aiMoves; // מחזיר את מערך המהלכים המתאימים למחשב
}

// פונקציה ליצירת קלף חדש
function Disc(player){
    this.player = player; // שחקן ששייך לקלף
    this.color = player == 1 ? 'red' : 'yellow'; // צבע הקלף
    this.id = id.toString(); // מזהה ייחודי לקלף
    id++;

    this.addToScene = function(){
        board.innerHTML += '<div id="d'+this.id+'" class="disc '+this.color+'"></div>'; // הוספת הקלף ללוח המשחק ב-HTML
        if(currentPlayer==2){
            //computer move
            var possibleMoves = think(); // חישוב המהלך של המחשב
            var cpuMove = Math.floor( Math.random() * possibleMoves.length); // בחירת מהלך אקראי מתוך המהלכים האפשריים
            currentCol = possibleMoves[cpuMove]; // עמודת המהלך הנוכחית
            document.getElementById('d'+this.id).style.left = (14+60*currentCol)+"px"; // תזוזת הקלף למעלה
            dropDisc(this.id,currentPlayer); // הזזת הקלף
        }
    }

        var $this = this;

    // טיפול באירוע של תנועת העכבר
    document.onmousemove = function(evt){
        // בדיקה האם תור השחקן הוא תור השחקן האדום (שחקן 1)
        if(currentPlayer == 1){
            // חישוב עמודת המשחק שבה נמצא העכבר
            currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
            
            // וודא שעמודת המשחק לא נמצאת מחוץ לגבולות הלוח (מספר העמודות הינו 0-6)
            if(currentCol < 0){
                currentCol = 0;
            }
            if(currentCol > 6){
                currentCol = 6;
            }

            // עדכון מיקום הקלף על פי מיקום העמודה הנוכחית של העכבר
            document.getElementById('d' + $this.id).style.left = (14 + 60 * currentCol) + "px";
            
            // הזזת הקלף מעל ללוח המשחק בעומק של 55 פיקסלים
            document.getElementById('d' + $this.id).style.top = "-55px";
        }
    }

    // טיפול באירוע של טעינת הדף
    document.onload = function(evt){
        // בדיקה האם תור השחקן הוא תור השחקן האדום (שחקן 1)
        if(currentPlayer == 1){
            // חישוב עמודת המשחק שבה נמצא העכבר
            currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
            
            // וודא שעמודת המשחק לא נמצאת מחוץ לגבולות הלוח (מספר העמודות הינו 0-6)
            if(currentCol < 0){
                currentCol = 0;
            }
            if(currentCol > 6){
                currentCol = 6;
            }

            // עדכון מיקום הקלף על פי מיקום העמודה הנוכחית של העכבר
            document.getElementById('d' + $this.id).style.left = (14 + 60 * currentCol) + "px";
            
            // הזזת הקלף מעל ללוח המשחק בעומק של 55 פיקסלים
            document.getElementById('d' + $this.id).style.top = "-55px";
        }
    }

    // טיפול באירוע של לחיצה על הלוח
    document.onclick = function(evt){
        // בדיקה האם תור השחקן הוא תור השחקן האדום (שחקן 1)
        if(currentPlayer == 1){
            // בדיקה האם העמודה שבה נמצא העכבר היא עמודה חוקית למהלך
            if(possibleColumns().indexOf(currentCol) != -1){
                // ביצוע המהלך והצבת הקלף במערכת המשחק
                dropDisc($this.id, $this.player);
            }
        }
    }

}

// פונקציה להזזת הקלף
function dropDisc(cid,player){
    currentRow = firstFreeRow(currentCol,player); // מציאת השורה הראשונה הפנויה
    moveit(cid,(14+currentRow*60)); // הזזת הקלף לשורה הראשונה הפנויה
    currentPlayer = player; // עדכון שחקן הנוכחי
    checkForMoveVictory(); // בדיקת ניצחון לאחר המהלך
}

// בדיקת ניצחון לאחר מהלך
function checkForMoveVictory(){
    if(!checkForVictory(currentRow,currentCol)){
        placeDisc(3-currentPlayer); // אם אין ניצחון, יש לשחקן השני אפשרות למהלך
    } else {
        var ww = currentPlayer == 2 ? 'Computer' : 'Player'; // מציאת המנצח
        placeDisc(3-currentPlayer); // יצירת מהלך לשחקן השני
        alert(ww+" win!"); // הודעת ניצחון
        board.innerHTML = ""; // איפוס הלוח
        newgame(); // התחלת משחק חדש
    }
}

// הוספת קלף למגרש המשחק
function placeDisc(player){
currentPlayer = player; // עדכון שחקן הנוכחי
var disc = new Disc(player); // יצירת קלף חדש
disc.addToScene(); // הוספת הקלף ללוח המשחק
}

// הכנת המגרש למשחק
function prepareField(){
    gameField = new Array(); // יצירת מערך חדש למגרש המשחק
    for(var i=0; i<6; i++){
        gameField[i] = new Array();
        for(var j=0; j<7; j++){
            gameField[i].push(0); // מילוי המערך בתאים ריקים
        }
    }
}

// הזזת הקלף
function moveit(who,where){
    document.getElementById('d'+who).style.top = where+'px'; //  CSS שינוי מיקום הקלף בעזרת 
}





