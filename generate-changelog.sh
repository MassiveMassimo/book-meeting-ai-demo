#!/bin/sh
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

VERSION=$(echo "$CURRENT_BRANCH" | sed -n 's/^release\///p')

PROMPT_HEADER=$(cat << EOF
Please generate a changelog docs from commits message in markdown with the following format:

## Release${VERSION:+ $VERSION}
### {change_group}
- changelog 1 (#relevant_commit) [email contributor 1, 2]
- changelog 2 (#relevant_commit) [email contributor 1, 2]

change_group = can be "features" or "bugfixes"\n
EOF
)

echo "$PROMPT_HEADER" > changelog_prompt.txt

git log --no-merges --pretty=format:'%h - %s (%ae)' "$CURRENT_BRANCH"...main >> changelog_prompt.txt