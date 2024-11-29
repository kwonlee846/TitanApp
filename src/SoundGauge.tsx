import { useEffect, useRef, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { Stack, Typography } from "@mui/material";

type SoundGaugeProps = {
  dbLevel: number;
  setDbLevel: (dbLevel: number) => void;
};

export const SoundGauge = ({ dbLevel, setDbLevel }: SoundGaugeProps) => {
  const MAX_HISTORY = 600;
  const [dbHistory, setDbHistory] = useState<number[]>([]);
  const chartRef = useRef<ChartJSOrUndefined<"line", number[], number>>(null);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let scriptProcessor: ScriptProcessorNode;

    const handleSuccess = (stream: MediaStream) => {
      audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.fftSize = 512;
      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      let lastUpdateTime = Date.now();

      scriptProcessor.onaudioprocess = () => {
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime >= 10) {
          lastUpdateTime = currentTime;

          const buffer = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(buffer);

          let sumSquares = 0;
          for (let i = 0; i < buffer.length; i++) {
            const normalized = buffer[i] / 128 - 1; // -1 ~ 1
            sumSquares += normalized * normalized;
          }
          const rms = Math.sqrt(sumSquares / buffer.length);

          const ref = 0.00002; // 20 μPa
          const db = 20 * Math.log10(rms / ref);
          const clampedDb = Math.max(db, 0);

          setDbLevel(clampedDb);
          setDbHistory((prev) => {
            const newHistory = [...prev, clampedDb];
            if (newHistory.length > MAX_HISTORY) {
              newHistory.shift();
            }
            return newHistory;
          });
        }
      };
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(handleSuccess)
      .catch((err) => {
        console.error("Error accessing microphone: ", err);
      });

    return () => {
      if (scriptProcessor) scriptProcessor.disconnect();
      if (analyser) analyser.disconnect();
      if (microphone) microphone.disconnect();
      if (audioContext) audioContext.close();
    };
  }, []);

  const graphData = {
    labels: dbHistory.map((_, index) => index + 1),
    datasets: [
      {
        label: "dB Level",
        data: dbHistory,
        fill: false,
        borderColor: "steelblue",
        tension: 0.6,
        pointRadius: 0,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "dB",
        },
        suggestedMin: 0,
        suggestedMax: 120,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        mt: 3,
        gap: 4,
      }}
    >
      <Stack
        sx={{
          textAlign: "center",
          gap: 3,
          width: "600px",
          border: "1px solid",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5">Sound Level Meter</Typography>
        <Stack
          sx={{
            width: "100%",
            height: "200px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ReactSpeedometer
            maxValue={120} // dB range
            value={dbLevel}
            segments={10}
            needleColor="steelblue"
            startColor="green"
            endColor="red"
            textColor="black"
            currentValueText={`${dbLevel.toFixed(2)} dB`}
            height={200}
            width={300}
          />
        </Stack>
      </Stack>

      <Stack
        sx={{
          textAlign: "center",
          gap: 3,
          width: "600px",
          height: "350px",
          border: "1px solid",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5">dB Level History</Typography>
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            width: "100%",
          }}
        >
          <Line
            data={graphData}
            ref={chartRef}
            options={graphOptions}
            height={300}
            width={600}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
