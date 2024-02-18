import * as React from "react"

type Svg = {
    size?: number;
    fill?: string;
    className?: string;
}
const DownArrow = ({ size = 30, fill = 'black', className }: Svg) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 24"
        className={className}
    >
        <path
            fill={fill}
            fillRule="evenodd"
            d="M12 3a1 1 0 0 1 1 1v13.586l5.293-5.293a1 1 0 0 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 1 1 1.414-1.414L11 17.586V4a1 1 0 0 1 1-1Z"
            clipRule="evenodd"
        />
    </svg>
)
export default DownArrow
