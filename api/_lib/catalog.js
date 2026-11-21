// Real US grocery catalog — product names/brands sourced from Open Food Facts (openfoodfacts.org).
// Prices are realistic 2026 US averages. Shape matches Kroger/Instacart/Coupons.com partner APIs.
// To connect live data: implement the exported functions against partner feeds — nothing else changes.

export const STORES = [
  { id: 'freshmart',   name: 'FreshMart',   icon: '🟢', distance_mi: 0.4, drive_min: 3,  base_mult: 1.00 },
  { id: 'valumart',    name: 'ValuMart',    icon: '🔵', distance_mi: 1.9, drive_min: 8,  base_mult: 0.87 },
  { id: 'greengrocer', name: 'GreenGrocer', icon: '🟠', distance_mi: 0.9, drive_min: 5,  base_mult: 1.09 },
];

// dept values: Produce · Dairy · Meat · Seafood · Bakery · Cereal · Snacks · Pasta · Canned · Condiments · Beverages · Frozen · Household
// var: [freshmart_mult, valumart_mult, greengrocer_mult] applied on top of store base_mult

export const CATALOG = {
  // ── PRODUCE  (x=-6, z=-7…3) ────────────────────────────────────────────────
  'bananas':          { name:'Bananas (bunch)',         brand:'Dole',               icon:'🍌', dept:'Produce',    aisle:'Produce · P1',    x:-6, z:-7,  base_price:1.49, was:null,  stock:true,  var:[1.00,0.95,1.05], synonyms:['banana','fruit'] },
  'strawberries':     { name:'Strawberries 16oz',       brand:"Driscoll's",         icon:'🍓', dept:'Produce',    aisle:'Produce · P1',    x:-6, z:-6,  base_price:4.99, was:5.99,  stock:true,  var:[1.00,0.92,1.10], synonyms:['strawberry','berries'], coupon:{id:'c-straw',amount:'$1',sub:'OFF',title:"Driscoll's berries",source:'Manufacturer',value_cents:100} },
  'blueberries':      { name:'Blueberries 1 pint',      brand:'Naturipe',           icon:'🫐', dept:'Produce',    aisle:'Produce · P1',    x:-6, z:-6,  base_price:3.99, was:null,  stock:true,  var:[1.00,0.90,1.08], synonyms:['blueberry','berries'] },
  'raspberries':      { name:'Raspberries 6oz',         brand:"Driscoll's",         icon:'🍓', dept:'Produce',    aisle:'Produce · P1',    x:-6, z:-5,  base_price:3.49, was:null,  stock:true,  var:[1.00,0.88,1.12], synonyms:['raspberry','berries'] },
  'avocado':          { name:'Avocado (each)',           brand:'Organic',            icon:'🥑', dept:'Produce',    aisle:'Produce · P2',    x:-6, z:-5,  base_price:1.49, was:null,  stock:true,  var:[1.00,0.90,1.15], synonyms:['avo','avocados'] },
  'baby-spinach':     { name:'Baby Spinach 5oz',        brand:'Earthbound Farm',    icon:'🥬', dept:'Produce',    aisle:'Produce · P2',    x:-6, z:-4,  base_price:3.99, was:null,  stock:true,  var:[1.00,0.88,1.10], synonyms:['spinach','greens','salad'], swap:{name:'Store-brand spinach',save_cents:110} },
  'broccoli':         { name:'Broccoli Crown',          brand:'Fresh',              icon:'🥦', dept:'Produce',    aisle:'Produce · P2',    x:-6, z:-4,  base_price:2.49, was:null,  stock:true,  var:[1.00,0.92,1.08], synonyms:['brocoli'] },
  'baby-carrots':     { name:'Baby Carrots 2lb',        brand:'Grimmway Farms',     icon:'🥕', dept:'Produce',    aisle:'Produce · P2',    x:-6, z:-3,  base_price:2.99, was:null,  stock:true,  var:[1.00,0.88,1.05], synonyms:['carrots','carrot'] },
  'grape-tomatoes':   { name:'Grape Tomatoes pint',     brand:'Sunset',             icon:'🍅', dept:'Produce',    aisle:'Produce · P3',    x:-6, z:-3,  base_price:3.49, was:null,  stock:true,  var:[1.00,0.90,1.10], synonyms:['tomato','tomatoes','cherry tomatoes'] },
  'bell-pepper':      { name:'Bell Peppers 3pk',        brand:'Fresh',              icon:'🫑', dept:'Produce',    aisle:'Produce · P3',    x:-6, z:-2,  base_price:3.99, was:null,  stock:true,  var:[1.05,0.90,1.00], synonyms:['pepper','peppers'] },
  'yellow-onion':     { name:'Yellow Onions 3lb',       brand:'Fresh',              icon:'🧅', dept:'Produce',    aisle:'Produce · P3',    x:-6, z:-2,  base_price:2.49, was:null,  stock:true,  var:[1.00,0.85,1.05], synonyms:['onion','onions'] },
  'garlic':           { name:'Garlic 3-pack',           brand:'Christopher Ranch',  icon:'🧄', dept:'Produce',    aisle:'Produce · P3',    x:-6, z:-1,  base_price:1.99, was:null,  stock:true,  var:[1.00,0.88,1.10], synonyms:['garlic'] },
  'lemons':           { name:'Lemons 2lb bag',          brand:'Sunkist',            icon:'🍋', dept:'Produce',    aisle:'Produce · P4',    x:-6, z:-1,  base_price:3.49, was:null,  stock:true,  var:[1.00,0.90,1.08], synonyms:['lemon','citrus'] },
  'gala-apples':      { name:'Gala Apples 3lb',         brand:'Stemilt',            icon:'🍎', dept:'Produce',    aisle:'Produce · P4',    x:-6, z:0,   base_price:4.99, was:null,  stock:true,  var:[1.00,0.88,1.05], synonyms:['apple','apples','fruit'] },
  'mandarins':        { name:'Mandarins 3lb',           brand:'Sun Pacific',        icon:'🍊', dept:'Produce',    aisle:'Produce · P4',    x:-6, z:0,   base_price:5.99, was:null,  stock:true,  var:[1.00,0.88,1.08], synonyms:['mandarin','clementine','citrus','oranges'] },
  'bananas-organic':  { name:'Organic Bananas (bunch)', brand:'Chiquita Organic',   icon:'🍌', dept:'Produce',    aisle:'Produce · P4',    x:-6, z:1,   base_price:1.79, was:null,  stock:true,  var:[1.00,0.95,0.98], synonyms:['organic banana'] },

  // ── BAKERY  (x=-6, z=3…5) ──────────────────────────────────────────────────
  'sourdough-bread':  { name:"Dave's Killer Bread 27oz", brand:"Dave's Killer Bread", icon:'🍞', dept:'Bakery', aisle:'Bakery · BK1', x:-6, z:3, base_price:6.99, was:7.99, stock:true, var:[1.00,0.92,1.05], synonyms:['bread','sourdough','loaf'], coupon:{id:'c-dkb',amount:'$1',sub:'OFF',title:"Dave's Killer Bread",source:'Manufacturer',value_cents:100}, swap:{name:'Store-brand whole wheat bread',save_cents:250} },
  'whole-wheat-bread':{ name:'Whole Wheat Bread 20oz',  brand:"Nature's Own",        icon:'🍞', dept:'Bakery', aisle:'Bakery · BK1', x:-6, z:3, base_price:4.99, was:null,  stock:true, var:[1.00,0.90,1.05], synonyms:['bread','wheat','loaf'], swap:{name:'Store-brand bread',save_cents:150} },
  'bagels':           { name:'Bagels 6-count',           brand:"Thomas'",             icon:'🥯', dept:'Bakery', aisle:'Bakery · BK2', x:-6, z:4, base_price:4.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['bagel'] },
  'flour-tortillas':  { name:'Flour Tortillas 10-count', brand:'Mission',             icon:'🫓', dept:'Bakery', aisle:'Bakery · BK2', x:-6, z:4, base_price:3.49, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['tortilla','wrap','wraps'] },
  'english-muffins':  { name:'English Muffins 6-count', brand:"Thomas'",             icon:'🥞', dept:'Bakery', aisle:'Bakery · BK2', x:-6, z:5, base_price:4.49, was:null,  stock:true, var:[1.00,0.90,1.05], synonyms:['muffin','english muffin'] },

  // ── DAIRY & EGGS  (x=6, z=-7…0) ────────────────────────────────────────────
  'whole-milk':       { name:'Whole Milk 1 gallon',     brand:'Organic Valley',     icon:'🥛', dept:'Dairy', aisle:'Dairy · D1', x:6, z:-7, base_price:6.49, was:null,  stock:true, var:[1.00,0.85,1.08], synonyms:['milk','gallon milk'] },
  'oat-milk':         { name:'Oat Milk Original 52oz',  brand:'Oatly',              icon:'🥛', dept:'Dairy', aisle:'Dairy · D1', x:6, z:-6, base_price:5.49, was:6.49, stock:true, var:[1.00,0.96,0.98], synonyms:['oat milk','oatmilk','dairy free milk'], coupon:{id:'c-oatly',amount:'$1',sub:'OFF',title:'Oatly any carton',source:'Manufacturer',value_cents:100}, swap:{name:'Store-brand oat milk',save_cents:180} },
  'almond-milk':      { name:'Almond Milk Unsweetened', brand:'Blue Diamond',       icon:'🥛', dept:'Dairy', aisle:'Dairy · D1', x:6, z:-6, base_price:3.99, was:null,  stock:true, var:[1.00,0.90,1.00], synonyms:['almond milk','almondmilk','dairy free'] },
  'butter':           { name:'Butter 8oz',              brand:'Kerrygold',          icon:'🧈', dept:'Dairy', aisle:'Dairy · D2', x:6, z:-5, base_price:6.99, was:8.49, stock:true, var:[1.00,0.88,1.10], synonyms:['butter','irish butter'], coupon:{id:'c-kerrygold',amount:'$1.50',sub:'OFF',title:'Kerrygold butter',source:'Manufacturer',value_cents:150}, swap:{name:'Store-brand unsalted butter',save_cents:280} },
  'large-eggs':       { name:'Large Eggs 12-count',     brand:'Vital Farms',        icon:'🥚', dept:'Dairy', aisle:'Dairy · D2', x:6, z:-5, base_price:5.99, was:null,  stock:true, var:[1.00,0.82,1.12], synonyms:['eggs','egg','dozen'], coupon:{id:'c-eggs',amount:'$1',sub:'OFF',title:'Any eggs 12ct',source:'Manufacturer',value_cents:100}, swap:{name:'Store-brand large eggs',save_cents:200} },
  'cream-cheese':     { name:'Cream Cheese 8oz',        brand:'Philadelphia',       icon:'🧀', dept:'Dairy', aisle:'Dairy · D2', x:6, z:-4, base_price:3.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['cream cheese','philadelphia'] },
  'cheddar-cheese':   { name:'Cheddar Cheese Block 16oz',brand:'Tillamook',         icon:'🧀', dept:'Dairy', aisle:'Dairy · D3', x:6, z:-4, base_price:7.99, was:9.49, stock:true, var:[1.00,0.85,1.08], synonyms:['cheddar','cheese','tillamook'], coupon:{id:'c-tilla',amount:'$1.50',sub:'OFF',title:'Tillamook cheese',source:'Manufacturer',value_cents:150}, swap:{name:'Store-brand cheddar block',save_cents:280} },
  'shredded-mozzarella':{ name:'Shredded Mozzarella 16oz',brand:'Sargento',         icon:'🧀', dept:'Dairy', aisle:'Dairy · D3', x:6, z:-3, base_price:5.49, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['mozzarella','mozz','pizza cheese','shredded cheese'] },
  'parmesan':         { name:'Parmesan Wedge 6oz',      brand:'BelGioioso',         icon:'🧀', dept:'Dairy', aisle:'Dairy · D3', x:6, z:-3, base_price:5.99, was:null,  stock:true, var:[1.00,0.90,1.05], synonyms:['parmesan','parm','grated cheese'] },
  'greek-yogurt':     { name:'Greek Yogurt Plain 32oz', brand:'Chobani',            icon:'🥣', dept:'Dairy', aisle:'Dairy · D3', x:6, z:-2, base_price:5.99, was:6.99, stock:true, var:[1.00,0.88,1.08], synonyms:['yogurt','greek yogurt','chobani'], coupon:{id:'c-chobani',amount:'$0.75',sub:'OFF',title:'Chobani any 32oz',source:'Manufacturer',value_cents:75} },
  'cottage-cheese':   { name:'Cottage Cheese 24oz',     brand:'Daisy',              icon:'🥛', dept:'Dairy', aisle:'Dairy · D4', x:6, z:-2, base_price:4.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['cottage cheese'] },
  'sour-cream':       { name:'Sour Cream 16oz',         brand:'Daisy',              icon:'🥛', dept:'Dairy', aisle:'Dairy · D4', x:6, z:-1, base_price:2.99, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['sour cream','sourcream'] },
  'heavy-cream':      { name:'Heavy Whipping Cream 1pt',brand:'Organic Valley',     icon:'🥛', dept:'Dairy', aisle:'Dairy · D4', x:6, z:-1, base_price:4.99, was:null,  stock:true, var:[1.00,0.90,1.08], synonyms:['heavy cream','whipping cream','cream'] },
  'orange-juice':     { name:'Orange Juice 52oz',       brand:'Tropicana',          icon:'🧃', dept:'Dairy', aisle:'Dairy · D4', x:6, z:0,  base_price:5.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['oj','juice','tropicana'], coupon:{id:'c-trop',amount:'$0.75',sub:'OFF',title:'Tropicana 52oz',source:'Manufacturer',value_cents:75}, swap:{name:'Store-brand OJ',save_cents:150} },

  // ── MEAT  (x=6, z=2…5) ─────────────────────────────────────────────────────
  'chicken-breast':   { name:'Chicken Breast 1lb',      brand:'Fresh',              icon:'🍗', dept:'Meat', aisle:'Meat · MT1',  x:6, z:2, base_price:7.99, was:9.49, stock:true, var:[1.10,0.86,1.02], synonyms:['chicken','poultry'], coupon:{id:'c-chicken',amount:'$1.50',sub:'OFF/lb',title:'Fresh poultry',source:'Loyalty',value_cents:150} },
  'ground-beef':      { name:'Ground Beef 80/20 1lb',   brand:'Fresh',              icon:'🥩', dept:'Meat', aisle:'Meat · MT1',  x:6, z:3, base_price:6.99, was:8.49, stock:true, var:[1.05,0.88,1.02], synonyms:['beef','hamburger','ground meat'] },
  'bacon':            { name:'Bacon 12oz',               brand:'Applegate',          icon:'🥓', dept:'Meat', aisle:'Meat · MT2',  x:6, z:3, base_price:7.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['bacon'], coupon:{id:'c-bacon',amount:'$1',sub:'OFF',title:'Applegate meats',source:'Manufacturer',value_cents:100} },
  'pork-chops':       { name:'Pork Chops 1lb',          brand:'Fresh',              icon:'🥩', dept:'Meat', aisle:'Meat · MT2',  x:6, z:4, base_price:5.99, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['pork','chops'] },
  'deli-turkey':      { name:'Turkey Breast 1lb',       brand:"Boar's Head",        icon:'🦃', dept:'Meat', aisle:'Meat · MT2',  x:6, z:4, base_price:8.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['turkey','deli turkey','lunch meat','deli meat'] },
  'deli-ham':         { name:'Ham 1lb',                 brand:"Boar's Head",        icon:'🍖', dept:'Meat', aisle:'Meat · MT3',  x:6, z:5, base_price:7.99, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['ham','deli ham','lunch meat'] },
  'rotisserie-chicken':{ name:'Rotisserie Chicken',     brand:'Fresh',              icon:'🍗', dept:'Meat', aisle:'Meat · MT3',  x:6, z:5, base_price:9.99, was:null,  stock:true, var:[1.00,0.90,1.05], synonyms:['rotisserie','whole chicken','prepared chicken'] },

  // ── SEAFOOD  (x=6, z=6…8) ──────────────────────────────────────────────────
  'salmon':           { name:'Atlantic Salmon 1lb',     brand:'Fresh',              icon:'🐟', dept:'Seafood', aisle:'Seafood · SF1', x:6, z:7, base_price:12.99, was:14.99, stock:true, var:[0.95,1.10,0.83], synonyms:['salmon','fish'], coupon:{id:'c-salmon',amount:'$2',sub:'OFF/lb',title:'Atlantic salmon',source:'Loyalty',value_cents:200} },
  'shrimp':           { name:'Shrimp 1lb (31-40ct)',    brand:'Fresh',              icon:'🦐', dept:'Seafood', aisle:'Seafood · SF1', x:6, z:7, base_price:10.99, was:12.99, stock:true, var:[1.00,0.92,1.05], synonyms:['shrimp','prawns','seafood'] },
  'tilapia':          { name:'Tilapia Fillets 1lb',     brand:'Fresh',              icon:'🐠', dept:'Seafood', aisle:'Seafood · SF1', x:6, z:8, base_price:7.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['tilapia','fish','white fish'] },
  'tuna-can':         { name:'Chunk Light Tuna 5oz',    brand:'StarKist',           icon:'🐟', dept:'Seafood', aisle:'Seafood · SF2', x:6, z:8, base_price:1.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['tuna','canned tuna','starkist'] },

  // ── CEREALS & BREAKFAST  (x=-2, z=-7…-5) ───────────────────────────────────
  'cheerios':         { name:'Cheerios 18oz',           brand:'General Mills',      icon:'🥣', dept:'Cereal', aisle:'Cereal · CR1', x:-2, z:-7, base_price:4.99, was:null,  stock:true, var:[1.00,0.90,1.05], synonyms:['cheerios','cereal','oat cereal'], coupon:{id:'c-cheerios',amount:'$1',sub:'OFF',title:'General Mills cereals',source:'Manufacturer',value_cents:100}, swap:{name:"Store-brand toasted oat O's",save_cents:200} },
  'honey-nut-cheerios':{ name:'Honey Nut Cheerios 18oz',brand:'General Mills',     icon:'🥣', dept:'Cereal', aisle:'Cereal · CR1', x:-2, z:-7, base_price:5.49, was:null,  stock:true, var:[1.00,0.90,1.05], synonyms:['honey nut cheerios','honey cheerios','cereal'], coupon:{id:'c-hn-cheerios',amount:'$1',sub:'OFF',title:'General Mills cereals',source:'Manufacturer',value_cents:100} },
  'grape-nuts':       { name:'Grape-Nuts 20.5oz',       brand:'Post',               icon:'🥣', dept:'Cereal', aisle:'Cereal · CR1', x:-2, z:-6, base_price:5.49, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['grape nuts','cereal','post'] },
  'rolled-oats':      { name:'Old Fashioned Rolled Oats 18oz', brand:'Quaker',     icon:'🌾', dept:'Cereal', aisle:'Cereal · CR2', x:-2, z:-6, base_price:4.49, was:null,  stock:true, var:[0.88,1.05,1.00], synonyms:['oats','oatmeal','quaker oats'], coupon:{id:'c-oats',amount:'$1',sub:'OFF',title:'Quaker oat products',source:'Manufacturer',value_cents:100}, swap:{name:'Store-brand rolled oats',save_cents:120} },
  'instant-oatmeal':  { name:'Instant Oatmeal Variety 10ct', brand:'Quaker',       icon:'🌾', dept:'Cereal', aisle:'Cereal · CR2', x:-2, z:-5, base_price:4.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['instant oatmeal','quick oats','oatmeal packets'] },
  'granola':          { name:'Original Granola 12oz',   brand:'Purely Elizabeth',   icon:'🌾', dept:'Cereal', aisle:'Cereal · CR2', x:-2, z:-5, base_price:8.99, was:null,  stock:true, var:[1.00,0.92,0.95], synonyms:['granola'], coupon:{id:'c-granola',amount:'$1.50',sub:'OFF',title:'Purely Elizabeth granola',source:'Manufacturer',value_cents:150} },
  'nature-valley-bars':{ name:'Oats & Honey Bars 12ct', brand:'Nature Valley',     icon:'🍫', dept:'Cereal', aisle:'Cereal · CR3', x:-2, z:-5, base_price:4.99, was:null,  stock:true, var:[1.00,0.90,1.05], synonyms:['nature valley','granola bar','snack bar','bars'], coupon:{id:'c-nv',amount:'$1',sub:'OFF',title:'Nature Valley bars',source:'Manufacturer',value_cents:100} },

  // ── SNACKS & NUTS  (x=-2, z=-3…-1) ─────────────────────────────────────────
  'potato-chips':     { name:'Classic Potato Chips 8oz',brand:"Lay's",              icon:'🥔', dept:'Snacks', aisle:'Snacks · SN1', x:-2, z:-3, base_price:4.49, was:null,  stock:true, var:[1.00,0.90,1.05], synonyms:['chips','lays','potato chips','crisps'], coupon:{id:'c-lays',amount:'$0.75',sub:'OFF',title:"Lay's chips",source:'Manufacturer',value_cents:75}, swap:{name:'Store-brand chips',save_cents:150} },
  'tortilla-chips':   { name:'Tortilla Chips 13oz',     brand:'Tostitos',           icon:'🫓', dept:'Snacks', aisle:'Snacks · SN1', x:-2, z:-3, base_price:4.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['tortilla chips','tostitos','nachos chips'], swap:{name:'Store-brand tortilla chips',save_cents:150} },
  'pretzels':         { name:'Pretzels Original 16oz',  brand:'Snyder\'s',          icon:'🥨', dept:'Snacks', aisle:'Snacks · SN1', x:-2, z:-2, base_price:3.99, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['pretzels','pretzel'] },
  'trail-mix':        { name:'Trail Mix 26oz',           brand:'Planters',           icon:'🥜', dept:'Snacks', aisle:'Snacks · SN2', x:-2, z:-2, base_price:7.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['trail mix','nuts and dried fruit'] },
  'peanut-butter':    { name:'Creamy Peanut Butter 28oz',brand:'Jif',               icon:'🥜', dept:'Snacks', aisle:'Snacks · SN2', x:-2, z:-2, base_price:7.99, was:9.49, stock:true, var:[1.00,0.88,1.05], synonyms:['peanut butter','jif','pb'], coupon:{id:'c-jif',amount:'$1',sub:'OFF',title:'Jif peanut butter',source:'Manufacturer',value_cents:100}, swap:{name:'Store-brand peanut butter',save_cents:200} },
  'almonds':          { name:'Almonds Roasted 16oz',    brand:'Blue Diamond',       icon:'🌰', dept:'Snacks', aisle:'Snacks · SN2', x:-2, z:-1, base_price:9.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['almonds','almond','nuts'], coupon:{id:'c-almonds',amount:'$1',sub:'OFF',title:'Blue Diamond nuts',source:'Manufacturer',value_cents:100} },
  'cashews':          { name:'Cashews Whole 16oz',      brand:'Kirkland',           icon:'🌰', dept:'Snacks', aisle:'Snacks · SN3', x:-2, z:-1, base_price:10.99, was:null, stock:true, var:[1.00,0.88,1.05], synonyms:['cashews','cashew','nuts'] },
  'mixed-nuts':       { name:'Mixed Nuts Salted 16oz',  brand:'Planters',           icon:'🥜', dept:'Snacks', aisle:'Snacks · SN3', x:-2, z:-1, base_price:9.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['mixed nuts','nuts'] },
  'protein-bars':     { name:'Protein Bars 12-count',   brand:'Kind',               icon:'🍫', dept:'Snacks', aisle:'Snacks · SN3', x:-2, z:0,  base_price:19.99, was:null, stock:true, var:[1.00,0.92,1.02], synonyms:['protein bar','kind bar','energy bar','snack bar'] },
  'dark-chocolate':   { name:'Dark Chocolate 72% 3.5oz',brand:'Lindt Excellence',   icon:'🍫', dept:'Snacks', aisle:'Snacks · SN3', x:-2, z:0,  base_price:3.99, was:null,  stock:true, var:[1.00,0.88,1.08], synonyms:['chocolate','dark chocolate'] },
  'salsa':            { name:'Medium Salsa 24oz',       brand:'Pace',               icon:'🫙', dept:'Snacks', aisle:'Snacks · SN2', x:-2, z:-3, base_price:3.99, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['salsa','dip','picante'] },

  // ── PASTA, GRAINS & RICE  (x=-2, z=1…4) ────────────────────────────────────
  'spaghetti':        { name:'Spaghetti 1lb',            brand:'Barilla',            icon:'🍝', dept:'Pasta', aisle:'Pasta · PA1', x:-2, z:1,  base_price:1.99, was:2.49, stock:true, var:[1.00,0.82,1.15], synonyms:['spaghetti','pasta','noodles'], coupon:{id:'c-barilla',amount:'3/$4',sub:'MIX',title:'Barilla pasta',source:'Coupons.com',value_cents:50}, swap:{name:'Store-brand spaghetti',save_cents:80} },
  'penne':            { name:'Penne 1lb',                brand:'Barilla',            icon:'🍝', dept:'Pasta', aisle:'Pasta · PA1', x:-2, z:1,  base_price:1.99, was:null,  stock:true, var:[1.00,0.82,1.15], synonyms:['penne','pasta'], swap:{name:'Store-brand penne',save_cents:70} },
  'rotini':           { name:'Rotini 1lb',               brand:'Barilla',            icon:'🍝', dept:'Pasta', aisle:'Pasta · PA1', x:-2, z:1,  base_price:1.99, was:null,  stock:true, var:[1.00,0.82,1.15], synonyms:['rotini','pasta','spirals'] },
  'mac-and-cheese':   { name:'Mac & Cheese 7.25oz',      brand:'Kraft',              icon:'🧀', dept:'Pasta', aisle:'Pasta · PA1', x:-2, z:2,  base_price:1.49, was:null,  stock:true, var:[1.00,0.85,1.10], synonyms:['mac and cheese','mac cheese','macaroni','kraft'], swap:{name:'Store-brand mac & cheese',save_cents:60} },
  'ramen-noodles':    { name:'Ramen Noodles Chicken',    brand:'Maruchan',           icon:'🍜', dept:'Pasta', aisle:'Pasta · PA2', x:-2, z:2,  base_price:0.49, was:null,  stock:true, var:[1.00,0.88,1.20], synonyms:['ramen','noodles','instant noodles','maruchan'] },
  'brown-rice':       { name:'Brown Rice 2lb',           brand:'Minute',             icon:'🍚', dept:'Pasta', aisle:'Pasta · PA2', x:-2, z:3,  base_price:4.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['brown rice','rice'], swap:{name:'Store-brand brown rice',save_cents:150} },
  'white-rice':       { name:'White Rice 5lb',           brand:'Mahatma',            icon:'🍚', dept:'Pasta', aisle:'Pasta · PA2', x:-2, z:3,  base_price:6.49, was:null,  stock:true, var:[1.00,0.85,1.05], synonyms:['white rice','rice','long grain rice'] },
  'quinoa':           { name:'Quinoa 16oz',              brand:'Ancient Harvest',    icon:'🌾', dept:'Pasta', aisle:'Pasta · PA3', x:-2, z:4,  base_price:6.99, was:null,  stock:true, var:[1.00,0.90,0.98], synonyms:['quinoa','grain'] },
  'bread-crumbs':     { name:'Italian Bread Crumbs 8oz', brand:'Progresso',          icon:'🍞', dept:'Pasta', aisle:'Pasta · PA3', x:-2, z:4,  base_price:2.99, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['bread crumbs','breadcrumbs'] },

  // ── CANNED GOODS & SOUPS  (x=-2, z=5…7) ────────────────────────────────────
  'black-beans':      { name:'Black Beans 15oz',         brand:"Bush's",             icon:'🫘', dept:'Canned', aisle:'Canned · CN1', x:-2, z:5,  base_price:1.49, was:null,  stock:true, var:[1.00,0.85,1.05], synonyms:['black beans','beans'] },
  'chickpeas':        { name:'Chickpeas 15oz',           brand:'Eden',               icon:'🫘', dept:'Canned', aisle:'Canned · CN1', x:-2, z:5,  base_price:1.99, was:null,  stock:true, var:[1.00,0.85,1.00], synonyms:['chickpeas','garbanzo beans','garbanzos'] },
  'diced-tomatoes':   { name:'Diced Tomatoes 14.5oz',   brand:"Hunt's",             icon:'🍅', dept:'Canned', aisle:'Canned · CN1', x:-2, z:6,  base_price:1.49, was:null,  stock:true, var:[1.00,0.85,1.02], synonyms:['diced tomatoes','canned tomatoes','tomatoes'] },
  'tomato-paste':     { name:'Tomato Paste 6oz',         brand:"Hunt's",             icon:'🍅', dept:'Canned', aisle:'Canned · CN1', x:-2, z:6,  base_price:0.99, was:null,  stock:true, var:[1.00,0.85,1.02], synonyms:['tomato paste','paste'] },
  'chicken-broth':    { name:'Chicken Broth 32oz',       brand:'Swanson',            icon:'🍲', dept:'Canned', aisle:'Canned · CN2', x:-2, z:6,  base_price:3.49, was:null,  stock:true, var:[1.00,0.85,1.05], synonyms:['chicken broth','stock','broth'] },
  'tomato-soup':      { name:'Tomato Soup 10.75oz',      brand:"Campbell's",         icon:'🍲', dept:'Canned', aisle:'Canned · CN2', x:-2, z:7,  base_price:1.49, was:null,  stock:true, var:[1.00,0.85,1.05], synonyms:['tomato soup','soup','campbells'] },
  'corn':             { name:'Sweet Corn 15oz',          brand:"Green Giant",        icon:'🌽', dept:'Canned', aisle:'Canned · CN2', x:-2, z:7,  base_price:1.29, was:null,  stock:true, var:[1.00,0.85,1.02], synonyms:['corn','canned corn','sweet corn'] },
  'coconut-milk-can': { name:'Coconut Milk 13.5oz',      brand:'Thai Kitchen',       icon:'🥥', dept:'Canned', aisle:'Canned · CN2', x:-2, z:7,  base_price:2.49, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['coconut milk','thai kitchen'] },

  // ── CONDIMENTS & SAUCES  (x=2, z=-7…-4) ────────────────────────────────────
  'marinara-sauce':   { name:'Marinara Sauce 24oz',      brand:"Rao's Homemade",     icon:'🫙', dept:'Condiments', aisle:'Condiments · C1', x:2, z:-7, base_price:8.99, was:10.49, stock:true, var:[1.00,0.92,0.98], synonyms:['marinara','pasta sauce','tomato sauce','raos'], coupon:{id:'c-raos',amount:'$2',sub:'OFF',title:"Rao's any sauce",source:'Manufacturer',value_cents:200} },
  'olive-oil':        { name:'Olive Oil EVOO 16.9oz',    brand:'California Olive Ranch',icon:'🫙',dept:'Condiments',aisle:'Condiments · C1',x:2, z:-6, base_price:9.99, was:null,  stock:true, var:[1.00,0.88,0.98], synonyms:['olive oil','evoo','oil'], coupon:{id:'c-oo',amount:'$1.50',sub:'OFF',title:'California Olive Ranch',source:'Manufacturer',value_cents:150} },
  'ketchup':          { name:'Tomato Ketchup 32oz',      brand:'Heinz',              icon:'🫙', dept:'Condiments', aisle:'Condiments · C2', x:2, z:-6, base_price:3.99, was:null,  stock:true, var:[1.00,0.85,1.02], synonyms:['ketchup','catsup','heinz'], coupon:{id:'c-heinz',amount:'$0.75',sub:'OFF',title:'Heinz ketchup',source:'Manufacturer',value_cents:75}, swap:{name:'Store-brand ketchup',save_cents:120} },
  'yellow-mustard':   { name:'Classic Yellow Mustard 14oz',brand:"French's",         icon:'🫙', dept:'Condiments', aisle:'Condiments · C2', x:2, z:-6, base_price:2.49, was:null,  stock:true, var:[1.00,0.85,1.02], synonyms:['mustard','yellow mustard','frenchs'] },
  'mayo':             { name:'Real Mayonnaise 20oz',     brand:"Hellmann's",         icon:'🫙', dept:'Condiments', aisle:'Condiments · C2', x:2, z:-5, base_price:5.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['mayo','mayonnaise','hellmanns'], coupon:{id:'c-mayo',amount:'$1',sub:'OFF',title:"Hellmann's mayo",source:'Manufacturer',value_cents:100}, swap:{name:'Store-brand mayo',save_cents:180} },
  'sriracha':         { name:'Sriracha Hot Sauce 17oz',  brand:'Huy Fong',           icon:'🌶️', dept:'Condiments', aisle:'Condiments · C3', x:2, z:-5, base_price:3.99, was:null,  stock:true, var:[1.00,0.90,1.05], synonyms:['sriracha','hot sauce','chili sauce','huy fong'] },
  'hot-sauce':        { name:"Original Hot Sauce 12oz", brand:"Frank's RedHot",     icon:'🌶️', dept:'Condiments', aisle:'Condiments · C3', x:2, z:-5, base_price:3.49, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['hot sauce','franks','buffalo sauce'] },
  'soy-sauce':        { name:'Soy Sauce 10oz',           brand:'Kikkoman',           icon:'🫙', dept:'Condiments', aisle:'Condiments · C3', x:2, z:-4, base_price:3.49, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['soy sauce','soya sauce','kikkoman'] },
  'ranch-dressing':   { name:'Ranch Dressing 16oz',      brand:'Hidden Valley',      icon:'🫙', dept:'Condiments', aisle:'Condiments · C3', x:2, z:-4, base_price:3.99, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['ranch','dressing','hidden valley'] },
  'hummus':           { name:'Classic Hummus 10oz',      brand:'Sabra',              icon:'🫙', dept:'Condiments', aisle:'Condiments · C3', x:2, z:-4, base_price:4.99, was:null,  stock:true, var:[1.00,0.90,0.98], synonyms:['hummus','sabra','dip'] },

  // ── BEVERAGES  (x=2, z=-2…0) ────────────────────────────────────────────────
  'coffee':           { name:'Pike Place Coffee 12oz',   brand:'Starbucks',          icon:'☕', dept:'Beverages', aisle:'Beverages · BV1', x:2, z:-2, base_price:11.99, was:13.99, stock:true, var:[0.88,1.05,1.00], synonyms:['coffee','starbucks','ground coffee'], coupon:{id:'c-coffee',amount:'$3',sub:'OFF',title:'Starbucks bagged coffee',source:'Sponsored',sponsored:true,value_cents:300}, swap:{name:'Store-brand medium roast',save_cents:350} },
  'green-tea':        { name:'Green Tea 20-count',       brand:'Bigelow',            icon:'🍵', dept:'Beverages', aisle:'Beverages · BV1', x:2, z:-2, base_price:5.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['green tea','tea','bigelow'] },
  'sparkling-water':  { name:'Sparkling Water 12-pack',  brand:'LaCroix',            icon:'💧', dept:'Beverages', aisle:'Beverages · BV2', x:2, z:-1, base_price:5.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['sparkling water','seltzer','lacroix','fizzy water'] },
  'coca-cola':        { name:'Coca-Cola 12-pack',        brand:'Coca-Cola',          icon:'🥤', dept:'Beverages', aisle:'Beverages · BV2', x:2, z:-1, base_price:7.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['coke','cola','soda','coca cola'], swap:{name:'Store-brand cola',save_cents:200} },
  'sports-drink':     { name:'Gatorade 28oz',            brand:'Gatorade',           icon:'🥤', dept:'Beverages', aisle:'Beverages · BV2', x:2, z:0,  base_price:1.99, was:null,  stock:true, var:[1.00,0.85,1.02], synonyms:['gatorade','sports drink','electrolytes'] },
  'coconut-water':    { name:'Coconut Water 1L',         brand:'Vita Coco',          icon:'🥥', dept:'Beverages', aisle:'Beverages · BV3', x:2, z:0,  base_price:4.99, was:null,  stock:true, var:[1.00,0.90,0.98], synonyms:['coconut water','vita coco'] },
  'cold-brew-coffee': { name:'Cold Brew Coffee 48oz',    brand:'Chameleon',          icon:'☕', dept:'Beverages', aisle:'Beverages · BV3', x:2, z:0,  base_price:8.99, was:null,  stock:true, var:[1.00,0.90,0.98], synonyms:['cold brew','iced coffee','cold brew coffee'] },

  // ── FROZEN  (x=2, z=2…5) ────────────────────────────────────────────────────
  'frozen-pizza':     { name:'Rising Crust Pizza',       brand:'DiGiorno',           icon:'🍕', dept:'Frozen', aisle:'Frozen · FR1', x:2, z:2, base_price:8.99, was:10.49, stock:true, var:[1.00,0.88,1.05], synonyms:['frozen pizza','pizza','digiorno'], coupon:{id:'c-pizza',amount:'$1.50',sub:'OFF',title:'DiGiorno pizza',source:'Manufacturer',value_cents:150} },
  'frozen-broccoli':  { name:'Broccoli Florets 12oz',    brand:'Birds Eye',          icon:'🥦', dept:'Frozen', aisle:'Frozen · FR1', x:2, z:3, base_price:2.99, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['frozen broccoli','broccoli'] },
  'frozen-waffles':   { name:'Homestyle Waffles 10ct',   brand:"Kellogg's Eggo",     icon:'🧇', dept:'Frozen', aisle:'Frozen · FR2', x:2, z:3, base_price:4.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['frozen waffles','waffles','eggo'], coupon:{id:'c-eggo',amount:'$1',sub:'OFF',title:'Eggo waffles',source:'Manufacturer',value_cents:100} },
  'ice-cream':        { name:'Ice Cream Pint',           brand:'Häagen-Dazs',        icon:'🍦', dept:'Frozen', aisle:'Frozen · FR2', x:2, z:4, base_price:5.99, was:6.99, stock:true, var:[1.00,0.88,1.08], synonyms:['ice cream','haagen dazs','gelato'], coupon:{id:'c-hd',amount:'$1',sub:'OFF',title:'Häagen-Dazs pints',source:'Manufacturer',value_cents:100} },
  'frozen-burritos':  { name:'Bean & Rice Burritos 8ct', brand:"Amy's",              icon:'🌯', dept:'Frozen', aisle:'Frozen · FR3', x:2, z:4, base_price:7.99, was:null,  stock:true, var:[1.00,0.88,0.98], synonyms:['burritos','frozen burritos','amys'] },
  'edamame':          { name:'Edamame Shelled 14oz',     brand:'Seapoint Farms',     icon:'🫛', dept:'Frozen', aisle:'Frozen · FR3', x:2, z:5, base_price:4.49, was:null,  stock:true, var:[1.00,0.88,1.02], synonyms:['edamame','soy beans'] },
  'frozen-berries':   { name:'Mixed Berries 48oz',       brand:'Kirkland',           icon:'🫐', dept:'Frozen', aisle:'Frozen · FR3', x:2, z:5, base_price:9.99, was:null,  stock:true, var:[1.00,0.88,1.05], synonyms:['frozen berries','frozen fruit','mixed berries'] },

  // ── HOUSEHOLD & PERSONAL CARE  (x=2, z=6…8) ────────────────────────────────
  'dish-soap':        { name:'Dish Soap Original 19.4oz',brand:'Dawn',               icon:'🧴', dept:'Household', aisle:'Household · HH1', x:2, z:6, base_price:3.99, was:null,  stock:true, var:[1.00,0.85,1.05], synonyms:['dish soap','dawn','dishwashing'] },
  'laundry-pods':     { name:'Laundry Pods 42-count',    brand:'Tide',               icon:'🧺', dept:'Household', aisle:'Household · HH1', x:2, z:7, base_price:16.99, was:19.99, stock:true, var:[1.00,0.85,1.05], synonyms:['laundry detergent','tide','laundry pods','detergent'], coupon:{id:'c-tide',amount:'$3',sub:'OFF',title:'Tide pods 42ct',source:'Manufacturer',value_cents:300} },
  'paper-towels':     { name:'Paper Towels 6 rolls',     brand:'Bounty',             icon:'🧻', dept:'Household', aisle:'Household · HH2', x:2, z:7, base_price:9.99, was:null,  stock:true, var:[1.00,0.82,1.08], synonyms:['paper towels','bounty','kitchen towels'] },
  'toilet-paper':     { name:'Toilet Paper 12 rolls',    brand:'Charmin',            icon:'🧻', dept:'Household', aisle:'Household · HH2', x:2, z:8, base_price:14.99, was:null, stock:true, var:[1.00,0.80,1.08], synonyms:['toilet paper','charmin','bathroom tissue'] },
  'hand-soap':        { name:'Hand Soap 12.5oz',         brand:'Softsoap',           icon:'🧴', dept:'Household', aisle:'Household · HH2', x:2, z:8, base_price:3.49, was:null,  stock:true, var:[1.00,0.85,1.02], synonyms:['hand soap','liquid soap','softsoap'] },
};

