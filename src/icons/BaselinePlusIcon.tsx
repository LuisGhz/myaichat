import { SVGProps } from "react";

export function BaselinePlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
      ></path>
    </svg>
  );
}
