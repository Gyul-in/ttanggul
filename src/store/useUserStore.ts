import { create } from 'zustand';

interface UserState {
  nickname: string;
  preferredCategory: string | null;
  notificationTime: string | null;
  clovers: number;
  lastCloverReceivedDate: string | null;
  hasUnreadNotification: boolean;
  setNickname: (nickname: string) => void;
  setPreferredCategory: (category: string) => void;
  setNotificationTime: (time: string) => void;
  addClover: () => void;
  setLastCloverReceivedDate: (date: string) => void;
  setUnreadNotification: (value: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: '',
  preferredCategory: null,
  notificationTime: null,
  clovers: 0,
  lastCloverReceivedDate: null,
  hasUnreadNotification: true, // 임시: 더미 알림 데이터가 있으므로 true
  setNickname: (nickname) => set({ nickname }),
  setPreferredCategory: (category) => set({ preferredCategory: category }),
  setNotificationTime: (time) => set({ notificationTime: time }),
  addClover: () => set((state) => ({ clovers: state.clovers + 1 })),
  setLastCloverReceivedDate: (date) => set({ lastCloverReceivedDate: date }),
  setUnreadNotification: (value) => set({ hasUnreadNotification: value }),
}));
