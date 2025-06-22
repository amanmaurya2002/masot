import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className="card">
      {news.image ? (
        <img 
          src={news.image} 
          alt={news.title}
          className="card-image"
        />
      ) : (
        <div className="card-image bg-gradient-to-br from-green-400 to-lime-400 flex items-center justify-center">
          <span className="text-white font-bold">News</span>
        </div>
      )}
      <div className="card-content">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{news.title}</h3>
        <div className="text-gray-600 text-sm mb-2">
          <p>📰 {news.source}</p>
          <p>📅 {new Date(news.publishedAt).toLocaleDateString()}</p>
        </div>
        <a 
          href={news.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-600 hover:underline"
        >
          Read More →
        </a>
      </div>
    </div>
  );
} 