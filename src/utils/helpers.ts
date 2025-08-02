import {Task, TaskWithUser, StoryItem} from '../types';

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = 0; // 초는 항상 0으로 표시 (분 단위로 계산하므로)
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatElapsedTime = (startTime: Date, endTime?: Date): string => {
  const end = endTime || new Date();
  const diffMs = end.getTime() - startTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  return formatTime(diffMinutes);
};

export const isTimeExceeded = (task: Task): boolean => {
  const now = new Date();
  const elapsedMs = now.getTime() - task.startTime.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
  
  return elapsedMinutes > task.targetTime;
};

export const getTimeColor = (task: Task): string => {
  if (isTimeExceeded(task)) {
    return '#FF4444'; // 빨간색
  }
  return '#333333'; // 검은색
};

export const getStoryItems = (myTasks: Task[], friendTasks: TaskWithUser[]): StoryItem[] => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const items: StoryItem[] = [];
  
  // 내 할 일들 (진행중인 것부터)
  const myOngoingTasks = myTasks.filter(task => !task.isCompleted && !task.isAbandoned);
  const myCompletedTasks = myTasks.filter(task => task.isCompleted && task.updatedAt >= twentyFourHoursAgo);
  
  [...myOngoingTasks, ...myCompletedTasks].forEach(task => {
    items.push({
      id: `my-${task.id}`,
      task: {...task, user: {id: task.userId, username: '', nickname: '나'}, isViewed: false},
      isMyTask: true,
      timestamp: task.updatedAt,
    });
  });
  
  // 친구 할 일들 (안 본 것부터)
  const unviewedTasks = friendTasks.filter(task => !task.isViewed && task.updatedAt >= twentyFourHoursAgo);
  const viewedTasks = friendTasks.filter(task => task.isViewed && task.updatedAt >= twentyFourHoursAgo);
  
  [...unviewedTasks, ...viewedTasks].forEach(task => {
    items.push({
      id: `friend-${task.id}`,
      task,
      isMyTask: false,
      timestamp: task.updatedAt,
    });
  });
  
  // 최근에 올린 순으로 정렬
  return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const getStoryStatusColor = (item: StoryItem): string => {
  if (item.isMyTask) {
    return '#71d596'; // 초록색 (내 할 일)
  }
  
  if (!item.task.isViewed) {
    return '#71d596'; // 초록색 (안 본 친구 할 일)
  }
  
  return '#bababa'; // 회색 (본 친구 할 일)
}; 