import React from "react";
import { Box, Text } from "@orchetron/storm";

export interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export default function ParameterSlider({ label, value, min, max, step }: ParameterSliderProps) {
  return (
    <Box>
      <Text>
        {label}: {value} (min {min}, max {max}, step {step})
      </Text>
    </Box>
  );
}
