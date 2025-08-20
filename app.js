
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const store = { get(k,d=null){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}, set(k,v){localStorage.setItem(k,JSON.stringify(v))}, del(k){localStorage.removeItem(k)} };
  const LEVELS = ['A1','A2','B1','B2','C1'];
  const BASELINE = {A1:0,A2:20,B1:40,B2:60,C1:80};
  const LEVEL_COUNTS = {A1:20,A2:20,B1:20,B2:20,C1:20};
  const TOTAL_LESSONS = Object.values(LEVEL_COUNTS).reduce((a,b)=>a+b,0);

  // Theme
  const themeBtn = $('#toggleTheme');
  function setTheme(t){ document.documentElement.setAttribute('data-theme', t); store.set('theme', t); }
  setTheme(store.get('theme','light'));
  themeBtn.addEventListener('click', ()=> setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));

  // Date & streak
  $('#today').textContent = new Date().toLocaleDateString();
  function updateStreak(){
    const today = new Date().toDateString();
    const last = store.get('lastOpen','');
    let streak = store.get('streak',0);
    if(last !== today){ const y = new Date(Date.now()-86400000).toDateString(); streak = (last===y)?streak+1:1; store.set('streak', streak); store.set('lastOpen', today); }
    $('#streak').textContent = streak;
  }
  updateStreak();

  // Tabs
  $$('.tabs button').forEach(btn=> btn.addEventListener('click', ()=>{
    $$('.tabs button').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    $$('.tabcard').forEach(sec=> sec.classList.add('hidden')); $('#'+btn.dataset.tab).classList.remove('hidden');
  }));

  // Reset
  $('#resetBtn').addEventListener('click', ()=>{ if(confirm('Resetovať všetko?')){ localStorage.clear(); location.reload(); } });

  // Onboarding (30+5)
  const dlgOn = $('#onboard'), quizStage = $('#quizStage'), stepDots = $('#stepDots');
  const TOPIC_QUESTIONS = [
    { q:'Na čo budeš nemčinu najviac potrebovať v najbližších 3 mesiacoch?', opts:[
      {label:'Práca a kariéra', topic:'Práca a kariéra'}, {label:'Úradné záležitosti', topic:'Úradné záležitosti'},
      {label:'Cestovanie a príroda', topic:'Príroda a cestovanie'}, {label:'Domov a stavba', topic:'Domov a stavba'},
      {label:'Rodina a každodenný život', topic:'Rodina a vzťahy'} ]},
    { q:'Ktorú situáciu riešiš najčastejšie?', opts:[
      {label:'Telefonáty a emaily v práci', topic:'Práca a kariéra'}, {label:'Byrokracia, formuláre', topic:'Úradné záležitosti'},
      {label:'Nákup, reštaurácia, služby', topic:'Jedlo a reštaurácie'}, {label:'Doprava v meste', topic:'Príroda a cestovanie'},
      {label:'Zdravie, lekár', topic:'Šport a zdravie'} ]},
    { q:'Aký typ textov ťa baví čítať?', opts:[
      {label:'Správy, politika', topic:'Politika a spoločnosť'}, {label:'Technológie, veda', topic:'Technológie a veda'},
      {label:'Kultúra, filmy, hudba', topic:'Kultúra a voľný čas'}, {label:'Biznis, ekonomika', topic:'Práca a kariéra'},
      {label:'Literatúra, knihy', topic:'Literatúra a umenie'} ]},
    { q:'V akom odvetví pracuješ/plánuješ?', opts:[
      {label:'Stavebníctvo, remeslá', topic:'Domov a stavba'}, {label:'Administratíva, office', topic:'Úradné záležitosti'},
      {label:'IT a technológie', topic:'Technológie a veda'}, {label:'Zdravotníctvo', topic:'Šport a zdravie'},
      {label:'Gastro, služby', topic:'Jedlo a reštaurácie'} ]},
    { q:'Ktorú úlohu chceš zvládnuť ako prvú?', opts:[
      {label:'Pracovný pohovor', topic:'Práca a kariéra'}, {label:'Objednať termín na úrade', topic:'Úradné záležitosti'},
      {label:'Prenájom bytu', topic:'Domov a stavba'}, {label:'Plánovanie výletu', topic:'Príroda a cestovanie'},
      {label:'Sťažnosť na službu', topic:'Úradné záležitosti'} ]},
  ];
  function buildKnowledgeQuiz(){
    const Q=[];
    // Same 30 Q as earlier, compressed here:
    const push=(q,opts,a,l)=>Q.push({q,opts,a,level:l});
    // A1
    push('Čo znamená „Apfel“?',['auto','jablko','stôl','pes','Neviem'],1,'A1');
    push('Doplň: Ich ___ Peter.',['bist','bin','sind','seid','Neviem'],1,'A1');
    push('„Wie geht’s?“ znamená:',['Koľko to stojí?','Ako sa máš?','Kde bývaš?','Odkiaľ si?','Neviem'],1,'A1');
    push('Vyber správny člen: ___ Tisch.',['der','die','das','-','Neviem'],0,'A1');
    push('Prelož: „Guten Abend“',['Dobrú noc','Dobrý večer','Dobré ráno','Dobrý deň','Neviem'],1,'A1');
    push('„heute“ znamená:',['zajtra','dnes','včera','teraz','Neviem'],1,'A1');
    // A2
    push('„Ich habe gestern ein Buch ___.“',['kaufe','gekauft','kaufen','geholt','Neviem'],1,'A2');
    push('„Morgen fahre ich nach Berlin.“ Kedy cestujem?',['včera','dnes','zajtra','nikdy','Neviem'],2,'A2');
    push('„Arzt“ znamená:',['učiteľ','lekár','študent','šofér','Neviem'],1,'A2');
    push('Ich bin ___ Bahnhof.',['in','auf','am','im','Neviem'],3,'A2');
    push('„Ich ___ ins Kino gehen.“',['muss','müsst','müssen','musst','Neviem'],0,'A2');
    push('„___ du Kaffee?“',['Trinkst','Trinkest','Trinkt','Trinken','Neviem'],0,'A2');
    // B1
    push('„Wenn ich Zeit ___, …“',['habe','hat','haben','hätte','Neviem'],0,'B1');
    push('„Obwohl es regnet, …“',['Idú spať','Nejdú nikam','Idú na prechádzku','Je pekne','Neviem'],2,'B1');
    push('„Umweltverschmutzung“ je:',['Výlet','Ochrana prírody','Znečistenie','Počasie','Neviem'],2,'B1');
    push('„…, weil ich keine Zeit ___.“',['habe','hat','haben','gehabt','Neviem'],0,'B1');
    push('Konjunktiv II: „Ich ___ gern bezahlen.“',['werde','würde','wäre','hätte','Neviem'],1,'B1');
    push('Perfekt s „sein“: „Ich ___ gegangen.“',['habe','bin','war','wurde','Neviem'],1,'B1');
    // B2
    push('„…, dass er gestern krank ___.“',['war','ist','wäre','gewesen','Neviem'],0,'B2');
    push('„___ des Regens bleiben wir…“',['Wegen','Trotz','Bei','Während','Neviem'],0,'B2');
    push('„…, dass er morgen kommen ___.“',['kann','kommt','gekommen','kommen wird','Neviem'],0,'B2');
    push('Nepriama reč: „Er sagt, er ___ krank.“',['sei','ist','war','wäre','Neviem'],0,'B2');
    push('Digitalizácia… Čo s trhom práce?',['Zostáva rovnaký','Zaniká úplne','Mení sa','Je stabilný','Neviem'],2,'B2');
    push('„Herausforderung“:',['Výzva','Riešenie','Problém','Diskusia','Neviem'],0,'B2');
    // C1
    push('„Hätte ich mehr Zeit gehabt, ___ ich…“',['bin','war','wäre','wurde','Neviem'],2,'C1');
    push('Pasívum: „Das Haus ___ 1990 gebaut.“',['wird','ist','wurde','sei','Neviem'],2,'C1');
    push('Nominalizácia: „das ___“ (učenie sa)',['Lernen','Gelerntes','Lernend','Gelehrte','Neviem'],0,'C1');
    push('„Zum einen …“ správny pár',['…darüber hinaus','…zum anderen','…denn','…trotzdem','Neviem'],1,'C1');
    push('„wesentlich“ =',['nepatrný','podstatný','dočasný','zvedavý','Neviem'],1,'C1');
    push('„Freiheit vs. Unabhängigkeit“ je:',['rovnaké','úzko súvisia, nie totožné','protiklady','nesúvisia','Neviem'],1,'C1');
    return Q;
  }
  let QUIZ = buildKnowledgeQuiz();
  function totalSteps(){ return QUIZ.length + TOPIC_QUESTIONS.length; }
  let qi = 0; const answers=[]; const topicScores={};
  function levelFromScore(score){ if(score<=6)return'A1'; if(score<=12)return'A2'; if(score<=18)return'B1'; if(score<=24)return'B2'; return'C1' }
  function buildStepDots(){ const sd=$('#stepDots'); sd.innerHTML=''; for(let i=0;i<totalSteps();i++){ const d=document.createElement('i'); if(i===qi)d.classList.add('active'); sd.appendChild(d);} }
  function renderQuestion(){
    buildStepDots(); const st=$('#quizStage'); st.innerHTML='';
    if(qi < QUIZ.length){
      const it = QUIZ[qi]; const card=document.createElement('div'); card.className='card';
      card.innerHTML=`<div><b>${qi+1}/30 · ${it.q}</b></div>`; const box=document.createElement('div'); box.className='options';
      it.opts.forEach((op,idx)=>{ const lab=document.createElement('label'); lab.className='opt'; lab.innerHTML=`<input type="radio" name="q${qi}" value="${idx}"> ${op}`; box.appendChild(lab); });
      card.appendChild(box); st.appendChild(card); $('#skipQ').classList.remove('hidden');
    } else {
      const tIdx=qi-QUIZ.length; const it=TOPIC_QUESTIONS[tIdx]; const card=document.createElement('div'); card.className='card';
      card.innerHTML=`<div><b>Téma ${tIdx+1}/5 · ${it.q}</b></div>`; const box=document.createElement('div'); box.className='options';
      it.opts.forEach((o,idx)=>{ const lab=document.createElement('label'); lab.className='opt'; lab.innerHTML=`<input type="radio" name="t${tIdx}" value="${idx}"> ${o.label}`; box.appendChild(lab); });
      card.appendChild(box); st.appendChild(card); $('#skipQ').classList.add('hidden');
    }
  }
  $('#nextQ').addEventListener('click', ()=>{
    if(qi < QUIZ.length){
      const picked=document.querySelector(`input[name="q${qi}"]:checked`); const it=QUIZ[qi];
      const val=picked?Number(picked.value):(it.opts.length-1); answers[qi]={type:'knowledge',correct:val===it.a,level:it.level}; qi++; (qi<totalSteps())?renderQuestion():finalizeOnboarding();
    } else {
      const tIdx=qi-QUIZ.length; const picked=document.querySelector(`input[name="t${tIdx}"]:checked`); if(!picked){alert('Vyber jednu možnosť.'); return;}
      const it=TOPIC_QUESTIONS[tIdx]; const topic=it.opts[Number(picked.value)].topic; topicScores[topic]=(topicScores[topic]||0)+1; answers[qi]={type:'topic',pick:topic}; qi++; (qi<totalSteps())?renderQuestion():finalizeOnboarding();
    }
  });
  $('#prevQ').addEventListener('click', ()=>{ if(qi>0){ qi--; renderQuestion(); } });
  $('#skipQ').addEventListener('click', ()=>{ if(qi<QUIZ.length){ const it=QUIZ[qi]; answers[qi]={type:'knowledge',correct:false,level:it.level}; qi++; (qi<totalSteps())?renderQuestion():finalizeOnboarding(); } });
  $('#closeOnboard').addEventListener('click', ()=>{ if(confirm('Zatvoriť kvíz? Odporúčame dokončiť.')) dlgOn.close(); });

  function finalizeOnboarding(){
    const correct=answers.filter(a=>a?.type==='knowledge'&&a.correct).length;
    const lvl=levelFromScore(correct); store.set('level',lvl); $('#levelTag').textContent='Level: '+lvl;
    const topicsSorted=Object.entries(topicScores).sort((a,b)=>b[1]-a[1]).map(e=>e[0]); const priorities=topicsSorted.slice(0,3); if(priorities.length===0) priorities.push('Základy (A1)');
    store.set('priorities',priorities); $('#nextTopic').textContent=priorities[0]||'Základy';
    store.set('completedLessons',0); store.set('baseline',BASELINE[lvl]||0); store.set('onboarded',true);
    dlgOn.close(); renderLessonsOverview(); renderCurrentLesson(); updateProgress();
    alert(`Počiatočný level: ${lvl}\nPrioritné témy: ${priorities.join(', ')}`);
  }

  // Lessons (sequential)
  const LESSON_IDS = ['A1-01','A1-02','A1-03','A1-04','A1-05','C1-01']; // demo
  async function fetchLesson(id){
    const path = id.startsWith('A1') ? `modules/lessons/A1/lesson_${id.split('-')[1]}.json`
                                    : `modules/lessons/C1/lesson_${id.split('-')[1]}.json`;
    const r = await fetch(path); return r.json();
  }
  function renderLessonsOverview(){
    const host = $('#lessons'); host.innerHTML='';
    LESSON_IDS.forEach((id,i)=>{
      const completed = store.get('done_'+id,false);
      const unlockedIndex = store.get('unlockedIndex',0) ?? 0;
      const locked = i>unlockedIndex;
      const row = document.createElement('div'); row.className='item';
      row.innerHTML = `<span>${id.replace('-', ' · ')}</span>
        <span class="row">
          ${completed?'<span class="pill">✅ Hotové</span>':locked?'<span class="pill">🔒 Zamknuté</span>':'<span class="pill">▶ Spustiť</span>'}
          <button class="btn small" ${locked?'disabled':''} data-id="${id}">Otvoriť</button>
        </span>`;
      row.querySelector('button').addEventListener('click', (e)=> openLessonById(e.currentTarget.dataset.id));
      host.appendChild(row);
    });
  }
  function renderCurrentLesson(){
    const idx = store.get('unlockedIndex',0) ?? 0;
    const id = LESSON_IDS[idx];
    const box = $('#currentLessonBox'); box.innerHTML='';
    const row = document.createElement('div'); row.className='item';
    row.innerHTML = `<span>${id.replace('-', ' · ')}</span><span class="row"><button class="btn small primary">Spustiť lekciu</button></span>`;
    row.querySelector('button').addEventListener('click', ()=> openLessonById(id));
    box.appendChild(row);
  }
  function totalRemainingFromBaseline(level){ let idx=LEVELS.indexOf(level), sum=0; for(let i=idx;i<LEVELS.length;i++){ sum+=LEVEL_COUNTS[LEVELS[i]]; } return sum; }
  function updateProgress(){
    const baseline=store.get('baseline',0); const startLevel=store.get('level','A1');
    const completed=store.get('completedLessons',0); const remaining=totalRemainingFromBaseline(startLevel);
    const gained=Math.round((completed/Math.max(1,remaining))*(100-baseline)); const pct=Math.min(100, baseline+gained);
    $('#progressBar').style.width=pct+'%'; $('#donePct').textContent=pct+'%';
  }

  // Lesson dialog
  const dlgLesson = $('#lessonDialog');
  $('#closeLesson').addEventListener('click', ()=> dlgLesson.close());
  $('#btnPrevLesson').addEventListener('click', ()=> navLesson(-1));
  $('#btnNextLesson').addEventListener('click', ()=> navLesson(1));
  let currentLessonIndex=0, currentLesson=null;

  async function openLessonById(id){
    const idx = LESSON_IDS.indexOf(id); if(idx<0) return;
    const unlockedMax = store.get('unlockedIndex',0) ?? 0; if(idx>unlockedMax) return;
    currentLessonIndex = idx; currentLesson = await fetchLesson(id); showLesson(currentLesson);
  }
  function navLesson(delta){
    const idx = currentLessonIndex + delta; const unlockedMax = store.get('unlockedIndex',0) ?? 0;
    if(idx<0 || idx>unlockedMax) return; openLessonById(LESSON_IDS[idx]);
  }

  function showLesson(L){
    $('#lessonTitle').textContent = `${L.level} · ${L.title}`;
    // vocab list + micro flashcards
    const vocabList=$('#vocabList'); vocabList.innerHTML='';
    const localDeck = (L.vocab||[]).map((p,i)=>({id:L.id+'-'+i,front:p[0],back:p[1]}));
    let q=[...localDeck]; let cur=q[0]||null;
    function updateCard(){ $('#queueInfo').textContent = `${q.indexOf(cur)+1||0} / ${q.length}`; $('#cardFront').textContent=cur?cur.front:'—'; $('#cardBack').textContent=cur?cur.back:'—'; $('#flashWrap').classList.remove('flipped'); }
    (L.vocab||[]).forEach(([de,sk])=>{ const it=document.createElement('div'); it.className='row'; it.innerHTML=`<span>${de}</span><span class="muted"> – ${sk}</span>`; vocabList.appendChild(it); });
    $('#flashWrap').onclick=()=>$('#flashWrap').classList.toggle('flipped'); $('#showBtn').onclick=()=>$('#flashWrap').classList.add('flipped');
    $('#knowBtn').onclick=()=>{ if(!cur)return; q.shift(); cur=q[0]||null; updateCard(); }; $('#dontBtn').onclick=()=>{ if(!cur)return; q.push(q.shift()); cur=q[0]||null; updateCard(); };
    updateCard();

    // grammar
    const gb=$('#grammarBlock'); gb.innerHTML='';
    if(L.grammar && L.grammar.title){ const t=document.createElement('div'); t.innerHTML=`<p class="muted"><b>${L.grammar.title}</b></p>`; gb.appendChild(t);
      if(L.grammar.table && L.grammar.table.length){ const table=document.createElement('table'); table.innerHTML='<tr><th>Osoba</th><th>Tvar</th><th>Príklad</th></tr>';
        L.grammar.table.forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td>`; table.appendChild(tr); }); gb.appendChild(table);
      } } else { gb.innerHTML='<p class="muted">Doplníme neskôr.</p>'; }

    // practice
    const pb=$('#practiceBlock'); pb.innerHTML='';
    (L.practice||[]).forEach((p,i)=>{
      if(p.type==='gap'){ const row=document.createElement('div'); row.className='row';
        row.innerHTML=`<span>${i+1}. ${p.q}</span> <input data-ans="${(p.answer||'').toLowerCase()}" style="flex:1;min-width:120px;border:1px solid var(--border);border-radius:10px;background:var(--card);color:var(--text);padding:6px">`; pb.appendChild(row);
      } else if(p.type==='translate'){ const row=document.createElement('div'); row.className='row';
        row.innerHTML=`<span>${i+1}. ${p.q}</span> <input data-ans="${(p.answer||'').toLowerCase()}" style="flex:1;min-width:120px;border:1px solid var(--border);border-radius:10px;background:var(--card);color:var(--text);padding:6px">`; pb.appendChild(row);
      }
    });

    // quiz
    const qb=$('#miniQuizBlock'); qb.innerHTML='';
    (L.quiz||[]).forEach((t,i)=>{ const card=document.createElement('div'); card.className='card'; card.innerHTML=`<div><b>${i+1}. ${t.q}</b></div>`;
      const box=document.createElement('div'); box.className='options'; t.opts.forEach((op,idx)=>{ const lab=document.createElement('label'); lab.className='opt'; lab.innerHTML=`<input type="radio" name="lq${i}" value="${idx}"> ${op}`; box.appendChild(lab); });
      card.appendChild(box); qb.appendChild(card);
    });
    $('#lessonQuizScore').textContent='';

    // output
    $('#outputTask').textContent = L.output || ''; $('#outputText').value='';

    // validation
    let passedVocab=true, passedPractice=false, passedQuiz=false, passedOutput=false;
    function updateComplete(){ $('#completeLesson').disabled=!(passedVocab && passedPractice && passedQuiz && passedOutput); }
    function checkPractice(){ let ok=0, total=0; $$('#practiceBlock input').forEach(inp=>{ total++; const val=(inp.value||'').trim().toLowerCase(); const ans=(inp.dataset.ans||'').trim().toLowerCase(); if(val===ans) ok++; }); passedPractice=(total>0 && ok/total>=0.7); updateComplete(); }
    $$('#practiceBlock input').forEach(inp=> inp.addEventListener('input', checkPractice));
    $('#gradeLessonQuiz').onclick=()=>{ let score=0; (L.quiz||[]).forEach((t,i)=>{ const p=document.querySelector(`input[name="lq${i}"]:checked`); if(p && Number(p.value)===t.a) score++; });
      $('#lessonQuizScore').textContent=`Skóre: ${score}/${(L.quiz||[]).length}`; passedQuiz=(score/Math.max(1,(L.quiz||[]).length))>=0.7; updateComplete(); };
    $('#outputText').addEventListener('input', ()=>{ passedOutput = $('#outputText').value.trim().length >= 30; updateComplete(); });

    $('#btnPrevLesson').disabled = (currentLessonIndex===0);
    $('#btnNextLesson').disabled = (currentLessonIndex >= (store.get('unlockedIndex',0)??0));
    $('#completeLesson').onclick=()=>{
      const id=L.id; store.set('done_'+id,true);
      const unlocked = Math.max(store.get('unlockedIndex',0)??0, currentLessonIndex);
      if(currentLessonIndex===unlocked && currentLessonIndex+1<LESSON_IDS.length){ store.set('unlockedIndex', currentLessonIndex+1); }
      const prev=store.get('completedLessons',0); store.set('completedLessons', prev+1);
      updateProgress(); dlgLesson.close(); renderLessonsOverview(); renderCurrentLesson();
      const totalDone = prev+1; if(totalDone % 5 === 0) setTimeout(()=> runCheckpointTest(totalDone), 10);
    };

    dlgLesson.showModal();
  }

  function runCheckpointTest(totalDone){
    const questions=[
      {q:'Doplň: Ich ___ müde.', opts:['bin','bist','sind','seid'], a:0},
      {q:'„Guten Tag“ =', opts:['Dobrú noc','Dobrý deň','Dobrý večer','Ahoj'], a:1},
      {q:'„…, weil ich müde ___.“', opts:['bin','bist','ist','seid'], a:0},
      {q:'„Herausforderung“ znamená:', opts:['Výzva','Problém','Riešenie','Počasie'], a:0},
    ];
    const d=document.createElement('dialog'); let html='<div class="card"><h3>Medzitest (kontrola po '+totalDone+'. lekcii)</h3></div>';
    questions.forEach((t,i)=>{ html+=`<div class="card"><div><b>${i+1}. ${t.q}</b></div><div class="options">`;
      t.opts.forEach((op,idx)=>{ html+=`<label class="opt"><input type="radio" name="cp${i}" value="${idx}"> ${op}</label>`; });
      html+='</div></div>'; });
    html += '<div class="row" style="margin-top:8px"><button id="cpGrade" class="btn primary">Vyhodnotiť</button><button id="cpClose" class="btn">Zavrieť</button></div>';
    d.innerHTML=html; document.body.appendChild(d);
    d.querySelector('#cpClose').onclick=()=>{ d.close(); d.remove(); };
    d.querySelector('#cpGrade').onclick=()=>{ let score=0; questions.forEach((t,i)=>{ const p=d.querySelector(`input[name="cp${i}"]:checked`); if(p && Number(p.value)===t.a) score++; });
      if(score<2){ const startLevel=store.get('level','A1'); const completed=store.get('completedLessons',0); const newC=Math.max(0,completed-1); store.set('completedLessons',newC); updateProgress(); alert(`Výsledok ${score}/${questions.length}. Progres upravený späť o 1 lekciu.`); } else { alert(`Výsledok ${score}/${questions.length}. Pokračuj!`); }
      d.close(); d.remove(); };
    d.showModal();
  }

  // Vocab modules UI
  async function listVocabModules(){
    // Hardcode list; GH Pages can't list directory
    const modules=[
      {id:'A1_basics', path:'modules/vocab/A1_basics.json'},
      {id:'A1_food',   path:'modules/vocab/A1_food.json'},
      {id:'A1_family', path:'modules/vocab/A1_family.json'},
      {id:'A2_travel', path:'modules/vocab/A2_travel.json'},
      {id:'B1_work',   path:'modules/vocab/B1_work.json'},
      {id:'B2_media',  path:'modules/vocab/B2_media.json'},
      {id:'C1_academia', path:'modules/vocab/C1_academia.json'},
      {id:'C1_politics', path:'modules/vocab/C1_politics.json'}
    ];
    const host=$('#vocab'); host.innerHTML='';
    modules.forEach(m=>{
      const row=document.createElement('div'); row.className='item';
      row.innerHTML = `<span>${m.id.replace('_',' · ')}</span><span class="row"><button class="btn small" data-path="${m.path}">Načítať</button></span>`;
      row.querySelector('button').addEventListener('click', ()=> loadVocabModule(m.path));
      host.appendChild(row);
    });
  }
  async function loadVocabModule(path){
    const r = await fetch(path); const data = await r.json();
    const host = $('#vocab'); const box=document.createElement('div'); box.className='card';
    box.innerHTML = `<h3>${data.level} · ${data.topic} (${data.words.length} slov)</h3>`;
    data.words.slice(0,200).forEach(w=>{ const it=document.createElement('div'); it.className='row'; it.innerHTML=`<span>${w.de}</span><span class="muted"> – ${w.sk}</span>`; box.appendChild(it); });
    host.appendChild(box);
  }

  // Init
  function init(){
    $('#levelTag').textContent='Level: '+(store.get('level','–'));
    if(!store.get('onboarded',false)){ dlgOn.showModal(); renderQuestion(); store.set('unlockedIndex',0); }
    else { $('#nextTopic').textContent=(store.get('priorities',[])[0]||'Základy'); renderLessonsOverview(); renderCurrentLesson(); updateProgress(); }
    listVocabModules();
  }
  init();
})();
