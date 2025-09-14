import { SVGProps } from "react";

export function MenuFoldRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path strokeDasharray="16" strokeDashoffset="16" d="M5 5h14">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.2s"
            values="16;0"
          ></animate>
        </path>
        <path strokeDasharray="10" strokeDashoffset="10" d="M5 12h9">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.2s"
            dur="0.2s"
            values="10;0"
          ></animate>
        </path>
        <path strokeDasharray="16" strokeDashoffset="16" d="M5 19h14">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.4s"
            dur="0.2s"
            values="16;0"
          ></animate>
        </path>
        <path strokeDasharray="10" strokeDashoffset="10" d="M17 9l3 3l-3 3">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.6s"
            dur="0.2s"
            values="10;0"
          ></animate>
        </path>
      </g>
    </svg>
  )
}
