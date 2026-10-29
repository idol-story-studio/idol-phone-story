/* Chapter 4 — 还在生气吗？ V2: progressive messages, persistent state, unified KKT and Notes. */
const CH4_KEY='idol_ch4_v2';
const CH4={active:false,step:0,lines:[],group:[],notes:[],pending:null,callState:'',done:false,callLog:false,groupSeen:false,session:0,clockMinute:13*60+20,noteQueue:[],calendarViewed:false,deliveryViewed:false};
const CH4_GROUP=[
['咸元进','有人到公司了吗'],['咸元进','我把耳机忘在练习室了'],['金太英','哥你昨天不是还说今天绝对不会忘东西'],['咸元进','我说的是不会忘带手机ㅋㅋ'],['安性珉','这个解释也太牵强了'],['具廷谟','先问一下谁在附近吧'],['徐宇瑸','我还在路上'],['朴世琳','大家别忘了下午的练习时间'],['咸元进','知道了哥'],['咸元进','谁帮我带杯咖啡'],['具廷谟','自己点外卖ㅋㅋ'],['咸元进','哥真的很冷漠'],['宋亨俊','我在路上'],['宋亨俊','要什么'],['咸元进','冰美式！！'],['宋亨俊','嗯'],['金太英','我也想喝'],['宋亨俊','自己买ㅋㅋ'],['金太英','区别对待是吧'],['徐宇瑸','太英你上次还欠我一杯呢'],['金太英','哥怎么还记得'],['朴世琳','别光聊咖啡 练习别迟到'],['咸元进','收到收到'],['宋亨俊','元进哥 你耳机在我包里'],['咸元进','啊？怎么在你那里'],['宋亨俊','昨天你让我帮你收的'],['具廷谟','哈哈哈哈'],['咸元进','我真的忘了ㅋㅋ']
];
const CH4_OPTIONS={
 intro:['两点左右吧','应该下午去 你呢','还没定 估计下午'],
 coffee:['你是不是又空腹喝咖啡了','早饭吃了吗','给元进哥带咖啡的时候自己也买了吧'],
 arrived:['刚到','嗯 你还在练习室？','到了 你呢'],
 wait:['我还以为你会等我','我以为我们一起回去呢','哦哦 那你先忙'],
 ask:['我怎么了','什么叫又来了','好吧 你先忙'],
 recall:['刚发什么了','干嘛撤回','我看见你撤回了'],
 bread:['你还记得这个啊','你还真买到了','谢谢你'],
};
function ch4Time(advance=1){CH4.clockMinute=(Number(CH4.clockMinute)||800)+advance;const n=CH4.clockMinute;return String(Math.floor(n/60)%24).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function ch4Save(){try{localStorage.setItem(CH4_KEY,JSON.stringify(CH4))}catch(e){}}
function ch4Is(){return CH4.active&&game.stage==='chapter4'}
function ch4RoomVisible(id='hyeongjun'){return activeApp==='kkt'&&current==='appview'&&!!$('appbody')?.querySelector('#ch2-chat[data-id="'+id+'"]')}
function ch4Notify(kind,who){if(!ch4Is())return;const currentRoom=activeApp==='kkt'&&document.querySelector(kind==='group'?'#ch2-chat[data-id="group"]':'#ch2-chat[data-id="hyeongjun"]');if(!currentRoom)phoneReceiveMessage(kind==='group'?'group':'hyeongjun','新消息')}
function ch4AddNote(title,text,dest){if(CH4.notes.some(n=>n.title===title))return;CH4.notes.push({title,text,dest});ch4Save();if(activeApp!=='notes'&&!CH4.pending&&![1,3,6,8,10,12,14].includes(CH4.step))phoneReceiveNote('备忘录有新的内容')}
function ch4Start(){if(!CH3.done){gameLocked();return}if(CH4.active&&!CH4.done&&game.stage==='chapter4'){ch4Notes();return}Object.assign(CH4,{active:true,step:0,lines:[],group:[],notes:[],pending:null,callState:'',done:false,callLog:false,groupSeen:false,clockMinute:13*60+20,noteQueue:[],calendarViewed:false,deliveryViewed:false,session:(CH4.session||0)+1});game.stage='chapter4';game.chapter2=true;game.chatBlocked=false;ch4Save();ch4AddNote('第四章','亨俊已经解除拉黑了。\n不知道该怎么开口。先看看有没有消息吧。','kkt');ch4Notes();setTimeout(()=>ch4Next(),1600)}
function ch4Line(from,text,newRound=false){if(!ch4Is())return;CH4.lines.push({from,text,time:ch4Time(newRound?8:(from==='me'?1:2)),newRound});ch4Save();if(ch4RoomVisible())ch4Room(true);else if(from==='them')phoneReceiveMessage('hyeongjun',text)}
function ch4Batch(items,done,newRound=false){const token=CH4.session;let i=0;function next(){if(!ch4Is()||token!==CH4.session)return;if(i>=items.length){if(done)done();return}const [from,text]=items[i];if(from==='me'&&!phonePlayerCanAutoReply('hyeongjun')){setTimeout(next,350);return}i++;ch4Line(from,text,newRound&&i===1);setTimeout(next,from==='them'?phoneMessageDelay(items[i]?.[1]):phoneMessageDelay(items[i]?.[1]))}setTimeout(next,phoneMessageDelay(items[0]?.[1],true))}
function ch4GroupPush(){if(!ch4Is())return;const token=CH4.session;let i=CH4.group.length;function next(){if(!ch4Is()||token!==CH4.session||CH4.step!==3)return;if(i>=CH4_GROUP.length){CH4.step=4;ch4Save();ch4AddNote('新线索1','亨俊帮元进哥买咖啡。\n他不会又空腹喝冰美式吧……\n去私聊问问他有没有吃早饭。','private');if(ch4RoomVisible('group'))ch4Group(true);return}if(CH4_GROUP[i]?.[0]==='姜敏熙'&&!phonePlayerCanAutoReply('group')){setTimeout(next,350);return}CH4.group.push([...CH4_GROUP[i++],ch4Time(i%4===0?2:1)]);ch4Save();if(ch4RoomVisible('group'))ch4Group(true);else if(CH4_GROUP[i-1][0]!=='姜敏熙')phoneReceiveMessage('group',CH4_GROUP[i-1][1]);setTimeout(next,phoneMessageDelay(CH4_GROUP[i]?.[1]))}next()}
function ch4Next(){if(!ch4Is())return;
 if(CH4.step===0){CH4.step=1;ch4Save();ch4Batch([['them','明天来公司吗'],['them','几点到']],()=>ch4Pending('intro'))}
 else if(CH4.step===2){CH4.step=3;ch4Save();setTimeout(ch4GroupPush,1800)}
 else if(CH4.step===4){ch4Pending('coffee')}
 else if(CH4.step===5){CH4.step=6;ch4Save();setTimeout(()=>ch4Batch([['them','到公司了吗'],['them','世琳哥刚刚在找人']],()=>ch4Pending('arrived'),true),9500)}
 else if(CH4.step===7){CH4.step=8;ch4Save();setTimeout(()=>ch4Batch([['them','我先走了'],['them','廷谟哥找我有点事'],['them','练习室的灯你记得关']],()=>ch4Pending('wait'),true),11000)}
 else if(CH4.step===9){CH4.step=10;ch4Save();setTimeout(()=>ch4Batch([['them','我先忙了']],()=>{CH4.step=11;ch4Save();ch4AddNote('新线索3','先不发消息了。\n亨俊说他先忙了，我也先看看手机里别的东西吧。','none');ch4Next()}),1800)}
 else if(CH4.step===11){ch4ScheduleRecall()}
 else if(CH4.step===13){CH4.step=14;ch4Save();setTimeout(()=>ch4Batch([['them','[蒸面包照片]'],['them','之前你说想吃的那个'],['them','刚才路过看见了']],()=>ch4Pending('bread')),4500)}
 else if(CH4.step===15){CH4.step=16;CH4.clockMinute=Math.max(CH4.clockMinute,22*60+40);ch4Save();setTimeout(ch4Incoming,30000)}
}
function ch4Pending(key){if(!ch4Is())return;CH4.pending=key;ch4Save();if(ch4RoomVisible())ch4Room(true)}
function ch4Choice(i){const key=CH4.pending;if(!ch4Is()||!key||!CH4_OPTIONS[key]?.[i])return;CH4.pending=null;ch4Line('me',CH4_OPTIONS[key][i]);ch4Save();
 if(key==='intro')ch4Batch([i===0?['them','两点啊']:i===1?['them','我下午也在']:['them','那你定了再说'],i===0?['them','我应该也在']:i===1?['them','应该在练习室']:['them','世琳哥在问到的人数'],['them','到了再说吧']],()=>{CH4.step=2;ch4Save();ch4Next()});
 if(key==='coffee')ch4Batch(i===1?[['them','吃了'],['them','你呢'],['me','我也吃了'],['them','那就行']]:i===2?[['them','我没说我要喝'],['them','只是顺路帮他买'],['me','哦哦 我还以为你也买了'],['them','没有']]:[['them','吃了'],['them','你先管好你自己吧'],['me','我就是随便问问'],['them','……'],['them','头还疼吗'],['me','好多了'],['them','嗯']],()=>{CH4.step=5;ch4Save();ch4Next()});
 if(key==='arrived')ch4Batch(i===0?[['them','嗯'],['them','我还在练习室'],['them','你刚出院 别练太久'],['them','别拖累明天的安排']]:i===1?[['them','嗯'],['them','还要练一会'],['them','你找我有事？'],['me','没有 就问问'],['them','哦'],['them','你自己也别练太久']]:[['them','我还在练习室'],['them','等下就走'],['me','好'],['them','世琳哥刚才找你'],['them','记得回一下']],()=>{CH4.step=7;ch4Save();ch4AddNote('新线索2','今天的练习安排好像还在日历里。\n去日历看看吧。','calendar');ch4Next()});
 if(key==='wait')ch4Batch(
  i===2?[['them','嗯'],['them','练习室记得锁门'],['me','知道了'],['them','别太晚']]:
  i===0?[['them','你又没说在等我'],['me','我以为你会知道'],['them','你不说我怎么知道'],['me','这也没必要特地说吧'],['them','……你每次都这么觉得']]:
  [['them','你也没说要一起走啊'],['me','我以为你还在公司'],['them','我是在啊'],['them','可你又没来找我'],['me','哦……']],
  ()=>{CH4.step=9;ch4Save();ch4Next()});
 if(key==='ask')ch4Batch(i===0?[['them','就是你刚才那句'],['them','算了'],['them','我先忙了']]:i===1?[['them','没什么'],['them','现在说也没用'],['them','我先忙了']]:[['them','嗯'],['them','我先忙了']],()=>{CH4.step=11;ch4Save();ch4AddNote('新线索3','先不发消息了。\n亨俊说他先忙了，我也先看看手机里别的东西吧。','none');ch4Next()});
 if(key==='recall')ch4Batch(i===0?[['them','发错了'],['them','没事']]:i===1?[['them','手滑'],['them','不用管']]:[['them','看见就看见了'],['them','没什么']],()=>{CH4.step=13;ch4Save();ch4Next()});
 if(key==='bread')ch4Batch(i===0?[['them','只是记得你提过'],['them','刚好路过'],['them','明天带去公司']]:i===1?[['them','顺路看到的'],['them','别想太多'],['them','明天拿给你']]:[['them','不用谢'],['them','又不是特地买的'],['them','明天带去公司']],()=>{CH4.step=15;ch4Save();ch4Next()});
}
function ch4ChatShell(name,id,rows,options,quiet){activeApp='kkt';const old=$('chatbody'),oldScroll=old?old.scrollTop:null;wrap(name,'<div id="ch2-chat" data-id="'+id+'" class="ch3-kkt"><div class="chatbody" id="chatbody">'+rows+'</div><div class="story-send">'+options+'</div></div>');const el=$('chatbody');if(el){el.style.overflowY='auto';el.style.minHeight='0';el.scrollTop=quiet?el.scrollHeight:(oldScroll===null?el.scrollHeight:oldScroll)}}
function ch4Room(quiet=false){if(!ch4Is())return;const rows=CH4.lines.map((m,i)=>(m.newRound?'<div class="story-date">'+escapeHtml(m.time)+'</div>':'')+(m.from==='recalled'?'<div class="story-date">消息已删除。</div>':m.text==='[蒸面包照片]'?'<div class="bubbleline ch4-photo-line"><div class="bubble ch4-photo-bubble"><button class="ch4-photo-button" onclick="ch4BreadPhoto()" aria-label="查看蒸面包照片"><img src="assets/ch4_steamed_bread.jpg" alt="宋亨俊发来的蒸面包照片" onerror="this.alt=\'照片加载失败\'"></button></div></div>':gameBubble(m.from==='me',m.text,m.time,false,false,i===0||CH4.lines[i-1].from!==m.from))).join('');const opts=CH4.pending?'<div class="story-options">'+CH4_OPTIONS[CH4.pending].map((t,i)=>'<button class="story-option" onclick="ch4Choice('+i+')">'+escapeHtml(t)+'</button>').join('')+'</div>':(CH4.done||CH4.step>=16)?'<div class="story-end">当前对话已结束</div>':'';ch4ChatShell('宋亨俊','hyeongjun',rows,opts,quiet)}
function ch4Group(quiet=false){if(!ch4Is())return;CH4.groupSeen=true;if(CH4.step===4&&!CH4.pending)ch4Pending('coffee');ch4Save();const hist=(typeof CH3_HISTORY!=='undefined'?CH3_HISTORY:[]).concat(typeof CH3_EAR_HISTORY!=='undefined'?CH3_EAR_HISTORY:[]).concat(typeof CH3_GROUP!=='undefined'?CH3_GROUP.slice(0,CH3.groupCount||0):[]);const all=hist.concat(CH4.group);const rows=all.map(([name,t],i)=>'<div class="ch3-group-entry"><span class="ch3-group-name">'+escapeHtml(name)+'</span>'+gameBubble(name==='姜敏熙',t,i<hist.length?'之前':(all[i][2]||''),false,false,true)+'</div>').join('');ch4ChatShell('CRAVITY 🐾','group',rows,CH4.step>=4?'<div class="story-end">当前对话已结束</div>':'',quiet)}
function ch4SearchOpen(id){const q=prompt('搜索聊天记录');if(!q)return;const data=id==='group'?CH4.group.map(([n,t])=>n+'：'+t):CH4.lines.map(m=>m.text);const hits=data.filter(t=>t.includes(q));activeApp='kkt';wrap('搜索结果','<div class="content">'+(hits.length?hits.map(t=>'<div class="note">'+escapeHtml(t)+'</div>').join(''):'<p>没有找到相关记录</p>')+'<button class="choice" onclick="'+(id==='group'?'ch4Group()':'ch4Room()')+'">返回聊天</button></div>')}
function ch4BreadPhoto(){activeApp='kkt';wrap('照片','<div class="content" style="text-align:center;padding:12px;background:#111;color:#fff"><img src="assets/ch4_steamed_bread.jpg" alt="蒸面包照片" style="max-width:100%;max-height:75vh;object-fit:contain" onerror="this.alt=\'照片加载失败\'"><p>蒸面包</p><button class="choice" onclick="ch4Room()">返回聊天</button></div>')}
function ch4Friends(){if(!ch4Is())return;activeApp='kkt';const entries=[['hyeongjun','宋亨俊',CH4.lines.at(-1)?.text||'已恢复联系','ch4Room()'],['group','CRAVITY 🐾',CH4.group.at(-1)?.[1]||'历史消息','ch4Group()'],['wonjin','咸元进','历史聊天',"ch2Chat('wonjin')"],['woobin','徐宇瑸','历史聊天',"ch2Chat('woobin')"],['serim','朴世琳','历史聊天',"ch2Chat('serim')"]];wrap('KakaoTalk','<div class="content">'+entries.map(([id,name,preview,fn])=>'<div class="item" onclick="'+fn+'"><div class="avatar">'+name[0]+'</div><div class="itemmain"><div class="itemtitle">'+name+'</div><div class="itemsub">'+escapeHtml(preview)+'</div></div></div>').join('')+'</div>')}
function ch4Notes(){return gameNotes()}
function ch4ReadNote(i){const n=CH4.notes[i];if(!n)return ch4Notes();activeApp='notes';let dest='';if(n.dest==='private')dest='<button class="choice" onclick="ch4Room()">前往宋亨俊的 KakaoTalk 私聊</button>';else if(n.dest==='kkt')dest='<button class="choice" onclick="ch4Friends()">前往 KakaoTalk</button>';else if(n.dest==='delivery')dest='<button class="choice" onclick="ch4Delivery()">前往外卖民族</button>';else if(n.dest==='calendar')dest='<button class="choice" onclick="ch4Calendar()">前往日历（可选）</button>';else if(n.dest==='apps')dest='<button class="choice" onclick="ch4Calendar()">前往日历（可选）</button>';wrap(n.title,'<div class="content story-prose"><p>'+escapeHtml(n.text)+'</p>'+(dest||'<button class="choice" onclick="ch4Notes()">返回备忘录</button>')+'</div>')}
function ch4Ending(){activeApp='notes';wrap('第四章已结束','<div class="content story-prose story-ending"><h2>第四章 · 还在生气吗？</h2><p>还是没有和好。\n但他刚刚打电话来了。</p><p>当前回忆进度：4/10</p><div class="story-progress"><span style="width:40%"></span></div><button class="choice" onclick="ch4Notes()">返回备忘录</button></div>')}

const CH4_EVENTS=[['10月8日','音乐节目预录制','09:00 集合'],['10月12日','专辑签售会','14:00 入场'],['10月17日','粉丝见面会彩排','18:30 彩排'],['10月21日','电台录制','11:00 录音'],['10月25日','团体练习','16:00 练习室'],['10月28日','公司练习','15:00 世琳哥通知'],['11月2日','专辑拍摄','13:00 妆发确认']];
function ch4ExploreGate(kind){const token=CH4.session;setTimeout(()=>{if(!ch4Is()||token!==CH4.session||activeApp!==kind)return;const field=kind==='calendar'?'calendarViewed':'deliveryViewed';if(CH4[field])return;CH4[field]=true;ch4Save();if(kind==='calendar'&&CH4.step===7)ch4Next();/* 外卖民族仅供自由探索，不触发主线 */},5500)}
function ch4Calendar(month=10){activeApp='calendar';ch4ExploreGate('calendar');const events=CH4_EVENTS.filter(e=>e[0].startsWith(month+'月'));wrap('日历','<div class="content ch4-explore"><button class="choice" onclick="ch4Calendar('+(month===10?11:10)+')">查看'+(month===10?'十一月':'十月')+'</button><h2>'+month+'月</h2><div class="ch4-cal-grid">'+Array.from({length:month===10?31:30},(_,i)=>'<button class="'+(events.some(e=>e[0]===month+'月'+(i+1)+'日')?'marked':'')+'" onclick="ch4CalendarDay('+month+','+(i+1)+')">'+(i+1)+'</button>').join('')+'</div><h3>工作行程</h3>'+events.map(e=>'<div class="note" onclick="ch4CalendarDay('+month+','+Number(e[0].split('月')[1].replace('日',''))+')"><strong>'+e[0]+' · '+e[1]+'</strong><p>'+e[2]+'</p></div>').join('')+'<h3>提醒事项</h3><div class="note">□ 带练习鞋</div><div class="note">□ 买新的耳机套</div><div class="note">✓ 帮亨俊带过桃子冰茶</div><div class="note">□ 便利店买酸奶</div></div>')}
function ch4CalendarDay(month,day){activeApp='calendar';ch4ExploreGate('calendar');const events=CH4_EVENTS.filter(e=>e[0]===month+'月'+day+'日');wrap(month+'月'+day+'日','<div class="content ch4-explore">'+(events.length?events.map(e=>'<div class="note"><strong>'+e[1]+'</strong><p>'+e[2]+'</p></div>').join(''):'<p>没有日程</p>')+'<button class="choice" onclick="ch4Calendar('+month+')">返回月视图</button></div>')}
const CH4_ORDERS=[
['酸奶与水果店','希腊酸奶 ×2、蜜桃水果杯 ×1','酸奶酱另外装，水果不要太冰。','₩18,900','10月19日'],
['韩式鸡肉料理店','酱油蒜香鸡 ×1、甜辣无骨鸡 ×1','不要太辣，腌萝卜多给一份。','₩29,500','10月14日'],
['茶饮店','桃子冰茶 ×1、冰美式 ×1','桃子冰茶少冰，请分开放。','₩10,500','10月9日'],
['沙拉厨房','鸡胸肉沙拉 ×1、牛油果沙拉 ×1','沙拉酱另外包装。','₩23,000','10月3日'],
['汤饭店','牛肉汤饭 ×2','其中一份不要葱，放门口。','₩22,000','9月27日']];
function ch4Delivery(tab='订单'){activeApp='delivery';ch4ExploreGate('delivery');wrap('外卖民族','<div class="content ch4-explore"><div class="ch4-baemin">外卖民族 <small>送至 · 首尔</small></div><div class="ch4-delivery-tabs">'+['首页','美食','咖啡','收藏','订单'].map(t=>'<button class="choice" onclick="ch4Delivery(\''+t+'\')">'+t+'</button>').join('')+'</div><h3>'+tab+'</h3>'+(tab==='收藏'?'<div class="note">收藏：酸奶与水果店 · 沙拉厨房 · 韩式鸡肉料理店</div>':'')+CH4_ORDERS.map((o,i)=>'<div class="note" onclick="ch4Order('+i+')"><strong>'+o[0]+'</strong><p>'+o[1]+'</p><small>'+o[4]+' · 已送达 · '+o[3]+'</small></div>').join('')+'</div>')}
function ch4Order(i){activeApp='delivery';ch4ExploreGate('delivery');const o=CH4_ORDERS[i];if(!o)return ch4Delivery();wrap('订单详情','<div class="content ch4-explore"><h2>'+o[0]+'</h2><p>'+o[4]+' · 已送达</p><div class="note">'+o[1]+'</div><h3>配送备注</h3><div class="note">'+o[2]+'</div><h3>实付 '+o[3]+'</h3><button class="choice" onclick="ch4Delivery()">返回订单</button></div>')}
function ch4Incoming(){if(!ch4Is()||CH4.done||CH4.callState)return;CH4.callState='ringing';ch4Save();game.callType='ch4';callSession++;clearInterval(callTimer);$('call').classList.add('show');$('callerName').textContent='宋亨俊';if(typeof gameSetCallerAvatar==='function')gameSetCallerAvatar('宋亨俊');$('calltimer').textContent='电话 · 来电中…';$('callsub').textContent='来电';$('callmsg').textContent='';$('answer').style.display='block';$('pip').style.display='none';startRing()}
const CH4_CALL=[['宋亨俊','喂'],['宋亨俊','怎么还没睡'],['姜敏熙','你怎么知道我没睡ㅋㅋ'],['宋亨俊','刚才看你KakaoTalk还在线'],['姜敏熙','啊ㅋㅋ'],['宋亨俊','今天头还疼吗'],['姜敏熙','好多了'],['宋亨俊','真的？'],['姜敏熙','嗯 真的'],['宋亨俊','那就好'],['宋亨俊','早点睡吧'],['姜敏熙','你也是'],['宋亨俊','嗯']];
function ch4Answer(){stopRing();CH4.callState='connected';ch4Save();$('answer').style.display='none';$('pip').style.display='none';$('callsub').textContent='正在通话';const session=++callSession;callStart=Date.now();clearInterval(callTimer);callTimer=setInterval(()=>{let s=Math.floor((Date.now()-callStart)/1000);$('calltimer').textContent='通话中 · '+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},500);CH4_CALL.filter(([who])=>who==='宋亨俊').forEach(([who,t],i,lines)=>setTimeout(()=>{if(callSession!==session)return;$('callmsg').textContent=who+'：'+t;if(i===lines.length-1){CH4.callState='finished';ch4Save();$('callsub').textContent='可以挂断'}},1000+i*2300))}
function ch4EndCall(){stopRing();clearInterval(callTimer);callSession++;$('call').classList.remove('show');const missed=CH4.callState==='ringing';CH4.callState='ended';CH4.callLog=true;CH4.done=true;CH4.step=17;ch4Save();gameNotify('notes','第四章已结束');oldHome()}
function ch4Calls(){activeApp='phone';wrap('最近通话','<div class="content"><div class="item" onclick="ch4Incoming()"><div class="itemmain"><strong>宋亨俊</strong><div class="itemsub">今天 · 语音通话</div></div></div></div>')}

const ch4OldUnlock=gameUnlock;gameUnlock=function(k){if(ch4Is()&&['calendar','delivery','phone','kkt','notes','ig','photos','x','files'].includes(k))return true;return ch4OldUnlock(k)};
const ch4OldOpen=openApp;openApp=function(k){if(ch4Is()){if(k==='ig'){game.chapter2=true;return ch4OldOpen(k)}if(k==='calendar')return ch4Calendar();if(k==='delivery')return ch4Delivery();if(k==='notes')return ch4Notes();if(k==='phone')return ch4Calls();if(k==='kkt')return ch4Friends()}return ch4OldOpen(k)};
const ch4OldChat=gameChat;gameChat=function(id){if(ch4Is()&&id==='hyeongjun')return ch4Room();if(ch4Is()&&id==='group')return ch4Group();return ch4OldChat(id)};
// Chapter four uses the shared Notes renderer.
const ch4OldFriends=gameFriends;gameFriends=function(){if(ch4Is())return ch4Friends();return ch4OldFriends()};
/* Chapter navigation is centralized, including chapter four from any earlier chapter. */
gameChapterMenu=function(){
 activeApp='notes';
 const current=storyNotesChapter();
 const names=['','一','二','三','四'];
 const row=n=>'<button class="note story-chapter-button" onclick="'+(n===1?'gameJumpChapter(1)':n===2?'gameJumpChapter(2)':n===3?'ch3Start()':'ch4Start()')+'"><strong>前往第'+names[n]+'章</strong></button>';
 const html=[1,2,3,4].filter(n=>n!==current).map(row).join('');
 wrap('跳转至其他章节','<div class="content story-notes"><p class="story-chapter-hint">选择章节查看或继续剧情。第四章需先完成第三章。</p>'+html+'</div>');
};
const ch4OldEnding=ch3Ending;ch3Ending=function(){ch4OldEnding();if(CH3.done){const el=document.querySelector('.story-ending');if(el&&!el.querySelector('[onclick="ch4Start()"]'))el.insertAdjacentHTML('beforeend','<button class="choice" onclick="ch4Start()">进入第四章</button>')}};
const ch4OldAnswer=answerCall;answerCall=function(){if(game.callType==='ch4')return ch4Answer();return ch4OldAnswer()};
const ch4OldEnd=endCall;endCall=function(){if(game.callType==='ch4'){game.callType=null;return ch4EndCall()}return ch4OldEnd()};
try{const saved=JSON.parse(localStorage.getItem(CH4_KEY)||'null');if(saved&&saved.active){Object.assign(CH4,saved);if(!CH4.clockMinute)CH4.clockMinute=13*60+20;if(game.stage==='chapter4'){game.chapter2=true;game.chatBlocked=false;if(CH4.callState==='ringing'||CH4.callState==='connected')CH4.callState='';}}}catch(e){}


/* Hierarchical app navigation. Preserve the current rendered page when a child opens;
   refreshes of the same screen do not create extra history entries. */
const CH4_NAV={stack:[],app:null,view:null,restoring:false};
const ch4NavWrap=wrap;
wrap=function(title,body,extra){
 const app=activeApp||null;
 const currentView=String(title)+'|'+(app||'');
 if(CH4_NAV.app!==app){CH4_NAV.stack=[];CH4_NAV.view=null;CH4_NAV.app=app}
 else if(!CH4_NAV.restoring&&CH4_NAV.view!==currentView&&current==='appview'){
  const el=$('appbody');
  if(el&&CH4_NAV.view)CH4_NAV.stack.push({html:el.innerHTML,app:CH4_NAV.app,view:CH4_NAV.view,scroll:el.scrollTop});
 }
 ch4NavWrap(title,body,extra);
 CH4_NAV.view=currentView;
 const back=$('appbody')?.querySelector('.apphead .back');
 if(back){back.setAttribute('onclick','gameNavigateBack()');back.textContent='‹ 返回'}
};
function gameNavigateBack(){
 if(CH4_NAV.stack.length){
  const last=CH4_NAV.stack.pop();
  CH4_NAV.restoring=true;
  activeApp=last.app;
  CH4_NAV.app=last.app;
  CH4_NAV.view=last.view;
  $('appbody').innerHTML=last.html;
  $('appbody').scrollTop=last.scroll||0;
  CH4_NAV.restoring=false;
  return;
 }
 CH4_NAV.stack=[];CH4_NAV.view=null;CH4_NAV.app=null;
 goHome();
}
const ch4NavOldHome=goHome;
goHome=function(){CH4_NAV.stack=[];CH4_NAV.app=null;CH4_NAV.view=null;return ch4NavOldHome()};

/* Global media Easter eggs are available in every chapter, regardless of story gates. */
const ch4PreviousUnlockMedia=gameUnlock;
gameUnlock=function(k){if(k==='youtube'||k==='spotify')return true;return ch4PreviousUnlockMedia(k)};
const ch4PreviousOpenMedia=openApp;
openApp=function(k){if(k==='youtube'||k==='spotify'){mediaEggApp(k);return}return ch4PreviousOpenMedia(k)};

/* Single Notes list renderer for chapters 1–4. Chapter content stays in its original module. */
function storyNotesChapter(){
 if(typeof ch4Is==='function'&&ch4Is())return 4;
 if(typeof CH3!=='undefined'&&CH3.active&&game.stage==='chapter3')return 3;
 if(game.chapter2)return 2;
 return 1;
}
function storyNotesRows(){
 const current=storyNotesChapter();
 const row=(title,fn)=>'<div class="note" onclick="'+fn+'"><strong>'+escapeHtml(title)+'</strong></div>';
 let html='';
 html+=row('第一章','gameReadNote()');
 if(current===1){
  if(game.xExited)html+=row('新的线索','gameReadPhoneNote()');
  if(game.chapterEnd)html+=row('第一章已结束','gameReadEnding()');
 }
 if(current>=2){
  html+=row('第二章','ch2ReadInitialNote()');
  if(current===2){
   if(CH2.igNote)html+=row('新线索 · 以前的评论','ch2ReadIGNote()');
   if(CH2.photosNote)html+=row('新线索 · 以前的照片','ch2ReadPhotoNote()');
   if(CH2.done)html+=row('第二章已结束','ch2Ending()');
  }
 }
 if(current>=3){
  html+=row('第三章','ch3Note(-1)');
  if(current===3){
   CH3.notes.forEach((n,i)=>{if(n.title!=='第三章结束')html+=row('新线索'+(i+1),'ch3Note('+i+')')});
   if(CH3.done)html+=row('第三章已结束','ch3Ending()');
  }
 }
 if(current>=4){
  html+=row('第四章','ch4ReadNote(0)');
  let count=0;
  CH4.notes.forEach((n,i)=>{
   if(i===0||n.title==='已解锁的新应用')return;
   if(n.title==='通话记录')return;
   count++;
   html+=row('新线索'+count,'ch4ReadNote('+i+')');
  });
  if(CH4.done)html+=row('第四章已结束','ch4Ending()');
 }
 html+=row('跳转至其他章节','gameChapterMenu()');
 return html;
}
gameNotes=function(){
 activeApp='notes';gameClear('notes');
 wrap('备忘录','<div class="content story-notes">'+storyNotesRows()+'</div>');
};

/* 第四章：撤回提醒在离开宋亨俊私聊后触发，与外卖民族无关。 */
let ch4RecallTimer=null;
function ch4ScheduleRecall(){
 if(!ch4Is()||CH4.step!==11||ch4RoomVisible('hyeongjun')||ch4RecallTimer)return;
 const token=CH4.session;
 ch4RecallTimer=setTimeout(()=>{
  ch4RecallTimer=null;
  if(!ch4Is()||token!==CH4.session||CH4.step!==11||ch4RoomVisible('hyeongjun'))return;
  CH4.step=12;ch4Save();
  ch4Line('recalled','消息已删除');
  ch4Pending('recall');
  phoneReceiveMessage('hyeongjun','撤回了一条消息');
 },3800);
}
function ch4CancelRecallTimer(){if(ch4RecallTimer!==null){clearTimeout(ch4RecallTimer);ch4RecallTimer=null}}
const ch4RecallPreviousWrap=wrap;
wrap=function(title,body,extra){
 const result=ch4RecallPreviousWrap(title,body,extra);
 if(ch4Is()){
  if(ch4RoomVisible('hyeongjun'))ch4CancelRecallTimer();
  else if(CH4.step===11)ch4ScheduleRecall();
 }
 return result;
};
const ch4RecallPreviousHome=goHome;
goHome=function(){const result=ch4RecallPreviousHome();if(ch4Is()&&CH4.step===11)ch4ScheduleRecall();return result};
const ch4RecallPreviousBack=gameNavigateBack;
gameNavigateBack=function(){
 const result=ch4RecallPreviousBack();
 if(ch4Is()){
  if(ch4RoomVisible('hyeongjun'))ch4CancelRecallTimer();
  else if(CH4.step===11)ch4ScheduleRecall();
 }
 return result;
};
