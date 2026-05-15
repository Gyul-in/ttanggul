import { create } from 'zustand';

interface UserState {
  nickname: string;
  preferredCategory: string | null;
  notificationTime: string | null;
  clovers: number;
  lastCloverReceivedDate: string | null;
  setNickname: (nickname: string) => void;
  setPreferredCategory: (category: string) => void;
  setNotificationTime: (time: string) => void;
  addClover: () => void;
  setLastCloverReceivedDate: (date: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: '',
  preferredCategory: null,
  notificationTime: null,
  clovers: 0,
  lastCloverReceivedDate: null,
  setNickname: (nickname) => set({ nickname }),
  setPreferredCategory: (category) => set({ preferredCategory: category }),
  setNotificationTime: (time) => set({ notificationTime: time }),
  addClover: () => set((state) => ({ clovers: state.clovers + 1 })),
  setLastCloverReceivedDate: (date) => set({ lastCloverReceivedDate: date }),
}));
