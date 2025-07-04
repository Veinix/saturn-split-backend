import { FastifyInstance } from "fastify";
import { fetchMyGroups, fetchSingleGroup } from "../2-controllers/group-controller";

export default async function groupRoutes(app: FastifyInstance) {
    app.get("/groups", { preHandler: app.authenticate }, fetchMyGroups)
    app.get<{ Params: { groupId: string } }>("/groups/:groupId", { preHandler: app.authenticate }, fetchSingleGroup)
    // app.post("/groups/:groupId", { preHandler: app.authenticate }, fetchMyGroups)
}