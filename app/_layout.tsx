import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="welcome" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="password" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="dashboard" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </>
  );
}
