import React, { useContext } from "react";
import { Calendar } from "react-native-calendars";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { remapProps } from "nativewind";
import { ThemeContext } from "@/contexts/theme-context";

interface IMonthlyCalendar {
  daily: any[];
  getWeatherImage: (cond?: any, code?: number) => any;
}

const MonthlyCalendar = ({ daily, getWeatherImage }: IMonthlyCalendar) => {
  const { colorMode }: any = useContext(ThemeContext);
  remapProps(Calendar, {
    className: "style",
  });

  const CustomDayComponent = ({ date, state }: any) => {
    const forecast = daily?.find((d) => {
      const dateStr = d.date ?? d.datetime;
      return dateStr && dateStr.startsWith(date.dateString);
    });

    const isToday = state === "today";
    const hasData = !!forecast;

    return (
      <Box
        className={`w-10 h-10 items-center justify-center relative ${
          isToday ? "bg-primary-600 rounded-lg" : ""
        }`}
      >
        <Text
          className={` ${
            isToday ? "text-typography-0" : "text-typography-900"
          } ${state === "disabled" ? "text-typography-400 opacity-50" : ""}`}
        >
          {date.day}
        </Text>
        {hasData && (
          <Image
            source={getWeatherImage(forecast.condition ?? forecast.description, forecast.weather_code)}
            alt="weather icon"
            size="none"
            className="absolute -bottom-1 -right-1 w-4 h-4"
            resizeMode="contain"
          />
        )}
      </Box>
    );
  };

  return (
    <Calendar
      className="rounded-2xl mx-5 mb-5 p-2 bg-background-100"
      dayComponent={CustomDayComponent}
      headerStyle={{
        gap: 12,
      }}
      hideExtraDays={true}
      enableSwipeMonths={true}
      theme={{
        calendarBackground: colorMode === "dark" ? "#121212" : "#F1EBFF",
        textSectionTitleColor: colorMode === "dark" ? "#F5F5F5" : "#9eaab7", //weeks color
        arrowColor: colorMode === "dark" ? "#F2F1F1" : "#414040", //arrow color
        monthTextColor: colorMode === "dark" ? "#F5F5F5" : "#262627", //month text color
        textMonthFontWeight: "bold", //month font weight
        textDayHeaderFontSize: 15, //weeks font size
      }}
    />
  );
};

export default MonthlyCalendar;
