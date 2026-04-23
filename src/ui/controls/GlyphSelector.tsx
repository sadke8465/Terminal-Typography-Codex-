import React from "react";
import { Box, Text } from "@orchetron/storm";

export interface GlyphSelectorProps {
  value: string;
}

export default function GlyphSelector({ value }: GlyphSelectorProps) {
  return (
    <Box>
      <Text>Glyph set: {value} (solid_block, cyber_matrix, architectural, braille)</Text>
    </Box>
  );
}
