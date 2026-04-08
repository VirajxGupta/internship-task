const mongoose = require('mongoose');
const Post = require('../models/Post');

const MONGODB_URI = 'mongodb+srv://virajgupta1811_db_user:rzcutqFJDgalTK3j@cluster0.mqa6c6b.mongodb.net/poststream?retryWrites=true&w=majority&appName=Cluster0';

const englishPosts = [
  {
    id: 1,
    userId: 1,
    title: 'The Future of AI in Modern Development',
    body: 'Artificial intelligence is rapidly altering the landscape of software engineering. Developers must adapt to utilizing GenAI not as a replacement, but as an advanced pair-programming assistant to increase velocity and reliability.',
    likes: 450,
    views: 1200
  },
  {
    id: 2,
    userId: 2,
    title: 'Why MongoDB Atlas is Essential for Startups',
    body: 'Startups need to move fast without worrying about infrastructure. MongoDB Atlas provides a fully managed, globally distributed cloud database that allows teams to focus entirely on application logic and feature delivery.',
    likes: 210,
    views: 890
  },
  {
    id: 3,
    userId: 3,
    title: 'Designing with Tailwind CSS: A Paradigm Shift',
    body: 'Gone are the days of appending hundreds of custom CSS files. Tailwind CSS offers utility-first classes that bring styling directly into your markup, reducing cognitive load and dramatically speeding up the design process.',
    likes: 189,
    views: 650
  },
  {
    id: 4,
    userId: 4,
    title: 'The Importance of Real-Time Data Streams',
    body: 'In an increasingly connected world, users expect data to be instantly available. WebSockets provide the necessary bidirectionality to handle live feeds, chat systems, and real-time stock dashboards perfectly natively.',
    likes: 560,
    views: 3100
  },
  {
    id: 5,
    userId: 5,
    title: 'Mastering the JavaScript Event Loop',
    body: 'Understanding the event loop is paramount for any JS developer. Recognizing the difference between macrotasks and microtasks will prevent you from accidentally blocking the main thread and ensure your apps remain performant.',
    likes: 310,
    views: 1540
  },
  {
    id: 6,
    userId: 1,
    title: 'Transitioning from REST to GraphQL',
    body: 'REST endpoints often lead to over-fetching or under-fetching. GraphQL solves this by allowing clients to specify exactly what data they require in a single payload, deeply optimizing mobile and web network interactions.',
    likes: 120,
    views: 520
  },
  {
    id: 7,
    userId: 2,
    title: 'Clean Architecture with React',
    body: 'Keep your presentation components decoupled from your business logic. Utilizing custom hooks to handle data fetching and state encapsulation makes testing a breeze and guarantees scalable frontend codebases.',
    likes: 280,
    views: 1100
  },
  {
    id: 8,
    userId: 3,
    title: 'Deploying Serverless Functions on Vercel',
    body: 'Vercel completely changes how we think about the backend. Edge functions and Serverless APIs scale effortlessly to massive traffic levels with zero dev-ops. Your git push is literally the deployment pipeline.',
    likes: 490,
    views: 2400
  },
  {
    id: 9,
    userId: 4,
    title: 'Securing Your Node.js Applications',
    body: 'Security cannot be an afterthought. Implement rate limiting, sanitize all user input using schema validators like Zod, use helmet middleware, and always ensure your secrets are securely managed in environment variables.',
    likes: 150,
    views: 660
  },
  {
    id: 10,
    userId: 5,
    title: 'The Evolution of Design Systems',
    body: 'Design systems bridge the gap between design and development. By abstracting tokens like colors, typography, and spacing geometry, teams can ensure 100% brand consistency while incredibly accelerating prototyping.',
    likes: 670,
    views: 4500
  }
];

mongoose.connect(MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB. Wiping existing posts...');
  await Post.deleteMany({});
  
  console.log('Seeding English Posts...');
  const result = await Post.insertMany(englishPosts);
  console.log(`Successfully seeded ${result.length} English posts!`);
  
  process.exit(0);
}).catch(err => {
  console.error('Error connecting to DB:', err);
  process.exit(1);
});
