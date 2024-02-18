import React from "react";

function Check(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24">
			<circle
				cx="12"
				cy="12"
				r="10"
				stroke="inherit"
				strokeWidth="1.5"
			></circle>
			<path
				stroke="inherit"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M8.5 12.5l2 2 5-5"
			></path>
		</svg>
	);
}

export default Check;
