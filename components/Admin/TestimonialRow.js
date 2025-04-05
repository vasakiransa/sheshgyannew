import React from "react";

const StudentsRaw = ({
	id,
	first_name,
	last_name,
	email,
	phone,
	bio,
	email_confirmed,
	role,
	password, // Added password prop
	onAdmin = null,
}) => {
	return (
		<tr>
			<td>{`${first_name} ${last_name}`}</td>
			<td>{email}</td>
			<td>{phone ? phone : "N/A"}</td>
			<td>{email_confirmed ? "Yes" : "No"}</td>
			<td>
				<div className="max-300px max-height-60">
					{bio ? bio : "N/A"}
				</div>
			</td>
			<td>{password ? password : "N/A"}</td> {/* Added password column */}
		</tr>
	);
};

export default StudentsRaw;
