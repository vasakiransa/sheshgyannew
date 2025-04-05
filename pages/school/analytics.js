import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Automatically register chart types

const Analytics = () => {
  // Sample data for courses and students
  const courseData = {
    labels: ['Robotics', 'IOT', 'Python', 'Web dev'],
    datasets: [
      {
        label: '# of Students',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const studentData = {
    labels: ['Class A', 'Class B', 'Class C'],
    datasets: [
      {
        label: '# of Courses',
        data: [5, 3, 8],
        backgroundColor: [
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Class-wise Student Analytics</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '45%' }}>
          <h3>Students per Course</h3>
          <Pie data={courseData} />
        </div>
        <div style={{ width: '45%' }}>
          <h3>Courses per Class</h3>
          <Bar data={studentData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
