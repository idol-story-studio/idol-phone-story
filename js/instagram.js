/* Fictional fan-work interface. Usernames are configurable; avatars use placeholders until verified assets are added. */
const IG_PEOPLE=[
 {id:'minhee',name:'姜敏熙',handle:'min_h.ee',mark:'敏'},
 {id:'hyeongjun',name:'宋亨俊',handle:'hy30ngjun',mark:'亨'},
 {id:'serim',name:'朴世琳',handle:'sserimiress',mark:'世'},
 {id:'allen',name:'Allen',handle:'f.alleninlove',mark:'A'},
 {id:'jungmo',name:'具廷谟',handle:'jun9mok00',mark:'廷'},
 {id:'woobin',name:'徐宇瑸',handle:'woooob.in',mark:'宇'},
 {id:'wonjin',name:'咸元进',handle:'hamdust_',mark:'元'},
 {id:'taeyoung',name:'金太英',handle:'mygallery.o0ty',mark:'太'},
 {id:'seongmin',name:'安性珉',handle:'_minanism',mark:'性'}
];
const IG_SEED={hyeongjun:[{from:'them',text:'你醒了吗？',time:'昨天 21:18'},{from:'me',text:'我们晚点再说吧。',time:'昨天 21:20'}],serim:[{from:'them',text:'明天的行程确认一下。',time:'昨天'}],allen:[{from:'them',text:'排练辛苦了！',time:'周一'}]};
let igScreen='feed',igTarget='minhee',igChats=JSON.parse(localStorage.getItem('idol_ig_chats')||'null')||structuredClone(IG_SEED);
function igSave(){localStorage.setItem('idol_ig_chats',JSON.stringify(igChats))}
function igAvatar(p){return `<span class="ig-avatar">${p.mark}</span>`}
function igBase(header,content,bottom=true){activeApp='ig';show('appview');$('appbody').innerHTML=`<div class="ig-root"><div class="ig-header">${header}</div>${content}${bottom?`<div class="ig-bottom"><button onclick="instagram('feed')">⌂</button><button class="ig-disabled">⌕</button><button class="ig-disabled">⊞</button><button class="ig-disabled">♡</button><button onclick="instagram('profile')">◉</button></div>`:''}</div>`}
function instagram(screen='feed',target='minhee'){igScreen=screen;igTarget=target;if(screen==='feed')return igFeed();if(screen==='profile')return igProfile(target);if(screen==='following')return igFollowing();if(screen==='inbox')return igInbox();if(screen==='chat')return igChat(target)}
function igFeed(){let p=IG_PEOPLE[0];igBase(`<strong style="font-family:cursive">Instagram</strong><div><button class="ig-icon ig-disabled">♡</button><button class="ig-icon" onclick="instagram('inbox')">♧</button></div>`,`<div class="ig-scroll"><div class="ig-stories">${IG_PEOPLE.map(x=>`<div class="ig-story" onclick="instagram('profile','${x.id}')"><div class="ig-ring">${igAvatar(x)}</div>${x.name}</div>`).join('')}</div>${[{p,caption:'今天也认真完成了练习。谢谢一直支持我们的大家。',photo:'🎤'},{p:IG_PEOPLE[1],caption:'练习结束！今天也辛苦了。',photo:'🌃'}].map(x=>`<article class="ig-post"><div class="ig-post-top">${igAvatar(x.p)}<strong>${x.p.handle}</strong><span class="ig-muted">· 模拟帖子</span></div><div class="ig-photo">${x.photo}</div><div class="ig-actions"><span>♡</span><span>♧</span><span>➤</span></div><p><b>${x.p.handle}</b> ${x.caption}</p></article>`).join('')}</div>`)}
function igProfile(id='minhee'){let p=IG_PEOPLE.find(x=>x.id===id)||IG_PEOPLE[0];igBase(`<button class="ig-icon" onclick="instagram('${id==='minhee'?'feed':'following'}')">‹</button><strong>${p.handle}</strong><button class="ig-icon ig-disabled">☰</button>`,`<div class="ig-scroll"><div class="ig-profile-top">${igAvatar(p)}<div class="ig-stats"><div><b>9</b>帖子</div><div><b>—</b>粉丝</div><div onclick="instagram('following')"><b>${id==='minhee'?8:'—'}</b>关注</div></div></div><div style="padding:0 16px 15px"><b>${p.name}</b><p class="ig-muted">CRAVITY · 同人故事模拟账号</p></div><div class="ig-profile-buttons">${id==='minhee'?`<button class="ig-secondary" onclick="instagram('following')">正在关注 8 人</button><button class="ig-secondary" onclick="instagram('inbox')">消息</button>`:`<button class="ig-secondary" onclick="instagram('following')">互相关注</button><button class="ig-blue" onclick="instagram('chat','${id}')">发消息</button>`}</div><div class="ig-grid">${['🌙','🎧','🎤','📷','🌆','☕','✨','🎵','🌊'].map(v=>`<div class="ig-tile">${v}</div>`).join('')}</div></div>`)}
function igFollowing(){igBase(`<button class="ig-icon" onclick="instagram('profile')">‹</button><strong>正在关注</strong><span></span>`,`<div class="ig-scroll">${IG_PEOPLE.slice(1).map(p=>`<div class="ig-row" onclick="instagram('profile','${p.id}')">${igAvatar(p)}<div class="ig-row-main"><b>${p.handle}</b><small>${p.name} · 互相关注</small></div><button class="ig-secondary">已关注</button></div>`).join('')}</div>`)}
function igInbox(){igBase(`<button class="ig-icon" onclick="instagram('feed')">‹</button><strong>min_h.ee</strong><button class="ig-icon ig-disabled">✎</button>`,`<div class="ig-scroll"><h3 style="padding:0 16px">消息</h3>${IG_PEOPLE.slice(1).map(p=>{let last=(igChats[p.id]||[]).at(-1);return `<div class="ig-row" onclick="instagram('chat','${p.id}')">${igAvatar(p)}<div class="ig-row-main"><b>${p.name}</b><small>${last?escapeHtml(last.text):'点击查看对话'}</small></div><span class="ig-muted">›</span></div>`}).join('')}</div>`)}
function igChat(id){let p=IG_PEOPLE.find(x=>x.id===id)||IG_PEOPLE[1],messages=igChats[id]||[];igBase(`<button class="ig-icon" onclick="instagram('inbox')">‹</button><strong>${p.name} <span class="ig-muted">${p.handle}</span></strong><button class="ig-icon ig-disabled">ⓘ</button>`,`<div class="ig-scroll" id="ig-scroll"><div class="ig-chat">${messages.map(m=>`<div class="ig-bubble ${m.from==='me'?'mine':''}">${escapeHtml(m.text)}</div>`).join('')}${!messages.length?'<p class="ig-muted" style="text-align:center">暂无历史消息</p>':''}</div></div><form class="ig-compose" onsubmit="igSend(event,'${id}')"><input id="ig-message" autocomplete="off" placeholder="发送消息…" maxlength="500"><button type="submit">发送</button></form>`,false);let el=$('ig-scroll');el.scrollTop=el.scrollHeight}
function igSend(event,id){event.preventDefault();let field=$('ig-message'),value=field.value.trim();if(!value)return;(igChats[id]??=[]).push({from:'me',text:value,time:new Date().toLocaleTimeString('zh-CN')});igSave();igChat(id)}

