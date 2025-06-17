const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK with your service account
const serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});
const db = admin.firestore();

// Read courses array from JSON file
const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'courses.json'), 'utf8'));

async function uploadCourses() {
  for (const course of courses) {
    await db.collection('courses').add(course);
    console.log('Uploaded:', course.code || course.title);
  }
  console.log('All courses uploaded!');
}

uploadCourses();