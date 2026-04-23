import React from "react";
import { Box, Text } from "@orchetron/storm";
import FontSelector from "./FontSelector";
import PresetSelector from "./PresetSelector";
import GlyphSelector from "./GlyphSelector";

export interface ControlPanelProps {
  text: string;
  font: string;
  preset: string;
  glyphSet: string;
  children?: React.ReactNode;
}

export default function ControlPanel({ text, font, preset, glyphSet, children }: ControlPanelProps) {
  return (
    <Box flexDirection="column">
      <Text>Preview text: {text.slice(0, 64)}</Text>
      <FontSelector value={font} />
      <PresetSelector value={preset} />
      <GlyphSelector value={glyphSet} />
      {children}
      <Text>[Export animation.json]</Text>
    </Box>
  );
}
