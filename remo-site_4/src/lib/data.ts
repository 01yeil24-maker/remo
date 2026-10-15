// REMO 팀 홈페이지의 콘텐츠입니다.
// 지금은 이 파일의 정적 데이터를 사용하지만, Neon(Postgres) 연동이 끝나면
// 아래 함수들의 내부만 Prisma 쿼리로 교체하면 됩니다. (개발 안내서의 "시스템 설계" 참고)

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  members: string[]; // TeamMember name 참조
};

export type GalleryPhoto = {
  id: string;
  caption: string;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "bruno",
    name: "Bruno",
    role: "Team Leader",
    bio: "팀을 이끌며 Northwest People's 프로젝트를 함께하고 있어요.",
    photo: "/team/bruno.png",
  },
  {
    slug: "eugene",
    name: "Eugene",
    role: "Communication Leader",
    bio: "팀 안팎의 소통을 담당하며 Northwest People's 프로젝트에 참여하고 있어요.",
    photo: "/team/eugene.png",
  },
  {
    slug: "sol",
    name: "Sol",
    role: "Financial Leader",
    bio: "팀의 재정을 관리하며 Moodism 프로젝트를 함께하고 있어요.",
    photo: "/team/sol.png",
  },
  {
    slug: "zoey",
    name: "Zoey",
    role: "Sub Leader",
    bio: "팀 운영 전반을 살피며 REMO를 뒷받침하고 있어요.",
    photo: "/team/zoey.png",
  },
  {
    slug: "jeongwoo",
    name: "Jeongwoo",
    role: "Teammate",
    bio: "Moodism과 Northwest People's, 두 프로젝트에 함께하고 있어요.",
    photo: "/team/jeongwoo.png",
  },
  {
    slug: "gyeom",
    name: "Gyeom",
    role: "Teammate",
    bio: "Moodism 프로젝트를 함께하고 있어요.",
    photo: "/team/gyeom.png",
  },
  {
    slug: "rho",
    name: "Rho",
    role: "Teammate",
    bio: "데이터 플로우 프로젝트를 함께하고 있어요.",
    photo: "/team/rho.png",
  },
  {
    slug: "vic",
    name: "Vic",
    role: "Teammate",
    bio: "REMO의 팀원으로 함께하고 있어요.",
    photo: "/team/vic.png",
  },
  {
    slug: "eden",
    name: "Eden",
    role: "Teammate",
    bio: "PLN과 데이터 플로우, 두 프로젝트에 함께하고 있어요.",
    photo: "/team/eden.png",
  },
  {
    slug: "max",
    name: "Max",
    role: "Teammate",
    bio: "PLN 프로젝트를 함께하고 있어요.",
    photo: "/team/max.png",
  },
];

export const projects: Project[] = [
  {
    slug: "moodism",
    title: "Moodism",
    category: "패션 브랜드",
    description: "기분과 취향을 담은 옷을 만드는 패션 브랜드 프로젝트예요.",
    members: ["Jeongwoo", "Gyeom", "Sol"],
  },
  {
    slug: "pln",
    title: "PLN",
    category: "서비스 기획",
    description: "대학생 맞춤 시간관리 서비스를 만드는 프로젝트예요.",
    members: ["Max", "Eden"],
  },
  {
    slug: "northwest-peoples",
    title: "Northwest People's",
    category: "콘텐츠",
    description: "축구를 이야기하는 팟캐스트 프로젝트예요.",
    members: ["Jeongwoo", "Bruno", "Eugene"],
  },
  {
    slug: "data-flow",
    title: "데이터 플로우",
    category: "소프트웨어 개발",
    description: "응용 소프트웨어를 함께 개발하는 프로젝트예요.",
    members: ["Eden", "Rho"],
  },
];

export const philosophy = {
  tagline: "한계 없는 버전의 팀",
  taglineEn: "A version of a team without limits",
  quote:
    "처음부터 잘하려고 하지 않아도 괜찮아요. 많이 부딪히고, 실패하고, 질문하면서 나에게 맞는 방법을 찾아갑니다.",
  values: [
    {
      title: "정답보다 방법",
      body: "결국 얻어가는 건 정해진 정답이 아니라, 스스로 움직일 수 있는 힘이라고 믿어요.",
    },
    {
      title: "부딪히며 배우기",
      body: "많이 부딪히고 실패하고 질문하면서, 나에게 맞는 방법을 찾아갑니다.",
    },
    {
      title: "함께 만드는 경험",
      body: "1년 뒤에 '이것도 해봤다'고 말할 수 있는 경험을 함께 만들어가요.",
    },
  ],
};

export const galleryPhotos: GalleryPhoto[] = [
  { id: "01", caption: "REMO" },
  { id: "02", caption: "팀 모임" },
  { id: "03", caption: "프로젝트" },
  { id: "04", caption: "환영회" },
  { id: "05", caption: "회의" },
  { id: "06", caption: "워크숍" },
  { id: "07", caption: "팀원들" },
  { id: "08", caption: "REMO" },
];
