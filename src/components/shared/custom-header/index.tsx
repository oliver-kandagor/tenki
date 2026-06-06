import React, { useContext } from "react";
import { HStack } from "@/components/ui/hstack";
import { SearchIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { ImageBackground } from "@/components/ui/image-background";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Mic } from "lucide-react-native";
import { ThemeContext } from "@/contexts/theme-context";

const CustomHeader = ({
  variant = "general",
  title,
  label,
  weatherCondition,
  locationName = "Bengaluru, India",
  temperature,
  feelsLike,
  conditionText,
  conditionIconUrl,
}: {
  variant: "general" | "search";
  title?: string;
  label?: string;
  weatherCondition?: string;
  locationName?: string;
  temperature?: number;
  feelsLike?: number;
  conditionText?: string;
  conditionIconUrl?: any;
}) => {
  const { colorMode }: any = useContext(ThemeContext);

  const getBackgroundImage = () => {
    const cond = weatherCondition?.toLowerCase() ?? '';
    if (cond.includes('clear') || cond.includes('sun') || cond.includes('sunny')) {
      return colorMode === "dark" ? require("@/assets/images/weather-bg-dark.webp") : require("@/assets/images/weather-bg-light.webp");
    }
    if (cond.includes('night') || cond.includes('dark')) {
      return require("@/assets/images/tabIcons/weather/night.jpeg");
    }
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) {
      return require("@/assets/images/tabIcons/weather/rain.jpeg");
    }
    if (cond.includes('cloud') || cond.includes('overcast')) {
      return require("@/assets/images/tabIcons/weather/cloudy.jpeg");
    }
    if (cond.includes('snow') || cond.includes('sleet') || cond.includes('ice') || cond.includes('freezing')) {
      return require("@/assets/images/tabIcons/weather/snow.jpeg");
    }
    if (cond.includes('thunder') || cond.includes('storm')) {
      return require("@/assets/images/tabIcons/weather/thunderstorm.jpeg");
    }
    return colorMode === "dark" ? require("@/assets/images/weather-bg-dark.webp") : require("@/assets/images/weather-bg-light.webp");
  };

  return (
    <Box className="bg-background-0 rounded-b-3xl overflow-hidden mb-3">
      <ImageBackground
        source={getBackgroundImage()}
      >
        <HStack className="p-5 pt-16 gap-6 justify-between">
          <HStack className="justify-between flex-1">
            <VStack className="gap-2.5 justify-between">
              <Text className="text-background-700 font-dm-sans-bold text-3xl">
                {title}
              </Text>
              <Text className="text-background-700 font-dm-sans-medium text-lg" numberOfLines={1}>
                {locationName}
              </Text>
            </VStack>
          </HStack>
          
          {(temperature !== undefined || conditionText) && (
            <HStack className="gap-4">
              <VStack className="justify-end items-center">
                <Text className="text-typography-800 font-dm-sans-regular text-4xl mt-2">
                  {temperature ?? "--"}°
                </Text>
                {feelsLike !== undefined && (
                  <Text className="text-typography-800 font-dm-sans-medium text-xs">
                    Feels like {feelsLike}°
                  </Text>
                )}
              </VStack>

              <VStack className="justify-end items-center w-16">
                <Image
                  source={conditionIconUrl || require("@/assets/images/sun.png")}
                  alt="weather condition"
                  resizeMode="contain"
                  className="h-10 w-10"
                />
                <Text className="text-background-700 text-center" size="xs" numberOfLines={1}>
                  {conditionText || "Clear"}
                </Text>
              </VStack>
            </HStack>
          )}
        </HStack>
        {variant === "search" && (
          <Input
            variant="outline"
            className="border-0 bg-background-50 rounded-xl py-1 px-4 mt-2 mb-5 mx-5"
            size="lg"
          >
            <InputSlot>
              <InputIcon as={SearchIcon} className="text-outline-200" />
            </InputSlot>
            <InputField
              placeholder={label}
              className="placeholder:text-typography-200"
            />
            <InputSlot>
              <InputIcon as={Mic} className="text-outline-200" />
            </InputSlot>
          </Input>
        )}
      </ImageBackground>
    </Box>
  );
};

export default CustomHeader;
