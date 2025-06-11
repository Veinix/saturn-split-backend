import { FastifyInstance } from "fastify";
import { fetchGroups, fetchMyGroups } from "../2-controllers/groupsController";

export default async function groupRoutes(app: FastifyInstance) {
    app.get("/groups", fetchMyGroups)
    // server.get("/groups", fetchGroups)

}