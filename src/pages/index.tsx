import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import './index.module.css';

interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  blog?: string;
  location?: string;
}

interface GitHubReadme {
  content: string;
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [readme, setReadme] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const githubUsername = 'martin-lysk';

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch profile
        const profileResponse = await fetch(
          `https://api.github.com/users/${githubUsername}`
        );
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch GitHub profile');
        }
        const profileData: GitHubProfile = await profileResponse.json();
        setProfile(profileData);

        // Fetch README
        const readmeResponse = await fetch(
          `https://api.github.com/repos/${githubUsername}/${githubUsername}/readme`
        );
        if (readmeResponse.ok) {
          const readmeData: GitHubReadme = await readmeResponse.json();
          // Decode base64 content
          const decodedContent = atob(readmeData.content);
          setReadme(decodedContent);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const createReadmeMarkup = () => {
    return { __html: readme };
  };

  return (
    <Layout title={`${siteConfig.title}`} description="Personal Blog">
      <main className="hero">
        <div className="container">
          {loading && <p className="text-muted">Loading profile...</p>}

          {error && <p className="text-muted">Error: {error}</p>}

          {profile && (
            <>
              <img
                src={profile.avatar_url}
                alt={profile.name || profile.login}
                className="hero__avatar"
              />
              <h1 className="hero__title">
                {profile.name || profile.login}
              </h1>
              {profile.bio && (
                <p className="hero__subtitle">{profile.bio}</p>
              )}
              <div style={{ marginBottom: '2rem' }}>
                <a
                  href={profile.html_url}
                  className="button button--primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: '1rem' }}
                >
                  GitHub Profile
                </a>
                <a href="/blog" className="button button--outline">
                  Read Blog
                </a>
              </div>

              {readme && (
                <div className="readme-section">
                  <h2>About Me</h2>
                  <div
                    className="readme-content"
                    dangerouslySetInnerHTML={createReadmeMarkup()}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
