/* Chapter 1 interactive story. Session-only; refresh resets all progress. */
const CH1={
 intro:"你在医院的病床上醒来，看着陌生的环境十分茫然。记忆的深处仿佛有一块儿被堵住了，完全想不起自己到底是怎么来到这里的。\n\n现在你的手里只有这一部手机，试试看能得到什么信息吧。\n\n提示：kkt的聊天记录或许能帮你想起些什么",
 history:[
 ["宋亨俊","你就连一句道歉都不能好好说吗？"],["我","我不是已经道过歉了吗？"],["宋亨俊","你那叫道歉吗？"],["我","我都说了对不起了"],["宋亨俊","我都已经痛成这样了，你态度还这么敷衍，换你你能忍吗？"],["宋亨俊","算了我不想跟你吵了，你爱怎么样怎么样吧"]
 ],
 morning:["你人呢？世琳哥在找你呢","姜敏熙，你不至于连消息都不读了吧？","行啊，你的事我以后也懒得管了"],
 call:["你终于肯接电话了","都一整天了，你人在哪儿呢？","医院？你怎么会到医院去？","人没事就好，快回来吧，亨俊很担心你","他为什么拉黑你难道你不知道吗？想不起来就去X上看看吧"],
 privatePosts:["真的很痛吗？可是我也没有很用力啊……","亨俊真的不打算理我了，明明听见我叫他了，却好像没听到一样。","我该去道歉吗？说实话可能确实是我的问题，但是我也觉得很委屈啊，怎么会认为我是故意的呢，明明我是这个世界上最不愿意看见他受伤的人。","如果明天还不打算理我的话，打个电话跟他道歉吧。"],
 publicPosts:[
 ["转发 · CRAVITY 官方","CRAVITY《LOUDER》回归宣传公开！新的舞台、新的音乐，请大家多多期待！"],
 ["姜敏熙","LOUDER 的舞台准备了很久，希望能把更好的样子展示给大家。今天也请多多关照！"],
 ["转发 · CRAVITY 官方","《LOUDER》相关舞台及宣传内容陆续公开，感谢 LUVITY 一直以来的支持。"],
 ["姜敏熙","每次站上舞台都能感受到大家给我们的力量。谢谢 LUVITY，接下来也会更加努力的。"],
 ["姜敏熙","今天的练习结束！还有很多需要进步的地方，会认真准备下一次见面的。"]
 ]
};
const game={stage:"intro",notesRead:false,kktRead:false,wonjinMessage:false,wonjinReply:false,chapterEnd:false,callType:null,callFinished:false,callIndex:0,callDone:false,xSeen:new Set(),xReady:false,xExited:false,dials:0,dialing:false,phoneLog:[],unread:{notes:1,kkt:0},chatBlocked:false,wonjinTimer:null,session:Date.now(),phoneNoteRead:false,chapter2:false,hyeongjunReadToEnd:false,notificationTarget:null};
function gameBadge(){document.querySelectorAll('.app').forEach(btn=>{let key=(btn.getAttribute('onclick')||'').match(/openApp\('([^']+)'\)/)?.[1];if(!key)return;let old=btn.querySelector('.story-badge');if(old)old.remove();let n=game.unread[key]||0;if(n){let b=document.createElement('span');b.className='story-badge';b.textContent=n;btn.appendChild(b)}})}
function gameNotify(app,msg){game.unread[app]=(game.unread[app]||0)+1;gameBadge();if(app==='kkt'&&activeApp==='kkt'&&current==='appview')return;if(typeof ding==='function')ding();gameShowBanner(app,app==='kkt'?(msg.includes('咸元进')?'咸元进发来了一条新消息':'宋亨俊发来了一条新消息'):'备忘录有新的内容')}
function gameShowBanner(app,message){let t=$('toast');t.className='toast story-notification';t.innerHTML='<div class="story-notification-icon">'+(app==='kkt'?'TALK':'▤')+'</div><div class="story-notification-text"><div class="story-notification-app">'+(app==='kkt'?'KakaoTalk':'备忘录')+' <span>现在</span></div><div class="story-notification-body">'+escapeHtml(message)+'</div></div>';t.style.display='flex';game.notificationTarget=app;t.onclick=()=>{clearTimeout(toastTimer);t.style.display='none';if(gameUnlock(app))openApp(app)};clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.style.display='none',8000)}
function gameClear(app){game.unread[app]=0;gameBadge()}
function gameUnlock(app){return app==='notes'||['photos','calendar','map','settings','youtube','spotify','camera','msg'].includes(app)||(app==='kkt'&&game.stage!=='intro')||(app==='x'&&['x','phone','wonjin','end','chapter2'].includes(game.stage))||(app==='phone'&&(['phone','wonjin','end','chapter2'].includes(game.stage)&&game.phoneNoteRead))||(app==='ig'&&game.chapter2)}
function gameLocked(){let t=$('toast');t.className='toast';t.onclick=null;t.textContent='当前未开放该功能';t.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.style.display='none',2200)}
function gameExitX(){if(activeApp==='x'&&game.stage==='x'&&game.xSeen.size===4){game.stage='phone';game.xExited=true;gameNotify('notes','新的线索');}}
const oldHome=goHome;goHome=function(){gameExitX();oldHome();gameBadge()};
const oldOpen=openApp;openApp=function(k){if(!gameUnlock(k)){gameLocked();return}if(k==='notes'){gameNotes();return}if(k==='kkt'){gameFriends();return}if(k==='x'){gameX();return}if(k==='phone'){gameCalls();return}oldOpen(k)};
beginPhoneStory=function(){}; // remove the obsolete 120-second call
function gameNotes(){activeApp='notes';gameClear('notes');let second=game.xExited;let end=game.chapterEnd;wrap('备忘录','<div class="content story-notes"><div class="note" onclick="gameReadNote()"><strong>第一章</strong><div class="itemsub">你在医院的病床上醒来……</div></div>'+(second?'<div class="note" onclick="gameReadPhoneNote()"><strong>新的线索</strong><div class="itemsub">试试打个电话吧</div></div>':'')+(end?'<div class="note" onclick="gameReadEnding()"><strong>第一章已结束</strong><div class="itemsub">当前回忆进度：1/10</div></div>':'')+'</div>')}
function gameReadPhoneNote(){activeApp='notes';game.phoneNoteRead=true;wrap('新的线索','<div class="content story-prose"><h2>新的线索</h2><p>试试打个电话吧</p><button class="choice" onclick="gameNotes()">返回备忘录</button></div>')}
function gameReadNote(){activeApp='notes';wrap('第一章','<div class="content story-prose"><h2>第一章</h2>'+CH1.intro.split('\n\n').map(t=>'<p>'+escapeHtml(t)+'</p>').join('')+'<button class="choice" onclick="gameFinishIntro()">已阅读，返回备忘录</button></div>')}
function gameFinishIntro(){if(game.stage==='intro'){game.stage='kkt';gameNotify('kkt','宋亨俊发来了消息')}gameNotes()}
function gameReadEnding(){activeApp='notes';wrap('第一章 · 完结','<div class="content story-prose story-ending"><h2>第一章已结束，请前往下一章节。</h2><p>当前回忆进度：1/10</p><div class="story-progress"><span></span></div><button class="choice" onclick="gameStartChapter2()">前往第二章</button></div>')}
function gameStartChapter2(){if(!game.chapterEnd)return;game.chapter2=true;game.stage='chapter2';activeApp='notes';wrap('第二章','<div class="content story-prose story-ending"><h2>第二章</h2><p>Instagram 已开放。</p><p>下一章剧情正在制作中，可以先探索 Instagram。</p><button class="choice" onclick="openApp(\'ig\')">打开 Instagram</button></div>')}
function gameFriends(){activeApp='kkt';gameClear('kkt');wrap('KakaoTalk','<div class="content"><div class="item" onclick="gameChat(\'hyeongjun\')"><div class="avatar">亨</div><div class="itemmain"><div class="itemtitle">宋亨俊</div><div class="itemsub">'+escapeHtml(game.chatBlocked?'消息未能送达':CH1.morning[2])+'</div></div></div>'+(game.wonjinMessage?'<div class="item" onclick="gameChat(\'wonjin\')"><div class="avatar">进</div><div class="itemmain"><div class="itemtitle">咸元进</div><div class="itemsub">说真的，你还是去道个歉吧</div></div></div>':'')+'</div>')}
function gameChat(id){
 activeApp='kkt';gameClear('kkt');if(id==='wonjin'){gameWonjinChat();return}
 game.kktRead=true;
 let lines='<div class="story-date">一周前</div>'+CH1.history.map(([who,t],i)=>gameBubble(who==='我',t,'晚上 '+(8+Math.floor(i/3))+':'+String(12+i*4).padStart(2,'0'))).join('');
 lines+='<div class="story-date">今天早上</div>'+CH1.morning.map((t,i)=>gameBubble(false,t,'上午 9:'+String(12+i*6).padStart(2,'0'),!game.hyeongjunReadToEnd)).join('');
 if(game.chatBlocked)lines+=gameBubble(true,'怎么回事？发生什么了？','刚刚',false,true);
 let action=game.stage==='kkt'&&!game.chatBlocked?'<button class="choice" onclick="gameBlockedReply()">怎么回事？发生什么了？　发送</button>':'<div class="story-end">当前对话已结束</div>';
 let showReply=game.chatBlocked||game.hyeongjunReadToEnd;
 wrap('宋亨俊','<div class="chatbody" id="chatbody" onscroll="gameCheckChatScroll()">'+lines+'</div><div class="story-send" id="story-reply" style="'+(showReply?'':'display:none')+'">'+action+'</div>');
 let el=$('chatbody');
 if(game.chatBlocked||game.hyeongjunReadToEnd){el.scrollTop=el.scrollHeight}
 else{el.scrollTop=0;requestAnimationFrame(()=>{if(el.isConnected&&el.scrollHeight<=el.clientHeight+8)gameCheckChatScroll()})}
}
function gameCheckChatScroll(){
 let el=$('chatbody');if(!el||game.hyeongjunReadToEnd||game.chatBlocked)return;
 if(el.scrollTop+el.clientHeight>=el.scrollHeight-20){
  game.hyeongjunReadToEnd=true;
  el.querySelectorAll('.story-unread-count').forEach(x=>x.remove());
  let reply=$('story-reply');if(reply)reply.style.display='flex';
 }
}
function gameBubble(me,t,time,unread=false,failed=false){
 let meta='<span class="chatmeta">'+escapeHtml(time)+'</span>';
 let status=(unread?'<span class="story-unread-count">1</span>':'')+(failed?'<span class="story-send-failed" aria-label="发送失败">!</span>':'');
 return '<div class="bubbleline '+(me?'me':'')+'">'+(me?meta+status:'')+'<div class="bubble">'+escapeHtml(t)+'</div>'+(me?'':status+meta)+'</div>';
}
function gameBlockedReply(){if(game.stage!=='kkt'||game.chatBlocked)return;game.chatBlocked=true;game.stage='call';gameChat('hyeongjun');setTimeout(()=>gameIncomingWonjin(),8000)}
function gameIncomingWonjin(){if(game.stage!=='call'||game.callDone)return;game.callType='wonjin';game.callFinished=false;game.callIndex=0;callSession++;clearInterval(callTimer);$('call').classList.add('show');$('callerName').textContent='咸元进';$('calltimer').textContent='电话 · 来电中…';$('callsub').textContent='来电';$('callmsg').textContent='';$('answer').style.display='block';$('pip').style.display='none';startRing()}
answerCall=function(){if(game.callType!=='wonjin')return;stopRing();$('answer').style.display='none';$('pip').style.display='none';$('callsub').textContent='正在通话';let session=++callSession;callStart=Date.now();clearInterval(callTimer);callTimer=setInterval(()=>{let s=Math.floor((Date.now()-callStart)/1000);$('calltimer').textContent='通话中 · '+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},500);let elapsed=1100;CH1.call.forEach(t=>{let delay=elapsed;setTimeout(()=>{if(callSession!==session)return;$('callmsg').textContent='咸元进：'+t},delay);elapsed+=Math.max(2300,Math.min(6000,t.length*180+800))});setTimeout(()=>{if(callSession===session){game.callFinished=true;$('callsub').textContent='通话结束后可挂断'}},elapsed)}
endCall=function(){if(game.callType==='wonjin'){if(!game.callFinished){if($('answer').style.display==='none'){gameLocked();return}game.callType=null;stopRing();clearInterval(callTimer);oldHome();setTimeout(()=>{if(game.stage==='call'&&!game.callDone)gameIncomingWonjin()},1800);return}game.callDone=true;game.callType=null;if(game.stage==='call'){game.stage='x';gameNotify('notes','新的线索')}}stopRing();clearInterval(callTimer);oldHome();gameBadge()};
function gameX(){activeApp='x';let publicQueue=[CH1.publicPosts[0],CH1.publicPosts[1],CH1.publicPosts[2],CH1.publicPosts[3],CH1.publicPosts[4]];let feed=[];for(let i=0;i<5;i++){feed.push({kind:'public',data:publicQueue[i]});if(i<4)feed.push({kind:'private',index:i,data:CH1.privatePosts[i]})}wrap('X','<div class="story-x" id="story-x"><div class="story-x-banner"></div><div class="story-x-profile"><strong>姜敏熙</strong><div>@minhee_private · CRAVITY</div><p>舞台上的每一天都很珍贵。谢谢 LUVITY！</p></div>'+feed.map((p,i)=>'<article class="story-x-post" '+(p.kind==='private'?'data-private="'+p.index+'"':'')+'><div class="story-x-author">'+(p.kind==='private'?'🔒 仅自己可见 · 姜敏熙':escapeHtml(p.data[0]))+'</div><div class="story-x-time">'+(p.kind==='private'?'仅自己可见':'所有人可见')+'</div><p>'+escapeHtml(p.kind==='private'?p.data:p.data[1])+'</p></article>').join('')+'<p class="story-x-foot">阅读完所有私密动态后，返回桌面寻找下一条线索。</p></div>');let el=$('story-x');el.addEventListener('scroll',gameCheckX);requestAnimationFrame(gameCheckX)}
function gameCheckX(){let root=$('story-x');if(!root)return;root.querySelectorAll('[data-private]').forEach(el=>{let r=el.getBoundingClientRect(),box=root.getBoundingClientRect();if(r.top>=box.top-35&&r.bottom<=box.bottom+35)game.xSeen.add(Number(el.dataset.private))});if(game.xSeen.size===4&&!game.xReady){game.xReady=true;let f=root.querySelector('.story-x-foot');if(f)f.textContent='已经看完了这些日记。或许该试着打电话了。'}}
function gameCalls(){activeApp='phone';let missed=[['宋亨俊',9,'晚上 9:18'],['朴世琳',3,'晚上 8:43'],['徐宇瑸',1,'下午 6:10']];let rows=missed.map(([name,count,time])=>'<div class="item" onclick="gameDial(\''+name+'\')"><div class="itemmain"><div class="itemtitle" style="color:#e44848">'+name+' ('+count+')</div><div class="itemsub">未接来电 · '+time+'</div></div><span class="muted">☎</span></div>').join('')+game.phoneLog.map(x=>'<div class="item"><div class="itemmain"><div class="itemtitle">'+escapeHtml(x)+'</div><div class="itemsub">刚刚 · 呼出</div></div></div>').join('');wrap('最近通话','<div class="content"><h4>今天</h4>'+rows+'<h4>通讯录</h4>'+missed.map(([n])=>'<div class="item" onclick="gameDial(\''+n+'\')"><div class="itemmain">'+n+'</div><span>拨打 ›</span></div>').join('')+'</div>')}
function gameDial(name){if(game.dialing)return;if(name!=='宋亨俊'){gameLocked();return}game.dials++;let n=game.dials;game.phoneLog.unshift('宋亨俊 · '+(n===1?'对方挂断':n===2?'无法接通':'已被拉黑'));game.dialing=true;game.callType='outgoing';$('call').classList.add('show');$('callerName').textContent='宋亨俊';$('calltimer').textContent=n>2?'无法接通':'正在拨号…';$('callsub').textContent='电话';$('callmsg').textContent=n>2?'对方已将你拉黑':'';$('answer').style.display='none';$('pip').style.display='none';let session=++callSession;if(n===2){setTimeout(()=>{if(game.wonjinMessage)return;game.wonjinMessage=true;game.stage='wonjin';gameNotify('kkt','咸元进发来消息')},10000)}setTimeout(()=>{if(callSession!==session)return;$('calltimer').textContent=n===1?'对方已挂断':'无法接通';$('callmsg').textContent=n===1?'通话已结束':'对方已将你拉黑';game.dialing=false},n>2?1200:6000)}
function gameWonjinChat(){activeApp='kkt';gameClear('kkt');let rows=gameBubble(false,'说真的，你还是去道个歉吧','刚刚')+gameBubble(false,'虽然不知道你们吵什么了，但是亨俊还没这么生气过','刚刚');if(game.wonjinReply)rows+=gameBubble(true,'但是亨俊把我的kkt和电话都拉黑了','刚刚')+gameBubble(false,'去ig碰碰运气吧，说不定还能私信他','刚刚');wrap('咸元进','<div class="chatbody" id="chatbody">'+rows+'</div><div class="story-send">'+(!game.wonjinReply?'<button class="choice" onclick="gameReplyWonjin()">但是亨俊把我的kkt和电话都拉黑了</button>':'<div class="story-end">当前对话已结束</div>')+'</div>');$('chatbody').scrollTop=$('chatbody').scrollHeight}
function gameReplyWonjin(){if(game.wonjinReply)return;game.wonjinReply=true;gameWonjinChat();setTimeout(()=>{if(game.chapterEnd)return;game.chapterEnd=true;game.stage='end';gameNotify('notes','章节结束');if(activeApp==='kkt'&&$('chatbody'))gameWonjinChat()},4400)}
gameBadge();
