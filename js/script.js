var me = true;
var setbox = [];//存储已经落点的棋子
var wins = [];//所有赢法的数组
var myWin = [];//我可能赢的数组
var computerWin = [];//电脑赢的数组
var isOver = false;
var userScore=0;//统计玩家的分数
var computerScore=0;
var u_pre=0,v_pre=0;
var count = 0;

var prompt=document.getElementById("promptShow");
var promptRounds=document.getElementById("promptRounds");
var promptClick=document.getElementById("promptClick");

var onMusic=document.getElementById('chessMusic');
var failMusic=document.getElementById('failMusic');
var winMusic=document.getElementById('winMusic');


//页面加载时绘制背景

window.onload = function() {
    drawBackground();
    drawScore();
};

//统计赢法数组

for(var i = 0; i <= 14; i++) {
    wins[i] = [];
    for(var j = 0; j <= 14; j++) {
        wins[i][j] = [];
    }
}

//横线方向的赢法
for(var i = 0; i < 15; i++) {
    for(var j = 0; j < 11; j++) {
        for(var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}
//竖线方向的赢法
for(var i = 0; i < 15; i++) {
    for(var j = 0; j < 11; j++) {
        for(var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}
//斜线方向的赢法
for(var i = 0; i < 11; i++) {
    for(var j = 0; j < 11; j++) {
        for(var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}
//反斜线方向的赢法
for(var i = 0; i < 11; i++) {
    for(var j = 14; j > 3; j--) {
        for(var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

//初始化棋盘盒子,存储已经下落的棋子

for(var i = 0; i <= 14; i++) {
    setbox[i] = [];
    for(var j = 0; j <= 14; j++) {
        setbox[i][j] = 0;
    }
}

//初始化赢法统计数组

for(var i = 0; i < count; i++) {
	myWin[i] = 0;
    computerWin[i] = 0;
}

//建立画布

var chessCanvas = document.getElementById("chess");
var ballCanvas=document.getElementById('chessBall');
var bgContext = chessCanvas.getContext("2d");//绘制背景和网格线
var ballContext = ballCanvas.getContext("2d");//绘制小球的区域

var scoreCanvas=document.getElementById("scoreCanvas");
var scoreContext=scoreCanvas.getContext("2d");

//绘制记分栏

function drawScore(){
    var gradient2=scoreContext.createLinearGradient(0,30,600,30)
    gradient2.addColorStop(0.5,"#eee");
    gradient2.addColorStop(0.51,"#000");
    gradient2.addColorStop(0.49,"#000");
    gradient2.addColorStop(0,"#444");
    gradient2.addColorStop(1,"#444");

    scoreContext.clearRect(0,0,600,60);
    scoreContext.beginPath();
    scoreContext.fillStyle=gradient2;
    scoreContext.fillRect(0+computerScore*60,0,600-userScore*60-computerScore*60,60);
    scoreContext.closePath();
}

//绘制棋盘背景

function drawBackground() {
    var logo = new Image();
    logo.src = "img/14.jpg";
	logo.onload = function() {
		bgContext.drawImage(logo, 0, 0, 800, 800);
        //绘制网格线
		for(var i = 0; i < 15; i++) {
			//画横线
			bgContext.strokeStyle = "#560e00";
			bgContext.moveTo(50, 50+ i * 50);
			bgContext.lineTo(750, 50 + i * 50);
			bgContext.stroke();
			//画竖线
			bgContext.moveTo(50 + i * 50, 50);
			bgContext.lineTo(50 + i * 50, 750);
			bgContext.stroke();
		}
	}
}


//用戶點擊事件
ballCanvas.onclick = function(e) {

	if(!me) {
        alert("请等待对方下棋！");
		return;
	}

    //动态获取rem响应式布局当前html的font-size大小，因为画布的实际像素尺寸变化时，获取的实际点击坐标也应当按比例变化

    var findHtml=document.getElementsByTagName("html")[0];
    var findhtmlAttr=window.getComputedStyle(findHtml, null);//动态获取html属性
    var findhtmlSize=findhtmlAttr.fontSize.substring(0,2);//去掉属性后面的单位，只保留数值
    var remScale1="0.";
    var remScale=remScale1.concat(findhtmlSize);

    var x = e.offsetX/Number(remScale);
	var y = e.offsetY/Number(remScale)

	var ti=x%50;
	var tj=y%50;
	/*console.log("ti:"+x+" tj:"+y);*/

    //防误差点击设置点击范围

	if(ti<=25&&tj<=25){
		var i = Math.floor(x / 50)-1;
		var j = Math.floor(y / 50)-1;
		/*console.log("1"+"x:"+x+" y:"+y+" i:"+i+" j:"+j);*/
	}
	if(ti>=25&&tj>=25){
		var i = Math.floor(x / 50);
		var j = Math.floor(y / 50);
		//console.log("2"+"x:"+x+" y:"+y+" i:"+i+" j:"+j);
	}
	if(ti<=25&&tj>=25){
		var i = Math.floor(x / 50)-1;
		var j = Math.floor(y / 50);
		/*console.log("3"+"x:"+x+" y:"+y+" i:"+i+" j:"+j);*/
	}
	if(ti>=25&&tj<=25){
		var i = Math.floor(x / 50);
		var j = Math.floor(y / 50)-1;
		/*console.log("4"+"x:"+x+" y:"+y+" i:"+i+" j:"+j);*/
	}

	if(setbox[i][j] == 0) {
		onballDrew(i, j, me);
		setbox[i][j] = 1;

		for(var k = 0; k < count; k++) {
			if(wins[i][j][k]) {
				myWin[k]++;
                computerWin[k] = 6;//此位置电脑已经没有成功可能，设置值6

				//当用户连成五颗子，判胜

                if(myWin[k] == 5) {
					isOver = true;
					userScore++;
					drawScore();
                    setTimeout(function() {GameOver();}, 1000);
                    if(userScore>=6){
						GameoverAll(true);
					}
				}
			}
		}
		
		if(!isOver) {
			me = false;
			setTimeout(function() {
				computerAI();
			}, Math.random() * 500);
		}
	}
  
};

//电脑下棋判断

function computerAI() {

	var myScore = [];
	var yourScore = [];
	var max = 0;
	var u = 0, v = 0;
	for(var i = 0; i < 15; i++) {
		myScore[i] = [];
		yourScore[i] = [];
		for(var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			yourScore[i][j] = 0;
		}
	}
	for(var i = 0; i < 15; i++) {
		for(var j = 0; j < 15; j++) {
			if(setbox[i][j] == 0) {
				for(var k = 0; k < count; k++) {
					if(wins[i][j][k]) {
						if(myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if(myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if(myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if(myWin[k] == 4) {
							myScore[i][j] += 10000;
						}

						if(computerWin[k] == 1) {
							yourScore[i][j] += 220;
						} else if(computerWin[k] == 2) {
							yourScore[i][j] += 420;
						} else if(computerWin[k] == 3) {
							yourScore[i][j] += 2100;
						} else if(computerWin[k] == 4) {
							yourScore[i][j] += 110000;
						}
					}
				}
				if(myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if(myScore[i][j] == max) {
					if(yourScore[i][j] > yourScore[u][v]) {
						u = i;
						v = j;
					}
				}
				if(yourScore[i][j] > max) {
					max = yourScore[i][j];
					u = i;
					v = j;
				} else if(yourScore[i][j] == max) {
					if(myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	onballDrew(u, v, false);
	
	setbox[u][v] = 2;
	for(var k = 0; k < count; k++) {
		if(wins[u][v][k]) {
            computerWin[k]++;
			myWin[k] = 6;
			if(computerWin[k] == 5) {
                computerScore++;
				setTimeout(function() {
					GameOver();
					me = true;
				}, 2000);
				isOver = true;
				drawScore();
				if(computerScore>=6){
					GameoverAll(false);
				}
			}
		}
	}
	if(!isOver) {
		me = !me;
	}
};

//下棋子时触发绘制棋子函数

function onballDrew(i, j, isUser) {

    //触发音效
    onMusic.play();

    //绘制小球

    if(isUser) {
        var gradient1 = ballContext.createRadialGradient(50 + i * 50 - 4, 50 + j * 50 - 4, 12, 50 + i * 50, 50 + j * 50, 2);
        gradient1.addColorStop(0, "#000");
        gradient1.addColorStop(1, "#666");

    } else {

        if(u_pre!=0){
            ballContext.clearRect(u_pre*50+50-21,v_pre*50+50-21,48,48);
            var gradient2 = ballContext.createRadialGradient(50 + u_pre * 50 - 4, 50 + v_pre * 50 - 4, 12, 50 + u_pre * 50, 50 + v_pre * 50, 2);
            gradient2.addColorStop(0, "#aaa");
            gradient2.addColorStop(1, "#ddd");

            ballContext.beginPath();
            ballContext.arc(50 + u_pre * 50, 50 + v_pre * 50, 21, 0, 2 * Math.PI);
            ballContext.closePath();
            ballContext.fillStyle=gradient2;
            ballContext.fill();
        }

        var gradient3 = ballContext.createRadialGradient(50 + i * 50 - 4, 50 + j * 50 - 4, 12, 50 + i * 50, 50 + j * 50, 2);
        gradient3.addColorStop(0, "#8B0000");
        gradient3.addColorStop(1, "#CD3700");

        ballContext.beginPath();
        ballContext.arc(50 + i * 50, 50 + j * 50, 21, 0, 2 * Math.PI);
        ballContext.closePath();
        ballContext.fillStyle = gradient3;
        ballContext.fill();

        u_pre=i;
        v_pre=j;
    }

    ballContext.beginPath();
    ballContext.arc(50 + i * 50, 50 + j * 50, 20, 0, 2 * Math.PI);
    ballContext.closePath();
    ballContext.fillStyle = gradient1;
    ballContext.fill();
}

function  GameOver(){
    ballContext.clearRect(0, 0, 800, 800);
    isOver=false;
    promptShow();
    u_pre=0;v_pre=0;
    for(var i = 0; i <= 14; i++) {
        setbox[i] = [];
        for(var j = 0; j <= 14; j++) {
            setbox[i][j] = 0;
        }
    }
    for(var i = 0; i < count; i++) {
        myWin[i] = 0;
        computerWin[i] = 0;
    }
}

function promptShow(){
    if(computerScore>5||userScore>5){
        return;
    }
    //设置每局完成时的显示
    var gameRound=userScore+computerScore+1;
    promptRounds.innerHTML="ROUND"+gameRound;
    prompt.style.display="table";
    setTimeout(function(){
        prompt.style.display="none";
    },1900);
}

function GameoverAll(win){
    prompt.style.display="block";
    promptClick.style.display="block";
    promptClick.onclick=function(){
        prompt.style.display="none";
        promptClick.style.display='none';
        GameOver();
        userScore=0;
        computerScore=0;
    };
    if(win){
        promptRounds.innerHTML="你竟然击败了电脑";
        winMusic.play();
    }else{
        promptRounds.innerHTML = "你被电脑击败了";
        failMusic.play();
    }
    //重绘分值栏
	scoreContext.beginPath();
	scoreContext.fillRect(0,0,600,60);
	scoreContext.closePath();
}



