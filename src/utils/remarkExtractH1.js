const { visit } = require('unist-util-visit');
const path = require('path');

/**
 * Remark plugin that extracts the first H1 from markdown and adds it to frontmatter
 * Also extracts slug from folder path if it matches YYYY-MM-DD-slug pattern
 * Optionally removes the H1 from the content to avoid duplication
 */
function remarkExtractH1(options = {}) {
  const { removeH1 = true } = options;

  return function (tree, file) {
    let h1Text = '';
    let h1Found = false;

    // Find the first H1 heading
    visit(tree, 'heading', (node) => {
      if (!h1Found && node.depth === 1) {
        h1Found = true;

        // Extract text content from the heading
        h1Text = node.children
          .map((child) => {
            if (child.type === 'text') {
              return child.value;
            }
            // Handle inline code, links, etc.
            if (child.value) {
              return child.value;
            }
            return '';
          })
          .join('')
          .trim();

        // Optionally remove the H1
        if (removeH1) {
          // Replace with empty text node to remove from rendering
          node.children = [];
          node.data = {
            hHidden: true,
          };
        }
      }
    });

    // Initialize frontmatter if it doesn't exist
    const data = file.data;
    if (!data.frontmatter) {
      data.frontmatter = {};
    }

    // Add the extracted H1 as title
    if (h1Text) {
      data.frontmatter.title = h1Text;
    }

    // Extract slug from file path if it matches YYYY-MM-DD-slug pattern
    if (file.path) {
      const dirName = path.basename(path.dirname(file.path));
      const slugMatch = dirName.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);

      if (slugMatch) {
        data.frontmatter.slug = slugMatch[1];
      }
    }

    // Also store as separate property for easy access
    if (h1Text) {
      data.h1Title = h1Text;
    }
  };
}

module.exports = { remarkExtractH1 };
