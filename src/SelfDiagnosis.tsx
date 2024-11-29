import {
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

type SelfDiagnosisProps = {
  username: string;
  dbLevel: number;
};

export const SelfDiagnosis = ({ dbLevel, username }: SelfDiagnosisProps) => {
  const [open, setOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState<string>("");

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleOnClick = async (mood: number) => {
    try {
      const response = await axios.post(
        "http://54.158.71.182:8080/record_event",
        {
          user_name: username,
          noise_level: Math.round(dbLevel),
          created_at: new Date().toISOString(),
          mood_rating: mood,
        }
      );

      if (response.status !== 200) {
        setSnackbarText("Self diagnosis failed");
      } else {
        setSnackbarText("Self diagnosis submitted");
      }
      setOpen(true);
    } catch (error) {
      setSnackbarText("Self diagnosis failed");
    }
  };
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 12 }}>
        <Stack
          sx={{
            justifyContent: "center",
            width: "50%",
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Self Diagnosis
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              gap: 2,
            }}
          >
            <IconButton onClick={() => handleOnClick(4)} disabled={open}>
              <SentimentVerySatisfied
                sx={{ fontSize: 50, color: "darkgreen" }}
              />
            </IconButton>
            <IconButton onClick={() => handleOnClick(3)} disabled={open}>
              <SentimentSatisfied sx={{ fontSize: 50, color: "green" }} />
            </IconButton>
            <IconButton onClick={() => handleOnClick(2)} disabled={open}>
              <SentimentNeutral sx={{ fontSize: 50, color: "yellowgreen" }} />
            </IconButton>
            <IconButton onClick={() => handleOnClick(1)} disabled={open}>
              <SentimentDissatisfied sx={{ fontSize: 50, color: "orange" }} />
            </IconButton>
            <IconButton onClick={() => handleOnClick(0)} disabled={open}>
              <SentimentVeryDissatisfied sx={{ fontSize: 50, color: "red" }} />
            </IconButton>
          </Box>
        </Stack>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        message={snackbarText}
      />
    </>
  );
};
