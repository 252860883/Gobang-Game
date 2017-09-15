
var setbox = [];//存储已经落点的棋子
var wins = [];//所有赢法的数组
var myWin = [];//我可能赢的数组
var computerWin = [];//电脑赢的数组
var count = 0;

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

define(function () {
    return{
    setbox :setbox,
    wins :wins,
    myWin :myWin,
    computerWin :computerWin,
    count :count
    }
});
