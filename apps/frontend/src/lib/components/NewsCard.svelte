<script lang="ts">
  import type { MaterialsNews } from '$lib/types';

  export let item: MaterialsNews;

  const categoryColors = {
    research: '#3b82f6',
    industry: '#10b981',
    breakthrough: '#f59e0b',
    conference: '#8b5cf6',
    publication: '#ef4444'
  };
</script>

<div class="card">
  {#if item.image_url}
    <img src={item.image_url} alt={item.title} class="news-image" />
  {/if}
  <div class="category-badge" style="background-color: {categoryColors[item.category]}">
    {item.category}
  </div>
  <h3 class="news-title">{item.title}</h3>
  <p class="news-summary">{item.summary}</p>
  <div class="news-meta">
    <span class="source">{item.source}</span>
    <span class="date">{new Date(item.published_at).toLocaleDateString()}</span>
  </div>
  {#if item.tags.length > 0}
    <div class="tags">
      {#each item.tags.slice(0, 3) as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  {/if}
  <a href={item.url} target="_blank" rel="noopener noreferrer" class="news-link">
    Read More
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
    position: relative;
    min-height: 300px;
  }
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  .category-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    text-transform: capitalize;
  }
  .news-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
  }
  .news-summary {
    font-size: 0.95rem;
    color: #64748b;
    margin-bottom: 1rem;
    line-height: 1.5;
    flex-grow: 1;
  }
  .news-meta {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
  }
  .source {
    font-weight: 600;
    color: #3b82f6;
  }
  .tags {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .tag {
    background-color: #f1f5f9;
    color: #475569;
    font-size: 0.8rem;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
  }
  .news-link {
    display: inline-block;
    background-color: #3b82f6;
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
    background-color: #2563eb;
  }
  .news-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
</style> 