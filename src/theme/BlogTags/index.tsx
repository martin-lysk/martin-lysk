import React from 'react';
import {useTags} from '@docusaurus/plugin-content-blog/client';
import {useLayout} from '@docusaurus/theme-common/internal';

export default function BlogTags(): JSX.Element {
  const tags = useTags();
  const {isBlogPluginMode} = useLayout();

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="blog-tags">
      <h3>Tags</h3>
      <div className="blog-tags__list">
        {tags.map((tag) => (
          <span key={tag.label} className="blog-tags__tag">
            <a href={tag.permalink}>
              {tag.label} ({tag.count})
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}