/* 第二章：IG 图文、评论、私信与系统相册。图片采用仓库 assets/ig 路径。 */
const IG_POSTS=[
['IMG_8383.jpeg','10月24日','MINHEE 🖤','184,206',[['宋亨俊','🔥'],['徐宇瑸','这张很好看']]],
['IMG_8381(1).jpeg','10月22日','我们九个人，新的开始。#LOUDER','230,581',[['朴世琳','大家辛苦了！'],['金太英','期待舞台！']]],
['IMG_8380(1).jpeg','10月21日','LOUDER. 很快见面。','205,711',[['咸元进','准备好了吗ㅎㅎ'],['安性珉','🖤']]],
['IMG_8382.jpeg','10月20日','CRAVITY · LOUDER','167,329',[['具廷谟','这次的概念真的很酷'],['Allen','🔥🔥']]],
['IMG_5299(2).jpeg','10月11日','今天也辛苦了！谢谢 LUVITY 🤍','198,540',[['朴世琳','辛苦了我们！'],['咸元进','快去休息ㅋㅋ']]],
['IMG_5622.jpeg','9月28日','最近有认真运动 💪','162,903',[['徐宇瑸','坚持下去ㅋㅋ'],['宋亨俊','别练得太过头了']]],
['IMG_5338(1).jpeg','9月16日','今天也辛苦了✌️','224,172',[['宋亨俊','这张什么时候拍的ㅋㅋ'],['姜敏熙','你不是就在旁边吗']]],
['IMG_7081(1).jpeg','9月14日','谢谢大家给我过生日🎂 今天真的很幸福！','238,112',[['朴世琳','生日快乐，我们敏熙！'],['宋亨俊','生日快乐ㅋㅋ']]],
['IMG_3081(1).jpeg','8月30日','每次站上舞台都很幸福。谢谢 LUVITY！','281,540',[['宋亨俊','以后也一起拿更多奖吧ㅎㅎ'],['姜敏熙','当然！一直一起！']]],
['IMG_2773.jpeg','8月19日','🖤','148,202',[['宋亨俊','这件衣服好眼熟'],['姜敏熙','我的衣服啊？']]],
['IMG_2741.jpeg','8月13日','今天也很吵ㅋㅋㅋ','201,122',[['宋亨俊','明明是你最吵'],['姜敏熙','你不是也笑得很开心吗']]],
['IMG_2248.jpeg','7月29日','☀️','188,721',[['宋亨俊','这张不准删'],['姜敏熙','为什么要删ㅋㅋ']]],
['IMG_0339.jpeg','7月16日','今天也辛苦了ㅎㅎ 🥤','154,203',[['宋亨俊','谁让你拍我的ㅋㅋ'],['姜敏熙','拍得这么好看还不满意？']]],
['IMG_6703.jpeg','7月5日','休息一下 🍞','143,890',[['宋亨俊','你自己吃吧'],['姜敏熙','明明刚才还说想吃ㅋㅋ']]],
['IMG_2738.jpeg','6月24日','ㅎㅎ ♡','159,452',[['咸元进','又在干什么ㅋㅋ'],['宋亨俊','……']]]
];
const IG_ALBUM=[
['IMG_2739.jpeg','两个人的休息时间','7月27日 · 22:18','明明说要睡觉了ㅋㅋ'],
['IMG_5520.jpeg','睡前的照片','7月20日 · 00:43','不要吵醒他'],
['IMG_2737.jpeg','日常记录','7月18日','只有我们知道的照片'],
...IG_POSTS.map(p=>[p[0],p[2],p[1],''])
];
const IG_HISTORY={
hyeongjun:[['them','你发的那张照片到底是什么时候拍的ㅋㅋ','9月16日 21:02'],['me','你不是就在旁边吗','21:03'],['them','我说的是为什么现在才发！','21:03'],['me','因为觉得拍得很好看啊','21:04'],['them','……随你ㅋㅋ','21:05'],['them','下次别趁我不注意拍','21:05'],['me','那你下次不要靠这么近','21:06'],['them','你又不是不喜欢','21:07']],
woobin:[['them','最近是不是又练得太晚了？','9月28日'],['me','有一点ㅋㅋ',''],['them','别太勉强自己',''],['them','有事记得跟我说','']],
wonjin:[['them','你们两个最近怎么回事','昨天'],['them','亨俊嘴上不说，但你应该知道他不开心吧',''],['me','我知道','']],
serim:[['them','明天的行程确认一下','昨天'],['them','别忘记早点休息','']],
taeyoung:[['them','哥！下次再一起拍照吧ㅋㅋ','上周']],
seongmin:[['them','照片发我一份！','上周']]
};
let igLikes=new Set(),igSaves=new Set(),igUserComments={},igPostBack='profile',igAlbumIndex=0;
for(const [id,items] of Object.entries(IG_HISTORY))if(!igChats[id]||igChats[id].length<=2)igChats[id]=items.map(m=>({from:m[0],text:m[1],time:m[2]}));
function igPic(file,cls=''){return '<img class="'+cls+'" src="assets/ig/'+encodeURIComponent(file)+'" alt="照片" loading="lazy" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'ig-missing\')">'}
function igPost(i,back='profile'){igPostBack=back;let p=IG_POSTS[i];igBase('<button class="ig-icon" onclick="igReturn(\''+back+'\')">‹</button><strong>帖子</strong><span>⋯</span>',`<div class="ig-scroll"><div class="ig-post-top">${igAvatar(IG_PEOPLE[0])}<b>min_h.ee</b><span class="ig-muted">${p[1]}</span></div><div class="ig-fullphoto">${igPic(p[0])}</div><div class="ig-actions"><button onclick="igToggleLike(${i})">${igLikes.has(i)?'♥':'♡'}</button><button onclick="igOpenComments(${i},'post')">♧</button><button onclick="igShare(${i})">➤</button><button style="margin-left:auto" onclick="igToggleSave(${i})">${igSaves.has(i)?'▣':'▢'}</button></div><div class="ig-post-info"><b>${p[3]} 次赞</b><p><b>min_h.ee</b> ${p[2]}</p>${igMemberPreview(i)}<button class="ig-link" onclick="igOpenComments(${i},'post')">查看全部评论</button><div class="ig-muted">${p[1]}</div></div></div>`)}
function igToggleLike(i){igLikes.has(i)?igLikes.delete(i):igLikes.add(i);igPost(i,igPostBack)}
function igToggleSave(i){igSaves.has(i)?igSaves.delete(i):igSaves.add(i);igPost(i,igPostBack)}
function igShare(i){igBase('<button class="ig-icon" onclick="igOpenPost('+i+','profile')">‹</button><strong>分享给</strong><span></span>','<div class="ig-scroll">'+IG_PEOPLE.slice(1).map(p=>'<div class="ig-row" onclick="igShareTo(\''+p.id+'\','+i+')">'+igAvatar(p)+'<b>'+p.name+'</b></div>').join('')+'</div>')}
function igShareTo(id,i){(igChats[id]??=[]).push({from:'me',text:'分享了一篇帖子：'+IG_POSTS[i][2],time:'现在'});igSave();igChat(id)}
function igComments(i){
 const p=IG_POSTS[i],all=igAllComments(i);
 const back=igCommentOrigin==='post'?"igPost("+i+",'"+igPostBack+"')":"igReturn('"+igCommentOrigin+"')";
 const rows=all.map(c=>'<div class="ig-comment"><b>'+escapeHtml(c.name)+'</b> '+(c.replyTo?'<span class="ig-reply-target">回复 @'+escapeHtml(c.replyTo)+' </span>':'')+escapeHtml(c.text)+'<div class="ig-muted"><button class="ig-reply-button" onclick="igReplyComment(this.dataset.name)" data-name="'+escapeHtml(c.name)+'">回复</button>　♡</div></div>').join('');
 igBase('<button class="ig-icon" onclick="'+back+'">‹</button><strong>评论</strong><span></span>','<div class="ig-scroll"><div class="ig-comment-caption"><b>min_h.ee</b> '+escapeHtml(p[2])+'</div>'+rows+'</div><form class="ig-compose" onsubmit="igAddComment(event,'+i+')"><input id="ig-comment-input" placeholder="添加评论…" maxlength="200"><button>发布</button></form>',false);
}
function igAddComment(e,i){e.preventDefault();const v=$('ig-comment-input').value.trim();if(!v)return;(igUserComments[i]??=[]).push(['姜敏熙',v,igReplyTarget]);igReplyTarget=null;igComments(i)}
function igAlbum(){activeApp='photos';show('appview');$('appbody').innerHTML=`<div class="ig-root"><div class="ig-header"><strong>照片</strong><span class="ig-muted">最近项目</span></div><div class="ig-scroll"><h3 class="ig-album-title">图库 <small>${IG_ALBUM.length} 张照片</small></h3><div class="ig-grid">${IG_ALBUM.map((a,i)=>'<button class="ig-tile" onclick="igAlbumPhoto('+i+')">'+igPic(a[0])+'</button>').join('')}</div></div><div class="ig-bottom"><button onclick="igAlbum()">▦<small>图库</small></button><button onclick="igAlbum()">♡<small>为你推荐</small></button><button onclick="igAlbum()">▣<small>相簿</small></button></div></div>`}
function igAlbumPhoto(i){igAlbumIndex=(i+IG_ALBUM.length)%IG_ALBUM.length;let a=IG_ALBUM[igAlbumIndex];igBase('<button class="ig-icon" onclick="igAlbum()">‹</button><strong>'+a[2]+'</strong><span>'+ (igAlbumIndex+1)+' / '+IG_ALBUM.length+'</span>',`<div class="ig-album-view" id="ig-album-view"><button onclick="igAlbumPhoto(${igAlbumIndex-1})">‹</button><div class="ig-album-image">${igPic(a[0])}</div><button onclick="igAlbumPhoto(${igAlbumIndex+1})">›</button></div><div class="ig-album-caption"><b>${escapeHtml(a[1])}</b><p>${escapeHtml(a[3])}</p></div>`,false);let el=$('ig-album-view'),x=0;el.addEventListener('touchstart',e=>x=e.touches[0].clientX,{passive:true});el.addEventListener('touchend',e=>{let d=e.changedTouches[0].clientX-x;if(Math.abs(d)>55)igAlbumPhoto(igAlbumIndex+(d<0?1:-1))},{passive:true})}
function igRichProfile(){let p=IG_PEOPLE[0];igBase('<button class="ig-icon" onclick="instagram(\'feed\')">‹</button><strong>min_h.ee ﹀</strong><button class="ig-icon" onclick="instagram(\'inbox\')">☰</button>',`<div class="ig-scroll"><div class="ig-profile-top">${igAvatar(p)}<div class="ig-stats"><div><b>${IG_POSTS.length}</b>帖子</div><div><b>—</b>粉丝</div><div onclick="instagram('following')"><b>8</b>关注</div></div></div><div class="ig-bio"><b>姜敏熙</b><p>CRAVITY · MINHEE</p></div><div class="ig-profile-buttons"><button class="ig-secondary" onclick="instagram('following')">正在关注</button><button class="ig-secondary" onclick="instagram('inbox')">消息</button></div><div class="ig-grid">${IG_POSTS.map((post,i)=>'<button class="ig-tile" onclick="igPost('+i+')">'+igPic(post[0])+'</button>').join('')}</div></div>`)}
function igRichFeed(){igBase('<strong style="font-family:cursive">Instagram</strong><button class="ig-icon" onclick="instagram(\'inbox\')">✉</button>',`<div class="ig-scroll"><div class="ig-stories">${IG_PEOPLE.map(p=>'<div class="ig-story" onclick="instagram(\'profile\',\''+p.id+'\')"><div class="ig-ring">'+igAvatar(p)+'</div>'+p.name+'</div>').join('')}</div>${IG_POSTS.slice(0,9).map((p,i)=>'<article class="ig-post"><div class="ig-post-top">'+igAvatar(IG_PEOPLE[0])+'<b>min_h.ee</b><span class="ig-muted">'+p[1]+'</span></div><button class="ig-feedphoto" onclick="igOpenPost('+i+','feed')">'+igPic(p[0])+'</button><div class="ig-actions"><button onclick="igOpenPost('+i+','feed')">♡</button><button onclick="igOpenComments('+i+','feed')">♧</button><button onclick="igShare('+i+')">➤</button></div><div class="ig-post-info"><b>'+p[3]+' 次赞</b><p><b>min_h.ee</b> '+p[2]+'</p>'+igMemberPreview(i)+'<button class="ig-link" onclick="igOpenComments('+i+','feed')">查看评论</button></div></article>').join('')}</div>`)}
const igOriginalInstagram=instagram;instagram=function(screen='feed',target='minhee'){if(screen==='feed')return igRichFeed();if(screen==='profile'&&target==='minhee')return igRichProfile();return igOriginalInstagram(screen,target)};

