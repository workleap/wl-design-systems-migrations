# Creating new PR rules (only if requested by the user):

- This repo has branch protection.
  - If it is on the main branch, first create a new branch.
  - Commit the changes to the branch.
- No need to rebase or checking the status.
- Create a new PR based on the branch.
- Make sure to update the version in the `.codemodrc.json` file only if the logic has changed.
  - Just increment the minor version.
- Make sure to update the `README.md` or `CONTRIBUTING.md` files with any new features or changes if there are related section in the file.
  - Just update the existing sections if it is required.
  - It is an important step before final step.
  - Note that some changes come from `package.json` changes.
- At the end:
  - Open the PR on Web using `gh pr view --web`, or just share the PR's url.
  - Generate a short summary of the changes so I can share it in Slack.
    - Use the following template and make sure it matches Slack formatting:
      ```
      :robot_face: New updates:
      - Item 1: <description of item 1> (try to include an example if possible)
      - Item 2: <description of item 2> (try to include an example if possible)
      ```

## PR Review Guidelines:

### Tests:

- Test descriptions are clear and follow other tests' style.
- The tests are comprehensive and cover all edge cases.
- The documentation is updated if there are any changes in functionality.
- The `input.tsx` and related `output.txt` are tests for mappings rules, not the main logic.

### Code structure:

- The core logic is in the `src/migrations` folder.
- Mapping rules are in the `src/mappings` folder.

### Code quality:

- If the changes are related to logic, make sure they are comprehensive and they cover different coding styles.
