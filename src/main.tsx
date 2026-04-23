import React from "react";
import { Box } from "@orchetron/storm";
import Stage from "./ui/canvas/Stage";
import ControlPanel from "./ui/controls/ControlPanel";

export interface MainViewProps {
  frameRows: string[];
  state: {
    text: string;
    font: string;
    preset: string;
    glyphSet: string;
  };
}

export default function MainView({ frameRows, state }: MainViewProps) {
  return (
    <Box flexDirection="column" height="100%">
      <Box flexGrow={1}>
        <Stage rows={frameRows} />
      </Box>
      <Box>
        <ControlPanel text={state.text} font={state.font} preset={state.preset} glyphSet={state.glyphSet} />
      </Box>
    </Box>
  );
}
