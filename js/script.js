// inner variables
var canvas, ctx;
var scoreCanvas, scoreCtx;
var iStart = 0;
var bRightBut = false;
var bLeftBut = false;
var oBall, oPadd, oBricks;
var aSounds = [];
var iPoints = 0;
var iGameTimer;
var iElapsed = iMin = iSec = 0;
var sLastTime, sLastPoints;
var restart;
var barWidth = 250;
var barHeight = 20;
var canStart = true;
var ratio = 1;
var ballEdgeY;
var ballEdgeX;
var ballArray=[];
var count=0;
var ballDead=false;
var brickNum=0;

// objects :
function Ball(x, y, dx, dy, r, img) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.img = img;
}
function Padd(x, w, h, img) {
    this.x = x;
    this.w = w;
    this.h = h;
    this.img = img;
}
function Bricks(w, h, r, c, p) {
    this.w = w;
    this.h = h;
    this.r = r; // rows
    this.c = c; // cols
    this.p = p; // padd
    this.objs;
    this.iconNum = 20;  //icon number
    this.colors = ['#FF0000', '#FF8000', '#FFBF00', '#04B404', '#5858FA', '#FFFFFF']; // colors for rows
}

//brick detail
function brick(exist, icon) {
    this.exist = exist;
    this.icon = icon;
}

function showGameOver() {
    ctx.font = '80px Verdana';
    ctx.fillStyle = 'red';
    ctx.textAlign = "center";
    ctx.fillText('Game Over', ctx.canvas.width / 2, ctx.canvas.height * 2 / 3);
    clearInterval(iStart);
    clearInterval(iGameTimer);
    canStart=true;
}

function showGameSuccess() {
    ctx.font = '80px Verdana';
    ctx.fillStyle = 'green';
    ctx.textAlign = "center";
    ctx.fillText('Success', ctx.canvas.width / 2, ctx.canvas.height / 2);
    clearInterval(iStart);
    clearInterval(iGameTimer);
    canStart=true;
}
// -------------------------------------------------------------
// draw functions :

function clear() { // clear canvas function
    scoreCtx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // fill background
    /*
    var my_gradient = ctx.createLinearGradient(0, 0, 0, 600);
    my_gradient.addColorStop(0.3, "black");
    my_gradient.addColorStop(1, "#5f5e5e");
    ctx.fillStyle = my_gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);*/
}

function move_bar(diration) {
    switch (diration) {
        case "l":
            if(oPadd.x <= 0)
                return;
            oPadd.x -= 50 * ratio;
            
            break;
        case "r":           
            if(oPadd.x + oPadd.w >= canvas.width)
                return;
            oPadd.x += 50 * ratio;
            
            break;
        case "b":
            if(oPadd.w <= 500){
                oPadd.w = oPadd.w * 1.5;
                
            }       
            break;      
        case "s":
            console.log("s");
            createBall();
            
            break;
        
        case "h":
            console.log("h");
            window.history.go(0);
            break;
        
        case "small":
            if(oPadd.w >= 150){
                oPadd.w = oPadd.w * 0.8;
                
            }
            break;
        case "f":
            ratio = 2;
            
            break;
        case "8":  // 復原原本的大小
            document.getElementById("person").className = "personLeave";
            break;

    }
}

function drawScene() { // main drawScene function
   

    clear(); // clear canvas

    
    var diration = "";
    if (bRightBut)
        diration = "r";
    else if (bLeftBut)
        diration = "l";
    
    move_bar(diration);


    // draw Padd (rectangle)
    ctx.drawImage(oPadd.img, oPadd.x, ctx.canvas.height - oPadd.h, oPadd.w, oPadd.h);

    // draw bricks (from array of its objects)
    drawBricks();

    if(brickNum<=0)
        showGameSuccess();

    //draw ball
    for (i = 0; i < ballArray.length; i++) {
        drawBall(ballArray[i], i);
    }
    


    scoreCtx.font = 'bold 25px 微軟正黑體';
    scoreCtx.fillStyle = 'black';
    iMin = Math.floor(iElapsed / 60);
    iSec = iElapsed % 60;
    if (iMin < 10)
        iMin = "0" + iMin;
    if (iSec < 10)
        iSec = "0" + iSec;

    if (sLastTime != null && sLastPoints != null) {
        scoreCtx.fillText('上次時間: ' + sLastTime, 75, 155);
        scoreCtx.fillText('上次分數: ' + sLastPoints, 75, 195);
    }


    scoreCtx.fillText('現在時間: ' + iMin + ':' + iSec, 75, 235);
    scoreCtx.fillText('現在分數: ' + iPoints, 75, 275);



}

