import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

function testService() {
    const message = "API FOUND"
    return message
}

async function testController(_req: FastifyRequest, reply: FastifyReply) {
    try {
        const hello = await testService()
        reply.send(hello)
    } catch (error) {
        reply.status(500).send({ error: "Failed? API" })
    }
}
export default async function testRoutes(server: FastifyInstance) {
    server.get("/api", testController);
}