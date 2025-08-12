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

## Phone Country Codes ☎️

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.phoneCountryCodes` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

## Payment Channels 🏦

| Procedure Name         | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :--------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.paymentChannels` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

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
| `create.cohort` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.cohorts`  |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `read.cohort`   |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `update.cohort` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.cohort` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

### Cohort Members 👥

| Procedure Name       | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.cohortMembers` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

### Cohort Prices 💵

| Procedure Name       | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.cohortPrice` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.cohortPrices`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.cohortPrice`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.cohortPrice` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.cohortPrice` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

## Modules 📕

| Procedure Name  | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :-------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.module` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.modules`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.module`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.module` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.module` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

## Learnings 📅

| Procedure Name          | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.learning`       |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.learnings`        |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.learnings_public` |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `read.learning`         |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.learning`       |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.learning`       |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

### Materials 📖

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.material` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.materials`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.material`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.material` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.material` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

## Projects 🗂️

| Procedure Name   | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :--------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.project` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.projects`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.project`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.project` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.project` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

## Submissions 🗒️

| Procedure Name      | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------ | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.submission` |         ✅          |       ❌       |         ❌          |         ✅         |          ❌          |
| `list.submissions`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.submission`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.submission` |         ✅          |       ✅       |         ❌          |         ✅         |          ❌          |
| `delete.submission` |         ✅          |       ❌       |         ❌          |         ✅         |          ❌          |

## Playlists 📺

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.playlist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.playlists`  |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `read.playlist`   |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `update.playlist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.playlist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

### Educators Playlists 👥

| Procedure Name            | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------------ | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.educatorPlaylist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.educatorsPlaylist`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `delete.educatorPlaylist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

### Enrolled Playlists 📺

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.enrolledPlaylists` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.enrolledPlaylist`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

## Videos 🎞️

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.video` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `read.video`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.video` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.video` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

## Discounts 🪙

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.discount` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.discounts`  |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `read.discount`   |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `update.discount` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.discount` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

## Transactions 💰

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `purchase.checkDiscount` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `purchase.cohort`        |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `purchase.playlist`      |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `purchase.cancel`        |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.transactions`      |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.transaction`       |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
