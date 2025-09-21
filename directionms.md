You are analyzing my existing website + agent system.  
Integrate the Sequential Thinking MCP server (from modelcontextprotocol) into my backend/agent logic as a reasoning tool.

Requirements:

1. The site must remain *exactly* as is from the end-user perspective. No UI changes; same pages; same workflows.  
2. Admin panel with OAuth stays identical.  
3. Add the MCP server as a separate component: either via Docker service or via NPX invocation, whichever is simpler within current setup.  
4. Modify the agent logic so that whenever reasoning / complex decision steps are required, it calls the sequential-thinking MCP server. For simpler operations, fallback to current method.  
5. Containerize the MCP server if not already. If using Docker compose, provide a compose file that includes both the main app and sequential thinking service.  
6. Ensure all endpoints/internal communications are secure / not publicly exposed (only via internal link).  
7. Provide the full modified code / config files (Docker / Docker Compose, agent integration) ready to drop in.  
8. Do **not** push to GitHub unless I say.  
9. At each change, show what was changed, why, and ensure the same behavior as before for the user.

First step: verify the existing agent logic entry points where “reasoning” happens (prompt builders, etc.), so you know where to insert calls to MCP server. Then propose exact file edits. Then implement.
