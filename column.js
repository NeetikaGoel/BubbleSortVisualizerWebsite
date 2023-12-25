class Column
{
     constructor(x,y,width,height)
     {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.queue=[];
          this.color={r:255,g:0,b:127}
     }

     moveTo(loc, yOffset=-1, frameCount=4)
     {
          for (let i=1; i<=frameCount; i++)
          {
               const t=i/frameCount;
               const u=Math.sin(t*Math.PI);
               this.queue.push({
                    x:lerp(this.x,loc.x,t),
                    y:lerp(this.y,loc.y,t)+u*this.width/2*yOffset,
                    r:lerp(255,0,u),
                    g:lerp(255,255,u),
                    b:lerp(0,255,u),

               });

          }
     }

     jump(frameCount=10)
     {
          for (let i=1; i<=frameCount; i++)
          {
               const t=i/frameCount;
               const u=Math.sin(t*Math.PI);
               this.queue.push({
                    x:this.x,
                    y:this.y-u*this.width,

               });

          }
     }

     draw(ctx)
     {
          let changed=false;
          if (this.queue.length>0)
          {
               const {x,y,r,g,b} = this.queue.shift();
               this.x=x;
               this.y=y;
               this.color={r,g,b};
               changed=true;
          }
          const left=this.x-this.width/2;
          const top=this.y-this.height;
          // ctx.beginPath();
          // ctx.rect(left, top, this.width, this.height);
          // ctx.fill();
          const right=this.x+this.width/2;
          // const bottom=this.y+this.height;

          ctx.beginPath();
          const {r,g,b}=this.color;
          // ctx.fillStyle="rgb(255,0,127)";
          ctx.fillStyle=`rgb(${r},${g},${b})`;
          ctx.moveTo(left, top);
          ctx.lineTo(left, this.y);
          ctx.ellipse(this.x, this.y, this.width/2, this.width/4, 0, Math.PI, Math.PI*2, true);
          // ctx.lineTo(right, top);
          ctx.ellipse(this.x, top, this.width/2, this.width/4, 0, 0, Math.PI*2, true);
          // ctx.ellipse(this.x, top, this.width / 2, this.width / 4, 0, 0, Math.PI * 2, false);

          // ctx.closePath();
          
          // ctx.stroke();
          // Set the outline color to violet
          ctx.strokeStyle = 'black';
          ctx.fill();
          // Draw the stroke (outline) for the entire shape
          ctx.stroke();
          
          return changed;
     }
}