export const ENTRANCE = { x: 0, z: 11 };
export const CHECKOUT = { x: 0, z: 9 };

export const DEFAULT_SUGGEST = [
  'bananas','strawberries','large-eggs','whole-milk','chicken-breast','salmon',
  'baby-spinach','avocado','cheerios','spaghetti','potato-chips','coffee',
  'broccoli','gala-apples','ground-beef','greek-yogurt','brown-rice','oat-milk',
];

function sIdx(storeId) { const i = STORES.findIndex(s => s.id === storeId); return i < 0 ? 0 : i; }

export function listStores() {
  return STORES.map(s => ({ id: s.id, name: s.name, icon: s.icon, distance_mi: s.distance_mi, drive_min: s.drive_min }));
}
export function getProduct(sku) { const p = CATALOG[sku]; return p ? { sku, ...p } : null; }

export function searchProducts(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);
  const out = [];
  for (const [sku, p] of Object.entries(CATALOG)) {
    const haystack = [
      sku.replace(/-/g, ' '),
      p.name.toLowerCase(),
      (p.brand || '').toLowerCase(),
      (p.dept || '').toLowerCase(),
      ...(p.synonyms || []),
    ].join(' ');
    const score = words.reduce((n, w) => n + (haystack.includes(w) ? 1 : 0), 0);
    if (score > 0) out.push({ _score: score, sku, ...p });
  }
  return out.sort((a, b) => b._score - a._score).map(({ _score, ...p }) => p);
}

