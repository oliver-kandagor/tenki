import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from '@expo/vector-icons';
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Platform } from "react-native";
// Removed Icon from gluestack

interface TabItem {
  name: string;
  label: string;
  path: string;
  iconName: React.ComponentProps<typeof Feather>['name'];
}

const tabItems: TabItem[] = [
  {
    name: "today",
    label: "Today",
    path: "today",
    iconName: "sun",
  },
  {
    name: "forecast",
    label: "Forecast",
    path: "forecast",
    iconName: "calendar",
  },
  {
    name: "alerts",
    label: "Alerts",
    path: "alerts",
    iconName: "bell",
  },
  {
    name: "trees",
    label: "Trees",
    path: "trees",
    iconName: "map-pin",
  },
  {
    name: "usage",
    label: "You",
    path: "usage",
    iconName: "user",
  },
  {
    name: "lab",
    label: "Lab",
    path: "lab",
    iconName: "terminal",
  },
];

function BottomTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <Box className="bg-background-0">
      <HStack
        className="bg-background-0 pt-4 px-7 rounded-t-3xl min-h-[78px]"
        style={{
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 16,
          boxShadow: "0px -10px 12px 0px rgba(0, 0, 0, 0.04)",
        }}
        space="md"
      >
        {tabItems.map((item) => {
          const isActive =
            props.state.routeNames[props.state.index] === item.path;
          return (
            <Pressable
              key={item.name}
              className="flex-1 items-center justify-center"
              onPress={() => {
                props.navigation.navigate(item.path);
              }}
            >
              <Feather 
                name={item.iconName} 
                size={24} 
                color={isActive ? "#4c1d95" : "#737373"} // text-primary-800 or background-500
              />
              <Text
                size="xs"
                className={`mt-1 font-medium ${
                  isActive ? "text-primary-800" : "text-background-500"
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
}

export default BottomTabBar;
