const chapters = [
  {title:'Постановка вопроса',short:'Вопрос к AI',start:0,end:37,description:'Основатель, история LLM и проблема надёжности.'},
  {title:'Новый подход',short:'Новый подход',start:37,end:60,description:'От человеческого контроля — к System One и RLCD.'},
  {title:'Как это работает',short:'Как это работает',start:60,end:110,description:'Демонстрация, последовательные и параллельные вычисления.'},
  {title:'Анонс Jev',short:'Анонс Jev',start:110,end:125,description:'Название, свойства модели, скорость и цена.'},
  {title:'Доказательства и финал',short:'Финал',start:125,end:176,description:'Сравнения, финальное сообщение и дисклеймер.'}
];

// End times are exclusive: every second from 00:00 through 02:55 belongs to exactly one scene.
const scenes = [
  [0,8,'Основатель и представление','Имя и опыт Diogo Almeida'],
  [8,12,'RLHF и модели','Графическая схема обучения'],
  [12,18,'Instruction Following','Схема инструкции и пример чата'],
  [18,23,'Главный вопрос','Почему «сверхчеловеческий» чат не привёл к AGI?'],
  [23,27,'Ответ: пока нет','AGI и вопрос на триллион долларов'],
  [27,32,'Why Not?','LLM, RLHF и оптимизация под предпочтения'],
  [32,37,'Три недостатка','Mode dropping · Overconfidence · Reliability'],
  [37,43,'Зависимость от человека','Humans-in-the-loop и отсутствие настоящей автоматизации'],
  [43,51,'Два года в тени','TypeSafe представляет новый тип foundation model'],
  [51,57,'System One','Архитектура, sampler и алгоритм обучения'],
  [57,60,'RLCD','Схема обучения, решений и калибровки'],
  [60,62,'Улучшения очевидны','Переход к демонстрации'],
  [62,75,'Два терминала','Сопоставление результатов в параллельных окнах'],
  [75,78,'Последовательная генерация','Как LLM создаёт ответ шаг за шагом'],
  [78,82,'Разговор ≠ вычисление','От естественного диалога к задачам компьютера'],
  [82,87,'Извлечь интеллект','Переход от LLM к новому принципу'],
  [87,90,'Аналогия с трансформерами','Сравнение с переходом от RNN'],
  [90,95,'От sequential к parallel','Анимированная сетка параллельных вычислений'],
  [95,99,'Уровень уверенности','Трёхмерная визуализация confidence level'],
  [99,103,'Точность структурированного вывода','Столбчатое сравнение моделей'],
  [103,107,'Четыре свойства','Reliable · Fast · Self-consistent · Type-safe'],
  [107,110,'Экосистема применений','Модель в центре, приложения вокруг'],
  [110,113,'Анонс имени','We’re releasing Jev'],
  [113,115,'Первая System One модель','Публичный запуск'],
  [115,117,'Скорость','71× → 100× быстрее'],
  [117,120,'AI в реальном времени','Real-time AI is finally possible'],
  [120,122,'Дешевле','8× → 100× дешевле'],
  [122,125,'Стоимость','Цена за миллиард токенов'],
  [125,129,'Сравнение цен','Jev в таблице стоимости моделей'],
  [129,134,'Intelligence / Cost','Jev на диаграмме конкурентов'],
  [134,137,'Это только начало','Финальный тезис основателя'],
  [137,139,'Что вы построите?','Основатель в ярко-розовой куртке'],
  [139,143,'Логотип и манифест','We’re building Prod, Not God'],
  [143,148,'Адрес проекта','Логотип и typesafe.ai'],
  [148,176,'Дисклеймер','Розовый экран с последовательным выделением текста']
].map(([start,end,title,subtitle],index)=>({start,end,title,subtitle,index}));

