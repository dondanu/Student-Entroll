document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();

  // Add student
  document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const studentData = {
          name: document.getElementById('name').value,
          age: parseInt(document.getElementById('age').value),
          major: document.getElementById('major').value,
          courses: document.getElementById('courses').value.split(',').map(course => course.trim()),
          enrollmentDate: document.getElementById('enrollmentDate').value ? new Date(document.getElementById('enrollmentDate').value) : null,
          graduated: document.getElementById('graduated').value === 'true',
      };

      try {
          const response = await fetch('http://localhost:5000/students', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(studentData)
          });
          
          if (!response.ok) throw new Error('Failed to add student');
          
          document.getElementById('addStudentForm').reset();
          fetchStudents(); // Refresh student list
      } catch (error) {
          console.error('Error adding student:', error);
      }
  });

  // Update student
  document.getElementById('editStudentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const studentId = document.getElementById('editStudentId').value;
      const updatedData = {
          name: document.getElementById('editName').value,
          age: parseInt(document.getElementById('editAge').value),
          major: document.getElementById('editMajor').value,
          courses: document.getElementById('editCourses').value.split(',').map(course => course.trim()),
          enrollmentDate: document.getElementById('editEnrollmentDate').value ? new Date(document.getElementById('editEnrollmentDate').value) : null,
          graduated: document.getElementById('editGraduated').value === 'true',
      };

      try {
          const response = await fetch(`http://localhost:5000/students/${studentId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData)
          });
          
          if (!response.ok) throw new Error('Failed to update student');
          
          document.getElementById('editStudentForm').style.display = 'none';
          fetchStudents(); // Refresh student list
      } catch (error) {
          console.error('Error updating student:', error);
      }
  });
});

// Fetch students
async function fetchStudents() {
  try {
      const response = await fetch('http://localhost:5000/students');
      const students = await response.json();
      
      const studentList = document.getElementById('studentList');
      studentList.innerHTML = ''; // Clear previous content
      
      students.forEach(student => {
          const li = document.createElement('div');
          li.className = 'student-item';
          li.innerHTML = `
              <span>Name: ${student.name} | Age: ${student.age} | Major: ${student.major} | Courses: ${student.courses.join(', ')} | Graduated: ${student.graduated ? 'Yes' : 'No'}</span>
              <button onclick="deleteStudent('${student._id}')">Delete</button>
              <button onclick="editStudent('${student._id}', '${student.name}', ${student.age}, '${student.major}', '${student.courses}', '${student.enrollmentDate}', ${student.graduated})">Edit</button>
          `;
          studentList.appendChild(li);
      });
  } catch (error) {
      console.error('Error fetching students:', error);
  }
}

// Delete student
async function deleteStudent(studentId) {
  try {
      const response = await fetch(`http://localhost:5000/students/${studentId}`, {
          method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete student');
      
      fetchStudents(); // Refresh student list
  } catch (error) {
      console.error('Error deleting student:', error);
  }
}

// Edit student
function editStudent(id, name, age, major, courses, enrollmentDate, graduated) {
  document.getElementById('editStudentId').value = id;
  document.getElementById('editName').value = name;
  document.getElementById('editAge').value = age;
  document.getElementById('editMajor').value = major;
  document.getElementById('editCourses').value = courses.replace(/,/g, ', ');
  document.getElementById('editEnrollmentDate').value = new Date(enrollmentDate).toISOString().slice(0, 10);
  document.getElementById('editGraduated').value = graduated ? 'true' : 'false';

  document.getElementById('editStudentForm').style.display = 'block';
}
