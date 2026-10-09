export type Department = {
  slug: string;
  title: string;
  amharic: string;
  headName: string;
  headRole: string;
  headImage?: string;
  description: string;
  mission: string;
  activities: string[];
  icon: string;
};

export const DEPARTMENTS: Department[] = [
  {
    slug: "media-and-communication",
    title: "Media and Public Relations Department",
    amharic: "የሚዲያና የሕዝብ ግንኙነት መምሪያ",
    headName: "ዲያቆን/ዶክተር ስዩም ተረፈ | Deacon/Dr. Siyoum Terefe",
    headRole: "የሚዲያና ሕዝብ ግንኙነት ኃላፊ | Head of Media and Public Relations",
    headImage: "/assets/leadership/siyum.jpg",
    description:
      "ይህ ክፍል የኤሌክትሮኒክስና የሕትመት ውጤቶችን በመጠቀም የወንጌል ብርሃን ለሕዝባችን የሚደርስበትን መንገድ ያመቻቻል። መምሪያው ትምህርቶች፣ መልእክቶችና መግለጫዎች ተዘጋጅተው በወቅቱ እንዲተላለፉ ያደርጋል። በተጨማሪም በተለያዩ መምሪያዎች የሚዘጋጁ ጥናታዊና ትምህርታዊ ጽሑፎች ታትመው ለተዘጋጁበት ዓላማ እንዲውሉ የማድረግ ኃላፊነት አለበት።",
    mission:
      "This department facilitates the delivery of the light of the Gospel to the public using electronic and print media. It ensures that lessons, messages, and statements are prepared and broadcasted in a timely manner. Additionally, it is responsible for publishing research and educational papers prepared by various departments for their intended purposes.",
    activities: [
      "Preparing and delivering lessons, messages, and public statements in a timely manner",
      "Using electronic and print channels to spread the light of the Gospel",
      "Publishing research and educational papers prepared by various departments",
    ],
    icon: "📡",
  },
  {
    slug: "finance",
    title: "Administration and Finance Department",
    amharic: "የአስተዳደርና ፋይናንስ መምሪያ",
    headName: "ወንድም ብርሃን በቀለ | Brother Berhan Bekele",
    headRole: "አስተዳደርና ፋይናንስ መምሪያ ኃላፊ | Head of Administration and Finance Department",
    headImage: "/assets/leadership/siltanu.jpg",
    description:
      "በዚህ መምሪያ ስር የተቋሙ ጊዜያዊና ቋሚ ንብረቶች፣ እንዲሁም የሰው ኃይል በሕግና በሥርዓት ተመዝግበው እንዲያዙ ይደረጋል። መምሪያው የአገልግሎቱን የገንዘብና የንብረት ፍሰት በግልጽነትና በተጠያቂነት በመምራት፣ ለወንጌል ሥራው መሳካት አስፈላጊ የሆነውን አስተዳደራዊ መሠረት ያደራጃል።",
    mission:
      "Under this department, the institution's temporary and permanent assets, as well as human resources, are registered and managed according to law and regulation. By leading the financial and asset flow with transparency and accountability, the department organizes the administrative foundation necessary for the success of the Gospel work.",
    activities: [
      "Registering and managing assets and human resources according to law and regulation",
      "Leading transparent and accountable financial and asset flow",
      "Organizing the administrative foundation needed for successful Gospel work",
    ],
    icon: "💰",
  },
  {
    slug: "research",
    title: "Research and Study Department",
    amharic: "የጥናትና ምርምር መምሪያ",
    headName: "መምህር ብርሃኑ አበጋዝ | Memhir Berhanu Abegaz",
    headRole: "የቅዱስ ቄርሎስ ኮሌጅ ዲን | Dean of St. Cyril College",
    headImage: "/assets/leadership/memhir-berhanu-abegaz.jpg",
    description:
      "ይህ መምሪያ ለአገልግሎቱ መጠናከርና መስፋፋት ጠቃሚ የሆኑ ርእሰ ጉዳዮችን በመለየት ጥናታዊ ጽሑፎችን ያዘጋጃል። በተገኙት የጥናት ውጤቶች መሠረት አገልግሎቱ ይበልጥ ውጤታማ የሚሆንባቸውን አቅጣጫዎች የሚቀይስ ሲሆን፣ የወደፊት የአገልግሎት ጉዞው በዕውቀትና በመረጃ ላይ የተመሠረተ እንዲሆን ትልቅ አስተዋጽኦ ያበረክታል።",
    mission:
      "This department prepares research papers by identifying key subjects essential for the strengthening and expansion of the ministry. It charts directions for more effective service based on research findings, contributing significantly to ensuring the future of the ministry is grounded in knowledge and data.",
    activities: [
      "Identifying key research subjects that strengthen and expand ministry service",
      "Preparing research papers and using findings to guide effective service directions",
      "Supporting a knowledge- and data-based future direction for ministry work",
    ],
    icon: "🔬",
  },
  {
    slug: "charity-and-development",
    title: "Development and Relief Department",
    amharic: "የልማትና ተራድኦ መምሪያ",
    headName: "To Be Announced",
    headRole: "Department Head",
    description:
      "የዚህ መምሪያ ዋና ተግባር በቃለ ወንጌል አስተምህሮአቸውና በእምነታቸው ምክንያት መከራና ስደት የደረሰባቸውን፣ እንዲሁም ሀብትና ንብረታቸው ለወደመባቸው \"የወንጌል አርበኞች\" ሰብአዊ ድጋፍ ማድረግ ነው። መምሪያው እነዚህን ወገኖች በማገዝና መልሶ በማቋቋም ረገድ የክርስትናን ፍቅር በተግባር የሚገልጥበት የአገልግሎት ዘርፍ ነው።",
    mission:
      "The main function of this department is to provide humanitarian support to \"Gospel Heroes\" who have faced suffering and persecution due to their faith and Gospel teaching, as well as those whose property has been destroyed. This branch of service demonstrates Christian love in action by assisting and rehabilitating these individuals.",
    activities: [
      "Providing humanitarian support to Gospel believers facing suffering and persecution",
      "Assisting families and individuals whose property and livelihoods have been destroyed",
      "Rehabilitation support that demonstrates Christian love through practical action",
    ],
    icon: "🤝",
  },
  {
    slug: "training-and-teaching",
    title: "Education and Training Department",
    amharic: "የትምህርትና ሥልጠና መምሪያ",
    headName: "መምህር እስመለዓለም ሀብቱ | Memhir Ismelealem Habtu",
    headRole: "የትምህርትና ስልጠና መምሪያ ኃላፊ | Head of Education and Training Department",
    headImage: "/assets/leadership/deqemezmur.jpg",
    description:
      "በዚህ መምሪያ ስር ምእመናን ወጥና ተከታታይነት ያለው ትምህርተ ክርስትና እንዲያገኙ የሚያስችሉ የትምህርት ማቴሪያሎች ይዘጋጃሉ። መምሪያው ከስብከተ ወንጌል ክፍል ጋር በመተባበር ልዑካንን ለተልእኮ ከማብቃቱም በላይ፣ የቤተ ክርስቲያን አስተምህሮ በባዕዳንና በሐሰተኛ ትምህርቶች እንዳይበረዝ የመከላከልና የመጠበቅ ታላቅ ኃላፊነት ይወጣል።",
    mission:
      "Under this department, educational materials are prepared to ensure believers receive consistent and continuous Christian teachings. In collaboration with the Evangelism and Apostolic Mission Department, it empowers envoys for the mission and carries the great responsibility of protecting and preserving the Church's doctrine from being diluted by alien and false teachings.",
    activities: [
      "Preparing consistent and continuous Christian educational materials for believers",
      "Collaborating with Evangelism and Apostolic Mission to equip envoys for mission service",
      "Protecting and preserving Church doctrine from alien and false teachings",
    ],
    icon: "📘",
  },
  {
    slug: "evangelism",
    title: "Evangelism and Apostolic Mission",
    amharic: "ስብከተ ወንጌልና ሐዋሪያዊ ተልዕኮ መምሪያ",
    headName: "መሪጌታ ዳዊት ሙሉዬ | Merigeta Dawit Muluye",
    headRole: "የስብከተ ወንጌልና ሐዋሪያዊ ተልዕኮ መምሪያ ኃላፊ | Head of Evangelism and Apostolic Mission",
    headImage: "/assets/leadership/dawit.jpg",
    description:
      "የዚህ መምሪያ ዋነኛ ተልእኮ በማቴዎስ ወንጌል (28፥19-20) መሠረት የወንጌል ሥርጭት ተልእኮን ማስፈጸምና ማጠናከር ነው። መምሪያው የወንጌል ጥሪ ያላቸውን አገልጋዮች የመመልመል፣ የማብቃትና ለተልእኮ የማሰማራት ሥራን ይሠራል። በተጨማሪም በቃለ ወንጌሉ አምነው ወደ ማኅበሩ የሚቀላቀሉ ምእመናን ተገቢውን የደቀ መዝሙርነት ትምህርት እንዲያገኙና በመንፈሳዊ ሕይወታቸው እንዲያድጉ በቅርበት ይከታተላል።",
    mission:
      "The primary mission of this department is to execute and strengthen the Gospel outreach mission based on Matthew 28:19-20. The department works on recruiting, empowering, and deploying ministers who have a calling for the Gospel. Furthermore, it closely monitors believers who join the association through the Word of the Gospel to ensure they receive proper discipleship training and grow in their spiritual lives.",
    activities: [
      "Recruiting, empowering, and deploying ministers called for Gospel outreach",
      "Providing proper discipleship training for new believers joining through Gospel outreach",
      "Close spiritual follow-up to help believers grow in their spiritual lives",
    ],
    icon: "✝️",
  },
];
