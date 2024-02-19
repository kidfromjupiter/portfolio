import React from "react";

function RightArrow(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24">
			<path
				stroke="inherit"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M6 12h12m0 0l-5-5m5 5l-5 5"
			></path>
		</svg>
	);
}

export default RightArrow;
