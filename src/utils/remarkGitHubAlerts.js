/**
 * Remark plugin to convert GitHub-flavored alerts to GitHub's HTML structure
 *
 * Converts:
 *   > [!NOTE]
 *   > content
 *
 * To GitHub's exact HTML structure
 */

const { visit } = require('unist-util-visit');

const remarkGitHubAlerts = function remarkGitHubAlerts() {
  return (tree) => {
    // Map GitHub alert types to title text
    const alertMapping = {
      'NOTE': 'Note',
      'TIP': 'Tip',
      'IMPORTANT': 'Important',
      'WARNING': 'Warning',
      'CAUTION': 'Caution',
    };

    visit(tree, 'blockquote', (node, index) => {
      // Check if this blockquote starts with a GitHub alert
      if (node.children && node.children.length > 0) {
        const firstChild = node.children[0];

        // Check if first child is a paragraph containing [!TYPE]
        if (firstChild.type === 'paragraph' && firstChild.children && firstChild.children.length > 0) {
          const textNode = firstChild.children[0];

          if (textNode && textNode.type === 'text') {
            // Check for [!TYPE] pattern at the start (case-insensitive)
            const match = textNode.value.match(/^\[\!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);

            if (match) {
              const alertType = match[1].toUpperCase();
              const alertTitle = alertMapping[alertType];

              if (alertTitle) {
                // Remove the [!TYPE] from the text
                textNode.value = textNode.value.slice(match[0].length);

                // If the first paragraph is now empty, remove it
                if (textNode.value.trim() === '' && firstChild.children.length === 1) {
                  node.children.shift();
                }

                // Add title paragraph at the beginning with the alert label
                const titleParagraph = {
                  type: 'paragraph',
                  data: {
                    hName: 'p',
                    hProperties: {
                      className: 'markdown-alert-title',
                      dir: 'auto'
                    }
                  },
                  children: [
                    {
                      type: 'text',
                      value: alertTitle
                    }
                  ]
                };

                // Prepend the title
                node.children.unshift(titleParagraph);

                // Change blockquote to div with GitHub's exact classes
                node.data = node.data || {};
                node.data.hName = 'div';
                node.data.hProperties = node.data.hProperties || {};
                node.data.hProperties.className = `markdown-alert markdown-alert-${alertType.toLowerCase()}`;
                node.data.hProperties.dir = 'auto';

                // Mark this node so it doesn't get processed again
                node.data.githubAlert = true;
              }
            }
          }
        }
      }
    });
  };
};

module.exports = remarkGitHubAlerts;
