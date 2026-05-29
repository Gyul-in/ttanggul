import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationItem = {
  id: string;
  text: string;
  category: string;
  receivedAt: string;
};

export type PickedCard = {
  id: string;
  category: string;
  text: string;
};

interface UserState {
  nickname: string;
  preferredCategory: string | null;
  notificationTime: string | null;
  isNotificationOn: boolean;
  clovers: number;
  lastCloverReceivedDate: string | null;
  notifications: NotificationItem[];
  hasAgreedTerms: boolean;
  hasMarketingAgreed: boolean;
  setNickname: (nickname: string) => void;
  setPreferredCategory: (category: string) => void;
  setNotificationTime: (time: string | null) => void;
  setNotificationOn: (enabled: boolean) => void;
  addClover: () => void;
  setLastCloverReceivedDate: (date: string) => void;
  addNotification: (item: Omit<NotificationItem, 'id'>) => void;
  deleteNotification: (id: string) => void;
  hasUnreadNotification: boolean;
  setUnreadNotification: (value: boolean) => void;
  cardPickDate: string | null;
  cardPickCount: number;
  useCardPick: () => boolean;
  pickedCards: PickedCard[];
  addPickedCard: (card: PickedCard) => void;
  agreeTerms: (marketingAgreed: boolean) => void;
  resetStore: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      nickname: '',
      preferredCategory: null,
      notificationTime: null,
      isNotificationOn: false,
      clovers: 0,
      lastCloverReceivedDate: null,
      notifications: [],
      hasAgreedTerms: false,
      hasMarketingAgreed: false,
      hasUnreadNotification: false,
      agreeTerms: (marketingAgreed) => set({ hasAgreedTerms: true, hasMarketingAgreed: marketingAgreed }),
      resetStore: () => set({
        nickname: '',
        preferredCategory: null,
        notificationTime: null,
        isNotificationOn: false,
        clovers: 0,
        lastCloverReceivedDate: null,
        notifications: [],
        hasAgreedTerms: false,
        hasMarketingAgreed: false,
        hasUnreadNotification: false,
        cardPickDate: null,
        cardPickCount: 0,
        pickedCards: [],
      }),
      setNickname: (nickname) => set({ nickname }),
      setPreferredCategory: (category) => set({ preferredCategory: category }),
      setNotificationTime: (time) => set({ notificationTime: time }),
      setNotificationOn: (enabled) => set({ isNotificationOn: enabled }),
      addClover: () => set((state) => ({ clovers: state.clovers + 1 })),
      setLastCloverReceivedDate: (date) => set({ lastCloverReceivedDate: date }),
      addNotification: (item) =>
        set((state) => ({
          notifications: [...state.notifications, { ...item, id: Date.now().toString() }],
          hasUnreadNotification: true,
        })),
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
            return {
              cardPickDate: today,
              cardPickCount: count + 1,
              ...(isNewDay && { pickedCards: [] }),
            };
          }
          return {};
        });
        return canPick;
      },
      pickedCards: [],
      addPickedCard: (card) => set((state) => ({
        pickedCards: [...state.pickedCards, card],
      })),
    }),
    {
      name: 'ddanggul-user-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
