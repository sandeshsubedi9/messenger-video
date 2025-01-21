import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
    try{
        const CurrentUser = await getCurrentUser();
        const body = await request.json();
        const { name, image } = body;

        if (!CurrentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const updatedUser = await prisma.user.update({
            where: {
                id: CurrentUser.id
            },
            data: {
                image: image,
                name: name
            }
        })
        return NextResponse.json(updatedUser);

    } catch (error: any) {
        console.log(error, "REGISTRATION_ERROR");
        return new NextResponse("Internal Error", { status: 500 });
    }
}