import { fetchMyGroups, fetchSingleGroup } from "@controllers/group-controller";
import { FastifyInstance } from "fastify";

export default async function groupRoutes(app: FastifyInstance) {
    app.get("/groups", { preHandler: app.authenticate }, fetchMyGroups)
    app.get<{ Params: { groupId: string } }>("/groups/:groupId", { preHandler: app.authenticate }, fetchSingleGroup)
    // app.post<{ Params: { groupId: string }, Body: GroupExpense }>("/groups/:groupId", { preHandler: app.authenticate }, addGroupExpense)
}