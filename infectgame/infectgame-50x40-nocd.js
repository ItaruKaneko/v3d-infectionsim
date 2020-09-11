// プログラム全体で使用する変数
var c1;        // ゲームボード描画コンテキスト
var c2;        // グラフ描画コンテキスト
var copygame_agents;     // 全 copygame_agent を格納する配列
var number_of_creators; // copygame_agent の数
var number_of_pirates; // pirates の数
var gb;        // game bord, sixze 600
var tick_count1;      // tick count 1

var x_num = 50;
var y_num = 40;
var all_num = x_num * y_num * 4;
var number_iga = all_num;    // number of infection game agents
var x_rr = new Array(x_num);
var y_rr = new Array(y_num);
var z_rr = new Array(4);

// infectgame agents 0.0
// Previous version
//    copygame04_04
//     2019/11/21
// x=20 x y=y_num x z=4 の3次元格子
// x は職場、yはグループ, z は家庭を表す
// 再生産率は x, y, z 配列に
// 

// class definition : game_cell
// ゲームのます目の定義
function game_cell(n1,x1,y1,z1,x_rr1,y_rr1,z_rr1,st1,cd1,gb1) {
  this.n=n1; // cell number
  this.x=x1; // x coordinate 0..19 represents work place
  this.y=y1; // y coordinate 0..19 represents social group
  this.z=z1; // z coordinate 0..3  represents family members
  this.x_rr=x_rr1; // reproduction rate for x coordinate 
  this.y_rr=y_rr1; // reproduction rate for y coordinate 
  this.z_rr=z_rr1; // reproduction rate for x coordinate 
  this.st = st1; // status = 0
  this.cd = cd1; // contact detecter installed
  this.gb = gb1;  // game board itself
  this.ci = 0+0 // capable to infect
}

game_cell.prototype.isinfected=function(){
  if (this.st==0) {return(0);}
  else if (this.st < 12) {return(1); }
  return(0);

}
game_cell.prototype.show=function(){
   // rect を描画
    // y 座標を整数に変換してから描画する    
    var x1,y1;
    x1 = Math.floor(this.x);
    y1 = Math.floor(this.y);
    z1 = Math.floor(this.z);
    c1.beginPath();
    c1.shadowColor = 'rgb(0,0,0)';   // 影
    c1.shadowOffsetX = 0;
    c1.shadowOffsetY = 0;
    c1.shadowBlur = 0;

    if(this.st==0){
      c1.fillStyle = 'rgb(0,255,255)'; // 水色 = 健康
    } else if (this.st < 5) {
      c1.fillStyle = 'rgb(128,128,128)'; // 灰 = 潜伏
    } else if (this.st < 9) {
      c1.fillStyle = 'rgb(255,128,128)'; // ピンク = 感染可能
    } else if (this.st < 12) {
      c1.fillStyle = 'rgb(255,0,0)'; // 赤 = 発症
    } else {
      c1.fillStyle = 'rgb(128,255,128)'; // 緑 = 回復
    }
    voff=y_num * 12 + 10;
    x2 = x1 * 8 + 6 - z1 * 2 + 10;
    y2 = y1 * 12;
    z2 = 9-z1 * 2;

    c1.moveTo(x2,voff-z2 - y2);
    c1.lineTo(x2+4,voff-z2 - y2);
    c1.lineTo(x2+4,voff-z2-4 - y2);
    c1.lineTo(x2,voff-z2-4 - y2);
    c1.lineTo(x2,voff-z2 - y2);
    c1.closePath();
    c1.fill();
}

game_cell.prototype.pick_xyz=function(x1,y1,z1) {
  var gb1=this.gb[(z1 * y_num + y1) * x_num + x1];
  return(gb1);
}

game_cell.prototype.meet=function(gb1) {
  ci1 = gb1.ci;
  if (gb1.ci>0) {
    if (this.cd>0 && gb1.cd>0) {
      // both has contact detector
      this.cd = 2; // contact detected so far the person will be isolated
        // and does not infect to others
      this.ci = 0;
      // so far the person is infected but will not infect others
      this.st = 1;
    }
    else {
      // contact is not detected and person may infect others
      this.st = 1;
      this.ci = 1;
    }
  }
}

