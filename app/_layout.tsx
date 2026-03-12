import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function Layout() {
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    setIsloading(false);
  }, []);

  if (isloading) {
    return <Text>Loading...</Text>;
  }

  return <Slot />;
}
