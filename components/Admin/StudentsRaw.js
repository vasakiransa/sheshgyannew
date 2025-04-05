// StudentsRaw.jsx
import React from 'react';
import Link from 'next/link';

const StudentsRaw = ({ 
    id, 
    first_name, 
    last_name, 
    email, 
    phone, 
    class_id, 
    schoolName, 
    school_id
}) => {
    return (
        <tr>
            <td>{`${first_name} ${last_name}`}</td>
            <td>{email}</td>
            <td>{phone || 'N/A'}</td>
            <td>{class_id}</td>
            <td>{school_id}</td>
            
        </tr>
    );
};

export default StudentsRaw;