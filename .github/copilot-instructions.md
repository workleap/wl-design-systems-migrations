- When the request is creating a PR follow these steps:
  - Make sure to update the version in the `.codemodrc.json` file only if the logic has changed.
    - Just increment the minor version.
  - Make sure to update the `README.md` file with any new features or changes if there are alreay there.
    - No need to add new sections about new features or updates.
    - Just update the existing sections if it is required.
  - Add the end, generate a short summary of the changes in the chat so I can share it in Slack.
    - Use the following template. get VERSION_NUMBER from the `.codemodrc.json` file.
      ```
      :line_chart: `orbiter-to-hopper-codemods {VERSION_NUMBER}` released:
      - Item 1: <description of item 1>
      - Item 2: <description of item 2>
      ```
