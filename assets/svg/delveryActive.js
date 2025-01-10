import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path fill="#fff" fillOpacity={0.01} d="M22.5 3.5h-21v21h21v-21Z" />
      <Path
        stroke="#904BE8"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.125 3.5h-5.25A.875.875 0 0 0 3 4.375v5.25c0 .483.392.875.875.875h5.25A.875.875 0 0 0 10 9.625v-5.25a.875.875 0 0 0-.875-.875ZM9.125 14h-5.25a.875.875 0 0 0-.875.875v5.25c0 .483.392.875.875.875h5.25a.875.875 0 0 0 .875-.875v-5.25A.875.875 0 0 0 9.125 14ZM19.625 3.5h-5.25a.875.875 0 0 0-.875.875v5.25c0 .483.392.875.875.875h5.25a.875.875 0 0 0 .875-.875v-5.25a.875.875 0 0 0-.875-.875ZM19.625 14h-5.25a.875.875 0 0 0-.875.875v5.25c0 .483.392.875.875.875h5.25a.875.875 0 0 0 .875-.875v-5.25a.875.875 0 0 0-.875-.875Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .5h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
