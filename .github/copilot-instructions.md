# Creating new PR rules (only if requested by the user)

- This repo has branch protection.
  - If it is on the main branch, first create a new branch.
  - Commit the changes to the branch.
- No need to rebase or checking the status.
- Create a new PR based on the branch.
- Make sure to update the `README.md` or `CONTRIBUTING.md` files with any new features or changes if there are related section in the file.
  - Just update the existing sections if it is required.
  - It is an important step before final step.
  - Note that some changes come from `package.json` changes.
- At the end:
  - Run `pnpm lint:eslint` and `pnpm lint:typecheck` to ensure the code is formatted correctly.
  - Open the PR on Web using `gh pr view --web`, or just share the PR's url.
  - Generate a short summary of the changes so I can share it in Slack.
