import enMessages from "@/messages/en.json";
import amMessages from "@/messages/am.json";

export type Lang = "en" | "am";

export type Translations = {
  nav: {
    home: string;
    about: string;
    education: string;
    sermons: string;
    blog: string;
    library: string;
    contact: string;
    departments: string;
    integration: string;
    lms: string;
    donate: string;
  };
  hero: {
    eyebrow: string;
    line1: string;
    line2: string;
    line3: string;
    motto: string;
    scroll: string;
    cta_support: string;
    cta_learn: string;
  };
  footer: {
    title: string;
    motto: string;
    links: {
      home: string;
      about: string;
      departments: string;
      blog: string;
      sermons: string;
      library: string;
      contact: string;
      integration: string;
      lms: string;
      donate: string;
    };
    copyright: string;
    followUs: string;
  };
  mission: {
    overline: string;
    heading: string;
    mission_label: string;
    mission_text: string;
    vision_label: string;
    vision_text: string;
    cta_story: string;
    cta_dept: string;
  };
  mega: {
    hq_title: string;
    dept: {
      mediaComm: string;
      trainingTeaching: string;
      charityDevelopment: string;
    };
    edu_title: string;
    edu: {
      diploma: string;
      degree: string;
      masters: string;
      library: string;
    };
    integration_title: string;
    integration_sub: string;
    int: {
      library: string;
      lms: string;
      graduation: string;
    };
    viewAll: string;
    structureDesc: string;
  };
  about: {
    title: string;
    intro: string;
  };
};

export const translations: Record<Lang, Translations> = {
  en: {
    nav: {
      home: enMessages.nav.home,
      about: enMessages.nav.about,
      education: "College",
      sermons: enMessages.nav.sermons,
      blog: enMessages.nav.blog,
      library: enMessages.nav.library,
      contact: enMessages.nav.contact,
      departments: enMessages.nav.departments,
      integration: enMessages.nav.integration,
      lms: "LMS",
      donate: enMessages.nav.donate,
    },
    hero: {
      eyebrow: enMessages.hero.eyebrow,
      line1: enMessages.hero.line1,
      line2: enMessages.hero.line2,
      line3: enMessages.hero.line3,
      motto: enMessages.hero.motto,
      scroll: enMessages.hero.scroll,
      cta_support: enMessages.hero.cta_support,
      cta_learn: enMessages.hero.cta_learn,
    },
    footer: {
      title: "Hamere Wengel ZE Ethiopia",
      motto: enMessages.footer.motto,
      links: {
        home: enMessages.footer.links.home,
        about: enMessages.footer.links.about,
        departments: enMessages.footer.links.departments,
        blog: enMessages.footer.links.blog,
        sermons: enMessages.footer.links.sermons,
        library: enMessages.footer.links.library,
        contact: enMessages.footer.links.contact,
        integration: enMessages.footer.links.integration,
        lms: enMessages.footer.links.lms,
        donate: enMessages.footer.links.donate,
      },
      copyright: "© 2026 Hamere Wengel ZE Ethiopia",
      followUs: "Follow Us",
    },
    mission: {
      overline: enMessages.mission.overline,
      heading: enMessages.mission.heading,
      mission_label: enMessages.mission.mission_label,
      mission_text: enMessages.mission.mission_text,
      vision_label: enMessages.mission.vision_label,
      vision_text: enMessages.mission.vision_text,
      cta_story: enMessages.mission.cta_story,
      cta_dept: enMessages.mission.cta_dept,
    },
    mega: {
      hq_title: "Departments",
      dept: {
        mediaComm: enMessages.departments.m1_title,
        trainingTeaching: enMessages.departments.m2_title,
        charityDevelopment: enMessages.departments.m3_title,
      },
      edu_title: enMessages.mega.edu_title,
      edu: {
        diploma: enMessages.mega.edu.diploma,
        degree: enMessages.mega.edu.degree,
        masters: enMessages.mega.edu.masters,
        library: enMessages.library.hero_title,
      },
      integration_title: enMessages.integration.title,
      integration_sub: enMessages.integration.subtitle,
      int: {
        library: enMessages.integration.card_library_title,
        lms: enMessages.integration.card_lms_title,
        graduation: enMessages.integration.card_grad_title,
      },
      viewAll: "View all departments",
      structureDesc: "Explore programmes, resources, and how each department serves our mission.",
    },
    about: {
      title: "About Us",
      intro: enMessages.about.history_p1,
    },
  },
  am: {
    nav: {
      home: amMessages.nav.home,
      about: amMessages.nav.about,
      education: "ኮሌጅ",
      sermons: amMessages.nav.sermons,
      blog: amMessages.nav.blog,
      library: amMessages.nav.library,
      contact: amMessages.nav.contact,
      departments: amMessages.nav.departments,
      integration: "Integration",
      lms: "LMS",
      donate: amMessages.nav.donate,
    },
    hero: {
      eyebrow: amMessages.hero.eyebrow,
      line1: amMessages.hero.line1,
      line2: amMessages.hero.line2,
      line3: amMessages.hero.line3,
      motto: amMessages.hero.motto,
      scroll: amMessages.hero.scroll,
      cta_support: amMessages.hero.cta_support,
      cta_learn: amMessages.hero.cta_learn,
    },
    footer: {
      title: "ሐመረ ወንጌል ዘኢትዮጵያ",
      motto: amMessages.footer.motto,
      links: {
        home: amMessages.footer.links.home,
        about: amMessages.footer.links.about,
        departments: amMessages.footer.links.departments,
        blog: amMessages.footer.links.blog,
        sermons: amMessages.footer.links.sermons,
        library: amMessages.footer.links.library,
        contact: amMessages.footer.links.contact,
        integration: "Integration",
        lms: amMessages.footer.links.lms,
        donate: amMessages.footer.links.donate,
      },
      copyright: "© 2026 ሐመረ ወንጌል ዘኢትዮጵያ",
      followUs: "ማህበራዊ ገጾቻችን",
    },
    mission: {
      overline: amMessages.mission.overline,
      heading: amMessages.mission.heading,
      mission_label: amMessages.mission.mission_label,
      mission_text: amMessages.mission.mission_text,
      vision_label: amMessages.mission.vision_label,
      vision_text: amMessages.mission.vision_text,
      cta_story: amMessages.mission.cta_story,
      cta_dept: amMessages.mission.cta_dept,
    },
    mega: {
      hq_title: "ክፍሎች",
      dept: {
        mediaComm: amMessages.departments.m1_title,
        trainingTeaching: amMessages.departments.m2_title,
        charityDevelopment: amMessages.departments.m3_title,
      },
      edu_title: amMessages.mega.edu_title,
      edu: {
        diploma: amMessages.mega.edu.diploma,
        degree: amMessages.mega.edu.degree,
        masters: amMessages.mega.edu.masters,
        library: amMessages.library.hero_title,
      },
      integration_title: "Integration",
      integration_sub: "Library, LMS and graduation",
      int: {
        library: amMessages.library.hero_title,
        lms: "LMS",
        graduation: "Graduation",
      },
      viewAll: "ሁሉንም ክፍሎች ይመልከቱ",
      structureDesc: "ፕሮግራሞችን፣ ምንጮችን እና እያንዳንዱ ክፍል ተልዕኳችንን እንዴት እንደሚያገለግል ያስሱ።",
    },
    about: {
      title: "ስለ እኛ",
      intro: amMessages.about.history_p1,
    },
  },
};
