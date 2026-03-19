import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function RootLayout() {
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    setIsloading(false);
  }, []);

  if (isloading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="games" options={{ headerShown: false }} />
    </Stack>
  );
}
