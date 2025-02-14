// import getCurrentUser from "@/app/actions/getCurrentUser";
// import { NextResponse } from "next/server";
// import prisma from "@/app/libs/prismadb";
// import { pusherServer } from "@/app/libs/pusher";

// interface IParams {
//     conversationId?: string
// }

// export async function DELETE(request: Request, { params }: { params: IParams }) {
//     try {
//         const { conversationId } = params
//         const CurrentUser = await getCurrentUser();

//         if (!CurrentUser?.id) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         const existingConversation = await prisma.conversation.findUnique({
//             where: {
//                 id: conversationId
//             },
//             include: {
//                 users: true
//             }
//         })

//         if (!existingConversation) {
//             return new NextResponse("Invalid ID", { status: 400 });
//         }

//         const deletedConversation = await prisma.conversation.deleteMany({
//             where: {
//                 id: conversationId,
//                 userIds: {
//                     hasSome: [CurrentUser.id]
//                 }
//             }
//         })

//         existingConversation.users.forEach((user) => {
//             if (user.email) {
//                 pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
//             }
//         })

//         return NextResponse.json(deletedConversation)

//     } catch (error: any) {
//         console.log(error, "DELETE_CONVERSATION_ERROR")
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }








import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const conversationId = url.pathname.split('/').pop();

        if (!conversationId) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const CurrentUser = await getCurrentUser();

        if (!CurrentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        if (!existingConversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [CurrentUser.id]
                }
            }
        });

        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
            }
        });

        return NextResponse.json(deletedConversation);
    } catch (error: any) {
        console.log(error, "DELETE_CONVERSATION_ERROR");
        return new NextResponse("Internal Error", { status: 500 });
    }
}
