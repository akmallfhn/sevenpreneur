import { createTRPCRouter } from "@/trpc/init";
import { createLab } from "./create.lab";
import { deleteLab } from "./delete.lab";
import { listLab } from "./list.lab";
import { readLab } from "./read.lab";
import { updateLab } from "./update.lab";

export const labRouter = createTRPCRouter({
  // Profile
  myProfile: listLab.myProfile,

  // Use Cases
  listUseCases: listLab.useCases,
  readUseCase: readLab.useCase,
  createUseCase: createLab.useCase,
  updateUseCase: updateLab.useCase,
  reviewUseCase: updateLab.reviewUseCase,
  deleteUseCase: deleteLab.useCase,

  // Competency Scores
  listCompetencyScores: listLab.competencyScores,
  upsertCompetencyScore: createLab.competencyScore,

  // Coaching Notes
  listCoachingNotes: listLab.coachingNotes,
  createCoachingNote: createLab.coachingNote,
  markNoteRead: updateLab.markNoteRead,

  // Obstacles
  listObstacles: listLab.obstacles,
  readObstacle: readLab.obstacle,
  createObstacle: createLab.obstacle,
  resolveObstacle: updateLab.resolveObstacle,
  deleteObstacle: deleteLab.obstacle,

  // Team
  listTeamMembers: listLab.teamMembers,

  // Sponsor
  executiveOverview: listLab.executiveOverview,

  // Appreciations
  sendAppreciation: createLab.appreciation,

  // Admin
  allMembers: listLab.allMembers,
  allCompanies: listLab.allCompanies,
  createCompany: createLab.company,
  updateCompany: updateLab.company,
  addMember: createLab.member,
  removeMember: deleteLab.member,
  createTeam: createLab.team,
  deleteTeam: deleteLab.team,
  addTeamMember: createLab.teamMember,
});
