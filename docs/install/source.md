# Build from Source

Build xcsh directly from source code.

## Prerequisites

Building from source requires:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| Git | any | `git --version` |

## Clone Repository

```bash
git clone https://github.com/robinmordasiewicz/f5xc-xcsh.git
cd f5xc-xcsh
```

## Install Dependencies

```bash
npm install
```

## Build

```bash
npm run build
```

This compiles TypeScript to JavaScript and outputs to the `dist/` directory.

## Verify Build

```bash
./dist/index.js version
```

Expected output:

```text
xcsh version v2.0.7
```

## Run Locally

After building, run the CLI directly:

```bash
./dist/index.js --help
```

Or enter interactive mode:

```bash
./dist/index.js
```

## Development Mode

For development with hot reload:

```bash
npm run dev
```

## Install (Optional)

To install globally on your system:

```bash
npm link
```

Then run from anywhere:

```bash
xcsh --help
```
