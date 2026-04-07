// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adapte selon ton chemin
import { prisma } from "@/lib/prisma";   // adapte selon ton chemin

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email && !session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullname: true,
      email: true,
      phone: true,
      image: true,
      city: true,
      region: true,
      points: true,
      createdAt: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();

  // On whiteliste les champs modifiables
  const { fullname, phone, city, region } = body;

  // Validation basique du numéro de téléphone
  if (phone && !/^[+\d\s\-().]{6,20}$/.test(phone)) {
    return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(fullname !== undefined && { fullname }),
      ...(phone !== undefined && { phone }),
      ...(city !== undefined && { city }),
      ...(region !== undefined && { region }),
    },
    select: {
      id: true,
      fullname: true,
      email: true,
      phone: true,
      image: true,
      city: true,
      region: true,
      points: true,
    },
  });

  return NextResponse.json(updatedUser);
}