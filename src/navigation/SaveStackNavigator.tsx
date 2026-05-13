import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SaveScreen from '../screens/SaveScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';

const Stack = createNativeStackNavigator();

export default function SaveStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="SaveList" component={SaveScreen} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
    </Stack.Navigator>
  );
}
