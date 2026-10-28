/* Chapter 2 — 我们不是一直很好吗？ Fictional interactive story. */
const CH2={
 phase:'dm',dmSeen:false,dmSeenAt:0,dmLastMessageIndex:-1,postSeen:false,commentSeen:false,igCommentIds:new Set(),igNote:false,igNoteRead:false,dmRead:false,dmScrollReady:false,dmSent:false,photosNote:false,photosSeen:new Set(),woobinStep:0,serimStep:0,fileSeen:false,earringSeen:false,woobinFinal:0,done:false,chatFinished:{woobin:false,serim:false},unread:{woobin:0,serim:0},messages:{woobin:[],serim:[]},timers:[],session:0
};
const CH2_DM=[
 ['them','姜敏熙'],['them','我的黑色外套呢'],['me','不知道啊'],['them','你再说一遍？'],['me','在我这里ㅋㅋ'],['them','我就知道'],['me','那怎么办'],['them','明天穿过来'],['me','不要'],['them','为什么？'],['me','因为有你的味道'],['them','……'],['them','你真是疯了'],['them','这种话别在外面说'],['me','所以这里可以说？'],['them','你真的很烦ㅋㅋㅋ'],
 ['them','今天练习完一起回去？'],['me','你不是说要跟元进哥吃饭吗'],['them','可以吃完再回去啊'],['me','那我等你'],['them','不许不吃饭'],['me','知道啦'],['them','我会检查的']
];
const CH2_FILE=[
 ['定型喷雾','全员','已确认'],['发夹套装','造型组','已确认'],['银色耳夹','宋亨俊','舞台造型'],['耳返固定配件','全员','已确认'],['补妆用品','造型组','已确认'],
 ['发带','朴世琳','舞台造型'],['发胶','Allen','个人造型'],['发饰夹','具廷谟','舞台造型'],['领带夹','姜敏熙','舞台造型'],['胸针','徐宇瑸','舞台造型'],['手链','咸元进','舞台造型'],['发箍','金太英','舞台造型'],['装饰戒指','安性珉','舞台造型']
];
function ch2Active(){return !!game.chapter2}
function ch2Timer(fn,ms){const session=CH2.session;const id=setTimeout(()=>{if(session===CH2.session&&ch2Active())fn()},ms);CH2.timers.push(id)}
function ch2Notify(id){const node=$('ch2-chat');if(activeApp==='kkt'&&current==='appview'&&node&&node.dataset.id===id){ch2Chat(id);return}CH2.unread[id]=(CH2.unread[id]||0)+1;phoneReceiveMessage(id,CH2.messages[id].at(-1)?.[1]||'新消息')}
function ch2Append(id,who,text,delay){ch2Timer(()=>{CH2.messages[id].push([who,text]);if(who==='them')ch2Notify(id);else if(activeApp==='kkt'&&$('ch2-chat')&&$('ch2-chat').dataset.id===id)ch2Chat(id)},delay)}
function ch2Sequence(id,lines,after){const session=CH2.session;let i=0;function next(){if(session!==CH2.session||!ch2Active())return;if(i>=lines.length){if(after)ch2Timer(after,700);return}const [who,text]=lines[i];const deliver=()=>{if(session!==CH2.session||!ch2Active())return;CH2.messages[id].push([who,text]);if(who==='them')ch2Notify(id);else if(phonePlayerCanAutoReply(id))ch2Chat(id);i++;ch2Timer(next,phoneMessageDelay(lines[i]?.[1]||'',i===0))};if(who==='me'&&!phonePlayerCanAutoReply(id)){phoneWaitForPlayerRoom(id,deliver);return}deliver()}ch2Timer(next,phoneMessageDelay(lines[0]?.[1]||'',true))}
function ch2Start(){CH2.session++;CH2.phase='dm';CH2.dmSeen=false;CH2.dmSeenAt=0;CH2.dmLastMessageIndex=-1;CH2.postSeen=false;CH2.commentSeen=false;CH2.igCommentIds=new Set();CH2.igNote=false;CH2.igNoteRead=false;CH2.dmRead=false;CH2.dmScrollReady=false;CH2.dmSent=false;CH2.photosNote=false;CH2.photosSeen=new Set();CH2.woobinStep=0;CH2.serimStep=0;CH2.fileSeen=false;CH2.earringSeen=false;CH2.woobinFinal=0;CH2.done=false;CH2.chatFinished={woobin:false,serim:false};CH2.messages={woobin:[],serim:[]};CH2.unread={woobin:0,serim:0};const existing=igChats.hyeongjun||[];const oldChapter2=existing.filter(m=>m.ch2Script);const earlier=existing.filter(m=>!m.ch2Script);igChats.hyeongjun=[...CH2_DM.map(([from,text],i)=>({from,text,time:i===0?'几周前':i===16?'两周前':'',ch2Script:true})),...earlier];igSave();game.chapter2=true;game.stage='chapter2';game.chapterEnd=true;game.phoneNoteRead=true;game.xExited=true;game.chatBlocked=true;game.callDone=true;game.unread.notes=0;gameBadge();activeApp='notes';ch2ReadInitialNote()}
function ch2OpenInstagram(){instagram('chat','hyeongjun')}
function ch2SeePost(i){if(!ch2Active()||CH2.phase!=='ig')return;CH2.postSeen=true}
function ch2SeeComments(i){
 if(!ch2Active()||CH2.phase!=='ig')return;
 CH2.igCommentIds.add(i);
 if(CH2.igCommentIds.size>=3&&!CH2.photosNote){
  CH2.photosNote=true;
  ch2Timer(()=>gameNotify('notes','有新的线索'),800);
 }
}
function ch2ReadInitialNote(){activeApp='notes';wrap('第二章 · 新线索','<div class="content story-prose"><p>亨俊在 KakaoTalk 上不肯理我……或许 Instagram 还能联系到他。先给他发一条私信吧。</p><button class="choice" onclick="ch2OpenInstagram()">前往宋亨俊的 Instagram 私信</button></div>')}
function ch2ReadIGNote(){
 CH2.igNoteRead=true;
 activeApp='notes';wrap('新线索1','<div class="content story-prose"><p>亨俊已经看过消息了，却还是没有回复。也许他现在还不想跟我说话……先去看看最近的 Instagram 吧，说不定能找到一点以前的线索。</p><button class="choice" onclick="instagram(\'profile\',\'minhee\')">前往姜敏熙的 Instagram 主页</button></div>');
}
function ch2IGChat(id){if(!ch2Active()||id!=='hyeongjun')return;CH2.dmRead=true}
function ch2IGSend(id,text){
 if(!ch2Active()||id!=='hyeongjun'||CH2.phase!=='dm'&&CH2.phase!=='ig'&&CH2.phase!=='photos'||!text)return false;
 const index=(igChats.hyeongjun||[]).length-1;
 CH2.dmLastMessageIndex=index;
 CH2.dmSeen=false;
 CH2.dmSeenAt=Date.now()+1800;
 ch2Timer(()=>{
  if(CH2.dmLastMessageIndex!==index)return;
  CH2.dmSeen=true;
  if(activeApp==='ig'&&igScreen==='chat'&&igTarget==='hyeongjun')igChat('hyeongjun');
 },1800);
 if(!CH2.dmSent){
  CH2.dmSent=true;
  ch2Timer(()=>{if(CH2.phase==='dm'){CH2.phase='ig';CH2.igNote=true;gameNotify('notes','有新的线索')}},3000);
 }
 return true;
}
function ch2AlbumSeen(i){if(!ch2Active()||CH2.phase!=='photos')return;if([0,1,2].includes(i)){CH2.photosSeen.add(i);if(CH2.photosSeen.size>=2){CH2.phase='woobin';ch2Timer(()=>{CH2.woobinStep=1;ch2Sequence('woobin',[['them','敏熙啊'],['them','你现在怎么样了？'],['them','元进说你今天给亨俊打电话了？']],()=>{CH2.woobinStep=2;ch2RefreshChat('woobin')})},2000)}}}
function ch2Notes(){return (!CH2.igNote?'<div class="note" onclick="ch2ReadInitialNote()"><strong>第二章 · 新线索</strong></div>':'')+(CH2.igNote?'<div class="note" onclick="ch2ReadIGNote()"><strong>新线索 · 以前的评论</strong></div>':'')+(CH2.photosNote?'<div class="note" onclick="ch2ReadPhotoNote()"><strong>新线索 · 以前的照片</strong></div>':'')+(CH2.done?'<div class="note" onclick="ch2Ending()"><strong>第二章已结束</strong></div>':'')}
function ch2ReadPhotoNote(){if(CH2.phase==='ig'&&CH2.photosNote)CH2.phase='photos';activeApp='notes';wrap('以前的照片','<div class="content story-prose"><p>以前的我和亨俊好像留下了很多共同回忆。那些照片会不会让我想起些什么？去相册看看吧。</p><button class="choice" onclick="openApp(\'photos\')">前往相册</button></div>')}
function ch2Friends(){
 activeApp='kkt';
 const entries=[['hyeongjun','宋亨俊'],['wonjin','咸元进']];
 if(CH2.messages.woobin.length||CH2.woobinStep>0)entries.push(['woobin','徐宇瑸']);
 if(CH2.messages.serim.length||CH2.serimStep>0)entries.push(['serim','朴世琳']);
 wrap('KakaoTalk','<div class="content">'+entries.map(([id,name])=>{
  const isNew=id==='woobin'||id==='serim';
  const history=isNew?CH2.messages[id]:null;
  const preview=isNew?(history?.at(-1)?.[1]||'新消息'):id==='hyeongjun'?(game.chatBlocked?'消息未能送达':CH1.morning.at(-1)):game.wonjinReplyDelivered?'去ig碰碰运气吧，说不定还能私信他':'历史对话';
  return '<div class="item" onclick="'+(isNew?'ch2Chat(\''+id+'\')':'gameChat(\''+id+'\')')+'"><div class="avatar">'+name.slice(0,1)+'</div><div class="itemmain"><div class="itemtitle">'+name+'</div><div class="itemsub">'+escapeHtml(preview)+'</div></div>'+(isNew&&CH2.unread[id]?'<span class="story-contact-unread">'+CH2.unread[id]+'</span>':'')+'</div>';
 }).join('')+'</div>');
}
function ch2RefreshChat(id){const node=$('ch2-chat');if(node&&node.dataset.id===id&&activeApp==='kkt')ch2Chat(id)}
function ch2Choices(options,callback){return '<div class="story-options">'+options.map((v,i)=>'<button class="story-option" onclick="'+callback+'('+i+')">'+escapeHtml(v)+'</button>').join('')+'</div>'}
function ch2Chat(id){if(!ch2Active()||!['woobin','serim'].includes(id)||!CH2.messages[id]?.length)return;activeApp='kkt';CH2.unread[id]=0;phoneReadRoom(id);const name=id==='woobin'?'徐宇瑸':'朴世琳';const messages=CH2.messages[id];const rows=messages.map(([who,t],i)=>who==='file'?'<div class="ch2-attachment" onclick="ch2File()"><strong>▤ '+escapeHtml(t)+'</strong><small>朴世琳发送的文件 · 点击预览</small></div>':gameBubble(who==='me',t,phoneTimeAt(850,i),false,false,i===0||messages[i-1][0]!==who)).join('');let action='';if(id==='woobin'){
 if(CH2.phase==='woobin'&&CH2.woobinStep===2)action=ch2Choices(['哥，我有件事想跟你说。','哥，我现在真的有点不知道该怎么办。'],'ch2WoobinChoice');
 if(CH2.phase==='woobin'&&CH2.woobinStep===3)action=ch2Choices(['我好像失忆了。'],'ch2Confess');
 if(CH2.phase==='woobin'&&CH2.woobinStep===4)action=ch2Choices(['好，但是先不要告诉外面的人。','可以，哥你帮我说吧。'],'ch2Consent');
 if(CH2.phase==='final'&&CH2.woobinFinal===2)action=ch2Choices(['……他怎么说？'],'ch2Ask');
 if(CH2.phase==='final'&&CH2.woobinFinal===4)action=ch2Choices(['就这些？'],'ch2Just');
 if(CH2.phase==='final'&&CH2.woobinFinal===6)action=ch2Choices(['哥，我真的很想他。','我现在连怎么跟他说话都不知道。'],'ch2FinalChoice');
 }else if(CH2.phase==='serim'&&CH2.serimStep===2&&CH2.earringSeen)action=ch2Choices(['哥，亨俊的耳夹……我是不是碰过？'],'ch2EarringReply');
 if(!action){
  const finished=CH2.chatFinished[id]===true;
  if(finished)action='<div class="story-end">当前对话已结束</div>';
 }
  wrap(name,'<div id="ch2-chat" data-id="'+id+'"><div class="chatbody" id="chatbody">'+rows+'</div><div class="story-send">'+action+'</div></div>');$('chatbody').scrollTop=$('chatbody').scrollHeight}
