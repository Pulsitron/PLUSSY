'use strict';
const $ = (s) => document.querySelector(s);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CA = '0xd4214e846d34442ed1dd3213612336d284164d92';
let soundOn = false, audioContext;
const soundButton = $('#sound');
function tone(frequency = 500, duration = .12, delay = 0) {
  if (!soundOn) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume().catch(() => {});
    const o = audioContext.createOscillator(), g = audioContext.createGain(), t = audioContext.currentTime + delay;
    o.type = 'sine'; o.frequency.setValueAtTime(frequency, t); o.frequency.exponentialRampToValueAtTime(frequency * .65, t + duration);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.06, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + duration);
    o.connect(g); g.connect(audioContext.destination); o.start(t); o.stop(t + duration + .02);
  } catch (_) { /* Silent fallback when audio is unavailable. */ }
}
function giggleSound() { [620,790,700,890,760].forEach((f,i) => tone(f,.13,i*.12)); }
soundButton.addEventListener('click', () => {
  soundOn = !soundOn;
  soundButton.setAttribute('aria-pressed', String(soundOn));
  soundButton.setAttribute('aria-label', soundOn ? 'Disable sound' : 'Enable sound');
  soundButton.innerHTML = `♫ <span>Sound ${soundOn ? 'on' : 'off'}</span>`;
  tone(650);
});
const heroVideo = $('#hero-video'), pauseButton = $('#hero-pause');
function updatePause() { pauseButton.textContent = heroVideo.paused ? '▶' : 'Ⅱ'; pauseButton.setAttribute('aria-label', heroVideo.paused ? 'Play hero animation' : 'Pause hero animation'); }
if (reducedMotion) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); }
heroVideo.addEventListener('play', updatePause); heroVideo.addEventListener('pause', updatePause);
pauseButton.addEventListener('click', () => { if (heroVideo.paused) heroVideo.play().catch(() => showToast('Tap play again to start the show.')); else heroVideo.pause(); });
updatePause();
const heroSound=$('#hero-sound');
function updateHeroSound(){heroSound.textContent=heroVideo.muted?'Sound on ♫':'Mute ♫';heroSound.setAttribute('aria-pressed',String(!heroVideo.muted));heroSound.setAttribute('aria-label',heroVideo.muted?'Unmute hero video':'Mute hero video');}
heroSound.addEventListener('click',()=>{heroVideo.muted=!heroVideo.muted;updateHeroSound();if(!heroVideo.muted&&heroVideo.paused)heroVideo.play().catch(()=>showToast('Tap play to start the hero video.'));});
heroVideo.addEventListener('volumechange',updateHeroSound);updateHeroSound();
const canvas = $('#confetti'), ctx = canvas.getContext('2d');
let particles = [], raf = 0;
function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();
function burst(x = innerWidth / 2, y = innerHeight / 2) {
  if (reducedMotion || !ctx) return;
  for (let i = 0; i < 75; i++) particles.push({x,y,vx:(Math.random()-.5)*12,vy:-Math.random()*11-2,life:65+Math.random()*35,r:Math.random()*6+3,spin:Math.random()*6,color:['#ff3cb4','#45e4f2','#fff5e8','#bb7bff'][i%4]});
  if (!raf) raf = requestAnimationFrame(drawConfetti);
}
function drawConfetti() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {p.x+=p.vx;p.y+=p.vy;p.vy+=.19;p.life--;p.spin+=.13;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.spin);ctx.fillStyle=p.color;ctx.globalAlpha=Math.min(1,p.life/20);ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*.55);ctx.restore();});
  raf = particles.length ? requestAnimationFrame(drawConfetti) : 0;
}
let toastTimer;
function showToast(text) { $('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600); }
// PLUSSY is a reactive sprite puppet. A stroke must move across a real weak spot.
const stage=$('#tickle-stage'),puppet=$('#puppet'),puppetFrame=$('#puppet-frame'),balloon=$('#balloon'),speech=$('#speech'),hitbox=$('#balloon-control');
let best=0;try{best=Math.max(0,Number(localStorage.getItem('plussy-giggles-v3'))||0);}catch(_){}
let mode='free',phase='idle',charge=0,giggles=0,score=0,combo=1,streak=0,remaining=30,lastTickle=-Infinity,roundStart=0,pausedAt=0,laughUntil=0,dragging=false,lastPoint=null,lastDir=0,holding=false,holdTimer=0,holdStep=0,lastRelease=-Infinity;
let balloonPoint={x:.79,y:.65},balloonAim={...balloonPoint},balloonVelocity={x:0,y:0},balloonRaf=0,previousFrame=0,animationStart=0;
const weakSpots=[{x:.37,y:.51,r:.085},{x:.63,y:.51,r:.085},{x:.17,y:.85,r:.10},{x:.83,y:.85,r:.10}];
const fx=$('#game-fx'),fc=fx.getContext('2d');let motes=[],fxRaf=0,fw=1,fh=1;
function fitFX(){const r=stage.getBoundingClientRect();fw=r.width;fh=r.height;const d=Math.min(window.devicePixelRatio||1,2);fx.width=Math.round(fw*d);fx.height=Math.round(fh*d);fc?.setTransform(d,0,0,d,0,0);}
window.addEventListener('resize',fitFX);fitFX();
function effect(x,y,text=''){
 if(reducedMotion||!fc)return;
 for(let i=0;i<(text?20:3);i++)motes.push({x,y,vx:(Math.random()-.5)*(text?6:2),vy:-Math.random()*4-.3,life:1,size:Math.random()*4+2,color:i%2?'#aaffff':'#ff9ae3'});
 if(text)motes.push({x,y,vx:0,vy:-1.2,life:1,size:25,color:'#fff3d4',text});
 if(!fxRaf)fxRaf=requestAnimationFrame(paintFX);
}
function paintFX(){
 fc.clearRect(0,0,fw,fh);motes=motes.filter(p=>p.life>0);
 for(const p of motes){p.x+=p.vx;p.y+=p.vy;p.vy+=.025;p.life-=.023;fc.globalAlpha=Math.max(0,p.life);fc.fillStyle=p.color;if(p.text){fc.font='700 25px sans-serif';fc.textAlign='center';fc.fillText(p.text,p.x,p.y);}else{fc.beginPath();fc.arc(p.x,p.y,p.size,0,Math.PI*2);fc.fill();}}
 fc.globalAlpha=1;fxRaf=motes.length?requestAnimationFrame(paintFX):0;
}
function placeBalloon(){balloon.style.left=balloonPoint.x*100+'%';balloon.style.top=balloonPoint.y*100+'%';balloon.style.transform=`translate(-50%,-38%) rotate(${Math.max(-25,Math.min(25,balloonVelocity.x*1200))-7}deg)`;}
function animateBalloon(t){
 const dt=Math.min(2,Math.max(.2,(t-(previousFrame||t-16))/16));previousFrame=t;
 for(const axis of ['x','y']){balloonVelocity[axis]+=(balloonAim[axis]-balloonPoint[axis])*.12*dt;balloonVelocity[axis]*=Math.pow(.68,dt);balloonPoint[axis]+=balloonVelocity[axis]*dt;}
 placeBalloon();const error=Math.hypot(balloonAim.x-balloonPoint.x,balloonAim.y-balloonPoint.y)+Math.hypot(balloonVelocity.x,balloonVelocity.y);
 if(error>.0005&&t-animationStart<1800)balloonRaf=requestAnimationFrame(animateBalloon);else{balloonRaf=0;previousFrame=0;balloonPoint={...balloonAim};placeBalloon();}
}
function setBalloon(x,y){balloonAim={x:Math.max(.04,Math.min(.96,x)),y:Math.max(.10,Math.min(.92,y))};if(reducedMotion){balloonPoint={...balloonAim};placeBalloon();}else if(!balloonRaf){animationStart=performance.now();balloonRaf=requestAnimationFrame(animateBalloon);}}
function setMood(mood){stage.dataset.mood=mood;puppet.setAttribute('aria-label',mood==='laughing'?'PLUSSY laughing with her eyes closed':mood==='cracking'?'PLUSSY trying not to laugh':mood==='wink'?'PLUSSY giving a cheeky wink':'PLUSSY smiling mischievously with her neon choker');}
function readGame(){return{mode,phase,score,giggles,best,combo,charge:Math.round(charge),secondsRemaining:mode==='challenge'?Math.ceil(remaining):null};}
function rank(){return giggles>=8?'Clown completely broken':giggles>=4?'Certified tickle menace':giggles>=1?'Found her weak spot':'Find her weak spot';}
function renderGame(){
 $('#score').textContent=String(score).padStart(4,'0');$('#giggles').textContent=String(giggles).padStart(2,'0');$('#combo').textContent='×'+combo;$('#time-left').textContent=mode==='challenge'?String(Math.ceil(remaining)).padStart(2,'0'):'∞';$('#best').textContent=String(best).padStart(4,'0');
 $('#giggle-meter').value=charge;$('#giggle-meter').textContent=Math.round(charge)+'%';$('#rank').textContent=rank();$('#meter-label').textContent=performance.now()<laughUntil?'Absolutely lost it':charge>65?'About to crack':charge>25?'Fighting the smile':'Far too smug';
 $('#game-pause').disabled=phase!=='playing'&&phase!=='paused';$('#game-pause').textContent=phase==='paused'?'▶':'Ⅱ';$('#game-pause').setAttribute('aria-label',phase==='paused'?'Resume game':'Pause game');
}
function clearGesture(){dragging=false;lastPoint=null;holding=false;clearInterval(holdTimer);holdTimer=0;$('#tickle-button').classList.remove('holding');stage.classList.remove('is-contact');puppet.style.setProperty('--lean','0deg');puppet.style.setProperty('--lean-x','0px');}
function startGame(){
 clearGesture();phase='playing';charge=0;giggles=0;score=0;combo=1;streak=0;remaining=30;lastTickle=-Infinity;lastDir=0;laughUntil=0;roundStart=performance.now();
 stage.classList.add('is-playing');$('#pause-veil').hidden=true;setMood('calm');$('#start-game').textContent='Start over ↻';$('#game-title').innerHTML='Crack the<br>clown.';$('#game-kicker').textContent=mode==='free'?'NO CLOCK. ALL MISCHIEF.':'30 SECONDS. MAKE THEM COUNT.';speech.textContent='“The cheeks? Oh, you wouldn’t…”';$('#stage-instruction').textContent='BRUSH BACK & FORTH OVER HER CHEEKS OR SHOULDERS';fitFX();renderGame();tone(540,.1);return readGame();
}
function saveBest(){if(mode==='challenge'&&score>best){best=score;try{localStorage.setItem('plussy-giggles-v3',String(best));}catch(_){}}}
function endGame(){clearGesture();phase='finished';remaining=0;saveBest();stage.classList.remove('is-playing');setMood(giggles?'laughing':'calm');laughUntil=0;$('#game-title').textContent=giggles?'You broke her.':'She held it in.';$('#game-kicker').textContent=`${giggles} GIGGLES · ${score.toLocaleString()} POINTS`;$('#start-game').textContent='Another round? ↗';speech.textContent=giggles?'“Fine. You win this round.”':'“Is that all you’ve got?”';$('#stage-instruction').textContent='ROUND COMPLETE · YOUR BEST IS SAVED ON THIS DEVICE';renderGame();if(giggles){const r=stage.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2);}return readGame();}
function pauseGame(){if(phase!=='playing')return;phase='paused';pausedAt=performance.now();clearGesture();$('#pause-veil').hidden=false;renderGame();}
function resumeGame(){if(phase!=='paused')return;const elapsed=performance.now()-pausedAt;roundStart+=elapsed;if(laughUntil)laughUntil+=elapsed;lastTickle=performance.now();phase='playing';$('#pause-veil').hidden=true;hitbox.focus({preventScroll:true});renderGame();}
function resetGame(){clearGesture();phase='idle';charge=0;giggles=0;score=0;combo=1;streak=0;remaining=30;laughUntil=0;stage.classList.remove('is-playing');$('#pause-veil').hidden=true;setMood('calm');$('#game-title').innerHTML='Crack the<br>clown.';$('#start-game').textContent='Let’s play ✦';$('#game-kicker').textContent=mode==='free'?'NO CLOCK. ALL MISCHIEF.':'30 SECONDS. MAKE THEM COUNT.';speech.textContent='“Me? Ticklish? Prove it.”';$('#stage-instruction').textContent='PRESS PLAY, THEN BRUSH THE BALLOON BACK & FORTH';setBalloon(.79,.65);renderGame();return readGame();}
function contactAt(x,y){const s=stage.getBoundingClientRect(),p=puppetFrame.getBoundingClientRect();const px=s.left+x*s.width,py=s.top+y*s.height;return weakSpots.findIndex(w=>Math.hypot((px-p.left)/p.width-w.x,(py-p.top)/p.height-w.y)<w.r);}
function applyStroke(x,y,distance,direction){
 if(phase!=='playing'||distance<4)return false;
 const now=performance.now(),spot=contactAt(x,y);if(spot<0){stage.classList.remove('is-contact');return false;}
 stage.classList.add('is-contact');puppet.style.setProperty('--lean',((x<.5?1:-1)*1.8)+'deg');puppet.style.setProperty('--lean-x',((x<.5?1:-1)*3)+'px');
 if(now<laughUntil||now-lastTickle<85)return false;
 if(now-lastTickle>850){streak=0;lastDir=0;}
 const reversed=lastDir&&direction!==lastDir;lastDir=direction;lastTickle=now;streak+=reversed?2:1;combo=Math.min(4,1+Math.floor(streak/12));
 const amount=Math.min(13,Math.max(4,distance*.24))*(reversed?1.2:1);charge=Math.min(100,charge+amount);score+=5*combo;effect(x*fw,y*fh);tone(460+charge*3,.045);
 if(charge>=100){giggles++;score+=100*combo;charge=0;laughUntil=now+1400;setMood('laughing');speech.textContent=['“Heehee! You absolute menace.”','“Okay, okay! I’m ticklish!”','“You’ve ruined my reputation!”'][giggles%3];giggleSound();effect(fw*.5,fh*.37,`GIGGLE! +${100*combo}`);if(navigator.vibrate)navigator.vibrate([25,35,25]);}
 else{setMood(charge>25?'cracking':charge>5?'wink':'calm');if(charge>65)speech.textContent='“I’m… definitely… not laughing!”';else if(charge>25)speech.textContent='“Hey! That’s cheating…”';}
 renderGame();return true;
}
function pointerMove(e){const r=stage.getBoundingClientRect(),point={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};setBalloon(point.x,point.y);if(lastPoint){const dx=(point.x-lastPoint.x)*r.width,dy=(point.y-lastPoint.y)*r.height;applyStroke(point.x,point.y,Math.hypot(dx,dy),Math.abs(dx)>=Math.abs(dy)?Math.sign(dx):Math.sign(dy));}lastPoint=point;}
hitbox.addEventListener('pointerdown',e=>{if(phase==='paused')return;if(phase!=='playing')startGame();e.preventDefault();dragging=true;lastPoint=null;hitbox.setPointerCapture(e.pointerId);pointerMove(e);});
hitbox.addEventListener('pointermove',e=>{if(dragging)pointerMove(e);});
['pointerup','pointercancel','lostpointercapture','blur'].forEach(event=>hitbox.addEventListener(event,clearGesture));
function assistedStroke(){const s=stage.getBoundingClientRect(),p=puppetFrame.getBoundingClientRect(),w=weakSpots[Math.floor(giggles/2)%4];holdStep++;const side=holdStep%2?1:-1;const x=(p.left+w.x*p.width+side*15-s.left)/s.width,y=(p.top+w.y*p.height-s.top)/s.height;setBalloon(x,y);applyStroke(x,y,30,side);}
function tickle(){if(phase==='paused')return readGame();if(phase!=='playing')startGame();assistedStroke();return readGame();}
function beginHold(){if(holding||phase==='paused')return;if(phase!=='playing')startGame();holding=true;$('#tickle-button').classList.add('holding');assistedStroke();holdTimer=setInterval(assistedStroke,110);}
function endHold(){if(holding)lastRelease=performance.now();clearGesture();}
const holdButton=$('#tickle-button');holdButton.addEventListener('pointerdown',e=>{e.preventDefault();holdButton.setPointerCapture(e.pointerId);beginHold();});
['pointerup','pointercancel','lostpointercapture','blur'].forEach(event=>holdButton.addEventListener(event,endHold));
[hitbox,holdButton].forEach(el=>{el.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!e.repeat)beginHold();}});el.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();endHold();}});});
holdButton.addEventListener('click',e=>{if(e.detail===0&&performance.now()-lastRelease>250)tickle();});
hitbox.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)||phase==='paused')return;e.preventDefault();if(phase!=='playing')startGame();const previous={...balloonAim};let dx=e.key==='ArrowRight'?.035:e.key==='ArrowLeft'?-.035:0,dy=e.key==='ArrowDown'?.035:e.key==='ArrowUp'?-.035:0;setBalloon(previous.x+dx,previous.y+dy);applyStroke(balloonAim.x,balloonAim.y,Math.hypot(dx*fw,dy*fh),Math.sign(dx||dy));});
$('#start-game').addEventListener('click',()=>{startGame();hitbox.focus({preventScroll:true});});$('#reset-game').addEventListener('click',resetGame);
$('#game-pause').addEventListener('click',()=>phase==='paused'?resumeGame():pauseGame());$('#resume-game').addEventListener('click',resumeGame);
for(const choice of ['free','challenge'])$('#mode-'+choice).addEventListener('click',()=>{if(mode===choice)return;mode=choice;$('#mode-free').setAttribute('aria-pressed',String(mode==='free'));$('#mode-challenge').setAttribute('aria-pressed',String(mode==='challenge'));$('#clock-label').textContent=mode==='free'?'NO RUSH':'SECONDS';resetGame();});
window.addEventListener('blur',pauseGame);document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame();});
setInterval(()=>{
 if(phase!=='playing')return;const now=performance.now();if(mode==='challenge'){remaining=Math.max(0,30-(now-roundStart)/1000);if(!remaining){endGame();return;}}
 if(now>=laughUntil){if(laughUntil){laughUntil=0;setMood('calm');speech.textContent='“Again? You’re trouble.”';}if(now-lastTickle>700){charge=Math.max(0,charge-1.2);combo=1;streak=0;stage.classList.remove('is-contact');puppet.style.setProperty('--lean','0deg');puppet.style.setProperty('--lean-x','0px');setMood(charge>25?'cracking':charge>5?'wink':'calm');if(charge===0&&now-lastTickle>2500)speech.textContent='“Keep moving. I can take it.”';}}
 renderGame();
},100);
placeBalloon();renderGame();
const fortunes=[
 ['Certified Menace','You came for the circus. You became the problem.'],
 ['Neon Muse','The lights are on you tonight. Give them something to remember.'],
 ['Beautiful Wildcard','Nobody knows your next move. Including you.'],
 ['Backstage VIP','Your name’s on the list. The bouncer has questions.'],
 ['Chaos Ringleader','Somebody has to run this circus. Unfortunately, it’s you.'],
 ['Shameless Flirt','One wink. Three distractions. Absolutely no regrets.'],
 ['Velvet Rebel','Rules are more of a costume suggestion, darling.'],
 ['Total Showstopper','The crowd forgot to blink. Take your bow.']
];
let wheelRotation=0,spinning=false,fortuneIndex=null;
function spinWheel(){
 if(spinning)return Promise.reject(new Error('The wheel is already spinning.'));
 spinning=true;$('#spin').disabled=true;$('#spin').textContent='Your fate is spinning…';
 const random=new Uint32Array(1);crypto.getRandomValues(random);const index=random[0]%fortunes.length;
 const target=(360-index*45)%360;wheelRotation+=360*5+((target-(wheelRotation%360)+360)%360);
 $('#wheel').style.transform=`rotate(${wheelRotation}deg)`;
 let tickInterval=setInterval(()=>tone(360+Math.random()*200,.04),150);
 return new Promise(resolve=>setTimeout(()=>{
  clearInterval(tickInterval);spinning=false;fortuneIndex=index;$('#spin').disabled=false;$('#spin').innerHTML='Spin again <span aria-hidden="true">✦</span>';
  $('#fortune-label').textContent='THE CIRCUS HAS SPOKEN';$('#fortune-name').textContent=fortunes[index][0];$('#fortune-text').textContent=fortunes[index][1];
  const r=$('#wheel').getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2);giggleSound();resolve({title:fortunes[index][0],message:fortunes[index][1]});
 },reducedMotion?100:4300));
}
$('#spin').addEventListener('click',()=>spinWheel().catch(()=>{}));
const dialog=$('#film-dialog'),film=$('#film-video');
const filmButtons=Array.from(document.querySelectorAll('[data-film]'));
let lastFilmTrigger=null,filmIndex=0,heroWasPlaying=false;
function selectFilm(index){
 filmIndex=(index+filmButtons.length)%filmButtons.length;const button=filmButtons[filmIndex];
 $('#film-title').textContent=button.dataset.title;$('#film-position').textContent=`${filmIndex+1} / ${filmButtons.length}`;
 film.src=`assets/${button.dataset.film}.mp4`;film.poster=`assets/${button.dataset.film}.webp`;film.play().catch(()=>{});
}
filmButtons.forEach((button,index)=>button.addEventListener('click',()=>{
 lastFilmTrigger=button;heroWasPlaying=!heroVideo.paused;
 heroVideo.pause();pauseGame();dialog.showModal();selectFilm(index);
}));
$('#previous-film').addEventListener('click',()=>selectFilm(filmIndex-1));
$('#next-film').addEventListener('click',()=>selectFilm(filmIndex+1));
$('#close-film').addEventListener('click',()=>dialog.close());
dialog.addEventListener('keydown',e=>{if(e.target===film)return;if(e.key==='ArrowRight'){e.preventDefault();selectFilm(filmIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();selectFilm(filmIndex-1);}});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{film.pause();film.removeAttribute('src');film.load();if(heroWasPlaying&&!reducedMotion)heroVideo.play().catch(()=>{});lastFilmTrigger?.focus();});
const looks={
 circus:{title:'Circus siren',label:'THE MAIN ATTRACTION',quote:'“Darling, the circus didn’t corrupt me. I corrupted the circus.”',alt:'PLUSSY in a glossy pink and blue circus outfit'},
 punk:{title:'Patent trouble',label:'PRETTY IN PINK. DANGEROUS IN BLACK.',quote:'“I came. I saw. I made it everybody’s problem.”',alt:'PLUSSY in a black patent collar with pink and blue clown makeup'},
 rebel:{title:'Neon rebel',label:'BAD MANNERS. EXCELLENT STOCKINGS.',quote:'“The dress code said trouble. I understood the assignment.”',alt:'PLUSSY in a white top, black skirt and blue striped stockings'}
};
const lookButtons=Array.from(document.querySelectorAll('[data-look]'));let flashTimer;
function flashPortrait(){
 const booth=$('.portrait-booth');clearTimeout(flashTimer);booth.classList.remove('flashing');void booth.offsetWidth;
 if(!reducedMotion)booth.classList.add('flashing');tone(980,.06);showToast('Looking criminally good. Tap “Take her with you” to save.');
 flashTimer=setTimeout(()=>booth.classList.remove('flashing'),550);
}
lookButtons.forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.look,look=looks[key];if(!look)return;
 lookButtons.forEach(b=>{const selected=b===button;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 const image=$('#backstage-image');image.src=`assets/backstage-${key}.webp`;image.alt=look.alt;image.dataset.look=key;
 $('#look-title').textContent=look.title;$('#look-label').textContent=look.label;$('#look-quote').textContent=look.quote;
 $('#download-look').href=image.src;$('#download-look').download=`PLUSSY-${key}.webp`;tone(620,.08);
}));
$('#flash-look').addEventListener('click',flashPortrait);
$('#copy-contract').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(CA);$('#copy-label').textContent='COPIED';showToast('PLUSSY contract address copied.');tone(760);setTimeout(()=>$('#copy-label').textContent='COPY',2200);}
 catch(_){const range=document.createRange();range.selectNodeContents($('#copy-contract code'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);showToast('Address selected. Use your device’s Copy command.');}
});
// Optional, progressive agent access to the same local game and fortune controls.
const context=document.modelContext;
if(context?.registerTool){
 const lifecycle=new AbortController();
 const validateEmpty=input=>{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Expected an empty object.');};
 [
  {name:'read_circus_state',title:'Read circus state',description:'Read the device-local tickle game and last fortune.',readOnly:true,execute(input){validateEmpty(input);return {...readGame(),spinning,fortune:fortuneIndex===null?null:fortunes[fortuneIndex][0]};}},
  {name:'tickle_plussy',title:'Tickle PLUSSY',description:'Play one tickle action, updating the on-screen giggle meter.',execute(input){validateEmpty(input);return tickle(true);}},
  {name:'spin_circus_fortune',title:'Spin circus fortune',description:'Spin the just-for-fun wheel and return its result. No money or tokens are involved.',execute(input){validateEmpty(input);return spinWheel();}}
 ].forEach(tool=>{try{Promise.resolve(context.registerTool({name:tool.name,title:tool.title,description:tool.description,inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:!!tool.readOnly,untrustedContentHint:false},execute:tool.execute},{signal:lifecycle.signal})).catch(()=>{});}catch(_){}});
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
