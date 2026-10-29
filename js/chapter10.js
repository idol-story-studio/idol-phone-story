/* Chapter 10 — 以后都告诉你. Uses existing phone, KakaoTalk, Notes and ending contracts. */
const CH10_KEY='idol_ch10_v1';
const CH10={active:false,done:false,phase:'',clock:610,day:1,session:0,messages:[],notes:[],queue:null,giftViewed:false,giftClaimed:false,photoViewed:false,photoSaved:false,photoNotice:false,choices:{},endingRead:false};
const CH10_PHOTO='assets/chapter10/award-memory.jpg'; // reserved asset path; missing file gets a truthful placeholder
const CH10_OPEN='昨晚回来以后睡得还不错。\n\n今天没什么特别要做的事。先看看手机吧。';
const CH10_END='今天又和亨俊一起回去了。\n\n以前觉得有些话不用说他也会懂。现在发现，说出来也没什么难的。\n\n想见面就说想见面，想一起回去就问他要不要等我。\n\n他今天真的在楼下等我。\n\n好像又回到了很熟悉的日子。\n\n不过这次，我会记得把想说的话告诉他。';
let ch10Timer=null;
let ch10PhotoTimer=null;
let ch10AfternoonTimer=null;
let ch10NightTimer=null;
let ch10HomeTimer=null;
function ch10Is(){return CH10.active&&game.stage==='chapter10'}
function ch10Save(){try{localStorage.setItem(CH10_KEY,JSON.stringify(CH10))}catch(e){}}
function ch10Time(){const t=Math.floor(CH10.clock);return String(Math.floor(t/60)%24).padStart(2,'0')+':'+String(t%60).padStart(2,'0')}
function ch10AddNote(id,title,text,notify=true){if(CH10.notes.some(n=>n.id===id))return;CH10.notes.push({id,title,text});ch10Save();if(notify)phoneReceiveNote(title,'ch10-note-'+id)}
function ch10Start(){
 if(!CH9.done){gameLocked();return}
 if(CH10.active){game.stage='chapter10';game.chapter2=true;game.chatBlocked=false;storyChapterSet(10);ch10Resume();ch10Notes();return}
 Object.assign(CH10,{active:true,done:false,phase:'morning',clock:610,day:1,session:CH10.session+1,messages:[],notes:[],queue:null,giftViewed:false,giftClaimed:false,photoViewed:false,photoSaved:false,photoNotice:false,choices:{},endingRead:false});
 game.stage='chapter10';game.chapter2=true;game.chatBlocked=false;storyChapterSet(10);
 ch10AddNote('intro','第十章',CH10_OPEN,false);
 ch10Queue([['them','醒了吗'],['me','醒了 还在床上'],['them','我就知道ㅋㅋ'],['them','我刚才在楼下看到一只猫'],['them','懒洋洋的样子特别像你赖床的时候'],['me','那你拍了吗'],['them','跑掉了 没拍到'],['me','那你下次拍给我'],['them','好'],['them','你今天不是还要练习吗'],['me','嗯 等下就出门'],['them','先吃点东西再走'],['me','知道啦'],['me','你也是'],['them','嗯 我吃过了']],'morningChoice');
 ch10Notes();
}
function ch10Push(who,text,type){
 const m={who,text,time:ch10Time(),type:type||'text',id:'ch10-'+CH10.day+'-'+CH10.messages.length};
 CH10.messages.push(m);CH10.clock+=0.5;ch10Save();
 if(phoneRoomOpen('hyeongjun'))ch10Room(true);else if(who==='them')phoneReceiveMessage('hyeongjun',type==='gift'?'送来了一份礼物':text);
}
function ch10Queue(lines,after){CH10.queue={lines,index:0,after};ch10Save();ch10Resume()}
function ch10Resume(){
 if(!ch10Is()||!CH10.queue||ch10Timer)return;
 const token=CH10.session;
 const tick=()=>{
  ch10Timer=null;if(!ch10Is()||token!==CH10.session||!CH10.queue)return;
  const q=CH10.queue;
  if(q.index>=q.lines.length){CH10.queue=null;ch10Save();ch10After(q.after);return}
  const line=q.lines[q.index++];ch10Push(line[0],line[1],line[2]);ch10Save();
  ch10Timer=setTimeout(tick,Math.min(3500,phoneMessageDelay(line[1],false)));
 };
 ch10Timer=setTimeout(tick,800);
}
function ch10After(after){
 if(after==='morningChoice')CH10.phase='morningChoice';
 if(after==='afternoon'){CH10.phase='afternoonWaiting';ch10Save();ch10AfternoonTimer=setTimeout(()=>{ch10AfternoonTimer=null;if(ch10Is()&&CH10.phase==='afternoonWaiting'){CH10.phase='photoChat';CH10.clock=820;ch10Queue(ch10PhotoConversation(),'photoReady')}},10000)}
 if(after==='giftChoice')CH10.phase='giftChoice';
 
 if(after==='photoChoice')CH10.phase='photoChoice';
 if(after==='photoReady'){CH10.phase='photoWaiting';ch10Save();ch10PhotoTimer=setTimeout(()=>{ch10PhotoTimer=null;if(ch10Is()&&CH10.phase==='photoWaiting'){CH10.phase='photoReady';ch10AddNote('photo','新照片','PHOTOISM 有新的照片可以查看。',false);ch10PhotoNotice();ch10Save();/* Keep the current app open; PHOTOISM arrives as a system banner. */}},12000)}
 if(after==='nightChoice')CH10.phase='nightChoice';
 if(after==='nightEnd'){CH10.phase='homeWaiting';ch10AddNote('tomorrow','明天','明天结束工作后，亨俊可能会发消息。',false);ch10WaitForHome()}
 if(after==='homeChoice')CH10.phase='homeChoice';
 if(after==='end'){CH10.phase='complete';CH10.done=true;CH10.queue=null;ch10AddNote('end','第十章已结束',CH10_END,false);storyEndingNotify(10)}
 ch10Save();if(phoneRoomOpen('hyeongjun'))ch10Room(true);
}
function ch10Options(labels,fn){return '<div class="story-options">'+labels.map((t,i)=>'<button class="story-option" onclick="'+fn+'('+i+')">'+escapeHtml(t)+'</button>').join('')+'</div>'}
function ch10ChooseMorning(i){
 if(CH10.phase!=='morningChoice')return;
 CH10.choices.morning=i;CH10.phase='morningReply';
 const first=i===0?[['me','那我明天叫你起床？'],['them','好啊'],['them','你打电话我肯定接']]:[['me','等下练习完要不要一起吃饭'],['them','好'],['them','你结束了告诉我']];
 ch10Queue([...first,['me','那我先去准备了'],['them','嗯 去吧'],['them','我也要去忙了'],['them','晚点找你'],['me','好 想你了'],['them','干嘛突然这么肉麻啊ㅋㅋ'],['them','我也是']],'afternoon');
}
function ch10PhotoConversation(){
 return [['them','你看到群里发的消息了吗'],['me','还没 怎么了'],['them','拿一位那天的照片发出来了'],['me','我看看'],['me','啊 那张拿奖杯的'],['them','嗯ㅋㅋ'],['me','那天真的特别开心'],['them','我也是'],['me','突然想起来'],['me','我们拿了一位 要不要带奖杯去拍个人生四格纪念一下'],['them','好啊'],['them','我也想拍'],['me','那练习结束就去？'],['them','嗯 我把奖杯带上'],['me','好 等下见'],['them','等下见']];
}
function ch10PhotoNotice(){
 if(CH10.photoNotice)return;CH10.photoNotice=true;CH10.day=2;CH10.clock=1040;ch10Save();
 phoneBanner('photoism','PHOTOISM','有新的照片可查看','photoism');
}
function ch10PhotoImage(){
 return '<div class="ch10-photo-image"><img src="'+CH10_PHOTO+'" alt="获奖纪念拼贴" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="ch10-photo-missing" style="display:none"><strong>获奖纪念照片</strong><span>正式图片尚未接入仓库</span><small>已保留照片记录与保存功能</small></div></div>';
}
function ch10Photoism(){
 if(!ch10Is())return;activeApp='photoism';
 wrap('PHOTOISM','<div class="ch10-photo-app"><div class="ch10-photo-brand">PHOTOISM</div><h2>我的照片</h2>'+(CH10.photoNotice?'<button class="ch10-photo-record" onclick="ch10PhotoDetail()"><span class="ch10-record-thumb">▧</span><span><strong>获奖纪念照 · 四图拼贴</strong><small>领取时间 · 第2日 17:20</small><small>图片标示日期 · 2025.06.21</small></span><b>›</b></button><p class="ch10-muted">这里展示游戏内收藏的纪念照片，并非真实 PHOTOISM 云端订单。</p>':'<p class="ch10-muted">暂无新照片，稍后再来看看。</p>')+'</div>');
}
function ch10PhotoDetail(){
 if(!ch10Is()||!CH10.photoNotice)return ch10Photoism();activeApp='photoism';CH10.photoViewed=true;ch10Save();ch10ScheduleNight();
 wrap('获奖纪念照','<div class="ch10-photo-detail"><button class="ch10-back" onclick="ch10Photoism()">‹ 我的照片</button>'+ch10PhotoImage()+'<p class="ch10-photo-caption">获奖纪念照 · 2025.06.21</p><p class="ch10-muted">领取时间：第2日 17:20 · 来源：PHOTOISM纪念收藏（游戏模拟）</p><button class="ch10-primary" onclick="ch10SavePhoto()">'+(CH10.photoSaved?'已保存到相册':'保存到相册')+'</button><button class="ch10-secondary" onclick="ch10PhotoZoom()">放大查看</button><button class="ch10-secondary" onclick="ch10Photoism()">返回我的照片</button></div>');
}
function ch10PhotoZoom(){
 if(!ch10Is())return;activeApp='photoism';wrap('查看照片','<div class="ch10-zoom"><button class="ch10-back" onclick="ch10PhotoDetail()">‹ 返回详情</button>'+ch10PhotoImage()+'</div>');
}
function ch10SavePhoto(){CH10.photoSaved=true;ch10Save();ch10PhotoDetail()}
function ch10Album(){
 if(!ch10Is())return;
 activeApp='photos';igAlbum();
 if(!CH10.photoSaved)return;
 const root=document.querySelector('#appbody .ig-scroll');
 if(!root)return;
 root.insertAdjacentHTML('afterbegin','<section class="ch10-album"><h3>最近保存</h3><button class="ch10-album-tile" onclick="ch10AlbumDetail()" aria-label="查看获奖纪念人生四格"><img src="'+CH10_PHOTO+'" alt="获奖纪念人生四格" style="width:100%;height:100%;object-fit:cover"></button><p>获奖纪念人生四格 · 2025.06.21</p></section>');
}
function ch10AlbumDetail(){activeApp='photos';wrap('照片','<div class="ch10-photo-detail">'+ch10PhotoImage()+'<p class="ch10-photo-caption">2025.06.21 · 获奖纪念照</p><button class="ch10-secondary" onclick="ch10Album()">返回相册</button></div>')}
function ch10ScheduleNight(){
 if(ch10NightTimer||CH10.phase!=='photoReady')return;
 const token=CH10.session;
 ch10NightTimer=setTimeout(()=>{ch10NightTimer=null;if(ch10Is()&&CH10.session===token&&CH10.phase==='photoReady')ch10BeginNight()},5000);
}
function ch10BeginNight(){
 if(!ch10Is()||!CH10.photoViewed||CH10.phase!=='photoReady')return;
 CH10.phase='nightChat';CH10.clock=1230;ch10Save();
 ch10Queue([['them','照片收到了吗'],['me','收到了'],['me','你看我们拿奖杯那张'],['me','获奖纪念照','photo'],['them','ㅋㅋ 拍得还不错吧'],['me','特别好'],['me','以后看到这张就能想起来今天'],['them','嗯'],['them','我也很喜欢'],['them','下次有值得纪念的事还一起拍']],'nightChoice');
}
function ch10WaitForHome(){
 if(ch10HomeTimer||!ch10Is()||CH10.phase!=='homeWaiting')return;
 const token=CH10.session;
 const poll=()=>{
  ch10HomeTimer=null;
  if(!ch10Is()||CH10.session!==token||CH10.phase!=='homeWaiting')return;
  if(phoneRoomOpen('hyeongjun')){ch10HomeTimer=setTimeout(poll,2000);return}
  ch10HomeTimer=setTimeout(()=>{
   ch10HomeTimer=null;
   if(!ch10Is()||CH10.session!==token||CH10.phase!=='homeWaiting')return;
   if(phoneRoomOpen('hyeongjun'))return ch10WaitForHome();
   ch10BeginHome();
  },6000);
 };
 ch10HomeTimer=setTimeout(poll,1500);
}
function ch10ChooseNight(i){
 if(CH10.phase!=='nightChoice')return;
 CH10.phase='nightReply';CH10.choices.night=i;
 const branches=[
  [['me','今天的照片我好喜欢'],['them','我也是'],['them','特别是你靠过来那张']],
  [['me','下次还想跟你一起拍'],['them','好啊'],['them','下次换个背景']],
  [['me','想把这张设成壁纸'],['them','可以啊ㅋㅋ'],['them','我也留一张']]
 ];
 ch10Queue([...branches[i],['me','那说好了'],['them','嗯'],['them','早点睡 明天还要忙'],['me','你也早点睡'],['me','晚安 宝宝'],['them','ㅋㅋ 怎么又突然叫这个'],['me','不喜欢吗'],['them','喜欢'],['them','只跟我这么叫就好'],['me','知道啦'],['them','晚安 ♡']],'nightEnd');
}
function ch10BeginHome(){
 if(!ch10Is()||CH10.phase!=='homeReady')return;CH10.phase='homeChat';CH10.day=3;CH10.clock=1217;ch10Save();
 ch10Queue([['them','结束了吗'],['me','嗯 刚结束'],['them','我也差不多了'],['me','那等我一下好不好'],['them','好啊'],['them','想一起回去？'],['me','嗯 想跟你多待一会儿']],'homeChoice');
}
function ch10ChooseHome(i){
 if(CH10.phase!=='homeChoice')return;CH10.phase='homeReply';CH10.choices.home=i;ch10Push('me',['你现在在哪儿','我想见你','可以等我一下吗'][i]);
 const replies=[[['them','在楼下'],['them','正好等你']],[['them','我也是'],['them','下来就能见到了']],[['them','当然可以'],['them','慢慢收拾']]][i];
 ch10Queue([...replies,['them','我在楼下等你'],['me','马上来'],['them','慢慢来 不用跑']],'end');
}
function ch10OldHistory(){
 const prev=typeof ch9BubbleHistory==='function'?ch9BubbleHistory():'';
 const nine=(CH9.hj||[]).map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH9.hj[i-1]||{}).who!==m.who)).join('');
 return prev+'<div class="story-date">第九章 · 聚餐当天</div>'+nine;
}
function ch10Room(quiet=false){
 if(!ch10Is())return;activeApp='kkt';phoneReadRoom('hyeongjun');
 const rows=CH10.messages.map((m,i)=>{
  
  if(m.type==='photo')return '<div class="bubbleline me"><button class="ch10-chat-photo" onclick="ch10PhotoDetail()">'+ch10PhotoImage()+'<span>获奖纪念照 · 查看</span></button></div>';
  return gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH10.messages[i-1]||{}).who!==m.who);
 }).join('');
 let opts='';
 const p=CH10.phase;
 if(p==='morningChoice')opts=ch10Options(['那我明天叫你起床？','等下练习完要不要一起吃饭'],'ch10ChooseMorning');
 
 
 if(p==='photoInvite')opts='';
 
 if(p==='photoReady')opts='';
 if(p==='nightChoice')opts=ch10Options(['今天的照片我好喜欢','下次还想跟你一起拍','想把这张设成壁纸'],'ch10ChooseNight');
 
 if(p==='homeChoice')opts=ch10Options(['你现在在哪儿','我想见你','可以等我一下吗'],'ch10ChooseHome');
 if(CH10.done)opts='<div class="story-end">当前对话已结束</div>';
 wrap('宋亨俊','<div id="ch2-chat" data-id="hyeongjun" class="ch3-kkt ch5-chat ch9-chat ch10-chat"><div class="chatbody" id="chatbody">'+ch10OldHistory()+'<div class="story-date">第十章 · 以后都告诉你</div>'+rows+'</div><div class="story-send">'+opts+'</div></div>');
 const el=document.getElementById('chatbody');if(el)el.scrollTop=el.scrollHeight;
}
function ch10Friends(){
 if(!ch10Is())return;activeApp='kkt';
 const last=CH10.messages.at(-1)?.text||CH9.hj.at(-1)?.text||'历史消息';
 const entries=[['宋亨俊','hyeongjun',last],['CRAVITY 🐾','group','历史消息'],['徐宇瑸','woobin','历史消息'],['咸元进','wonjin','历史消息'],['朴世琳','serim','历史消息'],['A','ch8friend','历史消息']];
 wrap('KakaoTalk','<div class="content ch5-friends">'+entries.map(([name,id,sub])=>'<div class="item" onclick="gameChat(\''+id+'\')"><div class="avatar">'+escapeHtml(name[0])+'</div><div class="itemmain"><div class="itemtitle">'+escapeHtml(name)+'</div><div class="itemsub">'+escapeHtml(sub)+'</div></div>'+gameContactBadge(id)+'</div>').join('')+'</div>');
}
function ch10Notes(){
 if(!ch10Is())return;activeApp='notes';phoneReadRoom('notes');
 const old=[['第一章','gameReadNote()'],['第二章','ch2ReadInitialNote()'],['第三章','ch3Note(-1)'],['第四章','ch4ReadNote(0)'],['第五章','ch5IntroNote()'],['第六章','ch6Note("intro")'],['第七章','ch7Note("intro")'],['第八章','ch8Note("intro")'],['第九章','ch9Note("intro")']];
 const rows=old.map(([t,fn])=>'<div class="note" onclick=\''+fn+'\'><strong>'+t+'</strong></div>').join('');
 const mine=CH10.notes.map(n=>'<div class="note" onclick="ch10Note(\''+n.id+'\')"><strong>'+escapeHtml(n.title)+'</strong></div>').join('');
 wrap('备忘录','<div class="content story-notes">'+rows+mine+'<div class="note" onclick="gameChapterMenu()"><strong>跳转至其他章节</strong></div></div>');
}
function ch10Note(id){
 if(!ch10Is())return;const n=CH10.notes.find(x=>x.id===id);if(!n)return ch10Notes();
 if(id==='end')return storyEndingView(10);
 activeApp='notes';phoneReadRoom('notes');
 const action=id==='intro'?'<button class="choice" onclick="ch10Room()">查看宋亨俊的聊天</button>':id==='hint'?'<button class="choice" onclick="ch10Invite()">打开聊天</button>':id==='photo'?'<button class="choice" onclick="ch10Photoism()">打开 PHOTOISM</button>':id==='tomorrow'?'':'';
 wrap(n.title,'<div class="content story-prose ch7-note ch8-note"><h2>'+escapeHtml(n.title)+'</h2><p>'+escapeHtml(n.text)+'</p>'+(action||'<button class="choice" onclick="ch10Notes()">返回备忘录</button>')+'</div>');
}
/* Integrate only in chapter 10; do not mutate earlier chapters' KKT and Notes views. */
const ch10PrevOpen=openApp;openApp=function(k){if(ch10Is()){if(k==='photoism')return ch10Photoism();if(k==='photos'&&CH10.photoSaved)return ch10Album();if(k==='kkt')return ch10Friends();if(k==='notes')return ch10Notes()}return ch10PrevOpen(k)};
const ch10PrevUnlock=gameUnlock;gameUnlock=function(k){if(ch10Is())return ['kkt','notes','photos','calendar','ig','phone','delivery','files','x','youtube','spotify','map','melon','kakaot','photoism'].includes(k);return ch10PrevUnlock(k)};
const ch10PrevChat=gameChat;gameChat=function(id){if(ch10Is()){if(id==='hyeongjun')return ch10Room();if(['group','woobin','manager','wonjin','serim'].includes(id))return ch7LegacyRoom(id);if(id==='ch8friend')return ch9Room('friend')}return ch10PrevChat(id)};
const ch10PrevPhone=phoneOpenRoom;phoneOpenRoom=function(id){if(ch10Is()){if(id==='hyeongjun')return ch10Room();if(id==='notes')return ch10Notes();if(id==='photoism')return ch10Photoism();if(typeof id==='string'&&id.startsWith('ch10-note-'))return ch10Note(id.slice(10))}return ch10PrevPhone(id)};
const ch10PrevNotes=gameNotes;gameNotes=function(){if(ch10Is())return ch10Notes();return ch10PrevNotes()};
const ch10PrevEndReady=storyEndingReady;storyEndingReady=function(n){return n===10?!!CH10.done:ch10PrevEndReady(n)};
STORY_END_TITLES[10]='以后都告诉你';
if(STORY_CHAPTER_NAMES.length===10)STORY_CHAPTER_NAMES.push('十');
const ch10PrevEndNext=storyEndingNext;storyEndingNext=function(n){if(Number(n)===10){if(!CH9.done)CH9.done=true;return ch10Start()}return ch10PrevEndNext(n)};
const ch10PrevJump=storyChapterJump;storyChapterJump=function(n){if(Number(n)!==10){CH10.active=false;CH10.session++;clearTimeout(ch10Timer);clearTimeout(ch10PhotoTimer);clearTimeout(ch10AfternoonTimer);clearTimeout(ch10NightTimer);clearTimeout(ch10HomeTimer);ch10Timer=null;ch10PhotoTimer=null;ch10AfternoonTimer=null;ch10NightTimer=null;ch10HomeTimer=null;return ch10PrevJump(n)}/* Testing chapter jump: match chapters 2–9 by preparing earlier completion flags. */CH2.done=true;CH3.done=true;CH4.done=true;CH5.done=true;CH6.done=true;CH7.done=true;CH8.done=true;CH9.done=true;CH9.active=false;CH9.session=(CH9.session||0)+1;CH9.queue=null;clearTimeout(ch9Timer);CH10.active=false;CH10.session++;clearTimeout(ch10Timer);clearTimeout(ch10PhotoTimer);clearTimeout(ch10AfternoonTimer);clearTimeout(ch10NightTimer);clearTimeout(ch10HomeTimer);ch10Timer=null;ch10PhotoTimer=null;ch10AfternoonTimer=null;ch10NightTimer=null;ch10HomeTimer=null;storyChapterResetUnread();ch10Start()};
const ch10PrevEndAttach=storyEndingAttach;storyEndingAttach=function(n){ch10PrevEndAttach(n);if(n===9){const root=document.querySelector('.story-ending-unified');if(root){const p=[...root.querySelectorAll('p')].find(x=>x.textContent.includes('后续章节尚未开放'));if(p)p.outerHTML='<button class="choice" onclick="storyEndingNext(10)">前往第十章</button>'}}};
const ch10PrevEndView=storyEndingView;storyEndingView=function(n){if(n===10){if(!CH10.done)return;activeApp='notes';phoneReadRoom('notes');CH10.endingRead=true;ch10Save();wrap('第十章 · 完结','<div class="content story-prose story-ending"><h2>第十章已结束</h2><p>以后都告诉你</p><p>当前回忆进度：10/10</p><div class="story-progress"><span style="width:100%"></span></div><p>所有回忆都找回来了。但属于他们的故事，还会继续。</p><button class="choice" onclick="ch10Notes()">继续使用手机</button></div>');return}return ch10PrevEndView(n)};
const ch10PrevEndNormalize=storyEndingNormalizeNotes;storyEndingNormalizeNotes=function(){if(ch10Is())return;return ch10PrevEndNormalize()};
const ch10PrevOpenAppForPhoto=ch10Photoism;
icons.photoism=iconArt('#111','<rect x="9" y="17" width="46" height="31" rx="4" fill="#fff"/><text x="32" y="36" text-anchor="middle" font-size="12" font-weight="800" fill="#111">PHOTO</text><text x="32" y="44" text-anchor="middle" font-size="8" fill="#111">ISM</text>');
if(!apps.some(x=>x[1]==='photoism'))apps.push(['PHOTOISM','photoism']);
document.getElementById('apps2').innerHTML=apps.slice(8).map(a=>appBtn(...a)).join('');
try{const saved=JSON.parse(localStorage.getItem(CH10_KEY)||'null');if(saved?.active)Object.assign(CH10,saved)}catch(e){}
window.addEventListener('load',()=>{if(localStorage.getItem('idol_current_chapter_v1')==='10'&&CH10.active){game.stage='chapter10';game.chapter2=true;game.chatBlocked=false;setTimeout(ch10Resume,950)}});
