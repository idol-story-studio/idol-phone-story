/* Chapter 8 — 要不要一起吃饭？ | builds on global KakaoTalk, Notes and NAVER Map. */
const CH8_KEY='idol_ch8_v1';
/* Register the new KKT contact with the existing unread/badge system. */
PHONE_NAMES.ch8friend='A';
const CH8={active:false,done:false,phase:'',session:0,callIndex:0,callState:'none',callSeconds:0,friend:[],hj:[],memo:false,mapOpened:false,mapSeconds:0,typed:0,draft:'',pending:[],pendingAfter:'',timerAt:0,clock:19*60+10,notes:[],callLog:false};
const CH8_CALL=[
['A','喂，敏熙？'],['me','嗯，怎么啦'],['A','你最近是不是特别忙啊'],['me','还好，怎么突然问这个ㅋㅋ'],['A','没什么，想叫你出来吃个饭'],['A','我们都多久没见了'],['me','是有一阵子了'],['A','我本来想让亨俊直接跟你说的'],['A','结果他说你们现在不住一起了'],['me','……嗯'],['A','我还以为你们一直住一起呢ㅋㅋ'],['A','所以就自己打给你了'],['A','那天有空吗？一起吃饭吧'],['me','好啊，我去'],['A','行，那我等下跟亨俊说一声'],['me','不用了，我自己跟他说'],['A','哦？行啊ㅋㅋ'],['A','那我把地址发你'],['me','好，发我就行'],['A','那到时候见'],['me','到时候见']];
const CH8_LOCATION={id:'ch8_dinner_place',name:'Restaurant ON',ko:'레스토랑 온',area:'首尔 · 江南区清潭洞',address:'首尔特别市江南区宣陵路148街48号 美俊大厦3层',naverQuery:'레스토랑 온 서울 강남구 선릉로148길 48',sharedBy:'A',time:'19:20'};
const CH8_HINT='A把聚餐地点发来了。\n\n去 KakaoTalk 找亨俊，亲自问问他要不要一起去吧。';
let ch8Timer=null,ch8MapTimer=null,ch8CallTimer=null;
function ch8Is(){return CH8.active&&game.stage==='chapter8'}
function ch8Save(){try{localStorage.setItem(CH8_KEY,JSON.stringify(CH8))}catch(e){}}
function ch8Time(){let n=Math.floor(CH8.clock);return String(Math.floor(n/60)%24).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function ch8NoteAdd(id,title,text){if(CH8.notes.some(n=>n.id===id))return;CH8.notes.push({id,title,text});ch8Save();phoneReceiveNote(title,'ch8-note-'+id)}
function ch8Start(){
 if(!CH7.done){gameLocked();return}
 if(CH8.active){game.stage='chapter8';game.chapter2=true;game.chatBlocked=false;ch8Notes();ch8Resume();return}
 Object.assign(CH8,{active:true,done:false,phase:'incoming',session:CH8.session+1,callIndex:0,callState:'ringing',callSeconds:0,friend:[],hj:[],memo:false,mapOpened:false,mapSeconds:0,typed:0,draft:'',pending:[],pendingAfter:'',clock:1150,notes:[],callLog:false});
 game.stage='chapter8';game.chapter2=true;game.chatBlocked=false;try{localStorage.setItem('idol_current_chapter_v1','8')}catch(e){}
 ch8Save();ch8Notes();setTimeout(()=>{if(ch8Is()&&CH8.callState==='ringing')ch8CallPaint()},2500);
}
/* Reuse the exact global phone modal used by chapter one's Wonjin call. */
let ch8DialogueTimer=null;
function ch8CallPaint(){
 if(!ch8Is())return;
 document.getElementById('ch8-call')?.remove();
 const modal=$('call');
 modal.classList.add('show');
 $('callerName').textContent='A';
 if(typeof gameSetCallerAvatar==='function')gameSetCallerAvatar('A');
 $('callsub').textContent=CH8.callState==='ringing'?'来电':CH8.callState==='connected'?'正在通话':'通话已结束';
 $('calltimer').textContent=CH8.callState==='ringing'?'电话 · 来电中…':'通话中 · '+ch8FormatCall();
 $('pip').style.display='none';
 $('answer').style.display=CH8.callState==='ringing'?'block':'none';
 $('callmsg').textContent=CH8.callIndex?ch8CallCaption(CH8_CALL[CH8.callIndex-1]):'';
 if(CH8.callState==='ringing'&&typeof startRing==='function')startRing();
}
function ch8CallCaption(line){return (line[0]==='me'?'：':'A：')+line[1]}
function ch8FormatCall(){let s=CH8.callSeconds;return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function ch8Answer(){
 if(!ch8Is()||CH8.callState!=='ringing')return;
 if(typeof stopRing==='function')stopRing();
 CH8.callState='connected';ch8Save();ch8CallPaint();
 clearInterval(ch8CallTimer);
 ch8CallTimer=setInterval(()=>{if(!ch8Is()||CH8.callState!=='connected')return;CH8.callSeconds++;$('calltimer').textContent='通话中 · '+ch8FormatCall();ch8Save()},1000);
 ch8CallNext();
}
function ch8CallNext(){
 if(!ch8Is()||CH8.callState!=='connected')return;
 clearTimeout(ch8DialogueTimer);
 if(CH8.callIndex>=CH8_CALL.length){CH8.callState='finished';$('callsub').textContent='通话结束后可挂断';ch8Save();return}
 const line=CH8_CALL[CH8.callIndex++];
 $('callmsg').textContent=ch8CallCaption(line);
 ch8Save();
 const length=Array.from(line[1]).length;
 const delay=Math.max(1800,Math.min(4200,1300+length*115));
 ch8DialogueTimer=setTimeout(ch8CallNext,delay);
}
function ch8Reject(){
 if(!ch8Is()||CH8.callState!=='ringing')return;
 if(typeof stopRing==='function')stopRing();
 CH8.callState='declined';CH8.callLog=true;ch8Save();
 $('call').classList.remove('show');
 ch8Queue('friend',[['A','刚给你打电话了'],['A','想约你和亨俊吃个饭，有空回我一下']],'declineReply')
}
function ch8Hangup(){
 if(!ch8Is()||CH8.callState==='ended'||CH8.callState==='declined')return;
 if(CH8.callState==='ringing')return ch8Reject();
 if(CH8.callState!=='finished')return;
 clearInterval(ch8CallTimer);clearTimeout(ch8DialogueTimer);
 if(typeof stopRing==='function')stopRing();
 CH8.callLog=true;CH8.callState='ended';ch8Save();
 $('call').classList.remove('show');
 CH8.phase='friendLocation';ch8Save();
 ch8Queue('friend',[['A','这家！'],['A','我之前去过一次，还不错'],['A','别又找错地方ㅋㅋ'],['A','[地点]'],['A','我们到时候见～']],'locationReady')
}
/* Chapter 1 replaces these globally; delegate back when chapter 8 is inactive. */
const ch8PreviousAnswerCall=answerCall;
answerCall=function(){if(ch8Is()&&CH8.callState==='ringing')return ch8Answer();return ch8PreviousAnswerCall.apply(this,arguments)};
const ch8PreviousEndCall=endCall;
endCall=function(){if(ch8Is()&&['ringing','connected','finished'].includes(CH8.callState))return ch8Hangup();return ch8PreviousEndCall.apply(this,arguments)};
function ch8Push(room,who,text){
 if(!ch8Is())return;const list=room==='friend'?CH8.friend:CH8.hj;
 list.push({who,text,time:ch8Time(),id:'ch8-'+room+'-'+list.length});CH8.clock+=.45;ch8Save();
 const id=room==='friend'?'ch8friend':'hyeongjun';
 if(phoneRoomOpen(id)){if(room==='friend')ch8FriendRoom(true);else ch8Room(true)}
 else if(who!=='me'){phoneReceiveMessage(id,text==='[地点]'?'分享了一个地点':text)}
}
function ch8Queue(room,lines,after){CH8.pending=lines.map(x=>[room,...x]);CH8.pendingAfter=after;ch8Save();ch8Resume()}
function ch8Resume(){if(!ch8Is()||ch8Timer||!CH8.pending.length)return;const token=CH8.session;function tick(){ch8Timer=null;if(!ch8Is()||CH8.session!==token)return;if(!CH8.pending.length){const a=CH8.pendingAfter;CH8.pendingAfter='';ch8Save();ch8After(a);return}const [room,who,msg]=CH8.pending[0];if(who==='me'&&!phonePlayerCanAutoReply(room==='friend'?'ch8friend':'hyeongjun')){ch8Timer=setTimeout(tick,350);return}CH8.pending.shift();ch8Save();ch8Push(room,who,msg);ch8Timer=setTimeout(tick,phoneMessageDelay(msg))}ch8Timer=setTimeout(tick,650)}
function ch8After(a){if(a==='intro1'||a==='intro2'){CH8.phase=a;ch8Save();ch8AutoIntro(a)}if(a==='declineReply'){CH8.phase='declineReply';ch8Save();if(phoneRoomOpen('ch8friend'))ch8FriendRoom(true)}
 if(a==='locationReady'){CH8.phase='map';ch8Save()}
 if(a==='introDone'){CH8.phase='type1';ch8Save();if(phoneRoomOpen('hyeongjun'))ch8Room(true)}
 if(a==='question'){CH8.phase='meetReply';ch8Save();ch8AutoMeetReply()}
 if(a==='consider'){CH8.phase='waiting';ch8Save();setTimeout(()=>{if(ch8Is()&&CH8.phase==='waiting'){CH8.clock=20*60+2;ch8Queue('friend',[['A','对了，时间就按刚才说的那个吧'],['A','晚上七点半'],['A','我先到的话给你们占位置ㅋㅋ']],'friendConfirm')}},13000)}
 if(a==='friendConfirm'){ch8Queue('hj',[['them','那天应该可以'],['them','我会去的']],'finalReply')}
 if(a==='finalReply'){CH8.phase='finalReply';ch8Save();ch8AutoFinalReply()}
 if(a==='end'){CH8.done=true;CH8.phase='done';ch8Save();ch8NoteAdd('end','第八章已结束','今天A打电话约我们一起吃饭。\n\n但这次没有让A替我传话。\n\n我自己告诉亨俊，我希望他能来。\n\n至少有些话，我终于肯自己说出口了。\n\n到时候见。');if(phoneRoomOpen('hyeongjun'))ch8Room(true)}
}
function ch8FriendChoice(i){
 if(!ch8Is()||CH8.phase!=='declineReply')return;
 ch8Push('friend','me','我去');ch8Push('friend','A','那我跟亨俊说一声？');
 CH8.phase='relayReply';ch8Save();ch8FriendRoom(true)
}
function ch8Relay(){if(!ch8Is()||CH8.phase!=='relayReply')return;ch8Push('friend','me','我自己跟他说');CH8.phase='friendLocation';ch8Save();ch8Queue('friend',[['A','行啊ㅋㅋ'],['A','这家！'],['A','我之前去过一次，还不错'],['A','别又找错地方ㅋㅋ'],['A','[地点]'],['A','我们到时候见～']],'locationReady')}
function ch8LocationCard(){return '<button class="ch8-location-card" onclick="ch8OpenLocation()"><span class="ch8-map-mark">N</span><span><strong>'+escapeHtml(CH8_LOCATION.name)+'</strong><small>'+escapeHtml(CH8_LOCATION.area)+'</small><small>在 NAVER Map 中查看 ›</small></span></button>'}
function ch8FriendRoom(quiet=false){
 if(!ch8Is())return;activeApp='kkt';phoneReadRoom('ch8friend');const old=$('chatbody'),scroll=old?.scrollTop;
 const rows=CH8.friend.map((m,i)=>m.text==='[地点]'?'<div class="bubbleline">'+ch8LocationCard()+'<span class="chatmeta">'+m.time+'</span></div>':gameBubble(m.who==='me',m.text,m.time,false,false,i===0||CH8.friend[i-1].who!==m.who)).join('');
 const opts=CH8.phase==='declineReply'?'<div class="story-options"><button class="story-option" onclick="ch8FriendChoice(0)">我去</button></div>':CH8.phase==='relayReply'?'<div class="story-options"><button class="story-option" onclick="ch8Relay()">我自己跟他说</button></div>':'';
 wrap('A','<div id="ch2-chat" data-id="ch8friend" class="ch3-kkt ch5-chat"><div class="chatbody" id="chatbody"><div class="story-date">第八章 · 今天</div>'+rows+'</div><div class="story-send">'+opts+'</div></div>');
 const el=$('chatbody');if(el)el.scrollTop=quiet||scroll==null?el.scrollHeight:scroll;
}
function ch8OpenLocation(){if(!ch8Is())return;CH8.mapOpened=true;CH8.phase=CH8.phase==='map'?'map':CH8.phase;ch8Save();nmOpen();ch8MapDetail()}
function ch8ExternalMap(){window.open('https://map.naver.com/p/search/'+encodeURIComponent(CH8_LOCATION.naverQuery),'_blank','noopener,noreferrer')}
function ch8MapDetail(){
 if(!ch8Is())return;activeApp='map';
 const place=CH8_LOCATION;
 wrap('NAVER Map','<div class="nm-app ch8-map"><div class="nm-search"><span class="nm-brand">N</span><span>收到的地点</span></div><div class="nm-detail"><button class="nm-back" onclick="ch8FriendRoom()">‹ 返回 KakaoTalk</button><div class="ch8-cheongdam-map"><span class="ch8-map-street ch8-street-a">宣陵路</span><span class="ch8-map-street ch8-street-b">清潭洞</span><span class="ch8-map-pin">●</span><strong>Restaurant ON</strong><small>清潭洞位置示意 · 非比例尺</small></div><h2>'+escapeHtml(place.name)+'</h2><div class="nm-ko">'+escapeHtml(place.ko)+' · '+escapeHtml(place.area)+'</div><p class="ch8-map-address">'+escapeHtml(place.address)+'</p><button class="nm-nav" onclick="ch8ExternalMap()">在 NAVER Map 查看准确位置 ↗</button><div class="nm-section-title">A 分享的地点</div><div class="nm-visit"><span class="nm-date">今天 · 19:20</span><p>法式精致餐饮 · 晚餐聚会</p></div><button class="nm-nav" onclick="nmOpen()">查看我的收藏地点</button></div></div>');
 ch8MapTick();
}
function ch8MapTick(){clearInterval(ch8MapTimer);ch8MapTimer=setInterval(()=>{if(!ch8Is()||CH8.memo){clearInterval(ch8MapTimer);return}if(!CH8.mapOpened||activeApp!=='map'||current!=='appview'||document.hidden)return;CH8.mapSeconds++;ch8Save();if(CH8.mapSeconds>=8){clearInterval(ch8MapTimer);CH8.memo=true;ch8Save();ch8NoteAdd('hint','第八章 · 新线索1',CH8_HINT)}},1000)}
function ch8RefreshHint(){const n=CH8.notes.find(x=>x.id==='hint');if(n&&n.text!==CH8_HINT){n.text=CH8_HINT;ch8Save()}}
function ch8Notes(){
 ch8RefreshHint();
 activeApp='notes';phoneReadRoom('notes');let html=['<div class="note" onclick="gameReadNote()"><strong>第一章</strong></div>','<div class="note" onclick="ch2ReadInitialNote()"><strong>第二章</strong></div>','<div class="note" onclick="ch3Note(-1)"><strong>第三章</strong></div>','<div class="note" onclick="ch4ReadNote(0)"><strong>第四章</strong></div>','<div class="note" onclick="ch5IntroNote()"><strong>第五章</strong></div>','<div class="note" onclick="ch6Note(\'intro\')"><strong>第六章</strong></div>','<div class="note" onclick="ch7Note(\'intro\')"><strong>第七章</strong></div>','<div class="note" onclick="ch8Note(\'intro\')"><strong>第八章</strong></div>'];
 for(const n of CH8.notes)html.push('<div class="note" onclick="ch8Note(\''+n.id+'\')"><strong>'+(n.id==='end'?'第八章已结束':'新线索1')+'</strong></div>');
 html.push('<div class="note" onclick="gameChapterMenu()"><strong>跳转至其他章节</strong></div>');
 wrap('备忘录','<div class="content story-notes">'+html.join('')+'</div>');
}
function ch8Note(id){ch8RefreshHint();activeApp='notes';phoneReadRoom('notes');const n=id==='intro'?{title:'第八章',text:'今天本来没什么特别的安排。\n\n先看看手机吧。'}:CH8.notes.find(x=>x.id===id);if(!n)return ch8Notes();const action=id==='hint'?'<button class="choice" onclick="ch8Room()">前往宋亨俊的 KakaoTalk 私聊</button>':id==='end'?'<button class="choice" onclick="storyEndingView(8)">查看章节进度</button>':'';
 wrap(n.title,'<div class="content story-prose ch7-note ch8-note"><h2>'+escapeHtml(n.title)+'</h2><p>'+escapeHtml(n.text)+'</p>'+(action||'<button class="choice" onclick="ch8Notes()">返回备忘录</button>')+'</div>');
}
function ch8Friends(){
 activeApp='kkt';const entries=[['ch8friend','A',CH8.friend.at(-1)?.text==='[地点]'?'[地点] Restaurant ON':CH8.friend.at(-1)?.text||'语音通话','ch8FriendRoom()'],['hyeongjun','宋亨俊',CH8.hj.at(-1)?.text||CH7.messages.at(-1)?.text||'历史消息','ch8Room()'],...['group','woobin','manager','wonjin','serim'].map(id=>[id,({group:'CRAVITY 🐾',woobin:'徐宇瑸',manager:'经纪人',wonjin:'咸元进',serim:'朴世琳'})[id],'历史消息',"ch7LegacyRoom('"+id+"')"])];
 wrap('KakaoTalk','<div class="content ch5-friends">'+entries.map(([id,name,preview,fn])=>'<div class="item" onclick="'+fn+'"><div class="avatar">'+escapeHtml(name[0])+'</div><div class="itemmain"><div class="itemtitle">'+escapeHtml(name)+'</div><div class="itemsub">'+escapeHtml(preview)+'</div></div>'+gameContactBadge(id)+'</div>').join('')+'</div>');
}
function ch8Room(quiet=false){
 if(!ch8Is())return;activeApp='kkt';phoneReadRoom('hyeongjun');const old=$('chatbody'),scroll=old?.scrollTop;
 const hist4=(CH4.lines||[]).map((m,i)=>m.from==='recalled'?'<div class="story-date">消息已删除</div>':gameBubble(m.from==='me',m.text,m.time,false,false,i===0||(CH4.lines[i-1]||{}).from!==m.from)).join('');
 const hist5=(CH5.messages||[]).map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH5.messages[i-1]||{}).who!==m.who)).join('');
 const hist6=(CH6.messages||[]).filter(m=>m.room==='hyeongjun'||m.id==='hyeongjun'||!m.room&&!m.id).map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0)).join('');
 const hist7=(CH7.messages||[]).map((m,i)=>m.type==='song'?'<div class="bubbleline me">'+ch7SongCard(m.songId)+'</div>':gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH7.messages[i-1]||{}).who!==m.who)).join('');
 const rows=CH8.hj.map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||CH8.hj[i-1].who!==m.who)).join('');
 let opts='';
 if(CH8.memo&&CH8.phase==='map'&&CH8.hj.length===0){setTimeout(ch8AutoStartChat,500)}
 if(!quiet&&CH8.phase==='meetReply')ch8AutoMeetReply();
 if(!quiet&&CH8.phase==='finalReply')ch8AutoFinalReply();


 if(CH8.phase==='type1'||CH8.phase==='type2'){const t=CH8.phase==='type1'?'我希望你可以来':'我有话想跟你说';opts='<div class="ch8-type"><label for="ch8-input">请输入：'+t+'</label><div class="ch8-input-row"><input id="ch8-input" autocomplete="off" placeholder="在这里输入这句话" value="'+escapeHtml(CH8.draft)+'" oninput="ch8Draft(this.value)" onkeydown="if(event.key===\'Enter\'&&!event.isComposing)ch8TypeSend()"><button id="ch8-send" onclick="ch8TypeSend()" '+(CH8.draft.trim()===t?'':'disabled')+'>发送</button></div><small id="ch8-error"></small></div>'}


 if(CH8.done)opts='<div class="story-end">当前对话已结束</div>';
 wrap('宋亨俊','<div id="ch2-chat" data-id="hyeongjun" class="ch3-kkt ch5-chat"><div class="chatbody" id="chatbody">'+hist4+'<div class="story-date">第五章</div>'+hist5+'<div class="story-date">第六章</div>'+hist6+'<div class="story-date">第七章</div>'+hist7+'<div class="story-date">第八章 · 今天</div>'+rows+'</div><div class="story-send">'+opts+'</div></div>');
 const el=$('chatbody');if(el)el.scrollTop=quiet||scroll==null?el.scrollHeight:scroll;
}
function ch8AutoStartChat(){if(ch8Is()&&CH8.memo&&CH8.phase==='map'&&!CH8.hj.length&&phonePlayerCanAutoReply('hyeongjun'))ch8SendIntro(0)}
function ch8AutoIntro(a){if(!ch8Is())return;setTimeout(()=>{if(!ch8Is()||CH8.phase!==a||!phonePlayerCanAutoReply('hyeongjun'))return;ch8SendIntro(a==='intro1'?1:2)},1200)}
function ch8AutoMeetReply(){setTimeout(()=>{if(ch8Is()&&CH8.phase==='meetReply'&&phonePlayerCanAutoReply('hyeongjun'))ch8MeetReply()},1500)}
function ch8AutoFinalReply(){setTimeout(()=>{if(ch8Is()&&CH8.phase==='finalReply'&&phonePlayerCanAutoReply('hyeongjun'))ch8FinalReply()},1400)}
function ch8SendIntro(i){
 if(!ch8Is())return;
 if(i===0&&CH8.phase==='map'&&CH8.memo){ch8Push('hj','me','刚刚A给我打电话了');CH8.phase='introWaiting1';ch8Save();ch8Queue('hj',[['them','嗯？']],'intro1')}
 else if(i===1&&CH8.phase==='intro1'){ch8Push('hj','me','说要一起吃饭');CH8.phase='introWaiting2';ch8Save();ch8Queue('hj',[['them','哦哦']],'intro2')}
 else if(i===2&&CH8.phase==='intro2'){ch8Push('hj','me','你去吗');CH8.phase='introWaiting3';ch8Save();ch8Queue('hj',[['them','还没定'],['them','那天可能有事'],['them','去不去还不知道']],'introDone')}
 ch8Room(true)
}
function ch8Draft(s){CH8.draft=s;ch8Save();const target=CH8.phase==='type1'?'我希望你可以来':'我有话想跟你说';const b=document.getElementById('ch8-send');if(b)b.disabled=s.trim()!==target}
function ch8TypeSend(){
 if(!ch8Is()||!['type1','type2'].includes(CH8.phase))return;
 const t=CH8.phase==='type1'?'我希望你可以来':'我有话想跟你说';const input=document.getElementById('ch8-input');if(input)CH8.draft=input.value;if(CH8.draft.trim()!==t){const e=document.getElementById('ch8-error');if(e)e.textContent='请按提示输入这句话';return}
 ch8Push('hj','me',t);CH8.draft='';CH8.typed++;CH8.phase=CH8.typed===1?'type2':'typedDone';ch8Save();ch8Room(true);if(CH8.typed===2)ch8Queue('hj',[['them','什么话']],'question')
}
function ch8MeetReply(){if(CH8.phase!=='meetReply')return;ch8Push('hj','me','见面再说吧');CH8.phase='replying';ch8Save();ch8Queue('hj',[['them','……'],['them','知道了'],['them','我看看能不能过去']],'consider');ch8Room(true)}
function ch8FinalReply(){if(CH8.phase!=='finalReply')return;ch8Push('hj','me','好');ch8Push('hj','me','那到时候见');CH8.phase='ending';ch8Save();ch8Queue('hj',[['them','嗯 到时候见']],'end');ch8Room(true)}
const ch8PrevOpen=openApp;openApp=function(k){if(ch8Is()){if(k==='kkt')return ch8Friends();if(k==='notes')return ch8Notes();if(k==='phone')return ch8Phone()}return ch8PrevOpen(k)};
const ch8PrevUnlock=gameUnlock;gameUnlock=function(k){if(ch8Is())return ['kkt','notes','photos','calendar','ig','phone','delivery','files','x','youtube','spotify','map','melon'].includes(k);return ch8PrevUnlock(k)};
const ch8PrevChat=gameChat;gameChat=function(id){if(ch8Is()){if(id==='hyeongjun')return ch8Room();if(id==='ch8friend')return ch8FriendRoom();if(['group','woobin','manager','wonjin','serim'].includes(id))return ch7LegacyRoom(id)}return ch8PrevChat(id)};
const ch8PrevPhoneOpen=phoneOpenRoom;phoneOpenRoom=function(id){if(ch8Is()){if(id==='hyeongjun')return ch8Room();if(id==='ch8friend')return ch8FriendRoom();if(id==='notes')return ch8Notes();if(typeof id==='string'&&id.startsWith('ch8-note-'))return ch8Note(id.slice(9))}return ch8PrevPhoneOpen(id)};
const ch8PrevNotes=gameNotes;gameNotes=function(){if(ch8Is())return ch8Notes();return ch8PrevNotes()};
function ch8Phone(){activeApp='phone';wrap('电话','<div class="content"><h2>最近通话</h2>'+(CH8.callLog?'<div class="item"><div class="avatar">A</div><div class="itemmain"><strong>A</strong><div class="itemsub">'+(CH8.callState==='declined'?'未接来电':'语音通话')+' · 今天</div></div></div>':'<p>暂无新通话</p>')+'</div>')}
const ch8PrevNmOpen=nmOpen;nmOpen=function(){const r=ch8PrevNmOpen();if(ch8Is()&&CH8.mapOpened&&!CH8.memo)ch8MapTick();return r};
const ch8PrevNmSelect=nmSelect;nmSelect=function(id){const r=ch8PrevNmSelect(id);if(ch8Is()&&CH8.mapOpened&&!CH8.memo)ch8MapTick();return r};
const ch8PrevCh7Note=ch7Note;ch7Note=function(id){const r=ch8PrevCh7Note(id);if(id==='end'&&CH7.done){const root=document.querySelector('.story-ending,.ch7-note');if(root&&!root.querySelector('[onclick="ch8Start()"]'))root.insertAdjacentHTML('beforeend','<button class="choice" onclick="ch8Start()">进入第八章</button>')}return r};
try{const saved=JSON.parse(localStorage.getItem(CH8_KEY)||'null');if(saved?.active)Object.assign(CH8,saved)}catch(e){}
window.addEventListener('load',()=>{if(localStorage.getItem('idol_current_chapter_v1')==='8'&&CH8.active){game.stage='chapter8';game.chapter2=true;game.chatBlocked=false;setTimeout(()=>{if(CH8.callState==='connected'){CH8.callState='ringing';CH8.callIndex=0;ch8Save()}if(CH8.callState==='ringing')ch8CallPaint();ch8Resume();if(CH8.phase==='intro1'||CH8.phase==='intro2')ch8AutoIntro(CH8.phase);if(CH8.phase==='meetReply')ch8AutoMeetReply();if(CH8.phase==='finalReply')ch8AutoFinalReply();if(CH8.mapOpened&&!CH8.memo)ch8MapTick()},900)}});
