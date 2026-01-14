# Smart Completion Guide

## Overview

Smart completion provides intuitive user guidance by showing positional argument placeholders (like `<profile-name>`) along with available flags in tab completion results. This helps users understand what input is expected at each stage of command construction.

## The Problem

Previously, when typing `/login create profile<TAB>`, users would see only flags:

```bash
--url
--token
--namespace
```

This was confusing because the command requires a profile name BEFORE the flags. Users had no indication that they needed to provide `<name>` first.

## The Solution

With smart completion, typing `/login create profile<TAB>` now shows:

```bash
<name>
--url
--token
--namespace
```

This clearly indicates: "You need to provide a profile name, and here are the flags you'll need."

After providing a name (`/login create profile myprofile<TAB>`), only flags are shown:

```bash
--url
--token
--namespace
```

## Implementation

### 1. Import the Utility

```typescript
import { generateSmartCompletions } from "../../../utils/usage-parser.js";
```

### 2. Use in Completion Handler

Replace simple flag arrays with smart completion:

**Before:**

```typescript
completion: async (_currentWord: string, _args: string[]) => {
    return ["--url", "--token", "--namespace"];
},
```

**After:**

```typescript
completion: async (_currentWord: string, args: string[]) => {
    return generateSmartCompletions(
        createCommand.usage,  // Reference to command's usage string
        args,                 // Arguments provided so far
        ["--url", "--token", "--namespace"]  // Flags to suggest
    );
},
```

### 3. How It Works

The `generateSmartCompletions` function:

1. Parses the usage string to understand required positional arguments
2. Checks how many positional args have been provided
3. Returns placeholders for missing required positional args
4. Returns only flags once all required positional args are satisfied

## Examples

### Command with Required Positional Arg

**Usage:** `<name> --url <api-url> --token <api-token> [--namespace <ns>]`

**Behavior:**

- `/login create profile<TAB>` → `<name>`, `--url`, `--token`, `--namespace`
- `/login create profile myprofile<TAB>` → `--url`, `--token`, `--namespace`

### Command with Only Positional Arg

**Usage:** `<name>`

**Implementation:**

```typescript
completion: async (_currentWord: string, args: string[]) => {
    return generateSmartCompletions(
        deleteCommand.usage,
        args,
        []  // No flags for this command
    );
},
```

**Behavior:**

- `/login delete profile<TAB>` → `<name>`
- `/login delete profile myprofile<TAB>` → (no suggestions, command complete)

### Command with Multiple Positional Args

**Usage:** `<namespace> <resource-type> <resource-name>`

**Behavior:**

- `command<TAB>` → `<namespace>`, (flags if any)
- `command ns<TAB>` → `<resource-type>`, (flags if any)
- `command ns deployment<TAB>` → `<resource-name>`, (flags if any)
- `command ns deployment myapp<TAB>` → (flags only)

## Commands That Should Use Smart Completion

Apply this pattern to any command with required positional arguments:

### Login Domain

- ✅ `login create profile` - Implemented
- ⚠️ `login show profile <name>` - Should add
- ⚠️ `login use profile <name>` - Should add
- ⚠️ `login edit profile <name>` - Should add
- ⚠️ `login delete profile <name>` - Should add
- ⚠️ `login use context <namespace>` - Should add

### Other Domains

- ⚠️ Any command with `usage: "<arg>"` or `usage: "<arg> --flags"`

## Testing Smart Completion

### Unit Test Example

```typescript
it("should suggest placeholder when positional arg missing", async () => {
    const result = await completer.complete("login create profile");
    const suggestions = result.map(s => s.text);

    // Verify placeholder is first
    expect(suggestions[0]).toBe("<name>");

    // Verify flags are also present
    expect(suggestions).toContain("--url");
    expect(suggestions).toContain("--token");
});

it("should suggest only flags after positional arg provided", async () => {
    const result = await completer.complete("login create profile myprofile");
    const suggestions = result.map(s => s.text);

    // Verify placeholder is NOT present
    expect(suggestions).not.toContain("<name>");

    // Verify flags are present
    expect(suggestions).toContain("--url");
    expect(suggestions).toContain("--token");
});
```