/* Instagram: independent feed/profile navigation and layered comments. */
const IG_EXTRA_COMMENTS={
 1:[['宋亨俊','九个人都辛苦了ㅎㅎ'],['徐宇瑸','这次真的准备了很久'],['Allen','一起加油！'],['具廷谟','舞台见！'],['安性珉','九个人一起走下去ㅎㅎ']],
 2:[['朴世琳','期待大家看到舞台'],['徐宇瑸','练习成果要公开了ㅎㅎ'],['金太英','准备好了！'],['宋亨俊','🖤']],
 3:[['朴世琳','这次概念很适合我们'],['咸元进','快点给大家看舞台ㅋㅋ'],['金太英','🔥']],
 7:[['Allen','生日快乐敏熙！🎂'],['具廷谟','生日快乐！今天开心一点ㅎㅎ'],['徐宇瑸','我们敏熙生日快乐🤍'],['咸元进','蛋糕好吃吗ㅋㅋ'],['金太英','生日快乐哥！！'],['安性珉','生日快乐ㅎㅎ']],
 8:[['朴世琳','以后也一起拿奖吧'],['Allen','永远记得今天'],['咸元进','大家都辛苦了ㅠㅠ'],['安性珉','下次也一起！']]
};
const IG_FAN_NAMES=['luvity_0914','星星收藏夹','小狗观察日记','今天也喜欢敏熙','九颗星的宇宙','舞台记录簿'];
const IG_FAN_WORDS=['这张照片也太好看了ㅠㅠ','一直支持你们！','今天也被帅到了ㅋㅋ','好期待下一次舞台！','照片的氛围好喜欢🤍','辛苦啦，好好休息！'];
let igNavOrigin='profile',igCommentOrigin='post',igReplyTarget=null,igSavedScroll={feed:0,profile:0};
function igAllComments(i){
 const original=IG_POSTS[i][4],extras=IG_EXTRA_COMMENTS[i]||[];
 const members=[...original.filter(c=>c[0]!=='姜敏熙'),...extras].filter((c,j,a)=>a.findIndex(x=>x[0]===c[0])===j).map(c=>({name:c[0],text:c[1],member:true,replyTo:null}));
 const own=original.filter(c=>c[0]==='姜敏熙').map(c=>({name:c[0],text:c[1],member:true,replyTo:members[0]?.name||null}));
 const fans=IG_FAN_NAMES.slice(0,[1,2,3,7,8].includes(i)?6:3).map((name,j)=>({name,text:IG_FAN_WORDS[(i+j)%6],member:false,replyTo:null}));
 const added=(igUserComments[i]||[]).map(c=>({name:c[0],text:c[1],member:c[0]==='姜敏熙',replyTo:c[2]||null}));
 return [...members,...own,...fans,...added];
}
function igMemberPreview(i){return '<div class="ig-inline-comments">'+igAllComments(i).filter(c=>c.member).map(c=>'<div><b>'+escapeHtml(c.name)+'</b> '+(c.replyTo?'<span class="ig-reply-target">回复 @'+escapeHtml(c.replyTo)+' </span>':'')+escapeHtml(c.text)+'</div>').join('')+'</div>'}
function igCaptureScroll(origin){const el=document.querySelector('.ig-root .ig-scroll');if(el&&(origin==='feed'||origin==='profile'))igSavedScroll[origin]=el.scrollTop}
function igReturn(origin){instagram(origin);const el=document.querySelector('.ig-root .ig-scroll');if(el)el.scrollTop=igSavedScroll[origin]||0}
function igOpenPost(i,origin){igCaptureScroll(origin);igPost(i,origin)}
function igOpenComments(i,origin){igCaptureScroll(origin);igCommentOrigin=origin;igReplyTarget=null;igComments(i)}
function igReplyComment(name){igReplyTarget=name;const input=$('ig-comment-input');if(input){input.placeholder='回复 @'+name+'…';input.focus()}}
