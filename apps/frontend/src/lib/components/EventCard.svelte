<script lang="ts">
  import type { Event } from '$lib/types';

  export let event: Event;
</script>

<div class="card">
  <h3 class="event-title">{event.title}</h3>
  <div class="event-meta">
    <div class="meta-item">
      <span>📅</span>
      <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
    </div>
    <div class="meta-item">
      <span>📍</span>
      <span>{event.venue || 'Venue TBD'}</span>
    </div>
  </div>
  <a
    href={event.external_url}
    target="_blank"
    rel="noopener noreferrer"
    class="event-link"
  >
    View Event
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
  .event-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .event-meta {
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
  .event-link {
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
  .event-link:hover {
    background-color: #388E3C;
  }
</style> 