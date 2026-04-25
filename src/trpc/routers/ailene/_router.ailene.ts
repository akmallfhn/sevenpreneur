import { createTRPCRouter } from "@/trpc/init";
import { createAilene } from "./create.ailene";
import { deleteAilene } from "./delete.ailene";
import { listAilene } from "./list.ailene";
import { readAilene } from "./read.ailene";
import { updateAilene } from "./update.ailene";

export const aileneRouter = createTRPCRouter({
  // Lessons
  createLesson: createAilene.lesson,
  listLessons: listAilene.lessons,
  listLessonsWithProgress: listAilene.lessonsWithProgress,
  readLesson: readAilene.lesson,
  readLessonForUser: readAilene.lessonForUser,
  updateLesson: updateAilene.lesson,
  deleteLesson: deleteAilene.lesson,

  // Quiz questions
  createQuizQuestion: createAilene.quizQuestion,
  listQuizQuestions: listAilene.quizQuestions,
  listQuizQuestionsForUser: listAilene.quizQuestionsForUser,
  updateQuizQuestion: updateAilene.quizQuestion,
  deleteQuizQuestion: deleteAilene.quizQuestion,

  // User progress
  submitQuiz: createAilene.submitQuiz,
  myProgress: listAilene.myProgress,
});