const stamp = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s)%60).padStart(2,'0')}`;
const preciseStamp = s => `${stamp(s)}${s%1 ? `.${String(Math.round((s%1)*100)).padStart(2,'0')}` : ''}`;
const frameSrc = s => `frames/${stamp(s).replace(':','-')}.jpg`;
const sceneAt = second => scenes.find(s => s.start <= second && second < s.end);
const keyframes = scenes.flatMap(scene => window.keyframeTimes[scene.index].map((time,index)=>({time,sceneIndex:scene.index,src:`keyframes/scene-${String(scene.index+1).padStart(2,'0')}-state-${String(index+1).padStart(2,'0')}.jpg`})));
const allFrames = scenes.flatMap(scene => Array.from({length:scene.end-scene.start},(_,i)=>({time:scene.start+i,sceneIndex:scene.index,src:frameSrc(scene.start+i)})));
let mode='key',activeHover=null;
const displayedFrames=()=>mode==='key'?keyframes:allFrames;
const container = document.querySelector('#scenes');
document.querySelector('#scene-count').textContent = scenes.length;
document.querySelector('#state-count').textContent = keyframes.length;
document.querySelector('#row-count').textContent = `/ ${scenes.length} СЦЕН`;

chapters.forEach((chapter, chapterIndex) => {
  const anchor = `chapter-${chapterIndex+1}`;
  document.querySelector('#chapter-nav').insertAdjacentHTML('beforeend',`<a class="nav-link" href="#${anchor}">${chapter.short}<span class="nav-time">${stamp(chapter.start)} — ${stamp(chapter.end)}</span></a>`);
  const section = document.createElement('section');
  section.id = anchor;
  section.className = 'chapter-group';
  section.innerHTML = `<div class="chapter"><span class="chapter-label">ГЛАВА ${String(chapterIndex+1).padStart(2,'0')} / 05</span><h2>${chapter.title}</h2><p>${chapter.description}</p></div>`;
  scenes.filter(s=>s.start>=chapter.start && s.start<chapter.end).forEach(scene=>{
    const row=document.createElement('article');
    row.className='scene';
    row.dataset.search=`${scene.title} ${scene.subtitle} ${stamp(scene.start)} ${stamp(scene.end-1)}`.toLowerCase();
    row.dataset.scene=scene.index;
    row.innerHTML=`<div class="scene-head"><span class="scene-no">${String(scene.index+1).padStart(2,'0')}</span><span class="scene-name">${scene.title}</span><span class="time">${stamp(scene.start)} — ${stamp(scene.end)}</span></div><div class="scene-sub">${scene.subtitle}</div><div class="scene-body"><div class="clip"><div class="clip-label"><span class="live-dot"></span> ВИДЕО СЦЕНЫ <span>${scene.end-scene.start} СЕК</span></div><video class="scene-video" controls playsinline preload="none" poster="${keyframes.find(f=>f.sceneIndex===scene.index).src}" src="clips/scene-${String(scene.index+1).padStart(2,'0')}.mp4" aria-label="Видеоклип: ${scene.title}"></video></div><div class="strip-wrap"><div class="strip-label">КЛЮЧЕВЫЕ СОСТОЯНИЯ <span>НАВЕДИ ДЛЯ ПЕРЕХОДА →</span></div><div class="filmstrip"></div></div></div>`;
    section.append(row);
  });
  container.append(section);
});

function renderStrips(){
  stopHover();
  document.querySelectorAll('.scene').forEach(row=>{
    const scene=scenes[Number(row.dataset.scene)],strip=row.querySelector('.filmstrip');
    strip.replaceChildren();
    const frames=displayedFrames().filter(f=>f.sceneIndex===scene.index);
    row.querySelector('.strip-label').firstChild.textContent=mode==='key'?'КЛЮЧЕВЫЕ СОСТОЯНИЯ ':'КАЖДАЯ СЕКУНДА ';
    frames.forEach((frame,index)=>{
      const button=document.createElement('button');
      button.className='frame';button.type='button';button.dataset.time=frame.time;
      button.dataset.next=frames[index+1]?.time??scene.end;
      button.dataset.nextImage=frames[index+1]?.src??'';
      button.setAttribute('aria-label',`Открыть состояние ${preciseStamp(frame.time)}; наведите для просмотра перехода`);
      button.innerHTML=`<img src="${frame.src}" loading="lazy" alt="Состояние ${preciseStamp(frame.time)}"><span class="frame-time">${preciseStamp(frame.time)} <span class="play-hint">▶ переход</span></span>`;
      strip.append(button);
    });
  });
}
renderStrips();

['key','all'].forEach(which=>document.querySelector(`#${which}-mode`).addEventListener('click',()=>{
  mode=which;document.querySelector('#key-mode').classList.toggle('selected',mode==='key');document.querySelector('#all-mode').classList.toggle('selected',mode==='all');renderStrips();
}));

container.addEventListener('play',event=>{
  if(event.target.matches('.scene-video'))document.querySelectorAll('.scene-video').forEach(other=>{if(other!==event.target)other.pause()});
},true);

