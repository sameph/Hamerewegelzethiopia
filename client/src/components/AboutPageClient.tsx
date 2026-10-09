"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Church,
  Cross,
  GraduationCap,
  Megaphone,
  Network,
  Radio,
  Users,
  BookOpen,
  HeartHandshake,
  Landmark,
  Building2,
  ShieldCheck,
  HandHelping,
} from "lucide-react";
import clsx from "clsx";

interface Stat {
  val: string;
  label: string;
}

interface Pillar {
  title: string;
  desc: string;
}

interface ValueItem {
  title: string;
  body: string;
  href?: string;
  translationTitle?: string;
  translationBody?: string;
}

interface DepartmentLinkItem {
  title: string;
  href: string;
}

interface StructureItem {
  title: string;
  description: string;
  translationTitle?: string;
  translationDescription?: string;
}

interface Content {
  historyTag: string;
  historyTitle: string;
  historyP1: string;
  historyP2: string;
  historyP3: string;
  statsTitle: string;
  stats: Stat[];
  pillarsTitle: string;
  pillars: Pillar[];
  mapTitle: string;
  mapSub: string;
  ctaTitle: string;
  ctaApply: string;
  ctaSupport: string;
  lmsLabel: string;
}

interface AboutPageClientProps {
  locale: string;
  content: Content;
}

