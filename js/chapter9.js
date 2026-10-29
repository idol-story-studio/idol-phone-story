/* Chapter 9 — 这次我会说清楚. Uses global KakaoTalk, Notes, NAVER Map and ending. */
const CH9_KEY='idol_ch9_v1';
PHONE_NAMES.ch9group='今晚吃饭 🍽';
const CH9={active:false,done:false,phase:'',clock:1115,session:0,friend:[],hj:[],group:[],notes:[],queue:null,choiceA:null,entryChoice:null,arrived:false,reservationViewed:false,taxiState:'none',taxiType:'普通出租车',taxiStep:0,dinnerPart:0,walkChoice:null,talkChoice:null,listeningChoice:null,talkPart:0,homeChoice:null,homeInvite:null,history:[],endNotified:false};
const CH9_OPEN='今天要和A、亨俊一起吃饭。\n\n昨天说得挺干脆，真到今天反而有点紧张。\n\nA发过地址了。先看看预约和怎么过去吧。';
const CH9_END='今天真的见到亨俊了。\n\n一开始还担心会很尴尬，结果A一直在说话，我们三个笑了好多次。\n\n后来只剩我们两个的时候，我终于把那些一直不敢说的话说了出来。\n\n亨俊也说了他的想法。\n\n没有一下子变回从前，也没有谁保证以后不会再吵架。\n\n但他说，下次还可以一起出去。\n\n我想，这已经很好了。';
const CH9_DINNER=[
[['A','你们终于来了 我差点以为我要一个人吃ㅋㅋ'],['宋亨俊','我可没迟到'],['姜敏熙','我也没有！'],['A','好好好 你们两个都很准时'],['A','先点菜吧 我饿了'],['宋亨俊','你不是说你下午吃过了吗'],['A','下午那点东西算什么饭啊ㅋㅋ'],['姜敏熙','你们先选 我看看'],['A','你们又要研究半天菜单是吧']],
[['A','对了 上次你们说的那个拍摄后来怎么样了'],['姜敏熙','还好 就是那天结束得很晚'],['宋亨俊','他收工的时候还找不到自己的包'],['姜敏熙','我最后找到了好吧ㅋㅋ'],['A','你们俩怎么这种事都记得这么清楚'],['宋亨俊','因为找了二十分钟'],['姜敏熙','哪有二十分钟！'],['A','行行行 我信你们两个一半ㅋㅋ']],
[['A','下次换个便宜点的地方吧'],['姜敏熙','明明是你选的ㅋㅋ'],['A','那是因为你们都说随便'],['宋亨俊','确实'],['A','别确实了 你们等我一下 我去结账'],['姜敏熙','我把我的转给你'],['A','不用 今天我请 下次你们请我就行'],['宋亨俊','那下次你别挑这么贵的'],['A','ㅋㅋㅋㅋ你们两个真的是']]
];
const CH9_TALK=[
['宋亨俊','你刚刚说想跟我聊聊'],['宋亨俊','怎么又不说话了ㅋㅋ'],
['姜敏熙','我后来想了很久'],['姜敏熙','济州岛那次也是 海底捞也是'],['姜敏熙','明明是我自己想去 却总觉得你应该会想到我'],
['宋亨俊','嗯'],['宋亨俊','我不是不想带你去'],['宋亨俊','你要是跟我说 我肯定会问你要不要一起'],
['姜敏熙','我知道'],['姜敏熙','以前我总觉得 说出来就好像是在麻烦你'],
['宋亨俊','可你不说 我也不知道啊'],['宋亨俊','我有时候真的不知道你到底想要我怎么做'],
['姜敏熙','对不起'],['姜敏熙','还有那天耳夹的事'],['姜敏熙','我知道我不是故意的 但你疼的时候我没有听见'],
['姜敏熙','后来我还一直解释自己不是故意的'],['姜敏熙','我没有先问你疼不疼'],
['宋亨俊','……那天我真的挺委屈的'],['宋亨俊','不是因为我觉得你故意弄疼我'],['宋亨俊','就是我说疼的时候 你还一直跟我解释'],
['姜敏熙','嗯 我现在明白了'],['姜敏熙','以后我会先听你说完'],
['宋亨俊','我也有不对的地方'],['宋亨俊','那天我说话也太冲了'],['宋亨俊','后来还直接把你拉黑了'],['宋亨俊','其实我也知道那样不好'],
['姜敏熙','那我们以后不这样了 好不好'],['宋亨俊','……嗯'],['宋亨俊','不过你别一下子答应太多'],['宋亨俊','先慢慢来吧'],['姜敏熙','好'],['姜敏熙','这次我会真的说出来']
];
let ch9Timer=null;
function ch9Is(){return CH9.active&&game.stage==='chapter9'}
function ch9Save(){try{localStorage.setItem(CH9_KEY,JSON.stringify(CH9))}catch(e){}}
function ch9Time(){const n=Math.floor(CH9.clock);return String(Math.floor(n/60)%24).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function ch9NoteAdd(id,title,text){if(CH9.notes.some(n=>n.id===id))return;CH9.notes.push({id,title,text});ch9Save();phoneReceiveNote(title,'ch9-note-'+id)}
function ch9Start(){
 if(!CH8.done){gameLocked();return}
 if(CH9.active){game.stage='chapter9';game.chapter2=true;game.chatBlocked=false;ch9Notes();ch9Resume();return}
 Object.assign(CH9,{active:true,done:false,phase:'friend',clock:1115,session:CH9.session+1,friend:[],hj:[],group:[],notes:[],queue:null,choiceA:null,entryChoice:null,arrived:false,reservationViewed:false,taxiState:'none',taxiType:'普通出租车',taxiStep:0,dinnerPart:0,walkChoice:null,talkChoice:null,listeningChoice:null,talkPart:0,homeChoice:null,homeInvite:null,history:[],endNotified:false});
 game.stage='chapter9';game.chapter2=true;game.chatBlocked=false;storyChapterSet(9);ch9Save();ch9NoteAdd('intro','第九章 · 这次我会说清楚',CH9_OPEN);ch9Notes();
 ch9Queue('friend',[['them','我订好位置了'],['them','七点半 三个人'],['them','你们别都踩点来啊ㅋㅋ']],'friendChoice');
}
function ch9Push(room,who,text){const m={who,text,time:ch9Time(),id:'ch9-'+room+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)};CH9[room].push(m);CH9.clock+=0.6;ch9Save();if(activeApp==='kkt'&&current==='appview'&&document.querySelector('[data-id="'+(room==='friend'?'ch8friend':room==='hj'?'hyeongjun':'ch9group')+'"]'))ch9Room(room,true);else if(who==='them'){const id=room==='friend'?'ch8friend':room==='hj'?'hyeongjun':'ch9group';if(typeof phoneReceiveMessage==='function')phoneReceiveMessage(id,text);else if(typeof phoneSetCount==='function')phoneSetCount(id,1)}}
function ch9Queue(room,lines,after){CH9.queue={room,lines,index:0,after};ch9Save();ch9Resume()}
function ch9Resume(){if(!ch9Is()||!CH9.queue||ch9Timer)return;const token=CH9.session;function tick(){ch9Timer=null;if(!ch9Is()||token!==CH9.session||!CH9.queue)return;const q=CH9.queue;if(q.index>=q.lines.length){CH9.queue=null;ch9Save();ch9After(q.after);return}const m=q.lines[q.index++];ch9Push(q.room,m[0],m[1]);ch9Save();ch9Timer=setTimeout(tick,1250)}ch9Timer=setTimeout(tick,700)}
function ch9After(after){
 if(after==='friendChoice')CH9.phase='friendChoice';
 if(after==='reservation'){CH9.phase='reservation';if(!CH9.reservationViewed)ch9NoteAdd('hint','今晚的安排','七点半，Restaurant ON。预约在 NAVER Map 里；过去的路可以看看 Kakao T。')}
 if(after==='entry1')CH9.phase='entry1';
 if(after==='entry2')CH9.phase='entry2';
 if(after==='home1')CH9.phase='home1';
 if(after==='home2')CH9.phase='home2';
 if(after==='home3')CH9.phase='home3';
 if(after==='end'){CH9.phase='complete';CH9.done=true;CH9.endNotified=true;ch9Save();storyEndingNotify(9)}
 ch9Save();
 if(activeApp==='kkt'&&current==='appview'&&document.querySelector('[data-id]')){const id=document.querySelector('[data-id]')?.dataset.id;if(id==='ch8friend')ch9Room('friend',true);if(id==='hyeongjun')ch9Room('hj',true);if(id==='ch9group')ch9Room('group',true)}
}
function ch9ChooseFriend(i){if(CH9.phase!=='friendChoice')return;CH9.choiceA=i;CH9.phase='friendReply';ch9Push('friend','me',['知道啦 我会早点到','我争取不迟到ㅋㅋ','你先点喝的吧'][i]);ch9Queue('friend',[['them',['行 终于靠谱一次','我截图了ㅋㅋ','那我先看菜单'][i]],['them','预约应该能在 NAVER 那边看到'],['them','我先去忙一会儿 到店里见']],'reservation')}
function ch9BubbleHistory(){
 const a=(CH4.lines||[]).map((m,i)=>m.from==='recalled'?'<div class="story-date">消息已删除</div>':gameBubble(m.from==='me',m.text,m.time,false,false,i===0||(CH4.lines[i-1]||{}).from!==m.from)).join('');
 const b=(CH5.messages||[]).map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH5.messages[i-1]||{}).who!==m.who)).join('');
 const c=(CH6.messages||[]).filter(m=>m.room==='hyeongjun'||m.id==='hyeongjun'||!m.room&&!m.id).map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0)).join('');
 const d=(CH7.messages||[]).map((m,i)=>m.type==='song'?'<div class="bubbleline me">'+ch7SongCard(m.songId)+'</div>':gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH7.messages[i-1]||{}).who!==m.who)).join('');
 const e=(CH8.hj||[]).map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH8.hj[i-1]||{}).who!==m.who)).join('');
 return a+'<div class="story-date">第五章</div>'+b+'<div class="story-date">第六章</div>'+c+'<div class="story-date">第七章</div>'+d+'<div class="story-date">第八章</div>'+e;
}
function ch9Opts(labels,fn){return '<div class="story-options">'+labels.map((t,i)=>'<button class="story-option" onclick="'+fn+'('+i+')">'+escapeHtml(t)+'</button>').join('')+'</div>'}
function ch9Room(room='hj',quiet=false){
 activeApp='kkt';const id=room==='friend'?'ch8friend':room==='hj'?'hyeongjun':'ch9group';phoneReadRoom(id);
 const old=document.getElementById('chatbody'),scroll=old?.scrollTop;
 const history=room==='hj'?ch9BubbleHistory():room==='friend'?(CH8.friend||[]).map((m,i)=>m.type==='location'?'<div class="bubbleline me">'+ch8LocationCard()+'</div>':gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH8.friend[i-1]||{}).who!==m.who)).join(''):'';
 const rows=CH9[room].map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||CH9[room][i-1].who!==m.who)).join('');
 let opts='';
 if(room==='friend'&&CH9.phase==='friendChoice')opts=ch9Opts(['知道啦 我会早点到','我争取不迟到ㅋㅋ','你先点喝的吧'],'ch9ChooseFriend');
 if(room==='hj'&&CH9.phase==='entry1')opts=ch9Opts(['还有几分钟 你到了？','快到了 你在门口吗','刚过来 你先进去吧'],'ch9ChooseEntry1');
 if(room==='hj'&&CH9.phase==='entry2')opts=ch9Opts(['等我一下 我们一起进去','你先进去吧 我马上到'],'ch9ChooseEntry2');
 if(room==='hj'&&CH9.phase==='home1')opts=ch9Opts(['到了 你呢','刚进门 你到家了？','嗯 刚坐下'],'ch9ChooseHome1');
 if(room==='hj'&&CH9.phase==='home2')opts=ch9Opts(['我也是','那下次我们两个去？','下次我来选地方'],'ch9ChooseHome2');
 if(room==='hj'&&CH9.phase==='home3')opts=ch9Opts(['晚安'],'ch9ChooseHome3');
 if(room==='hj'&&CH9.done)opts='<div class="story-end">当前对话已结束</div>';
 const title=room==='friend'?'A':room==='hj'?'宋亨俊':'今晚吃饭 🍽';
 wrap(title,'<div id="ch2-chat" data-id="'+id+'" class="ch3-kkt ch5-chat ch9-chat"><div class="chatbody" id="chatbody">'+history+'<div class="story-date">第九章 · 聚餐当天</div>'+rows+'</div><div class="story-send">'+opts+'</div></div>');
 const el=document.getElementById('chatbody');if(el)el.scrollTop=quiet||scroll==null?el.scrollHeight:scroll;
}
function ch9Friends(){
 activeApp='kkt';const entries=[['friend','A','ch8friend'],['hj','宋亨俊','hyeongjun'],...(CH9.group.length?[['group','今晚吃饭 🍽','ch9group']]:[])];
 const others=['group','woobin','manager','wonjin','serim'].map(id=>[null,({group:'CRAVITY 🐾',woobin:'徐宇瑸',manager:'经纪人',wonjin:'咸元进',serim:'朴世琳'})[id],id]);
 wrap('KakaoTalk','<div class="content ch5-friends">'+[...entries,...others].map(([room,name,id])=>'<div class="item" onclick="'+(room?"ch9Room('"+room+"')":"ch7LegacyRoom('"+id+"')")+'"><div class="avatar">'+escapeHtml(name[0])+'</div><div class="itemmain"><div class="itemtitle">'+escapeHtml(name)+'</div><div class="itemsub">'+escapeHtml(room?(CH9[room].at(-1)?.text||(room==='friend'?CH8.friend.at(-1)?.text:CH8.hj.at(-1)?.text)||'历史消息'):'历史消息')+'</div></div>'+gameContactBadge(id)+'</div>').join('')+'</div>');
}
function ch9Notes(){
 activeApp='notes';phoneReadRoom('notes');
 const old=[['第一章','gameReadNote()'],['第二章','ch2ReadInitialNote()'],['第三章','ch3Note(-1)'],['第四章','ch4ReadNote(0)'],['第五章','ch5IntroNote()'],['第六章','ch6Note("intro")'],['第七章','ch7Note("intro")'],['第八章','ch8Note("intro")']];
 const rows=old.map(([t,f])=>'<div class="note" onclick=\''+f+'\'><strong>'+t+'</strong></div>').join('');
 const mine=CH9.notes.map(n=>'<div class="note" onclick="ch9Note(\''+n.id+'\')"><strong>'+escapeHtml(n.title)+'</strong></div>').join('');
 wrap('备忘录','<div class="content story-notes">'+rows+mine+'<div class="note" onclick="gameChapterMenu()"><strong>跳转至其他章节</strong></div></div>');
}
function ch9Note(id){
 const n=CH9.notes.find(x=>x.id===id);if(!n)return ch9Notes();if(id==='end')return storyEndingView(9);
 activeApp='notes';phoneReadRoom('notes');
 const action=id==='intro'?'<button class="choice" onclick="ch9Room(\'friend\')">查看 A 的 KakaoTalk</button><button class="choice" onclick="ch9Reservation()">打开 NAVER 预约</button>':id==='hint'?'<button class="choice" onclick="ch9Reservation()">查看 NAVER 预约</button>':'';
 wrap(n.title,'<div class="content story-prose ch7-note ch8-note"><h2>'+escapeHtml(n.title)+'</h2><p>'+escapeHtml(n.text)+'</p>'+action+'<button class="choice" onclick="ch9Notes()">返回备忘录</button></div>');
}
function ch9Reservation(){
 if(!ch9Is())return;activeApp='map';
 wrap('NAVER Map','<div class="nm-app ch9-naver"><div class="nm-search"><span class="nm-brand">N</span><strong>预约 / 订单</strong></div><div class="nm-body"><button class="nm-back" onclick="nmOpen()">‹ 返回地图</button><h2>我的预约 / 订单</h2><div class="ch9-panel"><small>好友分享的预约 · 已确认</small><h3>Restaurant ON</h3><p>首尔 · 江南区清潭洞</p><p>聚餐当天 19:30 · 3人</p><p>预约人：A</p><button class="ch9-action" onclick="ch9ReservationDetail()">查看预约详情</button></div>'+(CH9.dinnerPart>=3?'<div class="ch9-panel"><small>到店记录 · 已到店</small><h3>Restaurant ON</h3><p>聚餐当天 19:30 · 3人</p><p>该记录不代表支付凭证</p></div>':'')+'</div><nav class="nm-tabs"><button onclick="nmOpen()">⌖<span>地图</span></button><button class="on" onclick="ch9Reservation()">▤<span>预约/订单</span></button></nav></div>');
}
function ch9ReservationDetail(){
 if(!ch9Is())return;CH9.reservationViewed=true;ch9Save();activeApp='map';
 wrap('预约详情','<div class="nm-app ch9-naver"><div class="nm-body"><button class="nm-back" onclick="ch9Reservation()">‹ 预约 / 订单</button><div class="ch9-panel"><small>预约已确认 · 好友 A 分享</small><h2>Restaurant ON</h2><p>레스토랑 온</p><p>'+escapeHtml(CH8_LOCATION.address)+'</p><p>聚餐当天 · 19:30</p><p>人数：3人</p><p>预约人：A</p><p>建议 19:20 前到达</p><p class="nm-disclaimer">此为游戏内虚构预约。你不能修改或取消好友的预约。</p><button class="ch9-action" onclick="ch8ExternalMap()">查看地图位置</button><button class="ch9-action" onclick="ch9Taxi()">打开 Kakao T 规划出行</button></div></div></div>');
}
function ch9Taxi(){
 if(!ch9Is())return;activeApp='kakaot';const stage=CH9.taxiState;
 const steps=['匹配中','司机已接单','车辆即将到达','行程中','已到达'];
 const body=stage==='none'?'<h2>去哪里？</h2><div class="ch9-panel"><small>出发地</small><p>首尔 · 公司附近</p><small>目的地</small><h3>Restaurant ON</h3><p>清潭洞 · '+escapeHtml(CH8_LOCATION.address)+'</p></div><h3>选择车型</h3>'+['普通出租车','舒适车型'].map(t=>'<button class="ch9-choice '+(CH9.taxiType===t?'on':'')+'" onclick="ch9TaxiType(\''+t+'\')">'+t+'</button>').join('')+'<p class="nm-disclaimer">虚构出行模拟，不展示实时价格，也不会真实叫车或扣款。</p><button class="ch9-action" onclick="ch9TaxiBegin()">确认模拟叫车</button>':stage==='done'?'<h2>行程已完成</h2><div class="ch9-panel"><p>目的地：Restaurant ON</p><p>车型：'+escapeHtml(CH9.taxiType)+'</p><p>状态：已到达 · 19:20</p></div><button class="ch9-action" onclick="ch9Room(\'hj\')">查看宋亨俊的消息</button>':'<h2>'+steps[Math.min(CH9.taxiStep,4)]+'</h2><div class="ch9-panel"><p>首尔 · 公司附近</p><p>↓</p><h3>Restaurant ON</h3><p>'+escapeHtml(CH9.taxiType)+'</p><p class="nm-disclaimer">模拟行程，无真实司机或车辆</p></div><button class="ch9-action" onclick="ch9TaxiNext()">继续行程</button><button class="ch9-action secondary" onclick="ch9TaxiFinish()">跳过等待 · 直接抵达</button>';
 wrap('Kakao T','<div class="ch9-taxi"><div class="ch9-taxi-head">Kakao <strong>T</strong> <small>出租车</small></div><div class="ch9-taxi-content">'+body+'<button class="ch9-link" onclick="ch9TaxiHistory()">行程记录</button></div></div>');
}
function ch9TaxiType(t){CH9.taxiType=t;ch9Save();ch9Taxi()}
function ch9TaxiBegin(){if(!CH9.reservationViewed){ch9ReservationDetail();return}CH9.taxiState='active';CH9.taxiStep=0;CH9.phase='taxi';ch9Save();ch9Taxi()}
function ch9TaxiNext(){if(CH9.taxiState!=='active')return;CH9.taxiStep++;if(CH9.taxiStep>=4)return ch9TaxiFinish();ch9Save();ch9Taxi()}
function ch9TaxiFinish(){
 if(CH9.taxiState==='done')return ch9Taxi();
 CH9.taxiState='done';CH9.arrived=true;CH9.clock=19*60+20;CH9.history.push({to:'Restaurant ON',type:CH9.taxiType,time:'19:20',status:'已到达'});ch9Save();
 if(CH9.hj.length===0){CH9.phase='arrival';ch9Queue('hj',[['them','你到哪了']],'entry1')}
 ch9Taxi();
}
function ch9TaxiHistory(){activeApp='kakaot';wrap('Kakao T · 行程','<div class="ch9-taxi"><div class="ch9-taxi-content"><button class="ch9-link" onclick="ch9Taxi()">‹ 返回</button><h2>我的行程</h2>'+(CH9.history.length?CH9.history.map(h=>'<div class="ch9-panel"><strong>'+escapeHtml(h.to)+'</strong><p>'+escapeHtml(h.time)+' · '+escapeHtml(h.type)+' · '+escapeHtml(h.status)+'</p></div>').join(''):'<p>暂无本章行程</p>')+'</div></div>')}
function ch9ChooseEntry1(i){if(CH9.phase!=='entry1')return;CH9.entryChoice=i;CH9.phase='entryReply';ch9Push('hj','me',['还有几分钟 你到了？','快到了 你在门口吗','刚过来 你先进去吧'][i]);ch9Queue('hj',[['them',['我刚到门口','嗯 刚到','我还没进去'][i]]],'entry2')}
function ch9ChooseEntry2(i){if(CH9.phase!=='entry2')return;CH9.enteredTogether=i===0;CH9.phase='entryReply2';ch9Push('hj','me',['等我一下 我们一起进去','你先进去吧 我马上到'][i]);ch9Queue('hj',[['them',i===0?'行 我在门口':'好 那我跟A说一声']],'dinnerReady')}
const ch9OldAfter=ch9After;ch9After=function(a){ch9OldAfter(a);if(a==='dinnerReady'){CH9.phase='dinner';ch9Save();ch9Dinner()}};
function ch9Dinner(){
 if(!ch9Is()||!CH9.arrived)return;
 activeApp='story';const n=CH9.dinnerPart;const text=n<3?CH9_DINNER[n]:[];
 wrap('聚餐 · 当晚片段','<div class="content ch9-scene"><div class="ch9-scene-time">'+(n===0?'19:30':n===1?'20:05':'20:55')+' · Restaurant ON</div><p class="ch9-scene-hint">以下是当晚发生的事，并非手机聊天或录音。</p>'+text.map(([who,line])=>'<p class="ch9-line"><strong>'+escapeHtml(who)+'</strong><span>'+escapeHtml(line)+'</span></p>').join('')+'<button class="ch9-action" onclick="ch9DinnerNext()">'+(n<2?'继续':'离开餐厅')+'</button></div>');
}
function ch9DinnerNext(){if(CH9.dinnerPart>=3)return;CH9.dinnerPart++;ch9Save();if(CH9.dinnerPart<3)return ch9Dinner();CH9.clock=21*60+2;CH9.phase='group';ch9Queue('group',[['them','我先撤了 明天一早还有事'],['them','今天挺开心的ㅋㅋ'],['them','你们回去路上小心'],['them','你也是'],['me','今天谢谢你啦'],['them','下次你们请客 我记住了'],['them','ㅋㅋ知道了']],'walk');ch9Room('group')}
const ch9AfterGroup=ch9After;ch9After=function(a){ch9AfterGroup(a);if(a==='walk'){CH9.phase='walk';ch9Save();ch9Walk()}};
function ch9Walk(){
 activeApp='story';wrap('餐厅外 · 当晚片段','<div class="content ch9-scene"><div class="ch9-scene-time">21:08 · 清潭洞</div><p>A先离开了。餐厅外只剩下你和亨俊。</p><p>你想再跟他待一会儿。</p>'+ch9Opts(['你现在急着回去吗','陪我走一会儿吧','我还不想这么快回去'],'ch9ChooseWalk')+'</div>');
}
function ch9ChooseWalk(i){
 if(CH9.phase!=='walk')return;CH9.walkChoice=i;CH9.phase='talk';const seq=[
 [['姜敏熙','你现在急着回去吗'],['宋亨俊','还好 怎么了'],['姜敏熙','那陪我走一段吧'],['宋亨俊','嗯 走吧']],
 [['姜敏熙','陪我走一会儿吧'],['宋亨俊','……好啊'],['宋亨俊','往哪边走'],['姜敏熙','随便走走？'],['宋亨俊','行ㅋㅋ']],
 [['姜敏熙','我还不想这么快回去'],['宋亨俊','那就再待一会儿'],['姜敏熙','嗯 我想跟你聊聊'],['宋亨俊','好']]
 ][i];CH9.talkLines=seq.concat(CH9_TALK.slice(0,2));ch9Save();ch9Talk();
}
function ch9Talk(){
 activeApp='story';const lines=CH9.talkLines||[];const opts=CH9.talkChoice===null?ch9Opts(['有点紧张。但我想跟你好好说说。','我想先跟你道歉。','其实我就是想跟你再待一会儿。'],'ch9ChooseTalk'):CH9.listeningChoice===null?ch9Opts(['你还有什么想跟我说的吗','我以前还有什么地方让你难过吗','你以后不开心也直接告诉我 好不好'],'ch9ChooseListen'):'<button class="ch9-action" onclick="ch9TalkFinish()">继续</button>';
 wrap('散步时 · 当晚片段','<div class="content ch9-scene"><div class="ch9-scene-time">21:12 · 散步时</div><p class="ch9-scene-hint">当晚的对话回顾，并非手机录音。</p>'+lines.map(([who,line])=>'<p class="ch9-line"><strong>'+escapeHtml(who)+'</strong><span>'+escapeHtml(line)+'</span></p>').join('')+opts+'</div>');
 const root=document.querySelector('.ch9-scene');if(root)root.scrollTop=root.scrollHeight;
}
function ch9ChooseTalk(i){if(CH9.talkChoice!==null)return;CH9.talkChoice=i;const words=['有点紧张。但我想跟你好好说说。','我想先跟你道歉。','其实我就是想跟你再待一会儿。'];const replies=[[['宋亨俊','那你说吧 我听着']],[['宋亨俊','你不用每次见我都先道歉'],['宋亨俊','先说你在想什么吧']],[['宋亨俊','可以啊'],['宋亨俊','不过你不是有话想说吗'],['姜敏熙','嗯 是有的']]];CH9.talkLines.push(['姜敏熙',words[i]],...replies[i],...CH9_TALK.slice(2));ch9Save();ch9Talk()}
function ch9ChooseListen(i){if(CH9.listeningChoice!==null)return;CH9.listeningChoice=i;const q=['你还有什么想跟我说的吗','我以前还有什么地方让你难过吗','你以后不开心也直接告诉我 好不好'];const a=[[['宋亨俊','有啊 不过也不用今晚全部说完'],['宋亨俊','以后慢慢说吧']],[['宋亨俊','有的吧ㅋㅋ'],['宋亨俊','但今天先到这里'],['宋亨俊','我不想把今晚变成翻旧账']],[['宋亨俊','好'],['宋亨俊','你也是 别什么都憋着']]];CH9.talkLines.push(['姜敏熙',q[i]],...a[i],['宋亨俊','走吧 有点晚了']);ch9Save();ch9Talk()}
function ch9TalkFinish(){if(CH9.listeningChoice===null)return;CH9.phase='home';CH9.clock=22*60+13;ch9Save();ch9Queue('hj',[['them','你到家了吗']],'home1');ch9Room('hj')}
function ch9ChooseHome1(i){if(CH9.phase!=='home1')return;CH9.homeChoice=i;CH9.phase='homeReply';ch9Push('hj','me',['到了 你呢','刚进门 你到家了？','嗯 刚坐下'][i]);ch9Queue('hj',[['them',['我也到了','到了ㅋㅋ','那就好 我也刚到'][i]],['them','A刚刚还给我发消息'],['me','说什么了'],['them','说下次绝对不让我们两个选餐厅'],['me','ㅋㅋㅋㅋ'],['them','他今天真的很能说'],['me','明明你也一直在笑'],['them','我哪有'],['me','有啊'],['them','ㅋㅋ'],['them','不过今天还挺开心的']],'home2')}
function ch9ChooseHome2(i){if(CH9.phase!=='home2')return;CH9.homeInvite=i;CH9.phase='homeReply2';ch9Push('hj','me',['我也是','那下次我们两个去？','下次我来选地方'][i]);const replies=[[['them','嗯'],['them','下次再出来吧']],[['them','可以啊'],['them','不过换一家ㅋㅋ']],[['them','好啊'],['them','这次别又说随便']]];ch9Queue('hj',replies[i],'home3')}
function ch9ChooseHome3(){if(CH9.phase!=='home3')return;CH9.phase='ending';ch9Push('hj','me','晚安');ch9Queue('hj',[['them','晚安']],'end')}
const ch9PrevOpen=openApp;openApp=function(k){if(ch9Is()&&k==='kakaot')return ch9Taxi();return ch9PrevOpen(k)};
const ch9PrevUnlock=gameUnlock;gameUnlock=function(k){if(ch9Is())return ['kkt','notes','photos','calendar','ig','phone','delivery','files','x','youtube','spotify','map','melon','kakaot'].includes(k);return ch9PrevUnlock(k)};
const ch9PrevChat=gameChat;gameChat=function(id){if(ch9Is()){if(id==='hyeongjun')return ch9Room('hj');if(id==='ch8friend')return ch9Room('friend');if(id==='ch9group')return ch9Room('group');if(['group','woobin','manager','wonjin','serim'].includes(id))return ch7LegacyRoom(id)}return ch9PrevChat(id)};
const ch9PrevPhone=phoneOpenRoom;phoneOpenRoom=function(id){if(ch9Is()){if(id==='hyeongjun')return ch9Room('hj');if(id==='ch8friend')return ch9Room('friend');if(id==='ch9group')return ch9Room('group');if(id==='notes')return ch9Notes();if(typeof id==='string'&&id.startsWith('ch9-note-'))return ch9Note(id.slice(9))}return ch9PrevPhone(id)};
const ch9PrevNotes=gameNotes;gameNotes=function(){if(ch9Is())return ch9Notes();return ch9PrevNotes()};
const ch9PrevCh8Note=ch8Note;ch8Note=function(id){const v=ch9PrevCh8Note(id);if(id==='end'&&CH8.done){const root=document.querySelector('.story-ending,.ch8-note');if(root&&!root.querySelector('[onclick="ch9Start()"]'))root.insertAdjacentHTML('beforeend','<button class="choice" onclick="ch9Start()">进入第九章</button>')}return v};
try{const saved=JSON.parse(localStorage.getItem(CH9_KEY)||'null');if(saved?.active)Object.assign(CH9,saved)}catch(e){}
window.addEventListener('load',()=>{if(localStorage.getItem('idol_current_chapter_v1')==='9'&&CH9.active){game.stage='chapter9';game.chapter2=true;game.chatBlocked=false;setTimeout(ch9Resume,900)}});
