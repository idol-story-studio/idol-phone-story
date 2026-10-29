/* Chapter 7 — 有些话，放进歌里. Fictional fan narrative; shared phone systems preserved. */
const CH7_KEY='idol_ch7_v1';
const CH7={active:false,done:false,phase:'',messages:[],notes:[],clock:18*60+42,session:0,adShown:false,explored:false,shareHint:false,song:null,replyA:null,replyB:null,queue:null,endingRead:false};
const MELON_SONGS=[
{id:'love-me',title:'LOVE ME',album:'sonorous',tone:'direct'},
{id:'love-me-like',title:'Love Me Like You Do',album:'ReDeFINE',tone:'warm'},
{id:'give-love',title:'Give Me Your Love',album:'HIDEOUT: BE OUR VOICE',tone:'warm'},
{id:'love-or-die',title:'Love or Die',album:'EVERSHINE',tone:'direct'},
{id:'a-to-z',title:'A to Z',album:'MASTER : PIECE',tone:'sweet'},
{id:'now-or-never',title:'Now or Never',album:'FIND THE ORBIT',tone:'direct'},
{id:'lemonade',title:'Lemonade Fever',album:'Dare to Crave : Epilogue',tone:'sweet'},
{id:'adrenaline',title:'Adrenaline',album:'LIBERTY : IN OUR COSMOS',tone:'sweet'},
{id:'lucky',title:'Lucky Charm',album:'sonorous',tone:'sweet'},
{id:'spring',title:'Spring, with You',album:'ReDeFINE',tone:'warm'},
{id:'love-fire',title:'LOVE FIRE',album:'SUN SEEKER',tone:'warm'},
{id:'call-my-name',title:'Call my name',album:'HIDEOUT: BE OUR VOICE',tone:'warm'},
{id:'louder',title:'LOUDER',album:'sonorous',tone:'energy'},
{id:'pulse',title:'Pulse',album:'sonorous',tone:'energy'},
{id:'party-rock',title:'PARTY ROCK',album:'NEW WAVE',tone:'energy'},
{id:'groovy',title:'Groovy',album:'MASTER : PIECE',tone:'energy'},
{id:'ready',title:'Ready or Not',album:'SUN SEEKER',tone:'energy'}
];
const MELON_LISTS=[
{id:'heart',name:'♡',desc:'最近反复听的歌',ids:['love-me','love-me-like','give-love','love-or-die','a-to-z','now-or-never','lemonade','adrenaline','lucky','spring','love-fire','call-my-name']},
{id:'night',name:'夜里听的歌',desc:'睡前随便放一首',ids:['spring','give-love','love-me-like','a-to-z','love-fire','lucky']},
{id:'practice',name:'练习的时候',desc:'今天也要记住走位',ids:['louder','pulse','adrenaline','now-or-never','party-rock','groovy','ready']}
];
let melonView='home',melonList='heart',melonSong=null,ch7Timer=null,ch7ExploreTimer=null,ch7AdTimer=null;
function ch7Is(){return CH7.active&&game.stage==='chapter7'}
function ch7Save(){try{localStorage.setItem(CH7_KEY,JSON.stringify(CH7))}catch(e){}}
function ch7Time(){let m=Math.floor(CH7.clock);return String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function ch7Song(id){return MELON_SONGS.find(s=>s.id===id)}
function ch7MelonUrl(s){return 'https://www.melon.com/search/total/index.htm?q='+encodeURIComponent('CRAVITY '+s.title)}
function ch7OpenSong(id){const s=ch7Song(id);if(s)window.open(ch7MelonUrl(s),'_blank','noopener,noreferrer')}
function ch7NoteAdd(id,title,text,dest){if(CH7.notes.some(n=>n.id===id))return;CH7.notes.push({id,title,text,dest});ch7Save();phoneReceiveNote(title,'ch7-note-'+id)}
function ch7Start(){
 if(!CH6.done){gameLocked();return}
 if(CH7.active){game.stage='chapter7';ch7Notes();return}
 Object.assign(CH7,{active:true,done:false,phase:'chat',messages:[],notes:[],clock:18*60+42,session:CH7.session+1,adShown:false,explored:false,shareHint:false,song:null,replyA:null,replyB:null,queue:null,endingRead:false});
 game.stage='chapter7';game.chapter2=true;game.chatBlocked=false;ch7Save();
 try{localStorage.setItem('idol_current_chapter_v1','7')}catch(e){}
 ch7NoteAdd('intro','第七章','今天练习结束得比想象中早。\n\n看看亨俊有没有发消息吧。','chat');
 ch7Notes();setTimeout(()=>{if(ch7Is())ch7Queue([['them','你到家了吗。'],['me','刚到。'],['them','今天下午练习的时候。'],['them','你是不是一直没怎么喝水。'],['me','有喝啦。'],['them','你那瓶水明明一直放在窗边ㅋㅋ'],['me','你怎么连这个都注意到了。'],['them','因为你后来嗓子都哑了。'],['them','晚上记得喝点温水。'],['me','知道啦，你也早点回去。'],['them','嗯，我快到了。']],'introDone')},1400);
}
function ch7Push(who,text,type='text',songId=null){if(!ch7Is())return;CH7.messages.push({who,text,type,songId,time:ch7Time()});CH7.clock+=0.6;ch7Save();if(activeApp==='kkt'&&current==='appview'&&document.querySelector('#ch2-chat[data-id="hyeongjun"]'))ch7Room(true);else if(who==='them')phoneReceiveMessage('hyeongjun',type==='song'?'分享了一首歌曲':text)}
function ch7Queue(items,after){CH7.queue={items,index:0,after};ch7Save();ch7Resume()}
function ch7Resume(){if(!ch7Is()||!CH7.queue||ch7Timer)return;const token=CH7.session;const step=()=>{ch7Timer=null;if(!ch7Is()||token!==CH7.session||!CH7.queue)return;const q=CH7.queue;if(q.index>=q.items.length){CH7.queue=null;ch7Save();ch7After(q.after);return}const [who,text]=q.items[q.index];if(who==='me'&&!phonePlayerCanAutoReply('hyeongjun')){ch7Timer=setTimeout(step,350);return}q.index++;ch7Push(who,text);ch7Timer=setTimeout(step,typeof phoneMessageDelay==='function'?phoneMessageDelay(text):850)};ch7Timer=setTimeout(step,500)}
function ch7After(a){
 if(a==='introDone'){CH7.phase='adPending';ch7Save();ch7ScheduleAd()}
 if(a==='received'){CH7.phase='replyA';ch7Save();if(phoneRoomOpen('hyeongjun'))ch7Room(true)}
 if(a==='listen'){CH7.phase='listening';ch7Save();setTimeout(()=>{if(ch7Is()&&CH7.phase==='listening')ch7Queue([['them','听完了。'],['them','你以前也经常突然给我发歌。'],['them','有时候半夜发一首。'],['them','第二天还会问我听了没有ㅋㅋ'],['me','我以前经常这样吗。'],['them','嗯。'],['them','不过今天这首还挺好听的。'],['them','所以今天怎么突然想发给我？']],'finalQuestion')},12500)}
 if(a==='finalQuestion'){CH7.phase='replyB';ch7Save();if(phoneRoomOpen('hyeongjun'))ch7Room(true)}
 if(a==='end'){CH7.phase='ending';ch7Save();ch7NoteAdd('end','第七章已结束','今天给亨俊发了一首歌。\n\n按下发送之前，其实犹豫了很久。\n\n他真的听了，还认真回复了我。\n\n虽然以前的事还是想不起来，但今天这首歌，是现在的我自己想分享给他的。\n\n好像还挺开心的。',null);if(phoneRoomOpen('hyeongjun'))ch7Room(true)}
}
function ch7ScheduleAd(){if(CH7.adShown||!ch7Is()||ch7AdTimer)return;const token=CH7.session;ch7AdTimer=setTimeout(()=>{ch7AdTimer=null;if(!ch7Is()||token!==CH7.session||CH7.adShown)return;if(activeApp==='kkt'&&document.querySelector('#ch2-chat[data-id="hyeongjun"]')){ch7ScheduleAd();return}CH7.adShown=true;CH7.phase='explore';ch7Save();ch7MelonAd()},4500)}
function ch7MelonAd(){
 const item={app:'melon',message:'Melon：CRAVITY 新专辑《sonorous》上线啦，一起来听听看吧？',target:'melon',time:ch7Time()};
 if(typeof storyNotifications!=='undefined'){storyNotifications.unshift(item);storyRefreshNotificationCenter()}
 if(typeof ding==='function')ding();
 if(current==='lock'||current==='pass'){gameLockBanner('melon',item.message);return}
 const t=$('toast');if(!t)return;t.className='toast story-notification';t.innerHTML='<div class="story-notification-icon" style="background:#03c75a;color:white">m</div><div class="story-notification-text"><div class="story-notification-app">Melon <span>现在</span></div><div class="story-notification-body">CRAVITY 新专辑《sonorous》上线啦，一起来听听看吧？</div></div>';t.style.display='flex';t.onclick=()=>{clearTimeout(toastTimer);t.style.display='none';melonOpen('home')};clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.style.display='none',8500)
}
function melonOpen(view='home',id){activeApp='melon';melonView=view;if(view==='list'&&id)melonList=id;if(view==='song'&&id)melonSong=id;melonRender();if(ch7Is()&&!CH7.explored){CH7.explored=true;ch7Save();const token=CH7.session;clearTimeout(ch7ExploreTimer);ch7ExploreTimer=setTimeout(()=>{if(ch7Is()&&token===CH7.session&&!CH7.shareHint){CH7.shareHint=true;ch7Save();ch7NoteAdd('share','想聊些什么呢','想跟亨俊聊聊天，又不知道该从什么话题开始。\n\n我收藏的歌单里好像有不少喜欢的歌。\n\n挑一首发给他听听吧。','melon')}},6500)}}
function melonArt(id){const colors=['#d5f1de','#d6e8f7','#f5dfeb','#e9e3f8','#f5e6d5'];const n=MELON_SONGS.findIndex(s=>s.id===id);return '<span class="melon-art" style="background:'+colors[(n+colors.length)%colors.length]+'">♫</span>'}
function melonTrack(id){const s=ch7Song(id);if(!s)return '';return '<div class="melon-track"><button class="melon-track-main" onclick="melonOpen(\'song\',\''+id+'\')">'+melonArt(id)+'<span><strong>'+escapeHtml(s.title)+'</strong><small>CRAVITY · '+escapeHtml(s.album)+'</small></span></button><button class="melon-dots" onclick="melonSharePreview(\''+id+'\')" aria-label="分享 '+escapeHtml(s.title)+'">•••</button></div>'}
function melonRender(){
 const tabs='<nav class="melon-tabs"><button onclick="melonOpen(\'home\')">⌂<small>首页</small></button><button onclick="melonOpen(\'library\')">♡<small>我的音乐</small></button><button onclick="melonOpen(\'list\',\'heart\')">☷<small>歌单</small></button></nav>';
 let body='';
 if(melonView==='home'){body='<div class="melon-hero"><small>新专辑推荐 · CRAVITY</small><h2>sonorous</h2><p>新的声音，新的共鸣</p><button onclick="melonOpen(\'album\')">查看专辑 ›</button></div><h3>最近听过</h3>'+['love-me','louder','spring'].map(melonTrack).join('')+'<h3>我的歌单</h3>'+melonLists()}
 else if(melonView==='library'){body='<h2>我的音乐</h2><p class="melon-muted">姜敏熙的音乐资料库</p><h3>收藏歌单</h3>'+melonLists()+'<h3>最近收藏</h3>'+MELON_LISTS[0].ids.slice(0,4).map(melonTrack).join('')}
 else if(melonView==='album'){body='<button class="melon-return" onclick="melonOpen(\'home\')">‹ 返回</button><div class="melon-hero"><small>CRAVITY · 2026.09.30</small><h2>sonorous</h2><p>迷你专辑 · 7 首</p></div>'+['pulse','louder','lucky','love-me'].map(melonTrack).join('')+'<p class="melon-muted">其他收录曲目可通过官方 Melon 专辑页查看。</p><button class="melon-action" onclick="window.open(\'https://www.melon.com/album/detail.htm?albumId=14599499\',\'_blank\',\'noopener,noreferrer\')">在 Melon 查看完整专辑 ↗</button>'}
 else if(melonView==='list'){const l=MELON_LISTS.find(x=>x.id===melonList)||MELON_LISTS[0];body='<button class="melon-return" onclick="melonOpen(\'library\')">‹ 我的音乐</button><div class="melon-list-head"><div class="melon-cover">♫</div><h2>'+escapeHtml(l.name)+'</h2><p>'+escapeHtml(l.desc)+'</p><small>姜敏熙 · '+l.ids.length+' 首</small></div>'+l.ids.map(melonTrack).join('')}
 else if(melonView==='song'){const s=ch7Song(melonSong);if(s)body='<button class="melon-return" onclick="melonOpen(\'list\',\''+melonList+'\')">‹ 返回歌单</button><div class="melon-song-hero">'+melonArt(s.id)+'<h2>'+escapeHtml(s.title)+'</h2><p>CRAVITY</p><small>'+escapeHtml(s.album)+'</small></div><button class="melon-action" onclick="ch7OpenSong(\''+s.id+'\')">在真实 Melon 页面查看与播放 ↗</button><button class="melon-action secondary" onclick="melonSharePreview(\''+s.id+'\')">分享歌曲</button><p class="melon-muted">外部播放可能需要 Melon 登录或订阅；本游戏不内嵌版权音乐。</p>'}
 else if(melonView==='share'){const s=ch7Song(melonSong);body='<button class="melon-return" onclick="melonOpen(\'song\',\''+melonSong+'\')">‹ 返回歌曲</button><h2>分享歌曲</h2><div class="melon-share-card">'+melonArt(s.id)+'<strong>'+escapeHtml(s.title)+'</strong><small>CRAVITY · Melon</small></div><h3>发送至 KakaoTalk</h3><button class="melon-contact" onclick="melonShareConfirm()">◉　宋亨俊 <span>›</span></button><p class="melon-muted">发送后音乐卡片会保留在聊天历史中，并可点击打开真实歌曲页面。</p>'}
 wrap('Melon','<div class="melon-app"><div class="melon-header"><span class="melon-logo">melon</span><span>⌕　☰</span></div><div class="melon-scroll">'+body+'</div>'+tabs+'</div>')
}
function melonLists(){return MELON_LISTS.map(l=>'<button class="melon-playlist" onclick="melonOpen(\'list\',\''+l.id+'\')"><span class="melon-list-art">♫</span><span><strong>'+escapeHtml(l.name)+'</strong><small>'+escapeHtml(l.desc)+' · '+l.ids.length+' 首</small></span><b>›</b></button>').join('')}
function melonSharePreview(id){melonSong=id;melonOpen('share')}
function melonShareConfirm(){
 if(!ch7Is()){melonOpen('song',melonSong);return}
 if(!CH7.shareHint){ch7NoteAdd('share','想聊些什么呢','想跟亨俊聊聊天，又不知道该从什么话题开始。\n\n我收藏的歌单里好像有不少喜欢的歌。\n\n挑一首发给他听听吧。','melon');CH7.shareHint=true}
 if(CH7.song){ch7Push('me',ch7Song(melonSong).title,'song',melonSong);ch7Room();return}
 CH7.song=melonSong;CH7.phase='sent';ch7Save();ch7Push('me',ch7Song(melonSong).title,'song',melonSong);ch7Room();
 setTimeout(()=>{if(ch7Is()&&CH7.phase==='sent')ch7Queue([['them','？'],['them','怎么突然给我发歌ㅋㅋ'],['them','你最近在听这个？']],'received')},4500)
}
function ch7SongCard(id){const s=ch7Song(id);return s?'<button class="ch7-kkt-song" onclick="ch7OpenSong(\''+id+'\')">'+melonArt(id)+'<span><strong>'+escapeHtml(s.title)+'</strong><small>CRAVITY</small><small>▶ Melon · 点击查看歌曲</small></span></button>':''}
function ch7Room(quiet=false){if(!ch7Is())return;activeApp='kkt';phoneReadRoom('hyeongjun');const historic4=(CH4.lines||[]).map((m,i)=>m.from==='recalled'?'<div class="story-date">消息已删除</div>':gameBubble(m.from==='me',m.text,m.time,false,false,i===0||(CH4.lines[i-1]||{}).from!==m.from)).join('');const historic5=(CH5.messages||[]).map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||(CH5.messages[i-1]||{}).who!==m.who)).join('');const historic6=CH6.messages.map((m,i)=>gameBubble(m.who==='me',m.text,m.time,false,false,i===0||CH6.messages[i-1].who!==m.who)).join('');const prev=historic4+'<div class="story-date">第五章</div>'+historic5+'<div class="story-date">第六章</div>'+historic6;const old=$('chatbody'),scroll=old?.scrollTop;const rows=CH7.messages.map((m,i)=>m.type==='song'?'<div class="bubbleline me">'+ch7SongCard(m.songId)+'<span class="chatmeta">'+escapeHtml(m.time)+'</span></div>':gameBubble(m.who==='me',m.text,m.time,false,false,i===0||CH7.messages[i-1].who!==m.who)).join('');
 let opts='';if(CH7.phase==='replyA')opts='<div class="story-options">'+['嗯，觉得挺好听的','听的时候突然想到你了','因为想让你听听'].map((x,i)=>'<button class="story-option" onclick="ch7ChooseA('+i+')">'+x+'</button>').join('')+'</div>';else if(CH7.phase==='replyB')opts='<div class="story-options">'+['没有特别的意思，就是想分享给你','觉得你可能会喜欢，所以想让你听','就是想你了，不行吗ㅋㅋ'].map((x,i)=>'<button class="story-option" onclick="ch7ChooseB('+i+')">'+x+'</button>').join('')+'</div>';else if(CH7.phase==='ending'||CH7.done)opts='<div class="story-end">当前对话已结束</div>';
 wrap('宋亨俊','<div id="ch2-chat" data-id="hyeongjun" class="ch3-kkt ch5-chat"><div class="chatbody" id="chatbody">'+prev+'<div class="story-date">第七章 · 今天</div>'+rows+'</div><div class="story-send">'+opts+'</div></div>');const el=$('chatbody');if(el)el.scrollTop=quiet||scroll==null?el.scrollHeight:scroll;
}
function ch7ChooseA(i){if(CH7.phase!=='replyA')return;CH7.replyA=i;CH7.phase='replying';ch7Save();const t=['嗯，觉得挺好听的','听的时候突然想到你了','因为想让你听听'][i];ch7Push('me',t);const replies=[['them','那我听听ㅋㅋ'],['them','……为什么突然想到我。'],['them','算了，我先听听。']];ch7Queue([replies[i]],'listen')}
function ch7ChooseB(i){if(CH7.phase!=='replyB')return;CH7.replyB=i;CH7.phase='replying';ch7Save();ch7Push('me',['没有特别的意思，就是想分享给你','觉得你可能会喜欢，所以想让你听','就是想你了，不行吗ㅋㅋ'][i]);const a=[['them','这样啊。'],['them','嗯，我听了。'],['them','下次有好听的再发吧。']];const b=[['them','……嗯。'],['them','我还挺喜欢的。'],['them','下次可以再发给我。']];const c=[['them','……'],['them','谁说不行了。'],['them','你突然这样我有点不习惯ㅋㅋ']];ch7Queue([a,b,c][i],'end')}
function ch7Notes(){activeApp='notes';phoneReadRoom('notes');let html=['<div class="note" onclick="gameReadNote()"><strong>第一章</strong></div>','<div class="note" onclick="ch2ReadInitialNote()"><strong>第二章</strong></div>','<div class="note" onclick="ch3Note(-1)"><strong>第三章</strong></div>','<div class="note" onclick="ch4ReadNote(0)"><strong>第四章</strong></div>','<div class="note" onclick="ch5IntroNote()"><strong>第五章</strong></div>','<div class="note" onclick="ch6Note(\'intro\')"><strong>第六章</strong></div>'];for(const n of CH7.notes){html.push('<div class="note" onclick="ch7Note(\''+n.id+'\')"><strong>'+(n.id==='intro'?'第七章':n.id==='end'?'第七章已结束':'新线索'+(CH7.notes.filter(x=>x.id!=='intro'&&x.id!=='end').indexOf(n)+1))+'</strong></div>')}html.push('<div class="note" onclick="gameChapterMenu()"><strong>跳转至其他章节</strong></div>');wrap('备忘录','<div class="content story-notes">'+html.join('')+'</div>')}
function ch7Note(id){const n=CH7.notes.find(x=>x.id===id);if(!n)return ch7Notes();activeApp='notes';phoneReadRoom('notes');if(id==='end'){CH7.done=true;CH7.endingRead=true;CH7.phase='complete';ch7Save()}const action=n.dest==='chat'?['前往宋亨俊的 KakaoTalk 私聊','ch7Room()']:n.dest==='melon'?['前往 Melon 收藏歌单',"melonOpen('list','heart')"]:null;wrap(n.title,'<div class="content story-prose ch7-note"><h2>'+escapeHtml(n.title)+'</h2><p>'+escapeHtml(n.text)+'</p><button class="choice" onclick="'+(action?action[1]:'ch7Notes()')+'">'+(action?action[0]:'返回备忘录')+'</button>'+(id==='end'?'<div class="story-end">第七章已结束 · 7/10</div>':'')+'</div>')}
const ch7PrevOpen=openApp;openApp=function(k){if(k==='melon')return melonOpen('home');if(ch7Is()){if(k==='kkt')return ch7Friends();if(k==='notes')return ch7Notes()}return ch7PrevOpen(k)};
const ch7PrevUnlock=gameUnlock;gameUnlock=function(k){if(k==='melon')return ch7Is()||CH7.done;if(ch7Is())return ['kkt','notes','photos','calendar','ig','phone','delivery','files','x','youtube','spotify','map'].includes(k);return ch7PrevUnlock(k)};
function ch7Friends(){activeApp='kkt';const names={hyeongjun:'宋亨俊',group:'CRAVITY 🐾',woobin:'徐宇瑸',manager:'经纪人',wonjin:'咸元进',serim:'朴世琳'};wrap('KakaoTalk','<div class="content ch5-friends">'+Object.keys(names).map(id=>'<div class="item" onclick="'+(id==='hyeongjun'?'ch7Room()':"ch7LegacyRoom('"+id+"')")+'"><div class="avatar">'+names[id][0]+'</div><div class="itemmain"><div class="itemtitle">'+names[id]+'</div><div class="itemsub">'+escapeHtml(id==='hyeongjun'?(CH7.messages.at(-1)?.type==='song'?'[音乐] '+ch7Song(CH7.messages.at(-1).songId).title:CH7.messages.at(-1)?.text||'历史消息'):'历史消息')+'</div></div>'+gameContactBadge(id)+'</div>').join('')+'</div>')}
function ch7LegacyRoom(id){const old=game.stage,was=CH6.active;game.stage='chapter6';CH6.active=true;try{ch6Room(id)}finally{game.stage=old;CH6.active=was}}
const ch7PrevChat=gameChat;gameChat=function(id){if(ch7Is()){if(id==='hyeongjun')return ch7Room();if(['group','woobin','manager','wonjin','serim'].includes(id))return ch7LegacyRoom(id)}return ch7PrevChat(id)};
const ch7PrevPhone=phoneOpenRoom;phoneOpenRoom=function(id){if(id==='melon')return melonOpen('home');if(ch7Is()){if(id==='hyeongjun')return ch7Room();if(typeof id==='string'&&id.startsWith('ch7-note-'))return ch7Note(id.slice(9));if(id==='notes')return ch7Notes()}return ch7PrevPhone(id)};
const ch7PrevNotes=gameNotes;gameNotes=function(){if(ch7Is())return ch7Notes();return ch7PrevNotes()};
const ch7PrevHome=goHome;goHome=function(){const r=ch7PrevHome();if(ch7Is()&&CH7.phase==='adPending')ch7ScheduleAd();return r};
const ch7PrevCh6Note=ch6Note;ch6Note=function(id){const r=ch7PrevCh6Note(id);if(id==='end'&&CH6.done){const root=document.querySelector('.ch6-note');if(root&&!root.querySelector('[onclick="ch7Start()"]'))root.insertAdjacentHTML('beforeend','<button class="choice" onclick="ch7Start()">进入第七章</button>')}return r};
try{const saved=JSON.parse(localStorage.getItem(CH7_KEY)||'null');if(saved?.active)Object.assign(CH7,saved)}catch(e){}
