export const sources = {
  1: 'https://zh.wikisource.org/wiki/洛陽伽藍記/卷一',
  2: 'https://zh.wikisource.org/wiki/洛陽伽藍記/卷二',
  3: 'https://zh.wikisource.org/wiki/洛陽伽藍記/卷三',
  4: 'https://zh.wikisource.org/wiki/洛陽伽藍記/卷四',
  5: 'https://zh.wikisource.org/wiki/洛陽伽藍記/卷五'
};
export const regions = ['全城','城内','城东','城南','城西','城北'];
export const sites = [
  {id:'yongning',name:'永宁寺',region:'城内',volume:1,x:654,y:396,levels:9,subtitle:'九级浮图 · 风中金铎',intro:'御道西侧，九层木塔立于宫城之前。循朱门而入，仰看金盘承露，听一城风过宝铎。',quote:'中有九層浮圖一所，架木為之。',position:'在宫前阊阖门南一里，御道西。',spaces:[
    {id:'courtyard',name:'寺院',kind:'courtyard',title:'一塔凌云，满城风铎',text:'九级浮图居中，佛殿在北，南门楼三重。门外青槐与绿水，隔开御道上的飞尘。',quote:'四門外樹以青槐，亘以綠水。',evidence:'九层木塔、四面塔身、北侧佛殿、三重南门楼及青槐绿水见原文；屋顶曲线、相互间距与树木布置为艺术复原。',hotspots:[['pagoda','九级浮图',58,43],['hall','佛殿',84,45],['gate','南门楼',40,73],['garden','青槐水岸',86,76]]},
    {id:'pagoda',name:'浮图',kind:'pagoda',title:'高风永夜，宝铎和鸣',text:'四面九级的木塔，朱漆门户、金饰铺首与层层悬铎相映。书中所记高度保留为文献叙述，画面不据其数值作精确比例。',quote:'至於高風永夜，寶鐸和鳴。',evidence:'九级木构、四面塔身、朱漆门窗、金饰、金铎及铁链引向四角见原文；画面细部与比例为艺术复原。书载禁人登塔，本游览不虚构可自由登临的内部路线。',hotspots:[]},
    {id:'hall',name:'佛殿',kind:'hall',title:'绣柱金铺，静照尘寰',text:'浮图之北，佛殿形如太极殿。丈八金像立于殿中，光从门扉落在台阶上。',quote:'浮圖北有佛殿一所，形如太極殿。',evidence:'佛殿方位、形如太极殿、丈八金像及其余造像数量见原文；殿内视角、梁架纹饰、光线和佛像姿态为艺术想象。画面仅突出主像，不是全部造像的清点图。',hotspots:[]},
    {id:'garden',name:'青槐水岸',kind:'garden',title:'绿水无声，青槐送凉',text:'寺门之外，槐荫遮道。园中松柏与竹草掩映阶墀，繁华被一层轻墨收住。',quote:'清風送涼，豈藉合歡之發。',evidence:'青槐绿水、松柏竹草见原文；桥、岸线与园路为游览组织所作的艺术想象。',hotspots:[]},
    {id:'gate',name:'南门楼',kind:'gate',title:'门楼之上，一段未散的回声',text:'书载南门楼三重；又记永安三年，尔朱兆将庄帝锁于寺门楼上。是哪一座门楼，文字没有指明。此处借南门楼作叙事入口。',quote:'鎖帝於寺門樓上。',evidence:'幽禁于寺门楼有原文依据；选用南门楼、楼内陈设与烛火均为艺术想象。元子攸随后被押往晋阳，死于三级寺。',hotspots:[['echo','循烛光 · 听旧事',67,63]]}
  ]},
  {id:'jingming',name:'景明寺',region:'城南',volume:3,x:878,y:635,levels:7,subtitle:'七层浮图 · 山池相映',intro:'宣阳门外，青林垂影、绿水为文。松竹与兰芷环绕堂观，七层浮图立在园池之间。',quote:'青林垂影，綠水為文。',position:'宣阳门外一里，御道东。',spaces:[
    {id:'courtyard',name:'山池寺院',kind:'courtyard',title:'青林垂影，绿水为文',text:'前望嵩山、少室，背负帝城。沿着山池入寺，七层浮图金盘宝铎，与堂观在林间相望；三池分映林影。',quote:'房簷之外，皆是山池。',evidence:'七层浮图、华丽装饰、金盘宝铎及三池见卷三；本图不作精确尺度复原，塔身比例、池形与院落平面为艺术想象。',hotspots:[['garden','山池游径',83,73],['hall','堂观',83,42]]},
    {id:'garden',name:'山池',kind:'garden',title:'含风团露，流香吐馥',text:'水中有鱼，岸上列植竹松兰芷。循池而行，可想见书中寺院园林的清旷。',quote:'竹松蘭芷垂列階墀。',evidence:'水池、植物与水鸟鱼类有原文依据；桥、池岸、植物分布为艺术想象。',hotspots:[]},
    {id:'hall',name:'堂观',kind:'hall',title:'复殿重房，浮道相通',text:'书中描写重叠殿宇与相通的浮道。此处以一处堂内视角，表现庭院深处的幽静。',quote:'青臺紫閣，浮道相通。',evidence:'堂观、复殿重房见原文；室内梁架、主像与光照未见详细记载，为艺术想象。',hotspots:[]}
  ]},
  {id:'baima',name:'白马寺',region:'城西',volume:4,x:255,y:435,levels:null,subtitle:'白马负经 · 经函微光',intro:'西阳门外，书中以白马负经叙述寺名由来。循葡萄藤影，走近古老经函的传说。',quote:'時以白馬負經而來，因以為名。',position:'西阳门外三里，御道南。',spaces:[
    {id:'courtyard',name:'寺院',kind:'courtyard',title:'一匹白马，一卷远来的经',text:'树影与藤蔓之间，旧寺静立。书载经函时放光明，是作者记录的宗教传说。',quote:'寺上經函，至今猶存。',evidence:'寺址、经函与葡萄等植物见卷四；原文提到塔前果木，但未记塔层与形制，本视角不补画固定层数的塔；低殿与庭院布局为艺术想象，不代表今白马寺格局。',hotspots:[['scripture','经函堂',83,40],['garden','藤影庭院',81,64]]},
    {id:'scripture',name:'经函堂',kind:'scripture',title:'经函微光，照见来路',text:'书载道俗敬奉经函，并传说经函放光。此处以一束微光表现这段记忆。',quote:'經函時放光明，耀於堂宇。',evidence:'经函供养及放光是原书所记传说；独立经函堂、室内陈设与光效均为艺术想象。',hotspots:[]},
    {id:'garden',name:'藤影庭院',kind:'garden',title:'枝叶繁衍，子实甚大',text:'作者记下寺前果木之盛，并引京师俗语谈论其果实。庭院以葡萄藤与疏林回应这段描写。',quote:'蒲萄實偉於棗。',evidence:'葡萄与果木见原文；池、桥与庭院格局为艺术想象。',hotspots:[]}
  ]},
  {id:'yaoguang',name:'瑶光寺',region:'城内',volume:1,x:967,y:289,levels:5,subtitle:'宫侧尼寺 · 五层浮图',intro:'宫城近旁，五层浮图与尼房相望。层层门扉，收起御道的喧声。',quote:'有五層浮圖一所。',position:'阊阖城门御道北，东去千秋门二里。',spaces:[
    {id:'courtyard',name:'寺院',kind:'courtyard',title:'宫门侧畔，五级入云',text:'宣武帝所立的瑶光寺，以五层浮图、讲殿与众多尼房见于书中，作工精妙。',quote:'瑤光寺，世宗宣武皇帝所立。',evidence:'五层浮图、工艺精妙、讲殿尼房及寺址见原文；院落平面、塔身比例、门殿样式与园林为艺术复原。',hotspots:[['pagoda','五层浮图',57,44]]},
    {id:'pagoda',name:'五层浮图',kind:'pagoda',title:'五级浮图，静立宫旁',text:'原书称其作工之妙，与永宁相埒。此处以五层塔的近景回应这段记载。',quote:'作工之妙，埓美永寧。',evidence:'塔层及工艺评价见原文；外观细部、色彩和悬铎数量为艺术想象。',hotspots:[]}
  ]},
  {id:'mingxuan',name:'明悬尼寺',region:'城东',volume:2,x:1270,y:474,levels:3,subtitle:'石桥之南 · 三层素塔',intro:'建春门外，阳渠石桥南侧。三层塔未加庄严，与河渠、旧桥相伴。',quote:'有三層塔一所，未加莊嚴。',position:'建春门外石桥南。',spaces:[
    {id:'courtyard',name:'寺院',kind:'courtyard',title:'素塔临渠，旧桥记年',text:'彭城武宣王勰所立。三层塔未加庄严，装饰素朴，与寺旁的桥和流水相望。',quote:'在建春門外石橋南。',evidence:'寺址、三层塔与未加庄严见原文；画面以素朴回应，并不据此断定塔的材质。配色、细部与院落平面为艺术想象。',hotspots:[['garden','阳渠石桥',82,69]]},
    {id:'garden',name:'阳渠石桥',kind:'garden',title:'流水过石，旧柱犹存',text:'杨衒之在此考订桥的年代。书中说孝昌三年大雨颓桥，道北二柱尚存；画面以旧桥意象追忆此前景象。',quote:'道北二柱，至今猶存。',evidence:'石桥、四石柱及毁损记载见原文；此景为毁损前桥的艺术想象，非现存形制复原。',hotspots:[]}
  ]},
  {id:'chanxu',name:'禅虚寺',region:'城北',volume:5,x:672,y:146,levels:null,subtitle:'大夏门畔 · 阅武风声',intro:'大夏门御道西，寺前是阅武之场。北城风起，纸上的马蹄声穿过岁月。',quote:'寺前有閱武場。',position:'大夏门御道西。',spaces:[
    {id:'courtyard',name:'寺院',kind:'courtyard',title:'寺前旷野，岁末习战',text:'书中这里的主角是寺前阅武场：岁终农隙，甲士习战。',quote:'歲終農隙，甲士習戰。',evidence:'寺与阅武场的方位、用途见卷五；该条未描述佛塔，本图不增画三层塔；低殿、配色与寺内布局为艺术想象。',hotspots:[['parade','阅武场',48,68]]},
    {id:'parade',name:'阅武场',kind:'parade',title:'千乘万骑，纸上余响',text:'原书在此记录角抵与投掷技艺。留一片空阔的场地，想见北城岁末的演武。',quote:'千乘萬騎，常在於此。',evidence:'阅武与角抵来自原文；兵器架、旗帜和场地形制为艺术想象。',hotspots:[]}
  ]}
];
export const poem = ['權去生道促，憂來死路長。','懷恨出國門，含悲入鬼鄉。','隧門一時閉，幽庭豈復光。','思鳥吟青松，哀風吹白楊。','昔來聞死苦，何言身自當。'];
export function resolveRoute(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/');
  if (parts[0] !== 'site') return {type:'map'};
  const site = sites.find(s => s.id === parts[1]);
  if (!site) return {type:'map'};
  if (site.id === 'yongning' && parts[2] === 'echo') return {type:'echo',site};
  const space = site.spaces.find(s => s.id === parts[2]) || site.spaces[0];
  return {type:'scene',site,space};
}
