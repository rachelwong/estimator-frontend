#!/bin/bash
# Stop hook for /ship. Exit 2 blocks Claude from finishing and sends stderr back to it.
# Checks every estimator repo with uncommitted code changes, not just the one the session started in.
# Same file in estimator-backend and estimator-frontend. Keep both copies in sync.

MAX_BLOCKS=3

input=$(cat)
session_id=$(jq -r '.session_id' <<<"$input")
projects_dir=$(dirname "$CLAUDE_PROJECT_DIR")
state_dir="${TMPDIR:-/tmp}/ship-$session_id"
mkdir -p "$state_dir"

# Stop blocking after a few tries so an unfixable failure can't loop forever.
blocks=$(cat "$state_dir/blocks" 2>/dev/null || echo 0)
if ((blocks >= MAX_BLOCKS)); then
  exit 0
fi

# Prints the shell checks for a repo.
checks_for() {
  case "$1" in
    estimator-backend) echo "npm run typecheck && npm run lint && npm test" ;;
    estimator-frontend) echo "npx tsc -b && npm run lint" ;;
  esac
}

failures=""
code_changed=false
code_repos=0
docs_changed=false
plan_changed=false

for repo in estimator-backend estimator-frontend; do
  dir="$projects_dir/$repo"
  [[ -d "$dir/.git" ]] || continue

  changed=$(git -C "$dir" status --porcelain --untracked-files=all | cut -c4-)
  grep -q '\.md$' <<<"$changed" && docs_changed=true
  grep -qx 'estimator-plan.md' <<<"$changed" && plan_changed=true

  code=$(grep -E '^(src|tests|scripts)/.*\.(ts|tsx|mjs|js)$' <<<"$changed")
  [[ -n "$code" ]] || continue
  code_changed=true
  code_repos=$((code_repos + 1))

  # Whole-repo format:check fails on old files, so only check the changed ones.
  existing=$(cd "$dir" && for f in $code; do [[ -f "$f" ]] && echo "$f"; done)
  format=""
  if [[ "$repo" == estimator-backend && -n "$existing" ]]; then
    format=" && npx prettier --check $(tr '\n' ' ' <<<"$existing")"
  fi

  output=$(cd "$dir" && eval "$(checks_for "$repo")$format" 2>&1)
  if (($? != 0)); then
    failures+="--- $repo failed ---"$'\n'"$(tail -40 <<<"$output")"$'\n'
  fi
done

if [[ -n "$failures" ]]; then
  echo $((blocks + 1)) >"$state_dir/blocks"
  echo "Checks failed. Fix them before finishing /ship:" >&2
  echo "$failures" >&2
  exit 2
fi

# estimator-plan.md is the shared source of truth. Once either copy changes, both must match.
backend_plan="$projects_dir/estimator-backend/estimator-plan.md"
frontend_plan="$projects_dir/estimator-frontend/estimator-plan.md"
if $plan_changed && ! cmp -s "$backend_plan" "$frontend_plan"; then
  echo $((blocks + 1)) >"$state_dir/blocks"
  echo "estimator-plan.md differs between estimator-backend and estimator-frontend. Make both copies identical." >&2
  exit 2
fi

# A change in both repos is cross-stack behaviour, so the plan needs updating. Remind once.
if ((code_repos == 2)) && ! $plan_changed && [[ ! -f "$state_dir/plan-reminded" ]]; then
  touch "$state_dir/plan-reminded"
  echo "Code changed in both repos but estimator-plan.md didn't. Update it in both repos, or say why it doesn't apply." >&2
  exit 2
fi

# Remind about docs once per session. A hook can't judge if the docs are right, only if they were touched.
if $code_changed && ! $docs_changed && [[ ! -f "$state_dir/docs-reminded" ]]; then
  touch "$state_dir/docs-reminded"
  echo "Code changed but no docs did. Update the docs in place (step 5 of /ship), or say why none apply." >&2
  exit 2
fi

exit 0
