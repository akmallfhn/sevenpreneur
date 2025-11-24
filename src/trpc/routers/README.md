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

**Scopes:** `auth.checkSession`: All logged-in users only have read access to their own user data.

## Roles 👥

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.roles`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.role`    |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:** All logged-in users have read access to all roles.

## Industries 🏭

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.industries` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.industry`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:** All logged-in users have read access to all industries.

## Phone Country Codes ☎️

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.phoneCountryCodes` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:** All logged-in users have read access to all phone country codes.

## Payment Channels 🏦

| Procedure Name         | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :--------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.paymentChannels` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:** All logged-in users have read access to all payment channels.

## Users 👤

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.user`  |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.users`   |         ✅          |       ✅       |         ✅          |         ❌         |          ❌          |
| `read.user`    |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.user`  |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.user`  |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

**Scopes:**

- Administrators have write access to all users' data.
- Administrators, Educators, and Class Managers have read access to all users' data.
- General Users can only read their own user data.

### User Businesses 👤

| Procedure Name         | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :--------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `update.user_business` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:**

- Logged-in users can only update their own business data.

## Cohorts 🎓

| Procedure Name  | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :-------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.cohort` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.cohorts`  |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `read.cohort`   |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `update.cohort` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.cohort` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all cohorts' data.
- `list.cohorts`:
  - Administrators can see all cohorts.
  - Non-Administrators can only see active cohorts.
- `read.cohort`:
  - Logged-in users can read all cohorts given the cohort ID.
  - Non-logged-in users can only read active cohorts.

### Cohort Prices 💵

| Procedure Name       | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.cohortPrice` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.cohortPrices`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.cohortPrice`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.cohortPrice` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.cohortPrice` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all cohort prices' data.
- Logged-in users can see all cohort prices given the cohort ID.

### Cohort Members 👥

| Procedure Name       | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.cohortMembers` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:**

- Administrators, Educators, and Class Managers can see all cohort members given the cohort ID.
- General Users can see all cohort members given the cohort ID which the users are enrolled.

### Enrolled Cohorts 🎓

| Procedure Name         | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :--------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.enrolledCohorts` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.enrolledCohort`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:** Logged-in users can see all their own paid/enrolled cohorts.

## Modules 📕

| Procedure Name  | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :-------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.module` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.modules`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.module`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.module` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.module` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all modules' data.
- Administrators, Educators, and Class Managers can see all modules given the cohort ID.
- General Users can see all modules given the cohort ID which the users are enrolled.

## Learnings 📅

| Procedure Name          | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.learning`       |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.learnings`        |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.learnings_public` |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `read.learning`         |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.learning`       |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.learning`       |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all learnings' data.
- Logged-in users can see all learnings given the cohort ID.
- `list.learnings_public`: Non-logged-in users can only see active learnings given the cohort ID.

### Materials 📖

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.material` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.materials`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.material`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.material` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.material` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all materials' data.
- Administrators, Educators, and Class Managers can see all materials given the learning ID.
- General Users can see all materials given the learning ID which the users are enrolled.

### Discussion Starters 💬

| Procedure Name             | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.discussionStarter` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.discussionStarters`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.discussionStarter` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `delete.discussionStarter` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:**

- Administrators can see all discussion starters.
- Logged-in users can post a discussion starter.
- Logged-in users can see all discussions given the learning ID which the users are enrolled.
- Logged-in users can only update and delete their own discussion starters.
- Administrators can delete all discussion starters.

### Discussion Replies 🗪

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.discussionReply` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.discussionReplies` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.discussionReply` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `delete.discussionReply` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:**

- Administrators can see all discussion replies.
- Logged-in users can post a discussion reply.
- Logged-in users can see all discussions given the learning ID which the users are enrolled.
- Logged-in users can only update and delete their own discussion replies.
- Administrators can delete all discussion replies.

## Projects 🗂️

| Procedure Name   | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :--------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.project` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.projects`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.project`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.project` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.project` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all projects' data.
- Administrators, Educators, and Class Managers can see all projects given the cohort ID.
- General Users can see all projects given the cohort ID which the users are enrolled.

## Submissions 🗒️

| Procedure Name      | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------ | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.submission` |         ✅          |       ❌       |         ❌          |         ✅         |          ❌          |
| `list.submissions`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.submission`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.submission` |         ✅          |       ✅       |         ❌          |         ✅         |          ❌          |
| `delete.submission` |         ✅          |       ❌       |         ❌          |         ✅         |          ❌          |

