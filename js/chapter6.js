/* Chapter 6 — LOUDER！ / preserves shared KakaoTalk, Notes and phone rules. */
const CH6_KEY='idol_ch6_v1';
const CH6={active:false,done:false,phase:'',messages:[],group:[],woobin:[],wonjin:[],manager:[],notes:[],choice:null,choiceHelp:null,choiceReply:null,callStep:0,callStatus:'',callSeconds:0,muted:false,camera:true,flipped:false,speaker:true,shot:'wide',session:0,clock:20*60+35,queue:null,queueIndex:0,queueAfter:null,groupSeen:false,woobinSeen:false,managerSeen:false,wonjinSeen:false,endingRead:false};
const CH6_GROUP=[['朴世琳','明天下午三点公司练习室集合。'],['朴世琳','LOUDER 的走位有一点调整，明天先完整走两遍。'],['具廷谟','收到'],['金太英','终于不用再改衣服了ㅋㅋ'],['咸元进','你上次不是自己说袖子太长吗'],['金太英','是真的太长了啊'],['宋亨俊','明天按最后确认的版本来'],['宋亨俊','别又有人记成前一版'],['咸元进','你直接点名吧ㅋㅋ'],['宋亨俊','我没说是谁'],['具廷谟','好的队长ㅋㅋ']];
const CH6_END_NOTE='舞蹈好像终于有点头绪了。\n\n亨俊还是和以前一样，很会教人。\n\n虽然我已经不记得以前一起练习的事了。\n\n他刚刚笑的时候，我差点忘了我们还在吵架。\n\n……要是能一直这样就好了。';
const CH6_CALL=[
 ['喂，听得见吗？','wide'],
 ['你把手机放稳一点。','wide'],
 ['我看看你现在记得多少。','far'],
 ['等一下，往左边转一点……对。','left'],
 ['先从第二段开始。你记得自己站哪边吗？','center'],
 ['position','center'],
 ['你先不用急着记所有动作。','wide'],
 ['先记住什么时候换位置，其他的明天再练。','far'],
 ['好，再试一次。','center'],
 ['……呀！不是那边ㅋㅋㅋ','shake'],
 ['你怎么又跟我走反了！','shake'],
 ['先别动了，我怕你把自己绕晕ㅋㅋ','wide'],
 ['你是不是一直在重复同一段？','center'],
 ['先坐下来听我讲一遍。','down'],
 ['你怎么记得这么清楚啊。','wide','me'],
 ['我是队长啊。','wide'],
 ['而且这段我们之前一起练过好多次。','wide'],
 ['我真的一点都不记得了。','wide','me'],
 ['……','wide'],
 ['没关系。再练就是了。','wide'],
 ['但是你明天要是还往右边跑，我真的不管你了。','center'],
 ['知道啦ㅋㅋ','center','me'],
 ['你每次都说知道了。','wide'],
 ['明天穿那双黑色运动鞋吧。','wide'],
 ['为什么？','wide','me'],
 ['你之前穿新鞋练舞，脚后跟都磨红了。','wide'],
 ['……真拿你没办法。','wide'],
 ['差不多了，剩下的明天再练。','far'],
 ['今天谢谢你。','wide','me'],
 ['没事。','wide'],
 ['……','wide'],
 ['你头发是不是还没吹干？','center'],
 ['刚洗完澡。','wide','me'],
 ['那你先去吹头发啊。','wide'],
 ['不是你说要教我练舞的吗ㅋㅋ','wide','me'],
 ['我又没让你湿着头发坐在这里。','wide'],
 ['好了，早点睡吧。','wide'],
 ['ending','wide']
];
let ch6Timer=null,ch6ClockTimer=null,ch6AutoTimer=null;
function ch6Is(){return CH6.active&&game.stage==='chapter6'}
function ch6Save(){try{localStorage.setItem(CH6_KEY,JSON.stringify(CH6))}catch(e){}}
function ch6Time(){const x=CH6.clock;return String(Math.floor(x/60)%24).padStart(2,'0')+':'+String(Math.floor(x%60)).padStart(2,'0')}
function ch6AddNote(id,title,text,dest){if(CH6.notes.some(n=>n.id===id))return;CH6.notes.push({id,title,text,dest});ch6Save();phoneReceiveNote(title,'ch6-note-'+id)}
function ch6Start(){if(!CH5.done){gameLocked();return}if(CH6.active&&ch6Is()){ch6Notes();return}Object.assign(CH6,{active:true,done:false,phase:'group',messages:[],group:[],woobin:[],wonjin:[],manager:[],notes:[],choice:null,choiceHelp:null,choiceReply:null,callStep:0,callStatus:'',callSeconds:0,muted:false,camera:true,flipped:false,speaker:true,shot:'wide',session:CH6.session+1,clock:20*60+35,queue:null,queueIndex:0,queueAfter:null,groupSeen:false,woobinSeen:false,managerSeen:false,wonjinSeen:false,endingRead:false});game.stage='chapter6';game.chapter2=true;game.chatBlocked=false;try{localStorage.setItem('idol_current_chapter_v1','6')}catch(e){}ch6Save();ch6AddNote('intro','第六章','明天下午和亨俊约好一起练习。\n\n先看看工作群里有没有新的安排。','group');ch6Notes();setTimeout(()=>ch6GroupQueue(),2200)}
function ch6Push(id,who,text){if(!ch6Is())return;const target=id==='hyeongjun'?CH6.messages:id==='group'?CH6.group:CH6[id]||[];target.push({who,text,time:ch6Time()});CH6.clock+=0.65;ch6Save();if(activeApp==='kkt'&&current==='appview'&&document.querySelector('#ch2-chat[data-id="'+id+'"]'))ch6Room(id,true);else if(who!=='me')phoneReceiveMessage(id,text)}
function ch6Queue(id,items,after){CH6.queue={id,items,after,index:0};ch6Save();ch6ResumeQueue()}
function ch6ResumeQueue(){if(!ch6Is()||!CH6.queue||ch6Timer)return;const token=CH6.session;function tick(){ch6Timer=null;if(!ch6Is()||token!==CH6.session||!CH6.queue)return;const q=CH6.queue;if(q.index>=q.items.length){CH6.queue=null;ch6Save();ch6After(q.after);return}const [who,text]=q.items[q.index++];if(who==='me'&&!phonePlayerCanAutoReply(q.id)){q.index--;ch6Timer=setTimeout(tick,450);return}ch6Push(q.id,who,text);ch6Save();ch6Timer=setTimeout(tick,phoneMessageDelay(text))}ch6Timer=setTimeout(tick,650)}
function ch6After(after){if(after==='group'){CH6.phase='woobin';ch6Save();ch6AddNote('forgot','明天的练习','LOUDER 的舞蹈……我好像完全不记得了。\n\n先问问宇瑸哥怎么办。','woobin')}
if(after==='woobin'){CH6.phase='manager';ch6Save();setTimeout(()=>ch6Queue('manager',[['them','宇瑸跟我说了。你身体没问题吧？'],['them','明天先恢复你自己的部分，不用急着完整走位。'],['them','失忆的事先不要对外说，活动安排我会协调。'],['them','如果不舒服就告诉我，别硬撑。'],['me','好的哥，我今晚先熟悉一下。'],['them','别练到太晚。']],'manager'),CH6_RELAY_DELAY)}
if(after==='manager'){CH6.phase='wonjin';ch6Save();ch6AddNote('practice','练习安排','最终版的走位好像和之前不一样。\n\n先看一下文字版练习安排，再问问元进。','practice')}
if(after==='wonjin'){CH6.phase='help';CH6.choice='help';ch6Save();if(activeApp==='kkt'&&document.querySelector('#ch2-chat[data-id="wonjin"]'))ch6Room('wonjin',true)}
if(after==='hyeongjun'){CH6.phase='callReady';ch6Save();CH6.choice='call';ch6Save();if(activeApp==='kkt'&&document.querySelector('#ch2-chat[data-id="hyeongjun"]'))ch6Room('hyeongjun',true)}
if(after==='aftercall'){CH6.phase='aftercall';ch6Save();CH6.choice='aftercall';if(activeApp==='kkt'&&document.querySelector('#ch2-chat[data-id="hyeongjun"]'))ch6Room('hyeongjun',true)}
if(after==='complete'){CH6.phase='ending';ch6Save();ch6AddNote('end','今天的事',CH6_END_NOTE,null);if(activeApp==='kkt'&&document.querySelector('#ch2-chat[data-id="hyeongjun"]'))ch6Room('hyeongjun',true)}}
function ch6GroupQueue(){if(!ch6Is()||CH6.phase!=='group'||CH6.group.length)return;ch6Queue('group',CH6_GROUP.map(([who,text])=>[who,text]),'group')}
function ch6GroupRead(){if(!ch6Is())return;CH6.groupSeen=true;ch6Save()}
function ch6WoobinStart(){if(!ch6Is()||CH6.phase!=='woobin'||CH6.woobin.length)return;ch6Queue('woobin',[['me','哥，你现在方便吗'],['them','怎么啦'],['me','我刚看到明天要练 LOUDER'],['me','但是我好像连舞都忘了'],['them','啊'],['them','这个确实有点麻烦'],['them','你先别急，我跟经纪人说一声'],['me','会不会影响大家啊'],['them','现在还来得及'],['them','你之前都练会了，重新熟悉应该比第一次学快'],['them','我先问问怎么安排']],'woobin')}
function ch6Practice(){activeApp='notes';wrap('LOUDER 练习安排','<div class="content story-prose ch6-note"><h2>LOUDER · 最终走位</h2><p>第二段：敏熙从舞台左侧绕行，亨俊向右移动后敏熙再进入中央位置。</p><p>副歌：先确认成员间距，避免与元进交叉。</p><p>明天在练习室按最终版本重新走位。</p><button class="choice" onclick="ch6WonjinStart()">去问咸元进</button></div>')}
function ch6WonjinStart(){if(!ch6Is()||CH6.phase!=='wonjin')return;ch6Room('wonjin');if(CH6.wonjin.length)return;ch6Queue('wonjin',[['them','听宇瑸哥说你把舞都忘了？'],['them','你现在连副歌都不记得了吗ㅋㅋ'],['me','你不要笑了……'],['them','没笑没笑'],['them','你自己别乱练啊，昨天还改过走位'],['them','亨俊最清楚最终版，你问他就行'],['me','……我问他？'],['them','怎么了'],['them','他又不会因为这个不教你'],['them','你们吵架归吵架，工作还是工作啊']],'wonjin')}
const CH6_CHOICES={help:['那我去问问他','还是先自己试试吧','能不能先让你教我一点'],call:['好，你打过来吧','我先把手机放好','现在接视频吗？'],aftercall:['找到了','我再找找','你怎么还记得这个ㅋㅋ'],ending:['今天真的谢谢你','其实今天能和你说话，我挺开心的','对不起，又给你添麻烦了']};
function ch6Choose(i){if(!ch6Is()||!CH6.choice)return;const key=CH6.choice;const choice=CH6_CHOICES[key]?.[i];if(!choice)return;CH6.choice=null;ch6Save();if(key==='help'){CH6.choiceHelp=i;ch6Push('wonjin','me',choice);const reply=i===0?'这不就好了嘛，你直接问他就行。':i===1?'行吧，不过别自己练到半夜。' :'我怎么教你啊，我自己都没完全学会呢';ch6Queue('wonjin',[['them',reply]],'helpDone');return}
if(key==='call'){ch6Push('hyeongjun','me',choice);CH6.phase='ringing';ch6Save();setTimeout(ch6Incoming,1500);return}
if(key==='aftercall'){ch6Push('hyeongjun','me',choice);ch6Queue('hyeongjun',i===2?[['them','你以前也老忘'],['them','我不记得谁记得ㅋㅋ'],['them','好了，快去睡吧'],['them','明天见'],['me','明天见']]:[['them','你上次把护膝落在练习室'],['them','还是我帮你拿回去的'],['me','我怎么什么都忘了ㅋㅋ'],['them','你以前也老忘'],['them','好了快睡吧'],['them','明天见'],['me','明天见']],'complete');return}
}
const CH6_RELAY_DELAY=6500;
const ch6OriginalAfter=ch6After;
ch6After=function(after){if(after==='helpDone'){CH6.phase='hyeongjun';ch6Save();setTimeout(()=>ch6Queue('hyeongjun',[['them','听说你连舞都忘了'],['them','现在在看哪个版本？'],['me','工作群里的那个'],['them','那个已经改过了'],['them','看最后一版的文字走位'],['me','第二段换位我还是有点看不懂'],['them','你从左边绕过去，不是直接往中间走'],['them','你直接走会撞到元进哥'],['me','那副歌开始的时候呢？'],['them','你在我后面'],['them','我往右边走，你再上来'],['me','我感觉我知道了'],['them','你每次都这么说ㅋㅋ'],['them','然后下一遍又走错'],['me','我以前这么笨吗'],['them','不是笨'],['them','你就是老想自己先弄明白'],['them','明明问一下就好了'],['them','打字太麻烦了'],['them','你现在方便接视频吗？']],'hyeongjun'),CH6_RELAY_DELAY);return}return ch6OriginalAfter(after)};
function ch6History(id){if(id==='hyeongjun'){const h=CH5.messages.map(m=>({who:m.who,text:m.text,time:m.time}));return h}if(id==='group')return CH5.legacyGroup||[];return []}
function ch6Room(id='hyeongjun',quiet=false){if(!ch6Is())return;activeApp='kkt';phoneReadRoom(id);if(id==='group')ch6GroupRead();const name=({hyeongjun:'宋亨俊',group:'CRAVITY 🐾',woobin:'徐宇瑸',wonjin:'咸元进',manager:'经纪人'})[id]||id;const arr=id==='hyeongjun'?CH6.messages:id==='group'?CH6.group:CH6[id]||[];const old=$('chatbody'),scroll=old?.scrollTop;let legacy='';if(id==='hyeongjun'){legacy=CH5.messages.map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||CH5.messages[i-1].who!==m.who)).join('')}else if(id==='group'){legacy=(CH4.group||[]).slice(-14).map((m,i)=>'<div class="ch3-group-entry"><span class="ch3-group-name">'+escapeHtml(m[0])+'</span>'+gameBubble(m[0]==='姜敏熙',m[1],m[2]||'昨天',false,false,true)+'</div>').join('')}
const rows=arr.map((m,i)=>id==='group'?'<div class="ch3-group-entry"><span class="ch3-group-name">'+escapeHtml(m.who)+'</span>'+gameBubble(false,m.text,m.time,false,false,i===0||arr[i-1].who!==m.who)+'</div>':gameBubble(m.who==='me',m.text,m.time,false,false,i===0||arr[i-1].who!==m.who)).join('');
let opts='';if(id==='wonjin'&&CH6.choice==='help'||id==='hyeongjun'&&['call','aftercall'].includes(CH6.choice)){opts='<div class="story-options">'+CH6_CHOICES[CH6.choice].map((t,i)=>'<button class="story-option" onclick="ch6Choose('+i+')">'+escapeHtml(t)+'</button>').join('')+'</div>'}else if(id==='hyeongjun'&&CH6.done)opts='<div class="story-end">当前对话已结束</div>';
wrap(name,'<div id="ch2-chat" data-id="'+id+'" class="ch3-kkt ch5-chat"><div class="chatbody" id="chatbody">'+legacy+'<div class="story-date">第六章 · 今天</div>'+rows+'</div><div class="story-send">'+opts+'</div></div>');const el=$('chatbody');if(el)el.scrollTop=quiet||scroll==null?el.scrollHeight:scroll;
if(id==='woobin')ch6WoobinStart()}
function ch6Friends(){if(!ch6Is())return;activeApp='kkt';const ids=['hyeongjun','group','woobin','manager','wonjin','serim'];const names={hyeongjun:'宋亨俊',group:'CRAVITY 🐾',woobin:'徐宇瑸',manager:'经纪人',wonjin:'咸元进',serim:'朴世琳'};wrap('KakaoTalk','<div class="content ch5-friends">'+ids.map(id=>{const a=id==='hyeongjun'?CH6.messages:id==='group'?CH6.group:CH6[id]||[];return '<div class="item" onclick="'+(id==='serim'?"ch5LegacyRoom('serim')":"ch6Room('"+id+"')")+'"><div class="avatar">'+names[id][0]+'</div><div class="itemmain"><div class="itemtitle">'+names[id]+'</div><div class="itemsub">'+escapeHtml(a.at(-1)?.text||'历史消息')+'</div></div>'+gameContactBadge(id)+'</div>'}).join('')+'</div>')}
function ch6Notes(){activeApp='notes';phoneReadRoom('notes');const jump='<div class="note" onclick="gameChapterMenu()"><strong>跳转至其他章节</strong></div>';let html=['<div class="note" onclick="gameReadNote()"><strong>第一章</strong></div>','<div class="note" onclick="ch2ReadInitialNote()"><strong>第二章</strong></div>','<div class="note" onclick="ch3Note(-1)"><strong>第三章</strong></div>','<div class="note" onclick="ch4ReadNote(0)"><strong>第四章</strong></div>','<div class="note" onclick="ch5IntroNote()"><strong>第五章</strong></div>'].join('');html+='<div class="note" onclick="ch6Note(\'intro\')"><strong>第六章 · LOUDER！</strong></div>';let count=0;for(const n of CH6.notes){if(n.id==='intro')continue;if(n.id==='end'){html+='<div class="note" onclick="ch6Note(\'end\')"><strong>第六章已结束</strong></div>';continue}html+='<div class="note" onclick="ch6Note(\''+n.id+'\')"><strong>新线索'+(++count)+'</strong></div>'}html+=jump;wrap('备忘录','<div class="content story-notes">'+html+'</div>')}
function ch6Note(id){const n=CH6.notes.find(x=>x.id===id);if(!n)return ch6Notes();activeApp='notes';phoneReadRoom('notes');const actions={group:['前往工作群',"ch6Room('group')"],woobin:['前往徐宇瑸的 KakaoTalk 私聊',"ch6Room('woobin')"],practice:['查看练习安排','ch6Practice()']};const a=actions[n.dest];if(id==='end'){CH6.endingRead=true;CH6.done=true;CH6.phase='complete';ch6Save()}wrap(n.title,'<div class="content story-prose ch6-note"><h2>'+escapeHtml(n.title)+'</h2><p>'+escapeHtml(n.text)+'</p>'+(a?'<button class="choice" onclick="'+a[1]+'">'+a[0]+'</button>':'<button class="choice" onclick="ch6Notes()">返回备忘录</button>')+(id==='end'?'<div class="story-end">第六章已结束</div>':'')+'</div>')}
function ch6Incoming(){if(!ch6Is())return;CH6.callStatus='ringing';ch6Save();ch6RenderCall()}
function ch6RenderCall(){if(!ch6Is())return;activeApp='facetime';const existing=document.getElementById('ch6-facetime');if(existing)existing.remove();const root=document.createElement('div');root.id='ch6-facetime';root.className='ch6-facetime';document.getElementById('phone').appendChild(root);ch6CallPaint()}
function ch6CallPaint(){const root=document.getElementById('ch6-facetime');if(!root)return;const ringing=CH6.callStatus==='ringing';const line=CH6_CALL[Math.min(CH6.callStep,CH6_CALL.length-1)];if(!root.querySelector('.ch6-stage'))root.innerHTML='<div class="ch6-stage"><img id="ch6-room-image" src="assets/IMG_8409.jpeg" alt="练习室画面"><div class="ch6-dim"></div><div class="ch6-call-top"><strong>宋亨俊</strong><small>FaceTime 视频 · <span id="ch6-clock">'+(ringing?'来电中':'00:00')+'</span></small></div><div class="ch6-self"><img src="assets/IMG_2765.jpeg" alt="姜敏熙">'+(!CH6.camera?'<div class="ch6-camera-off">摄像头已关闭</div>':'')+'</div><div class="ch6-caption" id="ch6-caption">'+(ringing?'宋亨俊正在呼叫……':line&&line[0]!=='position'&&line[0]!=='ending'?escapeHtml((line[2]==='me'?'姜敏熙：':'宋亨俊：')+line[0]):'')+'</div></div><div class="ch6-controls">'+(ringing?'<button onclick="ch6Decline()">拒绝</button><button class="ch6-answer" onclick="ch6Answer()">接听</button>':'<button onclick="ch6Toggle(\'muted\')">'+(CH6.muted?'取消静音':'静音')+'</button><button onclick="ch6Toggle(\'speaker\')">扬声器</button><button onclick="ch6Toggle(\'flipped\')">翻转</button><button onclick="ch6Toggle(\'camera\')">'+(CH6.camera?'关闭摄像头':'开启摄像头')+'</button><button class="ch6-hang" onclick="ch6Hangup()">挂断</button>')+'</div>'+(ringing?'':'<div class="ch6-next">'+(line?.[0]==='position'?'<p>亨俊：你记得自己站哪边吗？</p><button onclick="ch6Position(0)">舞台左侧</button><button onclick="ch6Position(1)">中间</button><button onclick="ch6Position(2)">舞台右侧</button>':line?.[0]==='ending'?'<p>挂断前，你想说什么？</p>'+CH6_CHOICES.ending.map((t,i)=>'<button onclick="ch6CallEnding('+i+')">'+escapeHtml(t)+'</button>').join(''):'<button onclick="ch6CallNext()">继续通话</button>')+'</div>');ch6ApplyShot();if(!ringing){const caption=document.getElementById('ch6-caption');if(caption&&line&&line[0]!=='position'&&line[0]!=='ending')caption.textContent=(line[2]==='me'?'姜敏熙：':'宋亨俊：')+line[0]}}
function ch6ApplyShot(){const img=document.getElementById('ch6-room-image');if(!img)return;const presets={wide:[1.3,23,0],far:[1.12,12,0],left:[1.5,43,0],center:[1.42,27,0],shake:[1.5,-12,3],down:[1.35,32,-7]};const p=presets[CH6.shot]||presets.wide;img.style.transform='translate('+p[1]+'%,'+p[2]+'%) scale('+p[0]+')'}
function ch6Answer(){if(CH6.callStatus!=='ringing')return;CH6.callStatus='connected';CH6.callStep=0;CH6.callSeconds=0;CH6.clock=21*60+27;ch6Save();ch6CallPaint();ch6ScheduleAuto();clearInterval(ch6ClockTimer);ch6ClockTimer=setInterval(()=>{if(!ch6Is()||CH6.callStatus!=='connected')return;CH6.callSeconds++;const s=CH6.callSeconds;const el=document.getElementById('ch6-clock');if(el)el.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},1000)}
function ch6CallNext(){if(CH6.callStatus!=='connected')return;CH6.callStep=Math.min(CH6.callStep+1,CH6_CALL.length-1);CH6.shot=CH6_CALL[CH6.callStep][1];ch6Save();ch6CallPaint();ch6ScheduleAuto()}
function ch6Position(i){CH6.position=i;CH6.callStep++;CH6.shot='center';ch6Save();ch6CallPaint();const cap=document.getElementById('ch6-caption');if(cap)cap.textContent=i===0?'宋亨俊：对，先在左边。等我往右走，你再过来。':i===1?'宋亨俊：不是，一开始还没到中间。你先在左边。':'宋亨俊：右边是我，你过来我们就撞一起了ㅋㅋ';clearTimeout(ch6AutoTimer);ch6AutoTimer=setTimeout(()=>ch6CallNext(),3200)}
function ch6ScheduleAuto(){clearTimeout(ch6AutoTimer);if(!ch6Is()||CH6.callStatus!=='connected')return;const line=CH6_CALL[CH6.callStep];if(!line||line[0]==='position'||line[0]==='ending')return;const session=CH6.session;ch6AutoTimer=setTimeout(()=>{if(ch6Is()&&CH6.session===session&&CH6.callStatus==='connected')ch6CallNext()},Math.max(1800,phoneMessageDelay(line[0])+350))}
function ch6Toggle(key){CH6[key]=!CH6[key];ch6Save();ch6CallPaint()}
function ch6CallEnding(i){CH6.choiceReply=i;CH6.callStep=CH6_CALL.length-1;ch6Save();const lines=['知道啦。明天别迟到就行。','……嗯。我也是。早点休息。','你又来了。我又没说你麻烦。'];const cap=document.getElementById('ch6-caption');if(cap)cap.textContent='宋亨俊：'+lines[i];const next=document.querySelector('.ch6-next');if(next)next.innerHTML='';clearTimeout(ch6AutoTimer);ch6AutoTimer=setTimeout(()=>ch6Hangup(),Math.max(2600,phoneMessageDelay(lines[i])))}
function ch6Decline(){clearTimeout(ch6AutoTimer);document.getElementById('ch6-facetime')?.remove();CH6.callStatus='declined';ch6Save();activeApp='kkt';ch6Push('hyeongjun','them','不方便吗？');ch6Room('hyeongjun');setTimeout(()=>{if(ch6Is()&&CH6.callStatus==='declined'){CH6.callStatus='ringing';ch6Save();ch6Incoming()}},6000)}
function ch6Hangup(){if(!ch6Is())return;clearTimeout(ch6AutoTimer);document.getElementById('ch6-facetime')?.remove();clearInterval(ch6ClockTimer);const finished=CH6.callStep>=CH6_CALL.length-1&&CH6.choiceReply!==null;CH6.callStatus=finished?'finished':'interrupted';ch6Save();activeApp='kkt';ch6Room('hyeongjun');if(finished){CH6.clock=21*60+58;setTimeout(()=>ch6Queue('hyeongjun',[['them','明天记得穿那双黑色运动鞋'],['them','还有你的护膝']],'aftercall'),1800)}else{ch6Push('hyeongjun','them','刚刚断了吗？');setTimeout(()=>{if(ch6Is()&&CH6.callStatus==='interrupted'){CH6.callStatus='ringing';ch6Incoming()}},5000)}}
const ch6PrevNotes=gameNotes;gameNotes=function(){if(ch6Is())return ch6Notes();return ch6PrevNotes()};
const ch6PrevOpen=openApp;openApp=function(k){if(ch6Is()){if(k==='kkt')return ch6Friends();if(k==='notes')return ch6Notes()}return ch6PrevOpen(k)};
const ch6PrevUnlock=gameUnlock;gameUnlock=function(k){if(ch6Is())return ['kkt','notes','photos','calendar','ig','phone','delivery','files','x','youtube','spotify'].includes(k);return ch6PrevUnlock(k)};
const ch6PrevFriends=gameFriends;gameFriends=function(){if(ch6Is())return ch6Friends();return ch6PrevFriends()};
const ch6PrevChat=gameChat;gameChat=function(id){if(ch6Is()&&['hyeongjun','group','woobin','wonjin','manager'].includes(id))return ch6Room(id);return ch6PrevChat(id)};
const ch6PrevPhoneOpen=phoneOpenRoom;phoneOpenRoom=function(id){if(ch6Is()){if(id==='notes')return ch6Notes();if(typeof id==='string'&&id.startsWith('ch6-note-'))return ch6Note(id.slice(9));if(['hyeongjun','group','woobin','wonjin','manager'].includes(id))return ch6Room(id)}return ch6PrevPhoneOpen(id)};
/* Preserve chapter-five ending and expose the next chapter there. */
const ch6PrevCh5Note=ch5Note;
ch5Note=function(id){const result=ch6PrevCh5Note(id);if(id==='end'&&CH5.done){const root=document.querySelector('.ch5-note');if(root&&!root.querySelector('[onclick="ch6Start()"]'))root.insertAdjacentHTML('beforeend','<button class="choice" onclick="ch6Start()">进入第六章</button>')}return result};
try{const saved=JSON.parse(localStorage.getItem(CH6_KEY)||'null');if(saved?.active)Object.assign(CH6,saved)}catch(e){}
