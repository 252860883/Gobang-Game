var me = true;
var isOver = false;
var userScore = 0;//统计玩家的分数
var computerScore = 0;
var u_pre = 0, v_pre = 0;
var count = 0;

var prompt = document.getElementById("promptShow");
var promptRounds = document.getElementById("promptRounds");
var promptClick = document.getElementById("promptClick");

var onMusic = document.getElementById('chessMusic');
var failMusic = document.getElementById('failMusic');
var winMusic = document.getElementById('winMusic');

require(['win', 'draw'], function (win, draw) {
    var setbox = win.setbox;
    var wins = win.wins;
    var myWin = win.myWin;
    var computerWin = win.computerWin;
    count = win.count;

    window.onload = function () {
        draw.drawBackground();
        draw.drawScore(userScore, computerScore);
    };

    //用戶點擊事件
    draw.ballCanvas.onclick = function (e) {

        if (!me) {
            alert("请等待对方下棋！");
            return;
        }

        //动态获取rem响应式布局当前html的font-size大小，
        // 因为画布的实际像素尺寸变化
        // 获取的实际点击坐标也应当按比例变化

        var findHtml = document.getElementsByTagName("html")[0];
        var findhtmlAttr = window.getComputedStyle(findHtml, null);//动态获取html属性
        var findhtmlSize = findhtmlAttr.fontSize.substring(0, 2);//去掉属性后面的单位，只保留数值
        var remScale1 = "0.";
        var remScale = remScale1.concat(findhtmlSize);

        var x = e.offsetX / Number(remScale);
        var y = e.offsetY / Number(remScale);

        var ti = x % 50;
        var tj = y % 50;
        /*console.log("ti:"+x+" tj:"+y);*/

        //防误差点击设置点击范围

        if (ti <= 25 && tj <= 25) {
            var i = Math.floor(x / 50) - 1;
            var j = Math.floor(y / 50) - 1;
            /*console.log("1"+"x:"+x+" y:"+y+" i:"+i+" j:"+j);*/
        }
        if (ti >= 25 && tj >= 25) {
            var i = Math.floor(x / 50);
            var j = Math.floor(y / 50);
            //console.log("2"+"x:"+x+" y:"+y+" i:"+i+" j:"+j);
        }
        if (ti <= 25 && tj >= 25) {
            var i = Math.floor(x / 50) - 1;
            var j = Math.floor(y / 50);
            /*console.log("3"+"x:"+x+" y:"+y+" i:"+i+" j:"+j);*/
        }
        if (ti >= 25 && tj <= 25) {
            var i = Math.floor(x / 50);
            var j = Math.floor(y / 50) - 1;
            /*console.log("4"+"x:"+x+" y:"+y+" i:"+i+" j:"+j);*/
        }

        if (setbox[i][j] == 0) {
            draw.onballDraw(i, j, me);
            setbox[i][j] = 1;

            for (var k = 0; k < count; k++) {
                if (wins[i][j][k]) {
                    myWin[k]++;
                    computerWin[k] = 6;//此位置电脑已经没有成功可能，设置值6

                    //当用户连成五颗子，判胜

                    if (myWin[k] == 5) {
                        isOver = true;
                        userScore++;
                        draw.drawScore(userScore, computerScore);
                        if (userScore >= 5) {
                            GameoverAll(true);
                        }else {
                            setTimeout(function () {
                                GameOver(true);
                            }, 1000);
                        }
                    }
                }
            }
            //电脑下棋

            if (!isOver) {
                me = false;
                setTimeout(function () {
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
        for (var i = 0; i < 15; i++) {
            myScore[i] = [];
            yourScore[i] = [];
            for (var j = 0; j < 15; j++) {
                myScore[i][j] = 0;
                yourScore[i][j] = 0;
            }
        }

        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (setbox[i][j] == 0) {
                    for (var k = 0; k < count; k++) {
                        if (wins[i][j][k]) {
                            //防守
                            if (myWin[k] == 1) {
                                myScore[i][j] += 200;
                            } else if (myWin[k] == 2) {
                                myScore[i][j] += 400;
                            } else if (myWin[k] == 3) {
                                myScore[i][j] += 2000;
                            } else if (myWin[k] == 4) {
                                myScore[i][j] += 10000;
                            }
                            //攻击
                            if (computerWin[k] == 1) {
                                yourScore[i][j] += 220;
                            } else if (computerWin[k] == 2) {
                                yourScore[i][j] += 420;
                            } else if (computerWin[k] == 3) {
                                yourScore[i][j] += 2100;
                            } else if (computerWin[k] == 4) {
                                yourScore[i][j] += 21000;
                            }
                        }
                    }
                    if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        u = i;
                        v = j;
                    } else if (myScore[i][j] == max) {
                        if (yourScore[i][j] > yourScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                    if (yourScore[i][j] > max) {
                        max = yourScore[i][j];
                        u = i;
                        v = j;
                    } else if (yourScore[i][j] == max) {
                        if (myScore[i][j] > myScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }
        draw.onballDraw(u, v, false);

        setbox[u][v] = 1;

        for (var k = 0; k < count; k++) {
            if (wins[u][v][k]) {
                computerWin[k]++;
                myWin[k] = 6;
                if (computerWin[k] == 5) {
                    computerScore++;

                    isOver = true;
                    draw.drawScore(userScore, computerScore);

                    setTimeout(function () {
                        GameOver(false);
                        me = true;
                    }, 2000);
                }
            }
        }
        if (!isOver) {
            me = !me;
        }
    };


    function GameOver(win) {
        draw.ballContext.clearRect(0, 0, 800, 800);
        isOver = false;
        u_pre = 0;
        v_pre = 0;
        for (var i = 0; i <= 14; i++) {
            setbox[i] = [];
            for (var j = 0; j <= 14; j++) {
                setbox[i][j] = 0;
            }
        }
        for (var i = 0; i < count; i++) {
            myWin[i] = 0;
            computerWin[i] = 0;
        }

        //判断是否结束比赛
        if (computerScore >= 5 || userScore >= 5) {
            prompt.style.display = "block";
            setTimeout(function(){
                promptClick.style.display = "block";
            },2000);

            promptClick.onclick = function () {
                prompt.style.display = "none";
                promptClick.style.display = 'none';
                userScore = 0;
                computerScore = 0;
                draw.drawScore(0,0);
            };
            if (win) {
                promptRounds.innerHTML = "你竟然击败了电脑";
                winMusic.play();
            } else {
                promptRounds.innerHTML = "你被电脑击败了";
                failMusic.play();
            }

        }else{
            //设置每局完成时的显示
            var gameRound = userScore + computerScore + 1;
            promptRounds.innerHTML = "ROUND" + gameRound;
            prompt.style.display = "table";
            setTimeout(function () {
                prompt.style.display = "none";
            }, 1900);
        }
    }

});









