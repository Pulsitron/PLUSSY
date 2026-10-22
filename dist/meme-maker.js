(() => {
 'use strict';
 const root=document.getElementById('meme-maker');if(!root)return;
 const $=id=>document.getElementById(id),canvas=$('meme-canvas'),ctx=canvas.getContext('2d');
 const templates=[
  [
    "memes/plussy-01.jpg",
    "After-hours tease"
  ],
  [
    "memes/plussy-02.jpg",
    "Balloon trouble"
  ],
  [
    "memes/plussy-03.jpg",
    "Tongue out"
  ],
  [
    "memes/plussy-04.jpg",
    "Circus girls"
  ],
  [
    "memes/plussy-05.jpg",
    "Gym distraction"
  ],
  [
    "memes/plussy-06.jpg",
    "Midnight mischief"
  ],
  [
    "memes/plussy-07.jpg",
    "Over the shoulder"
  ],
  [
    "memes/plussy-08.jpg",
    "Ring mistress"
  ],
  [
    "memes/plussy-09.jpg",
    "Night-out menace"
  ],
  [
    "memes/plussy-10.jpg",
    "Neon stare"
  ],
  [
    "memes/plussy-11.jpg",
    "No filter"
  ],
  [
    "memes/plussy-12.jpg",
    "Striped trouble"
  ]
];
 const captions=[
  [
    "PRETTY FACE. FILTHY MIND.",
    "ABSOLUTELY FUCKING SHAMELESS."
  ],
  [
    "STEP RIGHT UP",
    "MY STANDARDS ARE ALREADY DOWN"
  ],
  [
    "GOOD GIRLS GO TO HEAVEN",
    "I RUN THE FUCKING CIRCUS"
  ],
  [
    "YOU HAD ME AT",
    "BAD FUCKING IDEA"
  ],
  [
    "MY OUTFIT SAYS CIRCUS",
    "MY DMs SAY OTHERWISE"
  ],
  [
    "CLOWN MAKEUP ON",
    "INNOCENT ACT OFF"
  ],
  [
    "KEEP YOUR HANDS TO YOURSELF",
    "YOUR THOUGHTS? TOO FUCKING LATE."
  ],
  [
    "THE DRESS CODE IS TIGHT",
    "THE MORALS ARE FLEXIBLE"
  ],
  [
    "ALL THIS CHEMISTRY",
    "AND NOT ONE GOOD INTENTION"
  ],
  [
    "I CAN EXPLAIN THE OUTFIT",
    "THE SEARCH HISTORY IS ANOTHER STORY"
  ],
  [
    "COME FOR THE SHOW",
    "STAY FOR THE INAPPROPRIATE THOUGHTS"
  ],
  [
    "THE BIG TOP IS OPEN",
    "BEHAVE LIKE YOU HAVE SOME FUCKING SENSE"
  ],
  [
    "I PUT THE ASS",
    "IN CLASS ACT"
  ],
  [
    "YOUR SCREEN TIME IS UP",
    "YOUR MIND IS IN THE GUTTER"
  ],
  [
    "SEND NUDES?",
    "SEND A FUCKING PERSONALITY FIRST"
  ],
  [
    "SHE’S A WALKING RED FLAG",
    "AND YOU’RE ALREADY IN THE QUEUE"
  ],
  [
    "MY HALO FELL OFF",
    "THE NECKLINE FOLLOWED"
  ],
  [
    "THEY ASKED FOR FAMILY FRIENDLY",
    "I ASKED WHICH FUCKING FAMILY"
  ],
  [
    "NO BRAINS. ALL BRASS.",
    "WELCOME TO THE CIRCUS, BITCH."
  ],
  [
    "FIFTY SHADES OF CLOWN",
    "ZERO SHADES OF SHAME"
  ],
  [
    "THE LIPSTICK IS SMEARED",
    "THE ALIBI IS IMMACULATE"
  ],
  [
    "YOUR MUM SAID BE GOOD",
    "I’M A TERRIBLE FUCKING LISTENER"
  ],
  [
    "HORNY ON MAIN?",
    "DARLING, THIS IS THE MAIN ATTRACTION."
  ],
  [
    "I’M NOT YOUR TYPE",
    "I’M YOUR NEXT BAD DECISION."
  ]
];
 let currentImage=null,currentIndex=-1,currentName='PLUSSY',requestId=0,loading=false,exporting=false,lastCaptionIndex=0;
 const buttons=templates.map(([file,name],index)=>{
  const button=document.createElement('button');button.type='button';button.className='meme-template';button.title=name;
  button.setAttribute('aria-label',`Use ${name}`);button.setAttribute('aria-pressed','false');
  const image=document.createElement('img');image.src=`assets/${file}`;image.alt='';image.loading='lazy';image.width=90;image.height=90;
  button.append(image);button.addEventListener('click',()=>chooseTemplate(index));$('meme-templates').append(button);return button;
 });
 $('meme-template-count').textContent=`${templates.length} LOOKS`;
 function status(message){$('meme-status').textContent=message;}
 function busy(value){loading=value;$('meme-loading').hidden=!value;$('meme-download').disabled=value||!currentImage||exporting;canvas.setAttribute('aria-busy',String(value));}
 function font(size){ctx.font=`700 ${size}px "Barlow Condensed", Impact, "Arial Narrow", sans-serif`;}
 function wrapText(text,size,maxWidth){
  font(size);const lines=[];
  for(const paragraph of text.toUpperCase().replace(/\r/g,'').split('\n')){
   let line='';
   for(const word of paragraph.trim().split(/\s+/).filter(Boolean)){
    if(ctx.measureText(word).width>maxWidth){
     if(line){lines.push(line);line='';}
     for(const char of Array.from(word)){if(line&&ctx.measureText(line+char).width>maxWidth){lines.push(line);line='';}line+=char;}
    }else if(line&&ctx.measureText(`${line} ${word}`).width>maxWidth){lines.push(line);line=word;}
    else line=line?`${line} ${word}`:word;
   }
   if(line)lines.push(line);
  }
  return lines;
 }
 function caption(text,position){
  if(!text.trim())return;
  const maxWidth=canvas.width-80,maxHeight=220;let size=Number($('meme-size').value),lines=wrapText(text,size,maxWidth);
  while(size>18&&(lines.length*size*1.05>maxHeight||lines.length>4)){size-=2;lines=wrapText(text,size,maxWidth);}
  const height=lines.length*size*1.05,top=position==='top'?30:canvas.height-50-height;
  ctx.save();font(size);ctx.textAlign='center';ctx.textBaseline='top';ctx.lineJoin='round';ctx.miterLimit=2;
  ctx.fillStyle=$('meme-color').value;ctx.strokeStyle='#140b1d';ctx.lineWidth=Math.max(4,size*.09);
  ctx.shadowColor='#0009';ctx.shadowBlur=5;ctx.shadowOffsetY=2;
  lines.forEach((line,index)=>{const y=top+index*size*1.05;ctx.strokeText(line,512,y);ctx.fillText(line,512,y);});ctx.restore();
 }
 function render(){
  $('meme-top-count').textContent=`${$('meme-top').value.length} / 120`;$('meme-bottom-count').textContent=`${$('meme-bottom').value.length} / 120`;
  $('meme-size-value').value=$('meme-size').value;
  ctx.fillStyle='#170b25';ctx.fillRect(0,0,1024,1024);
  if(currentImage){
   const w=currentImage.naturalWidth,h=currentImage.naturalHeight,scale=$('meme-layout').value==='cover'?Math.max(1024/w,1024/h):Math.min(1024/w,1024/h);
   const dw=w*scale,dh=h*scale;ctx.drawImage(currentImage,(1024-dw)/2,(1024-dh)/2,dw,dh);
   caption($('meme-top').value,'top');caption($('meme-bottom').value,'bottom');
   ctx.save();ctx.font='700 19px "Barlow Condensed", sans-serif';ctx.textAlign='right';ctx.textBaseline='bottom';ctx.fillStyle='#a9ffff';ctx.strokeStyle='#170b25';ctx.lineWidth=4;ctx.strokeText('$PLUSSY',1000,1006);ctx.fillText('$PLUSSY',1000,1006);ctx.restore();
  }
  canvas.setAttribute('aria-label',`${currentName} meme. Top: ${$('meme-top').value||'blank'}. Bottom: ${$('meme-bottom').value||'blank'}.`);
 }
 function loadPicture(src,index,name,revoke=false){
  const token=++requestId;busy(true);status(`Loading ${name}…`);const image=new Image();image.decoding='async';
  const clean=()=>{if(revoke)URL.revokeObjectURL(src);};
  image.onload=()=>{
   clean();if(token!==requestId)return;
   if(image.naturalWidth*image.naturalHeight>40000000){busy(false);status('That image is too large. Try one below 40 megapixels.');return;}
   currentImage=image;currentIndex=index;currentName=name;
   buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
   render();busy(false);status(`${name} ready. Edit the captions, then download your PNG.`);
  };
  image.onerror=()=>{clean();if(token!==requestId)return;busy(false);status('That image could not be opened. Choose another picture or try a JPG, PNG or WebP.');};
  image.src=src;
 }
 function chooseTemplate(index){const [file,name]=templates[index];loadPicture(`assets/${file}`,index,name);}
 for(const id of ['meme-top','meme-bottom','meme-size','meme-color','meme-layout'])$(id).addEventListener('input',render);
 $('meme-upload').addEventListener('change',event=>{
  const file=event.target.files[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){status('Please choose a JPG, PNG or WebP image.');return;}
  if(file.size>10*1024*1024){status('That file is over 10 MB. Please choose a smaller image.');return;}
  const reader=new FileReader(),token=++requestId;busy(true);status('Reading your image…');
  reader.onload=()=>{event.target.value='';if(token===requestId)loadPicture(reader.result,-1,'Your uploaded image');};
  reader.onerror=()=>{event.target.value='';if(token!==requestId)return;busy(false);status('That file could not be read. Please choose it again.');};
  reader.readAsDataURL(file);
 });
 $('meme-random').addEventListener('click',()=>{
  let index=Math.floor(Math.random()*templates.length);if(index===currentIndex)index=(index+1)%templates.length;
  let captionIndex=Math.floor(Math.random()*captions.length);if(captionIndex===lastCaptionIndex)captionIndex=(captionIndex+1)%captions.length;lastCaptionIndex=captionIndex;const pair=captions[captionIndex];$('meme-top').value=pair[0];$('meme-bottom').value=pair[1];render();chooseTemplate(index);
 });
 $('meme-reset').addEventListener('click',()=>{
  lastCaptionIndex=0;$('meme-top').value=captions[0][0];$('meme-bottom').value=captions[0][1];$('meme-size').value='72';$('meme-layout').value='contain';$('meme-color').value='#ffffff';render();chooseTemplate(0);
 });
 const fontReady=document.fonts?document.fonts.load('700 72px "Barlow Condensed"').catch(()=>{}):Promise.resolve();
 fontReady.then(render);
 $('meme-download').addEventListener('click',async()=>{
  if(loading||!currentImage||exporting)return;exporting=true;$('meme-download').disabled=true;
  try{
   await fontReady;if(loading){status('Wait for your chosen image to finish loading, then download.');return;}render();
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('PNG unavailable')),'image/png'));
   const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='PLUSSY-meme.png';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
   status('PNG ready. Check your downloads, or save it from your browser’s image preview.');
  }catch(_){status('The download could not be created. Try another image and download again.');}
  finally{exporting=false;$('meme-download').disabled=loading||!currentImage;}
 });
 render();chooseTemplate(0);
})();
