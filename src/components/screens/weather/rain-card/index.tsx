import React, { useContext, useEffect } from "react";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface IRainCard {
  time: number | string;
  value: number;
}

const RainCard = ({ time, value }: IRainCard) => {
  const AnimatedProgressFilledTrack =
    Animated.createAnimatedComponent(ProgressFilledTrack);
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = withTiming(value, { duration: 500 });
  }, [value]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value}%`,
    };
  });

  return (
    <HStack className="justify-between items-center gap-2">
      <Text className="text-typography-300 font-dm-sans-regular w-12" size="sm">
        {time}
      </Text>

      <Box className="flex-1">
        <Progress
          value={value}
          className="w-full h-6 bg-background-200"
        >
          <AnimatedProgressFilledTrack
            className="h-6 bg-secondary-400"
            style={progressStyle}
          />
        </Progress>
      </Box>

      <Text className="text-typography-900 font-dm-sans-regular" size="sm">
        {value}%
      </Text>
    </HStack>
  );
};

export default RainCard;
