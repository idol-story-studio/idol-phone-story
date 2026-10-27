/* Chapter 1 interactive story. Session-only; refresh resets all progress. */
const CH1={
 intro:"我是在医院醒来的。明明记得自己昨天还在练习室，睁开眼睛却已经躺在病床上了。医生说我可能暂时丢失了一部分近期记忆。可是到底忘记了多少，我自己也不清楚。现在唯一能做的，好像只有看看手机里留下了什么。\n\n……为什么亨俊给我发了这么多消息？",
 history:[
 ["宋亨俊","你就连一句道歉都不能好好说吗？"],["我","我不是已经道过歉了吗？"],["宋亨俊","你那叫道歉吗？"],["我","我都说了对不起了"],["宋亨俊","我都已经痛成那样了，你还一副没什么大不了的样子"],["宋亨俊","姜敏熙，你到底有没有认真听我说话？"],["我","我真的不是故意的啊"],["我","你明明知道我不会故意伤害你"],["宋亨俊","所以你还是觉得我应该自己明白，是吗？"],["宋亨俊","算了"],["宋亨俊","我现在不想跟你说话"]
 ],
 morning:["你人呢？","世琳哥在找你。","姜敏熙，你连消息都不看了？"],
 call:["你终于肯接电话了。","姜敏熙，你到底去哪儿了？","亨俊今天一直在找你，你知道吗？","……医院？你怎么跑医院去了？","算了，你人没事就好。","不过你和亨俊的事，还是得好好解决。","你真的不知道他为什么生气？","你之前不是很喜欢在 X 上写那些乱七八糟的心事吗？","自己翻翻吧。还有，记得给世琳哥报个平安。"],
 privatePosts:["真的有那么痛吗……我当时明明什么都没听见。","今天在练习室叫了亨俊好几次，他都没有回头。以前明明我一叫他，他就会看过来的。","我知道可能是我做错了，可是他怎么会觉得我是故意的？别人不知道也就算了，亨俊应该最清楚我有多舍不得他疼。","是不是应该再好好道一次歉？但他也太过分了吧。算了，明天打电话给他好了。"],
 publicPosts:[
 ["转发 · CRAVITY 官方","CRAVITY《LOUDER》回归宣传公开！新的舞台、新的音乐，请大家多多期待！"],
 ["姜敏熙","LOUDER 的舞台准备了很久，希望能把更好的样子展示给大家。今天也请多多关照！"],
 ["转发 · CRAVITY 官方","《LOUDER》相关舞台及宣传内容陆续公开，感谢 LUVITY 一直以来的支持。"],
 ["姜敏熙","每次站上舞台都能感受到大家给我们的力量。谢谢 LUVITY，接下来也会更加努力的。"],
 ["姜敏熙","今天的练习结束！还有很多需要进步的地方，会认真准备下一次见面的。"]
 ]
};
const game={stage:"intro",notesRead:false,kktRead:false,wonjinMessage:false,wonjinReply:false,chapterEnd:false,callType:null,callFinished:false,callIndex:0,callDone:false,xSeen:new Set(),xReady:false,xExited:false,dials:0,dialing:false,phoneLog:[],unread:{notes:1,kkt:0},chatBlocked:false,wonjinTimer:null,session:Date.now(),phoneNoteRead:false,chapter2:false,hyeongjunReadToEnd:false,notificationTarget:null,chatUnread:{hyeongjun:3,wonjin:0},wonjinDelivered:0,wonjinReplyPending:false,wonjinReplyDelivered:false,replyDelayReady:false,replyDelayTimer:null,wonjinChoiceReady:false,wonjinChoiceTimer:null};
function gameBadge(){document.querySelectorAll('.app').forEach(btn=>{let key=(btn.getAttribute('onclick')||'').match(/openApp\('([^']+)'\)/)?.[1];if(!key)return;let old=btn.querySelector('.story-badge');if(old)old.remove();let n=game.unread[key]||0;if(n){let b=document.createElement('span');b.className='story-badge';b.textContent=n;btn.appendChild(b)}})}
function gameNotify(app,msg){game.unread[app]=(game.unread[app]||0)+1;gameBadge();if(app==='kkt'&&activeApp==='kkt'&&current==='appview')return;gameShowBanner(app,app==='kkt'?(msg.includes('咸元进')?'咸元进发来了一条新消息':'宋亨俊发来了一条新消息'):'备忘录有新的内容')}
const storyNotifications=[];
function storyArchiveNotification(app,message){storyNotifications.unshift({app,message,time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})});if(storyNotifications.length>30)storyNotifications.pop();storyRefreshNotificationCenter()}
function gameShowBanner(app,message){storyArchiveNotification(app,message);if(typeof ding==='function')ding();if(current==='lock'||current==='pass'){gameLockBanner(app,message);return}let t=$('toast');t.className='toast story-notification';t.innerHTML='<div class="story-notification-icon">'+(app==='kkt'?'TALK':'▤')+'</div><div class="story-notification-text"><div class="story-notification-app">'+(app==='kkt'?'KakaoTalk':'备忘录')+' <span>现在</span></div><div class="story-notification-body">'+escapeHtml(message)+'</div></div>';t.style.display='flex';game.notificationTarget=app;t.onclick=()=>{clearTimeout(toastTimer);t.style.display='none';if(gameUnlock(app))openApp(app)};clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.style.display='none',8000)}
function gameLockBanner(app,message){let lock=$('lock');let old=lock.querySelector('.story-lock-banner');if(old)old.remove();let el=document.createElement('div');el.className='story-lock-banner';el.innerHTML='<div class="story-lock-icon">'+(app==='kkt'?'TALK':'▤')+'</div><div class="story-lock-copy"><strong>'+(app==='kkt'?'KakaoTalk':'备忘录')+'</strong><span>'+escapeHtml(message)+'</span></div><span class="story-lock-time">现在</span>';el.onclick=()=>openPass();lock.appendChild(el)}
function gameClear(app){game.unread[app]=0;gameBadge()}
function gameSyncKktUnread(){game.unread.kkt=game.chatUnread.hyeongjun+game.chatUnread.wonjin;gameBadge()}
function gameNotifyContact(id){game.chatUnread[id]++;gameSyncKktUnread();if(activeApp==='kkt'&&current==='appview')return;if(typeof ding==='function')ding();gameShowBanner('kkt',(id==='wonjin'?'咸元进':'宋亨俊')+'发来了一条新消息')}
function gameUnlock(app){return app==='notes'||['photos','calendar','map','settings','youtube','spotify','camera','msg'].includes(app)||(app==='kkt'&&game.stage!=='intro')||(app==='x'&&['x','phone','wonjin','end','chapter2'].includes(game.stage))||(app==='phone'&&(['phone','wonjin','end','chapter2'].includes(game.stage)&&game.phoneNoteRead))||(app==='ig'&&game.chapter2)}
function gameLocked(){let t=$('toast');t.className='toast';t.onclick=null;t.textContent='当前未开放该功能';t.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.style.display='none',2200)}
function gameExitX(){if(activeApp==='x'&&game.stage==='x'&&game.xSeen.size===4){game.stage='phone';game.xExited=true;gameNotify('notes','新的线索');}}
const originalStoryShow=show;let storyUnlockedOnce=false;show=function(id){let previous=current;originalStoryShow(id);if(id==='home'&&!storyUnlockedOnce&&(previous==='pass'||previous==='lock')){storyUnlockedOnce=true;setTimeout(()=>{if(game.stage==='intro'&&game.unread.notes>0&&current!=='lock'&&current!=='pass')gameShowBanner('notes','备忘录有新的内容')},1600)}};
const oldHome=goHome;goHome=function(){gameExitX();oldHome();gameBadge()};
const oldOpen=openApp;openApp=function(k){if(!gameUnlock(k)){gameLocked();return}if(k==='notes'){gameNotes();return}if(k==='kkt'){gameFriends();return}if(k==='x'){gameX();return}if(k==='phone'){gameCalls();return}oldOpen(k)};
beginPhoneStory=function(){}; // remove the obsolete 120-second call
function gameNotes(){activeApp='notes';gameClear('notes');let second=game.xExited;let end=game.chapterEnd;wrap('备忘录','<div class="content story-notes"><div class="note" onclick="gameReadNote()"><strong>第一章</strong></div>'+(second?'<div class="note" onclick="gameReadPhoneNote()"><strong>新的线索</strong></div>':'')+(end?'<div class="note" onclick="gameReadEnding()"><strong>第一章已结束</strong></div>':'')+'<div class="note" onclick="gameChapterMenu()"><strong>跳转至其他章节</strong></div></div>')}
function gameChapterMenu(){
 activeApp='notes';
 const chapter=game.chapter2?2:1;
 const destinations=[1,2].filter(n=>n!==chapter);
 wrap('跳转至其他章节','<div class="content story-notes"><p class="story-chapter-hint">选择已开放章节，方便检查剧情与页面。</p>'+destinations.map(n=>'<button class="note story-chapter-button" onclick="gameJumpChapter('+n+')"><strong>前往第'+(n===1?'一':'二')+'章</strong></button>').join('')+'<p class="story-chapter-hint">第三章及后续章节尚未制作，暂不提供无效跳转。</p></div>');
}
function gameJumpChapter(n){
 if(n===2){game.chapter2=true;game.chapterEnd=true;game.stage='chapter2';game.phoneNoteRead=true;game.xExited=true;game.xReady=true;game.xSeen=new Set([0,1,2,3]);game.chatBlocked=true;game.kktRead=true;game.callDone=true;gameStartChapter2FromMenu();return}
 if(n===1){game.chapter2=false;game.chapterEnd=false;game.stage='intro';game.notesRead=false;game.kktRead=false;game.hyeongjunReadToEnd=false;game.replyDelayReady=false;clearTimeout(game.replyDelayTimer);game.replyDelayTimer=null;game.chatBlocked=false;game.sendingBlockedReply=false;game.callDone=false;game.callFinished=false;game.callType=null;game.xExited=false;game.xSeen=new Set();game.phoneNoteRead=false;game.wonjinMessage=false;game.wonjinReply=false;game.wonjinDelivered=0;game.wonjinReplyDelivered=false;game.wonjinChoiceReady=false;game.dials=0;game.chatUnread={hyeongjun:3,wonjin:0};game.unread={notes:1,kkt:0};gameSyncKktUnread();gameNotes();return}
}
function gameStartChapter2FromMenu(){activeApp='notes';wrap('第二章','<div class="content story-prose story-ending"><h2>第二章</h2><p>Instagram 已开放。</p><p>第二章剧情仍在制作中，可以先探索 Instagram。</p><button class="choice" onclick="openApp(\'ig\')">打开 Instagram</button></div>')}
function gameReadPhoneNote(){activeApp='notes';game.phoneNoteRead=true;wrap('新的线索','<div class="content story-prose"><h2>新的线索</h2><p>昨天的我好像决定今天给亨俊打电话。通话记录里有那么多未接来电。他之前明明一直在找我。……现在再打过去，还会接吗？</p><button class="choice" onclick="gameNotes()">返回备忘录</button></div>')}
function gameReadNote(){activeApp='notes';wrap('第一章','<div class="content story-prose"><h2>第一章</h2>'+CH1.intro.split('\n\n').map(t=>'<p>'+escapeHtml(t)+'</p>').join('')+'<button class="choice" onclick="gameFinishIntro()">已阅读，返回备忘录</button></div>')}
function gameFinishIntro(){if(game.stage==='intro'){game.stage='kkt';game.chatUnread.hyeongjun=3;gameSyncKktUnread();setTimeout(()=>{if(game.stage==='kkt'&&!game.kktRead&&!(activeApp==='kkt'&&current==='appview'))gameShowBanner('kkt','宋亨俊发来了一条新消息')},1000)}gameNotes()}
function gameReadEnding(){activeApp='notes';wrap('第一章 · 完结','<div class="content story-prose story-ending"><h2>第一章已结束，请前往下一章节。</h2><p>当前回忆进度：1/10</p><div class="story-progress"><span></span></div><button class="choice" onclick="gameStartChapter2()">前往第二章</button></div>')}
function gameStartChapter2(){if(!game.chapterEnd)return;game.chapter2=true;game.stage='chapter2';activeApp='notes';wrap('第二章','<div class="content story-prose story-ending"><h2>第二章</h2><p>Instagram 已开放。</p><p>下一章剧情正在制作中，可以先探索 Instagram。</p><button class="choice" onclick="openApp(\'ig\')">打开 Instagram</button></div>')}
function gameFriends(){activeApp='kkt';gameSyncKktUnread();wrap('KakaoTalk','<div class="content"><div class="item" onclick="gameChat(\'hyeongjun\')"><div class="avatar">宋</div><div class="itemmain"><div class="itemtitle">宋亨俊</div><div class="itemsub">'+escapeHtml(game.chatBlocked?'消息未能送达':CH1.morning[2])+'</div></div>'+gameContactBadge('hyeongjun')+'</div>'+(game.wonjinMessage?'<div class="item" onclick="gameChat(\'wonjin\')"><div class="avatar">咸</div><div class="itemmain"><div class="itemtitle">咸元进</div><div class="itemsub">'+escapeHtml(game.wonjinDelivered?game.wonjinReplyDelivered?'去ig碰碰运气吧，说不定还能私信他':game.wonjinDelivered>1?'虽然不知道你们吵什么了，但是亨俊还没这么生气过':'说真的，你还是去道个歉吧':'新消息')+'</div></div>'+gameContactBadge('wonjin')+'</div>':'')+'</div>')}
function gameContactBadge(id){let n=game.chatUnread[id]||0;return n?'<span class="story-contact-unread">'+n+'</span>':''}
function gameChat(id){
 activeApp='kkt';if(id==='wonjin'){gameWonjinChat();return}game.chatUnread.hyeongjun=0;gameSyncKktUnread();
 game.kktRead=true;
 let lines='<div class="story-date">一周前</div>'+CH1.history.map(([who,t],i)=>gameBubble(who==='我',t,'晚上 '+(8+Math.floor(i/3))+':'+String(12+i*4).padStart(2,'0'),false,false,i===0||CH1.history[i-1][0]!==who)).join('');
 lines+='<div class="story-date">今天早上</div>'+CH1.morning.map((t,i)=>gameBubble(false,t,'上午 9:'+String(12+i*6).padStart(2,'0'),!game.hyeongjunReadToEnd,false,i===0)).join('');
 if(game.chatBlocked)lines+=gameBubble(true,game.selectedHyeongjunReply||'怎么回事？发生什么了？','刚刚',false,true);
 let action=game.stage==='kkt'&&!game.chatBlocked?gameReplyOptions('hyeongjun'): '<div class="story-end">当前对话已结束</div>';
 let showReply=game.chatBlocked||game.replyDelayReady;
 wrap('宋亨俊','<div class="story-ch1-chat"><div class="chatbody" id="chatbody" onscroll="gameCheckChatScroll()">'+lines+'</div><div class="story-send" id="story-reply" style="'+(showReply?'':'display:none')+'">'+action+'</div></div>');
 let el=$('chatbody');
 if(game.chatBlocked||game.hyeongjunReadToEnd){el.scrollTop=el.scrollHeight}
 else{el.scrollTop=0;requestAnimationFrame(()=>{if(el.isConnected&&el.scrollHeight<=el.clientHeight+8)gameCheckChatScroll()})}
}
function gameCheckChatScroll(){
 let el=$('chatbody');if(!el||game.hyeongjunReadToEnd||game.chatBlocked)return;
 if(el.scrollTop+el.clientHeight>=el.scrollHeight-20){
  game.hyeongjunReadToEnd=true;
  el.querySelectorAll('.story-unread-count').forEach(x=>x.remove());
  if(!game.replyDelayTimer&&!game.replyDelayReady){game.replyDelayTimer=setTimeout(()=>{game.replyDelayReady=true;game.replyDelayTimer=null;let reply=$('story-reply');if(reply&&activeApp==='kkt'&&game.stage==='kkt')reply.style.display='flex'},2000)}
 }
}
function gameBubble(me,t,time,unread=false,failed=false,showTime=true){
 let meta=showTime?'<span class="chatmeta">'+escapeHtml(time)+'</span>':'';
 let status=(unread?'<span class="story-unread-count">1</span>':'')+(failed?'<span class="story-send-failed" aria-label="发送失败">!</span>':'');
 return '<div class="bubbleline '+(me?'me':'')+'">'+(me?meta+status:'')+'<div class="bubble">'+escapeHtml(t)+'</div>'+(me?'':status+meta)+'</div>';
}
function gameBlockedReply(choice){if(game.stage!=='kkt'||game.chatBlocked||game.sendingBlockedReply)return;game.selectedHyeongjunReply=choice||'怎么回事？发生什么了？';game.sendingBlockedReply=true;let area=$('story-reply');if(area)area.innerHTML='<div class="story-composing">正在输入<span class="story-typing"><span></span><span></span><span></span></span></div>';setTimeout(()=>{if(game.stage!=='kkt')return;game.chatBlocked=true;game.stage='call';gameChat('hyeongjun');setTimeout(()=>gameIncomingWonjin(),8000)},1100)}
function gameIncomingWonjin(){if(typeof gameStopDialTone==='function')gameStopDialTone(false);if(game.stage!=='call'||game.callDone)return;game.callType='wonjin';game.callFinished=false;game.callIndex=0;callSession++;clearInterval(callTimer);$('call').classList.add('show');$('callerName').textContent='咸元进';gameSetCallerAvatar('咸元进');$('calltimer').textContent='电话 · 来电中…';$('callsub').textContent='来电';$('callmsg').textContent='';$('answer').style.display='block';$('pip').style.display='none';startRing()}
answerCall=function(){if(game.callType!=='wonjin')return;stopRing();$('answer').style.display='none';$('pip').style.display='none';$('callsub').textContent='正在通话';let session=++callSession;callStart=Date.now();clearInterval(callTimer);callTimer=setInterval(()=>{let s=Math.floor((Date.now()-callStart)/1000);$('calltimer').textContent='通话中 · '+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},500);let elapsed=1000;const gaps=[3000,3000,4000,3000,3000,4000,3000,4000];CH1.call.forEach((t,i)=>{let delay=elapsed;setTimeout(()=>{if(callSession!==session)return;$('callmsg').textContent='咸元进：'+t},delay);elapsed+=gaps[i]||4000});setTimeout(()=>{if(callSession===session){game.callFinished=true;$('callsub').textContent='通话结束后可挂断'}},elapsed)}
endCall=function(){if(typeof gameStopDialTone==='function')gameStopDialTone(true);if(game.callType==='wonjin'){if(!game.callFinished){if($('answer').style.display==='none'){gameLocked();return}game.callType=null;stopRing();clearInterval(callTimer);oldHome();setTimeout(()=>{if(game.stage==='call'&&!game.callDone)gameIncomingWonjin()},1800);return}game.callDone=true;game.callType=null;if(game.stage==='call'){game.stage='x'}}stopRing();clearInterval(callTimer);oldHome();gameBadge()};
function gameX(){
 activeApp='x';
 const feed=[];
 for(let i=0;i<5;i++){feed.push({kind:'public',index:i});if(i<4)feed.push({kind:'private',index:i})}
 const icon=(name)=>({comment:'♡',repost:'⇄',heart:'♡',views:'▥',share:'↥'}[name]);
 const posts=feed.map((p,i)=>{
  const own=p.kind==='private'||!CH1.publicPosts[p.index][0].startsWith('转发');
  const name=own?'姜敏熙':'CRAVITY 官方';
  const handle=own?'@minhee_private':'@CRAVITYstarship';
  const content=p.kind==='private'?CH1.privatePosts[p.index]:CH1.publicPosts[p.index][1];
  const privateLabel=p.kind==='private'?'<div class="story-x-privacy">🔒 仅自己可见</div>':'';
  const repost=!own?'<div class="story-x-reposted">⇄ 姜敏熙 转发了</div>':'';
  return '<article class="story-x-post" '+(p.kind==='private'?'data-private="'+p.index+'"':'')+'>'+repost+'<div class="story-x-postrow"><div class="story-x-avatar '+(own?'':'story-x-brand')+'">'+(own?'姜':'C')+'</div><div class="story-x-postmain"><div class="story-x-authorline"><strong>'+name+'</strong><span class="story-x-handle">'+handle+' · '+(i+1)+'天</span><span class="story-x-more">···</span></div>'+privateLabel+'<div class="story-x-posttext">'+escapeHtml(content)+'</div><div class="story-x-actions"><span>♧ <small>'+(i*2+3)+'</small></span><span>⇄ <small>'+(i*3+2)+'</small></span><button type="button" onclick="gameXLike('+i+',this)" aria-label="点赞">♡ <small>'+(i*7+15)+'</small></button><span>▥ <small>'+(i*18+86)+'</small></span><span>↥</span></div></div></div></article>';
 }).join('');
 wrap('X','<div class="story-x-shell"><div class="story-x-top"><span class="story-x-back" onclick="goHome()">‹</span><div><strong>姜敏熙</strong><small>9 篇帖子</small></div><span class="story-x-topmore">⋯</span></div><div class="story-x" id="story-x"><div class="story-x-banner"></div><div class="story-x-profile"><div class="story-x-profile-actions"><div class="story-x-profile-avatar">姜</div><button type="button" class="story-x-edit" onclick="gameXProfileInfo()">编辑个人资料</button></div><div class="story-x-display"><strong>姜敏熙</strong><span>🔒</span></div><div class="story-x-handle">@minhee_private</div><p class="story-x-bio">舞台上的每一天都很珍贵。谢谢 LUVITY！</p><div class="story-x-meta">♧ CRAVITY　·　加入于 2022年</div><div class="story-x-stats"><strong>42</strong> 正在关注　 <strong>18</strong> 关注者</div></div><div class="story-x-tabs"><span class="selected">帖子</span><span>回复</span><span>媒体</span><span>喜欢</span></div>'+posts+'<p class="story-x-foot">'+(game.xReady?'已经看完了这些日记。或许该试着打电话了。':'')+'</p></div><div class="story-x-bottom"><span class="selected">⌂</span><span>⌕</span><span>♧</span><span>✉</span></div></div>');
 const el=$('story-x');el.addEventListener('scroll',gameCheckX,{passive:true});requestAnimationFrame(gameCheckX)
}
function gameXLike(i,btn){btn.classList.toggle('liked');btn.setAttribute('aria-pressed',String(btn.classList.contains('liked')))}
function gameXProfileInfo(){const el=document.querySelector('.story-x-bio');if(el)el.scrollIntoView({block:'center',behavior:'smooth'})}
function gameCheckX(){
 const root=$('story-x');if(!root)return;
 root.querySelectorAll('[data-private]').forEach(el=>{
  const r=el.getBoundingClientRect(),box=root.getBoundingClientRect();
  if(r.top<box.bottom-30&&r.bottom>box.top+30)game.xSeen.add(Number(el.dataset.private))
 });
 if(game.xSeen.size===4&&!game.xReady){
  game.xReady=true;const f=root.querySelector('.story-x-foot');
  if(f)f.textContent='已经看完了这些日记。或许该试着打电话了。'
 }
}
function gameCalls(){activeApp='phone';let missed=[['宋亨俊',9,'晚上 9:18'],['朴世琳',3,'晚上 8:43'],['徐宇瑸',1,'下午 6:10']];let rows=missed.map(([name,count,time])=>'<div class="item" onclick="gameDial(\''+name+'\')"><div class="itemmain"><div class="itemtitle" style="color:#e44848">'+name+' ('+count+')</div><div class="itemsub">未接来电 · '+time+'</div></div><span class="muted">☎</span></div>').join('')+game.phoneLog.map(x=>'<div class="item"><div class="itemmain"><div class="itemtitle">'+escapeHtml(x)+'</div><div class="itemsub">刚刚 · 呼出</div></div></div>').join('');wrap('最近通话','<div class="content"><h4>今天</h4>'+rows+'<h4>通讯录</h4>'+missed.map(([n])=>'<div class="item" onclick="gameDial(\''+n+'\')"><div class="itemmain">'+n+'</div><span>拨打 ›</span></div>').join('')+'</div>')}
function gameDial(name){if(game.dialing)return;if(name!=='宋亨俊'){gameLocked();return}game.dials++;let n=game.dials;game.phoneLog.unshift('宋亨俊 · '+(n===1?'对方已挂断':'无法接通'));game.dialing=true;game.callType='outgoing';if(typeof gameStartDialTone==='function')gameStartDialTone();$('call').classList.add('show');$('callerName').textContent='宋亨俊';gameSetCallerAvatar('宋亨俊');$('calltimer').textContent=n>2?'无法接通':'正在拨号…';$('callsub').textContent='电话';$('callmsg').textContent='';$('answer').style.display='none';$('pip').style.display='none';let session=++callSession;if(n===2){setTimeout(()=>{if(game.wonjinMessage)return;game.wonjinMessage=true;game.stage='wonjin';gameNotifyContact('wonjin');gameScheduleWonjinSecond()},9000)}setTimeout(()=>{if(callSession!==session)return;if(typeof gameStopDialTone==='function')gameStopDialTone(true);$('calltimer').textContent=n===1?'对方已挂断':'无法接通';$('callmsg').textContent=n===1?'通话已结束':'无法接通';game.dialing=false},n>2?1200:6000)}
function gameScheduleWonjinSecond(){
 if(game.wonjinDelivered)return;
 game.wonjinDelivered=1;
 setTimeout(()=>{if(game.wonjinDelivered!==1)return;game.wonjinDelivered=2;if(activeApp==='kkt'&&document.getElementById('wonjin-chat'))gameWonjinChat();else gameNotifyContact('wonjin')},2500);
}
function gameWonjinChat(){
 activeApp='kkt';game.chatUnread.wonjin=0;gameSyncKktUnread();
 const lines=[["them","说真的，你还是去跟亨俊好好道个歉吧。"],["them","我没见过他这么生气。"],["me","可是他把我的 KKT 和电话都拉黑了。"],["them","……你俩真是。"],["them","那你去 IG 试试看吧。"],["them","不过别再说什么“你应该懂我”的话了。"]];
 const count=game.wonjinReplyDelivered?6:game.wonjinReply?Math.min(6,game.wonjinDelivered):Math.min(2,game.wonjinDelivered);
 let rows=lines.slice(0,count).map(([who,t],i)=>gameBubble(who==='me'?(true):false,who==='me'?(game.selectedWonjinReply||t):t,'刚刚',false,false,i===0||lines[i-1][0]!==who)).join('');
 if(game.wonjinDelivered>=2&&!game.wonjinReply&&!game.wonjinChoiceReady&&!game.wonjinChoiceTimer){game.wonjinChoiceTimer=setTimeout(()=>{game.wonjinChoiceReady=true;game.wonjinChoiceTimer=null;if(activeApp==='kkt'&&document.getElementById('wonjin-chat'))gameWonjinChat()},2000)}
 const action=game.wonjinReplyDelivered?'<div class="story-end">当前对话已结束</div>':game.wonjinReply?'<div class="story-typing"><span></span><span></span><span></span></div>':game.wonjinChoiceReady?gameReplyOptions('wonjin'):'<div class="story-typing"><span></span><span></span><span></span></div>';
 wrap('咸元进','<div class="story-ch1-chat" id="wonjin-chat"><div class="chatbody" id="chatbody">'+rows+'</div><div class="story-send">'+action+'</div></div>');$('chatbody').scrollTop=$('chatbody').scrollHeight;
}
function gameReplyWonjin(choice){
 if(game.wonjinReply||game.wonjinDelivered<2||!game.wonjinChoiceReady)return;
 game.wonjinReply=true;game.selectedWonjinReply=choice||'可是他把我的 KKT 和电话都拉黑了。';
 let area=document.querySelector('#wonjin-chat .story-send');if(area)area.innerHTML='<div class="story-composing">正在输入<span class="story-typing"><span></span><span></span><span></span></span></div>';
 setTimeout(()=>{if(activeApp==='kkt'&&document.getElementById('wonjin-chat'))gameWonjinChat()},1000);
 [2500,5100,7700].forEach((delay,i)=>setTimeout(()=>{
  game.wonjinDelivered=4+i;if(i===2)game.wonjinReplyDelivered=true;
  if(activeApp==='kkt'&&document.getElementById('wonjin-chat'))gameWonjinChat();else gameNotifyContact('wonjin');
  if(i===2)setTimeout(()=>{if(game.chapterEnd)return;game.chapterEnd=true;game.stage='end';gameNotify('notes','第一章已结束')},3000);
 },delay));
}
/* Swipe down from the top edge to inspect recent notifications without losing the current app. */
let storyNotificationCenter=null,storySwipeStart=null;
function storyEnsureNotificationCenter(){
 if(storyNotificationCenter)return storyNotificationCenter;
 let panel=document.createElement('section');panel.id='story-notification-center';panel.setAttribute('aria-label','通知中心');
 panel.innerHTML='<div class="story-nc-head"><button onclick="storyCloseNotificationCenter()">完成</button><strong>通知中心</strong><button onclick="storyClearNotificationCenter()">清除</button></div><div class="story-nc-list" id="story-nc-list"></div><div class="story-nc-hint">上滑关闭</div>';
 $('phone').appendChild(panel);storyNotificationCenter=panel;return panel;
}
function storyRefreshNotificationCenter(){
 if(!storyNotificationCenter)return;
 let list=$('story-nc-list');if(!list)return;
 list.innerHTML=storyNotifications.length?storyNotifications.map((n,i)=>'<button class="story-nc-card" onclick="storyOpenNotification('+i+')"><span class="story-nc-icon">'+(n.app==='kkt'?'TALK':'▤')+'</span><span class="story-nc-info"><strong>'+(n.app==='kkt'?'KakaoTalk':'备忘录')+'</strong><span>'+escapeHtml(n.message)+'</span></span><small>'+n.time+'</small></button>').join(''):'<div class="story-nc-empty">没有通知</div>';
}
function storyOpenNotification(i){let n=storyNotifications[i];if(!n)return;storyCloseNotificationCenter();if(gameUnlock(n.app))openApp(n.app)}
function storyOpenNotificationCenter(){storyEnsureNotificationCenter().classList.add('open');storyRefreshNotificationCenter()}
function storyCloseNotificationCenter(){if(storyNotificationCenter)storyNotificationCenter.classList.remove('open')}
function storyClearNotificationCenter(){storyNotifications.length=0;storyRefreshNotificationCenter()}
document.getElementById('phone').addEventListener('touchstart',e=>{if(e.touches.length!==1)return;let y=e.touches[0].clientY-$('phone').getBoundingClientRect().top;storySwipeStart=y<65?e.touches[0].clientY:null},{passive:true});
document.getElementById('phone').addEventListener('touchend',e=>{if(storySwipeStart===null)return;let diff=e.changedTouches[0].clientY-storySwipeStart;storySwipeStart=null;if(diff>75)storyOpenNotificationCenter()},{passive:true});
let storyPanelTouchStart=null;
document.getElementById('phone').addEventListener('touchstart',e=>{if(storyNotificationCenter?.classList.contains('open'))storyPanelTouchStart=e.touches[0].clientY},{passive:true});
document.getElementById('phone').addEventListener('touchend',e=>{if(storyNotificationCenter?.classList.contains('open')&&storyPanelTouchStart!==null){let d=e.changedTouches[0].clientY-storyPanelTouchStart;if(d< -65)storyCloseNotificationCenter();storyPanelTouchStart=null}},{passive:true});

