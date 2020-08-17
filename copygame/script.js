// プログラム全体で使用する変数
var c1;        // ゲームボード描画コンテキスト
var c2;        // グラフ描画コンテキスト
var copygame_agents;     // 全 copygame_agent を格納する配列
var number_of_copygame_agents; // copygame_agent の数
var number_of_creators; // copygame_agent の数
var number_of_pirates; // pirates の数
var gb;        // game bord, sixze 600
var tick_count1;      // tick count 1



// 現状をplotする

function plot_status(){
  var x1 = Math.floor(tick_count1+1);
  if (x1>599) x1=599;
  esum=0; // 全体のエネルギー
  ncnt=0; // 全体の生きているエージェントの数
  aena=0; // 著作者のエネルギー
  var n;
  for (n = 0; n < number_of_copygame_agents; n++) {
    esum=esum + copygame_agents[n].ep;
    if (copygame_agents[n].ep > 0 && copygame_agents[n].type==1) {
      ncnt=ncnt + 1;
      aena=aena + copygame_agents[n].ep;
    }
  }
  c2.beginPath();
  c2.rect(x1 + 40,390-esum, 1,1);
  c2.fillStyle = 'rgb(0,64,64)'; // 紺色
  c2.fill();
  c2.beginPath();
  c2.rect(x1 + 40,390-ncnt*4, 1,1);
  c2.fillStyle = 'rgb(128,0,64)'; // 紺色
  c2.fill();
  c2.beginPath();
  c2.rect(x1 + 40,390-aena, 1,1);
  c2.fillStyle = 'rgb(0,128,64)'; // 紺色
  c2.fill();
}

function plot_axis(){
  c2.beginPath();
  c2.fillStyle = 'rgb(0,0,0)'; // 紺色
  c2.rect(40,10,540,380);
  c2.stroke();
  var n;
  for (n=0; n<540; n+=50) {
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 紺色
    c2.rect(n+40,386,1,4);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    c2.fillText(n.toString(10),n+35,402);
  }
  for (n=0; n<380; n+=20) {
    // 左側の目盛
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 黒
    c2.rect(40,390-n,4,1);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    c2.fillText(n.toString(10),20,390 - n);
    // 右側の目盛
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 黒
    c2.rect(576,390-n,4,1);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    var n1 = n / 4;
    c2.fillText(n1.toString(10),585,390 - n);
  }
  //c2.filltext("tick",210,220)
}

// copygame_agent クラスを使ったアニメーションの本体
// 毎秒 30 回実行する関数
function tick1() {
  tick_count1=tick_count1+1;
  // 描画領域をいったんクリアする
  c1.clearRect(0, 0, 600, 600);

  // 20個の円についてのループ
  var n;
  for (n = 0; n < 900; n++){
    gb[n].show();
  }
  //game_title();
  for (n = 0; n < number_of_copygame_agents; n++) {
    // copygame_agent を移動し、描画する
    copygame_agents[n].progress();
    copygame_agents[n].move();
    copygame_agents[n].show();
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
  gb = new Array(90000);
  // game bord のクリア
  var n1=0;
  for (var y1=0; y1<30; y1++) {
    for (var x1=0; x1<30; x1++) {
      gb[n1]=new game_cell(n1,x1,y1);
      n1++;
    }
  }
  // copygame_agent数の設定
  number_of_copygame_agents = 50;
  number_of_pirates = 20;
  number_of_creators = 10;

  // 全copygame_agentを格納する配列の準備
  copygame_agents = new Array(number_of_copygame_agents);  
  // 全copygame_agentの初期化
  for (var n = 0; n < number_of_copygame_agents; n++) {
    if(n < number_of_creators) {
    copygame_agents[n]=new copygame_agent(n,gb,1);
    }
    else if (n < number_of_creators + number_of_pirates ) {
      copygame_agents[n]=new copygame_agent(n,gb,3);
    }
    else {
      copygame_agents[n]=new copygame_agent(n,gb,2);
    }
  }
  
  // tick1 を毎秒 30 回実行するための設定
  plot_axis();
  setInterval(tick1, 100);
}