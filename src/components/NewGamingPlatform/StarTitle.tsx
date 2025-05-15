import * as React from "react";

interface StarTitleProps {
  title: string;
}

const StarTitle: React.FC<StarTitleProps> = ({ title }) => {
  return (
    <svg
      width="297"
      height="82"
      viewBox="0 0 297 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="star-title"
      role="img"
      aria-label={title}
    >
      <rect width="297" height="82" fill="#2C2B2A" />
      <text
        fill="white"
        xmlSpace="preserve"
        style={{ whiteSpace: "pre" }}
        fontFamily="Inter"
        fontSize="36"
        fontWeight="600"
        letterSpacing="-0.01em"
      >
        <tspan x="51.9" y="58.4545">
          Highest
        </tspan>
        <tspan x="196.334" y="58.4545">
          Rated
        </tspan>
      </text>
      <path
        d="M23 13L28.1638 33.384H44.8743L31.3552 45.982L36.5191 66.366L23 53.768L9.48094 66.366L14.6448 45.982L1.1257 33.384H17.8362L23 13Z"
        fill="#D9D9D9"
      />
    </svg>
  );
};

export default StarTitle;