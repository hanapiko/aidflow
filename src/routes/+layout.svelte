<script>
  import '../styles/app.css';
</script>

<nav>
  <div class="nav-container">
    <a href="/" class="logo">AidFlow</a>
    <div class="nav-links">
      <a href="/projects">Projects</a>
      <a href="/admin">Admin</a>
    </div>
  </div>
</nav>

<main>
  <slot />
</main>

<footer>
  <div class="footer-content">
    <p>&copy; {new Date().getFullYear()} AidFlow. All rights reserved.</p>
  </div>
</footer>

<style>
  nav {
    background: var(--primary-color);
    padding: 1rem;
    color: white;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    margin-left: 1.5rem;
  }

  .nav-links a:hover {
    text-decoration: underline;
  }

  main {
    min-height: calc(100vh - 140px);
  }

  footer {
    background: #f4f4f4;
    padding: 1rem;
    margin-top: 2rem;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
</style>