gameSyncKktUnread();
setTimeout(()=>{if(game.stage==='intro'&&game.unread.notes>0)gameShowBanner('notes','备忘录有新的内容')},2200);

/* Optional dialogue choices: different player text, identical approved plot outcome. */
function gameReplyOptions(kind){
 const options=kind==='hyeongjun'?['怎么回事？发生什么了？','亨俊，你能告诉我到底怎么了吗？','我们能不能好好聊一下？']:['可是他把我的 KKT 和电话都拉黑了。','我也想道歉，但现在根本联系不上他。','我试过打电话了，他好像不愿意接。'];
 const callback=kind==='hyeongjun'?'gameBlockedReply':'gameReplyWonjin';
 return '<div class="story-options">'+options.map((v,i)=>'<button class="story-option" onclick="'+callback+'('+JSON.stringify(v).replace(/"/g,'&quot;')+')">'+escapeHtml(v)+'</button>').join('')+'</div>';
}

/* Caller initials: always use the first character of the contact name. */
function gameSetCallerAvatar(name){const caller=$('callerName');if(!caller)return;let avatar=$('story-caller-avatar');if(!avatar){avatar=caller.parentElement.querySelector('.avatar');if(avatar)avatar.id='story-caller-avatar';else{avatar=document.createElement('div');avatar.id='story-caller-avatar';caller.parentElement.insertBefore(avatar,caller)}}avatar.className='story-caller-avatar';avatar.removeAttribute('style');avatar.textContent=String(name||'').trim().charAt(0)}

/* Outgoing call audio uses Web Audio oscillators, without external media. */
let gameDialToneTimer=null;
function gameStartDialTone(){gameStopDialTone(false);if(typeof tone!=='function')return;const pulse=()=>{tone(425,.36,.075);tone(425,.36,.075,.43)};pulse();gameDialToneTimer=setInterval(pulse,2400)}
function gameStopDialTone(hangup){if(gameDialToneTimer){clearInterval(gameDialToneTimer);gameDialToneTimer=null}if(hangup&&typeof tone==='function'){tone(480,.12,.09);tone(350,.19,.09,.16)}}
