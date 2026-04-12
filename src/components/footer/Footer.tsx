import styles from './footer.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const exploreLinks = [
  'Browse Recipes',
  'Smart Search',
  'Seasonal Collections',
  'Dietary Filters',
  'Trending Now',
];

const planningLinks = ['Weekly Planner', 'Shopping Lists', 'Meal Reminders', 'Family Sharing'];

const supportLinks = ['Help Center', 'Community Tips', 'Feedback', 'Privacy Policy'];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <Image src="/logo.svg" alt="Easy Meal" width={120} height={26} />
            </div>
            <p className={styles.tagline}>
              Refining the way you prepare, plan, and enjoy food. A discovery-first companion for
              the modern kitchen.
            </p>
          </div>

          <nav className={styles.navColumn} aria-label="Explore">
            <h4 className={styles.navHeading}>Explore</h4>
            <ul className={styles.navList}>
              {exploreLinks.map((label) => (
                <li key={label}>
                  <Link href="/" className={styles.navLink}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.navColumn} aria-label="Planning">
            <h4 className={styles.navHeading}>Planning</h4>
            <ul className={styles.navList}>
              {planningLinks.map((label) => (
                <li key={label}>
                  <Link href="/" className={styles.navLink}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.navColumn} aria-label="Support">
            <h4 className={styles.navHeading}>Support</h4>
            <ul className={styles.navList}>
              {supportLinks.map((label) => (
                <li key={label}>
                  <Link href="/" className={styles.navLink}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Easy Meal Project. All rights reserved.
          </p>
          <div className={styles.legal}>
            <Link href="/" className={styles.legalLink}>
              Terms
            </Link>
            <Link href="/" className={styles.legalLink}>
              Privacy
            </Link>
            <Link href="/" className={styles.legalLink}>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
