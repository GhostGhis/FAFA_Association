import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ContentProvider } from "@/contexts/ContentContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
    return (
        <Stack screenOptions={{ headerBackTitle: "Retour" }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ContentProvider>
                <GestureHandlerRootView>
                    <RootLayoutNav />
                </GestureHandlerRootView>
            </ContentProvider>
        </QueryClientProvider>
    );
}
