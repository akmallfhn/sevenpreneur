# tRPC Routes

These table below shows all routes/endpoints/procedures, categorized by object type, with its allowed roles.

## Hello, World! 🌏

| Procedure Name   | Logged-In User | Public/Not Logged-In |
| :--------------- | :------------: | :------------------: |
| `hello.getHello` |       ✅       |          ❌          |

## Authentication 🔐

| Procedure Name      | Logged-In User | Public/Not Logged-In |
| :------------------ | :------------: | :------------------: |
| `auth.login`        |       ✅       |          ✅          |
| `auth.checkSession` |       ✅       |          ❌          |
| `auth.createJWT`    |       ✅       |          ❌          |
| `auth.logout`       |       ✅       |          ✅          |

**Scopes:**

- `auth.checkSession`: All logged-in users only have read access to their own user data.
- `auth.createJWT`: All logged-in users can only create JWT from their own user ID.

## Roles 👥

| Procedure Name | Logged-In User | Public/Not Logged-In |
| :------------- | :------------: | :------------------: |
| `list.roles`   |       ✅       |          ❌          |
| `read.role`    |       ✅       |          ❌          |

**Scopes:** All logged-in users have read access to all roles.

## Industries 🏭

| Procedure Name    | Logged-In User | Public/Not Logged-In |
| :---------------- | :------------: | :------------------: |
| `list.industries` |       ✅       |          ❌          |
| `read.industry`   |       ✅       |          ❌          |

**Scopes:** All logged-in users have read access to all industries.

## Phone Country Codes ☎️

| Procedure Name           | Logged-In User | Public/Not Logged-In |
| :----------------------- | :------------: | :------------------: |
| `list.phoneCountryCodes` |       ✅       |          ❌          |

**Scopes:** All logged-in users have read access to all phone country codes.

## Payment Channels 🏦

| Procedure Name         | Logged-In User | Public/Not Logged-In |
| :--------------------- | :------------: | :------------------: |
| `list.paymentChannels` |       ✅       |          ❌          |

**Scopes:** All logged-in users have read access to all payment channels.

## Users 👤

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.user`  |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `list.users`   |         ✅          |       ✅       |         ✅          |       ❌       |         ❌         |          ❌          |
| `read.user`    |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.user`  |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `delete.user`  |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators have write access to all users' data.
- Administrators, Educators, and Class Managers have read access to all users' data.
- Marketers and General Users can only read their own user data.

### User Businesses 👤

| Procedure Name         | Logged-In User | Public/Not Logged-In |
| :--------------------- | :------------: | :------------------: |
| `update.user_business` |       ✅       |          ❌          |

**Scopes:**

- Logged-in users can only update their own business data.

## Cohorts 🎓

| Procedure Name  | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :-------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.cohort` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `list.cohorts`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `read.cohort`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `update.cohort` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `delete.cohort` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all cohorts' data.
- `list.cohorts`:
  - Administrators can see all cohorts.
  - Non-Administrators can only see active cohorts.
- `read.cohort`:
  - Logged-in users can read all cohorts given the cohort ID.
  - Non-logged-in users can only read active cohorts.

### Cohort Prices 💵

| Procedure Name       | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :------------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.cohortPrice` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `list.cohortPrices`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.cohortPrice`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.cohortPrice` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `delete.cohortPrice` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all cohort prices' data.
- Logged-in users can see all cohort prices given the cohort ID.

### Cohort Members 👥

| Procedure Name        | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :-------------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `list.cohortMembers`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.cohortMember`   |         ✅          |       ✅       |         ✅          |       ❌       |         ❌         |          ❌          |
| `update.cohortMember` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `delete.cohortMember` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Managers can update all cohort members given the cohort ID and the user ID.
- Administrators, Educators, and Class Managers can see all cohort members given the cohort ID.
- Marketers and General Users can see cohort members list given the cohort ID which the users are enrolled.
- `delete.cohortMember`: Only removes selected member from the member list. No other data is deleted.

### Enrolled Cohorts 🎓

| Procedure Name         | Logged-In User | Public/Not Logged-In |
| :--------------------- | :------------: | :------------------: |
| `list.enrolledCohorts` |       ✅       |          ❌          |
| `read.enrolledCohort`  |       ✅       |          ❌          |

**Scopes:** Logged-in users can see all their own paid/enrolled cohorts.

## Modules 📕

| Procedure Name  | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :-------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.module` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `list.modules`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.module`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.module` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `delete.module` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all modules' data.
- Administrators, Educators, and Class Managers can see all modules given the cohort ID.
- Marketers and General Users can see all modules given the cohort ID which the users are enrolled.

## Learnings 📅

