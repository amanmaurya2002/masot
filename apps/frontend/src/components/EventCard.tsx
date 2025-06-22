import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

const categoryColors = {
  Sports: "category-sports",
  Culture: "category-culture", 
  Music: "category-music",
  Food: "category-food",
  Art: "category-art"
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="card">
      {event.image ? (
        <img 
          src={event.image} 
          alt={event.title}
          className="card-image"
        />
      ) : (
        <div className="card-image bg-gradient-to-br from-green-400 to-lime-400 flex items-center justify-center">
          <span className="text-white font-bold text-lg">Event</span>
        </div>
      )}
      <div className="card-content">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
        <div className="text-gray-600 text-sm mb-2">
          <p>📅 {event.date} at {event.time}</p>
          <p>📍 {event.venue}</p>
        </div>
        {event.category && (
          <span className={`category-badge ${categoryColors[event.category as keyof typeof categoryColors] || 'category-sports'}`}>
            {event.category}
          </span>
        )}
        {event.description && (
          <p className="text-gray-600 mt-2 line-clamp-2">{event.description}</p>
        )}
        {event.url && (
          <a 
            href={event.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:underline mt-2 inline-block"
          >
            Learn More →
          </a>
        )}
      </div>
    </div>
  );
} 