**Scopes:**

- Administrators have write access to all submissions' data.
- Administrators, Educators, and Class Managers have read access to all submissions' data.
- General Users have read/write access to their own submission data.

## Playlists 📺

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.playlist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.playlists`  |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `read.playlist`   |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `update.playlist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.playlist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all playlists' data.
- `list.playlists`:
  - Administrators can see all playlists.
  - Non-Administrators can only see active playlists.
- `read.playlist`:
  - Administrators can read all playlists.
  - Non-Administrators can only read active playlists given the playlist ID.

### Educators Playlists 👥

| Procedure Name            | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------------ | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.educatorPlaylist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.educatorsPlaylist`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `delete.educatorPlaylist` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all educator playlists' data.
- Logged-in users can see all educator playlists given the playlist ID.

### Enrolled Playlists 📺

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `list.enrolledPlaylists` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.enrolledPlaylist`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:** Logged-in users can see all their own paid/enrolled playlists.

## Videos 🎞️

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.video` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `read.video`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.video` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.video` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all videos' data.
- Administrators, Educators, and Class Managers can see all videos given the playlist ID.
- General Users can see all active videos given the playlist ID which the users are enrolled.

## Events 📅

| Procedure Name | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.event` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.events`  |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `read.event`   |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `update.event` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.event` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all events' data.
- `list.events`:
  - Administrators can see all events.
  - Non-Administrators can only see active events.
- `read.event`:
  - Logged-in users can read all events given the event ID.
  - Non-logged-in users can only read active events.

### Event Prices 💵

| Procedure Name      | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :------------------ | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.eventPrice` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `list.eventPrices`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.eventPrice`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.eventPrice` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |
| `delete.eventPrice` |         ✅          |       ❌       |         ✅          |         ❌         |          ❌          |

**Scopes:**

- Administrators and Class Manager have write access to all event prices' data.
- Logged-in users can see all event prices given the event ID.

## Templates 📊

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.template` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.templates`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.template`   |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `update.template` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.template` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

**Scopes:**

- Only Administrators have write access to all templates' data.
- Administrators, Educators, and Class Managers can see all templates.
- General Users can see all active templates if the user is in the enrolled list.

## AI Tools and AI Conversations ✨

| Procedure Name              | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :-------------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `check.aiTools`             |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.aiTools`              |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.aiResults`            |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.ai.ideaValidation`    |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.ai.marketSize`        |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.ai.competitorGrading` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `use.ai.ideaValidation`     |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `use.ai.marketSize`         |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `use.ai.competitorGrading`  |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.aiConversations`      |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.aiChats`              |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `use.ai.sendChat`           |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:**

- Administrators, Educators, and Class Managers can use/read results from AI tools.
- General Users can use/read results from AI tools if the user is in the enrolled list.

## Discounts 🪙

| Procedure Name    | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :---------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `create.discount` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `list.discounts`  |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `read.discount`   |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `update.discount` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |
| `delete.discount` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

**Scopes:** Only Administrators have access to all discounts' data.

## Transactions 💰

| Procedure Name           | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :----------------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `purchase.checkDiscount` |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `purchase.cohort`        |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `purchase.playlist`      |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `purchase.event`         |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `purchase.cancel`        |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `list.transactions`      |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |
| `read.transaction`       |         ✅          |       ✅       |         ✅          |         ✅         |          ❌          |

**Scopes:**

- Administrators can see all transactions.
- Administrators and Class Manager can purchase items for other users.
- Logged-in users can purchase items for their own.
- Logged-in users can see all their own transactions.

## Tickers 🚨

| Procedure Name  | Administrator (`0`) | Educator (`1`) | Class Manager (`2`) | General User (`3`) | Public/Not Logged-In |
| :-------------- | :-----------------: | :------------: | :-----------------: | :----------------: | :------------------: |
| `read.ticker`   |         ✅          |       ✅       |         ✅          |         ✅         |          ✅          |
| `update.ticker` |         ✅          |       ❌       |         ❌          |         ❌         |          ❌          |

**Scopes:**

- Only Administrators can update tickers.
- Non-Administrators can only read tickers.
