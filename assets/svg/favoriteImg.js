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
      x={0.75}
      fill="#A864FF"
      fillOpacity={0.2}
      rx={18}
    />
    <Path
      stroke="#904BE8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19.25 13.694c-2-4.694-9-4.194-9 1.806s9 11 9 11 9-5 9-11-7-6.5-9-1.806Z"
    />
  </Svg>
)
export default SvgComponent
