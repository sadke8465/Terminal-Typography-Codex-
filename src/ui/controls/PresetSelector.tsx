import React from "react";
import { Box, Text } from "@orchetron/storm";

export interface PresetSelectorProps {
  value: string;
}

export default function PresetSelector({ value }: PresetSelectorProps) {
  return (
    <Box>
      <Text>Preset: {value} (sheen, wave, swipe)</Text>
    </Box>
  );
}
