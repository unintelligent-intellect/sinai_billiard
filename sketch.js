let PI=3.141592653589793238
let width=800;
let height=800;
let Nparticle = 1000;
let LX=width;
let LY=height;
let R=Math.min(LX/4,LY/4)*3/2;
let v0=700;
let theta=181/360*PI*2;

var x=[];
var y=[];
var cx=[];
var cy=[];
var vx=[];
var vy=[];

let m=1;
let dt=0.01;

let count=0;
let keycount=0;
function setup() {
  createCanvas(width, height);
  background(255);
  for (let i=0;i<Nparticle;i++){
    x.push(R+i/Nparticle);
    y.push(R);
    vx.push(0);
    vy.push(0);
  }
}

function draw() {
  translate(width/2,height/2);
  count+=1;
  background(255);
  stroke(0);
  strokeWeight(10);
  line(LX/2,LY/2,LX/2,-LY/2);
  line(LX/2,-LY/2,-LX/2,-LY/2);
  line(-LX/2,-LY/2,-LX/2,LY/2);
  line(-LX/2,LY/2,LX/2,LY/2);
  fill(0);
  strokeWeight(0)
  ellipse(0,0,R*2,R*2);
  for (let i=0; i<Nparticle; i++){
    var hold=[];
    x[i] += vx[i]*dt;
    y[i] += vy[i]*dt;
    if (x[i]<-LX/2){
      x[i]=-LX-x[i];
      vx[i]=-vx[i];
    }else if(x[i]>LX/2){
      x[i]=LX-x[i];
      vx[i]=-vx[i];
    }
    if (y[i]<-LY/2){
      y[i]=-LY-y[i];
      vy[i]=-vy[i];
    }else if(y[i]>LY/2){
      y[i]=LY-y[i];
      vy[i]=-vy[i];
    }
    if (x[i]*x[i]+y[i]*y[i]<R*R){
      let T=optimaltime(x[i],y[i],vx[i],vy[i],R);
      cx[i]=x[i]-vx[i]*T;
      cy[i]=y[i]-vy[i]*T;
      hold=mirror(x[i],y[i],cx[i],cy[i],vx[i],vy[i],T);
      x[i]=hold[0];
      y[i]=hold[1];
      vx[i]=(x[i]-cx[i])/sqrt((x[i]-cx[i])*(x[i]-cx[i])+(y[i]-cy[i])*(y[i]-cy[i]))*v0;
      vy[i]=(y[i]-cy[i])/sqrt((x[i]-cx[i])*(x[i]-cx[i])+(y[i]-cy[i])*(y[i]-cy[i]))*v0;
    }
    stroke(0);
    strokeWeight(2);
    point(x[i],y[i]);
  }
  if (keycount == 0) {
    strokeWeight(1);
    line(R,R,R+20*cos(theta),R+20*sin(theta));
  }
  if (keyIsDown(UP_ARROW)){
    theta-=PI/360;
  }else if(keyIsDown(DOWN_ARROW)){
    theta+=PI/360;
  }
  if(keyCode==ENTER&&keycount==0){
    for (let i=0; i<Nparticle; i++){
      vx[i]=v0*Math.cos(theta);
      vy[i]=v0*Math.sin(theta);
    }
    keycount=1;
  }
}

function optimaltime(x,y,vx,vy,R){
  let V2=vx*vx+vy+vy;
  let RV=x*vx+y*vy;
  let T=(RV+sqrt(RV*RV+V2*(R*R-x*x-y*y)))/V2;
  return T;
}

function mirror(x,y,cx,cy,vx,vy,t){
  let theta=findtheta(cx,cy);
  let phi=findtheta(x-cx,y-cy);
  let ret=[];
  ret.push(cx+(-Math.cos(2*(theta-phi))*vx+Math.sin(2*(theta-phi))*vy)*t);
  ret.push(cy+(-Math.sin(2*(theta-phi))*vx-Math.cos(2*(theta-phi))*vy)*t);
  return ret;
}


function findtheta(x, y) {
  let theta = 0;
  if (y > 0) {
    theta = Math.acos(x / sqrt(x * x + y * y));
  } else if (y < 0) {
    theta = PI + Math.acos(-x / sqrt(x * x + y * y));
  }
  return theta;
}