//draw bricks
function drawBricks() {


    for (i = 0; i < oBricks.r; i++) {
        ctx.fillStyle = oBricks.colors[i];
        for (j = 0; j < oBricks.c; j++) {


            if (oBricks.objs[i][j].exist == 1) {

                
                ctx.beginPath();
                ctx.rect((j * (oBricks.w + oBricks.p)) + oBricks.p, (i * (oBricks.h + oBricks.p)) + oBricks.p, oBricks.w, oBricks.h);
                ctx.closePath();
                ctx.globalAlpha = 0.6;
                //ctx.shadowBlur=50;
                //ctx.shadowColor=oBricks.colors[i];
                ctx.fill();

                var img = new Image();
                img.src='css/icons/icon'+oBricks.objs[i][j].icon+'.png';
                //ctx.shadowBlur=0;
                ctx.globalAlpha = 0.75;
                ctx.drawImage(img,(j * (oBricks.h + oBricks.p)) + oBricks.p, (i * (oBricks.w + oBricks.p)) + oBricks.p, 78, 78);
                


            }
        }
    }
    ctx.globalAlpha = 1;
    //ctx.shadowBlur=0;
}

//draw ball
function drawBall(vBall, ballIndex) {
    //check ball dead or not
    ballDead = false;

    // draw Ball (circle)
    //ctx.fillStyle = '#f66';
    //ctx.beginPath();
    //ctx.arc(vBall.x, vBall.y, vBall.r, 0, Math.PI * 2, true);
    //ctx.closePath();
    //ctx.fill();

    //draw apple
    ctx.drawImage(vBall.img, vBall.x-vBall.r, vBall.y-vBall.r, vBall.r*2, vBall.r*2);

    // collision detection
    iRowH = oBricks.h + oBricks.p;
    if(vBall.dy<0){
        //ball rise
        ballEdgeY=vBall.y - vBall.r;
    }else{
        //ball fall
        ballEdgeY=vBall.y + vBall.r;   
    }

    if(vBall.dx<0){
        //ball left
        ballEdgeX=vBall.x - vBall.r;
    }else{
        //ball right
        ballEdgeX=vBall.x + vBall.r;   
    }

    iRow = Math.floor(ballEdgeY / iRowH);
    iCol = Math.floor(ballEdgeX / (oBricks.w + oBricks.p));

    // mark brick as broken (empty) and reverse brick
    if ( ballEdgeY < oBricks.r * iRowH && iRow >= 0 && iCol >= 0 && oBricks.objs[iRow][iCol].exist == 1) {
        oBricks.objs[iRow][iCol].exist = 0;
        vBall.dy = -vBall.dy;
        iPoints++;
        aSounds[0].play(); // play sound
        brickNum--;
    }

    // reverse X position of ball
    if (vBall.x + vBall.dx + vBall.r > ctx.canvas.width || vBall.x + vBall.dx - vBall.r < 0) {
        vBall.dx = -vBall.dx;
    }

    if (vBall.y + vBall.dy - vBall.r < 0) {
        vBall.dy = -vBall.dy;
    } else if (vBall.y + vBall.dy + vBall.r > ctx.canvas.height - oPadd.h) {

        if (vBall.x > oPadd.x && vBall.x < oPadd.x + oPadd.w) {
            vBall.dx = 10 * ((vBall.x - (oPadd.x + oPadd.w / 2)) / oPadd.w);
            vBall.dy = -vBall.dy;

            aSounds[2].play(); // play sound
        }
        else if (vBall.y + vBall.dy + vBall.r > ctx.canvas.height) {  //撞到最下面

            if (ballArray.length == 1) {


                // HTML5 Local storage - save values
                localStorage.setItem('last-time', iMin + ':' + iSec);
                localStorage.setItem('last-points', iPoints);

                showGameOver();
            } else {

            }
            aSounds[1].play(); // play sound
            ballArray.splice(ballIndex, 1);
            ballDead = true;
        }
    }

    if (!ballDead) {
        vBall.x += vBall.dx;
        vBall.y += vBall.dy;
    }
}


