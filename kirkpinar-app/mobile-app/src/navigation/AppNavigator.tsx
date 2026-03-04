import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { Home, UserCircle, Trophy } from 'lucide-react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: theme.colors.surface,
                        borderTopWidth: 0,
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: -2 },
                        shadowRadius: 10,
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.textSecondary,
                }}
            >
                <Tab.Screen
                    name="Tahminler"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Profili"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <UserCircle color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Keşfet"
                    component={ExploreScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
