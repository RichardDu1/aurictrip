// AuricTrip 旅程元数据映射
// slug → 大洲分组 + 每条行程的6张画廊图的Unsplash关键词
// 这个文件同时服务于：目的地页大洲分组（阶段二）+ 图片下载（阶段一）

export interface JourneyMeta {
  slug: string;
  destination: string;
  region: string; // 大洲分组：亚洲/欧洲/非洲/北美洲/南美洲/大洋洲/极地与中东
  desc: string; // 目的地页卡片的一句话描述
  // 6张画廊图的搜索关键词，按维度：
  // [0]目的地全景/自然风光 [1]标志性体验 [2]旗舰酒店外观
  // [3]酒店公共空间/泳池 [4]美食或在地文化 [5]第二视角风光/夜景
  galleryKeywords: [string, string, string, string, string, string];
}

export const REGION_ORDER = [
  "亚洲",
  "欧洲",
  "非洲",
  "北美洲",
  "南美洲",
  "大洋洲",
  "极地与中东",
] as const;

export const journeysMeta: JourneyMeta[] = [
  // ===== 亚洲 =====
  { slug: "thailand-siam", destination: "泰国", region: "亚洲", desc: "曼谷·清迈·安达曼海私人岛屿", galleryKeywords: ["thailand temple grand palace", "thailand long tail boat phang nga", "mandarin oriental bangkok", "soneva kiri pool villa", "thailand street food night market", "chiang mai golden temple sunset"] },
  { slug: "bali-islands", destination: "巴厘岛", region: "亚洲", desc: "乌布稻田·乌鲁瓦图悬崖", galleryKeywords: ["bali rice terrace ubud", "bali uluwatu cliff temple", "capella ubud villa", "bali infinity pool jungle", "bali balinese offering ceremony", "bali sunset tanah lot"] },
  { slug: "japan-odyssey", destination: "日本", region: "亚洲", desc: "东京·京都·岚山深处", galleryKeywords: ["kyoto bamboo forest arashiyama", "tokyo shibuya crossing night", "aman tokyo city view", "hoshinoya kyoto river", "japanese kaiseki fine dining", "mount fuji cherry blossom"] },
  { slug: "kyoto-nara", destination: "日本·京都奈良", region: "亚洲", desc: "古都·禅寺·茶道", galleryKeywords: ["kyoto fushimi inari torii", "nara deer temple", "kyoto ryokan tatami room", "kyoto zen garden ryoanji", "japanese tea ceremony matcha", "kyoto gion geisha street night"] },
  { slug: "bhutan-kingdom", destination: "不丹", region: "亚洲", desc: "雷龙之国的幸福哲学", galleryKeywords: ["bhutan tigers nest monastery", "bhutan paro valley mountain", "amankora paro lodge", "bhutan monastery prayer flags", "bhutanese monk temple", "himalaya snow peak sunrise bhutan"] },
  { slug: "sri-lanka-tea", destination: "斯里兰卡", region: "亚洲", desc: "锡兰红茶·古城·海滨", galleryKeywords: ["sri lanka tea plantation ella", "sri lanka safari elephant", "ceylon tea trails bungalow", "sri lanka beach palm", "sri lanka temple sigiriya", "sri lanka nine arch bridge train"] },
  { slug: "malaysia-borneo", destination: "马来西亚", region: "亚洲", desc: "婆罗洲雨林·兰卡威·槟城", galleryKeywords: ["borneo rainforest orangutan", "langkawi andaman sea beach", "the datai langkawi pool", "borneo proboscis monkey", "penang street food george town", "kuala lumpur petronas towers night"] },
  { slug: "singapore-gourmet", destination: "新加坡", region: "亚洲", desc: "米其林·花园城市", galleryKeywords: ["singapore marina bay sands", "singapore gardens by the bay", "raffles hotel singapore", "singapore hawker food", "singapore chinatown street", "singapore skyline night river"] },
  { slug: "vietnam-cambodia", destination: "越南·柬埔寨", region: "亚洲", desc: "下龙湾·吴哥窟", galleryKeywords: ["halong bay vietnam boat", "angkor wat cambodia sunrise", "vietnam hoi an lantern", "mekong delta vietnam", "vietnam pho street food", "angkor temple roots tree"] },
  { slug: "india-rajasthan", destination: "印度", region: "亚洲", desc: "拉贾斯坦·色彩之邦", galleryKeywords: ["taj mahal india sunrise", "rajasthan jaipur palace", "udaipur lake palace hotel", "rajasthan camel desert", "india spices market color", "jaisalmer fort sunset"] },
  { slug: "silk-road-heritage", destination: "丝绸之路", region: "亚洲", desc: "中亚·古城·文化遗产", galleryKeywords: ["uzbekistan samarkand registan", "silk road caravan desert", "khiva old city uzbekistan", "bukhara mosque tile", "central asia bazaar spice", "samarkand architecture blue dome"] },

  // ===== 欧洲 =====
  { slug: "italy-amalfi", destination: "意大利·阿马尔菲", region: "欧洲", desc: "波西塔诺·卡普里·米其林", galleryKeywords: ["amalfi coast positano italy", "capri island faraglioni", "le sirenuse positano", "amalfi coast infinity pool", "italian pasta seafood dining", "positano sunset cliff"] },
  { slug: "tuscany-truffle", destination: "意大利·托斯卡纳", region: "欧洲", desc: "白松露·酒庄·文艺复兴", galleryKeywords: ["tuscany landscape cypress", "tuscany vineyard rolling hills", "tuscany castle hotel", "tuscany wine cellar", "truffle hunting italy", "florence duomo sunset"] },
  { slug: "france-light", destination: "法国", region: "欧洲", desc: "巴黎·波尔多·蔚蓝海岸", galleryKeywords: ["paris eiffel tower view", "french riviera nice", "ritz paris hotel room", "bordeaux vineyard chateau", "paris fine dining michelin", "mont saint michel france"] },
  { slug: "france-provence", destination: "法国·普罗旺斯", region: "欧洲", desc: "薰衣草·酒庄·山居", galleryKeywords: ["provence lavender field", "provence village stone", "provence farmhouse hotel", "provence wine vineyard", "provence market lavender", "provence sunset hill"] },
  { slug: "spain-andalusia", destination: "西班牙", region: "欧洲", desc: "安达卢西亚·弗拉明戈", galleryKeywords: ["alhambra granada spain", "seville flamenco dancer", "spain andalusia white village", "cordoba mezquita arches", "spanish tapas jamon", "barcelona sagrada familia night"] },
  { slug: "portugal-discover", destination: "葡萄牙", region: "欧洲", desc: "里斯本·杜罗河谷", galleryKeywords: ["lisbon tram yellow portugal", "porto douro valley vineyard", "portugal azulejo tiles", "sintra palace portugal", "portuguese pastel de nata", "lisbon sunset river tagus"] },
  { slug: "greece-odyssey", destination: "希腊", region: "欧洲", desc: "雅典·圣托里尼·克里特", galleryKeywords: ["santorini oia white blue", "athens acropolis parthenon", "santorini cliff hotel pool", "greek island beach", "greek meze food", "santorini sunset caldera"] },
  { slug: "greece-aegean", destination: "希腊·爱琴海", region: "欧洲", desc: "跳岛·私人游艇", galleryKeywords: ["greek island blue dome", "mykonos windmill", "aegean sea yacht", "santorini infinity pool", "greek salad seafood", "aegean sunset boat"] },
  { slug: "croatia-adriatic", destination: "克罗地亚", region: "欧洲", desc: "亚得里亚海·古城", galleryKeywords: ["dubrovnik croatia old town", "plitvice lakes waterfall croatia", "hvar island croatia", "croatia adriatic coast", "croatian seafood", "dubrovnik city wall sunset"] },
  { slug: "turkey-ottoman", destination: "土耳其", region: "欧洲", desc: "伊斯坦布尔·卡帕多奇亚", galleryKeywords: ["cappadocia hot air balloon", "istanbul hagia sophia", "cave hotel cappadocia", "pamukkale turkey terrace", "turkish bazaar spice", "istanbul mosque sunset"] },
  { slug: "scotland-highlands", destination: "英国·苏格兰", region: "欧洲", desc: "高地·威士忌·城堡", galleryKeywords: ["scotland highlands glencoe", "isle of skye scotland", "scottish castle hotel", "scotland loch reflection", "scotch whisky distillery", "edinburgh castle sunset"] },
  { slug: "iceland-ring-road", destination: "冰岛", region: "欧洲", desc: "环岛·极光·瀑布", galleryKeywords: ["iceland northern lights aurora", "iceland waterfall skogafoss", "iceland glacier lagoon", "iceland blue lagoon pool", "iceland black sand beach", "iceland mountain sunset"] },
  { slug: "norway-lofoten", destination: "挪威", region: "欧洲", desc: "峡湾·罗弗敦·极光", galleryKeywords: ["norway fjord lofoten", "lofoten islands fishing village", "norway cabin fjord", "norway aurora borealis", "norwegian salmon seafood", "lofoten midnight sun"] },
  { slug: "switzerland-alps", destination: "瑞士", region: "欧洲", desc: "阿尔卑斯·雪山·湖景", galleryKeywords: ["swiss alps matterhorn", "lucerne switzerland lake", "swiss chalet hotel mountain", "jungfrau railway snow", "swiss fondue cheese", "zermatt sunset matterhorn"] },
  { slug: "georgia-caucasus", destination: "格鲁吉亚", region: "欧洲", desc: "高加索·8000年葡萄酒", galleryKeywords: ["georgia caucasus mountain kazbek", "tbilisi old town balcony", "georgia gergeti trinity church", "georgia wine vineyard kakheti", "georgian khachapuri food", "svaneti tower sunset"] },

  // ===== 非洲 =====
  { slug: "kenya-safari", destination: "肯尼亚", region: "非洲", desc: "马赛马拉·动物大迁徙", galleryKeywords: ["kenya masai mara safari", "wildebeest migration mara river", "kenya luxury safari tent camp", "kenya hot air balloon", "maasai warrior tribe", "african savanna sunset elephant"] },
  { slug: "tanzania-family", destination: "坦桑尼亚", region: "非洲", desc: "塞伦盖蒂·家庭游猎", galleryKeywords: ["serengeti tanzania safari", "ngorongoro crater tanzania", "tanzania luxury tented camp", "tanzania balloon safari", "tanzania zanzibar beach", "kilimanjaro mountain sunset"] },
  { slug: "south-africa", destination: "南非", region: "非洲", desc: "开普敦·酒庄·克鲁格", galleryKeywords: ["cape town table mountain", "south africa safari kruger", "cape winelands stellenbosch", "cape town beach camps bay", "south african braai food", "cape town sunset ocean"] },
  { slug: "botswana-okavango", destination: "博茨瓦纳", region: "非洲", desc: "奥卡万戈三角洲·野奢", galleryKeywords: ["okavango delta botswana mokoro", "botswana elephant safari", "botswana luxury camp", "okavango delta aerial", "botswana sunset delta", "botswana lion wild"] },
  { slug: "rwanda-gorillas", destination: "卢旺达", region: "非洲", desc: "山地大猩猩追踪", galleryKeywords: ["rwanda mountain gorilla", "rwanda volcanoes national park", "rwanda luxury lodge", "gorilla tracking forest", "rwanda kigali city", "virunga mountains mist"] },
  { slug: "namibia-desert", destination: "纳米比亚", region: "非洲", desc: "沙漠星空·骷髅海岸", galleryKeywords: ["namibia sossusvlei dunes", "namibia skeleton coast", "namibia desert lodge", "namibia dead vlei trees", "namibia starry night desert", "namibia sunset dune"] },
  { slug: "morocco-sahara", destination: "摩洛哥", region: "非洲", desc: "马拉喀什·撒哈拉·蓝城", galleryKeywords: ["marrakech morocco market", "sahara desert morocco camel", "morocco riad courtyard", "chefchaouen blue city", "moroccan tagine food", "sahara desert stars night"] },
  { slug: "egypt-nile", destination: "埃及", region: "非洲", desc: "尼罗河·金字塔·神庙", galleryKeywords: ["egypt pyramids giza", "nile river cruise egypt", "luxor temple egypt", "aswan nile felucca", "egyptian bazaar cairo", "abu simbel temple sunset"] },
  { slug: "ethiopia-heritage", destination: "埃塞俄比亚", region: "非洲", desc: "拉利贝拉·奥莫河谷", galleryKeywords: ["ethiopia lalibela rock church", "ethiopia omo valley tribe", "ethiopia simien mountains", "ethiopia coffee ceremony", "ethiopia orthodox church", "ethiopia highland landscape"] },
  { slug: "madagascar-ark", destination: "马达加斯加", region: "非洲", desc: "狐猴·猢狲树·生物方舟", galleryKeywords: ["madagascar baobab tree avenue", "madagascar lemur", "madagascar beach nosy be", "madagascar tsingy stone forest", "madagascar chameleon", "madagascar sunset baobab"] },

  // ===== 北美洲 =====
  { slug: "alaska-wilderness", destination: "阿拉斯加", region: "北美洲", desc: "冰川·极光·荒野", galleryKeywords: ["alaska glacier mountains", "alaska northern lights", "alaska wilderness lodge", "alaska whale watching", "alaska bear salmon", "alaska denali sunset"] },
  { slug: "costa-rica", destination: "哥斯达黎加", region: "北美洲", desc: "雨林·火山·生态", galleryKeywords: ["costa rica rainforest", "arenal volcano costa rica", "costa rica eco lodge", "costa rica beach pacific", "sloth costa rica wildlife", "costa rica waterfall jungle"] },
  { slug: "mexico-maya", destination: "墨西哥", region: "北美洲", desc: "玛雅·坎昆·美食", galleryKeywords: ["mexico chichen itza maya", "tulum mexico beach ruin", "mexico luxury resort", "mexico cenote", "mexican tacos street food", "mexico city night"] },

  // ===== 南美洲 =====
  { slug: "peru-inca", destination: "秘鲁", region: "南美洲", desc: "马丘比丘·印加古道", galleryKeywords: ["machu picchu peru", "cusco peru sacsayhuaman", "peru sacred valley", "peru andes mountain", "peruvian ceviche food", "machu picchu sunrise"] },
  { slug: "patagonia-hiking", destination: "巴塔哥尼亚", region: "南美洲", desc: "徒步·冰川· Torres", galleryKeywords: ["patagonia torres del paine", "patagonia glacier perito moreno", "patagonia mountain lodge", "patagonia hiking trail", "patagonia guanaco", "patagonia sunrise peak"] },
  { slug: "argentina-tango", destination: "阿根廷", region: "南美洲", desc: "布宜诺斯艾利斯·探戈·酒庄", galleryKeywords: ["buenos aires argentina", "argentina tango dancer", "mendoza argentina vineyard", "iguazu falls argentina", "argentine steak asado", "buenos aires night"] },
  { slug: "brazil-rhythm", destination: "巴西", region: "南美洲", desc: "里约·伊瓜苏·雨林", galleryKeywords: ["rio de janeiro christ redeemer", "iguazu falls brazil", "brazil amazon rainforest", "rio copacabana beach", "brazilian feijoada food", "rio sunset sugarloaf"] },
  { slug: "colombia-coffee", destination: "哥伦比亚", region: "南美洲", desc: "咖啡三角·卡塔赫纳", galleryKeywords: ["colombia coffee plantation", "cartagena colombia colorful", "colombia salento valley", "colombia coffee hacienda", "colombian arepa food", "cartagena sunset"] },

  // ===== 大洋洲 =====
  { slug: "australia-down-under", destination: "澳大利亚", region: "大洋洲", desc: "悉尼·大堡礁·乌鲁鲁", galleryKeywords: ["sydney opera house", "great barrier reef australia", "uluru australia outback", "sydney harbour bridge", "australian fine dining", "sydney sunset harbour"] },
  { slug: "new-zealand", destination: "新西兰", region: "大洋洲", desc: "南岛·峡湾·中土", galleryKeywords: ["new zealand milford sound", "new zealand mountain lake", "new zealand lodge", "new zealand queenstown", "new zealand maori", "mount cook new zealand sunset"] },
  { slug: "fiji-paradise", destination: "斐济", region: "大洋洲", desc: "私人岛屿·水上别墅", galleryKeywords: ["fiji overwater villa", "fiji tropical beach", "fiji island resort", "fiji coral reef snorkeling", "fiji kava ceremony", "fiji sunset lagoon"] },

  // ===== 极地与中东 =====
  { slug: "antarctica-expedition", destination: "南极半岛", region: "极地与中东", desc: "白色大陆的终极远征", galleryKeywords: ["antarctica iceberg", "antarctica penguin", "antarctica expedition ship", "antarctica glacier", "antarctica whale", "antarctica sunset ice"] },
  { slug: "greenland-arctic", destination: "格陵兰", region: "极地与中东", desc: "冰峡湾·北极光·狗拉雪橇", galleryKeywords: ["greenland iceberg ilulissat", "greenland northern lights", "greenland dog sled", "greenland arctic hotel", "greenland inuit village", "greenland ice cap"] },
  { slug: "mongolia-steppe", destination: "蒙古", region: "极地与中东", desc: "戈壁·草原·鹰猎人", galleryKeywords: ["mongolia gobi desert", "mongolia eagle hunter kazakh", "mongolia ger camp", "mongolia grassland horse", "mongolian nomad", "mongolia starry night steppe"] },
  { slug: "oman-incense", destination: "阿曼", region: "极地与中东", desc: "马斯喀特·乳香·沙漠", galleryKeywords: ["oman muscat mosque", "oman wahiba desert dunes", "oman grand mosque", "oman dhow boat fjord", "oman souk spice", "oman desert night stars"] },
  { slug: "papua-new-guinea-tribes", destination: "巴布亚新几内亚", region: "极地与中东", desc: "部落节·Sepik河·石器时代", galleryKeywords: ["papua new guinea tribe singsing", "papua new guinea huli wigman", "papua new guinea sepik river", "papua new guinea bird of paradise", "papua new guinea island beach", "papua new guinea tribal mask"] },
];

// 工具函数：按大洲分组
export function groupByRegion() {
  const groups: Record<string, JourneyMeta[]> = {};
  for (const meta of journeysMeta) {
    if (!groups[meta.region]) groups[meta.region] = [];
    groups[meta.region].push(meta);
  }
  return REGION_ORDER
    .filter((r) => groups[r]?.length)
    .map((r) => ({ region: r, destinations: groups[r] }));
}

// 工具函数：slug → meta
export function getMetaBySlug(slug: string) {
  return journeysMeta.find((m) => m.slug === slug);
}
