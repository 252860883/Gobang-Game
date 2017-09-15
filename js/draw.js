


define(['script'],function (script) {

    var chessCanvas = document.getElementById("chess");
    var bgContext = chessCanvas.getContext("2d");//绘制背景和网格线
    var scoreCanvas=document.getElementById("scoreCanvas");
    var scoreContext=scoreCanvas.getContext("2d");//绘制记分栏
    var ballCanvas=document.getElementById('chessBall');
    var ballContext = ballCanvas.getContext("2d");//绘制小球的区域

    //绘制记分栏
    function drawScore(a,b){
        var gradient2=scoreContext.createLinearGradient(0,30,600,30)
        gradient2.addColorStop(0.5,"#eee");
        gradient2.addColorStop(0.51,"#000");
        gradient2.addColorStop(0.49,"#000");
        gradient2.addColorStop(0,"#444");
        gradient2.addColorStop(1,"#444");

        scoreContext.clearRect(0,0,600,60);
        scoreContext.beginPath();
        scoreContext.fillStyle=gradient2;
        scoreContext.fillRect(0+b*60,0,600-a*60-b*60,60);
        scoreContext.closePath();
    }

    //绘制棋盘背景
    function drawBackground() {


        bgContext.drawImage(script.back, 0, 0, 800, 800);
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

    //下棋子时触发绘制棋子函数

    function onballDraw(i, j, isUser) {

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

    return{
        drawScore:drawScore,
        drawBackground:drawBackground,
        onballDraw:onballDraw,
        ballCanvas:ballCanvas,
        ballContext:ballContext,
        scoreCnavas:scoreCanvas,
        scoreContext:scoreContext
    }

});
