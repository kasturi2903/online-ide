import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      console.log('Login successful', response);

      // Save the JWT token to localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to profile or dashboard page
      navigate('/profile');
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error', err);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mt-5">Login</h2>
          <Form onSubmit={handleSubmit} className="mt-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="btn-block">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // To navigate after successful login

// const Login = () => {
//   const navigate = useNavigate();
  
//   // State variables for form inputs and error message
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Simple client-side validation
//     if (!email || !password) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     // // Mock Authentication (replace with real API call)
//     // if (email === "user@example.com" && password === "password123") {
//     //   // Redirect to the dashboard or home page upon successful login
//     //   navigate("/dashboard"); // Example: Redirect to Dashboard
//     // } else {
//     //   setError("Invalid credentials, please try again.");
//     // }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6 col-sm-12">
//           <div className="card shadow">
//             <div className="card-body">
//               <h3 className="card-title text-center">Login</h3>
//               <form onSubmit={handleSubmit}>
//                 {error && <div className="alert alert-danger">{error}</div>}
//                 <div className="mb-3">
//                   <label className="form-label">Email address</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter your email"
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100">
//                   Login
//                 </button>
//               </form>
//               <div className="text-center mt-3">
//                 <p>
//                   Dont have an account? <a href="/signup">Register here</a>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



