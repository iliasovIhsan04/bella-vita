import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={37}
    height={36}
    fill="none"
    {...props}
  >
    <Rect
      width={36}
      height={36}
      x={0.25}
      fill="#A864FF"
      fillOpacity={0.2}
      rx={18}
    />
    <Path
      stroke="#904BE8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.75 9h-4a1 1 0 0 0-1 1v4M14.75 27h-4a1 1 0 0 1-1-1v-4M22.75 27h4a1 1 0 0 0 1-1v-4M22.75 9h4a1 1 0 0 1 1 1v4M23.75 18h-10M20.25 14h-3M20.25 22h-3"
    />
  </Svg>
)
export default SvgComponent
