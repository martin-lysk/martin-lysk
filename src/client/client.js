/**
 * Client module that enhances Excalidraw player divs with interactive functionality
 */

/**
 * Calculate the total animation duration from an SVG file
 * by parsing all <animate> elements and finding the maximum begin + dur time
 */
async function calculateAnimationDuration(svgUrl) {
  try {
    const response = await fetch(svgUrl);
    const svgText = await response.text();

    // Parse the SVG as XML
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

    // Find all <animate> elements
    const animateElements = svgDoc.querySelectorAll('animate');
    let maxEndTime = 0;

    animateElements.forEach(animate => {
      const begin = animate.getAttribute('begin') || '0ms';
      const dur = animate.getAttribute('dur') || '0ms';

      // Parse the time values (handle formats like "10300ms" or "10.3s")
      const beginMs = parseTimeToMs(begin);
      const durMs = parseTimeToMs(dur);
      const endTime = beginMs + durMs;

      if (endTime > maxEndTime) {
        maxEndTime = endTime;
      }
    });

    // Add a small buffer (500ms) to ensure all animations have finished
    return maxEndTime + 500;
  } catch (error) {
    console.warn('Error calculating animation duration:', error);
    throw error;
  }
}

/**
 * Parse a time value to milliseconds
 * Handles formats like: "10300ms", "10.3s", "5s", etc.
 */
function parseTimeToMs(timeStr) {
  timeStr = timeStr.trim().toLowerCase();

  if (timeStr.endsWith('ms')) {
    return parseFloat(timeStr);
  } else if (timeStr.endsWith('s')) {
    return parseFloat(timeStr) * 1000;
  } else {
    // Assume milliseconds if no unit
    return parseFloat(timeStr);
  }
}

/**
 * Reset to static image and show play button
 */
function resetToStaticImage(staticImg, animatedImg, playButton) {
  staticImg.style.display = 'block';
  animatedImg.style.display = 'none';
  playButton.style.display = 'flex';
}

// Initialize on first page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initExcalidrawPlayers();
    });
  } else {
    initExcalidrawPlayers();
  }
}

export function onRouteDidUpdate({ location, previousLocation }) {
  // Only run on client-side and when route changes
  if (typeof window === 'undefined') {
    return;
  }

  // Initialize all Excalidraw players on the page
  initExcalidrawPlayers();
}

function initExcalidrawPlayers() {
  const players = document.querySelectorAll('.excalidraw-player:not(.initialized)');

  players.forEach((playerContainer) => {
    console.log('Found player container');
    playerContainer.classList.add('initialized');
    playerContainer.style.position = 'relative';
    playerContainer.style.display = 'inline-block';

    // Find both images (rendered by MDX)
    const imgs = playerContainer.querySelectorAll('img');

    // Check if this player uses GitHub-style theme classes
    // First check if the class is already set by the remark plugin
    let hasGhLightModeOnly = playerContainer.classList.contains('gh-light-mode-only');
    let hasGhDarkModeOnly = playerContainer.classList.contains('gh-dark-mode-only');

    // If not set by remark plugin, check the image src attributes for the hash
    if (!hasGhLightModeOnly && !hasGhDarkModeOnly && imgs.length > 0) {
      const firstImgSrc = imgs[0].src || '';
      if (firstImgSrc.includes('#gh-light-mode-only')) {
        hasGhLightModeOnly = true;
        playerContainer.classList.add('gh-light-mode-only');
        console.log('✓ Detected gh-light-mode-only from src');
      } else if (firstImgSrc.includes('#gh-dark-mode-only')) {
        hasGhDarkModeOnly = true;
        playerContainer.classList.add('gh-dark-mode-only');
        console.log('✓ Detected gh-dark-mode-only from src');
      }
    }

    const usesGhThemeClasses = hasGhLightModeOnly || hasGhDarkModeOnly;

    console.log('Found', imgs.length, 'images');
    console.log('Container HTML:', playerContainer.innerHTML);

    if (imgs.length !== 2) {
      console.warn('Expected 2 images, found:', imgs.length);
      console.warn('Container children:', playerContainer.children.length);
      Array.from(playerContainer.children).forEach((child, i) => {
        console.log(`Child ${i}:`, child.tagName, child.outerHTML?.substring(0, 200));
      });
      return;
    }

    // First img should be static, second should be animated
    const staticImg = imgs[0];
    const animatedImg = imgs[1];

    console.log('Static img src:', staticImg.src);
    console.log('Animated img src:', animatedImg.src);

    // Hide animated initially
    animatedImg.style.display = 'none';

    // Create play button
    const playButton = document.createElement('button');
    playButton.className = 'excalidraw-play-btn';
    playButton.setAttribute('aria-label', 'Play animation');
    playButton.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.2);
      border: none;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    playButton.innerHTML = `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="white" style="margin-left: 4px;">
        <path d="M8 5v14l11-7z"/>
      </svg>
    `;

    playerContainer.appendChild(playButton);

    // Store original URLs for theme switching
    const originalStaticSrc = staticImg.src;
    const originalAnimatedSrc = animatedImg.src;

    // State
    let isPlaying = false;
    let isPreloaded = false;

    // Function to play animation
    const playAnimation = () => {
      if (isPlaying) return;

      isPlaying = true;

      if (staticImg.parentNode) {
        staticImg.style.display = 'none';
      }
      animatedImg.style.display = 'block';
      playButton.style.display = 'none';

      // Always reset the source to restart the animation
      const originalAnimatedSrc = animatedImg.src;
      animatedImg.src = '';
      setTimeout(() => {
        animatedImg.src = originalAnimatedSrc;
        isPreloaded = true;
      }, 10);

      // Calculate total animation duration and reset to static image after it completes
      calculateAnimationDuration(originalAnimatedSrc).then(totalDuration => {
        console.log('Total animation duration:', totalDuration, 'ms');
        // Reset to static image after animation completes
        setTimeout(() => {
          resetToStaticImage(staticImg, animatedImg, playButton);
          isPlaying = false;
        }, totalDuration);
      }).catch(err => {
        console.warn('Could not calculate animation duration:', err);
        // Fallback: reset after a reasonable default time (10 seconds)
        setTimeout(() => {
          resetToStaticImage(staticImg, animatedImg, playButton);
          isPlaying = false;
        }, 10000);
      });
    };

    // Set up Intersection Observer to auto-play when fully in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
          console.log('Image fully in view, auto-playing animation');
          playAnimation();
          observer.disconnect(); // Only auto-play once
        }
      });
    }, {
      threshold: 1.0 // Trigger when 100% of the element is visible
    });

    observer.observe(playerContainer);

    // Only set up theme switching if not using GitHub-style theme classes
    if (!usesGhThemeClasses) {
      // Function to update image URLs based on theme
      const updateTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const oppositeTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Replace theme in URLs
        if (staticImg.parentNode) {
          staticImg.src = originalStaticSrc.replace(`.${oppositeTheme}.`, `.${currentTheme}.`);
        }
        animatedImg.src = originalAnimatedSrc.replace(`.${oppositeTheme}.`, `.${currentTheme}.`);
      };

      // Listen for theme changes
      const themeObserver = new MutationObserver(() => {
        if (!isPlaying) {
          updateTheme();
        }
      });

      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    }

    // Play button click handler
    playButton.addEventListener('click', () => {
      playAnimation();
    });

    // Hover effects for play button
    playButton.addEventListener('mouseenter', () => {
      playButton.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
      playButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
    });

    playButton.addEventListener('mouseleave', () => {
      playButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      playButton.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}