| Procedure Name          | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :---------------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.learning`       |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `list.learnings`        |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `list.learnings_public` |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `read.learning`         |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.learning`       |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `delete.learning`       |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all learnings' data.
- Logged-in users can see all learnings given the cohort ID.
- `list.learnings_public`: Non-logged-in users can only see active learnings given the cohort ID.

### Materials 📖

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.material` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `list.materials`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.material`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.material` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `delete.material` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all materials' data.
- Administrators, Educators, and Class Managers can see all materials given the learning ID.
- Marketer and General Users can see all materials given the learning ID which the users are enrolled.

### Discussion Starters 💬

| Procedure Name             | Logged-In User | Public/Not Logged-In |
| :------------------------- | :------------: | :------------------: |
| `create.discussionStarter` |       ✅       |          ❌          |
| `list.discussionStarters`  |       ✅       |          ❌          |
| `update.discussionStarter` |       ✅       |          ❌          |
| `delete.discussionStarter` |       ✅       |          ❌          |

**Scopes:**

- Administrators can see all discussion starters.
- Logged-in users can post a discussion starter.
- Administrators, Educators, Class Managers, and Marketers can see all discussions.
- General Users can see all discussions given the learning ID which the users are enrolled.
- Logged-in users can only update and delete their own discussion starters.
- Administrators can delete all discussion starters.

### Discussion Replies 🗪

| Procedure Name           | Logged-In User | Public/Not Logged-In |
| :----------------------- | :------------: | :------------------: |
| `create.discussionReply` |       ✅       |          ❌          |
| `list.discussionReplies` |       ✅       |          ❌          |
| `update.discussionReply` |       ✅       |          ❌          |
| `delete.discussionReply` |       ✅       |          ❌          |

**Scopes:**

- Administrators can see all discussion replies.
- Logged-in users can post a discussion reply.
- Administrators, Educators, Class Managers, and Marketers can see all discussions.
- General Users can see all discussions given the learning ID which the users are enrolled.
- Logged-in users can only update and delete their own discussion replies.
- Administrators can delete all discussion replies.

### Attendances 📋

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.checkIn`         |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `create.checkOut`        |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `list.attendance_counts` |         ✅          |       ✅       |         ✅          |       ❌       |         ❌         |          ❌          |
| `read.attendance`        |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |

**Scopes:**

- Logged-in users can check-in and check-out given the learning ID.
- Logged-in users can see their own attendances given the learning ID.

## Projects 🗂️

