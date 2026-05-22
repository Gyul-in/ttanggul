import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import CardPickScreen from '../screens/CardPickScreen';
import CardPickResultScreen from '../screens/CardPickResultScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F1E8' } }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="CardPick" component={CardPickScreen} />
      <Stack.Screen name="CardPickResult" component={CardPickResultScreen} />
    </Stack.Navigator>
  );
}