function MotionBlock({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SlidingImageStrip({
  items,
  duration = 26,
  grayscale = false,
}: {
  items: Array<{ src: string; title: string; subtitle?: string }>;
  duration?: number;
  grayscale?: boolean;
}) {
  const loopItems = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max gap-5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {loopItems.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="relative w-[260px] sm:w-[290px] lg:w-[320px] h-[340px] overflow-hidden rounded-[24px] border border-white/10 bg-[#121212] shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
          >
            <div
              className={clsx(
                "absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105",
                grayscale && "grayscale"
              )}
              style={{ backgroundImage: `url('${item.src}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute left-0 right-0 bottom-0 p-5">
              <h3 className="font-serif text-[1.15rem] font-semibold text-white">{item.title}</h3>
              {item.subtitle ? <p className="mt-1 font-sans text-[0.74rem] uppercase tracking-[0.1em] text-white">{item.subtitle}</p> : null}
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

export default function AboutPageClient({ locale, content }: AboutPageClientProps) {
  const isAm = locale === "am";
  const [flippedCoreValueCards, setFlippedCoreValueCards] = useState<Record<string, boolean>>({});
  const [flippedStructureCards, setFlippedStructureCards] = useState<Record<string, boolean>>({});
  const [structureImageSrc, setStructureImageSrc] = useState("/assets/administrative-structure-chart.png");

  const prefix = locale === "en" ? "/en" : "/am";
  const href = (path: string) => `${prefix}${path}`;

  const h2Class = clsx(
    "font-bold leading-[1.15]",
    isAm ? "font-ethiopic text-[clamp(1.5rem,4vw,2.8rem)]" : "font-serif text-[clamp(1.8rem,4vw,3.3rem)]"
  );

  const pClass = clsx(
    "leading-[1.9] text-[#17351f]/80",
    isAm ? "font-ethiopic text-[0.94rem]" : "font-sans text-[0.95rem]"
  );

  const photoTextOverrideClass =
    "[&_h2]:!text-[#000000] [&_h2]:!font-bold [&_h3]:!text-[#000000] [&_h3]:!font-bold [&_h4]:!text-[#000000] [&_h4]:!font-bold [&_p]:!text-[#000000] [&_p]:!font-bold [&_li]:!text-[#000000] [&_li]:!font-bold [&_span]:!text-[#000000] [&_span]:!font-bold [&_button]:!text-[#000000] [&_button]:!font-bold";

  const toggleStructureCard = (index: number, flipped: boolean) => {
    setFlippedStructureCards((current) => ({
      ...current,
      [`structure-${index}`]: flipped,
    }));
  };

  const bilingualVision = {
    amTitle: "ራእያችን",
    enTitle: "Our Vision",
    amQuote: "\"እናት ቤተ ክርስቲያን በቃለ ወንጌል ታድሳ ማየት\"",
    enQuote: '"To see the Mother Church renewed through the Word of the Gospel"',
    amBody:
      "የእኛ ራእይ፤ በ330 ዓ.ም በአባ ሰላማ ከሣቴ ብርሃን የተመሠረተችው ጥንታዊት እናት ቤተ ክርስቲያን፣ ከባዕዳን ትምህርቶችና ሥርዓቶች ተላቅቃ ወደ መሠረቷ ወደ ቃለ ወንጌል እንድትመለስ ማየት ነው። የቤተ ክርስቲያናችን ትምህርት፣ ሥርዓተ አምልኮና የምእመናን ሕይወት ማእከልና ብቸኛ ትምክህት ኢየሱስ ክርስቶስ ብቻ እንዲሆን እንተጋለን።",
    enBody:
      "Our vision is to see the ancient Mother Church, established in 330 AD by Abba Salama Kasate Berhan, return to its foundation—the Word of the Gospel—by being liberated from alien teachings and practices. We strive to make Jesus Christ alone the center and the only pride of our Church's doctrine, liturgy, and the lives of the faithful.",
  };

  const bilingualMission = {
    amTitle: "ተልእኳችን",
    enTitle: "Our Mission",
    amIntro:
      "የሐመረ ወንጌል ዘኢትዮጵያ ተልእኮ በማቴዎስ ወንጌል 28፥19-20 ላይ የተመሠረተ ሲሆን፣ ዋና ዋና ግቦቹም የሚከተሉት ናቸው፦",
    enIntro:
      "The mission of Hamere Wongel Ze-Ethiopia is based on Matthew 28:19-20, with the following primary goals:",
    goals: [
      {
        am: "• ወንጌልን መመስከር: አድኅኖተ ክርስቶስን ለሰዎች ሁሉ በቃልና በኑሮ መመስከር።",
        en: "• Witnessing the Gospel: Witnessing Christ's salvation to all people through word and lifestyle.",
      },
      {
        am: "• ደቀ መዛሙርትን ማፍራት: ከባዕዳን ትምህርቶች ነፃ የሆኑ እውነተኛ ደቀ መዛሙርትን ማስተማር።",
        en: "• Making Disciples: Forming true disciples who are free from alien teachings and idolatry.",
      },
      {
        am: "• አገልጋዮችን ማብቃት: ብቁ አገልጋዮችን በትምህርትና በሥልጠና ማዘጋጀት።",
        en: "• Empowering Ministers: Preparing competent ministers through education and training.",
      },
      {
        am: "• ሁለንተናዊ አገልግሎት: ምእመናን በኅብረት እንዲያመልኩ እና እርስ በእርሳቸው እንዲረዳዱ ማስቻል።",
        en: "• Holistic Ministry: Enabling the faithful to worship in unity and support one another.",
      },
      {
        am: "• የሥነ-ጽሑፍና ሚዲያ አገልግሎት: በመጻሕፍትና በሚዲያ ወንጌልን ተደራሽ ማድረግ።",
        en: "• Literature and Media Service: Making the Gospel accessible through publishing and media platforms.",
      },
    ],
  };

  const structuredCopy = isAm
    ? {
        whoWeAreTitle: "እኛ ማን ነን",
        whoWeAreBody:
          "ሐመረ ወንጌል ዘኢትዮጵያ ወንጌልን ለማስፋፋት እና የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንን በትምህርት፣ በደቀ መዝሙርነት እና በመሪነት ስልጠና ለማጠናከር የተሰጠ የተሃድሶ መንፈሳዊ ማህበር ነው።",
        highlights: [
          { label: "የተመሰረተው", value: "ሰኔ 24 ቀን 1998 ዓ.ም." },
          { label: "አድራሻ", value: "አዲስ አበባ" },
          { label: "እውቅና", value: "የፌዴራል ጉዳዮች ሚኒስቴር" },
          { label: "መሠረት", value: "ታላቁ ተልዕኮ - ማቴ 28:19-20" },
        ],
        visionTitle: "ራዕያችን",
        visionBody:
          "\"እናት ቤተ ክርስቲያን በቃለ ወንጌል ታድሳ ማየት\" (To see the Mother Church renewed through the Word of the Gospel)",
        visionBodyDetail:
          "የእኛ ራእይ፤ በ330 ዓ.ም በአባ ሰላማ ከሣቴ ብርሃን የተመሠረተችው ጥንታዊት እናት ቤተ ክርስቲያን፣ ከባዕዳን ትምህርቶችና ሥርዓቶች ተላቅቃ ወደ መሠረቷ ወደ ቃለ ወንጌል እንድትመለስ ማየት ነው። የቤተ ክርስቲያናችን ትምህርት፣ ሥርዓተ አምልኮና የምእመናን ሕይወት ማእከልና ብቸኛ ትምክህት ኢየሱስ ክርስቶስ ብቻ እንዲሆን እንተጋለን።\n\nOur vision is to see the ancient Mother Church, established in 330 AD by Abba Salama Kasate Berhan, return to its foundation—the Word of the Gospel—by being liberated from alien teachings and practices. We strive to make Jesus Christ alone the center and the only pride of our Church's doctrine, liturgy, and the lives of the faithful.",
        missionTitle: "ተልዕኳችን",
        missionBody:
          "የሐመረ ወንጌል ዘኢትዮጵያ ተልእኮ በማቴዎስ ወንጌል 28፥19-20 ላይ የተመሠረተ ሲሆን፣ ዋና ዋና ግቦቹም የሚከተሉት ናቸው፦",
        missionBodyDetail: [
          "• ወንጌልን መመስከር (Witnessing the Gospel): አድኅኖተ ክርስቶስን ለሰዎች ሁሉ በቃልና በኑሮ መመስከር ለእያንዳንዱ አማኝ የተሰጠ አምላካዊ ግዴታ እንደሆነ በማመን ተልዕኮን መወጣት። (Fulfilling the mission by believing that witnessing the salvation of Christ to all people through word and lifestyle is a divine obligation given to every believer.)",
          "• ደቀ መዛሙርትን ማፍራት (Making Disciples): አማኞች ከባዕዳን ትምህርቶችና ከአምልኮተ ጣዖት ነፃ ወጥተው፣ በእምነትና በተግባር የክርስቶስ እውነተኛ ደቀ መዛሙርት እንዲሆኑ ማስተማር። (Teaching believers to be free from alien teachings and idolatry, and to become true disciples of Christ in faith and practice.)",
          "• አገልጋዮችን ማብቃት (Empowering Ministers): ለጠንካራ መንፈሳዊ ተቋም ግንባታ ብቁ አገልጋዮችን በትምህርትና በሥልጠና ማዘጋጀትና ለተልእኮ መሰማራት። (Preparing competent ministers through education and training for the building of a strong spiritual institution and deploying them for the mission.)",
          "• ሁለንተናዊ አገልግሎት (Holistic Ministry): ምእመናን በኅብረት እንዲያመልኩ፣ ሥርዓተ ምሥጢራትን እንዲፈጽሙና እርስ በእርሳቸው በማኅበራዊና በኢኮኖሚ ሕይወታቸው እንዲረዳዱ ማስቻል። (Enabling the faithful to worship in unity, perform the Holy Sacraments, and support one another in their social and economic lives.)",
          "• የሥነ-ጽሑፍና ሚዲያ አገልግሎት (Literature and Media Service): ተሐድሶአዊ ራእይን የሚያፋጥኑ መጻሕፍትን በማተምና ሚዲያን በመጠቀም ወንጌልን ለትውልድ ተደራሽ ማድረግ። (Making the Gospel accessible to the current generation by publishing books that accelerate the reformative vision and utilizing various media platforms.)",
        ],
        coreValuesTitle: "መንፈሳዊ እሴቶቻችን",
        coreValuesIntro:
          "ተቋማዊ አገልግሎታችን በሚከተሉት መሠረታዊ እሴቶች ላይ የጸና ነው።",
        coreValues: [
          {
            title: "የቃለ እግዚአብሔር ሥልጣን",
            body:
              "መጽሐፍ ቅዱስ ብቸኛውና የመጨረሻው አምላካዊ የሥልጣን ምንጭ ነው። ማንኛውም ትምህርት፣ ሥርዓትና አስተዳደር የሚመዘነው በመጽሐፍ ቅዱስ ሚዛን ብቻ መሆን እንዳለበት እናምናለን። ከእርሱ መጨመርም ሆነ መቀነስ በኦርቶዶክሳዊት ቤተ ክርስቲያን አስተምህሮ ቅቡልነት የለውም።",
            translationTitle: "Authority of the Word",
            translationBody:
              "The Bible is the only and final source of divine authority. We believe that any doctrine, practice, or administration must be weighed only by the balance of the Bible. Adding to or subtracting from it has no acceptance in Orthodox Church teaching.",
          },
          {
            title: "አምልኮተ እግዚአብሔር",
            body:
              "አምልኮ የሚገባው ለሰማይና ምድር ፈጣሪ ለሆነው ለእግዚአብሔር ብቻ ነው። እርሱ በኃይሉና በጥበቡ ኢ-ውሱን፣ ጸሎትን የሚሰማና በምንም የማይመሰል አምላክ መሆኑን ማመን የክርስትናችን ማእከል ነው።",
            translationTitle: "Worship of God",
            translationBody:
              "Worship belongs only to God, the Creator of heaven and earth. Belief in Him as infinite in power and wisdom, the one who hears prayer, and an incomparable God is the center of our Christianity.",
          },
          {
            title: "ፍቅረ ቢጽ - ሰውን መውደድ",
            body:
              "ክርስትና በባልንጀራ ፍቅር ላይ ይመሰረታል። ሰውን ሁሉ መውደድ፣ መልካም ማድረግና ለሌሎች መኖር የአምልኮታችን አካል ነው። ወንድሙን የሚጠላ እግዚአብሔርን ሊያመልክ አይችልም፤ በመሆኑም ፍቅርን የአገልግሎታችን መመሪያ እናደርጋለን።",
            translationTitle: "Love for Neighbor",
            translationBody:
              "Christianity is founded on love for one's neighbor. Loving all people, doing good, and living for others is part of our worship. One who hates his brother cannot worship God; therefore, we make love the guideline of our service.",
          },
          {
            title: "ጸሎትና ምልጃ",
            body:
              "ስለ ሀገር ሰላም፣ ስለ ወገን ደኅንነት፣ ስለ ታመሙና ስለ ተቸገሩ መጸለይና መማለድ የአማኝ የዘወትር ተግባር ነው። ጸሎት ከእግዚአብሔር ጋር የምንገናኝበትና የእርሱን ፈቃድ በምድር የምናስፈጽምበት መሣሪያ ነው።",
            translationTitle: "Prayer and Intercession",
            translationBody:
              "Praying and interceding for national peace, the safety of the people, and for the sick and needy is a believer's daily duty. Prayer is the tool through which we connect with God and execute His will on earth.",
          },
          {
            title: "ኅብረት",
            body:
              "ቤተ ክርስቲያን የቅዱሳን ኅብረት ናት። አማኞች ከአባትና ከልጁ ከኢየሱስ ክርስቶስ ጋር እንዲሁም እርስ በእርሳቸው ፍጹም አንድነት እንዲኖራቸው እናበረታታለን።",
            translationTitle: "Fellowship",
            translationBody:
              "The Church is the fellowship of saints. We encourage believers to have perfect unity with the Father and His Son Jesus Christ, as well as with one another.",
          },
          {
            title: "የጸጋ መንፈስ ቅዱስ",
            body:
              "ያለ መንፈስ ቅዱስ ጸጋ ክርስትናና አገልግሎት አይታሰብም። አገልግሎታችን ሁሉ በመንፈስ ቅዱስ ምሪትና በሰጠን ልዩ ልዩ የጸጋ ስጦታዎች የሚከናወን መሆኑን እናምናለን።",
            translationTitle: "Grace of the Holy Spirit",
            translationBody:
              "Christianity and ministry are unthinkable without the grace of the Holy Spirit. We believe all our services must be conducted through the guidance of the Holy Spirit and the various spiritual gifts bestowed upon us.",
          },
        ],
        journeyTitle: "ጉዞአችን",
        journey: [
          {
            year: "1998 ዓ.ም.",
            title: "በአዲስ አበባ ተመሠረተ",
            body: "የተሃድሶ መንፈሳዊ ማህበር ሆኖ አገልግሎቱን ጀመረ።",
          },
          {
            year: "የመስፋፋት ዘመን",
            title: "ክልላዊ እድገት",
            body: "ወደ ክልል መዋቅሮች ተስፋፍቷል።",
          },
          {
            year: "አሁን",
            title: "ቅዱስ ቄርሎስ የሥነ-መለኮት ኮሌጅ",
            body: "ማኅበሩ አሁን የሥነ-መለኮት ትምህርት ጀምሯል።",
          },
        ],
        activitiesTitle: "እንቅስቃሴዎቻችን በተግባር",
        activitiesBody:
          "በንቁ አገልግሎት፣ በወንጌል ስርጭት ፕሮግራሞች፣ በስልጠና እና በማህበረሰብ ተሳትፎ ወንጌልን በተግባር መኖር።",
        activityCategories: ["የቤተ ክርስቲያን አገልግሎት", "የማህበረሰብ ድርሻ", "የመሪነት ስልጠና", "የወጣቶች አገልግሎት"],
        structureTitle: "መዋቅር",
        structure: [
          {
            title: "ሲኖዶስ",
            description: "ከፍተኛ ውሳኔ ሰጪ አካል ሆኖ አጠቃላይ መመሪያ ይሰጣል።",
            translationTitle: "Synod",
            translationDescription:
              "The Synod serves as the highest spiritual authority of Hamere Wengel Ze-Ethiopia, providing overall vision, doctrinal guidance, and spiritual oversight for the entire ministry.",
          },
          {
            title: "ቋሚ ሲኖዶስ",
            description: "የስትራቴጂ ክትትልና የተልእኮ አፈጻጸም ተቆጣጣሪ ቦርድ ነው።",
            translationTitle: "Standing Synod",
            translationDescription:
              "The Standing Synod is a delegated body that ensures continuity in leadership, handling ongoing decisions and maintaining alignment with the Synod's direction.",
          },
          {
            title: "ብሔራዊ ጽ/ቤት",
            description: "ዕለታዊ አስተዳደርን እና የክፍሎች መስራት ያስተባብራል።",
            translationTitle: "General Secretariat",
            translationDescription:
              "The General Secretariat oversees daily operations, coordination, and administration, ensuring that the ministry's vision is implemented effectively across all levels.",
          },
          {
            title: "ሀገረ ስብከት",
            description: "በክልል ደረጃ ፕሮግራሞችን ያስፈጽማሉ እና ክርክሮችን ይተባበራሉ።",
            translationTitle: "Regional Offices",
            translationDescription:
              "Regional Offices manage and support ministry activities within specific geographic areas, facilitating communication and coordination between central leadership and local churches.",
          },
          {
            title: "አጥቢያ ቤተክርስቲያን",
            description: "ተልእኮውን በቀጥታ በማህበረሰብ ውስጥ የሚያገለግሉ መሠረታዊ ክፍሎች ናቸው።",
            translationTitle: "Local Churches & Fellowships",
            translationDescription:
              "Local Churches and Fellowships are the grassroots expression of the ministry, where believers gather for worship, discipleship, outreach, and community impact.",
          },
        ],
        departmentsTitle: "ክፍሎች",
        departments: [
          { title: "የወንጌል እና ተልዕኮ", href: href("/departments/evangelism") },
          { title: "ትምህርት እና ስልጠና", href: href("/departments/training-and-teaching") },
          { title: "ሚዲያ እና ኮሚዩኒኬሽን", href: href("/departments/media-and-communication") },
          { title: "ምርምር እና ህትመት", href: href("/departments/research") },
          { title: "ልማት እና እርዳታ", href: href("/departments/charity-and-development") },
          { title: "የሥነ መለኮት ኮሌጅ", href: href("/departments") },
        ],
        leadershipTitle: "መስራች የቦርድ አባላት",
        leadership: [
          { role: "ጠቅላላ ሥራ አስኪያጅ", focus: "መንፈሳዊ ክትትል" },
          { role: "ምክትል ሥራ አስኪያጅ", focus: "ስትራቴጂካዊ ኦፕሬሽን" },
          { role: "የክፍል ኃላፊዎች", focus: "የአገልግሎት አመራር" },
        ],
        impactTitle: "ውጤታችን",
        impact: [
          { value: "50,000+", label: "የደረስንባቸው ሰዎች" },
          { value: "1,200+", label: "የተሰለጠኑ መሪዎች" },
          { value: "120+", label: "የተገናኙ ቤተ ክርስቲያናት" },
          { value: "28", label: "የተዘጋጁ ሞጁሎች" },
        ],
        finalTitle: "ከእኛ ጋር ይተባበሩ!",
        finalBody:
          "ይህ ተሐድሶአዊ ጥሪ የሁላችንም ነው። የቤተ ክርስቲያናችን ትምህርትና ባህል መጽሐፍ ቅዱሳዊ ይዘቱን ጠብቆ ለትውልድ እንዲተላለፍ በጋራ እንቁም።",
        actions: [
          { label: "ይሳተፉ", href: href("/contact") },
          { label: "አጋር ይሁኑ", href: href("/donate") },
          { label: "ያግኙን", href: href("/contact") },
        ],
      }
    : {
        whoWeAreTitle: "Who We Are",
        whoWeAreBody:
          "Hamere Wengel Ze-Ethiopia is a reformative spiritual association committed to spreading the Gospel and strengthening the Ethiopian Orthodox Tewahedo Church through teaching, discipleship, and leadership development.",
        highlights: [
          { label: "Established", value: "June 24, 2006 (E.C.)" },
          { label: "Location", value: "Addis Ababa" },
          { label: "Recognition", value: "Ministry of Federal Affairs" },
          { label: "Foundation", value: "The Great Commission (Matthew 28:19–20)" },
        ],
        visionTitle: "Our Vision",
        visionBody:
          '"To see the Mother Church renewed through the Word of the Gospel"',
        visionBodyDetail:
          "Our vision is to see the ancient Mother Church, established in 330 AD by Abba Salama Kasate Berhan, return to its foundation—the Word of the Gospel—by being liberated from alien teachings and practices. We strive to make Jesus Christ alone the center and the only pride of our Church's doctrine, liturgy, and the lives of the faithful.\n\nራእያችን፤ በ330 ዓ.ም በአባ ሰላማ ከሣቴ ብርሃን የተመሠረተችው ጥንታዊት እናት ቤተ ክርስቲያን፣ ከባዕዳን ትምህርቶችና ሥርዓቶች ተላቅቃ ወደ መሠረቷ ወደ ቃለ ወንጌል እንድትመለስ ማየት ነው።",
        missionTitle: "Our Mission",
        missionBody:
          "The mission of Hamere Wongel Ze-Ethiopia is based on Matthew 28:19-20, with the following primary goals:",
        missionBodyDetail: [
          "• Witnessing the Gospel: Fulfilling the mission by believing that witnessing the salvation of Christ to all people through word and lifestyle is a divine obligation given to every believer.",
          "• Making Disciples: Teaching believers to be free from alien teachings and idolatry, and to become true disciples of Christ in faith and practice.",
          "• Empowering Ministers: Preparing competent ministers through education and training for the building of a strong spiritual institution and deploying them for the mission.",
          "• Holistic Ministry: Enabling the faithful to worship in unity, perform the Holy Sacraments, and support one another in their social and economic lives.",
          "• Literature and Media Service: Making the Gospel accessible to the current generation by publishing books that accelerate the reformative vision and utilizing various media platforms.",
        ],
        coreValuesTitle: "Our Core Values",
        coreValuesIntro:
          "Our institutional service is built upon the following core values:",
        coreValues: [
          {
            title: "Authority of the Word",
            body:
              "The Bible is the only and final source of divine authority. We believe that any doctrine, practice, or administration must be weighed only by the balance of the Bible. Adding to or subtracting from it has no acceptance in Orthodox Church teaching.",
            translationTitle: "የቃለ እግዚአብሔር ሥልጣን",
            translationBody:
              "መጽሐፍ ቅዱስ ብቸኛውና የመጨረሻው አምላካዊ የሥልጣን ምንጭ ነው። ማንኛውም ትምህርት፣ ሥርዓትና አስተዳደር የሚመዘነው በመጽሐፍ ቅዱስ ሚዛን ብቻ መሆን እንዳለበት እናምናለን። ከእርሱ መጨመርም ሆነ መቀነስ በኦርቶዶክሳዊት ቤተ ክርስቲያን አስተምህሮ ቅቡልነት የለውም።",
          },
          {
            title: "Worship of God",
            body:
              "Worship belongs only to God, the Creator of heaven and earth. Belief in Him as infinite in power and wisdom, the one who hears prayer, and an incomparable God is the center of our Christianity.",
            translationTitle: "አምልኮተ እግዚአብሔር",
            translationBody:
              "አምልኮ የሚገባው ለሰማይና ምድር ፈጣሪ ለሆነው ለእግዚአብሔር ብቻ ነው። እርሱ በኃይሉና በጥበቡ ኢ-ውሱን፣ ጸሎትን የሚሰማና በምንም የማይመሰል አምላክ መሆኑን ማመን የክርስትናችን ማእከል ነው።",
          },
          {
            title: "Love for Neighbor",
            body:
              "Christianity is founded on love for one's neighbor. Loving all people, doing good, and living for others is part of our worship. One who hates his brother cannot worship God; therefore, we make love the guideline of our service.",
            translationTitle: "ፍቅረ ቢጽ - ሰውን መውደድ",
            translationBody:
              "ክርስትና በባልንጀራ ፍቅር ላይ ይመሰረታል። ሰውን ሁሉ መውደድ፣ መልካም ማድረግና ለሌሎች መኖር የአምልኮታችን አካል ነው። ወንድሙን የሚጠላ እግዚአብሔርን ሊያመልክ አይችልም፤ በመሆኑም ፍቅርን የአገልግሎታችን መመሪያ እናደርጋለን።",
          },
          {
            title: "Prayer and Intercession",
            body:
              "Praying and interceding for national peace, the safety of the people, and for the sick and needy is a believer's daily duty. Prayer is the tool through which we connect with God and execute His will on earth.",
            translationTitle: "ጸሎትና ምልጃ",
            translationBody:
              "ስለ ሀገር ሰላም፣ ስለ ወገን ደኅንነት፣ ስለ ታመሙና ስለ ተቸገሩ መጸለይና መማለድ የአማኝ የዘወትር ተግባር ነው። ጸሎት ከእግዚአብሔር ጋር የምንገናኝበትና የእርሱን ፈቃድ በምድር የምናስፈጽምበት መሣሪያ ነው።",
          },
          {
            title: "Fellowship",
            body:
              "The Church is the fellowship of saints. We encourage believers to have perfect unity with the Father and His Son Jesus Christ, as well as with one another.",
            translationTitle: "ኅብረት",
            translationBody:
              "ቤተ ክርስቲያን የቅዱሳን ኅብረት ናት። አማኞች ከአባትና ከልጁ ከኢየሱስ ክርስቶስ ጋር እንዲሁም እርስ በእርሳቸው ፍጹም አንድነት እንዲኖራቸው እናበረታታለን።",
          },
          {
            title: "Grace of the Holy Spirit",
            body:
              "Christianity and ministry are unthinkable without the grace of the Holy Spirit. We believe all our services must be conducted through the guidance of the Holy Spirit and the various spiritual gifts bestowed upon us.",
            translationTitle: "የጸጋ መንፈስ ቅዱስ",
            translationBody:
              "ያለ መንፈስ ቅዱስ ጸጋ ክርስትናና አገልግሎት አይታሰብም። አገልግሎታችን ሁሉ በመንፈስ ቅዱስ ምሪትና በሰጠን ልዩ ልዩ የጸጋ ስጦታዎች የሚከናወን መሆኑን እናምናለን።",
          },
        ],
        journeyTitle: "Our Journey",
        journey: [
          {
            year: "2006 (E.C.)",
            title: "Establishment in Addis Ababa",
            body: "Hamere Wengel Ze-Ethiopia began as a reformative spiritual association centered on Gospel renewal.",
          },
          {
            year: "Expansion Phase",
            title: "Regional growth",
            body: "The work expanded into regional structures.",
          },
          {
            year: "Present",
            title: "Saint Cyril Theological College",
            body: "The association now launches theological education.",
          },
        ],
        activitiesTitle: "Our Activities in Action",
        activitiesBody:
          "Experiencing the Gospel through active ministry, outreach programs, training, and community engagement.",
        activityCategories: ["Church Services", "Community Outreach", "Leadership Training", "Youth Ministry"],
        structureTitle: "Structure",
        structure: [
          {
            title: "Synod",
            description:
              "The Synod serves as the highest spiritual authority of Hamere Wengel Ze-Ethiopia, providing overall vision, doctrinal guidance, and spiritual oversight for the entire ministry.",
            translationTitle: "ሲኖዶስ",
            translationDescription: "ከፍተኛ ውሳኔ ሰጪ አካል ሆኖ አጠቃላይ መመሪያ ይሰጣል።",
          },
          {
            title: "Standing Synod",
            description:
              "The Standing Synod is a delegated body that ensures continuity in leadership, handling ongoing decisions and maintaining alignment with the Synod's direction.",
            translationTitle: "ቋሚ ሲኖዶስ",
            translationDescription: "የስትራቴጂ ክትትልና የተልእኮ አፈጻጸም ተቆጣጣሪ ቦርድ ነው።",
          },
          {
            title: "General Secretariat",
            description:
              "The General Secretariat oversees daily operations, coordination, and administration, ensuring that the ministry's vision is implemented effectively across all levels.",
            translationTitle: "ብሔራዊ ጽ/ቤት",
            translationDescription: "ዕለታዊ አስተዳደርን እና የክፍሎች መስራት ያስተባብራል።",
          },
          {
            title: "Regional Offices",
            description:
              "Regional Offices manage and support ministry activities within specific geographic areas, facilitating communication and coordination between central leadership and local churches.",
            translationTitle: "ሀገረ ስብከት",
            translationDescription: "በክልል ደረጃ ፕሮግራሞችን ያስፈጽማሉ እና ክርክሮችን ይተባበራሉ።",
          },
          {
            title: "Local Churches & Fellowships",
            description:
              "Local Churches and Fellowships are the grassroots expression of the ministry, where believers gather for worship, discipleship, outreach, and community impact.",
            translationTitle: "አጥቢያ ቤተክርስቲያን",
            translationDescription: "ተልእኮውን በቀጥታ በማህበረሰብ ውስጥ የሚያገለግሉ መሠረታዊ ክፍሎች ናቸው።",
          },
        ],
        departmentsTitle: "Departments",
        departments: [
          { title: "Outreach & Missions", href: href("/departments/evangelism") },
          { title: "Education & Training", href: href("/departments/training-and-teaching") },
          { title: "Media & Communications", href: href("/departments/media-and-communication") },
          { title: "Research & Publication", href: href("/departments/research") },
          { title: "Development & Relief", href: href("/departments/charity-and-development") },
          { title: "Theological College", href: href("/departments") },
        ],
        leadershipTitle: "Founding Board Members",
        leadership: [
          { role: "General Manager", focus: "Spiritual Oversight" },
          { role: "Deputy Manager", focus: "Strategic Operations" },
          { role: "Department Heads", focus: "Ministry Leadership" },
        ],
        impactTitle: "Our Impact",
        impact: [
          { value: "50,000+", label: "People Reached" },
          { value: "1,200+", label: "Leaders Trained" },
          { value: "120+", label: "Churches Connected" },
          { value: "28", label: "Study Modules Developed" },
        ],
        finalTitle: "Partner with Us!",
        finalBody:
          "This reformative call belongs to all of us. Let us stand together to ensure that the doctrine and culture of our Church maintain their biblical essence and are passed down to future generations.",
        actions: [
          { label: "Get Involved", href: href("/contact") },
          { label: "Partner With Us", href: href("/donate") },
          { label: "Contact Us", href: href("/contact") },
        ],
      };

  const ministryIcons = [Megaphone, Users, BookOpen, Church, GraduationCap, Radio];
  const activityIcons = [Cross, HeartHandshake, ShieldCheck, Users];
  const departmentIcons = [Megaphone, GraduationCap, Radio, BookOpen, HandHelping, Landmark];
  const structureIcons = [Landmark, ShieldCheck, Building2, Network, Church];
  const heroImage = "https://images.unsplash.com/photo-1580320209809-a0c51e645872?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const activitySlides = [
    {
      src: "/assets/leadership/leaders.jpg",
      title: isAm ? "የሲኖዶስ ስብሰባ" : "Synod Meeting",
      subtitle: isAm ? "Synod Meeting" : "የሲኖዶስ ስብሰባ",
    },
    {
      src: "/assets/leadership/leaders.jpg",
      title: isAm ? "የአገልጋች ስልጠና" : "Leaders Training",
      subtitle: isAm ? "Leaders Training" : "የአገልጋች ስልጠና",
    },
    {
      src: "/assets/leadership/youth.jpg",
      title: isAm ? "የመስክ ጉብኝት" : "Youth Ministry",
      subtitle: isAm ? "Youth Ministry" : "የመስክ ጉብኝት",
    },
    {
      src: "/assets/leadership/worship.jpg",
      title: isAm ? "የቤተ.ክ ሥርዓተ አምልኮ" : "Church Service",
      subtitle: isAm ? "Church Service" : "የቤተ.ክ ሥርዓተ አምልኮ",
    },
    {
      src: "/assets/leadership/outreach.jpg",
      title: isAm ? "የቅዱስ ቄርሎስ ት/ቤት ተማሪዎች" : "Community Care",
      subtitle: isAm ? "Community Care" : "የቅዱስ ቄርሎስ ት/ቤት ተማሪዎች",
    },
    {
      src: "/assets/leadership/outreach.jpg",
      title: isAm ? "የመጽሐፍ ቅዱስ ሥርጭት" : "Community Outreach",
      subtitle: isAm ? "Community Outreach" : "የመጽሐፍ ቅዱስ ሥርጭት",
    },
  ];
  const leadershipSlides = [
    {
      src: "/assets/leadership/muse.jpg",
      title: isAm ? "መሪጌታ ሙሴ መንበሩ" : "Merigeta Muse Menberu",
      subtitle: isAm ? "ዋና ሥራ አስኪያጅ" : "General Manager",
    },
    {
      src: "/assets/leadership/diyakon.jpg",
      title: isAm ? "መሪጌታ ኤርምያስ ሙሉቀን" : "Merigeta Ermias Muluken",
      subtitle: isAm ? "ምክትል ሥራ አስኪያጅ" : "Deputy General Manager",
    },
    {
      src: "/assets/leadership/dawit.jpg",
      title: isAm ? "መሪጌታ ዳዊት ሙሉዬ" : "Merigeta Dawit Muluye",
      subtitle: isAm ? "የስብከተ ወንጌልና ሐዋሪያዊ ተልዕኮ መምሪያ ኃላፊ" : "Head of Evangelism and Apostolic Mission",
    },
    {
      src: "/assets/leadership/deqemezmur.jpg",
      title: isAm ? "መምህር እስመለዓለም ሀብቱ" : "Memhir Ismelealem Habtu",
      subtitle: isAm ? "የትምህርትና ስልጠና መምሪያ ኃላፊ" : "Head of Education and Training Department",
    },
    {
      src: "/assets/leadership/siyum.jpg",
      title: isAm ? "ዲያቆን/ዶክተር ስዩም ተረፈ" : "Deacon/Dr. Siyoum Terefe",
      subtitle: isAm ? "የሚዲያና ሕዝብ ግንኙነት ኃላፊ" : "Head of Media and Public Relations",
    },
    {
      src: "/assets/leadership/memhir-berhanu-abegaz.jpg",
      title: isAm ? "መምህር ብርሃኑ አበጋዝ" : "Memhir Berhanu Abegaz",
      subtitle: isAm ? "የቅዱስ ቄርሎስ ኮሌጅ ዲን" : "Dean of St. Cyril College",
    },
    {
      src: "/assets/leadership/siltanu.jpg",
      title: isAm ? "ዲያቆን ስልጣኑ" : "Diakon Siltanu",
      subtitle: isAm ? "አስተዳደርና ፋይናንስ መምሪያ ኃላፊ" : "Head of Administration and Finance Department",
    },
  ];

  return (
    <main className="home-crypto-bg text-[#17351f] overflow-x-clip">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,12,9,0.82)_0%,rgba(7,12,9,0.52)_42%,rgba(7,12,9,0.78)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(8,13,10,0.68))]" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-24 md:pt-28 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <MotionBlock>
            <p
              className={clsx(
                "mb-4 text-[#d6ff00]",
                isAm ? "font-ethiopic text-[0.82rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.2em]"
              )}
            >
              Home • {isAm ? "ስለ እኛ" : "About"}
            </p>

            <h1 className={clsx(h2Class, "text-white")}>{isAm ? "ስለ እኛ" : "About Us"}</h1>

            <p className={clsx("mt-6 max-w-xl text-white", isAm ? "font-ethiopic text-[0.94rem] leading-[1.9]" : "font-sans text-[0.95rem] leading-[1.9]")}>{content.historyP1}</p>

            <Link
              href="#about-highlights"
              className={clsx(
                "mt-8 inline-flex items-center gap-2 text-white hover:text-[#d6ff00] hover:gap-3 transition-all",
                isAm ? "font-ethiopic text-[0.92rem]" : "font-sans text-[0.78rem] uppercase tracking-[0.14em] font-semibold"
              )}
            >
              {isAm ? "ተጨማሪ ይመልከቱ" : "Learn More"}
              <ArrowRight size={14} />
            </Link>
          </MotionBlock>

          <MotionBlock delay={0.12}>
            <div className="relative h-[300px] sm:h-[360px] lg:h-[400px]">
              <div className="absolute -right-4 -top-4 md:-right-6 md:-top-6 w-[55%] h-[92%] bg-[linear-gradient(180deg,#d6ff00_0%,#a6ff4d_45%,#79b93f_100%)]" />
              <div className="absolute inset-x-0 top-7 sm:top-10 h-[78%] home-glass-panel shadow-[0_24px_55px_rgba(39,69,20,0.25)] overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(15,27,20,0.2))]" />
                <div className="absolute left-4 bottom-4 rounded-full px-3 py-1 text-[11px] tracking-[0.12em] uppercase bg-white/75 text-[#1e2012] font-semibold">
                  {content.historyTag}
                </div>
              </div>
            </div>
          </MotionBlock>
        </div>
        </div>
      </section>

      <section id="about-highlights" className="bg-[#0d160f] py-16 md:py-24 border-t border-[#d6ff00]/15">
        <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-10 md:space-y-12">
          <div className="relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-start rounded-[34px] bg-[linear-gradient(155deg,#142117_0%,#0b120c_100%)] p-4 md:w-[calc(100vw-2rem)] md:p-5 lg:w-[calc(100vw-3rem)] xl:w-[calc(100vw-4rem)] shadow-[0_22px_52px_rgba(0,0,0,0.28)]">
            <MotionBlock>
              <div className="rounded-[30px] bg-white/[0.04] border border-white/10 p-7 md:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
                <p className={clsx("text-[#d6ff00] mb-3", isAm ? "font-ethiopic text-[0.82rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>{structuredCopy.whoWeAreTitle}</p>
                <h2 className={clsx(h2Class, "text-white")}>{structuredCopy.whoWeAreTitle}</h2>
                <p className={clsx("mt-5 max-w-2xl text-white", isAm ? "font-ethiopic text-[0.94rem] leading-[1.9]" : "font-sans text-[0.95rem] leading-[1.9]")}>{structuredCopy.whoWeAreBody}</p>
              </div>
            </MotionBlock>

            <div className="grid sm:grid-cols-2 gap-4">
              {structuredCopy.highlights.map((item, index) => (
                <MotionBlock key={item.label} delay={0.08 + index * 0.06}>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 h-full">
                    <p className={clsx("text-white", isAm ? "font-ethiopic text-[0.76rem]" : "font-sans text-[0.68rem] uppercase tracking-[0.14em]")}>{item.label}</p>
                    <p className={clsx("mt-3 text-white", isAm ? "font-ethiopic text-[1rem] leading-[1.7]" : "font-serif text-[1.16rem] leading-[1.45]")}>{item.value}</p>
                  </div>
                </MotionBlock>
              ))}
            </div>
          </div>

          <div className="relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 rounded-[34px] bg-[linear-gradient(145deg,#f8fbd8_0%,#e2ef9d_100%)] p-4 md:w-[calc(100vw-2rem)] md:p-6 lg:w-[calc(100vw-3rem)] lg:p-7 xl:w-[calc(100vw-4rem)] shadow-[0_18px_46px_rgba(62,92,29,0.12)] border border-[#d6ff00]/20">
            <MotionBlock>
              <div className={clsx("home-glass-panel p-7 md:p-10 h-full", photoTextOverrideClass)}>
                <p className={clsx("text-[#4f8f26]", isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>{structuredCopy.visionTitle}</p>
                <h3 className={clsx("mt-3 text-[#17351f]", isAm ? "font-ethiopic text-[1.6rem]" : "font-serif text-[2rem] font-semibold")}>{structuredCopy.visionTitle}</h3>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <article className="rounded-2xl border border-[#17351f]/10 bg-white/70 p-5">
                    <h4 className={clsx("text-[#17351f]", "font-ethiopic text-[1.02rem] leading-[1.55]")}>{bilingualVision.amTitle}</h4>
                    <p className="mt-2 font-ethiopic text-[0.92rem] leading-[1.8] text-[#17351f]/86">{bilingualVision.amQuote}</p>
                    <p className="mt-3 font-ethiopic text-[0.9rem] leading-[1.82] text-[#17351f]/82">{bilingualVision.amBody}</p>
                  </article>
                  <article className="rounded-2xl border border-[#17351f]/10 bg-white/70 p-5">
                    <h4 className={clsx("text-[#17351f]", "font-serif text-[1.1rem] font-semibold")}>{bilingualVision.enTitle}</h4>
                    <p className="mt-2 font-sans text-[0.92rem] leading-[1.75] text-[#17351f]/86">{bilingualVision.enQuote}</p>
                    <p className="mt-3 font-sans text-[0.9rem] leading-[1.82] text-[#17351f]/82">{bilingualVision.enBody}</p>
                  </article>
                </div>
              </div>
            </MotionBlock>
          </div>

          <div className="relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 rounded-[34px] bg-[linear-gradient(145deg,#fff6de_0%,#f6e7b5_100%)] p-4 md:w-[calc(100vw-2rem)] md:p-6 lg:w-[calc(100vw-3rem)] lg:p-7 xl:w-[calc(100vw-4rem)] shadow-[0_18px_46px_rgba(92,74,29,0.12)] border border-[#e6c46b]/30">
            <MotionBlock>
              <div className={clsx("rounded-[28px] border border-[#17351f]/10 bg-white/70 p-7 md:p-10 h-full shadow-[0_16px_34px_rgba(92,74,29,0.08)]", photoTextOverrideClass)}>
                <p className={clsx("text-[#8f6a1f]", isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>{structuredCopy.missionTitle}</p>
                <h3 className={clsx("mt-3 text-[#17351f]", isAm ? "font-ethiopic text-[1.6rem]" : "font-serif text-[2rem] font-semibold")}>{structuredCopy.missionTitle}</h3>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <article className="rounded-2xl border border-[#17351f]/10 bg-white/70 p-5">
                    <h4 className="font-ethiopic text-[1.02rem] leading-[1.55] text-[#17351f]">{bilingualMission.amTitle}</h4>
                    <p className="mt-2 font-ethiopic text-[0.9rem] leading-[1.82] text-[#17351f]/82">{bilingualMission.amIntro}</p>
                    <ul className="mt-3 space-y-2">
                      {bilingualMission.goals.map((goal) => (
                        <li key={goal.am} className="font-ethiopic text-[0.88rem] leading-[1.78] text-[#17351f]/82">
                          {goal.am}
                        </li>
                      ))}
                    </ul>
                  </article>
                  <article className="rounded-2xl border border-[#17351f]/10 bg-white/70 p-5">
                    <h4 className="font-serif text-[1.1rem] font-semibold text-[#17351f]">{bilingualMission.enTitle}</h4>
                    <p className="mt-2 font-sans text-[0.9rem] leading-[1.82] text-[#17351f]/82">{bilingualMission.enIntro}</p>
                    <ul className="mt-3 space-y-2">
                      {bilingualMission.goals.map((goal) => (
                        <li key={goal.en} className="font-sans text-[0.88rem] leading-[1.78] text-[#17351f]/82">
                          {goal.en}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </div>
            </MotionBlock>
          </div>

          <div className={clsx("relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 rounded-[34px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f8d7_100%)] px-6 py-12 md:w-[calc(100vw-2rem)] md:px-10 md:py-14 lg:w-[calc(100vw-3rem)] xl:w-[calc(100vw-4rem)] shadow-[0_18px_46px_rgba(62,92,29,0.12)] border border-[#17351f]/8", photoTextOverrideClass)}>
            <MotionBlock>
              <div className="text-center max-w-2xl mx-auto">
                <p className={clsx("text-[#4f8f26]", isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>
                  Our Core Values 
                </p>
                <h2 className={clsx("mt-3", h2Class)}>{structuredCopy.coreValuesTitle}</h2>
                <p className={clsx("mt-4", pClass)}>{structuredCopy.coreValuesIntro}</p>
                <p className={clsx("mt-5 text-[#4f8f26]", isAm ? "font-ethiopic text-[0.78rem]" : "font-sans text-[0.68rem] uppercase tracking-[0.12em]")}>
                  {isAm ? "ካርዶችን ተጠቅመው ወደ እንግሊዝኛ ያዙሩ" : "Click cards to view Amharic"}
                </p>
              </div>
            </MotionBlock>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
              {structuredCopy.coreValues.map((item, index) => {
                const Icon = ministryIcons[index];
                const isFlipped = flippedCoreValueCards[`core-value-${index}`] ?? false;
                return (
                  <MotionBlock key={item.title} delay={0.06 * index}>
                    <div
                      className="block h-full w-full text-left [perspective:1400px] cursor-pointer"
                      onClick={() => setFlippedCoreValueCards((current) => ({
                        ...current,
                        [`core-value-${index}`]: !isFlipped,
                      }))}
                      aria-pressed={isFlipped}
                    >
                      <div
                        className={clsx(
                          "relative min-h-[320px] h-full w-full transition-transform duration-700 [transform-style:preserve-3d]",
                          isFlipped && "[transform:rotateY(180deg)]"
                        )}
                      >
                        <div className="crypto-card absolute inset-0 p-6 text-left [backface-visibility:hidden]">
                          <div className="w-12 h-12 rounded-2xl bg-[#a6ff4d]/55 flex items-center justify-center text-[#17351f] transition-transform group-hover:scale-105">
                            <Icon size={22} />
                          </div>
                          <h3 className={clsx("mt-5 text-[#17351f]", isAm ? "font-ethiopic text-[1rem] leading-[1.5]" : "font-serif text-[1.2rem] font-semibold")}>{item.title}</h3>
                          <p className={clsx("mt-3 text-[#17351f]/84", isAm ? "font-ethiopic text-[0.9rem] leading-[1.8]" : "font-sans text-[0.92rem] leading-[1.8]")}>{item.body}</p>
                          <p className={clsx("mt-4 text-[#4f8f26]", isAm ? "font-ethiopic text-[0.78rem]" : "font-sans text-[0.68rem] uppercase tracking-[0.14em]")}>{isAm ? "ከላይ ያለውን ቁልፍ ተጠቅመው ወደ እንግሊዝኛ ያዙሩ" : "Use the rotate button above to view Amharic"}</p>
                        </div>

                        <div className="crypto-card absolute inset-0 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[linear-gradient(180deg,#f8ffd6_0%,#eef8bd_100%)]">
                          <div className="w-12 h-12 rounded-2xl bg-[#17351f] flex items-center justify-center text-[#f3f8d7]">
                            <Icon size={22} />
                          </div>
                          <h3 className={clsx("mt-5 text-[#17351f]", !isAm ? "font-ethiopic text-[1rem] leading-[1.6]" : "font-serif text-[1.2rem] font-semibold")}>{item.translationTitle ?? item.title}</h3>
                          <p className={clsx("mt-3 text-[#17351f]/85", !isAm ? "font-ethiopic text-[0.92rem] leading-[1.85]" : "font-sans text-[0.92rem] leading-[1.8]")}>{item.translationBody ?? item.body}</p>
                          <p className={clsx("mt-4 text-[#4f8f26]", isAm ? "font-ethiopic text-[0.78rem]" : "font-sans text-[0.68rem] uppercase tracking-[0.14em]")}>{isAm ? "ከላይ ያለውን ቁልፍ ተጠቅመው ወደ አማርኛ ይመለሱ" : "Use the rotate button above to return"}</p>
                        </div>
                      </div>
                    </div>
                  </MotionBlock>
                );
              })}
            </div>
          </div>

          <div className={clsx("relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-10 items-start rounded-[34px] bg-[linear-gradient(180deg,#f4f9d4_0%,#dceca0_100%)] p-4 md:w-[calc(100vw-2rem)] md:p-5 lg:w-[calc(100vw-3rem)] xl:w-[calc(100vw-4rem)] shadow-[0_18px_46px_rgba(62,92,29,0.12)] border border-[#c6dd78]", photoTextOverrideClass)}>
            <MotionBlock>
              <div className="home-glass-panel p-7 md:p-10 sticky top-28">
                <p className={clsx("text-[#4f8f26]", isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>{structuredCopy.journeyTitle}</p>
                <h2 className={clsx("mt-3", h2Class)}>{structuredCopy.journeyTitle}</h2>
                <p className={clsx("mt-4", pClass)}>{content.historyP3}</p>
              </div>
            </MotionBlock>

            <div className="space-y-5">
              {structuredCopy.journey.map((item, index) => (
                <MotionBlock key={item.title} delay={0.08 * index}>
                  <div className="relative crypto-surface p-6 md:p-7 pl-10 md:pl-12">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#79b93f] via-[#d6ff00] to-transparent" />
                    <div className="absolute left-[9px] top-8 w-3 h-3 rounded-full bg-[#a6ff4d] shadow-[0_0_0_6px_rgba(166,255,77,0.18)]" />
                    <p className={clsx("text-[#4f8f26]", isAm ? "font-ethiopic text-[0.76rem]" : "font-sans text-[0.68rem] uppercase tracking-[0.16em]")}>{item.year}</p>
                    <h3 className={clsx("mt-2 text-[#17351f]", isAm ? "font-ethiopic text-[1.05rem]" : "font-serif text-[1.25rem] font-semibold")}>{item.title}</h3>
                    <p className={clsx("mt-3", pClass)}>{item.body}</p>
                  </div>
                </MotionBlock>
              ))}
            </div>
          </div>

          <div className="relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-start rounded-[34px] bg-[linear-gradient(165deg,#132117_0%,#0a120d_100%)] p-4 md:w-[calc(100vw-2rem)] md:p-5 lg:w-[calc(100vw-3rem)] xl:w-[calc(100vw-4rem)] shadow-[0_24px_60px_rgba(0,0,0,0.22)] border border-white/10">
            <MotionBlock>
              <div className="bg-[linear-gradient(170deg,#17351f_0%,#2f6620_100%)] rounded-[30px] p-7 md:p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,255,0,0.18)_0%,transparent_38%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.08)_0%,transparent_42%)]" />
                <div className="relative z-10">
                  <p className={clsx("text-white", isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>{structuredCopy.activitiesTitle}</p>
                  <h2 className={clsx("mt-3 text-white", h2Class)}>{structuredCopy.activitiesTitle}</h2>
                  <p className={clsx("mt-4 text-white", isAm ? "font-ethiopic text-[0.94rem] leading-[1.9]" : "font-sans text-[0.95rem] leading-[1.9]")}>{structuredCopy.activitiesBody}</p>
                </div>
              </div>
            </MotionBlock>

            <MotionBlock delay={0.08}>
              <SlidingImageStrip items={activitySlides} duration={24} />
            </MotionBlock>
          </div>

          <div className={clsx("relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 grid xl:grid-cols-2 gap-8 lg:gap-10 rounded-[34px] bg-[linear-gradient(145deg,#fffdf0_0%,#f1f7c4_100%)] p-4 md:w-[calc(100vw-2rem)] md:p-5 lg:w-[calc(100vw-3rem)] xl:w-[calc(100vw-4rem)] shadow-[0_18px_46px_rgba(62,92,29,0.12)] border border-[#dce999]", photoTextOverrideClass)}>
            <MotionBlock>
              <div className="crypto-surface p-7 md:p-10 h-full">
                <p className={clsx("text-[#4f8f26]", isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>{structuredCopy.structureTitle}</p>
                <h2 className={clsx("mt-3", h2Class)}>{structuredCopy.structureTitle}</h2>
                <div className="mt-7 space-y-4">
                  {structuredCopy.structure.map((item: StructureItem, index) => {
                    const Icon = structureIcons[index];
                    const isFlipped = flippedStructureCards[`structure-${index}`] ?? false;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -18 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.06 }}
                        className="[perspective:1200px]"
                      >
                        <div
                          className={clsx(
                            "relative min-h-[150px] transition-transform duration-700 [transform-style:preserve-3d]",
                            isFlipped && "[transform:rotateY(180deg)]"
                          )}
                        >
                          <div className="absolute inset-0 rounded-2xl border border-[#17351f]/10 bg-white/55 p-4 [backface-visibility:hidden]">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[#a6ff4d]/55 flex items-center justify-center text-[#17351f] flex-shrink-0">
                                <Icon size={18} />
                              </div>
                              <p className={clsx("flex-1 text-[#17351f]", isAm ? "font-ethiopic text-[0.94rem]" : "font-sans text-[0.95rem]")}>{item.title}</p>
                              <button
                                type="button"
                                onClick={() => toggleStructureCard(index, true)}
                                className="inline-flex h-8 items-center justify-center rounded-full border border-[#17351f]/20 bg-white/80 px-3 text-[#17351f]"
                                aria-label={isAm ? `${item.title} ትርጉም አሳይ` : `Show Amharic translation for ${item.title}`}
                              >
                                <span className={clsx(isAm ? "font-ethiopic text-[0.72rem]" : "font-sans text-[0.62rem] uppercase tracking-[0.1em]")}>{isAm ? "እንግሊዝኛ" : "Amharic"}</span>
                              </button>
                            </div>
                            <p className={clsx("mt-3 text-[#17351f]/82", isAm ? "font-ethiopic text-[0.88rem] leading-[1.75]" : "font-sans text-[0.88rem] leading-[1.75]")}>
                              {item.description}
                            </p>
                          </div>

                          <div className="absolute inset-0 rounded-2xl border border-[#17351f]/10 bg-[linear-gradient(180deg,#f8ffd6_0%,#eef8bd_100%)] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[#17351f] flex items-center justify-center text-[#f3f8d7] flex-shrink-0">
                                <Icon size={18} />
                              </div>
                              <p className={clsx("flex-1 text-[#17351f]", !isAm ? "font-ethiopic text-[0.94rem]" : "font-sans text-[0.95rem]")}>{item.translationTitle ?? item.title}</p>
                              <button
                                type="button"
                                onClick={() => toggleStructureCard(index, false)}
                                className="inline-flex h-8 items-center justify-center rounded-full border border-[#17351f]/20 bg-white/80 px-3 text-[#17351f]"
                                aria-label={isAm ? `${item.title} ወደ አማርኛ ተመለስ` : `Return to English for ${item.title}`}
                              >
                                <span className={clsx(!isAm ? "font-ethiopic text-[0.72rem]" : "font-sans text-[0.62rem] uppercase tracking-[0.1em]")}>{isAm ? "አማርኛ" : "English"}</span>
                              </button>
                            </div>
                            <p className={clsx("mt-3 text-[#17351f]/82", !isAm ? "font-ethiopic text-[0.88rem] leading-[1.75]" : "font-sans text-[0.88rem] leading-[1.75]")}>
                              {item.translationDescription ?? item.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </MotionBlock>

            <MotionBlock delay={0.08}>
              <div className="crypto-surface p-7 md:p-10 h-full">
                <p className={clsx("text-[#4f8f26]", isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>
                  {isAm ? "አስተዳደራዊ መዋቅር ስዕል" : "Administrative Structure Chart"}
                </p>
                <h2 className={clsx("mt-3", h2Class)}>{isAm ? "የደረጃ አቀማመጥ ምስል" : "Hierarchy Visual"}</h2>
                <p className={clsx("mt-4", pClass)}>
                  {isAm
                    ? "የማዕከላዊ አመራር እስከ አካባቢ ኅብረቶች ድረስ ያለውን ተዋረድ በአንድ ምስል ይመልከቱ።"
                    : ""}
                </p>

                <div
                  className="mt-6 block w-full overflow-hidden rounded-2xl border border-[#17351f]/18 bg-white/65 shadow-[0_14px_28px_rgba(23,53,31,0.1)]"
                >
                  <Image
                    src={structureImageSrc}
                    alt={isAm ? "የአስተዳደር መዋቅር ምስል" : "Administrative structure chart"}
                    width={1600}
                    height={1000}
                    className="h-auto w-full object-contain"
                    onError={() => setStructureImageSrc("/assets/structure.png")}
                  />
                </div>
              </div>
            </MotionBlock>
          </div>

          <div className="relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-10 items-start rounded-[34px] bg-[linear-gradient(160deg,#181818_0%,#101010_100%)] p-4 md:w-[calc(100vw-2rem)] md:p-5 lg:w-[calc(100vw-3rem)] xl:w-[calc(100vw-4rem)] shadow-[0_24px_60px_rgba(0,0,0,0.24)] border border-white/10">
            <MotionBlock>
              <div className="rounded-[30px] bg-[#121212] border border-white/10 p-7 md:p-10 h-full shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
                <p className={clsx("text-white", isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>{structuredCopy.leadershipTitle}</p>
                <h2 className={clsx("mt-3 text-white", h2Class)}>{structuredCopy.leadershipTitle}</h2>
                <p className={clsx("mt-4 text-white", isAm ? "font-ethiopic text-[0.94rem] leading-[1.9]" : "font-sans text-[0.95rem] leading-[1.9]")}>{isAm ? "የጠቅላይ ጽ/ቤት አስተባባሪዎች" : "General Secretariat Coordinators"}</p>
              </div>
            </MotionBlock>

            <MotionBlock delay={0.08}>
              <SlidingImageStrip items={leadershipSlides} duration={22} grayscale />
            </MotionBlock>
          </div>

          <div className={clsx("relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 rounded-[34px] bg-[linear-gradient(145deg,#dff28a_0%,#bddd53_100%)] px-6 py-12 md:w-[calc(100vw-2rem)] md:px-10 md:py-14 lg:w-[calc(100vw-3rem)] xl:w-[calc(100vw-4rem)] shadow-[0_18px_46px_rgba(62,92,29,0.16)] border border-[#9ebc47]", photoTextOverrideClass)}>
            <MotionBlock>
              <div className="text-center max-w-2xl mx-auto">
                <p className={clsx("text-[#4f8f26]", isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.18em]")}>{structuredCopy.impactTitle}</p>
                <h2 className={clsx("mt-3", h2Class)}>{structuredCopy.impactTitle}</h2>
              </div>
            </MotionBlock>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              {structuredCopy.impact.map((item, index) => (
                <MotionBlock key={item.label} delay={0.06 * index}>
                  <div className="crypto-card-highlight p-6 md:p-7 h-full text-center">
                    <div className={clsx("text-[#000000] font-bold", isAm ? "font-ethiopic text-[1.8rem]" : "font-serif text-[2.3rem] font-semibold")}>{item.value}</div>
                    <p className={clsx("mt-3", isAm ? "font-ethiopic text-[0.84rem]" : "font-sans text-[0.78rem] uppercase tracking-[0.12em]")}>{item.label}</p>
                  </div>
                </MotionBlock>
              ))}
            </div>
          </div>
        </div>
      </section>



      <section className="relative bg-[#09110b] py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(166,255,77,0.22)_0%,transparent_38%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08)_0%,transparent_45%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <MotionBlock>
            <h2 className={clsx("text-white", h2Class)}>{structuredCopy.finalTitle}</h2>
            <p className={clsx("mt-4 text-white max-w-2xl mx-auto", isAm ? "font-ethiopic text-[0.94rem] leading-[1.9]" : "font-sans text-[0.95rem] leading-[1.9]")}>{structuredCopy.finalBody}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {structuredCopy.actions.map((action, index) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={clsx(
                    index === 0
                      ? "inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#d6ff00] text-[#17351f] hover:bg-[#a6ff4d] transition-colors font-semibold"
                      : "inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/30 text-white hover:border-[#d6ff00] hover:text-[#d6ff00] transition-colors",
                    isAm ? "font-ethiopic text-[0.9rem]" : "font-sans text-[0.8rem] uppercase tracking-[0.1em]"
                  )}
                >
                  {action.label}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </MotionBlock>
        </div>
      </section>

    </main>
  );
}

