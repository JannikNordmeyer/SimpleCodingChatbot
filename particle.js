class Particle 
{
  constructor()
  {
    this.pos = createVector(width/2, height/2);
    this.vel = createVector(0, 0);
    this.acc = p5.Vector.random2D().normalize();
    
        //this.r = map(this.pos.x, 0, width, 255, 0); //to add color we use particle position to get a smooth transition between the colors
       // this.g = map(this.pos.y, 0, height, 0, 255); // r is red, g is green, b is blue
        //this.b = map(dist(width/2, height/2, this.pos.x, this.pos.y), 0, width/2, 0, 225);
    this.r = 69;
    this.g =  224;
    this.b = 255;
    
    this.alpha = 255; 
  }
   
  moveParticle(frame)
  {
    var m = map(sin(frame * 6), -1, 0.1, 0.4, 0.6); 
   
    this.acc.mult(m);
    this.vel.add(this.acc); 
    this.pos.add(this.vel); 
}
  
  update () {
    this.moveParticle(frameCount);

    
        //this.r = map(this.pos.x, 0, width, 255, 0); //to add color we use particle position to get a smooth transition between the colors
        //this.g = map(this.pos.y, 0, height, 0, 255); // r is red, g is green, b is blue
        //this.b = map(dist(width/2, height/2, this.pos.x, this.pos.y), 0, width/2, 0, 225);
    
    if (dist(width/2, height/2, this.pos.x, this.pos.y) > 50) { 
      this.alpha -= 3; 

    }
    
    
    
  }
  show() {
    noStroke();
    fill(this.r, this.g, this.b, this.alpha);
    ellipse(this.pos.x, this.pos.y, 8);
}



}