var b_reset;
var bkcol='#b3d9ff',textcol='#0080ff',rgb1='#FF0000',rgb2='#005900',rgb3='#0000FF';
var bwarr,rows1,cols1,dim,colarr,rows2,cols2;
var rle1,norm,rle2;


function setup(){
  var mycv=createCanvas(window.innerWidth,window.innerHeight-80);
  mycv.parent('sketch-holder');

  b_reset=createButton('RESET');
  b_reset.position(100,700);
  b_reset.mousePressed(f_reset);

  f_reset();
}

function draw(){
  background(bkcol);
  noStroke();
  fill(0);
  textSize(35);
  textStyle(BOLD);
  textAlign(CENTER,CENTER);
  text('RUN LENGTH ENCODING FOR IMAGE COMPRESSION',window.innerWidth/2,40);

  drawgrid();
  disp1();
  disp2();

  fill(0);
  textSize(18);
  textAlign(LEFT);
  text('Black & White Image',100,120);
  text('Colored Image',100,395);

  text('Pixel-by-Pixel Storage  ',200+dim*cols1,120);
  text('Run-length Encoded Storage',300+2*dim*cols1,120);

  text('Run-length Encoded Storage',150+dim*cols2,395);

  text('Click on the pixels to change its color.',b_reset.x+b_reset.width+10,b_reset.y-87);

  textSize(15);
  text('Intensity',450+3*dim*cols1,120);
  var t=150+3*dim*cols2;

  fill(textcol);
  text('Run-length',350+3*dim*cols1,120);
  text('Run-length',t,395);
  fill(rgb1);
  text('Red Intensity',t+100,395);
  fill(rgb2);
  text('Green Intensity',t+220,395);
  fill(rgb3);
  text('Blue Intensity',t+340,395);

  stroke(1);
  noFill();
  rect(340+3*dim*cols1,113,96,30);
  rect(340+3*dim*cols1+96,113,90,30);

  rect(t-20,390,470,30);
  rect(t-20,390,107,30);
  rect(t-20,390,230,30);
  rect(t-20,390,355,30);
}

function mousePressed(){
  var x=mouseX,y=mouseY;
  if(x>100&&x<cols1*dim+100&&y>150&&y<rows1*dim+150){
    j=int((x-100)/dim);
    i=int((y-150)/dim);
    if(bwarr[i][j]==0){
      bwarr[i][j]=1;
      norm[i][j]=1;
    }
    else if(bwarr[i][j]==1){
      bwarr[i][j]=0;
      norm[i][j]=0;
    }
  }

  else if(x>100&&x<cols2*dim+100&&y>425&&y<rows2*dim+450){
    j=int((x-100)/dim);
    i=int((y-425)/dim);
    colarr[i][j]+=1;
    if(colarr[i][j]==4)
      colarr[i][j]=1;
    console.log(rle2);
  }
}

function drawgrid(){
  stroke(1);
  //Black and white
  for(var i=0;i<rows1;i++){
    for(var j=0;j<cols1;j++){
      if(bwarr[i][j]==0)
        fill(255);
      else if(bwarr[i][j]==1)
        fill(0);
      rect(j*dim+100,i*dim+150,dim,dim);
    }
  }

  //Color
  for(var i=0;i<rows2;i++){
    for(var j=0;j<cols2;j++){
      if(colarr[i][j]==1)
        fill(255,0,0);
      else if(colarr[i][j]==2)
        fill(0,255,0);
      else if(colarr[i][j]==3)
        fill(0,0,255);
      rect(j*dim+100,i*dim+300+rows2*dim,dim,dim);
    }
  }
  noStroke();
}