function stopHover(){
  if(!activeHover)return;
  activeHover.video.pause();activeHover.video.remove();
  activeHover.button.querySelector('img').src=activeHover.original;
  activeHover=null;
}
container.addEventListener('pointerover',event=>{
  if(event.pointerType==='touch')return;
  const button=event.target.closest('.frame');
  if(!button||button===activeHover?.button||button.contains(event.relatedTarget))return;
  stopHover();
  const scene=scenes[Number(button.closest('.scene').dataset.scene)];
  const start=Number(button.dataset.time)-scene.start,end=Number(button.dataset.next)-scene.start;
  const preview=document.createElement('video');
  preview.className='hover-video';preview.muted=true;preview.playsInline=true;preview.preload='auto';
  const img=button.querySelector('img');
  activeHover={button,video:preview,original:img.src};
  preview.addEventListener('loadedmetadata',()=>{
    if(activeHover?.video!==preview)return;
    if(start<.02)preview.play().catch(()=>{});
    else preview.currentTime=start;
  },{once:true});
  preview.addEventListener('seeked',()=>{if(activeHover?.video===preview)preview.play().catch(()=>{})},{once:true});
  preview.addEventListener('timeupdate',()=>{
    if(preview.currentTime>=end-.06){
      preview.pause();
      if(button.dataset.nextImage){img.src=button.dataset.nextImage;preview.remove()}
      else preview.currentTime=Math.max(start,end-.08);
    }
  });
  button.append(preview);
  preview.src=`clips/scene-${String(scene.index+1).padStart(2,'0')}.mp4`;
});
container.addEventListener('pointerout',event=>{
  const button=event.target.closest('.frame');
  if(button&&button===activeHover?.button&&!button.contains(event.relatedTarget))stopHover();
});

const search=document.querySelector('#search');
search.addEventListener('input',()=>{
  const q=search.value.trim().toLowerCase();let count=0;
  document.querySelectorAll('.chapter-group').forEach(group=>{
    let visible=0;
    group.querySelectorAll('.scene').forEach(row=>{const match=row.dataset.search.includes(q);row.hidden=!match;if(match)visible++});
    group.hidden=!visible;count+=visible;
  });
  document.querySelector('#empty').hidden=!!count;
  document.querySelector('#row-count').textContent=`/ ${count} СЦЕН`;
});

const viewer=document.querySelector('#viewer'),image=document.querySelector('#viewer-image'),video=document.querySelector('#viewer-video');
let current=0,returnFocus=null;
function show(index){
  const frames=displayedFrames();
  current=Math.max(0,Math.min(frames.length-1,index));
  const frame=frames[current],scene=scenes[frame.sceneIndex];
  image.src=frame.src;image.alt=`Кадр ${preciseStamp(frame.time)} — ${scene.title}`;
  document.querySelector('#viewer-time').textContent=preciseStamp(frame.time);
  document.querySelector('#viewer-scene').textContent=`· ${scene.title}`;
  document.querySelector('#viewer-position').textContent=`Состояние ${current+1} из ${frames.length}`;
  image.hidden=false;video.hidden=true;video.pause();
  document.querySelector('#toggle-video').textContent='▶ Смотреть с этого момента';
}
container.addEventListener('click',event=>{const button=event.target.closest('[data-time]');if(!button)return;stopHover();returnFocus=button;show(displayedFrames().findIndex(f=>f.time===Number(button.dataset.time)));viewer.hidden=false;document.body.style.overflow='hidden';document.querySelector('#close').focus()});
function close(){viewer.hidden=true;document.body.style.overflow='';video.pause();if(returnFocus)returnFocus.focus()}
document.querySelector('#close').onclick=close;
document.querySelector('[data-close]').onclick=close;
document.querySelector('#prev').onclick=()=>show(current-1);
document.querySelector('#next').onclick=()=>show(current+1);
document.querySelector('#toggle-video').onclick=()=>{
  if(video.hidden){video.hidden=false;image.hidden=true;if(!video.src)video.src='video.mp4';video.currentTime=displayedFrames()[current].time;video.play().catch(()=>{});document.querySelector('#toggle-video').textContent='▣ Вернуться к кадру'}
  else show(current);
};
document.addEventListener('keydown',event=>{if(viewer.hidden)return;if(event.key==='Escape')close();if(event.key==='ArrowLeft')show(current-1);if(event.key==='ArrowRight')show(current+1)});

const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;document.querySelectorAll('.nav-link').forEach(link=>link.classList.toggle('active',link.hash===`#${entry.target.id}`))})},{rootMargin:'-10% 0px -75% 0px'});
document.querySelectorAll('.chapter-group').forEach(el=>navObserver.observe(el));
