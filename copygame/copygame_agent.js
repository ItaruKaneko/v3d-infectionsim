// copygame04_04
// 2019/11/21
// 概要 概要 スペースの2D化(表示は3D 影付き)
// pirates は y>=150で活動。かつ creator はy方向の移動は少ないとする
// copygame_agentのクラスの定義
// 初期化
// gb 長さ90000の配列
//   30 x 30 の配列
//   use count を使用することに 1 増加する
//   5 回に達したら消去
// copygame02_01 ルール
// エージェントは2タイプ
//  type 1 creator
//    ep 初期値 = 4
//    1%の確率で行う。
//    エネルギーが 2 以上なら自分をauthorとして記録する
//    エネルギーは 1 減らす
//  type 2 consumer
//   Author が登録されている場合
//     author のエネルギーを +1 増加する
//     ジャンプする
//   マークされていない場合
//     自由運する
//  type 3 pirates
//     もしst=1ならインデックスを自分に書き換える
//     エネルギーは減らさない
//  game cell は 10 x 10 のエリア、30 x 30 マス
// 

// class definition : game_cell
// ゲームのます目の定義
function game_cell(n1,x1,y1) {
  this.n=n1; // cell number
  this.x=x1; // cell's x coordinate
 // this.y=0;  // cell's y coordinate
  this.y=y1;
  this.st = 0; // status = 0
  this.author = null;    // copy game agent marking here
  this.ucount = 0;  // use count
}

game_cell.prototype.show=function(){
   // rect を描画
    // y 座標を整数に変換してから描画する    
    var x1,y1;
    x1 = Math.floor(this.x);
    y1 = Math.floor(this.y);
    c1.beginPath();
    c1.shadowColor = 'rgb(0,0,0)';   // 影
    c1.shadowOffsetX = 0;
    c1.shadowOffsetY = 0;
    c1.shadowBlur = 0;

    h1 = this.st*5;
    if(this.st==1){
      c1.fillStyle = 'rgb(0,0,128)'; // 黄色
    } else if (this.st==2) {
      c1.fillStyle = 'rgb(255,128,128)'; // 赤
    } else{
      c1.fillStyle = 'rgb(128,255,255)'; // 水色
    }
//    c1.rect(x1*10,350-y1*10, 5,5);
    c1.moveTo(x1*10+y1*10,350-y1*10);
    c1.lineTo(x1*10+y1*10+5,350-y1*10);
    c1.lineTo(x1*10+y1*10+10,350-y1*10-5);
    c1.lineTo(x1*10+y1*10+5,350-y1*10-5);
    c1.lineTo(x1*10+y1*10,350-y1*10);
    c1.closePath();
    c1.fill();
}

game_cell.prototype.use=function(){
  // このゲームセルのコンテンツを使う
  author1 = this.author;
  author1.ep = author1.ep + 1;
  this.ucount = this.ucount + 1;
  if (this.ucount >=5) {
    this.author = null;
    this.st = 0;
    this.ucount=0;
  }
}

// (ix,iz)は (x.z)の整数値
// 初期化により x,vx はランダムに
// 10<x<580, -25<x<25
// y, vyは0に初期化

function copygame_agent(aid1,gb1,ty1) {
  this.aid=aid1;
  this.gb = gb1;    // game board
  this.type = ty1;    // agent type = 2
  this.x = Math.random() * 270 + 10;
  this.y = Math.random() * 270 + 10;
  this.z = 0;
  this.vx = Math.random() * 20 - 10;
  this.vy = Math.random() * 20 - 10;
  //if (ty1==1) { // author is in same raw 
  //  this.vy=0;
  //}
  this.vz = 0;
  this.ep = 4;  //  energy point = 0
  this.nn=Math.floor(this.y) * 300 + Math.floor(this.x);
  this.iz=Math.floor(this.z);
}


// move : 移動
// 一番上（iy=0) 
//   gb[this.nn].st=0 なら gb[this.nn].stを1に
//   gb[this.nn].st=1 なら
// y座標を1, vyを10にする

