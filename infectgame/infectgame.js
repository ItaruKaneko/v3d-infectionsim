// infectgame agents 0.0
// Previous version
//    copygame04_04
//     2019/11/21
// x=20 x y=20 x z=4 の3次元格子
// x は職場、yはグループ, z は家庭を表す
// 再生産率は x, y, z 配列に
// 

// class definition : game_cell
// ゲームのます目の定義
function game_cell(n1,x1,y1,z1,x_rr1,y_rr1,z_rr1) {
  this.n=n1; // cell number
  this.x=x1; // x coordinate 0..19 represents work place
  this.y=y1; // y coordinate 0..19 represents social group
  this.z=z1; // z coordinate 0..3  represents family members
  this.x_rr=x_rr1; // reproduction rate for x coordinate 
  this.y_rr=y_rr1; // reproduction rate for y coordinate 
  this.z_rr=z_rr1; // reproduction rate for x coordinate 
  this.st = 0; // status = 0
  this.author = null;    // copy game agent marking here
  this.ucount = 0;  // use count
}

// git test change this line

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
      c1.fillStyle = 'rgb(0,0,255)'; // 青
    }
    x2 = x1 * 10 + y1 * 10;
    y2 = y1 + Math.floor(this.z) * 32;
    c1.moveTo(x2,350-y2*2);
    c1.lineTo(x2+5,350-y2*2);
    c1.lineTo(x2+10,350-y2*2-5);
    c1.lineTo(x2+5,350-y2*2-5);
    c1.lineTo(x2,350-y2*2);
    c1.closePath();
    c1.fill();
}

game_cell.prototype.infect=function(){
   // rect を描画
    // y 座標を整数に変換してから描画する    
    var x1,y1;
    x1 = Math.floor(this.x);
    y1 = Math.floor(this.y);
    c1.beginPath();
    c1.shadowColor = 'rgb(0,0,0)';   // 影
    c1.shadowOffsetX = 0;
    c1.shadowOffsetY = 0;
}

// not used
game_cell.prototype.use=function() {
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
