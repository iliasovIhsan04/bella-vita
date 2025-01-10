import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M21.95 26.563H8.05c-4.975 0-6.488-1.5-6.488-6.425V9.861c0-4.925 1.513-6.425 6.488-6.425h13.887c4.976 0 6.488 1.5 6.488 6.426v10.262c.012 4.938-1.5 6.438-6.475 6.438Z"
    />
    <Path
      fill="#3F2560"
      d="M10 21.563H7.5a.944.944 0 0 1-.938-.938c0-.512.425-.938.938-.938H10c.512 0 .938.425.938.938a.944.944 0 0 1-.938.938ZM18.125 21.563h-5a.944.944 0 0 1-.938-.938c0-.512.426-.938.938-.938h5c.512 0 .938.425.938.938a.944.944 0 0 1-.938.938ZM28.438 11.563H1.563V9.687h26.875v1.876Z"
    />
  </Svg>
)
export default SvgComponent
