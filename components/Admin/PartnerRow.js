import React from "react";

const PartnerRow = ({
	id,
	name,
	partner_image,
	phone_number_1,
	phone_number_2,
	email,
	contact_person,
	address,
	onDelete,
}) => {
	return (
		<tr>
			<td>{name}</td>
			<td>
				<img src={partner_image} alt="image" className="w-100px" />
			</td>
			<td>{phone_number_1 ? phone_number_1 : "N/A"}</td> {/* Added phone number 1 */}
			<td>{phone_number_2 ? phone_number_2 : "N/A"}</td> {/* Added phone number 2 */}
			<td>{email ? email : "N/A"}</td> {/* Added email */}
			<td>{contact_person ? contact_person : "N/A"}</td> {/* Added contact person */}
			<td>{address ? address : "N/A"}</td> {/* Added address */}
			<td>
				<button
					onClick={() => onDelete(id)}
					type="button"
					className="btn btn-danger btn-sm fs-12"
				>
					Delete
				</button>
				<button
					type="button"
					className="btn btn-success btn-sm fs-12 ms-2"
				>
					Update
				</button>
			</td>
		</tr>
	);
};

export default PartnerRow;
