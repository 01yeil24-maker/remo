// Neon DB에 초기 데이터를 넣는 시드 스크립트입니다.
// DATABASE_URL 설정 후 `npx prisma db seed` 로 실행하세요.
// (이 파일은 tsconfig.json에서 제외되어 있어, DB 연동 전에도 `npm run build`에 영향을 주지 않습니다.)

import { PrismaClient } from "@prisma/client";
import { teamMembers, projects, galleryPhotos } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  for (const [index, member] of teamMembers.entries()) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: {},
      create: {
        slug: member.slug,
        name: member.name,
        role: member.role,
        bio: member.bio,
        photoUrl: member.photo,
        order: index,
      },
    });
  }

  for (const [index, project] of projects.entries()) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        slug: project.slug,
        title: project.title,
        category: project.category,
        description: project.description,
        members: project.members,
        order: index,
      },
    });
  }

  for (const [index, photo] of galleryPhotos.entries()) {
    await prisma.galleryImage.create({
      data: {
        imageUrl: `/gallery/${photo.id}.jpg`,
        caption: photo.caption,
        order: index,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
