/* Chapter 10 — 以后都告诉你. Uses existing phone, KakaoTalk, Notes and ending contracts. */
const CH10_KEY='idol_ch10_v1';
const CH10={active:false,done:false,phase:'',clock:610,day:1,session:0,messages:[],notes:[],queue:null,giftViewed:false,giftClaimed:false,photoViewed:false,photoSaved:false,photoNotice:false,choices:{},endingRead:false};
const CH10_PHOTO='assets/chapter10/award-memory.jpg'; // reserved asset path; missing file gets a truthful placeholder
const CH10_OPEN='昨晚回来以后睡得还不错。\n\n今天没什么特别要做的事。先看看手机吧。';
const CH10_END='今天又和亨俊一起回去了。\n\n以前觉得有些话不用说他也会懂。现在发现，说出来也没什么难的。\n\n想见面就说想见面，想一起回去就问他要不要等我。\n\n他今天真的在楼下等我。\n\n好像又回到了很熟悉的日子。\n\n不过这次，我会记得把想说的话告诉他。';
let ch10Timer=null;
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
 ch10Queue([['them','起了没'],['them','我刚刚在楼下看到一只猫'],['them','跟你起床的时候好像ㅋㅋ'],['me','哪里像了'],['them','都是一脸不想理人的样子'],['me','我早上有那么凶吗'],['them','还好吧'],['them','反正我习惯了ㅋㅋ'],['me','你才是早上最难叫醒的那个吧'],['them','那你明天叫我啊']],'morningChoice');
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
 if(after==='gift'){CH10.phase='gift';CH10.clock=625;ch10Push('them','不是有人念叨了好几次吗ㅋㅋ','gift')}
 if(after==='giftChoice')CH10.phase='giftChoice';
 if(after==='giftEnd'){CH10.phase='photoInvite';ch10AddNote('hint','下午的事','下午问问亨俊，有没有看到群里整理的获奖照片。',false)}
 if(after==='photoChoice')CH10.phase='photoChoice';
 if(after==='photoReady'){CH10.phase='photoReady';ch10AddNote('photo','获奖纪念照','纪念照整理好了。可以在 PHOTOISM 的“我的照片”里查看。',false);ch10PhotoNotice()}
 if(after==='nightChoice')CH10.phase='nightChoice';
 if(after==='nightEnd'){CH10.phase='homeReady';ch10AddNote('tomorrow','明天','明天结束工作后，再看看亨俊有没有空。',false)}
 if(after==='homeChoice')CH10.phase='homeChoice';
 if(after==='end'){CH10.phase='complete';CH10.done=true;CH10.queue=null;ch10AddNote('end','第十章已结束',CH10_END,false);storyEndingNotify(10)}
 ch10Save();if(phoneRoomOpen('hyeongjun'))ch10Room(true);
}
function ch10Options(labels,fn){return '<div class="story-options">'+labels.map((t,i)=>'<button class="story-option" onclick="'+fn+'('+i+')">'+escapeHtml(t)+'</button>').join('')+'</div>'}
function ch10ChooseMorning(i){
 if(CH10.phase!=='morningChoice')return;
 CH10.choices.morning=i;CH10.phase='morningReply';ch10Push('me',['好啊 你可别赖床','叫醒你有什么奖励'][i]);
 const reply=i===0?[['them','你先起得来再说ㅋㅋ']]:[['them','你想要什么'],['them','先说好不能太过分ㅋㅋ']];
 ch10Queue([...reply,['me','等我想好了再告诉你'],['them','行'],['them','我先去忙了 晚点聊'],['me','嗯 晚点见']],'gift');
}
function ch10GiftCard(){
 return '<button class="ch10-gift-card" onclick="ch10Gift()" aria-label="查看KakaoTalk礼物"><span class="ch10-gift-symbol">🎁</span><span><strong>收到一份礼物</strong><small>草莓蛋糕兑换券 · 1份</small><small>不是有人念叨了好几次吗ㅋㅋ</small><em>查看礼物 ›</em></span></button>';
}
function ch10Gift(){
 if(!ch10Is())return;CH10.giftViewed=true;ch10Save();activeApp='kkt';
 wrap('KakaoTalk · 送礼','<div class="ch10-gift-page"><button class="ch10-back" onclick="ch10Room()">‹ 返回聊天</button><div class="ch10-gift-hero">🍓<span>草莓蛋糕</span></div><h2>草莓蛋糕兑换券</h2><p>1份 · 虚构礼物演示</p><div class="ch10-gift-note"><strong>宋亨俊 送给你</strong><p>不是有人念叨了好几次吗ㅋㅋ</p></div><p class="ch10-muted">仅供游戏体验，不涉及真实支付、兑换或订单。</p><button class="ch10-primary" onclick="ch10ClaimGift()">'+(CH10.giftClaimed?'已领取 · 返回聊天':'领取礼物')+'</button><button class="ch10-secondary" onclick="ch10Room()">返回聊天</button></div>');
 if(CH10.phase==='gift')ch10GiftDialogue();
}
function ch10ClaimGift(){if(!CH10.giftClaimed){CH10.giftClaimed=true;ch10Save()}ch10Room()}
function ch10GiftDialogue(){
 if(CH10.phase!=='gift')return;CH10.phase='giftChat';ch10Queue([['me','你怎么突然给我送蛋糕'],['them','不是有人上次一直说想吃吗'],['me','我哪有一直说'],['them','好好好'],['them','就说了三遍ㅋㅋ'],['me','你还数了啊'],['them','没办法 某人太吵了'],['me','那你别买给我啊ㅋㅋ'],['them','行啊 那你还我'],['me','不还'],['them','ㅋㅋㅋㅋ 我就知道']],'giftChoice');
}
function ch10ChooseGift(i){
 if(CH10.phase!=='giftChoice')return;CH10.phase='giftReply';CH10.choices.gift=i;
 ch10Push('me',['谢啦 宝宝','下次我也给你买','其实我想跟你一起吃'][i]);
 const replies=[[['them','突然这么乖？'],['them','蛋糕有这么好吃吗ㅋㅋ']],[['them','我要挑贵的ㅋㅋ'],['them','开玩笑的']],[['them','那你早说啊ㅋㅋ'],['them','我陪你去']]][i];
 const ending=i===2?[['me','不过这张券我先收下了'],['them','本来就是给你的'],['me','说好了啊'],['them','好'],['them','到时候别又说吃不下ㅋㅋ'],['me','你管我']]:[['me','不过这张券我先收下了'],['them','本来就是给你的'],['me','那下次陪我去店里吃'],['them','好'],['them','到时候别又说吃不下ㅋㅋ'],['me','你管我']];
 ch10Queue([...replies,...ending],'giftEnd');
}
function ch10Invite(){
 if(!ch10Is()||CH10.phase!=='photoInvite')return;
 CH10.phase='photoChat';CH10.clock=820;ch10Save();
 ch10Queue([['them','你看到群里发的照片了吗'],['me','看了ㅋㅋ'],['me','那张你拿奖杯的表情真的很好笑'],['them','你还说我'],['them','你笑得比我还夸张ㅋㅋ'],['me','拿一位了还不许我高兴啊'],['them','当然可以'],['them','我也很开心'],['me','不过我们俩的合照好像不多'],['them','不是拍了好几张吗'],['me','那些都是跟奖杯拍的ㅋㅋ'],['them','奖杯也算第三个人？ㅋㅋ']],'photoChoice');ch10Room();
}
function ch10ChoosePhoto(i){
 if(CH10.phase!=='photoChoice')return;CH10.phase='photoReply';CH10.choices.photo=i;ch10Push('me',['那下次我们再拍人生四格','我想留一张只有我们的','先把今天那几张好好存起来'][i]);
 const responses=[[['them','好啊'],['them','这次你负责想动作ㅋㅋ']],[['them','行'],['them','等有空去拍']],[['them','可以'],['them','我让他们发原图给你']]][i];
 ch10Queue([...responses,['me','先把今天的照片发我吧'],['them','等整理好发你'],['them','下次再去拍一张新的'],['me','说好了'],['them','嗯']],'photoReady');
}
function ch10PhotoNotice(){
 if(CH10.photoNotice)return;CH10.photoNotice=true;CH10.day=2;CH10.clock=1040;ch10Save();
 phoneBanner('photoism','PHOTOISM','获奖纪念照片已整理好，点击查看。','photoism');
}
function ch10PhotoImage(){
 return '<div class="ch10-photo-image"><img src="'+CH10_PHOTO+'" alt="获奖纪念拼贴" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="ch10-photo-missing" style="display:none"><strong>获奖纪念照片</strong><span>正式图片尚未接入仓库</span><small>已保留照片记录与保存功能</small></div></div>';
}
function ch10Photoism(){
 if(!ch10Is())return;activeApp='photoism';
 wrap('PHOTOISM','<div class="ch10-photo-app"><div class="ch10-photo-brand">PHOTOISM</div><h2>我的照片</h2><button class="ch10-photo-record" onclick="ch10PhotoDetail()"><span class="ch10-record-thumb">▧</span><span><strong>获奖纪念照 · 四图拼贴</strong><small>领取时间 · 第2日 17:20</small><small>图片标示日期 · 2025.06.21</small></span><b>›</b></button><p class="ch10-muted">这里展示游戏内收藏的纪念照片，并非真实 PHOTOISM 云端订单。</p></div>');
}
function ch10PhotoDetail(){
 if(!ch10Is())return;activeApp='photoism';CH10.photoViewed=true;ch10Save();
 wrap('获奖纪念照','<div class="ch10-photo-detail"><button class="ch10-back" onclick="ch10Photoism()">‹ 我的照片</button>'+ch10PhotoImage()+'<p class="ch10-photo-caption">获奖纪念照 · 2025.06.21</p><p class="ch10-muted">领取时间：第2日 17:20 · 来源：PHOTOISM纪念收藏（游戏模拟）</p><button class="ch10-primary" onclick="ch10SavePhoto()">'+(CH10.photoSaved?'已保存到相册':'保存到相册')+'</button><button class="ch10-secondary" onclick="ch10PhotoZoom()">放大查看</button><button class="ch10-secondary" onclick="ch10Photoism()">返回我的照片</button><button class="ch10-secondary" onclick="ch10BeginNight()">继续今天的聊天</button></div>');
}
function ch10PhotoZoom(){
 if(!ch10Is())return;activeApp='photoism';wrap('查看照片','<div class="ch10-zoom"><button class="ch10-back" onclick="ch10PhotoDetail()">‹ 返回详情</button>'+ch10PhotoImage()+'</div>');
}
function ch10SavePhoto(){CH10.photoSaved=true;ch10Save();ch10PhotoDetail()}
function ch10Album(){if(!ch10Is())return;activeApp='photos';wrap('相册','<div class="content ch10-album"><h2>PHOTOISM</h2><p>我的获奖纪念照片</p>'+(CH10.photoSaved?'<button onclick="ch10AlbumDetail()" class="ch10-album-tile">'+ch10PhotoImage()+'</button>':'<p>还没有保存照片。可以从 PHOTOISM 领取记录保存。</p>')+'<button class="choice" onclick="ch10Photoism()">打开 PHOTOISM</button></div>')}
function ch10AlbumDetail(){activeApp='photos';wrap('照片','<div class="ch10-photo-detail">'+ch10PhotoImage()+'<p class="ch10-photo-caption">2025.06.21 · 获奖纪念照</p><button class="ch10-secondary" onclick="ch10Album()">返回相册</button></div>')}
function ch10BeginNight(){
 if(!ch10Is()||!CH10.photoViewed||CH10.phase!=='photoReady')return;
 CH10.phase='nightChat';CH10.clock=1230;ch10Save();
 ch10Queue([['them','照片看了吗'],['me','看了ㅋㅋ'],['me','你看右下角'],['me','获奖纪念照','photo'],['them','干嘛ㅋㅋ'],['me','你笑得眼睛都没了'],['them','你不也是'],['me','但是看起来真的很开心'],['them','当然开心啊'],['them','拿一位了诶'],['me','嗯'],['me','而且那天你一直在我旁边'],['them','因为你一直拉着我拍照ㅋㅋ']],'nightChoice');ch10Room();
}
function ch10ChooseNight(i){
 if(CH10.phase!=='nightChoice')return;CH10.phase='nightReply';CH10.choices.night=i;ch10Push('me',['下次拿奖还要一起拍','那下次不带奖杯拍','这张我想一直留着'][i]);
 const replies=[[['them','当然'],['them','奖杯可别忘了拿ㅋㅋ']],[['them','怎么 奖杯失宠了？ㅋㅋ'],['them','行啊 就我们两个']],[['them','留着啊'],['them','我那边也存了']]][i];
 ch10Queue([...replies,['me','今天又看了好几遍'],['them','这么喜欢？'],['me','喜欢啊'],['them','ㅋㅋㅋ 知道了'],['them','早点睡 明天还有事'],['me','你也是'],['them','晚安'],['me','晚安 宝宝'],['them','……ㅋㅋ 晚安']],'nightEnd');
}
function ch10BeginHome(){
 if(!ch10Is()||CH10.phase!=='homeReady')return;CH10.phase='homeChat';CH10.day=3;CH10.clock=1217;ch10Save();
 ch10Queue([['them','你还在公司？'],['me','嗯 刚结束'],['them','我也差不多了'],['me','那等我一下'],['them','干嘛ㅋㅋ'],['me','想跟你一起回去'],['them','哦～'],['them','今天怎么这么黏人ㅋㅋ']],'homeChoice');ch10Room();
}
function ch10ChooseHome(i){
 if(CH10.phase!=='homeChoice')return;CH10.phase='homeReply';CH10.choices.home=i;ch10Push('me',['不行吗','因为想见你','那你愿不愿意等我'][i]);
 const replies=[[['them','谁说不行了']],[['them','……知道啦ㅋㅋ']],[['them','愿意啊'],['them','我又没说不等']]][i];
 ch10Queue([...replies,['them','我在楼下等你'],['me','马上来 ♡'],['them','慢慢来 不用跑']],'end');
}
function ch10OldHistory(){
 const prev=typeof ch9BubbleHistory==='function'?ch9BubbleHistory():'';
 const nine=(CH9.hj||[]).map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH9.hj[i-1]||{}).who!==m.who)).join('');
 return prev+'<div class="story-date">第九章 · 聚餐当天</div>'+nine;
}
function ch10Room(quiet=false){
 if(!ch10Is())return;activeApp='kkt';phoneReadRoom('hyeongjun');
 const rows=CH10.messages.map((m,i)=>{
  if(m.type==='gift')return '<div class="bubbleline"><div class="ch10-gift-wrap">'+ch10GiftCard()+'</div><span class="chatmeta">'+escapeHtml(m.time)+'</span></div>';
  if(m.type==='photo')return '<div class="bubbleline me"><button class="ch10-chat-photo" onclick="ch10PhotoDetail()">'+ch10PhotoImage()+'<span>获奖纪念照 · 查看</span></button></div>';
  return gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH10.messages[i-1]||{}).who!==m.who);
 }).join('');
 let opts='';
 const p=CH10.phase;
 if(p==='morningChoice')opts=ch10Options(['好啊 你可别赖床','叫醒你有什么奖励'],'ch10ChooseMorning');
 if(p==='gift')opts='<button class="story-option" onclick="ch10Gift()">查看礼物</button>';
 if(p==='giftChoice')opts=ch10Options(['谢啦 宝宝','下次我也给你买','其实我想跟你一起吃'],'ch10ChooseGift');
 if(p==='photoInvite')opts='<button class="story-option" onclick="ch10Invite()">问问亨俊获奖照片的事</button>';
 if(p==='photoReady')opts='<button class="story-option" onclick="ch10Photoism()">查看 PHOTOISM 照片</button>';
 if(p==='nightChoice')opts=ch10Options(['下次拿奖还要一起拍','那下次不带奖杯拍','这张我想一直留着'],'ch10ChooseNight');
 if(p==='homeReady')opts='<button class="story-option" onclick="ch10BeginHome()">查看下班后的消息</button>';
 if(p==='homeChoice')opts=ch10Options(['不行吗','因为想见你','那你愿不愿意等我'],'ch10ChooseHome');
 if(CH10.done)opts='<div class="story-end">当前对话已结束</div>';
 wrap('宋亨俊','<div id="ch2-chat" data-id="hyeongjun" class="ch3-kkt ch5-chat ch9-chat ch10-chat"><div class="chatbody" id="chatbody">'+ch10OldHistory()+'<div class="story-date">第十章 · 以后都告诉你</div>'+rows+'</div><div class="story-send">'+opts+'</div></div>');
 const el=document.getElementById('chatbody');if(el)el.scrollTop=el.scrollHeight;
}
function ch10Friends(){
 if(!ch10Is())return;activeApp='kkt';phoneReadRoom('hyeongjun');
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
 const action=id==='intro'?'<button class="choice" onclick="ch10Room()">查看宋亨俊的聊天</button>':id==='hint'?'<button class="choice" onclick="ch10Invite()">打开聊天</button>':id==='photo'?'<button class="choice" onclick="ch10Photoism()">打开 PHOTOISM</button>':id==='tomorrow'?'<button class="choice" onclick="ch10BeginHome()">查看消息</button>':'';
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
const ch10PrevEndNext=storyEndingNext;storyEndingNext=function(n){if(n===10)return ch10Start();return ch10PrevEndNext(n)};
const ch10PrevJump=storyChapterJump;storyChapterJump=function(n){if(Number(n)!==10){CH10.active=false;CH10.session++;clearTimeout(ch10Timer);ch10Timer=null;return ch10PrevJump(n)}if(!CH9.done){gameLocked();return}CH10.active=false;CH10.session++;clearTimeout(ch10Timer);ch10Timer=null;ch10Start()};
const ch10PrevEndAttach=storyEndingAttach;storyEndingAttach=function(n){ch10PrevEndAttach(n);if(n===9){const root=document.querySelector('.story-ending-unified');if(root){const p=[...root.querySelectorAll('p')].find(x=>x.textContent.includes('后续章节尚未开放'));if(p)p.outerHTML='<button class="choice" onclick="storyEndingNext(10)">前往第十章</button>'}}};
const ch10PrevEndView=storyEndingView;storyEndingView=function(n){if(n===10){if(!CH10.done)return;activeApp='notes';phoneReadRoom('notes');CH10.endingRead=true;ch10Save();wrap('第十章 · 完结','<div class="content story-prose story-ending"><h2>第十章已结束</h2><p>以后都告诉你</p><p>当前回忆进度：10/10</p><div class="story-progress"><span style="width:100%"></span></div><p>所有回忆都找回来了。但属于他们的故事，还会继续。</p><button class="choice" onclick="ch10Notes()">继续使用手机</button></div>');return}return ch10PrevEndView(n)};
const ch10PrevEndNormalize=storyEndingNormalizeNotes;storyEndingNormalizeNotes=function(){if(ch10Is())return;return ch10PrevEndNormalize()};
const ch10PrevOpenAppForPhoto=ch10Photoism;
icons.photoism=iconArt('#111','<rect x="9" y="17" width="46" height="31" rx="4" fill="#fff"/><text x="32" y="36" text-anchor="middle" font-size="12" font-weight="800" fill="#111">PHOTO</text><text x="32" y="44" text-anchor="middle" font-size="8" fill="#111">ISM</text>');
if(!apps.some(x=>x[1]==='photoism'))apps.push(['PHOTOISM','photoism']);
document.getElementById('apps2').innerHTML=apps.slice(8).map(a=>appBtn(...a)).join('');
try{const saved=JSON.parse(localStorage.getItem(CH10_KEY)||'null');if(saved?.active)Object.assign(CH10,saved)}catch(e){}
window.addEventListener('load',()=>{if(localStorage.getItem('idol_current_chapter_v1')==='10'&&CH10.active){game.stage='chapter10';game.chapter2=true;game.chatBlocked=false;setTimeout(ch10Resume,950)}});
