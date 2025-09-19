import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import ErrorBoundary from '../../components/ui/ErrorBoundary';
import { MedicationProvider } from '../../context/MedicationContext';

const ChatIcon = require('../../assets/images/NBICON2.png');
const PillIcon = require('../../assets/images/pill.png');

export default function TabLayout() {
  return (
    <ErrorBoundary>
      <MedicationProvider>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopColor: '#64748b',
              borderTopWidth: 1,
            },
            tabBarActiveTintColor: '#000000',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarLabelStyle: {
              color: '#000000',
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="meds"
            options={{
              title: 'Meds',
              tabBarIcon: ({ color }) => (
                <Image
                  source={PillIcon}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: color,
                  }}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: 'Chat',
              tabBarIcon: ({ color }) => (
                <Image
                  source={ChatIcon}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: color,
                  }}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
            }}
          />
        </Tabs>
      </MedicationProvider>
    </ErrorBoundary>
  );
}