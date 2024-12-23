import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // To navigate after successful login

const Login = () => {
  const navigate = useNavigate();
  
  // State variables for form inputs and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Mock Authentication (replace with real API call)
    if (email === "user@example.com" && password === "password123") {
      // Redirect to the dashboard or home page upon successful login
      navigate("/dashboard"); // Example: Redirect to Dashboard
    } else {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-12">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center">Login</h3>
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
              <div className="text-center mt-3">
                <p>
                  Dont have an account? <a href="/signup">Register here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;





// import React from "react";

// const Login = () => {
//     return (
//         <div className="container mt-5">
//             <h2>Login</h2>
//             <form>
//               <div className="mb-3">
//                 <label className="form-label">Email</label>
//                 <input type="email" className="form-control" required />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Password</label>
//                 <input type="password" className="form-control" required />
//               </div>
//               <button type="submit" className="btn btn-primary">
//                 Login
//               </button>
//             </form>
//         </div>
//     );
// };

// export default Login