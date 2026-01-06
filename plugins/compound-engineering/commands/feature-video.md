---
name: feature-video
description: Record a video walkthrough or capture screenshots and add them to the PR description
argument-hint: "[PR number or 'current'] [optional: base URL, default localhost:3000]"
---

# Feature Video & Screenshots

<command_purpose>Record a video walkthrough or capture screenshots demonstrating a feature, upload them, and add to the PR description.</command_purpose>

## Introduction

<role>Developer Relations Engineer creating feature demos</role>

This command creates professional visual documentation for PRs:
- Records browser interactions using Playwright video capture
- Captures step-by-step screenshots for detailed walkthroughs
- Demonstrates the complete user flow
- Uploads media for easy sharing
- Updates the PR description with embedded video and/or collapsible screenshots

## Prerequisites

<requirements>
- Local development server running (e.g., `bin/dev`, `rails server`)
- Playwright MCP server connected
- Git repository with a PR to document
- `ffmpeg` installed (for video conversion)
- `rclone` configured (optional, for cloud upload - see rclone skill)
</requirements>

## Main Tasks

### 1. Parse Arguments

<parse_args>

**Arguments:** $ARGUMENTS

Parse the input:
- First argument: PR number or "current" (defaults to current branch's PR)
- Second argument: Base URL (defaults to `http://localhost:3000`)

```bash
# Get PR number for current branch if needed
gh pr view --json number -q '.number'
```

</parse_args>

### 2. Gather Feature Context

<gather_context>

**Get PR details:**
```bash
gh pr view [number] --json title,body,files,headRefName -q '.'
```

**Get changed files:**
```bash
gh pr view [number] --json files -q '.files[].path'
```

**Map files to testable routes** (same as playwright-test):

| File Pattern | Route(s) |
|-------------|----------|
| `app/views/users/*` | `/users`, `/users/:id`, `/users/new` |
| `app/controllers/settings_controller.rb` | `/settings` |
| `app/javascript/controllers/*_controller.js` | Pages using that Stimulus controller |
| `app/components/*_component.rb` | Pages rendering that component |

</gather_context>

### 3. Plan the Video Flow

<plan_flow>

Before recording, create a shot list:

1. **Opening shot**: Homepage or starting point (2-3 seconds)
2. **Navigation**: How user gets to the feature
3. **Feature demonstration**: Core functionality (main focus)
4. **Edge cases**: Error states, validation, etc. (if applicable)
5. **Success state**: Completed action/result

Ask user to confirm or adjust the flow:

```markdown
**Proposed Video Flow**

Based on PR #[number]: [title]

1. Start at: /[starting-route]
2. Navigate to: /[feature-route]
3. Demonstrate:
   - [Action 1]
   - [Action 2]
   - [Action 3]
4. Show result: [success state]

Estimated duration: ~[X] seconds

Does this look right?
1. Yes, start recording
2. Modify the flow (describe changes)
3. Add specific interactions to demonstrate
```

</plan_flow>

### 4. Setup Video Recording

<setup_recording>

**Create videos directory:**
```bash
mkdir -p tmp/videos
```

**Start browser with video recording using Playwright MCP:**

Note: Playwright MCP's browser_navigate will be used, and we'll use browser_run_code to enable video recording:

```javascript
// Enable video recording context
mcp__plugin_compound-engineering_pw__browser_run_code({
  code: `async (page) => {
    // Video recording is enabled at context level
    // The MCP server handles this automatically
    return 'Video recording active';
  }`
})
```

**Alternative: Use browser screenshots as frames**

If video recording isn't available via MCP, fall back to:
1. Take screenshots at key moments
2. Combine into a GIF using ffmpeg

```bash
ffmpeg -framerate 2 -pattern_type glob -i 'tmp/screenshots/*.png' -vf "scale=1280:-1" tmp/videos/feature-demo.gif
```

</setup_recording>

### 5. Record the Walkthrough

<record_walkthrough>

Execute the planned flow, capturing each step:

**Step 1: Navigate to starting point**
```
mcp__plugin_compound-engineering_pw__browser_navigate({ url: "[base-url]/[start-route]" })
mcp__plugin_compound-engineering_pw__browser_wait_for({ time: 2 })
mcp__plugin_compound-engineering_pw__browser_take_screenshot({ filename: "tmp/screenshots/01-start.png" })
```

**Step 2: Perform navigation/interactions**
```
mcp__plugin_compound-engineering_pw__browser_click({ element: "[description]", ref: "[ref]" })
mcp__plugin_compound-engineering_pw__browser_wait_for({ time: 1 })
mcp__plugin_compound-engineering_pw__browser_take_screenshot({ filename: "tmp/screenshots/02-navigate.png" })
```

**Step 3: Demonstrate feature**
```
mcp__plugin_compound-engineering_pw__browser_snapshot({})
// Identify interactive elements
mcp__plugin_compound-engineering_pw__browser_click({ element: "[feature element]", ref: "[ref]" })
mcp__plugin_compound-engineering_pw__browser_wait_for({ time: 1 })
mcp__plugin_compound-engineering_pw__browser_take_screenshot({ filename: "tmp/screenshots/03-feature.png" })
```

**Step 4: Capture result**
```
mcp__plugin_compound-engineering_pw__browser_wait_for({ time: 2 })
mcp__plugin_compound-engineering_pw__browser_take_screenshot({ filename: "tmp/screenshots/04-result.png" })
```

**Create video/GIF from screenshots:**

```bash
# Create directories
mkdir -p tmp/videos tmp/screenshots

# Create MP4 video (RECOMMENDED - better quality, smaller size)
# -framerate 0.5 = 2 seconds per frame (slower playback)
# -framerate 1 = 1 second per frame
ffmpeg -y -framerate 0.5 -pattern_type glob -i '.playwright-mcp/tmp/screenshots/*.png' \
  -c:v libx264 -pix_fmt yuv420p -vf "scale=1280:-2" \
  tmp/videos/feature-demo.mp4

# Create low-quality GIF for preview (small file, for GitHub embed)
ffmpeg -y -framerate 0.5 -pattern_type glob -i '.playwright-mcp/tmp/screenshots/*.png' \
  -vf "scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse" \
  -loop 0 tmp/videos/feature-demo-preview.gif

# Copy screenshots to project folder for easy access
cp -r .playwright-mcp/tmp/screenshots tmp/
```

**Note:**
- The `-2` in MP4 scale ensures height is divisible by 2 (required for H.264)
- Preview GIF uses 640px width and 128 colors to keep file size small (~100-200KB)

</record_walkthrough>

### 6. Upload the Video

<upload_video>

**Upload with rclone:**

```bash
# Check rclone is configured
rclone listremotes

# Upload video, preview GIF, and screenshots to cloud storage
# Use --s3-no-check-bucket to avoid permission errors
rclone copy tmp/videos/ r2:kieran-claude/pr-videos/pr-[number]/ --s3-no-check-bucket --progress
rclone copy tmp/screenshots/ r2:kieran-claude/pr-videos/pr-[number]/screenshots/ --s3-no-check-bucket --progress

# List uploaded files
rclone ls r2:kieran-claude/pr-videos/pr-[number]/
```

Public URLs (R2 with public access):
```
Video: https://pub-4047722ebb1b4b09853f24d3b61467f1.r2.dev/pr-videos/pr-[number]/feature-demo.mp4
Preview: https://pub-4047722ebb1b4b09853f24d3b61467f1.r2.dev/pr-videos/pr-[number]/feature-demo-preview.gif
```

</upload_video>

### 7. Update PR Description

<update_pr>

**Get current PR body:**
```bash
gh pr view [number] --json body -q '.body'
```

**Add demo section to PR description:**

If the PR already has a demo section, replace it. Otherwise, append after Summary.

**IMPORTANT:** GitHub cannot embed external MP4s directly. Use a clickable GIF that links to the video.

**Full template with video + collapsible screenshots:**

```markdown
## Demo

[![Feature Demo]([preview-gif-url])]([video-mp4-url])

*Click GIF to view full video*

<details>
<summary>Screenshots</summary>

| Step | Screenshot |
|------|------------|
| Starting point | ![Start]([screenshot-01-url]) |
| Navigation | ![Navigate]([screenshot-02-url]) |
| Feature action | ![Feature]([screenshot-03-url]) |
| Result | ![Result]([screenshot-04-url]) |

</details>
```

**Example (from a real PR):**

```markdown
## Demo

[![API Keys Demo](https://pub-4047722ebb1b4b09853f24d3b61467f1.r2.dev/pr-videos/pr-137-api-keys/api-keys-demo-small.gif)](https://pub-4047722ebb1b4b09853f24d3b61467f1.r2.dev/pr-videos/pr-137-api-keys/api-keys-demo.mp4)

*Click GIF to view full video*

<details>
<summary>Screenshots</summary>

| Step | Screenshot |
|------|------------|
| Home | ![Home](https://pub-4047722ebb1b4b09853f24d3b61467f1.r2.dev/pr-videos/pr-137-api-keys/screenshots/01-home.png) |
| Account Menu | ![Menu](https://pub-4047722ebb1b4b09853f24d3b61467f1.r2.dev/pr-videos/pr-137-api-keys/screenshots/02-account-menu.png) |
| API Keys Page | ![API Keys](https://pub-4047722ebb1b4b09853f24d3b61467f1.r2.dev/pr-videos/pr-137-api-keys/screenshots/03-api-keys-empty.png) |
| Create Key Dialog | ![Create](https://pub-4047722ebb1b4b09853f24d3b61467f1.r2.dev/pr-videos/pr-137-api-keys/screenshots/04-create-key-dialog.png) |
| Key Name Entered | ![Name](https://pub-4047722ebb1b4b09853f24d3b61467f1.r2.dev/pr-videos/pr-137-api-keys/screenshots/05-key-name-entered.png) |

</details>
```

**Screenshots-only template (no video):**

```markdown
## Screenshots

<details>
<summary>View screenshots</summary>

| Step | Screenshot |
|------|------------|
| Step 1 description | ![Step 1]([screenshot-url]) |
| Step 2 description | ![Step 2]([screenshot-url]) |
| Step 3 description | ![Step 3]([screenshot-url]) |

</details>
```

**Update the PR:**
```bash
gh pr edit [number] --body "[updated body with video section]"
```

**Or add as a comment if preferred:**
```bash
gh pr comment [number] --body "## Feature Demo

![Demo]([video-url])

_Automated walkthrough of the changes in this PR_"
```

</update_pr>

### 8. Cleanup

<cleanup>

```bash
# Optional: Clean up screenshots
rm -rf tmp/screenshots

# Keep videos for reference
echo "Video retained at: tmp/videos/feature-demo.gif"
```

</cleanup>

### 9. Summary

<summary>

Present completion summary:

```markdown
## Feature Demo Complete

**PR:** #[number] - [title]
**Video:** [url or local path]
**Screenshots:** [X] images uploaded
**Duration:** ~[X] seconds

### Media Captured
1. [Starting point] - [description]
2. [Navigation] - [description]
3. [Feature demo] - [description]
4. [Result] - [description]

### PR Updated
- [x] Demo section added with clickable GIF
- [x] Collapsible screenshots table added
- [ ] Ready for review

**Next steps:**
- Review the demo to ensure it accurately shows the feature
- Share with reviewers for context
```

</summary>

## Quick Usage Examples

```bash
# Record video for current branch's PR
/feature-video

# Record video for specific PR
/feature-video 847

# Record with custom base URL
/feature-video 847 http://localhost:5000

# Record for staging environment
/feature-video current https://staging.example.com
```

## Tips

- **Keep it short**: 10-30 seconds is ideal for PR video demos
- **Focus on the change**: Don't include unrelated UI
- **Show before/after**: If fixing a bug, show the broken state first (if possible)
- **Use descriptive step names**: In the screenshots table, use names like "Home", "Account Menu", "Create Dialog" - not "Step 1", "Step 2"
- **Collapsible is key**: Screenshots in `<details>` keeps PR clean but accessible
- **GIF links to video**: The clickable GIF pattern works great - reviewers see the preview, click for full quality
