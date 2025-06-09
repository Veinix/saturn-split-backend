import { FastifyRequest, FastifyReply } from "fastify";
import groupService from "../3-services/groupsService";

export async function fetchGroups(_req: FastifyRequest, reply: FastifyReply) {
    try {
        const groups = await groupService.getAllGroups(reply.server.supabase);
        console.log(groups)
        reply.code(200).send(groups);
    } catch (err) {
        _req.log.error(err)
        reply.status(500).send({ error: "Failed to fetch groups" });
    }
}

export async function fetchMyGroups(req: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = req.user.id as string;
        const groups = await groupService.getUserGroups(userId, reply.server.supabase);
        return reply.send(groups);
    } catch (err: any) {
        req.log.error(err);
        return reply.status(500).send({ message: err.message });
    }
}