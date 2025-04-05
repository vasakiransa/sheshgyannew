import React from "react";

const InstructorRow = ({
	id,
	first_name,
	last_name,
	email,
	phone,
	instructor_subject,
	instructor_description,
	instructor_request_confirmed,
	onApprove = null,
	onDeny = null,
}) => {
	return (
		<tr>
			<td>{`${first_name} ${last_name}`}</td>
			<td>{email}</td>
			<td>{phone}</td>
			<td>{instructor_subject}</td>
			<td>
				<div className="max-300px max-height-60">
					{instructor_description}
				</div>
			</td>
			
			
		</tr>
	);
};

export default InstructorRow;
