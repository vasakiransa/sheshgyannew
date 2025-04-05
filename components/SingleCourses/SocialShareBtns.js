import React from "react";
import { useRouter } from "next/router";
import baseUrl from "@/utils/baseUrl";

const SocialShareBtns = () => {
	const router = useRouter();
	const { slug } = router.query;
	return (
		<div className="courses-share">
			
		</div>
	);
};

export default SocialShareBtns;
