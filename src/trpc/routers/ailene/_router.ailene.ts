import { createTRPCRouter } from "@/trpc/init";
import { championAilene } from "./champion.ailene";
import { listAilene } from "./list.ailene";
import { preAssessmentAilene } from "./pre-assessment.ailene";
import { readAilene } from "./read.ailene";
import { updateAilene } from "./update.ailene";

export const aileneRouter = createTRPCRouter({
  list: createTRPCRouter({
    myGroups: listAilene.myGroups,
    levels: listAilene.levels,
    chapters: listAilene.chapters,
    tasks: listAilene.tasks,
    quizQuestions: listAilene.quizQuestions,
  }),
  read: createTRPCRouter({
    materialDetail: readAilene.materialDetail,
    quizResult: readAilene.quizResult,
    myPreAssessment: preAssessmentAilene.myPreAssessment,
  }),
  champion: createTRPCRouter({
    listGroups: championAilene.listGroups,
    listMembers: championAilene.listMembers,
  }),
  unlockLevel: updateAilene.unlockLevel,
  startQuizAttempt: updateAilene.startQuizAttempt,
  saveQuizDraft: updateAilene.saveQuizDraft,
  submitQuiz: updateAilene.submitQuiz,
  completeMaterial: updateAilene.completeMaterial,
  completeVideo: updateAilene.completeVideo,
  submitPreAssessment: preAssessmentAilene.submitPreAssessment,
});
