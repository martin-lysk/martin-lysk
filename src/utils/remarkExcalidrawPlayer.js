const { visit } = require('unist-util-visit');

// Helper function to deep clone objects with circular references
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash);
    }
  }

  return clone;
}

console.log('=== remarkExcalidrawPlayer loaded ===');

/**
 * Remark plugin that transforms animated Excalidraw SVG references
 * Converts: ![alt](./name.anim.(dark|light).exp.svg)
 * To: Wrapper div with data attributes for client-side enhancement
 *
 * The client-side script handles creating the static/animated images and play button
 */
function remarkExcalidrawPlayer() {
  return function (tree, file) {
    console.log('remarkExcalidrawPlayer processing:', file.path);
    let transformedCount = 0;

    // MDX converts markdown images to JSX elements
    // Look for mdxJsxFlowElement or mdxJsxTextElement with name "img"
    visit(tree, (node, index, parent) => {
      // Check for MDX JSX img elements
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        if (node.name === 'img') {
          console.log('Found img element');
          // Find src attribute
          const srcAttr = node.attributes?.find(attr => attr.name === 'src');
          const altAttr = node.attributes?.find(attr => attr.name === 'alt');

          if (srcAttr && srcAttr.value) {
            console.log('Src attr type:', srcAttr.value.type);
            let originalPath = null;

            // Extract the original relative path from the webpack require
            if (srcAttr.value.type === 'mdxJsxAttributeValueExpression') {
              const valueStr = srcAttr.value.value || '';
              console.log('Src value:', valueStr.substring(0, 150));
              // Extract the path from: require("loader!./demo.anim.light.exp.svg")
              // The webpack require can have multiple loaders separated by !
              const pathMatch = valueStr.match(/!.*\.(.*)\.anim\.(dark|light)\.exp\.svg/);
              if (pathMatch) {
                originalPath = `./${pathMatch[1]}.anim.${pathMatch[2]}.exp.svg`;
                console.log('✓ Extracted path:', originalPath);
              } else {
                console.log('✗ Regex did not match');
              }
            }

            if (originalPath) {
              // Check if this is an animated Excalidraw SVG
              const animMatch = originalPath.match(/(.+)\.anim\.(dark|light)\.exp\.svg$/);

              if (animMatch) {
                console.log('✓ Matched animated SVG, creating both images...');

                // Extract the base name and theme from the original path
                const baseName = animMatch[1];  // e.g., "./demo"
                const theme = animMatch[2];      // e.g., "light" or "dark"

                // Create both animated and static webpack require expressions
                // by reconstructing them from the original animated src
                const animSrc = srcAttr.value.value;
                // Replace the filename part (./demo.anim.light.exp.svg) with (.stat.)
                // The webpack require ends with .svg").default so we need to match that too
                const staticSrc = animSrc.replace(
                    /\.\/([^/.]+)\.anim\.(dark|light)\.exp\.svg"\)\.default$/,
                    `./$1.stat.${theme}.exp.svg").default`
                );

                console.log('Full anim src:', animSrc.substring(0, 100));
                console.log('Full static src:', staticSrc.substring(0, 100));
                console.log('Are they equal?', animSrc === staticSrc);

                // Deep clone the entire img node to get all attributes and the estree
                const staticImgNode = deepClone(node);

                // Now modify the src attribute in the cloned node
                const staticSrcAttr = staticImgNode.attributes.find(attr => attr.name === 'src');
                if (staticSrcAttr && staticSrcAttr.value) {
                  // Update both the value string and the estree literal value
                  staticSrcAttr.value.value = staticSrc;
                  // Update the estree literal value as well
                  if (staticSrcAttr.value.data && staticSrcAttr.value.data.estree) {
                    const estree = staticSrcAttr.value.data.estree;
                    // Navigate the estree to find the literal with the file path
                    // Program > body[0] > expression > left > object > arguments[0]
                    if (estree.body &&
                        estree.body[0] &&
                        estree.body[0].expression &&
                        estree.body[0].expression.left &&
                        estree.body[0].expression.left.object &&
                        estree.body[0].expression.left.object.arguments &&
                        estree.body[0].expression.left.object.arguments[0]) {
                      const literal = estree.body[0].expression.left.object.arguments[0];
                      // Update the literal value and raw string
                      literal.value = literal.value.replace(/\.anim\.(dark|light)\.exp\.svg/, `.stat.${theme}.exp.svg`);
                      literal.raw = literal.raw.replace(/\.anim\.(dark|light)\.exp\.svg/, `.stat.${theme}.exp.svg`);
                    }
                  }
                }

                console.log('Static node attributes:', staticImgNode.attributes.length);
                console.log('Animated node attributes:', node.attributes.length);
                console.log('Static src value:', staticImgNode.attributes.find(a => a.name === 'src')?.value?.value?.substring(0, 80));
                console.log('Animated src value:', node.attributes.find(a => a.name === 'src')?.value?.value?.substring(0, 80));
                console.log('Are they the same object?', staticImgNode === node);
                console.log('Total children to add:', 2);

                // Wrap both images in a div
                if (parent && typeof index === 'number') {
                  const wrapperDiv = {
                    type: 'mdxJsxFlowElement',
                    name: 'div',
                    attributes: [
                      {
                        type: 'mdxJsxAttribute',
                        name: 'className',
                        value: 'excalidraw-player',
                      },
                    ],
                    children: [staticImgNode, node],
                  };
                  console.log('Wrapper div children count:', wrapperDiv.children.length);
                  console.log('Child 0 type:', wrapperDiv.children[0].type);
                  console.log('Child 1 type:', wrapperDiv.children[1].type);
                  parent.children[index] = wrapperDiv;
                  transformedCount++;
                }
              }
            }
          }
        }
      }
    });

    console.log(`Transformed ${transformedCount} images`);
  };
}

module.exports = { remarkExcalidrawPlayer };