function disp1(){
  var index;
  temp=[];
  //find rle encoding
  for(var i=0;i<rows1;i++){
    var prev=bwarr[i][0];
    temp[1]=prev;
    index=0;
    for(var j=1,k=1;j<cols1;j++){
      if(bwarr[i][j]==prev){
        k++;
      }
      else{
        temp[index]=k;
        k=1;
        index+=2;
        prev=bwarr[i][j];
        temp[index+1]=prev;
      }
    }
    temp[index]=k;
    rle1[i]=temp.slice(0,index+2);
  }

  //draw table
  noFill();
  stroke(1);
  for(var i=0;i<rows1;i++){
    rect(200+dim*cols1,150+i*25,cols1*dim,dim);
  }

  for(var i=0;i<rows1;i++){
    rect(300+2*dim*cols1,150+i*25,cols1*dim*2,dim);
  }
  line(300+3*dim*cols1,150,300+3*dim*cols1,150+dim*rows1);

  //table content
  noStroke();
  textSize(15);
  textAlign(LEFT,CENTER);
  fill(0);
  for(var i=0;i<rows1;i++){
    for(var j=0;j<cols1;j++){
      text(norm[i][j]+' ',205+dim*cols1+dim*j,164+i*dim);
    }
  }

  for(var i=0;i<rows1;i++){
    for(var j=0;j<2*cols1;j++){
      if(rle1[i][j]!=undefined){
        if(j%2==0)
          fill(textcol);
        else if(rle1[i][j]==0)
          fill(255);
        else if(rle1[i][j]==1)
          fill(0);
        text(rle1[i][j]+' ',305+2*dim*cols1+dim*j,164+i*dim);
      }
    }
  }
}

function disp2(){
  var index,prev;
  var temp=[];
  //rle encoding
  for(var i=0;i<rows2;i++){
    index=0;
    prev=colarr[i][0];
    for(var j=1,k=1;j<cols2;j++){
      //prev=colarr[i][j];
      if(colarr[i][j]==prev){
        k++;
      }
      else{
        for(var n=1;n<4;n++){
          if(n==prev)
            temp[index+n]=255;
          else if(temp[index+n]==undefined)
            temp[index+n]=0;
        }
        temp[index]=k;
        k=1;
        index+=4;
        //prev=colarr[i][j];
      }
      prev=colarr[i][j];
    }
    temp[index]=k;
    for(var n=1;n<4;n++){
      if(n==prev)
        temp[index+n]=255;
      else if(temp[index+n]==undefined&&n!=prev)
        temp[index+n]=0;
    }
    rle2[i]=temp.slice(0,index+4);
    temp=[];
  }

  //table
  noFill();
  stroke(1);
  for(var i=0;i<rows2;i++){
    rect(150+dim*cols2,425+i*25,cols2*dim*5,dim);
  }

  //table content
  noStroke();
  textSize(15);
  textAlign(LEFT,TOP);
  fill(0);
  for(var i=0;i<rows2;i++){
    for(var j=0;j<4*cols2;j++){
      var x=j%4;
      if(rle2[i][j]!=undefined){
        if(x==0)
          fill(textcol);
        else if(x==1)
          fill(rgb1);
        else if(x==2)
          fill(rgb2);
        else if(x==3)
          fill(rgb3);
        text(rle2[i][j]+' ',153+dim*cols2+(dim+5)*j,425+i*dim+3);
      }
    }
  }

}

function f_reset(){
  bwarr=[];
  colarr=[];
  rows1=5;
  cols1=10;
  rows2=5;
  cols2=6;
  dim=25;

  rle1=[];
  rle2=[];
  norm=[];

  for(var i=0;i<rows1;i++){
    bwarr[i]=[];
    norm[i]=[];
    bwarr[i]=[];
    colarr[i]=[];
  }

  for(var i=0;i<rows1;i++){
    for(var j=0;j<cols1;j++){
      bwarr[i][j]=0;
      norm[i][j]=0;
    }
  }

  for(var i=0;i<rows2;i++){
    for(var j=0;j<cols2;j++){
      if(j<2)
        colarr[i][j]=1;
      else if(j<4)
        colarr[i][j]=2;
      else
        colarr[i][j]=3;
    }
  }

}