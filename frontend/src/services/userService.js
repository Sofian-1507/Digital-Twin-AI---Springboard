const API_URL = "http://localhost:5000/api/users";

export async function getUser() {
  return {
    name: "Ishwari Shelke",
    email: "ishwari@gmail.com",
    phone: "9876543210",
    age: "21",
    city: "Pune",
    occupation: "Student",
    education: "B.E Computer Engineering"
  };
}

export async function updateUser(user) {
  console.log(user);
  return user;
}