copygame_agent.prototype.progress = function() {
  this.nn=Math.floor(this.x / 10) + Math.floor(this.y / 10)*30;
  this.iz=Math.floor(this.z);
 // type1 author
 if(this.type==1){
    // creator type
    if(this.iz==0 && this.ep>0){
      // エネルギーが残っており、iy=0の場合
      var rr=Math.random();
      if (rr < 0.02){
        // 2% の確率でエネルギーを減らす
        this.ep = this.ep - 1;
      }
      if (rr < 0.01){
        // 1%の確率で作品を残す
        this.gb[this.nn].st = 1;
        this.gb[this.nn].author=this;
      }
    }
  }
  // type2 consumer
  else if(this.type==2) {
    if (this.iz==0) {
      if (this.gb[this.nn].st>=1) {
        var author1;
        // マーク済の位置にあれば、ジャンプ
        this.z = 1;
        this.vz = this.ep; // エネルギー分ジャンプ
        gb[this.nn].use();
        // author1 = gb[this.nn].author;
        // author1.ep = author1.ep + 1;
        this.ep = this.ep + 1;
      }
      else {
        // マークがなければそのままの位置でマーク

      }
    }
  }
  // type3 pirates
  else if(this.type==3){
    // pirate type
    if (this.y >= 150){
      if (this.iz==0) {
        if (this.gb[this.nn].st==1) {
          this.gb[this.nn].st=2;
          var author1;
          // マーク済の位置にあれば、マークを自分に変更
          gb[this.nn].author = this;
        }
        else {
          // マークがなければそのままの位置でマーク
  
        }
      }
    }
  }
}
copygame_agent.prototype.move = function() {
  // consumer type
  if(this.nn < 0 || this.nn>=90000) {
    console("error, this.nn range")
  }
  if (this.x < 10  || this.x > 280) {
      this.vx = - this.vx;
  }  
  if (this.y < 10  || this.y > 280) {
    this.vy = - this.vy;
}  
// gravity
  if (this.z > 0) {
    this.vz -= 1;
  }
  // motion
  this.x += this.vx;
  this.y += this.vy;
  if (this.x <0) this.x=0;
  if (this.x>=300) this.x=299;
  if (this.y <0) this.y=0;
  if (this.y>=300) this.y=299;
  this.z += this.vz;
  // collision with ground
  if (this.z<0) {
    this.z=0;
    this.vz=0;
  }
}

// show : 表示
copygame_agent.prototype.show = function() {
  // 円を描画
    // y 座標を整数に変換してから描画する    
    var x1,z1;
    x1 = Math.floor(this.x + this.y * 1.0);
    z1 = Math.floor(this.z + this.y* 1.0);
    z2 = Math.floor(this.z);
          
    c1.beginPath();

    c1.arc(x1,330-z1-z2, this.ep, 0, Math.PI * 2);
    if(this.type==1){
      c1.fillStyle = 'rgb(0,255,128)'; // creator = 緑
    }else if (this.type == 2){
      c1.fillStyle = 'rgb(0,128,255)'; // consumer = 青
    }else{
      c1.fillStyle = 'rgb(255,128,128)'; // pirate = ピンク
    }
    c1.shadowColor = 'rgb(128,128,128,)';   // 影
    c1.shadowOffsetX = 0;
    c1.shadowOffsetY = z2+5;
    c1.shadowBlur = 2;
    c1.closePath();
    c1.fill();
}
function game_title(){
  c1.beginPath();
  c1.rect(50,50,50,50);
  c1.fillStyle = 'rgb(0,255,128)'; // 紺色
  c1.shadowColor = 'rgb(255,0,0)';   // 影
  c1.shadowOffsetX = 0;
  c1.shadowOffsetY = 10;
  c1.shadowBlur = 2;
  c1.closePath();
  c1.fill();
  c1.beginPath();
  c1.rect(150,50,50,50);
  c1.closePath();
  c1.fillStyle = 'rgb(0,255,128)'; // 紺色
  c1.shadowColor = 'rgb(0,0,0)';   // 影
  c1.shadowOffsetX = 0;
  c1.shadowOffsetY = 20;
  c1.shadowBlur = 2;
  c1.fill();
}