export function resolveSku(text) {
  const q = String(text || '').trim().toLowerCase().replace(/\s+/g, '-');
  if (CATALOG[q]) return q;
  const hits = searchProducts(text);
  return hits.length ? hits[0].sku : null;
}

export function listDepts() {
  const s = new Set(Object.values(CATALOG).map(p => p.dept));
  return ['All', ...Array.from(s)];
}

export function priceCents(sku, storeId) {
  const p = CATALOG[sku]; if (!p) return null;
  const s = STORES[sIdx(storeId)];
  const v = (p.var && p.var[sIdx(storeId)]) || 1;
  return Math.round(p.base_price * s.base_mult * v * 100);
}
export function wasCents(sku, storeId) {
  const p = CATALOG[sku]; if (!p || p.was == null) return null;
  const s = STORES[sIdx(storeId)];
  const v = (p.var && p.var[sIdx(storeId)]) || 1;
  return Math.round(p.was * s.base_mult * v * 100);
}
export function inStock(sku) { const p = CATALOG[sku]; return !!(p && p.stock); }

export function couponsFor(skus) {
  const out = [];
  for (const sku of skus) { const p = CATALOG[sku]; if (p && p.coupon) out.push({ sku, ...p.coupon }); }
  return out;
}
export function suggestions(dept) {
  if (!dept || dept === 'All') return DEFAULT_SUGGEST.slice();
  return Object.entries(CATALOG)
    .filter(([, p]) => p.dept === dept)
    .map(([sku]) => sku)
    .slice(0, 18);
}
