import { metadata } from './metadata';

export default function HomePage() {
  return (
    <div>
      <h1>{metadata.title}</h1>
      <p>{metadata.description}</p>
    </div>
  );
}