| Procedure Name   | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :--------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.project` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `list.projects`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.project`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.project` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `delete.project` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all projects' data.
- Administrators, Educators, and Class Managers can see all projects given the cohort ID.
- Marketers and General Users can see all projects given the cohort ID which the users are enrolled.

## Submissions 🗒️

| Procedure Name             | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :------------------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.submission`        |         ✅          |       ❌       |         ❌          |       ❌       |         ✅         |          ❌          |
| `list.submissions`         |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.submission`          |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.submissionByProject` |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.submission`        |         ✅          |       ✅       |         ❌          |       ❌       |         ✅         |          ❌          |
| `delete.submission`        |         ✅          |       ❌       |         ❌          |       ❌       |         ✅         |          ❌          |

**Scopes:**

- Administrators have write access to all submissions' data.
- Administrators, Educators, and Class Managers have read access to all submissions' data.
- Marketers have read access to their own submission data.
- General Users have read/write access to their own submission data.

## Business Assessment Category 🔍

| Procedure Name       | Administrator (`0`) | Non-Administrator | Public/Not Logged-In |
| :------------------- | :-----------------: | :---------------: | :------------------: |
| `create.ba.category` |         ✅          |        ❌         |          ❌          |
| `list.ba.categories` |         ✅          |        ✅         |          ❌          |
| `read.ba.category`   |         ✅          |        ✅         |          ❌          |
| `update.ba.category` |         ✅          |        ❌         |          ❌          |
| `delete.ba.category` |         ✅          |        ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all business assessment categories.
- All logged-in users can see all business assessment categories.

## Business Assessment Subcategory 📋

| Procedure Name          | Administrator (`0`) | Non-Administrator | Public/Not Logged-In |
| :---------------------- | :-----------------: | :---------------: | :------------------: |
| `create.ba.subcategory` |         ✅          |        ❌         |          ❌          |
| `list.ba.subcategories` |         ✅          |        ✅         |          ❌          |
| `read.ba.subcategory`   |         ✅          |        ✅         |          ❌          |
| `update.ba.subcategory` |         ✅          |        ❌         |          ❌          |
| `delete.ba.subcategory` |         ✅          |        ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all business assessment subcategories.
- All logged-in users can see all business assessment subcategories.

## Business Assessment Question 🎯

| Procedure Name       | Administrator (`0`) | Non-Administrator | Public/Not Logged-In |
| :------------------- | :-----------------: | :---------------: | :------------------: |
| `create.ba.question` |         ✅          |        ❌         |          ❌          |
| `list.ba.questions`  |         ✅          |        ✅         |          ❌          |
| `read.ba.question`   |         ✅          |        ✅         |          ❌          |
| `read.ba.sheet`      |         ✅          |        ✅         |          ❌          |
| `update.ba.question` |         ✅          |        ❌         |          ❌          |
| `delete.ba.question` |         ✅          |        ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all business assessment questions.
- `list.ba.questions`:
  - Administrators can see all business assessment questions.
  - Non-Administrators can only see active business assessment questions.
- `read.ba.question`:
  - Administrators can read all business assessment questions.
  - Non-Administrators can only read active business assessment questions given the question ID.
- `read.ba.sheet`: Only active business assessment questions are shown.

## Business Assessment Answer Sheet/Item 📝

| Procedure Name          | Logged-In User | Public/Not Logged-In |
| :---------------------- | :------------: | :------------------: |
| `create.ba.answerSheet` |       ✅       |          ❌          |
| `list.ba.answerSheets`  |       ✅       |          ❌          |
| `read.ba.answerSheet`   |       ✅       |          ❌          |
| `update.ba.answerSheet` |       ✅       |          ❌          |
| `delete.ba.answerSheet` |       ✅       |          ❌          |

**Scopes:**

- Only Administrators can see all business assessment answer sheets.
- Logged-in users have read/write access to their own business assessment answer sheet/item data.

## Business Financial Metric: Revenue MTD 📝

| Procedure Name          | Logged-In User | Public/Not Logged-In |
| :---------------------- | :------------: | :------------------: |
| `create.bd.revenue_mtd` |       ✅       |          ❌          |
| `list.bd.revenue_mtds`  |       ✅       |          ❌          |
| `read.bd.revenue_mtd`   |       ✅       |          ❌          |
| `update.bd.revenue_mtd` |       ✅       |          ❌          |
| `delete.bd.revenue_mtd` |       ✅       |          ❌          |

**Scopes:**

- Logged-in users have read/write access to their own financial metric: revenue MTD (month to date) data.

## Business Financial Metric: Cost MTD 📝

| Procedure Name       | Logged-In User | Public/Not Logged-In |
| :------------------- | :------------: | :------------------: |
| `create.bd.cost_mtd` |       ✅       |          ❌          |
| `list.bd.cost_mtds`  |       ✅       |          ❌          |
| `read.bd.cost_mtd`   |       ✅       |          ❌          |
| `update.bd.cost_mtd` |       ✅       |          ❌          |
| `delete.bd.cost_mtd` |       ✅       |          ❌          |

**Scopes:**

- Logged-in users have read/write access to their own financial metric: cost MTD (month to date) data.

## Playlists 📺

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.playlist` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `list.playlists`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `read.playlist`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `update.playlist` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `delete.playlist` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all playlists' data.
- `list.playlists`:
  - Administrators can see all playlists.
  - Non-Administrators can only see active playlists.
- `read.playlist`:
  - Administrators can read all playlists.
  - Non-Administrators can only read active playlists given the playlist ID.

### Educators Playlists 👥

| Procedure Name            | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :------------------------ | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.educatorPlaylist` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `list.educatorsPlaylist`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `delete.educatorPlaylist` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all educator playlists' data.
- Logged-in users can see all educator playlists given the playlist ID.

### Enrolled Playlists 📺

| Procedure Name           | Logged-In User | Public/Not Logged-In |
| :----------------------- | :------------: | :------------------: |
| `list.enrolledPlaylists` |       ✅       |          ❌          |
| `read.enrolledPlaylist`  |       ✅       |          ❌          |

**Scopes:** Logged-in users can see all their own paid/enrolled playlists.

## Videos 🎞️

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.video` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `read.video`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.video` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `delete.video` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all videos' data.
- Administrators, Educators, Class Managers, and Marketers can see all videos given the playlist ID.
- General Users can see all active videos given the playlist ID which the users are enrolled.

## Events 📅

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.event` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `list.events`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `read.event`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `update.event` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `delete.event` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all events' data.
- `list.events`:
  - Administrators can see all events.
  - Non-Administrators can only see active events.
- `read.event`:
  - Logged-in users can read all events given the event ID.
  - Non-logged-in users can only read active events.

### Event Prices 💵

