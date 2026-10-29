/* NAVER Map-inspired fictional phone app. All visit history is fictional fan work. */
const NM_PLACES=[
{id:'tongyeong',name:'东悬壁画村',ko:'동피랑 벽화마을',area:'庆尚南道 · 统营',x:73,y:72,people:['宋亨俊'],date:'2025.08.19',note:'从小巷一路走上去，亨俊一直说小时候也来过附近。爬坡的时候他走得很快，发现我落在后面，又折回来牵我的手。拍照的时候他说不要拍他，结果相册里最多的就是他。',tags:['两个人','旅行']},
{id:'tongpark',name:'李舜臣公园',ko:'이순신공원',area:'庆尚南道 · 统营',x:83,y:80,people:['宋亨俊'],date:'2025.08.19',note:'海风比想象中大。我们坐了很久，亨俊讲他小时候的事。我说以后还想来，他问我是不是只想来看海。后来我没回答，他就笑了。',tags:['两个人','旅行']},
{id:'tongport',name:'江口岸',ko:'강구안',area:'庆尚南道 · 统营',x:66,y:84,people:['宋亨俊'],date:'2025.08.20',note:'早上一起沿着港口走。早餐买多了，最后还是他帮我吃完。亨俊说下次来要早点起床看日出，我说他先保证能叫醒我。',tags:['两个人','旅行']},
{id:'seoulforest',name:'首尔林',ko:'서울숲',area:'首尔 · 城东区',x:45,y:37,people:['徐宇瑸','咸元进'],date:'2025.05.11',note:'宇瑸哥说出来走走，元进一路都在找能坐的地方。最后我们买了饮料坐在树下聊天，什么重要的事也没做。',tags:['朋友','散步']},
{id:'seongsu',name:'圣水洞咖啡街',ko:'성수동 카페거리',area:'首尔 · 城东区',x:57,y:43,people:['具廷谟','金太英'],date:'2025.07.03',note:'廷谟哥挑了半天咖啡店，太英只关心有没有甜点。拍了一堆照片，最后谁都没选出满意的。',tags:['朋友','咖啡']},
{id:'banpo',name:'盘浦汉江公园',ko:'반포한강공원',area:'首尔 · 瑞草区',x:31,y:59,people:['宋亨俊'],date:'2025.06.14',note:'练习结束以后来吹风。亨俊买了两瓶饮料，我们坐在离人群稍远的地方。他突然把外套披过来，说晚上比白天冷。',tags:['两个人','夜景']},
{id:'olympic',name:'奥林匹克公园',ko:'올림픽공원',area:'首尔 · 松坡区',x:78,y:34,people:['朴世琳','安性珉','Allen'],date:'2025.04.27',note:'大家难得有空，一起散步。世琳哥负责找路，性珉一直拍照，Allen说下次要带相机来。',tags:['朋友','散步']}
];
const NM_KEY='idol_naver_map_v1';
let NM_STATE={tab:'saved',filter:'全部',selected:null,query:''};
try{Object.assign(NM_STATE,JSON.parse(localStorage.getItem(NM_KEY)||'{}'))}catch(e){}
function nmSave(){try{localStorage.setItem(NM_KEY,JSON.stringify(NM_STATE))}catch(e){}}
function nmOpen(){activeApp='map';nmRender()}
function nmGo(tab){NM_STATE.tab=tab;NM_STATE.selected=null;nmSave();nmRender()}
function nmFilter(tag){NM_STATE.filter=tag;NM_STATE.selected=null;nmSave();nmRender()}
function nmSelect(id){NM_STATE.selected=id;nmSave();nmRender()}
function nmSearch(){NM_STATE.query=document.getElementById('nm-query')?.value.trim()||'';NM_STATE.tab='search';nmSave();nmRender()}
function nmExternal(id){const p=NM_PLACES.find(x=>x.id===id);if(!p)return;window.open('https://map.naver.com/p/search/'+encodeURIComponent(p.ko),'_blank','noopener,noreferrer')}
function nmRender(){
const esc=typeof escapeHtml==='function'?escapeHtml:(v=>String(v));
const p=NM_PLACES.find(x=>x.id===NM_STATE.selected);
const tags=['全部','两个人','朋友','旅行','散步','咖啡','夜景'];
const filtered=NM_PLACES.filter(x=>(NM_STATE.filter==='全部'||x.tags.includes(NM_STATE.filter))&&(NM_STATE.tab!=='search'||!NM_STATE.query||[x.name,x.ko,x.area,...x.people].join(' ').toLowerCase().includes(NM_STATE.query.toLowerCase())));
const cards=filtered.map(x=>'<button class="nm-place" onclick="nmSelect(\''+x.id+'\')"><span class="nm-place-icon">⌖</span><span class="nm-place-text"><strong>'+esc(x.name)+'</strong><small>'+esc(x.area)+' · '+esc(x.people.join('、'))+'</small></span><span class="nm-chevron">›</span></button>').join('');
const map='<div class="nm-map"><div class="nm-water"></div><div class="nm-road nm-r1"></div><div class="nm-road nm-r2"></div><div class="nm-road nm-r3"></div><div class="nm-district nm-d1">首尔</div><div class="nm-district nm-d2">统营</div>'+NM_PLACES.map(x=>'<button class="nm-pin '+(p?.id===x.id?'active':'')+'" style="left:'+x.x+'%;top:'+x.y+'%" onclick="nmSelect(\''+x.id+'\')" title="'+esc(x.name)+'"><span>●</span></button>').join('')+'<span class="nm-map-caption">收藏地点示意图 · 非比例尺地图</span></div>';
const detail=p?'<div class="nm-detail"><button class="nm-back" onclick="nmSelect(null)">‹ 收藏地点</button><div class="nm-detail-map">'+map+'</div><h2>'+esc(p.name)+'</h2><div class="nm-ko">'+esc(p.ko)+' · '+esc(p.area)+'</div><button class="nm-nav" onclick="nmExternal(\''+p.id+'\')">在 NAVER Map 查看真实地点 ↗</button><div class="nm-section-title">姜敏熙的到访记录</div><div class="nm-visit"><span class="nm-date">'+esc(p.date)+'</span><p><b>同行：</b>'+esc(p.people.join('、'))+'</p><p>'+esc(p.note)+'</p></div><p class="nm-disclaimer">人物到访及旅行文字均为虚构同人内容，并非艺人真实行程。</p></div>':'<div class="nm-body">'+map+'<div class="nm-filters">'+tags.map(t=>'<button class="'+(NM_STATE.filter===t?'on':'')+'" onclick="nmFilter(\''+t+'\')">'+t+'</button>').join('')+'</div><h3>我的收藏 <small>'+filtered.length+' 个地点</small></h3>'+cards+'</div>';
wrap('NAVER Map','<div class="nm-app"><div class="nm-search"><span class="nm-brand">N</span><input id="nm-query" value="'+esc(NM_STATE.query).replace(/&quot;/g,'&quot;')+'" placeholder="搜索地点、同行人" onkeydown="if(event.key===\'Enter\')nmSearch()"><button onclick="nmSearch()">搜索</button></div>'+detail+'<nav class="nm-tabs"><button onclick="nmGo(\'saved\')" class="'+(NM_STATE.tab==='saved'?'on':'')+'">☆<span>收藏</span></button><button onclick="nmGo(\'search\')" class="'+(NM_STATE.tab==='search'?'on':'')+'">⌕<span>搜索</span></button><button onclick="nmGo(\'saved\')">⌖<span>地图</span></button></nav></div>');
}
const nmOldOpenApp=openApp;
openApp=function(k){if(k==='map')return nmOpen();return nmOldOpenApp(k)};
