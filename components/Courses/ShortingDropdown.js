import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ShortingDropdown = () => {
	const [short, setShort] = useState("");
	const router = useRouter();

	useEffect(() => {
		const query = router.query;
		router.push({
			pathname: "/courses",
			query: { ...query, short: short },
		});
	}, [short]);

	return (
		<div className="elearniv-grid-sorting row align-items-center mb-5">
			
		</div>
	);
};

export default ShortingDropdown;
