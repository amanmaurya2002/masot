<script lang="ts">
  import ResearchCard from '$lib/components/ResearchCard.svelte';
  export let data;
  let papers = data.papers;
  let sourceStats = data.sourceStats;
  let totalCount = data.totalCount;
</script>

<svelte:head>
  <title>Materials Science & Engineering Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<style>
  :global(body) {
    font-family: 'Poppins', sans-serif;
    background-color: #f8fafc;
    color: #1e293b;
    margin: 0;
    line-height: 1.6;
  }
  
  .header {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: white;
    padding: 2rem 1rem;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    padding-left: 2rem;
  }
  
  .logo {
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .logo-text {
    text-align: left;
  }
  
  .header h1 {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.01em;
  }
  
  .container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  .section {
    margin-bottom: 3rem;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1e293b;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 0.5rem;
    margin: 0;
  }
  
  .source-stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .stat-item {
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 0.9rem;
    color: #64748b;
  }
  
  .stat-number {
    font-weight: 600;
    color: #3b82f6;
  }
  
  .card-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
</style>

<header class="header">
  <div class="header-content">
    <span class="logo">⚛️</span>
    
    <div class="logo-text">
      <h1>Materials</h1>
    </div>
  </div>
</header>

<main class="container">
  <section class="section">
    <div class="section-header">
      <h2 class="section-title">Recent Research Papers</h2>
      {#if sourceStats && Object.keys(sourceStats).length > 0}
        <div class="source-stats">
          <div class="stat-item">
            Total: <span class="stat-number">{totalCount}</span>
          </div>
          {#each Object.entries(sourceStats) as [source, count]}
            <div class="stat-item">
              {source}: <span class="stat-number">{count}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
    
    <div class="card-grid">
      {#if !papers || papers.length === 0}
        <p>No recent papers found.</p>
      {:else}
        {#each papers as paper (paper.arxiv_id || paper.pmc_id || paper.doi || paper.title)}
          <ResearchCard {paper} />
        {/each}
      {/if}
    </div>
  </section>
</main>
