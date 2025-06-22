<script lang="ts">
  import type { PageData } from './$types';
  import NewsCard from '$lib/components/NewsCard.svelte';
  import EventCard from '$lib/components/EventCard.svelte';

  export let data: PageData;

  const defaultTab = 'news';
  let activeTab: 'news' | 'events' = defaultTab;

  function selectTab(tab: 'news' | 'events') {
    activeTab = tab;
  }
</script>

<svelte:head>
  <title>Chandigarh Events & News</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<style>
  :global(body) {
    font-family: 'Poppins', sans-serif;
    background-color: #f7f9f7;
    color: #333;
    margin: 0;
  }
  .header {
    background: linear-gradient(135deg, #388E3C 0%, #66BB6A 100%);
    color: white;
    padding: 3rem 1rem;
    text-align: center;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  .header h1 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }
  .container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  /* --- Tab Styles --- */
  .tabs {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 2rem;
  }
  .tab-button {
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    border: none;
    background: transparent;
    font-size: 1.1rem;
    font-weight: 600;
    color: #718096;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease-in-out;
  }
  .tab-button:hover {
    color: #333;
  }
  .tab-button.active {
    color: #4CAF50;
    border-bottom-color: #4CAF50;
  }

  .card-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
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
  .event-title,
  .news-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .event-meta,
  .news-meta {
    font-size: 0.9rem;
    color: #718096;
    margin-bottom: 1rem;
    flex-grow: 1;
  }
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .event-link,
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
  .event-link:hover,
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
  .loading,
  .error {
    text-align: center;
    margin-top: 4rem;
    font-size: 1.2rem;
  }
  .error {
    color: #e53e3e;
  }
</style>

<header class="header">
  <h1>Chandigarh Pulse</h1>
</header>

<main class="container">
  {#if data.error}
    <p class="error">{data.error}</p>
  {:else}
    <div class="tabs">
      <button class="tab-button" class:active={activeTab === 'news'} on:click={() => selectTab('news')}>
        News
      </button>
      <button
        class="tab-button"
        class:active={activeTab === 'events'}
        on:click={() => selectTab('events')}
      >
        Events
      </button>
    </div>

    {#if activeTab === 'events'}
      <section class="events-section">
        <div class="card-grid">
          {#if data.events.length === 0}
            <p>No upcoming events found.</p>
          {:else}
            {#each data.events as event (event.id)}
              <EventCard {event} />
            {/each}
          {/if}
        </div>
      </section>
    {/if}

    {#if activeTab === 'news'}
      <section class="news-section">
        <div class="card-grid">
          {#if data.news.length === 0}
            <p>No recent news found.</p>
          {:else}
            {#each data.news as item (item.id)}
              <NewsCard {item} />
            {/each}
          {/if}
        </div>
      </section>
    {/if}
  {/if}
</main>