// initialization
$(function() {

    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    scoreCanvas = document.getElementById('score_canvas');
    scoreCtx = scoreCanvas.getContext('2d');
    

    var width = canvas.width;
    var height = canvas.height;



    //oBall = new Ball(width / 2, 550, 0.5, -5, 10); // new ball object

    var padImg = new Image();
    padImg.src = 'images/padd.png';
    padImg.onload = function() {
    };
    oPadd = new Padd(width / 2 - barWidth/2, barWidth, barHeight, padImg); // new padd object





    aSounds[0] = new Audio('media/snd1.wav');
    aSounds[0].volume = 0.9;
    aSounds[1] = new Audio('media/snd2.wav');
    aSounds[1].volume = 0.9;
    aSounds[2] = new Audio('media/snd3.wav');
    aSounds[2].volume = 0.9;

    $("#startButton").click(function(){
        $("#scene").css("backgroundImage","url(css/padbg.jpg)");
        document.getElementById("mp3").pause();
        startGame();
    });


    //iStart = setInterval(drawScene, 10); // loop drawScene
    //iGameTimer = setInterval(countTimer, 1000); // inner game timer

    // HTML5 Local storage - get values
    sLastTime = localStorage.getItem('last-time');
    sLastPoints = localStorage.getItem('last-points');

    $(window).keydown(function(event) { // keyboard-down alerts
        console.log(event.keyCode);
        switch (event.keyCode) {
            case 37: // 'Left' key
                bLeftBut = true;
                break;
            case 39: // 'Right' key
                bRightBut = true;
                break;
        }
    });
    $(window).keyup(function(event) { // keyboard-up alerts
        switch (event.keyCode) {
            case 13:
                window.history.go(0);
                break;
            case 37: // 'Left' key
                bLeftBut = false;
                break;
            case 39: // 'Right' key
                bRightBut = false;
                break;
        }
    });

    var iCanvX1 = $(canvas).offset().left;
    var iCanvX2 = iCanvX1 + width;
    $('#scene').mousemove(function(e) { // binding mousemove event
        if (e.pageX > iCanvX1 && e.pageX < iCanvX2) {
            oPadd.x = Math.max(e.pageX - iCanvX1 - (oPadd.w / 2), 0);
            oPadd.x = Math.min(ctx.canvas.width - oPadd.w, oPadd.x);
        }
    });

    $(this).scrollTop(80);


    StartVoiceRec();

});

function startGame(){
    
    if(canStart){
        console.log("start");
        //clear array
        ballArray=[];

        createBall();
        createBall();
        createBall();
        createBall();
        createBall();

        //width, height, rows, cols, gap
        initialBricks(78, 78, 6, 10, 2);



        iStart = setInterval(drawScene, 10); // loop drawScene
        iGameTimer = setInterval(countTimer, 1000); // inner game timer
        canStart=false;
    }
}

function initialBricks(width, height, rows, cols, gap) {
    //oBricks = new Bricks((width / 8) - 1, 20, 6, 8, 2); // new bricks object
    oBricks = new Bricks(width, height, rows, cols, gap); // new bricks object
    brickNum=0;
    oBricks.objs = new Array(oBricks.r); // fill-in bricks
    for (i = 0; i < oBricks.r; i++) {
        oBricks.objs[i] = new Array(oBricks.c);
        for (j = 0; j < oBricks.c; j++) {
            oBricks.objs[i][j] = new brick(1, Math.floor((Math.random() * oBricks.iconNum) + 1));
            brickNum++;
        }
    }
}

function countTimer() {
    iElapsed++;
}

//create ball
function createBall(){
    var width = canvas.width;
    
    var dx=(Math.random()*2)-1;
    //dx/=3;
    var ballImg = new Image();
    ballImg.src = 'css/apple-icon.png';

    //ball(x, y, dx, dy, r)
    ballArray.push(new Ball(oPadd.x+(barWidth/2), canvas.height-(barHeight*2), dx, -1, 20, ballImg)); // new ball object)

}


//show ball info
function showBall(){
    for (var i = 0; i < ballArray.length; i++) {
        console.log(ballArray[i].name);
    
    }
}