### Integration Test Example

```typescript
describe("Smart Completion User Flow", () => {
    it("should guide user through command construction", async () => {
        // Step 1: Command name only
        const step1 = await completer.complete("login create profile");
        expect(step1.map(s => s.text)).toContain("<name>");

        // Step 2: After providing profile name
        const step2 = await completer.complete("login create profile myprofile ");
        expect(step2.map(s => s.text)).not.toContain("<name>");
        expect(step2.map(s => s.text)).toContain("--url");
    });
});
```

## Benefits

### User Experience

- **Clear Guidance:** Users immediately see what input is expected
- **Reduced Errors:** Less likely to provide flags before required positional args
- **Faster Learning:** Self-documenting command structure
- **Professional Feel:** Matches behavior of modern CLI tools

### Developer Experience

- **Consistent Pattern:** One utility function for all commands
- **Automatic Parsing:** Leverages existing usage strings
- **Easy to Apply:** Simple import and function call
- **Well Tested:** Comprehensive test coverage

## Migration Plan

To apply smart completion across all commands:

1. **Identify Commands:** Find all commands with `usage:` containing `<arg>`
2. **Add Completion Handlers:** Commands without completion handlers need them
3. **Update Existing Handlers:** Replace simple arrays with `generateSmartCompletions`
4. **Test Thoroughly:** Ensure each command behaves correctly
5. **Update Documentation:** Document user-facing completion behavior

## API Reference

### generateSmartCompletions

```typescript
function generateSmartCompletions(
    usage: string | undefined,
    args: string[],
    flags: string[]
): string[]
```

**Parameters:**

- `usage` - The command's usage string (e.g., `"<name> --url <api-url>"`)
- `args` - Current arguments provided by the user (from completion context)
- `flags` - Array of flag suggestions to return (e.g., `["--url", "--token"]`)

**Returns:**

- Array of completion suggestions, with positional placeholders first (if needed), then flags

**Behavior:**

- If required positional args are missing: returns `[...placeholders, ...flags]`
- If all required positional args satisfied: returns `[...flags]`
- Filters flags to only show when appropriate based on command structure

## Edge Cases

### Optional Positional Args

**Usage:** `[name] --url <url>`

Smart completion treats optional positional args differently:

- Shows placeholder if no args provided
- Shows flags immediately since positional arg is optional

### Mixed Args

**Usage:** `<required> [optional] --flags`

- First shows `<required>` placeholder and flags
- After required arg provided, shows `[optional]` and flags
- After optional arg provided (or skipped with flag), shows only flags

### Commands with No Positional Args

**Usage:** `--url <url> --token <token>`

Smart completion works normally, returning only flags.

## Troubleshooting

### Placeholder Not Showing

**Check:**

1. Is `usage` string properly formatted with `<arg>` syntax?
2. Is `args` parameter being passed to `generateSmartCompletions`?
3. Are args being filtered correctly (no flags counted as positional)?

### Too Many Placeholders

**Check:**

1. Verify usage string has correct `<required>` vs `[optional]` syntax
2. Ensure positional arg count logic is correct

### Flags Not Showing

**Check:**

1. Verify flags array is not empty
2. Ensure flags array is passed as third parameter
3. Check that usage parsing is working correctly

## Related Files

- **Utility:** `src/utils/usage-parser.ts` - `generateSmartCompletions()` function
- **Example:** `src/domains/login/profile/create.ts` - Reference implementation
- **Tests:** `tests/acceptance/login-completion-matrix.test.ts` - Comprehensive test coverage
- **Completer:** `src/repl/completion/completer.ts` - Completion orchestration logic
