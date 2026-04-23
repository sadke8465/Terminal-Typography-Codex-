import React from "react";
import { Box, ScrollView, Text } from "@orchetron/storm";

export interface StageProps {
  rows: string[];
}

export default function Stage({ rows }: StageProps) {
  return (
    <Box flexDirection="column">
      <ScrollView>
        {rows.map((row, index) => (
          <Text key={`row-${index}`}>{row}</Text>
        ))}
      </ScrollView>
    </Box>
  );
}
