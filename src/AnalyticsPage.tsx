import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Paper, Stack } from "@mui/material";
import dayjs from "dayjs";
import { Header } from "./Header";

interface SoundMoodHistory {
  created_at: string;
  user_name: string;
  noise_level: number;
  mood_rating: number;
}

interface AnalyticsData {
  average_noise_level: number;
  average_mood_rating: number;
  sound_mood_history: SoundMoodHistory[];
}

const AnalyticsPage = () => {
  const { user_name } = useParams<{ user_name: string }>();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          "http://54.158.71.182:8080/api/analytics",
          { params: { user_name } }
        );
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, [user_name]);

  if (!analytics) {
    return <Typography>Loading analytics...</Typography>;
  }

  const columns = [
    { field: "created_at", headerName: "Date", width: 180 },
    { field: "noise_level", headerName: "Sound Level (dB)", width: 150 },
    { field: "mood_rating", headerName: "Mood Rating", width: 150 },
  ];

  const timeLabels = analytics.sound_mood_history.map((record) =>
    dayjs(record.created_at).format("HH:mm:ss")
  );
  const soundLevels = analytics.sound_mood_history.map(
    (record) => record.noise_level
  );
  const moodLevels = analytics.sound_mood_history.map(
    (record) => record.mood_rating
  );

  return (
    <>
      <Header username={user_name || ""} />
      <Box
        component="main"
        sx={{ alignItems: "center", justifyContent: "center", display: "flex" }}
      >
        <Stack
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            bgcolor: "#fafbfb",
          }}
        >
          <Typography variant="h2" color="#45515f" sx={{ paddingBottom: 3 }}>
            {user_name}
          </Typography>
          <Typography variant="h6" color="#45515f">
            Recent Noise Levels
          </Typography>
          <LineChart
            height={400}
            width={600}
            series={[{ data: soundLevels, label: "Sound Level" }]}
            xAxis={[{ scaleType: "band", data: timeLabels }]}
          />
          <Typography variant="h6" color="#45515f">
            Recent Mood Ratings
          </Typography>
          <LineChart
            colors={["#f44336"]}
            height={400}
            width={600}
            series={[{ data: moodLevels, label: "Mood Rating" }]}
            xAxis={[{ scaleType: "band", data: timeLabels }]}
          />
          <Stack spacing={2} direction="row" sx={{ marginBottom: 3 }}>
            <Paper sx={{ padding: 2, bgcolor: "white" }}>
              <Typography variant="h6" color="#45515f">
                Average Sound Level
              </Typography>
              <Typography>{analytics.average_noise_level} dB</Typography>
            </Paper>
            <Paper sx={{ padding: 2, bgcolor: "white" }}>
              <Typography variant="h6" color="#45515f">
                Average Mood Rating
              </Typography>
              <Typography>{analytics.average_mood_rating}</Typography>
            </Paper>
          </Stack>
          <Paper
            sx={{
              padding: 2,
              marginBottom: 3,
              bgcolor: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" color="#45515f" gutterBottom>
              Sound Level and Mood History{" "}
            </Typography>
            <DataGrid
              rows={analytics.sound_mood_history}
              columns={columns}
              getRowId={(row) => row.created_at}
            />
          </Paper>
        </Stack>
      </Box>
    </>
  );
};

export default AnalyticsPage;
