import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 임시 글귀 데이터 (나중에 실제 데이터로 교체)
const TEMP_QUOTES = [
  '오늘 하루도 정말 잘 버텼어. 그것만으로도 충분해.',
  '작은 한 걸음이 결국 큰 변화를 만들어.',
  '지금 이 순간, 너는 충분히 잘하고 있어.',
  '힘든 날일수록 나를 더 아껴줘야 해.',
  '실패는 끝이 아니라 다시 시작하는 이유야.',
  '오늘의 나는 어제보다 조금 더 강해졌어.',
  '완벽하지 않아도 괜찮아. 그냥 너이면 돼.',
  '숨 한번 크게 쉬고, 다시 해보자.',
  '잘 될 거야. 정말로.',
  '오늘도 수고했어. 진심으로.',
];

// 알림 채널 설정 (Android)
export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-quote', {
      name: '두듀의 한마디',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

// "AM 06:30" / "PM 11:00" → { hour, minute } (24시간제)
function parseTimeString(timeStr: string): { hour: number; minute: number } {
  if (timeStr === '랜덤') {
    const hour = Math.floor(Math.random() * 14) + 8; // 8~21시 랜덤
    const minute = Math.random() < 0.5 ? 0 : 30;
    return { hour, minute };
  }

  const [meridiem, hm] = timeStr.split(' ');
  const [h, m] = hm.split(':').map(Number);

  let hour = h;
  if (meridiem === 'AM' && h === 12) hour = 0;
  else if (meridiem === 'PM' && h !== 12) hour = h + 12;

  return { hour, minute: m };
}

// 매일 알림 예약
export async function scheduleDailyNotification(time: string) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const { hour, minute } = parseTimeString(time);
  const randomQuote = TEMP_QUOTES[Math.floor(Math.random() * TEMP_QUOTES.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: randomQuote,
      body: '두듀의 따뜻한 한마디를 확인해 보세요!',
      ...(Platform.OS === 'android' && { channelId: 'daily-quote' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

// 알림 전체 취소
export async function cancelDailyNotification() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// 테스트용: 5초 후 알림
export async function scheduleTestNotification() {
  const randomQuote = TEMP_QUOTES[Math.floor(Math.random() * TEMP_QUOTES.length)];
  await Notifications.scheduleNotificationAsync({
    content: {
      title: randomQuote,
      body: '두듀의 따뜻한 한마디를 확인해 보세요!',
      ...(Platform.OS === 'android' && { channelId: 'daily-quote' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });
}
