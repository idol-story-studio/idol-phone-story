/* Global phone contracts — load after all chapter modules.
   New chapters must call phoneReceiveMessage / phoneReceiveNote, and use phoneMessageDelay. */
const PHONE_RULES_VERSION=2;
const PHONE_NAMES={hyeongjun:'宋亨俊',wonjin:'咸元进',woobin:'徐宇瑸',serim:'朴世琳',group:'CRAVITY 🐾'};
const PHONE_UNREAD_KEY='idol_phone_unread_v1';
const phoneUnread=(()=>{try{return JSON.parse(localStorage.getItem(PHONE_UNREAD_KEY))||{}}catch(e){return {}}})();
const phoneCounts={...phoneUnread};
const phoneRoomOpen=id=>activeApp==='kkt'&&current==='appview'&&(
  document.querySelector('#ch2-chat[data-id="'+id+'"]')||
  (id==='hyeongjun'&&document.querySelector('.story-ch1-chat'))||
  (id==='wonjin'&&document.querySelector('.story-wonjin-chat')));
function phonePlayerCanAutoReply(id,app='kkt'){if(app==='ig')return activeApp==='ig'&&typeof igScreen!=='undefined'&&igScreen==='chat'&&typeof igTarget!=='undefined'&&igTarget===id&&current==='appview';return !!phoneRoomOpen(id)}
function phoneWaitForPlayerRoom(id,callback,app='kkt'){if(phonePlayerCanAutoReply(id,app)){callback();return}setTimeout(()=>phoneWaitForPlayerRoom(id,callback,app),350)}
function phoneMessageDelay(nextText,first=false){const n=Array.from(String(nextText||'')).length;return Math.min(8500,(first?1100:900)+n*125)}
function phoneTimeAt(base,index,step=2){const t=base+index*step;return String(Math.floor(t/60)%24).padStart(2,'0')+':'+String(t%60).padStart(2,'0')}
function phoneSaveUnread(){try{localStorage.setItem(PHONE_UNREAD_KEY,JSON.stringify(phoneCounts))}catch(e){}}
function phoneCount(id){return Math.max(0,Number(phoneCounts[id])||0)}
function phoneSetCount(id,n){phoneCounts[id]=Math.max(0,Number(n)||0);phoneSaveUnread();phoneUpdateBadges()}
function phoneReadRoom(id,app='kkt'){phoneSetCount(app==='ig'?'ig:'+id:id,0)}
function phoneIgRoomOpen(id){return activeApp==='ig'&&typeof igScreen!=='undefined'&&igScreen==='chat'&&typeof igTarget!=='undefined'&&igTarget===id&&current==='appview'}
function phoneReceiveDM(app,id,message){const open=app==='ig'?phoneIgRoomOpen(id):phoneRoomOpen(id);if(open)return;const key=app==='ig'?'ig:'+id:id;phoneSetCount(key,phoneCount(key)+1);phoneBanner(app,PHONE_NAMES[id]||'新消息',String(message||'发来一条新消息'),key)}
function phoneReceiveMessage(id,message){return phoneReceiveDM('kkt',id,message)}
function phoneReceiveNote(title,target='notes'){if(activeApp==='notes'&&current==='appview')return;phoneSetCount('notes',phoneCount('notes')+1);phoneBanner('notes','备忘录',title||'有新的内容',target)}
function phoneUpdateBadges(){
 const total=Object.keys(PHONE_NAMES).reduce((n,k)=>n+phoneCount(k),0);
 game.unread.kkt=total;game.unread.ig=Object.keys(phoneCounts).filter(k=>k.startsWith('ig:')).reduce((n,k)=>n+phoneCount(k),0);game.unread.notes=phoneCount('notes');
 document.querySelectorAll('.app').forEach(btn=>{const key=(btn.getAttribute('onclick')||'').match(/openApp\('([^']+)'\)/)?.[1];if(!key)return;btn.querySelector('.story-badge')?.remove();const n=key==='kkt'?total:key==='ig'?game.unread.ig:key==='notes'?phoneCount('notes'):Math.max(0,game.unread[key]||0);if(n){const b=document.createElement('span');b.className='story-badge';b.textContent=n>99?'99+':String(n);btn.appendChild(b)}});
}
function phoneOpenRoom(id){
 if(id==='notes'){gameNotes();return}if(typeof id==='string'&&id.startsWith('ig:')){instagram();igChat(id.slice(3));return}
 if(typeof CH4!=='undefined'&&CH4.active&&game.stage==='chapter4'){
   if(id==='group')return ch4Group();if(id==='hyeongjun')return ch4Room();
 }
 if(typeof CH3!=='undefined'&&CH3.active&&game.stage==='chapter3'){
   if(id==='group')return ch3Group();
   if(['wonjin','woobin','serim'].includes(id))return ch3Chat(id);
 }
 if(['woobin','serim'].includes(id)&&typeof CH2!=='undefined'&&CH2.messages[id]?.length)return ch2Chat(id);
 return gameChat(id==='group'?'hyeongjun':id);
}
function phoneBanner(app,title,message,target){
 if(app==='kkt'&&phoneRoomOpen(target))return;if(app==='ig'&&phoneIgRoomOpen(String(target||'').replace(/^ig:/,'')))return;
 const text=String(message||'');const item={app,message:title+'：'+text,target,time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})};
 storyNotifications.unshift(item);if(storyNotifications.length>30)storyNotifications.pop();storyRefreshNotificationCenter();
 if(typeof ding==='function')ding();
 if(current==='lock'||current==='pass'){gameLockBanner(app,item.message);return}
 const t=$('toast');t.className='toast story-notification';
 t.innerHTML='<div class="story-notification-icon">'+(app==='kkt'?'TALK':app==='ig'?'IG':app==='calendar'?'31':'▤')+'</div><div class="story-notification-text"><div class="story-notification-app">'+(app==='kkt'?'KakaoTalk':app==='ig'?'Instagram':app==='calendar'?'日历':'备忘录')+' <span>现在</span></div><div class="story-notification-body">'+escapeHtml(item.message)+'</div></div>';
 t.style.display='flex';t.onclick=()=>{clearTimeout(toastTimer);t.style.display='none';phoneOpenRoom(target||'notes')};clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.style.display='none',8000)
}
gameShowBanner=function(app,message,target){if(app==='kkt'){const id=target||(/CRAVITY|群聊/.test(message)?'group':/徐宇瑸/.test(message)?'woobin':/朴世琳/.test(message)?'serim':/咸元进/.test(message)?'wonjin':'hyeongjun');phoneBanner(app,PHONE_NAMES[id]||'KakaoTalk',message,id)}else phoneBanner('notes','备忘录',message,'notes')};
gameBadge=phoneUpdateBadges;
gameSyncKktUnread=function(){phoneUpdateBadges()};
gameContactBadge=function(id,app='kkt'){const n=phoneCount(app==='ig'?'ig:'+id:id);return n?'<span class="story-contact-unread">'+n+'</span>':''};
gameNotifyContact=function(id){phoneReceiveMessage(id,'发来了一条新消息')};
gameNotify=function(app,msg){if(app==='notes')phoneReceiveNote(msg);else if(app==='kkt')phoneReceiveMessage(/咸元进/.test(msg)?'wonjin':/朴世琳/.test(msg)?'serim':/徐宇瑸/.test(msg)?'woobin':'hyeongjun',msg);else{game.unread[app]=(game.unread[app]||0)+1;phoneUpdateBadges();phoneBanner(app,app,msg,app)}};
gameClear=function(app){if(app==='notes')phoneSetCount('notes',0);else if(app==='kkt')phoneUpdateBadges();else{game.unread[app]=0;phoneUpdateBadges()}};
storyOpenNotification=function(i){const n=storyNotifications[i];if(!n)return;storyCloseNotificationCenter();phoneOpenRoom(n.target|| (n.app==='notes'?'notes':'hyeongjun'))};
const phoneOldRefreshNC=storyRefreshNotificationCenter;
storyRefreshNotificationCenter=function(){phoneOldRefreshNC()};
const phoneOldNotes=gameNotes;
gameNotes=function(){phoneReadRoom('notes');return phoneOldNotes()};
const phoneOldCh2Chat=ch2Chat;
ch2Chat=function(id){phoneReadRoom(id);return phoneOldCh2Chat(id)};
const phoneOldCh3Chat=ch3Chat;
ch3Chat=function(id){phoneReadRoom(id);return phoneOldCh3Chat(id)};
const phoneOldCh3Group=ch3Group;
ch3Group=function(){phoneReadRoom('group');return phoneOldCh3Group()};
const phoneOldCh4Room=ch4Room;
ch4Room=function(quiet){phoneReadRoom('hyeongjun');return phoneOldCh4Room(quiet)};
const phoneOldCh4Group=ch4Group;
ch4Group=function(quiet){phoneReadRoom('group');return phoneOldCh4Group(quiet)};
const phoneOldGameChat=gameChat;
gameChat=function(id){phoneReadRoom(id);return phoneOldGameChat(id)};
const phoneOldGameWonjinChat=gameWonjinChat;
gameWonjinChat=function(){phoneReadRoom('wonjin');return phoneOldGameWonjinChat()};
const phoneOldOpenApp=openApp;
openApp=function(k){if(k!=='youtube'&&k!=='spotify'&&!gameUnlock(k)){gameLocked();return}return phoneOldOpenApp(k)};
// The opening Notes reminder is part of the first chapter's initial phone state.
// Keep the lock-screen notification and the app badge in sync, without replaying
// the alert on later chapter visits or overwriting saved progress.
if(game.stage==='intro'&&!game.notesRead){
 if(phoneCount('notes')<1)phoneSetCount('notes',1);
 if(current==='lock'||current==='pass'){
  setTimeout(()=>{
   if(game.stage==='intro'&&!game.notesRead&&(current==='lock'||current==='pass')){
    gameLockBanner('notes','备忘录有新的内容');
   }
  },350);
 }
}
phoneUpdateBadges();

/* Chapters must use phoneReceiveMessage/phoneReceiveNote once per real incoming item; never call both gameNotify and gameShowBanner for the same item. */

const phoneOriginalIGChat=igChat;
igChat=function(id){phoneReadRoom(id,'ig');return phoneOriginalIGChat(id)};

/* Show the exact per-conversation unread count in the Instagram inbox, without adding fictitious messages. */
const phoneIGBase=igBase;
igBase=function(header,content,bottom){const r=phoneIGBase(header,content,bottom);if(igScreen==='inbox'||igScreen==='dm'||igScreen==='messages'){const n=phoneCount('ig:hyeongjun');if(n){const rows=document.querySelectorAll('.ig-dm-row,.ig-message-row,.ig-inbox-row,.ig-dm-item,.ig-chat-list .item');rows.forEach(row=>{if((row.textContent||'').includes('亨俊')&&!row.querySelector('.story-contact-unread'))row.insertAdjacentHTML('beforeend',gameContactBadge('hyeongjun','ig'))})}}return r};
