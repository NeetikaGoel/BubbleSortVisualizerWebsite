const canvas = document.getElementById("canvas");

canvas.width = 900;
canvas.height = 450;

const margin=20;

const maxColHeight=450;

let n=0;
// const n=20;
const array=[];
let moves=[];

const cols=[];

const ctx=canvas.getContext("2d");

// const input=document.querySelector("input");
const input = document.querySelector("#arraySize");
const number=document.querySelector(".number");

// console.log(input);
// console.log(number);

// input.addEventListener("input",() => {
//      n=number;
//      number.textContent = input.value;
// });

input.addEventListener("input", () => {
     n = parseInt(input.value);
     number.textContent = n;
     init(); // Call init whenever input changes
 });

// n=number;
console.log(n);

// init();
let audioCtx=null;

function playNote(freq, type)
{
     if (audioCtx==null)
     {
          audioCtx=new(AudioContext || webkitAudioContext || window.AudioContext)();
     }

     const dur=0.2;
     const osc=audioCtx.createOscillator();
     osc.frequency.value=freq;
     osc.start();
     osc.type=type;
     osc.stop(audioCtx.currentTime+dur);

     const node=audioCtx.createGain();
     node.gain.value=0.4;
     node.gain.linearRampToValueAtTime(0, audioCtx.currentTime+dur);

     osc.connect(node);
     node.connect(audioCtx.destination);

}

function init() {

     let spacing=(canvas.width-margin*2)/n;
     cols.length = 0; // Clear the cols array
     array.length = 0; // Clear the array
     for (let i = 0; i < n; i++) {
        array[i] = Math.random();
     }
     moves=[];
     // spacing = (canvas.width - margin * 2) / n; // Update spacing
     for (let i=0; i<array.length; i++)
     {
          const x=i*spacing+spacing/2+margin;
          const y=canvas.height-margin;  //-i*3 can be done for tilting
          const width=spacing-4;
          //const height=(canvas.height-margin*2)*array[i];
          const height=(maxColHeight-margin*2)*array[i];
          cols[i]=new Column(x,y,width,height);
          cols[i].draw(ctx);
     }
}

function play()
{
     moves=bubbleSort(array);
}

console.log(array);
// let moves=bubbleSort(array);

animate();

function bubbleSort(array)
{
     const moves=[];
     do{
          var swapped=false;
          for (let i=1; i<array.length; i++)
          {    
               if (array[i-1]>array[i])
               {
                    swapped=true;
                    [array[i-1],array[i]] = [array[i],array[i-1]];
                    moves.push(
                         {indices:[i-1,i], swap:true},
                    );
               }

               else
               {
                    moves.push(
                         {indices:[i-1,i], swap:false},
                    );
               }
          }
     }

     while (swapped);
     return moves;
}

function animate()
{
     //console.log("ANIMATE FUNCTION CALLED !!");
     let changed = false;
     ctx.clearRect(0,0,canvas.width,canvas.height);
     for (let i=0; i<cols.length; i++)
     {
          changed=cols[i].draw(ctx)||changed;
     }

     if (!changed && moves.length > 0)
     {
          const move=moves.shift();
          const [i,j]=move.indices;
          const waveFormType=move.swap?"square":"sine";
          playNote(cols[i].height+cols[j].height, waveFormType);

          if (move.swap)
          {
               cols[i].moveTo(cols[j]);
               cols[j].moveTo(cols[i],-1);
               [cols[i],cols[j]]=[cols[j],cols[i]];
          }

          else{
               cols[i].jump();
               cols[j].jump();
          }
     }

     requestAnimationFrame(animate);
}