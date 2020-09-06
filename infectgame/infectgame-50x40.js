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
function game_cell(n1,x1,y1,z1,x_rr1,y_rr1,z_rr1,st1,gb1) {
  this.n=n1; // cell number
  this.x=x1; // x coordinate 0..19 represents work place
  this.y=y1; // y coordinate 0..19 represents social group
  this.z=z1; // z coordinate 0..3  represents family members
  this.x_rr=x_rr1; // reproduction rate for x coordinate 
  this.y_rr=y_rr1; // reproduction rate for y coordinate 
  this.z_rr=z_rr1; // reproduction rate for x coordinate 
  this.st = st1; // status = 0
  this.ci = 0+0 // capable to infect
  this.gb = gb1;  // game board itself
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
    x2 = x1 * 8 + 6 - z1 * 2 + 10;
    y2 = y1 * 12;
    z2 = 9-z1 * 2;
    c1.moveTo(x2,330-z2 - y2);
    c1.lineTo(x2+4,330-z2 - y2);
    c1.lineTo(x2+4,330-z2-4 - y2);
    c1.lineTo(x2,330-z2-4 - y2);
    c1.lineTo(x2,330-z2 - y2);
    c1.closePath();
    c1.fill();
}

game_cell.prototype.pick_xyz=function(x1,y1,z1) {
  var gb1=this.gb[z1 * 400 + y1 * 20 + x1];
  return(gb1);
}

game_cell.prototype.day=function(){
  if (this.st == 0) {  // not infected
    var x1 = this.x; // x community index
    var y1 = this.y; // y family index
    var z1 = this.z;
    // meet some one else in different x
    r1 = Math.random();                   // infection ratio
    for(var r2=0; r2<20; r2++) {
    //r2 = Math.floor(Math.random() * 20);  // other person to meet
      if (r1 < this.x_rr[this.x]) {
        gb1 = this.pick_xyz(x1,r2,z1);
        ci1 = gb1.ci;
        if (gb1.ci>0) {
          this.st = 1;
          this.ci = 1;
        }
      }
    }
    // meet some one else in different y
    r1 = Math.random();                   // infection ratio
    for(var r2=0; r2<20; r2++) {
    //r2 = Math.floor(Math.random() * 20);  // other person to meet
      if (r1 < this.y_rr[this.y]) {
        gb1 = this.pick_xyz(r2,y1,z1);
        ci1 = gb1.ci;
        if (gb1.ci>0) {
          this.st = 1;
          this.ci = 1;
        }
      }
    }
    // meet some one else in different z
    r1 = Math.random();                   // infection ratio
    for(var r2=0; r2<4; r2++) {
    // r2 = Math.floor(Math.random() * 4);  // other person to meet
      if (r1 < this.z_rr[this.z]) {
        gb1 = this.pick_xyz(x1,y1,r2);
        ci1 = gb1.ci;
        if (gb1.ci>0) {
          this.st = 1;
          this.ci = 1;
        }
      }
    }
  }
  else {
    // st 1..4 hiding
    // st 8..9 symptic
    // st 10 detectable
    // st = 12 recovered
    if (this.st <5 ) { // Hiding
    }
    else if (this.st <9 ) { // infectable
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
