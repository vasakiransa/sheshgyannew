import React from "react";
import CourseUpdateForm from "@/components/Instructor/CourseUpdateForm";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import { parseCookies } from "nookies";

export async function getServerSideProps(context) {
    const { id } = context.params;
    const { elarniv_users_token } = parseCookies(context);

    try {
        const url = `${baseUrl}/api/courses/course/${id}`;
        const response = await axios.get(url, {
            headers: { Authorization: elarniv_users_token },
        });
        return {
            props: {
                courseData: response.data.course,
            },
        };
    } catch (error) {
        console.error("Error fetching course data:", error);
        return {
            props: {
                courseData: null,
            },
        };
    }
}

const CourseEditPage = ({ courseData }) => {
    if (!courseData) {
        return <div>Error loading course data</div>;
    }

    return <CourseUpdateForm courseData={courseData} />;
};

export default CourseEditPage;