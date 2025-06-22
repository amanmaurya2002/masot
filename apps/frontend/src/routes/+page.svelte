<script lang="ts">
  import { onMount } from 'svelte';

  let events: any[] = [];
  let news: any[] = [];
  let loading = true;
  let error = '';

  const API_BASE = 'http://localhost:8000'; // Update if backend runs elsewhere

  onMount(async () => {
    try {
      const [eventsRes, newsRes] = await Promise.all([
        fetch(`${API_BASE}/events`),
        fetch(`${API_BASE}/news`)
      ]);
      events = await eventsRes.json();
      news = await newsRes.json();
    } catch (e) {
      error = 'Failed to load data.';
    } finally {
      loading = false;
    }
  });
</script>

<style>
  body {
    font-family: 'Inter', Arial, sans-serif;
    background: #f7fafc;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 900px;
    margin: 2rem auto;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    padding: 2.5rem 2rem 2rem 2rem;
  }
  h1 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #2d3748;
    letter-spacing: -1px;
  }
  section {
    margin-bottom: 2.5rem;
  }
  h2 {
    color: #3182ce;
    font-size: 1.5rem;
    margin-bottom: 1.2rem;
    border-left: 4px solid #3182ce;
    padding-left: 0.7rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .card {
    background: #f0f4f8;
    border-radius: 12px;
    margin-bottom: 1.2rem;
    padding: 1.2rem 1.5rem;
    box-shadow: 0 2px 8px rgba(49,130,206,0.07);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: box-shadow 0.2s;
  }
  .card:hover {
    box-shadow: 0 6px 24px rgba(49,130,206,0.13);
  }
  .event-title, .news-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: #2d3748;
  }
  .event-meta, .news-meta {
    color: #4a5568;
    font-size: 0.98rem;
  }
  .event-link, .news-link {
    color: #3182ce;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.5rem;
    transition: color 0.2s;
  }
  .event-link:hover, .news-link:hover {
    color: #2b6cb0;
    text-decoration: underline;
  }
  .no-data {
    color: #a0aec0;
    font-style: italic;
    margin: 1rem 0;
  }
  @media (max-width: 600px) {
    .container {
      padding: 1rem 0.5rem;
    }
    h1 {
      font-size: 2rem;
    }
    h2 {
      font-size: 1.1rem;
    }
  }
</style>

<div class="container">
  <h1>Chandigarh Latest Events & News</h1>

  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p style="color: red">{error}</p>
  {:else}
    <section>
      <h2>Latest Events</h2>
      {#if events.length === 0}
        <p class="no-data">No events found.</p>
      {:else}
        <ul>
          {#each events as event}
            <li class="card">
              <span class="event-title">{event.title}</span>
              <span class="event-meta">{event.date} {event.time} at {event.venue}</span>
              {#if event.category}
                <span class="event-meta">Category: {event.category}</span>
              {/if}
              {#if event.description}
                <span class="event-meta">{event.description}</span>
              {/if}
              {#if event.external_url}
                <a class="event-link" href={event.external_url} target="_blank">Details</a>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>
    <section>
      <h2>Latest News</h2>
      {#if news.length === 0}
        <p class="no-data">No news found.</p>
      {:else}
        <ul>
          {#each news as item}
            <li class="card">
              <span class="news-title">{item.title}</span>
              <span class="news-meta">{item.published_at} — {item.source}</span>
              {#if item.image_url}
                <img src={item.image_url} alt="news image" style="max-width:100px; margin:0.5rem 0; border-radius:8px;" />
              {/if}
              <a class="news-link" href={item.url} target="_blank">Read</a>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}
</div>
