/* Chapter 4 — 还在生气吗？ Additive, preserving chapters 1–3. */
const CH4_KEY='idol_ch4_v1';
const CH4={active:false,step:0,lines:[],group:[],note:'',pending:null,callState:'',done:false,callLog:false};
function ch4Save(){localStorage.setItem(CH4_KEY,JSON.stringify(CH4))}
function ch4Start(){if(!CH3.done){gameLocked();return}Object.assign(CH4,{active:true,step:0,lines:[],group:[],note:'已解锁：日历（含待办）和外卖民族。可以随时去看看。',pending:null,callState:'',done:false,callLog:false});game.stage='chapter4';game.chatBlocked=false;ch4Save();ch4Notes();setTimeout(()=>ch4Next(),1700)}
function ch4Line(from,text){CH4.lines.push({from,text,time:'刚刚'});ch4Save();if(document.querySelector('#ch4-room'))ch4Room();else if(from==='them')gameShowBanner('kkt','宋亨俊发来了一条新消息')}
function ch4Batch(items,done){let i=0;function run(){if(!CH4.active||i>=items.length){if(done)done();return}let [from,t]=items[i++];ch4Line(from,t);setTimeout(run,from==='them'?1100:650)}run()}
function ch4Next(){
 if(CH4.step===0){CH4.step=1;ch4Save();ch4Batch([['them','明天来公司吗'],['them','几点到']],()=>{CH4.pending='intro';ch4Save();if(document.querySelector('#ch4-room'))ch4Room()});}
 else if(CH4.step===2){CH4.step=3;ch4Save();setTimeout(()=>ch4GroupPush(),2000)}
 else if(CH4.step===4){CH4.step=5;ch4Save();setTimeout(()=>ch4Batch([['them','你到公司了？']],()=>{CH4.pending='arrived';ch4Save();if(document.querySelector('#ch4-room'))ch4Room()}),2500)}
 else if(CH4.step===6){CH4.step=7;ch4Save();setTimeout(()=>ch4Batch([['them','我先走啦'],['them','廷谟哥找我有点事']],()=>{CH4.pending='wait';ch4Save();if(document.querySelector('#ch4-room'))ch4Room()}),5500)}
 else if(CH4.step===8){CH4.step=9;ch4Save();setTimeout(()=>ch4Batch([['them','你看'],['them','又来了ㅋㅋ']],()=>{CH4.pending='ask';ch4Save();if(document.querySelector('#ch4-room'))ch4Room()}),1200)}
 else if(CH4.step===10){CH4.step=11;ch4Save();setTimeout(()=>{ch4Line('recalled','消息已删除');CH4.pending='recall';ch4Save();if(document.querySelector('#ch4-room'))ch4Room()},6500)}
 else if(CH4.step===12){CH4.step=13;ch4Save();setTimeout(()=>ch4Batch([['them','[蒸面包照片]'],['them','你之前叫我买的这个'],['them','刚刚看到了']],()=>{CH4.pending='bread';ch4Save();if(document.querySelector('#ch4-room'))ch4Room()}),3000)}
 else if(CH4.step===14){CH4.step=15;ch4Save();setTimeout(ch4Incoming,7500)}
}
const CH4_OPTIONS={
 intro:['两点左右吧','应该下午去 你呢','还没定 估计下午'],
 coffee:['你是不是又空腹喝咖啡了ㅋㅋ','早饭吃了吗','给元进带咖啡的时候自己也买了吧ㅋㅋ'],
 arrived:['刚到','嗯 你还在练习室？','到了 你呢'],
 wait:['啊 我还以为你会等我','我以为我们一起回去呢ㅋㅋ','怎么不叫我 我还在公司'],
 ask:['我怎么了ㅋㅋ','什么叫又来了','我说什么了啊'],
 recall:['刚发什么了','干嘛撤回ㅋㅋ','我看见你撤回了'],
 bread:['对对对 就是这个ㅋㅋ','你还真买到了ㅋㅋ','哈哈哈谢谢你']
};
function ch4Choice(i){
 const key=CH4.pending;if(!key||!CH4_OPTIONS[key]||!CH4_OPTIONS[key][i])return;
 CH4.pending=null;ch4Line('me',CH4_OPTIONS[key][i]);ch4Save();
 if(key==='intro'){ch4Batch([['them','哦哦'],['them','我应该也在']],()=>{CH4.step=2;ch4Save();ch4Next()})}
 if(key==='coffee'){ch4Batch(i===1?[['them','吃了'],['them','你呢']]:i===2?[['them','ㅋㅋㅋㅋ'],['them','被发现了']]:[['them','吃了ㅋㅋ'],['them','你怎么知道我喝咖啡']],()=>{CH4.step=4;CH4.note='今天也要去公司。日历里好像有行程，闲着可以看看。';ch4Save();ch4Next()})}
 if(key==='arrived'){ch4Batch([['them','我在练习室'],['them','等下还要练一会']],()=>{CH4.step=6;ch4Save();ch4Next()})}
 if(key==='wait'){ch4Batch([['them',i===0?'你又没说在等我':i===1?'你也没说要一起啊':'我不知道你在等我']],()=>{CH4.step=8;ch4Save();ch4Next()})}
 if(key==='ask'){ch4Batch([['them',i===1?'没什么啦':'没什么'],['them','我先忙了']],()=>{CH4.step=10;ch4Save();ch4Next()})}
 if(key==='recall'){ch4Batch([['them','发错了']],()=>{CH4.step=12;ch4Save();ch4Next()})}
 if(key==='bread'){ch4Batch([['them','嗯'],['them','明天拿给你']],()=>{CH4.step=14;ch4Save();ch4Next()})}
}
function ch4GroupPush(){
 CH4.group=[['咸元进','谁在公司啊'],['咸元进','帮我带杯咖啡'],['具廷谟','自己点外卖ㅋㅋ'],['咸元进','太冷漠了'],['宋亨俊','我在路上'],['宋亨俊','要什么'],['咸元进','冰美式！！'],['宋亨俊','ㅇㅋ']];
 ch4Save();gameShowBanner('kkt','CRAVITY 群聊有新消息');if(document.querySelector('#ch4-group'))ch4Group();
}
function ch4Group(){activeApp='kkt';const rows=CH4.group.map(([n,t])=>'<div class="ch3-group-entry"><span class="ch3-group-name">'+escapeHtml(n)+'</span>'+gameBubble(n==='姜敏熙',t,'刚刚')+'</div>').join('');wrap('CRAVITY 🐾','<div id="ch4-group" class="ch4-shell"><div class="chatbody" id="chatbody">'+rows+'</div><div class="story-send"><div class="story-end">当前对话已结束</div></div></div>');if(CH4.step===3){CH4.step=4;CH4.note='亨俊又要喝咖啡了。他是不是又没吃早饭？去私聊问问吧。';ch4Save();gameNotify('notes','备忘录有新的内容')}const el=$('chatbody');if(el)el.scrollTop=el.scrollHeight}
function ch4Room(){activeApp='kkt';const rows=CH4.lines.map(m=>m.from==='recalled'?'<div class="story-date">消息已删除。</div>':m.text==='[蒸面包照片]'?'<div class="bubbleline"><div class="bubble"><div class="ch4-bread" onclick="ch4BreadPhoto()">🥟<small>蒸面包 · 查看照片</small></div></div></div>':gameBubble(m.from==='me',m.text,m.time)).join('');
 let options='';
 if(CH4.pending&&CH4_OPTIONS[CH4.pending])options='<div class="story-options">'+CH4_OPTIONS[CH4.pending].map((t,i)=>'<button class="story-option" onclick="ch4Choice('+i+')">'+escapeHtml(t)+'</button>').join('')+'</div>';
 else options='<div class="story-end">'+(CH4.done?'当前对话已结束':'暂无新消息')+'</div>';
 if(CH4.step===4&&!CH4.pending)options='<div class="story-options">'+CH4_OPTIONS.coffee.map((t,i)=>'<button class="story-option" onclick="ch4Choice('+i+')">'+escapeHtml(t)+'</button>').join('')+'</div>',CH4.pending='coffee',ch4Save();
 wrap('宋亨俊','<div id="ch4-room" class="ch4-shell"><div class="chatbody" id="chatbody">'+rows+'</div><div class="story-send">'+options+'</div></div>');const el=$('chatbody');if(el)el.scrollTop=el.scrollHeight;
}
function ch4BreadPhoto(){activeApp='photos';wrap('照片','<div class="content" style="text-align:center;padding-top:50px"><div class="ch4-bread-large">🥟</div><p>蒸面包</p><p class="muted">图片素材待绑定</p><button class="choice" onclick="ch4Room()">返回聊天</button></div>')}
function ch4Friends(){activeApp='kkt';wrap('KakaoTalk','<div class="content"><div class="item" onclick="ch4Room()"><div class="avatar">宋</div><div class="itemmain"><div class="itemtitle">宋亨俊</div><div class="itemsub">'+escapeHtml(CH4.lines.at(-1)?.text||'')+'</div></div></div><div class="item" onclick="ch4Group()"><div class="avatar">C</div><div class="itemmain"><div class="itemtitle">CRAVITY 🐾</div><div class="itemsub">'+escapeHtml(CH4.group.at(-1)?.[1]||'历史消息')+'</div></div></div></div>')}
function ch4Notes(){activeApp='notes';gameClear('notes');wrap('备忘录','<div class="content story-notes"><div class="note" onclick="ch4ReadNote()"><strong>第四章 · 还在生气吗？</strong></div><div class="note" onclick="ch4ReadNote()"><strong>今天要做的事</strong></div><div class="note" onclick="gameChapterMenu()"><strong>跳转至其他章节</strong></div></div>')}
function ch4ReadNote(){activeApp='notes';wrap('今天要做的事','<div class="content story-prose"><p>'+escapeHtml(CH4.note)+'</p><button class="choice" onclick="ch4Notes()">返回备忘录</button></div>')}
function ch4Calendar(){activeApp='calendar';wrap('日历','<div class="content ch4-explore"><h2>十月</h2><div class="ch4-cal-grid">'+Array.from({length:31},(_,i)=>'<span class="'+([8,12,17,21,25].includes(i+1)?'marked':'')+'">'+(i+1)+'</span>').join('')+'</div><h3>待办与日程</h3><div class="note">□ 下午 · 公司练习</div><div class="note">□ 买新的耳机套</div><div class="note">✓ 记得把蒸面包带给亨俊看</div><div class="note">♡ 11月30日 · 生日</div></div>')}
function ch4Delivery(){activeApp='delivery';wrap('外卖民族','<div class="content ch4-explore"><div class="ch4-baemin">배달의민족 <small>外卖民族</small></div><p>送至 · 首尔</p><div class="ch4-delivery-tabs"><span>美食</span><span>咖啡</span><span>便利店</span><span>订单</span></div><h3>最近订单</h3><div class="note"><strong>咖啡 · 两杯</strong><p>冰美式 ×1<br>冰香草拿铁 ×1（少冰）</p><small>已送达 · ₩10,500</small></div><div class="note"><strong>炸鸡和可乐</strong><p>炸鸡 ×1 · 可乐 ×2</p><small>已送达 · ₩24,000</small></div><div class="note"><strong>汤饭 · 两份</strong><p>牛肉汤饭 ×2</p><small>已送达 · ₩22,000</small></div></div>')}
function ch4Incoming(){if(!CH4.active||CH4.done||CH4.callState)return;CH4.callState='ringing';ch4Save();game.callType='ch4';callSession++;clearInterval(callTimer);$('call').classList.add('show');$('callerName').textContent='宋亨俊';if(typeof gameSetCallerAvatar==='function')gameSetCallerAvatar('宋亨俊');$('calltimer').textContent='电话 · 来电中…';$('callsub').textContent='来电';$('callmsg').textContent='';$('answer').style.display='block';$('pip').style.display='none';startRing()}
const CH4_CALL=[['宋亨俊','喂'],['宋亨俊','怎么还没睡'],['姜敏熙','你怎么知道我没睡ㅋㅋ'],['宋亨俊','刚刚不是还在回消息吗'],['姜敏熙','啊ㅋㅋ'],['宋亨俊','今天头还疼吗'],['姜敏熙','好多了'],['宋亨俊','真的？'],['姜敏熙','嗯 真的'],['宋亨俊','那就好'],['宋亨俊','早点睡吧'],['姜敏熙','你也是'],['宋亨俊','嗯']];
function ch4Answer(){stopRing();CH4.callState='connected';ch4Save();$('answer').style.display='none';$('pip').style.display='none';$('callsub').textContent='正在通话';const session=++callSession;callStart=Date.now();clearInterval(callTimer);callTimer=setInterval(()=>{let s=Math.floor((Date.now()-callStart)/1000);$('calltimer').textContent='通话中 · '+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},500);CH4_CALL.forEach(([who,t],i)=>setTimeout(()=>{if(callSession!==session)return;$('callmsg').textContent=who+'：'+t;if(i===CH4_CALL.length-1){CH4.callState='finished';ch4Save();$('callsub').textContent='可以挂断'}},1000+i*2300))}
function ch4EndCall(){if(CH4.callState==='connected'){gameLocked();return}stopRing();clearInterval(callTimer);callSession++;$('call').classList.remove('show');if(CH4.callState==='ringing'){CH4.callState='';ch4Save();setTimeout(ch4Incoming,3500)}else{CH4.callState='ended';CH4.callLog=true;CH4.done=true;CH4.step=16;CH4.note='第四章已结束。聊天记录和通话记录都可以随时查看。';ch4Save();gameShowBanner('notes','第四章已结束')}oldHome()}
function ch4Calls(){activeApp='phone';wrap('最近通话','<div class="content"><div class="item" onclick="ch4Incoming()"><div class="itemmain"><strong>宋亨俊</strong><div class="itemsub">今天 · 语音通话</div></div></div></div>')}
const ch4OldUnlock=gameUnlock;gameUnlock=function(k){if(CH4.active&&game.stage==='chapter4'&&['calendar','delivery','phone','kkt','notes'].includes(k))return true;return ch4OldUnlock(k)};
const ch4OldOpen=openApp;openApp=function(k){if(CH4.active&&game.stage==='chapter4'){if(k==='calendar')return ch4Calendar();if(k==='delivery')return ch4Delivery();if(k==='notes')return ch4Notes();if(k==='phone')return ch4Calls();if(k==='kkt')return ch4Friends()}return ch4OldOpen(k)};
const ch4OldChat=gameChat;gameChat=function(id){if(CH4.active&&game.stage==='chapter4'&&id==='hyeongjun')return ch4Room();return ch4OldChat(id)};
const ch4OldNotes=gameNotes;gameNotes=function(){if(CH4.active&&game.stage==='chapter4')return ch4Notes();return ch4OldNotes()};
const ch4OldMenu=gameChapterMenu;gameChapterMenu=function(){if(CH4.active&&game.stage==='chapter4'){activeApp='notes';wrap('章节','<div class="content story-notes"><div class="note" onclick="ch4Notes()">第四章 · 还在生气吗？</div><div class="note" onclick="gameJumpChapter(1)">第一章</div><div class="note" onclick="gameJumpChapter(2)">第二章</div><div class="note" onclick="ch3Start()">第三章</div></div>');return}ch4OldMenu();if(CH3.done&&document.querySelector('.story-chapter-hint'))document.querySelector('.story-chapter-hint').insertAdjacentHTML('afterend','<button class="note story-chapter-button" onclick="ch4Start()">进入第四章</button>')};
const ch4OldEnding=ch3Ending;ch3Ending=function(){ch4OldEnding();if(CH3.done){const el=document.querySelector('.story-ending');if(el)el.insertAdjacentHTML('beforeend','<button class="choice" onclick="ch4Start()">进入第四章</button>')}};
const ch4OldAnswer=answerCall;answerCall=function(){if(game.callType==='ch4')return ch4Answer();return ch4OldAnswer()};
const ch4OldEnd=endCall;endCall=function(){if(game.callType==='ch4'){game.callType=null;return ch4EndCall()}return ch4OldEnd()};
