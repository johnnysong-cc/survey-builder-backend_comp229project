# Group Work Contract

## Prelude

Due to inactivity of the previous group members and disorganization, I've decided to move to this new project repo and collaborate ONLY with whoever has a sense of responsibility and is actually willing to contribute duly, rather than those who never give a damn or lift a finger until each milestone day and asks "Anyone did something" or "What are we doing".

## Collaboration Rules

### NO.1 RULE: Leave the group if you are not willing to take initiative!
### NO.2 RULE: Leave the group if you are not willing to contribute duly!
### NO.3 RULE: Leave the group if you are not willing to work hard and deliever results before deadlines!

### Branch Management

#### The `main` Branch

- It holds the PROD code where the source code of HEAD always reflects a production-ready state
- It originates the `dev` branch and all others
- Any changes must be merged to the `dev` branch by Pull Requests instead of this branch
- Proper code review must be performed before any change is merged into this branch

#### The `dev` Branch

- It branches off from the `main` branch
- It holds the approved changes after code review
- Features/bugfixes must open a Pull Request to review the code before merging to this branch
- It is important to attach a TAG to the commit to easily identify the version
- When working on separate tasks, and if a production deployment is completed by a developer, then the latest code should be merged into others' `dev` branches

#### The Feature Branches

- It is created from the `dev` branch for the developers to work in a new feature
- It branches off from the `dev` branch, not the ~~`main`~~ branch
- It must be merged back into the `dev` branch by a Pull Request: never use `git push`
- It must be linked to a work item which clearly describes the features being developed
- It must be deleted once the feature branch is merged back to the `dev` branch
- Branch naming convention: `FE_<workItem>_BriefDescription`

#### The Bugfix Branches

- It is similar to the feature branches but is dedicated to bug fixing
- Branch naming convention: `BF_<workItem>_BriefDescription`

----

## Work Assignment

