import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Icon, SearchIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { ImageBackground } from "@/components/ui/image-background";
import { Image } from "@/components/ui/image";
import { ThemeContext } from "@/contexts/theme-context";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image as RNImage } from "react-native";
import { getWeatherImage } from '@/utils/getWeatherImage';

const AnimatedImage = Animated.createAnimatedComponent(RNImage);

type HeaderProps = {
  height?: any;
  weatherCondition?: string;
  weatherCode?: number;
};

const Header = ({ height, weatherCondition, weatherCode }: HeaderProps) => {
  const { colorMode }: any = useContext(ThemeContext);

  const getBackgroundImage = () => {
    // Return the designated hero image for the home screen
    return require("@/assets/images/hero/home-bg.png");
  };



  const insets = useSafeAreaInsets();
  const MAX_HEIGHT = 340 + insets.top;
  const MIN_HEIGHT = 140 + insets.top;

  const shadowStyle = {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  };

  const locationTextStyle = useAnimatedStyle(() => {
    const h = (height as any).value ?? height;
    return {
      fontSize: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [20, 16], "clamp"),
    };
  });

  const dateTextStyle = useAnimatedStyle(() => {
    const h = (height as any).value ?? height;
    return {
      fontSize: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [16, 14], "clamp"),
    };
  });

  const temperatureTextStyle = useAnimatedStyle(() => {
    const h = (height as any).value ?? height;
    return {
      fontSize: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [112, 40], "clamp"),
      marginLeft: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [0, 15], "clamp"),
    };
  });

  const feelsLikeTextStyle = useAnimatedStyle(() => {
    const h = (height as any).value ?? height;
    return {
      fontSize: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [18, 14], "clamp"),
    };
  });

  const weatherTextStyle = useAnimatedStyle(() => {
    const h = (height as any).value ?? height;
    return {
      fontSize: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [20, 14], "clamp"),
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const h = (height as any).value ?? height;
    return {
      width: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [124, 56], "clamp"),
      height: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [112, 50], "clamp"),
      marginTop: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [6, 0], "clamp"),
    };
  });

  return (
    <Box className="bg-background-0 rounded-b-3xl overflow-hidden flex-1">
      <ImageBackground
        source={getBackgroundImage()}
        className="h-full w-full"
        imageStyle={{ resizeMode: "cover" }}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
        <Animated.View
          style={[
            {
              margin: 20,
              display: "flex",
              flex: 1,
              flexDirection: "column",
            },
            useAnimatedStyle(() => {
              const h = (height as any).value ?? height;
              return {
                marginTop: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [insets.top + 20, insets.top + 10], "clamp"),
              };
            }),
          ]}
        >
          <HStack className="justify-between">
            <VStack className="gap-2">
              <Animated.Text
                style={[
                  {
                    fontFamily: "dm-sans-bold",
                    color: colorMode === "dark" ? "#FFFFFF" : "#FFFFFF",
                    fontWeight: "800",
                    ...shadowStyle
                  },
                  locationTextStyle,
                ]}
              >
                Bengaluru, India
              </Animated.Text>
              <Animated.Text
                style={[
                  {
                    fontFamily: "dm-sans-medium",
                    color: colorMode === "dark" ? "#FAFAFA" : "#FAFAFA",
                    fontWeight: "600",
                    ...shadowStyle
                  },
                  dateTextStyle,
                ]}
              >
                January 18, 16:14
              </Animated.Text>
            </VStack>
            <Animated.View
              style={[
                useAnimatedStyle(() => {
                  const h = (height as any).value ?? height;
                  return {
                    opacity: interpolate(h, [MAX_HEIGHT, MAX_HEIGHT - 100], [1, 0], "clamp"),
                  };
                }),
              ]}
            >
              <Icon as={SearchIcon} size="xl" className="text-background-700" />
            </Animated.View>
          </HStack>

          <Animated.View
            style={[
              {
                justifyContent: "space-between",
                position: "absolute",
              },
              useAnimatedStyle(() => {
                const h = (height as any).value ?? height;
                return {
                  left: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [0, 170], "clamp"),
                  bottom: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [0, -5], "clamp"),
                };
              }),
            ]}
          >
            <Animated.Text
              style={[
                {
                  fontFamily: "dm-sans-bold",
                  color: "#FF1493", // Deeper pink for better contrast
                  fontWeight: "800",
                  ...shadowStyle
                },
                temperatureTextStyle,
              ]}
            >
              13°
            </Animated.Text>
            <Animated.Text
              style={[
                {
                  fontFamily: "dm-sans-medium",
                  color: colorMode === "dark" ? "#FFFFFF" : "#FFFFFF",
                  fontWeight: "700",
                  ...shadowStyle
                },
                feelsLikeTextStyle,
              ]}
            >
              Feels like 12°
            </Animated.Text>
          </Animated.View>

          <Animated.View
            style={[
              {
                justifyContent: "space-between",
                alignItems: "center",
                position: "absolute",
                right: 0,
              },
              useAnimatedStyle(() => {
                const h = (height as any).value ?? height;
                return {
                  bottom: interpolate(h, [MAX_HEIGHT, MIN_HEIGHT], [10, -5], "clamp"),
                };
              }),
            ]}
          >
            <AnimatedImage 
              source={getWeatherImage(weatherCondition, weatherCode)}
              style={imageStyle}
              resizeMode="contain"
            />
            <Animated.Text
              style={[
                {
                  fontFamily: "dm-sans-bold",
                  color: "#FF1493", // Deeper pink for better contrast
                  fontWeight: "800",
                  ...shadowStyle
                },
                weatherTextStyle,
              ]}
            >
              {typeof weatherCondition === 'string' ? weatherCondition : ((weatherCondition as any)?.text ?? "Thunderstorm")}
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </ImageBackground>
    </Box>
  );
};

export default Header;
