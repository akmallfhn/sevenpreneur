# tRPC Routes

These table below shows all routes/endpoints/procedures, categorized by object type, with its allowed roles.

## Hello, World! 🌏

| Procedure Name   | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :--------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `hello.getHello` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

## Authentication 🔐

| Procedure Name      | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------ | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `auth.login`        |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `auth.checkSession` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `auth.logout`       |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |

## Industries 🏭

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.industries` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.industry`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

## Entrepreneur Stages 📈

| Procedure Name            | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------------ | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.entrepreneurStages` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.entrepreneurStage`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

## Roles 👥

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.roles`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.role`    |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

## Users 👤

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.user`  |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.users`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.user`    |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.user`  |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.user`  |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

## Cohorts 🎓

| Procedure Name  | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :-------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.cohort` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.cohorts`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.cohort`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.cohort` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.cohort` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

### Cohort Prices 💵

| Procedure Name       | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.cohortPrice` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.cohortPrices`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.cohortPrice`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.cohortPrice` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.cohortPrice` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

## Modules 📕

| Procedure Name  | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :-------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.module` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.modules`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.module`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.module` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.module` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

## Learnings 📅

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.learning` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.learnings`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.learning`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.learning` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.learning` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

### Materials 📖

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.material` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.materials`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.material`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.material` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.material` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

## Projects 🗂️

| Procedure Name   | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :--------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.project` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.projects`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.project`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.project` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.project` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
