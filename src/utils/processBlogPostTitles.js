function extractFirstH1(content) {
  const match = content.match(/^#\s+(.+?)\s*#*\s*$/m);
  return match?.[1].trim();
}

/**
 * Docusaurus reads blog metadata before Remark plugins run. Extract titles here
 * so a post can keep Markleft comments immediately before its first H1.
 */
async function processBlogPostTitles({ blogPosts }) {
  return blogPosts.map((post) => {
    const title = extractFirstH1(post.content);
    if (!title) {
      return post;
    }

    return {
      ...post,
      metadata: {
        ...post.metadata,
        title,
      },
    };
  });
}

module.exports = processBlogPostTitles;
