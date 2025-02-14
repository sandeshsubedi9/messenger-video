// import getCurrentUser from "@/app/actions/getCurrentUser";
// import { NextResponse } from "next/server";
// import prisma from "@/app/libs/prismadb";
// import { pusherServer } from "@/app/libs/pusher";

// interface Iparams {
//     conversationId?: string
// }

// export async function POST(request: Request, { params }: { params: Iparams }) {
//     try{
//         const { conversationId } = params;
//         const currentUser = await getCurrentUser();
        

//         if (!currentUser?.id || !currentUser?.email) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         //Find the existing conversation
//         const conversation = await prisma.conversation.findUnique({
//             where: {
//                 id: conversationId
//             },
//             include: {
//                 messages: {
//                     include: {
//                         seen: true
//                     }
//                 },
//                 users: true
//             }
//         })

//         if (!conversation) {
//             return new NextResponse("Invalid ID", { status: 400 });
//         }

//         //Find last message
//         const lastMessage = conversation.messages[conversation.messages.length - 1];

//         if (!lastMessage) {
//             return NextResponse.json(conversation);
//         }

//         //Update seen of last message
//         const updatedMessage = await prisma.message.update({
//             where: {
//                 id: lastMessage.id
//             },
//             include: {
//                 seen: true,
//                 sender: true,
//             },
//             data: {
//                 seen: {
//                     connect: {
//                         id: currentUser.id
//                     }
//                 }
//             }
//         })

//         await pusherServer.trigger(currentUser.email, "conversation:update",
//             {
//                 id: conversationId,
//                 messages: [updatedMessage]
//             }
//         );

//         if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
//             return NextResponse.json(conversation);
//         }

//         await pusherServer.trigger(conversationId!, "message:update", updatedMessage);

//         return NextResponse.json(updatedMessage);

//     } catch (error:any) {
//         console.log(error, "ERROR_MESSAGES_SEEN");
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }













import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const conversationId = url.pathname.split('/')[3]; // Extract conversationId directly from URL

        if (!conversationId) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Find the existing conversation
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        });

        if (!conversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Find last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        // Update seen of last message
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                seen: true,
                sender: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        await pusherServer.trigger(currentUser.email, "conversation:update", {
            id: conversationId,
            messages: [updatedMessage]
        });

        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(conversationId!, "message:update", updatedMessage);

        return NextResponse.json(updatedMessage);

    } catch (error: any) {
        console.error("ERROR_MESSAGES_SEEN:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}






