import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable,Alert } from 'react-native';
import { WorkoutProvider } from '../WorkoutContext';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Tabs
    screenOptions={{
    tabBarActiveTintColor: 'black',
    tabBarInactiveTintColor: '#888',
    tabBarStyle: {
      backgroundColor: 'white',
      borderTopColor: '#eee',
    },
    headerStyle: {
      backgroundColor: 'white',
    },
    headerTintColor: 'black',
    }}
>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Your Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
