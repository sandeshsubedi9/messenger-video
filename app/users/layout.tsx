
import getUsers from "../actions/getUser";
import SideBar from "../components/sidebar/Sidebar"
import UserList from "./components/UserList";

export default async function usersLayout({
    children
}: {
    children: React.ReactNode
}) {
    const users = await getUsers();
    
    return (
        <SideBar>
            <div className="h-full">
                <UserList items = {users}/>
                {children}
            </div>
        </SideBar>
    )
}