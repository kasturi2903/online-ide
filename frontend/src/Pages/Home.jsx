import React from "react";

const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            Online IDE
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">
                  Register
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link btn btn-primary text-white ms-2" href="/temp">
                  Get Started
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1>Code, Compile, and Execute in the Cloud</h1>
          <p className="lead">
            Build and run code securely in multiple languages with Docker-powered containers.
          </p>
          <a href="/temp" className="btn btn-light btn-lg">
            Start Coding
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Features</h2>
          <div className="row text-center">
            <div className="col-md-4">
              <i className="bi bi-code-slash display-4 text-primary"></i>
              <h3 className="mt-3">Multi-Language Support</h3>
              <p>Write and execute code in languages like Python, Java, C++, and more.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-shield-lock display-4 text-primary"></i>
              <h3 className="mt-3">Secure Environment</h3>
              <p>Every execution runs in an isolated Docker container for safety.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-chat-left-text display-4 text-primary"></i>
              <h3 className="mt-3">Real-Time Chat</h3>
              <p>Collaborate with others through real-time messaging and group chats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">About Us</h2>
          <p className="text-center">
            Our mission is to provide a seamless, cloud-based development environment for programmers worldwide. Build, compile, and deploy projects without worrying about local setups.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-3">
        <div className="container text-center">
          <p>&copy; 2024 Online IDE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
