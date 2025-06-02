# Creating new PR rules (only if requested by the user):

- No need to rebase or checking the status.
- If branch is already there, just create a new PR based on it.
- Make sure to update the version in the `.codemodrc.json` file only if the logic has changed.
  - Just increment the minor version.
- Make sure to update the `README.md` file with any new features or changes if there are related section in the file.
  - No need to add new sections about new features or updates.
  - Just update the existing sections if it is required.
- At the end:
  - Open the PR on Web using `gh pr view --web`, or just share the PR's url.
  - Generate a short summary of the changes so I can share it in Slack.
    - Use the following template. get VERSION_NUMBER from the `.codemodrc.json` file.
      ```
      :robot_face: `orbiter-to-hopper-codemods {VERSION_NUMBER}` released:
      - Item 1: <description of item 1>
      - Item 2: <description of item 2>
      ```
