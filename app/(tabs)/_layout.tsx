import { Tabs } from "expo-router";
import { Newspaper, Info, Images, Lock } from "lucide-react-native";
import React from "react";

import Colors from "@/constants/colors";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textLight,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopColor: Colors.border,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Actualités",
                    tabBarIcon: ({ color }) => <Newspaper size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: "À propos",
                    tabBarIcon: ({ color }) => <Info size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="gallery"
                options={{
                    title: "Galerie",
                    tabBarIcon: ({ color }) => <Images size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: "Admin",
                    tabBarIcon: ({ color }) => <Lock size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

