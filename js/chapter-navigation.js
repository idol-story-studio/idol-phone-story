/* Chapter navigation and restore coordinator. Test jumps start the selected chapter anew. */
const STORY_CHAPTER_KEY='idol_current_chapter_v1';
const STORY_CHAPTER_NAMES=['','一','二','三','四','五'];
function storyChapterSet(n){try{localStorage.setItem(STORY_CHAPTER_KEY,String(n))}catch(e){}}
function storyChapterResetUnread(){
 if(typeof phoneSetCount==='function'){
  for(const id of ['notes','hyeongjun','wonjin','woobin','serim','group','ig:hyeongjun'])phoneSetCount(id,0);
 }
}
function storyChapterJump(n){
 n=Number(n);
 if(!Number.isInteger(n)||n<1||n>5)return;
 // Invalidate outstanding chapter timers before switching.
 if(typeof CH3!=='undefined'){CH3.active=false;CH3.session=(CH3.session||0)+1}
 if(typeof CH4!=='undefined'){CH4.active=false;CH4.session=(CH4.session||0)+1}
 if(typeof CH5!=='undefined'){CH5.active=false;CH5.session=(CH5.session||0)+1;CH5.queue=null;CH5.queueIndex=0;CH5.queueAfter=null}
 if(typeof CH2!=='undefined')CH2.session=(CH2.session||0)+1;
 storyChapterSet(n);
 storyChapterResetUnread();
 if(n===1){
  gameJumpChapter(1);
  game.notesRead=false;
  game.unread.notes=1;gameBadge();
  if(typeof phoneSetCount==='function')phoneSetCount('notes',1);
  activeApp=null;
  show('lock');
  setTimeout(()=>{if(game.stage==='intro'&&(current==='lock'||current==='pass'))gameLockBanner('notes','备忘录有新的内容')},250);
  return;
 }
 game.chapter2=true;game.chapterEnd=true;game.phoneNoteRead=true;game.xExited=true;game.callDone=true;
 if(n===2){ch2Start();return}
 if(n===3){CH2.done=true;ch3Start();return}
 if(n===4){
  CH2.done=true;CH3.done=true;
  ch4Start();return;
 }
 CH2.done=true;CH3.done=true;CH4.done=true;
 // Keep earlier chat history where available, but restart only chapter five.
 CH5.active=false;
 ch5Start();
}
function storyChapterMenu(){
 activeApp='notes';
 const currentNumber=game.stage==='chapter5'?5:game.stage==='chapter4'?4:game.stage==='chapter3'?3:game.stage==='chapter2'?2:1;
 const buttons=STORY_CHAPTER_NAMES.slice(1).map((name,i)=>{
  const n=i+1;
  return '<button class="note story-chapter-button" onclick="storyChapterJump('+n+')"><strong>前往第'+name+'章</strong></button>';
 }).join('');
 wrap('跳转至其他章节','<div class="content story-notes"><p class="story-chapter-hint">测试入口：选择章节会重新开始该章，其他章节的已保存剧情不会被删除。</p>'+buttons+'<button class="note story-chapter-button" onclick="gameNotes()"><strong>返回备忘录</strong></button></div>');
}
gameChapterMenu=storyChapterMenu;
// Keep the existing menu visible in Notes even when chapter five is not active.
const storyPreviousNotes=gameNotes;
gameNotes=function(){
 storyPreviousNotes();
 const root=document.querySelector('.story-notes');
 if(root&&!root.querySelector('[onclick="gameChapterMenu()"]')){
  root.insertAdjacentHTML('beforeend','<div class="note" onclick="gameChapterMenu()"><strong>跳转至其他章节</strong></div>');
 }
};
const storySavedChapter=(()=>{try{return localStorage.getItem(STORY_CHAPTER_KEY)}catch(e){return null}})();
if(storySavedChapter==='3'&&CH3.active){game.stage='chapter3';game.chapter2=true}
else if(storySavedChapter==='4'&&CH4.active){game.stage='chapter4';game.chapter2=true}
else if(storySavedChapter==='5'&&CH5.active){game.stage='chapter5';game.chapter2=true;game.chatBlocked=false;setTimeout(()=>ch5ResumeQueue(true),1200)}
// A legacy fifth-chapter save without an explicit current-chapter selection is
// historical progress, not permission to force the player back into chapter five.

// Record ordinary chapter transitions as well as test-menu jumps.
const storyOriginalCh2Start=ch2Start;
ch2Start=function(){storyChapterSet(2);return storyOriginalCh2Start()};
const storyOriginalCh3Start=ch3Start;
ch3Start=function(){storyChapterSet(3);return storyOriginalCh3Start()};
const storyOriginalCh4Start=ch4Start;
ch4Start=function(){storyChapterSet(4);return storyOriginalCh4Start()};
const storyOriginalCh5Start=ch5Start;
ch5Start=function(){storyChapterSet(5);return storyOriginalCh5Start()};
