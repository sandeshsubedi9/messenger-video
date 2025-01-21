// import getConversationById from "@/app/actions/getConversationById"
// import getMessage from "@/app/actions/getMessages"
// import EmptyState from "@/app/components/EmptyState"
// import Header from "./components/Header"
// import Body from "./components/Body"
// import Form from "./components/Form"

//  interface IParams{
//     conversationId: string
//  }

//  const conversationId = async ({params}:{params: IParams}) => {
//     const conversation = await getConversationById(params.conversationId)
//     const messages = await getMessage(params.conversationId)

//     if (!conversation) {
//         return (
//             <div className="lg:pl-80 h-full">
//                 <div className="h-full flex flex-col">
//                     <EmptyState/>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="lg:pl-80 h-full">
//             <div className="h-full flex flex-col">
//                 <Header conversation={conversation}/>
//                 <Body initialMessages={messages} />
//                 <Form />
//             </div>
    
//         </div>
//     )
//  }

//  export default conversationId













import getConversationById from "@/app/actions/getConversationById"
import getMessage from "@/app/actions/getMessages"
import EmptyState from "@/app/components/EmptyState"
import Header from "./components/Header"
import Body from "./components/Body"
import Form from "./components/Form"

 interface IParams{
    conversationId: string
 }

 const conversationId = async ({params}:{params: Promise<IParams> }) => {
    const { conversationId } = await params;

    // Now await the asynchronous calls for conversation and messages
    const conversation = await getConversationById(conversationId);
    const messages = await getMessage(conversationId);

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState/>
                </div>
            </div>
        )
    }

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation}/>
                <Body initialMessages={messages} />
                <Form />
            </div>
    
        </div>
    )
 }

 export default conversationId











