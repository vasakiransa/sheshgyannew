import React, { useEffect, useState } from "react";
import Link from "@/utils/ActiveLink";
import { handleLogout } from "@/utils/auth";
import { useRouter } from "next/router";

const ProfileDropdown = ({
	userId,
	first_name,
	email,
	role,
	profile_photo,
}) => {
	const isAdmin = role === "admin";
	const isInstructor = role === "instructor";
	const isStudent = role === "student";

	const [currentPath, setCurrentPath] = useState("");
	const router = useRouter();

	useEffect(() => {
		setCurrentPath(router.asPath);
	}, [router]);

	return (
		<div className="dropdown profile-dropdown">
			<div className="img ptb-15">
			
				
					<div 
  className="dropdown profile-dropdown" 
  style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px" }}
>
  {/* Profile Picture */}
  <div className="img" style={{ display: "flex", alignItems: "center" }}>
    {profile_photo ? (
      <img 
        src={profile_photo} 
        alt={first_name} 
        style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} 
      />
    ) : (
      <img 
        src="/images/avatar.jpg" 
        alt={first_name} 
        style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} 
      />
    )}
  </div>

  {/* Name & Role Section */}
  <div 
    className="user-info" 
    style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
  >
    {first_name && <p style={{ margin: "0", fontSize: "16px", fontWeight: "bold" }}>{first_name}</p>}
    {role && <p style={{ margin: "0", fontSize: "14px", color: "gray" }}>{role}</p>}
  </div>
</div>

			</div>
			
			
			<ul className="dropdown-menu">
				<li>
					<Link href="/profile/basic-information/">
						<a className="dropdown-item author-dropdown-item">
							<div className="d-flex align-items-center">
							
							<div 
  className="profile-section" 
  style={{ display: "flex", alignItems: "center", gap: "10px" }}
>
  <div className="img">
    {profile_photo ? (
      <img 
        src={profile_photo} 
        alt={first_name} 
        style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} 
      />
    ) : (
      <img 
        src="/images/avatar.jpg" 
        alt={first_name} 
        style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} 
      />
    )}
  </div>

  
</div>


								<span className="ps-3">
									<span className="fw-semibold fs-16 mb-1 d-block">{first_name}</span>
									<span className="d-block fs-13 mt-minus-2">{email}</span>
								</span>
							</div>
						</a>
					</Link>
				</li>

				<li><hr className="dropdown-divider" /></li>

				{isInstructor && (
					<>
						<li>
							<Link href="/instructor/analytics/">
								<a className={`dropdown-item ${currentPath === "/instructor/analytics/" ? "active" : ""}`}>
									<i className="bx bx-chart"></i> Dashboard
								</a>
							</Link>
						</li>
						<li>
							<Link href="/instructor/attendance/">
								<a className={`dropdown-item ${currentPath === "/instructor/attendance/" ? "active" : ""}`}>
									<i className="bx bx-calendar-check"></i> Attendance
								</a>
							</Link>
						</li>
					</>
				)}

				{isAdmin && (
				 <>
				 <li>
					 <Link href="/admin/">
					 <a className={`dropdown-item ${currentPath === "/admin/" ? "active" : ""}`}>
					 <i className="bx bxs-dashboard"></i> My Dashboard
					 </a>
				 </Link>
				 </li>
				 <li>
								<Link href="/instructor/course/create/">
									<a 
										className={`dropdown-item ${currentPath == "/instructor/course/create/" && "active"}`}
									>
										<i className="bx bx-folder-plus"></i> Create
										New Course
									</a>
								</Link>
							</li>
				

				 <li>
					 <Link href="/admin/attendance/">
					 <a className={`dropdown-item ${currentPath === "/admin/attendance/" ? "active" : ""}`}>
					 <i className="bx bx-calendar-check"></i> Student Attendance
					 </a>
				 </Link>
				 </li>

				 <li>
					 <Link href="/admin/timetable/">
					 <a className={`dropdown-item ${currentPath === "/admin/timetable/" ? "active" : ""}`}>
					 <i className="bx bx-time-five"></i> Student Timetable
					 </a>
				 </Link>
				 </li>

				 </>
			 )}

			 {isStudent && (
				 <>
					 <li>
						 <Link href="/learning/my-courses/">
							 <a className={`dropdown-item ${currentPath === "/learning/my-courses/" ? "active" : ""}`}>
								 <i className="bx bx-book"></i> My Courses
							 </a>
						 </Link>
					 </li>
					 <li>
						 <Link href="/student/analytics/">
							 <a className={`dropdown-item ${currentPath === "/student/analytics/" ? "active" : ""}`}>
								 <i className="bx bx-chart"></i> Analytics
							 </a>
						 </Link>
					 </li>
				 </>
			 )}

			 <li>
				 <Link href="/learning/wishlist/">
					 <a className={`dropdown-item ${currentPath === "/learning/wishlist/" ? "active" : ""}`}>
						 <i className="bx bxs-heart"></i> Wishlist
					 </a>
				 </Link>
			 </li>

			 <li>
				 <Link href="/profile/basic-information/">
					 <a className={`dropdown-item ${currentPath === "/profile/basic-information/" ? "active" : ""}`}>
						 <i className="bx bxs-user-account"></i> Account settings
					 </a>
				 </Link>
			 </li>

			 <li>
				 <button type="submit" onClick={handleLogout} className="dropdown-item">
					 <i className="bx bx-log-out"></i> Log out
				 </button>
			 </li>

		 </ul>
	  </div>
	  );
};

export default ProfileDropdown;
