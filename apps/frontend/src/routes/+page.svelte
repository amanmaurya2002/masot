<script lang="ts">
  import type { MaterialsNews, ResearchPaper } from '$lib/types';
  import NewsCard from '$lib/components/NewsCard.svelte';
  import ResearchCard from '$lib/components/ResearchCard.svelte';
  export let data;
  let papers = data.papers;

  // Mock data for materials science news
  let news: MaterialsNews[] = [
    {
      id: 1,
      title: 'Breakthrough in Graphene-Based Supercapacitors',
      summary: 'Researchers develop new graphene composite material with 3x higher energy density',
      content: 'A team at MIT has developed a novel graphene-based composite material that shows remarkable improvements in energy storage capacity...',
      source: 'Nature Materials',
      published_at: '2024-05-15T10:00:00Z',
      image_url: null,
      url: 'https://example.com/graphene-breakthrough',
      category: 'breakthrough',
      tags: ['graphene', 'energy storage', 'supercapacitors', 'composites']
    },
    {
      id: 2,
      title: 'New 3D Printing Method for High-Temperature Ceramics',
      summary: 'Innovative additive manufacturing technique enables complex ceramic structures',
      content: 'Scientists at Stanford University have developed a new 3D printing method that allows for the creation of complex ceramic structures...',
      source: 'Science Advances',
      published_at: '2024-05-12T14:30:00Z',
      image_url: null,
      url: 'https://example.com/ceramic-3d-printing',
      category: 'research',
      tags: ['3D printing', 'ceramics', 'additive manufacturing', 'high-temperature']
    }
  ];
</script>

<svelte:head>
  <title>Materials Science & Engineering Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<style>
  :global(body) {
    font-family: 'Poppins', sans-serif;
    background-color: #f8fafc;
    color: #1e293b;
    margin: 0;
  }
  .header {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
    padding: 3rem 1rem;
    text-align: center;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  .header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }
  .header p {
    font-size: 1.1rem;
    margin: 0.5rem 0 0 0;
    opacity: 0.9;
  }
  .container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  .section {
    margin-bottom: 3rem;
  }
  .section-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1e293b;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 0.5rem;
  }
  .card-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
</style>

<header class="header">
  <h1>Materials Science & Engineering Hub</h1>
  <p>Latest breakthroughs, research, and innovations in materials science</p>
</header>

<main class="container">
  <section class="section">
    <h2 class="section-title">Latest News & Breakthroughs</h2>
    <div class="card-grid">
      {#if news.length === 0}
        <p>No recent news found.</p>
      {:else}
        {#each news as item (item.id)}
          <NewsCard {item} />
        {/each}
      {/if}
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">Recent Research Papers (ArXiv)</h2>
    <div class="card-grid">
      {#if !papers || papers.length === 0}
        <p>No recent papers found.</p>
      {:else}
        {#each papers as paper (paper.arxiv_id)}
          <ResearchCard {paper} />
        {/each}
      {/if}
    </div>
  </section>
</main>
