import { spawn } from "child_process";

export async function POST(req) {
    const prompt = await req.json();

    const mcp = spawn("node", ["mcp/server.js"]);

    return Response.json({
        message: "AI request processed",
    });
}