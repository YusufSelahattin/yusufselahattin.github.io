(()=>{
'use strict';
const canvas=document.getElementById('biomedical-bg');const ctx=canvas.getContext('2d');const control=document.querySelector('.motion-toggle');
let paused=false,frame=0,w=0,h=0,t=0,last=0,visible=!document.hidden;
const nodes=Array.from({length:48},(_,i)=>({x:0.50+0.46*((Math.sin(i*127.1)*43758.5453)%1+1)%1,y:(i*.61803398875)%1,phase:i*1.73,r:1.5+(i%3)*.6}));
function resize(){w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function draw(){
ctx.clearRect(0,0,w,h);
// Abstract network and waveforms are decorative, not medical recordings.
const positions=nodes.map(n=>({x:(.51+(n.x%0.49))*w+Math.sin(t*.17+n.phase)*13,y:n.y*h+Math.cos(t*.13+n.phase)*17,r:n.r}));
for(let i=0;i<positions.length;i++){const a=positions[i];for(let j=i+1;j<positions.length;j++){const b=positions[j],dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist<Math.min(185,w*.25)){ctx.strokeStyle=`rgba(54,145,202,${(1-dist/185)*.17})`;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();const flow=(t*.14+(i+j)*.137)%1;ctx.fillStyle='rgba(55,151,213,.32)';ctx.beginPath();ctx.arc(a.x+(b.x-a.x)*flow,a.y+(b.y-a.y)*flow,1.4,0,Math.PI*2);ctx.fill()}}ctx.fillStyle='rgba(53,143,201,.3)';ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill()}
for(let line=0;line<4;line++){ctx.beginPath();for(let x=0;x<=w;x+=4){const u=x*.018-t*.65+line*2;const wave=Math.sin(u*1.9)*.52+Math.sin(u*4.1+line)*.26+Math.sin(u*.7)*.55;const amplitude=(line%2?12:20)*(0.5+0.5*Math.sin(x/w*Math.PI));const y=h*(.24+line*.20)+wave*amplitude;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle=`rgba(61,153,213,${line%2?.10:.16})`;ctx.lineWidth=line%2?1:1.4;ctx.stroke()}
}
function tick(now){frame=0;if(paused||!visible)return;if(now-last>32){t+=Math.min((now-last)/1000,.05);last=now;draw()}frame=requestAnimationFrame(tick)}
function sync(){control.setAttribute('aria-pressed',String(paused));control.setAttribute('aria-label',paused?'Animasyonları başlat':'Animasyonları durdur');control.innerHTML=(paused?'▶':'Ⅱ')+' <span>'+(paused?'Hareketi başlat':'Hareketi durdur')+'</span>';document.body.classList.toggle('motion-paused',paused);if(frame)cancelAnimationFrame(frame);frame=0;if(!paused&&visible){last=performance.now();frame=requestAnimationFrame(tick)}else draw()}
control.addEventListener('click',()=>{paused=!paused;sync()});document.addEventListener('visibilitychange',()=>{visible=!document.hidden;sync()});addEventListener('resize',resize,{passive:true});resize();sync();
const reveals=[...document.querySelectorAll('.section,.contact,.strip,.research,.entry')];reveals.forEach(e=>e.classList.add('reveal'));if('IntersectionObserver'in window){const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target)}}),{threshold:.07,rootMargin:'0px 0px -20px 0px'});reveals.forEach(e=>reveal.observe(e));document.body.classList.add('animate');
const links=[...document.querySelectorAll('nav a[href^="#"]')];const current=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)links.forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}),{rootMargin:'-15% 0px -45% 0px'});links.forEach(a=>{const section=document.querySelector(a.hash);if(section)current.observe(section)})}
const bar=document.querySelector('.reading-progress');function progress(){const length=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${length>0?Math.min(1,scrollY/length):0})`}addEventListener('scroll',progress,{passive:true});addEventListener('resize',progress,{passive:true});progress();
})();
