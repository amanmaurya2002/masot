<script lang="ts">
  import type { News } from '$lib/types';

  export let item: News;
</script>

<div class="card">
  {#if item.image_url}
    <img src={item.image_url} alt={item.title} class="news-image" />
  {/if}
  <h3 class="news-title">{item.title}</h3>
  <p class="news-meta">
    {item.source} - {new Date(item.published_at).toLocaleDateString()}
  </p>
  <a href={item.url} target="_blank" rel="noopener noreferrer" class="news-link">
    Read Full Article
  </a>
</div>

<style>
  .card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  .news-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .news-meta {
    font-size: 0.9rem;
    color: #718096;
    margin-bottom: 1rem;
    flex-grow: 1;
  }
  .news-link {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    transition: background-color 0.3s;
    text-align: center;
    margin-top: auto;
  }
  .news-link:hover {
    background-color: #388E3C;
  }
  .news-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
</style> 