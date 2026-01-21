import { describe, expect, test } from "bun:test"
import path from "path"
import { loadClaudePlugin } from "../src/parsers/claude"

const fixtureRoot = path.join(import.meta.dir, "fixtures", "sample-plugin")
const mcpFixtureRoot = path.join(import.meta.dir, "fixtures", "mcp-file")
const customPathsRoot = path.join(import.meta.dir, "fixtures", "custom-paths")
const invalidCommandPathRoot = path.join(import.meta.dir, "fixtures", "invalid-command-path")
const invalidHooksPathRoot = path.join(import.meta.dir, "fixtures", "invalid-hooks-path")
const invalidMcpPathRoot = path.join(import.meta.dir, "fixtures", "invalid-mcp-path")

describe("loadClaudePlugin", () => {
  test("loads manifest, agents, commands, skills, hooks", async () => {
    const plugin = await loadClaudePlugin(fixtureRoot)

    expect(plugin.manifest.name).toBe("sample-plugin")
    expect(plugin.agents.length).toBe(2)
    expect(plugin.commands.length).toBe(6)
    expect(plugin.skills.length).toBe(1)
    expect(plugin.hooks).toBeDefined()
    expect(plugin.mcpServers).toBeDefined()

    const agentOne = plugin.agents.find((agent) => agent.name === "agent-one")
    expect(agentOne?.capabilities).toEqual(["Capability A", "Capability B"])

    const commandOne = plugin.commands.find((command) => command.name === "command-one")
    expect(commandOne?.allowedTools).toEqual(["Read", "Write", "Bash(ls:*)", "Bash(git:*)"])

    const commandTwo = plugin.commands.find((command) => command.name === "command-two")
    expect(commandTwo?.allowedTools).toEqual(["Read", "Edit"])

    const skillCommand = plugin.commands.find((command) => command.name === "skill-command")
    expect(skillCommand?.allowedTools).toEqual(["Skill(create-agent-skills)"])

    const modelCommand = plugin.commands.find((command) => command.name === "model-command")
    expect(modelCommand?.allowedTools).toEqual(["WebFetch"])

    const patternCommand = plugin.commands.find((command) => command.name === "pattern-command")
    expect(patternCommand?.allowedTools).toEqual(["Read(.env)", "Bash(git:*)"])

    const todoCommand = plugin.commands.find((command) => command.name === "todo-command")
    expect(todoCommand?.allowedTools).toEqual(["Question", "TodoWrite", "TodoRead"])

    expect(plugin.mcpServers?.["remote-test"]?.url).toBe("https://example.com/mcp")
  })

  test("loads MCP servers from .mcp.json when manifest is empty", async () => {
    const plugin = await loadClaudePlugin(mcpFixtureRoot)
    expect(plugin.mcpServers?.remote?.url).toBe("https://example.com/stream")
  })

  test("merges default and custom component paths", async () => {
    const plugin = await loadClaudePlugin(customPathsRoot)
    expect(plugin.agents.map((agent) => agent.name).sort()).toEqual(["custom-agent", "default-agent"])
    expect(plugin.commands.map((command) => command.name).sort()).toEqual(["custom-command", "default-command"])
    expect(plugin.skills.map((skill) => skill.name).sort()).toEqual(["custom-skill", "default-skill"])
    expect(plugin.hooks?.hooks.PreToolUse?.[0]?.hooks[0]?.command).toBe("echo default")
    expect(plugin.hooks?.hooks.PostToolUse?.[0]?.hooks[0]?.command).toBe("echo custom")
  })

  test("rejects custom component paths that escape the plugin root", async () => {
    await expect(loadClaudePlugin(invalidCommandPathRoot)).rejects.toThrow(
      "Invalid commands path: ../outside-commands. Paths must stay within the plugin root.",
    )
  })

  test("rejects hook paths that escape the plugin root", async () => {
    await expect(loadClaudePlugin(invalidHooksPathRoot)).rejects.toThrow(
      "Invalid hooks path: ../outside-hooks.json. Paths must stay within the plugin root.",
    )
  })

  test("rejects MCP paths that escape the plugin root", async () => {
    await expect(loadClaudePlugin(invalidMcpPathRoot)).rejects.toThrow(
      "Invalid mcpServers path: ../outside-mcp.json. Paths must stay within the plugin root.",
    )
  })
})
