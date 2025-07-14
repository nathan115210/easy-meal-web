// File: src/app/community/page.tsx
import React from 'react';
import styles from './community.module.scss';
import Image from 'next/image';

const featuredPost = {
  title: 'How to Meal Prep for Busy Weeks',
  author: 'Jane Doe',
  excerpt: 'Discover tips and tricks for efficient meal prep and planning...',
  link: '/community/posts/meal-prep-tips',
};

const recentDiscussions = [
  { id: 1, topic: 'Best vegetarian recipes?', author: 'Alex', link: '/community/discussion/1' },
  { id: 2, topic: 'Quick breakfast ideas', author: 'Sam', link: '/community/discussion/2' },
  { id: 3, topic: 'How to store fresh herbs', author: 'Mia', link: '/community/discussion/3' },
];

const memberSpotlight = {
  name: 'Chris Lee',
  bio: 'Home cook and recipe creator. Loves sharing healthy meal ideas.',
  avatar: '/community/dummy-avatar.png',
};

const CommunityPage = () => (
  <main className={styles.communityPage}>
    <section className={styles.introCard}>
      <h1 className={styles.heading}>Welcome to the Community</h1>
      <p className={styles.description}>Connect with fellow home cooks, share tips, and discover new recipes. Join the conversation!</p>
      <a className={styles.cta} href="/signup">
        Join Now
      </a>
    </section>

    <section className={styles.featuredPost}>
      <h2 className={styles.sectionHeading}>Featured Post</h2>
      <a href={featuredPost.link} className={styles.postCard}>
        <h3>{featuredPost.title}</h3>
        <p>{featuredPost.excerpt}</p>
        <span className={styles.author}>By {featuredPost.author}</span>
      </a>
    </section>

    <section className={styles.discussions}>
      <h2 className={styles.sectionHeading}>Recent Discussions</h2>
      <ul className={styles.discussionList}>
        {recentDiscussions.map((d) => (
          <li key={d.id}>
            <a href={d.link} className={styles.discussionLink}>
              <span className={styles.topic}>{d.topic}</span>
              <span className={styles.author}>by {d.author}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>

    <section className={styles.spotlight}>
      <h2 className={styles.sectionHeading}>Member Spotlight</h2>
      <div className={styles.memberCard}>
        <Image src={memberSpotlight.avatar} alt={memberSpotlight.name} width={64} height={64} className={styles.avatar} />
        <div>
          <h3>{memberSpotlight.name}</h3>
          <p>{memberSpotlight.bio}</p>
        </div>
      </div>
    </section>
  </main>
);

export default CommunityPage;
