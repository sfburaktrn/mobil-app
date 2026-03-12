import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { Home, UserCircle, Trophy } from 'lucide-react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { PredictionsScreen } from '../screens/PredictionsScreen';
import { WrestlersScreen } from '../screens/WrestlersScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { RankingsScreen } from '../screens/RankingsScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

const navigationTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: theme.colors.background,
        card: theme.colors.surface,
        primary: theme.colors.primary,
        text: theme.colors.text,
        border: 'transparent',
    },
};

export const AppNavigator = () => {
    return (
        <NavigationContainer theme={navigationTheme}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: theme.colors.surface,
                        borderTopWidth: 0,
                        height: 72,
                        paddingTop: 8,
                        paddingBottom: 10,
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: -2 },
                        shadowRadius: 10,
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.textSecondary,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '700',
                    },
                }}
            >
                <Tab.Screen
                    name="Ana Sayfa"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Tahminler"
                    component={PredictionsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Pehlivanlar"
                    component={WrestlersScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <UserCircle color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Tarihçe"
                    component={HistoryScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Sıralama"
                    component={RankingsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <UserCircle color={color} size={size} />
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
