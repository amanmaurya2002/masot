<script lang="ts">
  import type { ResearchPaper } from '$lib/types';
  export let paper: ResearchPaper;
  
  $: paperUrl = getPaperUrl(paper);
  $: truncatedAbstract = truncateAbstract(paper.abstract, 200);
  
  function getPaperUrl(paper: ResearchPaper): string {
    if (paper.url) return paper.url;
    if (paper.doi) return `https://doi.org/${paper.doi}`;
    if (paper.arxiv_id) return `https://arxiv.org/abs/${paper.arxiv_id}`;
    if (paper.pmc_id) return `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${paper.pmc_id}/`;
    return '#';
  }
  
  function truncateAbstract(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }
</script>

<div class="card">
  <div class="card-header">
    <h3 class="paper-title">{paper.title}</h3>
  </div>
  
  <p class="abstract">{truncatedAbstract}</p>
  
  {#if paper.materials_focus && paper.materials_focus.length > 0}
    <div class="materials-focus">
      <strong>Materials Focus:</strong>
      <div class="material-tags">
        {#each paper.materials_focus as material}
          <span class="material">{material}</span>
        {/each}
      </div>
    </div>
  {/if}
  
  <a href={paperUrl} target="_blank" rel="noopener noreferrer" class="paper-link">
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
    max-height: 500px;
  }
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  .card-header {
    margin-bottom: 0.5rem;
  }
  .paper-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
    line-height: 1.4;
  }
  .abstract {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.5;
    margin-bottom: 1rem;
    flex-grow: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
  }
  .materials-focus {
    margin-bottom: 0.8rem;
  }
  .materials-focus strong {
    font-size: 0.85rem;
    color: #374151;
    display: block;
    margin-bottom: 0.3rem;
  }
  .material-tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .material {
    background-color: #dbeafe;
    color: #1e40af;
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 10px;
  }
  .paper-link {
    margin-top: 1rem;
    text-align: right;
    display: block;
    color: #1e40af;
    text-decoration: none;
  }
  .paper-link:hover {
    text-decoration: underline;
  }
</style> 