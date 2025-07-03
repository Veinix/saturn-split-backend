import { FastifyInstance } from "fastify";
import { addGroupExpense, fetchMyGroups, fetchSingleGroup } from "../2-controllers/group-controller";
import { GroupExpenses } from "../types/db.types";

export default async function groupRoutes(app: FastifyInstance) {
    app.get("/groups", { preHandler: app.authenticate }, fetchMyGroups)
    app.get<{ Params: { groupId: string } }>("/groups/:groupId", { preHandler: app.authenticate }, fetchSingleGroup)
    app.post<{ Params: { groupId: string }, Body: GroupExpenses }>("/groups/:groupId", { preHandler: app.authenticate }, addGroupExpense)
}