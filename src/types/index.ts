export interface User {
  id: string;
  username: string;
  nickname: string;
  profileImage?: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetTime: number; // 목표 시간 (분)
  startTime: Date;
  endTime?: Date;
  startImage: string;
  endImage?: string;
  isCompleted: boolean;
  isAbandoned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted';
  createdAt: Date;
}

export interface TaskWithUser extends Task {
  user: User;
  isViewed: boolean; // 친구가 본 여부
}

export interface StoryItem {
  id: string;
  task: TaskWithUser;
  isMyTask: boolean;
  timestamp: Date;
} 