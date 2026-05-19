import { createTRPCRouter } from "@/trpc/init";
import { createAilene } from "./create.ailene";
import { listAilene } from "./list.ailene";
import { readAilene } from "./read.ailene";
import { updateAilene } from "./update.ailene";

export const aileneRouter = createTRPCRouter({
  list: createTRPCRouter({
    // any member (student / champion / sponsor)
    levels: listAilene.levels,
    chapters: listAilene.chapters,
    tasks: listAilene.tasks,
    quizQuestions: listAilene.quizQuestions,
    assignedPrompts: listAilene.myAssignedPrompts,
    assignedUseCases: listAilene.myAssignedUseCases,
    // champion only
    members: listAilene.championMembers,
    promptLibrary: listAilene.promptLibrary,
    useCaseLibrary: listAilene.useCaseLibrary,
    promptSubmissions: listAilene.championPromptSubmissions,
    useCaseSubmissions: listAilene.championUseCaseSubmissions,
  }),
  read: createTRPCRouter({
    // any member (student / champion / sponsor)
    materialDetail: readAilene.materialDetail,
    quizResult: readAilene.quizResult,
    preAssessment: readAilene.preAssessment,
    todayFocus: readAilene.todayFocus,
    levelProgress: readAilene.levelProgress,
    streak: readAilene.streak,
    groupLeaderboard: readAilene.groupLeaderboard,
    promptAssignment: readAilene.promptAssignment,
    useCaseAssignment: readAilene.useCaseAssignment,
    // champion only
    promptSubmissionDetail: readAilene.championPromptSubmissionDetail,
    useCaseSubmissionDetail: readAilene.championUseCaseSubmissionDetail,
  }),
  create: createTRPCRouter({
    // any member (student / champion / sponsor)
    preAssessment: createAilene.preAssessment,
    completeMaterial: createAilene.completeMaterial,
    completeVideo: createAilene.completeVideo,
    // champion only
    assignPrompt: createAilene.assignPrompt,
    assignUseCase: createAilene.assignUseCase,
  }),
  update: createTRPCRouter({
    // any member (student / champion / sponsor)
    unlockLevel: updateAilene.unlockLevel,
    startQuizAttempt: updateAilene.startQuizAttempt,
    saveQuizDraft: updateAilene.saveQuizDraft,
    submitQuiz: updateAilene.submitQuiz,
    submitPromptAssignment: updateAilene.submitPromptAssignment,
    submitUseCaseAssignment: updateAilene.submitUseCaseAssignment,
    // champion only
    reviewPromptSubmission: updateAilene.reviewPromptSubmission,
    reviewUseCaseSubmission: updateAilene.reviewUseCaseSubmission,
  }),
});
