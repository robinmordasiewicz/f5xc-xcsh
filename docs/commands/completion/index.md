---
title: "vesctl completion"
description: "Generate shell completion scripts for bash, zsh, or fish."
keywords:
  - F5 Distributed Cloud
  - F5 XC
  - completion
  - vesctl
command: "vesctl completion"
command_group: "completion"
---

# vesctl completion

> Generate shell completion scripts for bash, zsh, or fish.

## Synopsis

```bash
vesctl completion <command> [flags]
```

## Description

To load completions:

Bash:
  $ source <(vesctl completion bash)

  # To load completions for each session, execute once:
  Linux:
    $ vesctl completion bash > /etc/bash_completion.d/vesctl
  MacOS:
    $ vesctl completion bash > /usr/local/etc/bash_completion.d/vesctl

Zsh:
  $ source <(vesctl completion zsh)

  # To load completions for each session, execute once:
  $ vesctl completion zsh > "${fpath[1]}/_vesctl"

Fish:
  $ vesctl completion fish | source

  # To load completions for each session, execute once:
  $ vesctl completion fish > ~/.config/fish/completions/vesctl.fish


## Available Commands

| Command | Description |
|---------|-------------|

## See Also

- [Command Reference](../index.md)
