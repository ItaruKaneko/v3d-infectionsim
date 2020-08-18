// プログラム全体で使用する変数
var c1;        // ゲームボード描画コンテキスト
var c2;        // グラフ描画コンテキスト
var copygame_agents;     // 全 copygame_agent を格納する配列
var number_iga = 1600;    // number of infection game agents
var number_of_creators; // copygame_agent の数
var number_of_pirates; // pirates の数
var gb;        // game bord, sixze 600
var tick_count1;      // tick count 1
var x_rr = new Array(20);
var y_rr = new Array(20);
var z_rr = new Array(4);



// 現状をplotする

function plot_status(){
  var x1 = Math.floor(tick_count1+1);
  if (x1>599) x1=599;
  esum=0; // 全体のエネルギー
  ncnt=0; // 全体の生きているエージェントの数
  aena=0; // 著作者のエネルギー
  var n;
  for (n = 0; n < number_iga; n++) {
    if (gb[n].isinfected()) {
      esum=esum + 1;
    }
  }
  c2.beginPath();
  c2.rect(x1*2 + 40,390-esum*2 - 1, 2,2);
  c2.fillStyle = 'rgb(0,64,64)'; // 紺色
  c2.fill();
}

function plot_axis(){
  c2.beginPath();
  c2.fillStyle = 'rgb(0,0,0)'; // 紺色
  c2.rect(40,10,360,380);
  c2.stroke();
  var n;
  for (n=0; n<190; n+=20) {
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 紺色
    c2.rect(n*2+40,386,1,4);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    c2.fillText(n.toString(10),n*2+35,402);
  }
  for (n=0; n<190; n+=20) {
    // 左側の目盛
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 黒
    c2.rect(40,390-n*2,4,1);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    c2.fillText(n.toString(10),20,390 - n*2);
  }
  //c2.filltext("tick",210,220)
}

// copygame_agent クラスを使ったアニメーションの本体
// 毎秒 30 回実行する関数
function tick1() {
  if (tick_count1 > 180) {return; }
  tick_count1=tick_count1+1;
  // 描画領域をいったんクリアする
  c1.clearRect(0, 0, 600, 600);

  // 20個の円についてのループ
  var n;
  for (n = 0; n < 1600; n++){
    gb[n].day();
    gb[n].show();
  }
  plot_status();
}

// 初期化
function draw_canvas() {
  // c1 = 2d コンテキスト、を用意する
  var canv1 = document.getElementById('canvas_tag_1');
  c1 = canv1.getContext('2d');
  if (!canv1 || !canv1.getContext) {
      return false;
  }
  var canv2 = document.getElementById('canvas_tag_2');
  c2 = canv2.getContext('2d');
  if (!canv2 || !canv2.getContext) {
      return false;
  }
  tick_count1=0; // tick count をゼロリセット
  // initializatio of the board
  gb = new Array(1600);
  for (var x1=0; x1<20; x1++) { x_rr[x1]=1.0/35.0; }
  for (var y1=0; y1<20; y1++) { y_rr[y1]=1.0/35.0; }
  for (var z1=0; z1<4; z1++) { z_rr[z1]=0.2; }
  // game bord のクリア
  var n1=0;
  for (var z1=0; z1<4; z1++) {
    for (var y1=0; y1<20; y1++) {
      for (var x1=0; x1<20; x1++) {
         gb[n1]=new game_cell(n1,x1,y1,z1,x_rr,y_rr,z_rr,0,gb);
         n1++;
       }
    }
  }
  for (n = 0; n < 20; n++){
      var n1 = n * 21 + 400 * (n % 4);
      gb[n1].infect()
  }
  
  // tick1 を毎秒 30 回実行するための設定
  plot_axis();
  setInterval(tick1, 100);
}