| Procedure Name      | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :------------------ | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.eventPrice` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `list.eventPrices`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.eventPrice`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.eventPrice` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |
| `delete.eventPrice` |         ✅          |       ❌       |         ✅          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all event prices' data.
- Logged-in users can see all event prices given the event ID.

## Templates 📊

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.template` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `list.templates`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.template`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `update.template` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `delete.template` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all templates' data.
- Administrators, Educators, Class Managers, and Marketers can see all templates.
- General Users can see all active templates if the user is in the enrolled list.

## AI Tools and AI Conversations ✨

| Procedure Name               | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :--------------------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `check.aiTools`              |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `list.aiTools`               |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `list.aiResults`             |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.ai.ideaValidation`     |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.ai.marketSize`         |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.ai.competitorGrading`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.ai.COGSStructure`      |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.ai.pricingStrategy`    |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `read.ai.submissionAnalysis` |         ✅          |       ✅       |         ✅          |       ❌       |         ❌         |          ❌          |
| `use.ai.ideaValidation`      |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `use.ai.marketSize`          |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `use.ai.competitorGrading`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `use.ai.COGSStructure`       |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `use.ai.pricingStrategy`     |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `use.ai.submissionAnalysis`  |         ✅          |       ✅       |         ✅          |       ❌       |         ❌         |          ❌          |
| `list.aiConversations`       |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `list.aiChats`               |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `use.ai.sendChat`            |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `delete.aiResult`            |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |
| `delete.aiConversation`      |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ❌          |

**Scopes:**

- Administrators, Educators, Class Managers, and Marketers can use/read results/delete from AI tools.
- General Users can use/read results from AI tools if the user is in the enrolled list.
- General Users can always delete their results from AI tools.

## Discounts 🪙

| Procedure Name    | Administrator (`0`) | Non-Administrator/Not Logged-In |
| :---------------- | :-----------------: | :-----------------------------: |
| `create.discount` |         ✅          |               ❌                |
| `list.discounts`  |         ✅          |               ❌                |
| `read.discount`   |         ✅          |               ❌                |
| `update.discount` |         ✅          |               ❌                |
| `delete.discount` |         ✅          |               ❌                |

**Scopes:** Only Administrators have access to all discounts' data.

## Transactions 💰

| Procedure Name           | Logged-In User | Public/Not Logged-In |
| :----------------------- | :------------: | :------------------: |
| `purchase.checkDiscount` |       ✅       |          ❌          |
| `purchase.cohort`        |       ✅       |          ❌          |
| `purchase.playlist`      |       ✅       |          ❌          |
| `purchase.event`         |       ✅       |          ❌          |
| `purchase.cancel`        |       ✅       |          ❌          |
| `list.transactions`      |       ✅       |          ❌          |
| `read.transaction`       |       ✅       |          ❌          |

**Scopes:**

- Administrators can see and cancel all transactions.
- Administrators and Class Manager can purchase items for other users.
- Logged-in users can purchase items for their own.
- Logged-in users can see and cancel all their own transactions.

### Enrolled Courses 🛒

| Procedure Name         | Logged-In User | Public/Not Logged-In |
| :--------------------- | :------------: | :------------------: |
| `list.enrolledCourses` |       ✅       |          ❌          |

**Scopes:** Logged-in users can see all their own paid/enrolled courses (cohorts and playlists).

## Tickers 🚨

| Procedure Name  | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :-------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `read.ticker`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `update.ticker` |         ✅          |       ❌       |         ❌          |       ✅       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Marketers can update tickers.
- Others can only read tickers.

## Article Categories 📺

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.articleCategory` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `list.articleCategories` |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `update.articleCategory` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |
| `delete.articleCategory` |         ✅          |       ❌       |         ❌          |       ❌       |         ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all article categories' data.
- Only Administrators can see all article categories.
- Non-Administrators can see all active article categories.

## Articles 📺

| Procedure Name   | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :--------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `create.article` |         ✅          |       ❌       |         ❌          |       ✅       |         ❌         |          ❌          |
| `list.articles`  |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `read.article`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `update.article` |         ✅          |       ❌       |         ❌          |       ✅       |         ❌         |          ❌          |
| `delete.article` |         ✅          |       ❌       |         ❌          |       ✅       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Marketers have write access to all articles' data.
- `list.articles`:
  - Administrators and Marketers can see all articles.
  - Others can only see active articles.
- `read.article`:
  - Administrators and Marketers can read all articles.
  - Others can only read active articles given the article ID.

## Interstitial Ads 📢

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | Marketer (`4`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :------------: | :----------------: | :------------------: |
| `read.ad.interstitial`   |         ✅          |       ✅       |         ✅          |       ✅       |         ✅         |          ✅          |
| `update.ad.interstitial` |         ✅          |       ❌       |         ❌          |       ✅       |         ❌         |          ❌          |

**Scopes:**

- Administrators and Marketers can update interstitial ads.
- Others can only read interstitial ads.
