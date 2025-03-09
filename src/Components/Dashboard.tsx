import {
  Grid,
  Card,
  Text,
  Title,
  Group,
  Container,
  TextInput,
  Flex,
  Loader,
  Paper,
  ActionIcon,
  Box,
  ThemeIcon,
  Divider,
  Badge,
  useMantineTheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { PiThermometerBold } from "react-icons/pi";
import { TbCloudStorm } from "react-icons/tb";
import { WiCloudy } from "react-icons/wi";
import { FiCloudSnow } from "react-icons/fi";
import { FiCloudRain } from "react-icons/fi";
import { WiMoonrise } from "react-icons/wi";
import { WiMoonset } from "react-icons/wi";
import { WiSunrise } from "react-icons/wi";
import { WiSunset } from "react-icons/wi";
import { AiOutlineSun } from "react-icons/ai";
import { FaWind } from "react-icons/fa";
import { BsDropletHalf } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import { TbGauge } from "react-icons/tb";

// Weather code mapping based on Tomorrow.io codes
const getWeatherCondition = (code: number): string => {
  const weatherCodes: Record<number, string> = {
    0: "Unknown",
    1000: "Clear, Sunny",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm",
  };

  return weatherCodes[code] || "Unknown";
};

// Get appropriate weather icon based on weather code
const getWeatherIcon = (code: number) => {
  if (code >= 1000 && code < 1100) return <AiOutlineSun size={32} />;
  if (code >= 1100 && code < 2000) return <WiCloudy size={32} />;
  if (code >= 4000 && code < 5000) return <FiCloudRain size={32} />;
  if (code >= 5000 && code < 6000) return <FiCloudSnow size={32} />;
  if (code >= 8000) return <TbCloudStorm size={32} />;
  return <AiOutlineSun size={32} />;
};

// Format date string
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
};

