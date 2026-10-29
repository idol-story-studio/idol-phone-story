/* Global chapter completion rendering and notification contract.
 * New chapters: register their ending note renderer via storyEndingAttach(n)
 * and call storyEndingNotify(n) once when the chapter is completed. */
const STORY_END_TITLES={1:'陌生的手机',2:'我们不是一直很好吗？',3:'所有人都知道',4:'还在生气吗？',5:'你为什么不说？',6:'LOUDER！',7:'有些话，放进歌里',8:'要不要一起吃饭？'};
const STORY_END_NAMES=['','一','二','三','四','五','六','七','八','九','十'];
const storyEndingNotified=new Set();
function storyEndingReady(n){return n===1?!!game.chapterEnd:n===2?!!CH2.done:n===3?!!CH3.done:n===4?!!CH4.done:n===5?!!CH5.done:n===6?!!CH6.done:n===7?!!CH7.done:n===8?!!CH8.done:false}
function storyEndingNotify(n){if(!storyEndingReady(n)||storyEndingNotified.has(n))return;storyEndingNotified.add(n);if(n===2||n===4)return;phoneReceiveNote('第'+STORY_END_NAMES[n]+'章已结束','story-end-'+n)}
function storyEndingView(n){
 if(!storyEndingReady(n))return;
 activeApp='notes';phoneReadRoom('notes');
 const name=STORY_END_NAMES[n],next=STORY_END_NAMES[n+1],canNext=typeof STORY_CHAPTER_NAMES!=='undefined'&&n+1<STORY_CHAPTER_NAMES.length;
 const html='<div class="content story-prose story-ending"><h2>第'+name+'章已结束</h2><p>当前回忆进度：'+n+'/10</p><div class="story-progress"><span style="width:'+(n*10)+'%"></span></div>'+
 (canNext?'<button class="choice" onclick="storyEndingNext('+(n+1)+')">前往第'+next+'章</button>':'<button class="choice" onclick="storyEndingNotes()">返回备忘录</button>')+'</div>';
 wrap('第'+name+'章 · 完结',html)
}
function storyEndingNext(n){const f={2:()=>ch2Start(),3:()=>ch3Start(),4:()=>ch4Start(),5:()=>ch5Start(),6:()=>ch6Start(),7:()=>ch7Start(),8:()=>ch8Start()}[n];if(f)f()}
function storyEndingNotes(){if(typeof gameNotes==='function')gameNotes()}
function storyEndingAttach(n){if(!storyEndingReady(n))return;const root=document.querySelector('.story-ending,.ch5-note,.ch6-note,.ch7-note');if(!root)return;const existing=root.querySelector('.story-ending-unified');if(existing)existing.remove();const oldButtons=[...root.querySelectorAll('button')].filter(b=>/进入第|前往第/.test(b.textContent||''));oldButtons.forEach(b=>b.remove());const panel=document.createElement('div');panel.className='story-ending-unified';panel.innerHTML='<h2>第'+STORY_END_NAMES[n]+'章已结束</h2><p>当前回忆进度：'+n+'/10</p><div class="story-progress"><span style="width:'+(n*10)+'%"></span></div>'+(n<8?'<button class="choice" onclick="storyEndingNext('+(n+1)+')">前往第'+STORY_END_NAMES[n+1]+'章</button>':'<p>后续章节尚未开放</p>');root.appendChild(panel);
}
function storyEndingRow(n){return '<div class="note" onclick="storyEndingView('+n+')"><strong>第'+STORY_END_NAMES[n]+'章已结束</strong></div>'}
function storyEndingNormalizeNotes(){
 if(activeApp!=='notes')return;const root=document.querySelector('.story-notes');if(!root)return;
 for(let n=1;n<=8;n++){const rows=[...root.querySelectorAll('.note')];const label='第'+STORY_END_NAMES[n]+'章已结束';if(!storyEndingReady(n)){rows.filter(x=>x.textContent.trim()===label).forEach(x=>x.remove());continue}let found=rows.find(x=>x.textContent.trim()===label);if(found){found.setAttribute('onclick','storyEndingView('+n+')')}else{const jump=rows.find(x=>/跳转至其他章节/.test(x.textContent));const node=document.createElement('div');node.className='note';node.setAttribute('onclick','storyEndingView('+n+')');node.innerHTML='<strong>'+label+'</strong>';if(jump)root.insertBefore(node,jump);else root.appendChild(node)}}
}
const storyEndOldGameNotes=gameNotes;gameNotes=function(){const r=storyEndOldGameNotes.apply(this,arguments);storyEndingNormalizeNotes();return r};
for(const name of ['ch6Notes','ch7Notes']){const old=globalThis[name];if(typeof old==='function')globalThis[name]=function(){const r=old.apply(this,arguments);storyEndingNormalizeNotes();return r}}
const storyEndOldCh2=ch2Ending;ch2Ending=function(){storyEndingView(2)};
const storyEndOldCh3=ch3Ending;ch3Ending=function(){storyEndingView(3)};
const storyEndOldCh4=ch4Ending;ch4Ending=function(){storyEndingView(4)};
const storyEndOldCh5Note=ch5Note;ch5Note=function(id){if(id==='end'&&CH5.done)return storyEndingView(5);return storyEndOldCh5Note.apply(this,arguments)};
const storyEndOldCh6Note=ch6Note;ch6Note=function(id){if(id==='end'){if(!CH6.done){CH6.done=true;CH6.endingRead=true;CH6.phase='complete';ch6Save()}storyEndingNotify(6);return storyEndingView(6)}return storyEndOldCh6Note.apply(this,arguments)};
const storyEndOldCh7Note=ch7Note;ch7Note=function(id){if(id==='end'){if(!CH7.done){CH7.done=true;CH7.endingRead=true;CH7.phase='complete';ch7Save()}storyEndingNotify(7);return storyEndingView(7)}return storyEndOldCh7Note.apply(this,arguments)};
const storyEndOldCh5Finish=ch5QueueFinish;ch5QueueFinish=function(after){const was=CH5.done;const r=storyEndOldCh5Finish.apply(this,arguments);if(!was&&CH5.done)storyEndingNotify(5);return r};
const storyEndOldCh7After=ch7After;ch7After=function(a){const r=storyEndOldCh7After.apply(this,arguments);if(a==='end'&&ch7Is())storyEndingNotify(7);return r};
const storyEndOldCh3Next=ch3Next;ch3Next=function(){const was=CH3.done;const r=storyEndOldCh3Next.apply(this,arguments);if(!was&&CH3.done)storyEndingNotify(3);return r};
const storyEndOldCh4EndCall=ch4EndCall;ch4EndCall=function(){const r=storyEndOldCh4EndCall.apply(this,arguments);storyEndingNotify(4);return r};
const storyEndOldPhoneOpen=phoneOpenRoom;phoneOpenRoom=function(id){if(typeof id==='string'&&id.startsWith('story-end-'))return storyEndingView(Number(id.slice(10)));return storyEndOldPhoneOpen.apply(this,arguments)};

/* Completion notes are created at the end of the story, before they are read.
 * Notify at creation, not only when the user opens the ending note. */
const storyEndOldCh6AddNote=ch6AddNote;ch6AddNote=function(id,title,text,dest){const existed=CH6.notes.some(n=>n.id===id);const r=storyEndOldCh6AddNote.apply(this,arguments);if(id==='end'&&!existed){CH6.done=true;CH6.phase='complete';ch6Save();storyEndingNotify(6)}return r};
const storyEndOldCh7NoteAdd=ch7NoteAdd;ch7NoteAdd=function(id,title,text,dest){const existed=CH7.notes.some(n=>n.id===id);const r=storyEndOldCh7NoteAdd.apply(this,arguments);if(id==='end'&&!existed){CH7.done=true;CH7.phase='complete';ch7Save();storyEndingNotify(7)}return r};

/* Chapter 8 completion and unified Notes. */
const ch8OldAfter=ch8After;ch8After=function(a){const was=CH8.done;const r=ch8OldAfter(a);if(!was&&CH8.done)storyEndingNotify(8);return r};
const ch8OldNote=ch8Note;ch8Note=function(id){if(id==='end'&&CH8.done)return storyEndingView(8);return ch8OldNote(id)};
