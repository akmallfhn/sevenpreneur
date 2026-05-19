import { createTRPCRouter } from "@/trpc/init";
import { createAilene } from "./create.ailene";
import { listAilene } from "./list.ailene";
import { readAilene } from "./read.ailene";
import { updateAilene } from "./update.ailene";

export const aileneRouter = createTRPCRouter({
  list: createTRPCRouter({
    levels: listAilene.levels,
    chapters: listAilene.chapters,
    tasks: listAilene.tasks,
    quizQuestions: listAilene.quizQuestions,
  }),
  read: createTRPCRouter({
    materialDetail: readAilene.materialDetail,
    quizResult: readAilene.quizResult,
    preAssessment: readAilene.preAssessment,
    todayFocus: readAilene.todayFocus,
    levelProgress: readAilene.levelProgress,
    streak: readAilene.streak,
    groupLeaderboard: readAilene.groupLeaderboard,
  }),
  create: createTRPCRouter({
    preAssessment: createAilene.preAssessment,
  }),
  champion: createTRPCRouter({
    listMembers: listAilene.championMembers,
    promptLibrary: listAilene.promptLibrary,
    useCaseLibrary: listAilene.useCaseLibrary,
    promptSubmissions: listAilene.championPromptSubmissions,
    useCaseSubmissions: listAilene.championUseCaseSubmissions,
    promptSubmissionDetail: readAilene.championPromptSubmissionDetail,
    useCaseSubmissionDetail: readAilene.championUseCaseSubmissionDetail,
    assignPrompt: updateAilene.assignPrompt,
    assignUseCase: updateAilene.assignUseCase,
    reviewPromptSubmission: updateAilene.reviewPromptSubmission,
    reviewUseCaseSubmission: updateAilene.reviewUseCaseSubmission,
  }),
  student: createTRPCRouter({
    assignedPrompts: listAilene.myAssignedPrompts,
    assignedUseCases: listAilene.myAssignedUseCases,
    promptAssignment: readAilene.promptAssignment,
    useCaseAssignment: readAilene.useCaseAssignment,
    submitPromptAssignment: updateAilene.submitPromptAssignment,
    submitUseCaseAssignment: updateAilene.submitUseCaseAssignment,
  }),
  unlockLevel: updateAilene.unlockLevel,
  startQuizAttempt: updateAilene.startQuizAttempt,
  saveQuizDraft: updateAilene.saveQuizDraft,
  submitQuiz: updateAilene.submitQuiz,
  completeMaterial: updateAilene.completeMaterial,
  completeVideo: updateAilene.completeVideo,
});
