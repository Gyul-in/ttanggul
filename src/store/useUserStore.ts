import { create } from 'zustand';

export type NotificationItem = {
  id: string;
  text: string;
  category: string;
  receivedAt: string;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    text: '실패 경험은 면접에서 오히려 강점입니다. 어떻게 극복했는지가 핵심입니다.',
    category: '현실조언',
    receivedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

interface UserState {
  nickname: string;
  preferredCategory: string | null;
  notificationTime: string | null;
  isNotificationOn: boolean;
  clovers: number;
  lastCloverReceivedDate: string | null;
  notifications: NotificationItem[];
  setNickname: (nickname: string) => void;
  setPreferredCategory: (category: string) => void;
  setNotificationTime: (time: string | null) => void;
  setNotificationOn: (enabled: boolean) => void;
  addClover: () => void;
  setLastCloverReceivedDate: (date: string) => void;
  deleteNotification: (id: string) => void;
  hasUnreadNotification: boolean;
  setUnreadNotification: (value: boolean) => void;
  cardPickDate: string | null;
  cardPickCount: number;
  useCardPick: () => boolean;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: '',
  preferredCategory: null,
  notificationTime: null,
  isNotificationOn: false,
  clovers: 0,
  lastCloverReceivedDate: null,
  notifications: INITIAL_NOTIFICATIONS,
  hasUnreadNotification: true,
  setNickname: (nickname) => set({ nickname }),
  setPreferredCategory: (category) => set({ preferredCategory: category }),
  setNotificationTime: (time) => set({ notificationTime: time }),
  setNotificationOn: (enabled) => set({ isNotificationOn: enabled }),
  addClover: () => set((state) => ({ clovers: state.clovers + 1 })),
  setLastCloverReceivedDate: (date) => set({ lastCloverReceivedDate: date }),
  deleteNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      return { notifications, hasUnreadNotification: notifications.length > 0 };
    }),
  setUnreadNotification: (value) => set({ hasUnreadNotification: value }),
  cardPickDate: null,
  cardPickCount: 0,
  useCardPick: () => {
    const today = new Date().toDateString();
    let canPick = false;
    set((state) => {
      const isNewDay = state.cardPickDate !== today;
      const count = isNewDay ? 0 : state.cardPickCount;
      if (count < 3) {
        canPick = true;
        return { cardPickDate: today, cardPickCount: count + 1 };
      }
      return {};
    });
    return canPick;
  },
}));
