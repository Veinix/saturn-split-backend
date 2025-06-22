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
        const userId = req.userId
        const groups = await groupService.getUserGroups(userId, reply.server.supabase);
        return reply.send(groups);
    } catch (err: any) {
        req.log.error(err);
        return reply.status(500).send({ message: err.message });
    }
}

export async function fetchSingleGroup(req: FastifyRequest<{ Params: { groupId: string } }>, reply: FastifyReply) {
    try {
        const { groupId } = req.params
        const singleGroupData = await groupService.getSingleGroup(groupId, reply.server.supabase)
        return reply.send(singleGroupData)
    } catch (err: any) {
        req.log.error(err)
        return reply.status(500).send({ message: err.message })
    }
}

export async function isUserGroupMember(req: FastifyRequest, reply: FastifyReply) {
    // try {
    //     const userId = req.userId
    //     const groupId = req.params?.groupId ?
    // } catch (error) {

    // }
}