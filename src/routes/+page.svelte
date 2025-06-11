<script>
  const title = "Welcome to AidFlow";
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="container">
  <h1>{title}</h1>
  <p>Support social projects through anonymous donations</p>
  <a href="/projects" class="cta-button">View Projects</a>
</div>

<style>
  .container {
    text-align: center;
    padding: 2rem;
  }
  
  .cta-button {
    display: inline-block;
    background: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 1rem;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
</style>
