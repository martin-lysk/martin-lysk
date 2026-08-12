const { visit } = require('unist-util-visit');

function expression(value) {
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: JSON.stringify(value),
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        comments: [],
        body: [{
          type: 'ExpressionStatement',
          expression: { type: 'Literal', value, raw: JSON.stringify(value) },
        }],
      },
    },
  };
}

/**
 * React blocks javascript: URLs by design. Keep bookmarklets authored as normal
 * Markdown links, but render them as inert links that the client activates on
 * an explicit click.
 */
function remarkBookmarkletLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (!node.url?.startsWith('javascript:')) {
        return;
      }

      node.type = 'mdxJsxTextElement';
      node.name = 'a';
      node.attributes = [
        { type: 'mdxJsxAttribute', name: 'href', value: '#' },
        {
          type: 'mdxJsxAttribute',
          name: 'data-bookmarklet',
          value: expression(node.url),
        },
      ];
      delete node.url;
      delete node.title;
    });
  };
}

module.exports = remarkBookmarkletLinks;
