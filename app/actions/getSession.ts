import { getServerSession } from "next-auth";
import { authOptions } from "../hooks/authOptions";

export default async function getSession() {
    return await getServerSession(authOptions);
}