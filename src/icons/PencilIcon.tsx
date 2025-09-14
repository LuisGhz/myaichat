import { SVGProps } from "react";

export function Pencil(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      {...props}
    >
      <mask id="ipSPencil0">
        <g fill="none">
          <g
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            clipPath="url(#ipSPencil1)"
          >
            <path d="m31 8.999l8 8m-31 15L36 4l8 7.999l-28 28l-10 2l2-10Zm23-23l8 8m-30 15l7 7m-3-4l22-22"></path>
          </g>
          <defs>
            <clipPath id="ipSPencil1">
              <path fill="#000" d="M0 0h48v48H0z"></path>
            </clipPath>
          </defs>
        </g>
      </mask>
      <path
        fill="currentColor"
        d="M0 0h48v48H0z"
        mask="url(#ipSPencil0)"
      ></path>
    </svg>
  );
}