game_cell.prototype.day=function(){
  if (this.st == 0) {  // not infected
    // 感染していないエージェント
    var x1 = this.x; // x community index
    var y1 = this.y; // y family index
    var z1 = this.z;
    // meet some one else in different x
    r1 = Math.random();                   // infection ratio
    for(var r2=0; r2<y_num; r2++) {
    //r2 = Math.floor(Math.random() * 20);  // other person to meet
      if (r1 < this.x_rr[this.x]) {
        this.meet(this.pick_xyz(x1,r2,z1));
      }
    }
    // meet some one else in different y
    r1 = Math.random();                   // infection ratio
    for(var r2=0; r2<x_num; r2++) {
    //r2 = Math.floor(Math.random() * 20);  // other person to meet
      if (r1 < this.y_rr[this.y]) {
        this.meet(this.pick_xyz(r2,y1,z1));
      }
    }
    // meet some one else in different z
    r1 = Math.random();                   // infection ratio
    for(var r2=0; r2<4; r2++) {
    // r2 = Math.floor(Math.random() * 4);  // other person to meet
      if (r1 < this.z_rr[this.z]) {
        this.meet(this.pick_xyz(x1,y1,r2));
      }
    }
  }
  else {
    // 感染しているエージェント
    // st 1..4 hiding 非発症
    // st 8..9 symptic 発症中/未検出
    // st 10 detectable 発症中/検出可能
    // st = 12 recovered 回復(感染しない)
    if (this.st <5 ) { // Hiding
      // 非発症
    }
    else if (this.st <12 ) { // infectable
      // st=5..11 発症中, 検出可能
      this.ci = 1;
    }
    else if (this.st == 12) { // end of infetable
      this.ci = 0;
    }
    if (this.st < 12) {
      this.st = this.st + 1
    }
  }
   // rect を描画
    // y 座標を整数に変換してから描画する    

}

// not used
game_cell.prototype.infect=function() {
  // このゲームセルのコンテンツを使う
  this.st = 1;
}



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
  c2.rect(x1 + 40,390-esum - 1, 2,2);
  c2.fillStyle = 'rgb(0,64,64)'; // 紺色
  c2.fill();
}

function plot_axis(){
  c2.beginPath();
  c2.fillStyle = 'rgb(0,0,0)'; // 紺色
  c2.rect(40,10,360,380);
  c2.stroke();
  var n;
  for (n=0; n<361; n+=20) {
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 紺色
    c2.rect(n*2+40,386,1,4);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    c2.fillText(n.toString(10),n+35,402);
  }
  for (n=0; n<360; n+=20) {
    // 左側の目盛
    c2.beginPath();
    c2.fillStyle = 'rgb(0,0,0)'; // 黒
    c2.rect(40,390-n*2,4,1);
    c2.fill();
    c2.font = "10px 'ＭＳ Ｐゴシック'";
    c2.strokeStyle = "blue";
    c2.fillText(n.toString(10),20,390 - n);
  }
  //c2.filltext("tick",210,220)
}

// copygame_agent クラスを使ったアニメーションの本体
// 毎秒 30 回実行する関数
function tick1() {
  // 359 回目で終了
  if (tick_count1 > 358) {return; }
  tick_count1=tick_count1+1;
  // 描画領域をいったんクリアする
  c1.clearRect(0, 0, 600, 600);

  // 全エージェント(all_num個)についての処理ループ
  var n;
  for (n = 0; n < all_num; n++){
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
  gb = new Array(all_num);
  for (var x1=0; x1<5; x1++) { x_rr[x1]=1.3/x_num/8; } // 10 % of group
  for (var y1=0; y1<4; y1++) { y_rr[y1]=1.0/y_num/8; } // 10 % of group
  for (var x1=5; x1<x_num; x1++) { x_rr[x1]=0.3/x_num/8; } // 90 % of group
  for (var y1=4; y1<y_num; y1++) { y_rr[y1]=0.3/y_num/8; } // 90 % of group
  for (var z1=0; z1<4; z1++) { z_rr[z1]=0.6/4/8; }
  // game bord のクリア
  var n1=0;
  for (var z1=0; z1<4; z1++) {
    for (var y1=0; y1<y_num; y1++) {
      for (var x1=0; x1<x_num; x1++) {
        cd1 = 0; // nocd
        //var cd1 = Math.floor(1 + Math.random() - 0.3); // contact detector 70%
        //if (x1<5) { cd1 = 0;}
        //if (y1<4) { cd1 = 0;}
        gb[n1]=new game_cell(n1,x1,y1,z1,x_rr,y_rr,z_rr,0,cd1,gb);
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