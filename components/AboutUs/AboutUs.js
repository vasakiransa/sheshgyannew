import React from 'react'
import { Bar } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const AboutUs = () => {
  // Student growth data
  const data = {
    labels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    datasets: [
      {
        label: 'Student Growth (%)',
        data: [60, 75, 82, 90, 96], // Growth stats
        backgroundColor: ['#16a34a', '#ea580c', '#0284c7', '#db2777', '#9333ea'],
        borderRadius: 10,
      },
    ],
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image Section */}
          <motion.div 
            className="relative rounded-lg shadow-lg overflow-hidden" 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <img src="/images/about-img1.png" alt="About Us" className="w-full rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md rounded-lg"></div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            className="space-y-6 p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-xl backdrop-blur-lg" 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <span className="text-xl text-green-400 font-semibold">DISTANCE LEARNING</span>
            <h2 className="text-4xl font-bold leading-snug">
              89% of students report career benefits after taking our courses!
            </h2>
            <p className="text-gray-300">
              Our platform empowers learners by offering flexible, high-quality education. Join thousands of professionals upskilling today!
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '💡', text: 'Expert Trainers' },
                { icon: '🎓', text: 'Lifetime Access' },
                { icon: '📡', text: 'Remote Learning' },
                { icon: '🚀', text: 'Self Development' },
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3 shadow-md transform transition duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-3xl">{feature.icon}</span>
                  <span className="text-lg font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Student Growth Analytics */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold mb-4">📊 Student Growth Over Time</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Our students show consistent improvement with our courses, progressing significantly from class to class.
          </p>
          <motion.div 
            className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }}
          >
            <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
