import fastify, { FastifyInstance } from "fastify";
import { fetchGroups, fetchMyGroups, fetchSingleGroup } from "../2-controllers/groupsController";

export default async function groupRoutes(app: FastifyInstance) {
    app.get("/groups", { preHandler: app.authenticate }, fetchMyGroups)
    app.get<{ Params: { groupId: string } }>("/groups/:groupId", { preHandler: app.authenticate }, fetchSingleGroup)
    // app.post("/groups/:groupId", { preHandler: app.authenticate }, fetchMyGroups)
}