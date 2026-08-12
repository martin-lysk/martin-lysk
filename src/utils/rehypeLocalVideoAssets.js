function assetRequireAttributeValue(assetPath) {
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: `require(${JSON.stringify(assetPath)}).default`,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        comments: [],
        body: [{
          type: 'ExpressionStatement',
          expression: {
            type: 'MemberExpression',
            computed: false,
            optional: false,
            object: {
              type: 'CallExpression',
              optional: false,
              callee: { type: 'Identifier', name: 'require' },
              arguments: [{
                type: 'Literal',
                value: assetPath,
                raw: JSON.stringify(assetPath),
              }],
            },
            property: { type: 'Identifier', name: 'default' },
          },
        }],
      },
    },
  };
}

/**
 * Gives local <video><source> paths the same Webpack asset treatment as
 * Markdown images, while keeping media next to the blog post that uses it.
 */
function rehypeLocalVideoAssets() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'source') {
        const src = node.properties?.src;
        if (typeof src === 'string' && src.startsWith('./')) {
          node.type = 'mdxJsxFlowElement';
          node.name = 'source';
          node.attributes = [
            { type: 'mdxJsxAttribute', name: 'src', value: assetRequireAttributeValue(src) },
            ...(node.properties.type
              ? [{ type: 'mdxJsxAttribute', name: 'type', value: node.properties.type }]
              : []),
          ];
          delete node.tagName;
          delete node.properties;
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

module.exports = rehypeLocalVideoAssets;
