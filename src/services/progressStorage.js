const STORAGE_KEY = "ai-simplified-progress-v1";
const EVENT_NAME = "ai-simplified-progress-updated";
const emptyProgress = () => ({version:1,chapters:{},quizzes:[],assessments:[],updatedAt:null});

function readProgress() {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyProgress();
    const parsed = JSON.parse(saved);
    if (!parsed || parsed.version !== 1) return emptyProgress();
    return {
      ...emptyProgress(), ...parsed,
      chapters: parsed.chapters && typeof parsed.chapters === "object" ? parsed.chapters : {},
      quizzes: Array.isArray(parsed.quizzes) ? parsed.quizzes : [],
      assessments: Array.isArray(parsed.assessments) ? parsed.assessments : []
    };
  } catch { return emptyProgress(); }
}
function writeProgress(progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({...progress,updatedAt:new Date().toISOString()}));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (error) { console.warn("AI Simplified could not save progress in this browser.",error); }
}
export function getProgressSnapshot(){ return readProgress(); }
export function subscribeToProgress(callback){
  if(typeof window==="undefined") return ()=>{};
  window.addEventListener(EVENT_NAME,callback); window.addEventListener("storage",callback);
  return ()=>{window.removeEventListener(EVENT_NAME,callback);window.removeEventListener("storage",callback);};
}
export function recordChapterCompletion(lessonId,chapterIndex,chapterCount){
  const progress=readProgress(); const lesson=progress.chapters[lessonId]||{completed:[],total:chapterCount};
  lesson.completed=[...new Set([...lesson.completed,chapterIndex])].sort((a,b)=>a-b);
  lesson.total=chapterCount; progress.chapters[lessonId]=lesson; writeProgress(progress);
}
export function recordQuizResult(score,total){
  const progress=readProgress(); progress.quizzes.push({score,total,date:new Date().toISOString()});
  progress.quizzes=progress.quizzes.slice(-30); writeProgress(progress);
}
export function recordAssessmentResult(result){
  const progress=readProgress(); progress.assessments.push({...result,date:new Date().toISOString()});
  progress.assessments=progress.assessments.slice(-30); writeProgress(progress);
}
export function resetProgress(){writeProgress(emptyProgress());}
export function exportProgress(){return JSON.stringify(readProgress(),null,2);}
export function importProgress(jsonText){
  const parsed=JSON.parse(jsonText);
  if(!parsed||parsed.version!==1||typeof parsed.chapters!=="object") throw new Error("This file is not a supported AI Simplified progress backup.");
  writeProgress({...emptyProgress(),...parsed,chapters:parsed.chapters||{},quizzes:Array.isArray(parsed.quizzes)?parsed.quizzes:[],assessments:Array.isArray(parsed.assessments)?parsed.assessments:[]});
}
