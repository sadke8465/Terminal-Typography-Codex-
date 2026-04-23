import React from "react";
import { Box, Text } from "@orchetron/storm";

export interface FontSelectorProps {
  value: string;
}

export default function FontSelector({ value }: FontSelectorProps) {
  return (
    <Box>
      <Text>Font: {value} (options: cybermedium)</Text>
    </Box>
  );
}