// Format time string
const formatTime = (timeString: string | undefined): string => {
  if (!timeString) return "N/A";
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const Dashboard = () => {
  const theme = useMantineTheme();
  const [searchQuery, setSearchQuery] = useState<string>("ahmedabad");
  const [location, setLocation] = useState<string | null>(null);
  const [dailyData, setDailyData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const url = `https://api.tomorrow.io/v4/weather/forecast?location=${searchQuery}&apikey=${
    import.meta.env.VITE_API_KEY
  }`;

  const queryFunc = async () => {
    const response = await axios.get(url);

    if (response.status === 200) {
      setLocation(response?.data?.location?.name || searchQuery);
      if (
        response?.data?.timelines?.daily &&
        response?.data?.timelines?.daily.length > 0
      ) {
        setDailyData(response.data.timelines.daily[0]);
        setForecastData(response.data.timelines.daily.slice(0, 5)); // Get next 5 days
      }
    }
    return response.data;
  };

  const { isLoading, isError, error, refetch } = useQuery({
    queryKey: ["DailyWeather", searchQuery],
    queryFn: queryFunc,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    refetch();
  };

  const getTempColor = (temp: number) => {
    if (temp < 0) return "#9CC0FF";
    if (temp < 10) return "#73B3F3";
    if (temp < 20) return "#B2F35B";
    if (temp < 30) return "#FFC93C";
    return "#FF6B45";
  };

  if (isLoading) {
    return (
      <Container style={{ width: "100%", padding: "0" }}>
        <Flex justify="center" align="center" style={{ height: "100vh" }}>
          <Loader color="blue" size="xl" variant="dots" />
        </Flex>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container style={{ width: "100%", padding: "2rem" }}>
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Flex direction="column" align="center" gap="md">
            <Text color="red" size="xl" fw={600}>
              Error loading weather data
            </Text>
            <Text color="dimmed" size="sm">
              {(error as Error).message}
            </Text>
            <ActionIcon
              color="blue"
              size="lg"
              radius="xl"
              variant="filled"
              onClick={() => refetch()}
            >
              {/* <Search size={18} /> */}
            </ActionIcon>
          </Flex>
        </Paper>
      </Container>
    );
  }

  const weatherDetails = [
    {
      icon: <FaWind size={24} color={theme.colors.blue[5]} />,
      label: "Wind",
      value: `${dailyData?.values?.windSpeedAvg?.toFixed(1)} km/h`,
    },
    {
      icon: <BsDropletHalf size={24} color={theme.colors.cyan[5]} />,
      label: "Humidity",
      value: `${dailyData?.values?.humidityAvg?.toFixed(0)}%`,
    },
    {
      icon: <TbGauge size={24} color={theme.colors.violet[5]} />,
      label: "Pressure",
      value: `${dailyData?.values?.pressureSeaLevelAvg?.toFixed(0)} hPa`,
    },
    {
      icon: <FaRegEye size={24} color={theme.colors.teal[5]} />,
      label: "Visibility",
      value: `${dailyData?.values?.visibilityAvg?.toFixed(1)} km`,
    },
    {
      icon: <WiSunrise size={24} color={theme.colors.orange[5]} />,
      label: "Sunrise",
      value: formatTime(dailyData?.values?.sunriseTime),
    },
    {
      icon: <WiSunset size={24} color={theme.colors.indigo[5]} />,
      label: "Sunset",
      value: formatTime(dailyData?.values?.sunsetTime),
    },
    {
      icon: <WiCloudy size={24} color={theme.colors.gray[5]} />,
      label: "Cloud Cover",
      value: `${dailyData?.values?.cloudCoverAvg?.toFixed(0)}%`,
    },
    {
      icon: <AiOutlineSun size={20} color={theme.colors.yellow[5]} />,
      label: "UV Index",
      value: `${dailyData?.values?.uvIndexMax?.toFixed(0)}`,
    },
    {
      icon: <WiMoonrise size={24} color={theme.colors.blue[5]} />,
      label: "Moonrise",
      value: formatTime(dailyData?.values?.moonriseTime),
    },
    {
      icon: <WiMoonset size={24} color={theme.colors.blue[5]} />,
      label: "Moonset",
      value: formatTime(dailyData?.values?.moonsetTime),
    },
  ];

  return (
    <Container
      fluid
      px={{ base: "md", sm: "xl" }}
      py="xl"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Container size="lg" px={0}>
        <Paper
          shadow="sm"
          radius="lg"
          p="md"
          mb="lg"
          style={{ background: "rgba(255, 255, 255, 0.9)" }}
        >
          <form onSubmit={handleSearchSubmit}>
            <Flex align="center">
              <TextInput
                value={searchQuery}
                onChange={handleSearchChange}
                // onFocus={() => setIsSearchFocused(true)}
                // onBlur={() => setIsSearchFocused(false)}
                placeholder="Search location..."
                radius="xl"
                size="md"
                style={{
                  flex: 1,
                  outline: "2px",
                  transition: "all 0.3s ease",
                  // transform: isSearchFocused ? "scale(1.01)" : "scale(1)",
                }}
              />
            </Flex>
          </form>
        </Paper>

        <Grid gutter="lg">
          {/* Today Overview */}
          <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
            <Paper
              shadow="md"
              radius="lg"
              p="xl"
              style={{
                background: "linear-gradient(135deg, #6facff 0%, #3f73ff 100%)",
                color: "white",
              }}
            >
              <Flex direction="column" gap="md">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text size="xl" fw={700} tt="capitalize">
                      {location}
                    </Text>
                    <Text size="md" fw={700} opacity={0.8}>
                      {dailyData ? formatDate(dailyData.time) : ""}
                    </Text>
                  </Box>
                  <ThemeIcon
                    size={56}
                    radius="xl"
                    variant="light"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  >
                    {dailyData?.values?.weatherCodeMax ? (
                      getWeatherIcon(dailyData.values.weatherCodeMax)
                    ) : (
                      <AiOutlineSun size={32} />
                    )}
                  </ThemeIcon>
                </Flex>

                <Flex direction="column" align="flex-start" mt="lg">
                  <Text
                    size="lg"
                    fw={700}
                    lh={1}
                    style={{ fontSize: "3.5rem" }}
                  >
                    {dailyData?.values?.temperatureAvg?.toFixed(0)}°
                  </Text>
                  <Text size="lg" mt="xs">
                    {dailyData?.values?.weatherCodeMax
                      ? getWeatherCondition(dailyData.values.weatherCodeMax)
                      : ""}
                  </Text>
                  <Group gap="xs" mt="md">
                    <Badge color="blue" size="lg" radius="sm" variant="filled">
                      <Group gap={4}>
                        <PiThermometerBold size={14} />
                        <Text>
                          {dailyData?.values?.temperatureMin?.toFixed(0)}° /{" "}
                          {dailyData?.values?.temperatureMax?.toFixed(0)}°
                        </Text>
                      </Group>
                    </Badge>
                    <Badge color="cyan" size="lg" radius="sm" variant="filled">
                      <Group gap={4}>
                        <BsDropletHalf size={14} />
                        <Text>
                          {dailyData?.values?.precipitationProbabilityAvg?.toFixed(
                            0
                          )}
                          %
                        </Text>
                      </Group>
                    </Badge>
                  </Group>
                </Flex>
              </Flex>
            </Paper>
          </Grid.Col>

          {/* Weather Details */}
          <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
            <Paper
              shadow="md"
              radius="lg"
              p="lg"
              style={{ height: "100%", background: "white" }}
            >
              <Title order={4} mb="md">
                Weather Details
              </Title>
              <Grid>
                {weatherDetails.map((item, index) => (
                  <Grid.Col key={index} span={{ base: 6, xs: 4, sm: 3 }}>
                    <Paper
                      p="md"
                      radius="md"
                      style={{
                        background: "rgba(245, 247, 250, 0.7)",
                        height: "100%",
                      }}
                    >
                      <Flex direction="column" align="center" gap="xs">
                        {item.icon}
                        <Text size="xs" tt="uppercase" c="dimmed" mt={4}>
                          {item.label}
                        </Text>
                        <Text size="sm" fw={600}>
                          {item.value}
                        </Text>
                      </Flex>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
            </Paper>
          </Grid.Col>

          {/* Next 5 Days */}
          <Grid.Col span={12}>
            <Paper
              shadow="md"
              radius="lg"
              p="lg"
              style={{ background: "white" }}
            >
              <Title order={4} mb="md">
                5-Day Forecast
              </Title>
              <Grid gutter="md">
                {forecastData.map((day, index) => (
                  <Grid.Col
                    key={index}
                    span={{ base: 12, xs: 6, sm: 4, md: 2.4 }}
                  >
                    <Paper
                      p="md"
                      radius="md"
                      style={{
                        background:
                          index === 0
                            ? "linear-gradient(135deg, #f6d5f7 0%, #fbe9d7 100%)"
                            : "rgba(245, 247, 250, 0.7)",
                      }}
                    >
                      <Flex direction="column" align="center">
                        <Text fw={600}>{formatDate(day.time)}</Text>
                        <Box my="sm">
                          {day.values.precipitationProbabilityAvg > 20 ? (
                            <FiCloudRain size={36} color="#4299e1" />
                          ) : (
                            <AiOutlineSun size={36} color="#f6ad55" />
                          )}
                        </Box>
                        <Text
                          size="xl"
                          fw={700}
                          color={getTempColor(day.values.temperatureAvg)}
                        >
                          {day.values.temperatureAvg?.toFixed(0)}°
                        </Text>
                        <Divider my="xs" style={{ width: "80%" }} />
                        <Group justify="center" gap="xs">
                          <Text size="sm" color="dimmed">
                            {day.values.temperatureMin?.toFixed(0)}°
                          </Text>
                          <Text size="sm" fw={600}>
                            /
                          </Text>
                          <Text size="sm">
                            {day.values.temperatureMax?.toFixed(0)}°
                          </Text>
                        </Group>
                        <Badge
                          mt="xs"
                          color={
                            day.values.precipitationProbabilityAvg > 50
                              ? "blue"
                              : "gray"
                          }
                          radius="sm"
                        >
                          <Group gap={4}>
                            <BsDropletHalf size={10} />
                            <Text size="xs">
                              {day.values.precipitationProbabilityAvg?.toFixed(
                                0
                              )}
                              %
                            </Text>
                          </Group>
                        </Badge>
                      </Flex>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Container>
  );
};

export default Dashboard;