function ch2Player(id,text){CH2.messages[id].push(['me',text]);ch2Chat(id)}
function ch2WoobinChoice(i){if(CH2.woobinStep!==2)return;CH2.woobinStep=0;ch2Player('woobin',['哥，我有件事想跟你说。','哥，我现在真的有点不知道该怎么办。'][i]);ch2Sequence('woobin',[['them','嗯？怎么了？'],['them','你说，我听着。']],()=>{CH2.woobinStep=3;if($('ch2-chat'))ch2Chat('woobin')})}
function ch2Confess(){if(CH2.woobinStep!==3)return;CH2.woobinStep=0;ch2Player('woobin','我好像失忆了。');ch2Sequence('woobin',[['them','？'],['them','姜敏熙'],['them','你认真的吗？'],['me','真的。'],['me','我醒过来就在医院了。'],['me','之前发生的事情我好多都不记得了。'],['them','等一下'],['them','你现在还在医院吗？'],['them','医生怎么说？'],['me','检查过了，还需要观察。'],['them','那你怎么不早点告诉我？'],['them','我还以为你只是跟亨俊闹别扭，不想理人。'],['them','你吓死我了。'],['me','哥，我真的不记得我们为什么吵架了。'],['me','我翻了聊天记录。'],['me','但我还是不知道到底发生了什么。'],['them','……'],['them','你们这次确实吵得挺厉害的。'],['them','不过你先别急着去找亨俊。'],['them','你现在最重要的是好好休息。'],['me','可是他把我拉黑了。'],['them','我知道。'],['them','他这几天也不好受。'],['them','但我觉得他应该比谁都希望你没事。'],['them','失忆的事，经纪人知道吗？'],['me','还没跟大家说。'],['them','那不能一直瞒着。'],['them','我先跟世琳哥和经纪人说一下，好吗？']],()=>{CH2.woobinStep=4;if($('ch2-chat'))ch2Chat('woobin')})}
function ch2Consent(i){if(CH2.woobinStep!==4)return;CH2.woobinStep=0;ch2Player('woobin',['好，但是先不要告诉外面的人。','可以，哥你帮我说吧。'][i]);ch2Sequence('woobin',[['them','知道了。'],['them','放心，大家会替你保密的。'],['them','你别一个人扛着。']],()=>{CH2.phase='serim';CH2.serimStep=1;ch2Timer(()=>ch2Sequence('serim',[['them','敏熙啊'],['them','宇瑸刚刚跟我说了。'],['them','你真的有一段时间的事情想不起来了？'],['me','嗯，哥。'],['me','最近发生的事我好多都不记得了。'],['them','先别担心活动的事。'],['them','我会跟经纪人商量的。'],['them','你先把身体养好。'],['them','对了'],['them','你不是说最近的事情都不记得了吗？'],['them','我这里有化妆组之前发来的工作资料。'],['them','你看看能不能想起点什么。']],()=>{CH2.messages.serim.push(['file','舞台造型用品_采买统计.xlsx']);CH2.serimStep=2;if($('ch2-chat')&&$('ch2-chat').dataset.id==='serim')ch2Chat('serim');else ch2Notify('serim')}),7000)})}
function ch2File(){CH2.fileSeen=true;activeApp='files';wrap('舞台造型用品_采买统计.xlsx','<div class="content ch2-file"><p class="ch2-file-hint">已打开最近的工作文件。</p><div class="ch2-sheet-scroll"><table><thead><tr><th>物品</th><th>对象</th><th>备注</th></tr></thead><tbody>'+CH2_FILE.map((r,i)=>'<tr onclick="ch2SheetRow('+i+')" class="'+(i===2?'ch2-earring':'')+'">'+r.map(v=>'<td>'+escapeHtml(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><button class="choice" onclick="ch2Chat(\'serim\')">返回聊天</button></div>')}
function ch2SheetRow(i){if(i===2){CH2.earringSeen=true;CH2.serimStep=2;const row=document.querySelector('.ch2-earring');if(row)row.classList.add('ch2-visited')}}
function ch2EarringReply(){if(!CH2.earringSeen||CH2.serimStep!==2)return;CH2.serimStep=0;ch2Player('serim','哥，亨俊的耳夹……我是不是碰过？');ch2Sequence('serim',[['them','嗯？'],['them','你想起来了？'],['me','没有。'],['me','只是觉得有点熟悉。'],['them','那先别勉强自己想。'],['them','等你状态好一点再说。'],['them','这件事先不要让外面知道。'],['them','我会跟其他成员说清楚。'],['them','活动的事也会先跟经纪人协调。'],['me','谢谢哥。'],['them','跟我还说什么谢谢。'],['them','好好休息。']],()=>{CH2.chatFinished.serim=true;if($('ch2-chat')&&$('ch2-chat').dataset.id==='serim')ch2Chat('serim');CH2.phase='final';CH2.woobinFinal=1;ch2Timer(()=>ch2Sequence('woobin',[['them','敏熙'],['them','我刚刚跟亨俊说了。']],()=>{CH2.woobinFinal=2;if($('ch2-chat')&&$('ch2-chat').dataset.id==='woobin')ch2Chat('woobin')}),1500)})}
function ch2Ask(){if(CH2.woobinFinal!==2)return;CH2.woobinFinal=0;ch2Player('woobin','……他怎么说？');ch2Sequence('woobin',[['them','他问你有没有好好吃饭。'],['them','还问你头疼不疼。']],()=>{CH2.woobinFinal=4;if($('ch2-chat'))ch2Chat('woobin')})}
function ch2Just(){if(CH2.woobinFinal!==4)return;CH2.woobinFinal=0;ch2Player('woobin','就这些？');ch2Sequence('woobin',[['them','嗯。'],['them','不过他问了三遍。'],['me','……'],['them','你看。'],['them','他也不是不关心你。'],['them','你们两个啊，真不知道该说什么好。']],()=>{CH2.woobinFinal=6;if($('ch2-chat'))ch2Chat('woobin')})}
function ch2FinalChoice(i){if(CH2.woobinFinal!==6)return;CH2.woobinFinal=0;ch2Player('woobin',['哥，我真的很想他。','我现在连怎么跟他说话都不知道。'][i]);ch2Sequence('woobin',i===0?[['them','那就等你好一点，再好好跟他说。'],['them','先睡一会儿吧。'],['them','有什么事就给我发消息。']]:[['them','不用急着现在就说。'],['them','等你想清楚了再找他。'],['them','先睡一会儿吧。'],['them','有什么事就给我发消息。']],()=>{CH2.chatFinished.woobin=true;CH2.done=true;CH2.phase='end';if($('ch2-chat')&&$('ch2-chat').dataset.id==='woobin')ch2Chat('woobin');ch2Timer(()=>gameNotify('notes','第二章已结束'),3000)})}
function ch2Ending(){wrap('第二章 · 完结','<div class="content story-prose story-ending"><h2>第二章已结束</h2><p>当前回忆进度：2/10</p><p>下一章：所有人都知道</p><div class="story-progress"><span style="width:20%"></span></div><p>第三章《所有人都知道》已经开放。</p><button class="choice" onclick="ch3Start()">进入第三章</button><button class="choice" onclick="gameNotes()">返回备忘录</button></div>')}
/* Integrate without altering Chapter 1 dialogue or existing photo resources. */
const ch2OldStart=gameStartChapter2;gameStartChapter2=function(){if(!game.chapterEnd)return;ch2Start()};
const ch2OldJump=gameJumpChapter;gameJumpChapter=function(n){if(n===2){ch2Start();return}CH2.session++;ch2OldJump(n)};
// Notes list is rendered centrally after all chapter scripts load.
const ch2OldFriends=gameFriends;gameFriends=function(){if(ch2Active())return ch2Friends();return ch2OldFriends()};
const ch2OldChat=gameChat;gameChat=function(id){if(ch2Active()&&(id==='woobin'||id==='serim'))return ch2Chat(id);return ch2OldChat(id)};
const ch2OldPost=igPost;igPost=function(i,back){ch2SeePost(i);return ch2OldPost(i,back)};
const ch2OldComments=igComments;igComments=function(i){ch2SeeComments(i);return ch2OldComments(i)};
const ch2OldIGChat=igChat;igChat=function(id){ch2IGChat(id);ch2OldIGChat(id);if(ch2Active()&&id==='hyeongjun'&&CH2.dmSent&&CH2.phase!=='woobin'&&CH2.phase!=='serim'&&CH2.phase!=='final'&&CH2.phase!=='done'){const msgs=igChats.hyeongjun||[];const lastIndex=CH2.dmLastMessageIndex;const bubble=document.querySelectorAll('.ig-chat .ig-bubble')[lastIndex];if(bubble&&msgs[lastIndex]?.from==='me'){const marker=document.createElement('div');marker.className='ch3-read';marker.textContent=CH2.dmSeen?'已查看':'已发送';bubble.insertAdjacentElement('afterend',marker)}}};
function ch2CheckDMScroll(){if(!ch2Active()||CH2.phase!=='dm'||CH2.dmSent)return;const el=$('ig-scroll');if(el&&el.scrollTop+el.clientHeight>=el.scrollHeight-18)CH2.dmScrollReady=true}
function ch2SendDM(i){/* 第二章现在使用 Instagram 原生自由输入框。 */}
const ch2OldAlbumPhoto=igAlbumPhoto;igAlbumPhoto=function(i){ch2OldAlbumPhoto(i);ch2AlbumSeen(igAlbumIndex)};
const ch2OldIGBase=igBase;igBase=function(header,content,bottom){ch2OldIGBase(header,content,bottom);if(ch2Active()&&CH2.phase==='ig'&&igScreen==='profile'){const inbox=document.querySelector('.ig-header button:last-child');if(inbox)inbox.classList.add('ch2-inbox-unread')}};
const ch2OldChapterMenu=gameChapterMenu;gameChapterMenu=function(){ch2OldChapterMenu()};
const ch2OldStartFromMenu=gameStartChapter2FromMenu;gameStartChapter2FromMenu=function(){ch2Start()};

/* Chapter 2's dual-photo comments use the approved dialogue, not the generic previews. */
const ch2OldAllComments=igAllComments;
igAllComments=function(i){
 const rows=ch2OldAllComments(i);
 if(i===6&&ch2Active()){
  return [{name:'宋亨俊',text:'拍了十几张你就选这一张？',member:true,replyTo:null},{name:'姜敏熙',text:'因为这张你最好看啊ㅋㅋ',member:true,replyTo:'宋亨俊'},{name:'宋亨俊',text:'其他张不好看吗？',member:true,replyTo:'姜敏熙'},{name:'姜敏熙',text:'都好看都好看',member:true,replyTo:'宋亨俊'},{name:'徐宇瑸',text:'你们两个能不能先把练习室的灯关了',member:true,replyTo:null},...rows.filter(c=>!c.member)];
 }
 return rows;
};

/* First opening Instagram in Chapter 2 goes to Minhee's own profile. */
const ch2OldOpenApp=openApp;
openApp=function(k){if(k==='ig'&&ch2Active()&&CH2.phase==='ig'){activeApp='ig';instagram('profile');return}return ch2OldOpenApp(k)};
