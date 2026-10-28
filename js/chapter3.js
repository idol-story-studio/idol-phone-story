/* Chapter 3 — 所有人都知道. Additive integration; existing chapters stay intact. */
const CH3_KEY='idol_ch3_progress_v1';
const CH3_FILE=typeof CH2_FILE!=='undefined'?CH2_FILE:[];
const CH3_GROUP=[['咸元进','有人知道明天几点集合吗'],['朴世琳','不是发在工作群了吗'],['徐宇瑸','你往上翻一下'],['朴世琳','明天九点半'],['咸元进','对了亨俊'],['咸元进','你耳朵好点了吗'],['宋亨俊','早就好了'],['咸元进','上次不是红了好久'],['宋亨俊','哥你怎么还记得这个ㅋㅋ'],['咸元进','因为你当时叫得很大声啊'],['徐宇瑸','你别又提了'],['宋亨俊','真没事了'],['朴世琳','下次耳饰不舒服就直接跟造型师说']];
const CH3_LINES={
serim:[['them','敏熙，你是不是在找那天的造型表'],['me','嗯哥，我想知道那天发生什么了'],['them','那天上台前有点乱，造型师忙不过来'],['them','让你帮亨俊戴了一下耳夹'],['me','我？'],['them','嗯，我当时在另一边整理衣服'],['them','元进就在旁边，你可以问他'],['them','别太勉强自己，身体先养好']],
wonjin:[['me','哥，那天耳夹的事你还记得吗？'],['them','当然记得'],['them','化妆师让你帮亨俊戴耳夹'],['them','你当时还戴着耳机'],['them','你手劲太大了，亨俊一下就叫出来了'],['me','我真的没听见？'],['them','你连头都没抬，他看了你好几眼'],['them','你还在弄耳机'],['me','……'],['them','你最近不是一直健身吗，可能没控制好力气'],['them','但敏熙啊，他不是只因为疼才生气'],['them','他疼成那样你一点反应都没有'],['them','后来他跟你说，你还觉得他在怪你'],['me','我说什么了？'],['them','具体我不知道，但他后来真的很难过'],['them','我知道你不是故意的'],['them','可你也不能因为不是故意的，就觉得他不应该生气']],
woobin:[['them','敏熙啊，元进说你在问那天的事'],['me','嗯哥，我好像知道发生什么了'],['me','我当时真的不是故意的'],['them','我知道'],['me','可是亨俊好像觉得我根本不在乎他'],['them','他不是觉得你故意弄疼他'],['them','他是觉得你根本没发现他疼'],['me','可是我怎么可能故意伤害他啊'],['me','他应该知道的'],['them','敏熙'],['them','你这句话跟那天说得差不多'],['them','你当时一直说“你应该知道我不是故意的”'],['them','但亨俊那时候只是想让你知道他很疼'],['me','……'],['them','我觉得你可以先跟他好好道个歉'],['them','别急着解释自己不是故意的'],['them','先告诉他你知道自己弄疼他了']]
};
const CH3_REPLY=[['them','……'],['them','你想起来了？'],['me','没有完全想起来，是问了其他人才知道的'],['them','我还以为你想起来了'],['them','你不用一直说对不起'],['them','我那天真的很疼'],['them','我都叫出来了'],['them','你连看都没看我一眼'],['me','我当时戴着耳机，真的没听见'],['them','我知道，元进哥后来跟我说了'],['them','可是敏熙啊'],['them','你那天说的话我也都记得'],['me','可是我现在真的什么都想不起来了……'],['them','我知道你现在不记得了'],['them','但不能因为你忘了'],['them','就当那些话没有伤害过我']];
function ch3Default(){return {active:false,done:false,group:false,search:false,file:false,annotation:false,serim:false,wonjin:false,woobin:false,notes:[],stage:'idle',groupCount:0,reply:0,choice:-1,unblock:-1,seen:false,seenAt:0,replyAt:0,igStart:0,ending:false};}
let CH3;try{CH3=Object.assign(ch3Default(),JSON.parse(localStorage.getItem(CH3_KEY)||'{}'))}catch(e){CH3=ch3Default()}
function ch3Save(){localStorage.setItem(CH3_KEY,JSON.stringify(CH3))}
function ch3Notice(title,text){if(CH3.notes.some(n=>n.title===title))return;CH3.notes.push({title,text});ch3Save();if(activeApp!=='notes')gameNotify('notes','有新的线索');}
function ch3KktNotice(name){if(activeApp==='kkt'&&current==='appview'&&document.querySelector('#ch2-chat[data-id="'+(name==='朴世琳'?'serim':name==='咸元进'?'wonjin':'woobin')+'"]'))return;phoneReceiveMessage(name==='朴世琳'?'serim':name==='咸元进'?'wonjin':name.includes('CRAVITY')?'group':'woobin','新消息')}
function ch3Start(){if(CH3.active&&!CH3.done&&game.stage==='chapter3'){ch3Friends();return}CH3=ch3Default();CH3.active=true;CH3.stage='group';CH3.igStart=(igChats.hyeongjun||[]).length;ch3Save();game.stage='chapter3';game.chapter2=true;game.chatBlocked=true;gameNotes();setTimeout(()=>ch3KktNotice('CRAVITY 🐾'),1300)}
function ch3NoteDestination(title){
 if(title==='群聊')return ch3Group();
 if(title==='工作文件')return ch3Files();
 if(title==='道歉')return instagram('chat','hyeongjun');
 return gameNotes();
}
function ch3Note(i){
 if(i===-1){activeApp='notes';wrap('第三章','<div class="content story-prose"><h2>所有人都知道</h2><p>有些事似乎藏在过去的聊天和工作记录里。</p><button class="choice" onclick="gameNotes()">返回备忘录</button></div>');return}
 const n=CH3.notes[i];if(!n)return;
 const label=n.title==='群聊'?'前往 KakaoTalk':n.title==='工作文件'?'前往文件':n.title==='道歉'?'前往 Instagram':'返回备忘录';
 activeApp='notes';
 wrap(n.title,'<div class="content story-prose"><p>'+escapeHtml(n.text)+'</p><button class="choice" onclick="ch3NoteDestination(\''+n.title+'\')">'+label+'</button></div>');
}
function ch3Notes(){if(!CH3.active)return '';return '<div class="note" onclick="ch3Note(-1)"><strong>第三章</strong></div>'+CH3.notes.map((n,i)=>'<div class="note" onclick="ch3Note('+i+')"><strong>新线索 · '+escapeHtml(n.title)+'</strong></div>').join('')}
function ch3Next(stage,title,text){CH3.stage=stage;ch3Save();if(title)ch3Notice(title,text)}
const CH3_EAR_HISTORY=[
['朴世琳','演出结束了，大家先确认随身物品有没有落下。'],
['徐宇瑸','我在休息室，有人把耳饰盒拿走了吗？'],
['咸元进','还在化妆台旁边，我刚刚看到了。'],
['宋亨俊','哥，耳夹也在里面吗？'],
['徐宇瑸','在。你耳朵还疼吗？'],
['宋亨俊','有一点，已经好多了。'],
['咸元进','刚才那个耳夹是不是夹得太紧了？'],
['宋亨俊','嗯，戴的时候有点疼。'],
['咸元进','我就说你当时叫得那么大声。'],
['宋亨俊','哥……别在群里说了ㅋㅋ'],
['朴世琳','我会再跟造型师确认尺寸，下次提前调整。'],
['徐宇瑸','那先休息，明天还要早起。']
];
const CH3_HISTORY=[
['咸元进','明天几点去练习室？'],
['徐宇瑸','十点，群公告里写了。'],
['咸元进','我还以为是九点半。'],
['朴世琳','九点半是工作人员集合，我们十点到就行。'],
['宋亨俊','收到～'],
['宋亨俊','对了，有人看见我的充电线吗？'],
['具廷谟','在我包里，你昨天落在练习室了。'],
['宋亨俊','难怪找不到ㅋㅋ 明天记得带来。'],
['具廷谟','知道啦。'],
['徐宇瑸','谁要喝咖啡？我明天顺路买。'],
['咸元进','我要冰美式！'],
['宋亨俊','我也要，谢谢哥。'],
['朴世琳','别喝太晚，明天还要录制。'],
['咸元进','那我明天早上喝。'],
['徐宇瑸','行，明天见。']
];
function ch3ChatShell(name,id,rows,fromStart=false,finished=true){
 activeApp='kkt';
 wrap(name,'<div id="ch2-chat" data-id="'+id+'" class="ch3-kkt"><div class="ch3-tools"><button class="ch3-search-icon" onclick="ch3SearchOpen(\''+id+'\')" aria-label="搜索聊天记录"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></button></div><div class="chatbody" id="chatbody">'+rows+'</div><div class="story-send">'+(finished?'<div class="story-end">当前对话已结束</div>':'')+'</div></div>');
 const el=$('chatbody');if(el){el.style.overflowY='auto';el.style.minHeight='0';el.scrollTop=fromStart?0:el.scrollHeight}
}
function ch3SearchOpen(id){const root=document.querySelector('.ch3-tools');if(!root)return;root.innerHTML='<div class="ch3-search-inline"><button class="ch3-search-back" onclick="ch3SearchClose(\''+id+'\')">‹</button><input id="ch3-q" placeholder="搜索聊天记录" onkeydown="if(event.key===\'Enter\')ch3Search(\''+id+'\')"><button onclick="ch3Search(\''+id+'\')">搜索</button></div>';$('ch3-q')?.focus()}
function ch3SearchClose(id){if(id==='group')ch3Group();else ch3Chat(id)}
function ch3Group(){if(!CH3.active||game.stage!=='chapter3')return gameFriends();const first=!CH3.group;CH3.group=true;ch3Save();const history=CH3_HISTORY,fresh=CH3_GROUP;const count=CH3.groupCount||0;const rows=[...history,...fresh.slice(0,count)].map(([n,t],i)=>'<div class="ch3-group-entry"><span class="ch3-group-name">'+escapeHtml(n)+'</span>'+gameBubble(n==='姜敏熙',t,i<15?'昨天':phoneTimeAt(13*60+5,i-15),false,false,true)+'</div>').join('');ch3ChatShell('CRAVITY 🐾','group',rows,false,CH3.stage!=='group');if(first&&CH3.stage==='group')ch3PlayGroup()}
function ch3PlayGroup(){const fresh=CH3_GROUP;function next(){if(CH3.stage!=='group'||CH3.groupCount>=fresh.length){if(CH3.stage==='group'&&CH3.groupCount>=fresh.length)ch3Next('search','群聊','刚刚提到了耳朵的问题，试试看去群聊的聊天记录里搜索下相关内容吧。');return}if(fresh[CH3.groupCount]?.[0]==='姜敏熙'&&!phonePlayerCanAutoReply('group')){phoneWaitForPlayerRoom('group',next);return}CH3.groupCount++;ch3Save();if(document.querySelector('#ch2-chat[data-id="group"]'))ch3Group();setTimeout(next,850+Math.min(5400,(fresh[CH3.groupCount]?.[1]?.length||0)*115))}setTimeout(next,850)}
function ch3Search(id='group'){const q=($('ch3-q')?.value||'').trim();if(!q)return;if(id==='group'&&/(耳朵|耳夹)/.test(q)){CH3.search=true;CH3.searchPending=false;ch3Save();if(CH3.stage==='search')setTimeout(()=>{if(CH3.stage==='search'&&CH3.search)ch3Next('file','工作文件','耳夹？我好像在世琳哥发来的文件里见到过，去文件夹里看看吧。')},3800);const before=CH3_HISTORY.slice(0,5),after=CH3_HISTORY.slice(5,10);const all=[...before,...CH3_EAR_HISTORY,...after];const rows=all.map(([n,t],i)=>'<div class="ch3-group-entry"><span class="ch3-group-name">'+escapeHtml(n)+'</span>'+gameBubble(n==='姜敏熙',t,'几天前',false,false,true)+'</div>').join('');ch3ChatShell('CRAVITY 🐾','group',rows,true,true);const el=$('chatbody');if(el){const target=el.children[before.length];if(target)el.scrollTop=Math.max(0,target.offsetTop-el.offsetTop-90)}return}const data=id==='group'?CH3_HISTORY:(CH3_LINES[id]||[]).map(([who,t])=>[who==='me'?'姜敏熙':id==='serim'?'朴世琳':id==='wonjin'?'咸元进':'徐宇瑸',t]);const hits=data.filter(([n,t])=>n.includes(q)||t.includes(q));const rows=hits.map(([n,t])=>'<div class="ch3-group-entry"><span class="ch3-group-name">'+escapeHtml(n)+'</span>'+gameBubble(n==='姜敏熙',t,'历史消息',false,false,true)+'</div>').join('');ch3ChatShell(id==='group'?'CRAVITY 🐾':id==='wonjin'?'咸元进':id==='serim'?'朴世琳':'徐宇瑸',id,rows||'<p class="story-date">没有找到相关记录</p>',true,true)}
function ch3SearchJump(id,i){if(id==='group')ch3Group();else ch3Chat(id);const sc=$('chatbody');if(sc){const target=sc.children[i];if(target)target.scrollIntoView({block:'center'});}}
function ch3Files(){activeApp='files';wrap('文件','<div class="content"><div class="item" onclick="ch3File()"><div class="avatar">▤</div><div class="itemmain"><div class="itemtitle">舞台造型用品_采买统计.xlsx</div><div class="itemsub">朴世琳分享的工作资料</div></div></div></div>')}
function ch3File(){CH3.file=true;ch3Save();activeApp='files';wrap('舞台造型用品_采买统计.xlsx','<div class="content ch2-file"><div class="ch2-sheet-scroll"><table><thead><tr><th>物品</th><th>对象</th><th>备注</th></tr></thead><tbody>'+CH3_FILE.map((r,i)=>'<tr onclick="ch3FileRow('+i+')" class="'+(i===2?'ch2-earring':'')+'">'+r.map(v=>'<td>'+escapeHtml(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+(CH3.annotation?'<p class="ch3-annotation">造型组备注：上台前曾反馈耳夹太紧，佩戴时请注意力度，如有不适请及时重新调整。</p>':'')+'<button class="choice" onclick="ch3Files()">返回文件</button></div>')}
function ch3FileRow(i){if(i!==2)return;const first=!CH3.annotation;CH3.annotation=true;ch3Save();ch3File();if(first&&CH3.stage==='file'){CH3.stage='serim';ch3Save();setTimeout(()=>ch3KktNotice('朴世琳'),2200)}}
function ch3Friends(){
 activeApp='kkt';
 const entries=[['group','CRAVITY 🐾'],['hyeongjun','宋亨俊'],['wonjin','咸元进']];
 if(CH2.messages.woobin.length||CH3.woobin||CH3.stage==='woobin'||CH3.woobinCount>0)entries.push(['woobin','徐宇瑸']);
 if(CH2.messages.serim.length||CH3.serim||CH3.stage==='serim'||CH3.serimCount>0)entries.push(['serim','朴世琳']);
 const count=(id)=>id==='group'?(CH3.group?0:CH3.stage==='group'?1:0):id==='woobin'?(CH3.woobin?0:CH3.stage==='woobin'?1:0):id==='serim'?(CH3.serim?0:CH3.stage==='serim'?1:0):0;
 const preview=(id)=>{if(id==='group')return CH3.groupCount?CH3_GROUP[Math.min(CH3.groupCount,CH3_GROUP.length)-1][1]:CH3_HISTORY.at(-1)[1];if(id==='hyeongjun')return CH3.done?'已恢复联系':'消息未能送达';if(CH3[id+'Count']>0)return CH3_LINES[id]?.[Math.min(CH3[id+'Count'],CH3_LINES[id].length)-1]?.[1]||'历史聊天';if(id==='woobin'&&CH3.stage==='woobin')return CH3_LINES.woobin[0][1];if(id==='serim'&&CH3.stage==='serim')return CH3_LINES.serim[0][1];return CH2.messages[id]?.at(-1)?.[1]||'历史聊天'};
 wrap('KakaoTalk','<div class="content">'+entries.map(([id,name])=>'<div class="item" onclick="'+(id==='group'?'ch3Group()':id==='hyeongjun'?'gameChat(\'hyeongjun\')':id==='wonjin'&&!CH3.wonjin&&CH3.stage!=='wonjin'?'gameChat(\'wonjin\')':(id==='woobin'||id==='serim')&&!CH3[id]&&CH3.stage!==id?'ch2Chat(\''+id+'\')':'ch3Chat(\''+id+'\')')+'"><div class="avatar">'+name[0]+'</div><div class="itemmain"><div class="itemtitle">'+name+'</div><div class="itemsub">'+escapeHtml(preview(id))+'</div></div>'+(count(id)?'<span class="story-contact-unread">'+count(id)+'</span>':'')+'</div>').join('')+'</div>');
}
const CH3_WONJIN_QUESTIONS=['哥，那天耳夹的事你还记得吗？','哥，我是不是把亨俊弄疼了？','元进哥，你能不能告诉我那天发生了什么？'];
function ch3Chat(id){
 if(!CH3.active||game.stage!=='chapter3')return gameFriends();
 if(id==='hyeongjun')return gameChat(id);
 if(id==='wonjin'&&CH3.stage==='wonjin'&&!CH3.wonjin){
  ch3ChatShell('咸元进','wonjin','<div class="story-date">以前的聊天记录</div>',false,false);
  const panel=document.querySelector('#ch2-chat .story-send');
  if(panel)panel.innerHTML=ch2Choices(CH3_WONJIN_QUESTIONS,'ch3AskWonjin');
  return;
 }
 if((id==='serim'&&CH3.stage!=='serim'&&!CH3.serim)||(id==='wonjin'&&CH3.stage!=='wonjin'&&!CH3.wonjin)||(id==='woobin'&&CH3.stage!=='woobin'&&!CH3.woobin)){
  return ch3ChatShell(id==='serim'?'朴世琳':id==='wonjin'?'咸元进':'徐宇瑸',id,'<div class="story-date">还没有新消息</div>',true,false);
 }
 const first=!CH3[id];if(first){CH3[id]=true;CH3[id+'Count']=0;ch3Save()}
 ch3RenderConversation(id,first);if(first)ch3PlayConversation(id);
}
function ch3AskWonjin(i){
 if(CH3.stage!=='wonjin'||CH3.wonjin||!Number.isInteger(i)||i<0||i>=CH3_WONJIN_QUESTIONS.length)return;
 CH3_LINES.wonjin[0]=['me',CH3_WONJIN_QUESTIONS[i]];CH3_LINES.wonjin[1]=['them',['当然记得，你想问哪一段？','嗯，弄疼了。亨俊当时叫出来了，你可能没听见。','我知道一些。那天我就在旁边，你慢慢听我说。'][i]];
 CH3.wonjinChoice=i;CH3.wonjin=true;CH3.wonjinCount=1;ch3Save();
 ch3RenderConversation('wonjin',false);
 ch3PlayConversation('wonjin');
}
function ch3RenderConversation(id,fromStart=false){const name=id==='serim'?'朴世琳':id==='wonjin'?'咸元进':'徐宇瑸';const lines=CH3_LINES[id]||[];const count=CH3[id+'Count']??lines.length;const rows=lines.slice(0,count).map(([who,t],i)=>gameBubble(who==='me',t,phoneTimeAt(15*60+12,i),false,false,i===0||lines[i-1][0]!==who)).join('');ch3ChatShell(name,id,rows,fromStart,!!CH3[id+'Finished'])}
function ch3PlayConversation(id){const lines=CH3_LINES[id];function next(){if(!CH3.active||!CH3[id])return;const index=CH3[id+'Count']||0;if(index>=lines.length){if(CH3[id+'Finished'])return;CH3[id+'Finished']=true;ch3Save();if(document.querySelector('#ch2-chat[data-id="'+id+'"]'))ch3RenderConversation(id,false);if(id==='serim')ch3Next('wonjin');if(id==='wonjin'){ch3Next('woobin');setTimeout(()=>ch3KktNotice('徐宇瑸'),9500)}if(id==='woobin')ch3Next('apology','道歉','或许应该去 Instagram，认真向亨俊道个歉。');return}if(lines[index]?.[0]==='me'&&!phonePlayerCanAutoReply(id)){phoneWaitForPlayerRoom(id,next);return}CH3[id+'Count']=index+1;ch3Save();if(document.querySelector('#ch2-chat[data-id="'+id+'"]'))ch3RenderConversation(id,false);setTimeout(next,phoneMessageDelay(lines[index+1]?.[1]))}setTimeout(next,650)}
function ch3OnSend(id,text){if(!CH3.active||id!=='hyeongjun'||CH3.done)return;const msgs=(igChats.hyeongjun||[]).slice(CH3.igStart).filter(m=>m.from==='me'&&!m.ch3Auto);const all=msgs.map(m=>m.text).join(' ');const apology=/(对不起|抱歉|不好意思|我错了|是我的错|道歉)/.test(all);const cause=/(耳夹|耳饰|耳朵|弄疼|弄痛|拉疼|扯疼)/.test(all);const negative=/(不想道歉|不会道歉|凭什么道歉|不是我的错|不需要道歉)/.test(all);CH3.seenAt=Date.now()+7000;CH3.seen=false;if(CH3.stage==='apology'&&CH3.woobinFinished&&apology&&cause&&!negative&&!CH3.replyAt)CH3.replyAt=Date.now()+13000;ch3Save();setTimeout(ch3Tick,7200);if(CH3.replyAt)setTimeout(ch3Tick,13200)}
function ch3IGRefresh(){if(activeApp==='ig'&&igScreen==='chat'&&igTarget==='hyeongjun')igChat('hyeongjun')}
function ch3QueueIG(lines,after){
 CH3.igQueue=(CH3.igQueue||[]).concat(lines.map(([from,text])=>({from,text})));
 if(after)CH3.igQueueAfter=after;
 ch3Save();ch3IGPump();
}
let ch3IGBusy=false;
function ch3IGPump(){
 if(ch3IGBusy||!CH3.active||!CH3.igQueue?.length)return;
 ch3IGBusy=true;
 const item=CH3.igQueue[0];
 const deliver=()=>{if(!CH3.active){ch3IGBusy=false;return}if(item.from==='me'&&!phonePlayerCanAutoReply('hyeongjun','ig')){ch3IGBusy=false;setTimeout(ch3IGPump,500);return}CH3.igQueue.shift();ch3Save();
  (igChats.hyeongjun??=[]).push({from:item.from,text:item.text,time:'刚刚',ch3Auto:true});
  igSave();if(item.from==='them')phoneReceiveDM('ig','hyeongjun',item.text);ch3IGRefresh();ch3IGBusy=false;
  if(CH3.igQueue.length)ch3IGPump();
  else{
   const after=CH3.igQueueAfter;CH3.igQueueAfter=null;
   if(after==='first'){CH3.reply=1;ch3Save();ch3IGRefresh()}
   if(after==='emotion'){CH3.reply=2;ch3Save();ch3IGRefresh()}
   if(after==='unblock'){CH3.reply=3;CH3.done=true;game.chatBlocked=false;ch3Save();ch3Next('complete','第三章结束','亨俊答应恢复联系，但他还在生气。可以前往下一章。');ch3IGRefresh()}
  }
 };if(item.from==='me'&&!phonePlayerCanAutoReply('hyeongjun','ig')){ch3IGBusy=false;setTimeout(ch3IGPump,500);return}setTimeout(deliver,phoneMessageDelay(item.text));
}
function ch3Tick(){
 if(!CH3.active)return;
 const now=Date.now();let changed=false;
 if(CH3.seenAt&&now>=CH3.seenAt&&!CH3.seen){CH3.seen=true;changed=true}
 if(CH3.replyAt&&now>=CH3.replyAt&&!CH3.reply&&!CH3.igQueue?.length){
  CH3.reply=-1;changed=true;ch3QueueIG(CH3_REPLY,'first');
 }
 if(changed){ch3Save();ch3IGRefresh()}
 if(CH3.igQueue?.length)ch3IGPump();
}
function ch3Choices(){
 if(CH3.reply===1)return ch2Choices(['我知道，我不是想用失忆当借口。','对不起，我知道你现在还是很难过。','我不记得那些话了，但我知道我伤害了你。'],'ch3Emotion');
 if(CH3.reply===2)return ch2Choices(['亨俊啊，你能不能先把我从黑名单里放出来？','我知道你还在生气，但能不能先让我联系到你？','可以先解除 KakaoTalk 和电话的拉黑吗？我不会一直烦你的。'],'ch3Unblock');
 if(CH3.reply===3&&CH3.done)return '<div class="story-end">当前对话已结束</div>';
 return '';
}
function ch3AddIG(lines,after){ch3QueueIG(lines,after)}
function ch3Emotion(i){
 if(CH3.reply!==1)return;
 CH3.choice=i;CH3.reply=-2;ch3Save();
 const t=['我知道，我不是想用失忆当借口。','对不起，我知道你现在还是很难过。','我不记得那些话了，但我知道我伤害了你。'][i];
 const answer=['我知道你不是那个意思','我不是想让你一直道歉，只是有些事还没办法当作没发生','至少你现在知道了'][i];
 ch3AddIG([['me',t],['them',answer],['me','我会慢慢想起来的'],['them','你现在身体怎么样'],['me','好多了，偶尔还有点头疼'],['them','医生怎么说'],['me','还要观察'],['them','那就好好休息，别总盯着手机'],['me','可是我现在好多事情都不知道'],['them','不知道就慢慢来，又没人催你']],'emotion');
 ch3IGRefresh();
}
function ch3Unblock(i){
 if(CH3.reply!==2)return;
 CH3.unblock=i;CH3.reply=-3;ch3Save();
 const text=['亨俊啊，你能不能先把我从黑名单里放出来？','我知道你还在生气，但能不能先让我联系到你？','可以先解除 KakaoTalk 和电话的拉黑吗？我不会一直烦你的。'][i];
 const answer=['你现在才想起来问这个啊','你现在不是也能联系到我吗','谁说你会烦我了'][i];
 ch3AddIG([['me',text],['them',answer],['me','我只是希望有事的时候能找到你'],['them','……'],['them','知道了'],['me','真的？'],['them','嗯'],['them','但我还在生气'],['me','我知道'],['them','你最好是真的知道']],'unblock');
 ch3IGRefresh();
}
function ch3Ending(){activeApp='notes';wrap('第三章已结束','<div class="content story-prose story-ending"><h2>第三章 · 所有人都知道</h2><p>宋亨俊同意解除拉黑，但还没有原谅你。</p><p>第四章的后续剧情将继续展开。</p><button class="choice" onclick="gameNotes()">返回备忘录</button></div>')}
// Notes list is rendered centrally after all chapter scripts load.
const ch3OldFriends=gameFriends;gameFriends=function(){if(CH3.active&&game.stage==='chapter3')return ch3Friends();return ch3OldFriends()};
const ch3OldIGChat=igChat;igChat=function(id){if(CH3.active&&game.stage==='chapter3')ch3Tick();ch3OldIGChat(id);if(CH3.active&&game.stage==='chapter3'&&id==='hyeongjun'){const form=document.querySelector('.ig-compose');if(CH3.reply!==0&&form){form.outerHTML='<div class="ch3-ig-send">'+ch3Choices()+'</div>'};const sc=$('ig-scroll');if(sc)sc.scrollTop=sc.scrollHeight;const own=[...document.querySelectorAll('.ig-chat .ig-bubble.mine')];if(own.length){const last=own.at(-1);if(last&&CH3.reply===0&&!CH3.igQueue?.length&&!document.querySelector('.ch3-read'))last.insertAdjacentHTML('afterend','<div class="ch3-read">'+(CH3.seen?'已查看':'已发送')+'</div>')}}};
const ch3OldSend=igSend;igSend=function(e,id){const text=$('ig-message')?.value?.trim();ch3OldSend(e,id);if(CH3.active&&game.stage==='chapter3'&&text)ch3OnSend(id,text);else if(ch2Active()&&id==='hyeongjun'&&text&&['dm','ig','photos'].includes(CH2.phase)){ch2IGSend(id,text);igChat(id)}};
const ch3OldFile=ch2File;ch2File=function(){return ch3OldFile()};
const ch3OldOpen=openApp;openApp=function(k){if(k==='files'){if(gameUnlock('files'))return ch3Files();gameLocked();return}return ch3OldOpen(k)};
const ch3OldUnlock=gameUnlock;gameUnlock=function(k){if(k==='youtube'||k==='spotify')return true;if(['msg','calendar','map','settings','camera'].includes(k))return false;if(k==='files')return CH3.active&&['file','serim','wonjin','woobin','apology','complete'].includes(CH3.stage);return ch3OldUnlock(k)};
const ch3OldMenu=gameChapterMenu;gameChapterMenu=function(){activeApp='notes';const chapter=game.stage==='chapter3'?3:(ch2Active()?2:1);const names={1:'一',2:'二',3:'三'};const destinations=[1,2,3].filter(n=>n!==chapter);wrap('跳转至其他章节','<div class="content story-notes"><p class="story-chapter-hint">选择已开放章节，方便检查剧情与页面。</p>'+destinations.map(n=>'<button class="note story-chapter-button" onclick="'+(n===3?'ch3Start()':'gameJumpChapter('+n+')')+'"><strong>前往第'+names[n]+'章</strong></button>').join('')+'</div>')};
const ch3OldJump=gameJumpChapter;gameJumpChapter=function(n){if(n===1||n===2){CH3.active=false;ch3Save()}return ch3OldJump(n)};
const ch3OldEnding=ch2Ending;ch2Ending=function(){ch3OldEnding();const el=document.querySelector('.story-ending');if(el&&!el.querySelector('[onclick="ch3Start()"]'))el.insertAdjacentHTML('beforeend','<button class="choice" onclick="ch3Start()">进入第三章</button>')};
if(CH3.active&&game.stage==='chapter3'){game.chapter2=true;game.chatBlocked=!CH3.done;setTimeout(ch3Tick,1000);setTimeout(ch3IGPump,1500)}

/* Chapter 3 navigation: leaving search results triggers the next memo, not the search itself. */
const ch3PreviousGroup=ch3Group;ch3Group=function(){return ch3PreviousGroup()};
