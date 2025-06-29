<script lang="ts">
  import type { ResearchPaper } from '$lib/types';
  export let paper: ResearchPaper;
</script>

<div class="card">
  <h3 class="paper-title">{paper.title}</h3>
  <div class="authors">
    {#each paper.authors as author, i}
      {author}{i < paper.authors.length - 1 ? ', ' : ''}
    {/each}
  </div>
  <div class="journal-info">
    <span class="journal">{paper.journal}</span>
    {#if paper.impact_factor}
      <span class="impact-factor">IF: {paper.impact_factor}</span>
    {/if}
  </div>
  <p class="abstract">{paper.abstract}</p>
  <div class="meta">
    <span class="date">📅 {new Date(paper.published_at).toLocaleDateString()}</span>
    <span class="doi">🔗 DOI: {paper.doi}</span>
  </div>
  {#if paper.keywords.length > 0}
    <div class="keywords">
      <strong>Keywords:</strong>
      <div class="keyword-tags">
        {#each paper.keywords.slice(0, 4) as keyword}
          <span class="keyword">{keyword}</span>
        {/each}
      </div>
    </div>
  {/if}
  {#if paper.materials_focus.length > 0}
    <div class="materials-focus">
      <strong>Materials Focus:</strong>
      <div class="material-tags">
        {#each paper.materials_focus as material}
          <span class="material">{material}</span>
        {/each}
      </div>
    </div>
  {/if}
  <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" class="paper-link">
    View Paper
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
    min-height: 400px;
  }
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  .paper-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
    line-height: 1.4;
  }
  .authors {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 0.5rem;
    font-style: italic;
  }
  .journal-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .journal {
    font-weight: 600;
    color: #3b82f6;
    font-size: 0.9rem;
  }
  .impact-factor {
    background-color: #fef3c7;
    color: #92400e;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
  }
  .abstract {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.5;
    margin-bottom: 1rem;
    flex-grow: 1;
  }
  .meta {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: #64748b;
  }
  .doi {
    font-family: monospace;
    font-size: 0.8rem;
  }
  .keywords, .materials-focus {
    margin-bottom: 0.8rem;
  }
  .keywords strong, .materials-focus strong {
    font-size: 0.85rem;
    color: #374151;
    display: block;
    margin-bottom: 0.3rem;
  }
  .keyword-tags, .material-tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .keyword {
    background-color: #f1f5f9;
    color: #475569;
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 10px;
  }
  .material {
    background-color: #dbeafe;
    color: #1e40af;
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 10px;
  }
  .paper-link {
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
  .paper-link:hover {
    background-color: #2563eb;
  }
</style> 