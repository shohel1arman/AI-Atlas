import { getSupabase } from './supabase';

const STORAGE_KEY = 'ai-atlas-progress-v2';
export const PROGRESS_EVENT = 'atlas:progress';

export type ProgressSnapshot = Record<string, true>;

function lessonKey(moduleId: string, lessonId: string) {
  return `${moduleId}/${lessonId}`;
}

export function readProgress(): ProgressSnapshot {
  if (typeof localStorage === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as ProgressSnapshot;
  } catch {
    return {};
  }
}

function writeProgress(progress: ProgressSnapshot) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  document.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: progress }));
}

export function isLessonComplete(moduleId: string, lessonId: string) {
  return Boolean(readProgress()[lessonKey(moduleId, lessonId)]);
}

export async function setLessonComplete(moduleId: string, lessonId: string, completed: boolean) {
  const progress = readProgress();
  const key = lessonKey(moduleId, lessonId);
  if (completed) progress[key] = true;
  else delete progress[key];
  writeProgress(progress);

  const supabase = getSupabase();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!supabase || !data.user) return;

  if (completed) {
    await supabase.from('progress').upsert({
      user_id: data.user.id,
      module: moduleId,
      lesson: lessonId,
      completed: true,
      source: 'manual',
      updated_at: new Date().toISOString(),
    });
  } else {
    await supabase.from('progress').delete().eq('user_id', data.user.id).eq('module', moduleId).eq('lesson', lessonId);
  }
}

export async function mergeCloudProgress() {
  const supabase = getSupabase();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!supabase || !data.user) return readProgress();

  const local = readProgress();
  const { data: rows } = await supabase.from('progress').select('module,lesson,completed').eq('user_id', data.user.id);
  for (const row of rows || []) {
    if (row.completed) local[lessonKey(row.module, row.lesson)] = true;
  }

  const unsynced = Object.keys(local).map((key) => {
    const [module, lesson] = key.split('/');
    return { user_id: data.user!.id, module, lesson, completed: true, source: 'merge', updated_at: new Date().toISOString() };
  });
  if (unsynced.length) await supabase.from('progress').upsert(unsynced);
  writeProgress(local);
  return local;
}
