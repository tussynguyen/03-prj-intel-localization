// Accessibility enhancements for the Intel timeline
document.addEventListener('DOMContentLoaded', function() {
    // Handle keyboard interaction for timeline cards
    const timelineCards = document.querySelectorAll('.timeline-card');
    
    timelineCards.forEach(function(card) {
        // Add keyboard event listeners
        card.addEventListener('keydown', function(e) {
            // Allow Enter and Space to activate cards
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCardOverlay(card);
            }
            
            // Arrow key navigation
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateCards(card, e.key);
            }
        });
        
        // Add click handler to ensure overlay works on touch devices
        card.addEventListener('click', function() {
            toggleCardOverlay(card);
        });
    });
    
    // Function to toggle card overlay for keyboard users
    function toggleCardOverlay(card) {
        const isActive = card.classList.contains('active');
        
        // Remove active class from all cards
        timelineCards.forEach(function(c) {
            c.classList.remove('active');
        });
        
        // Toggle active state
        if (!isActive) {
            card.classList.add('active');
            // Announce to screen readers
            announceCardContent(card);
        }
    }
    
    // Function to navigate between cards with arrow keys
    function navigateCards(currentCard, direction) {
        const currentIndex = Array.from(timelineCards).indexOf(currentCard);
        let nextIndex;
        
        if (direction === 'ArrowRight') {
            nextIndex = currentIndex + 1;
        } else {
            nextIndex = currentIndex - 1;
        }
        
        // Wrap around navigation
        if (nextIndex >= timelineCards.length) {
            nextIndex = 0;
        } else if (nextIndex < 0) {
            nextIndex = timelineCards.length - 1;
        }
        
        // Focus the next card
        timelineCards[nextIndex].focus();
    }
    
    // Function to announce card content to screen readers
    function announceCardContent(card) {
        const year = card.querySelector('h2').textContent;
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('.card-overlay p').textContent;
        
        // Create an announcement for screen readers
        const announcement = `${year}, ${title}. ${description}`;
        
        // Create a live region to announce the content
        let liveRegion = document.getElementById('live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        
        // Clear and set the announcement
        liveRegion.textContent = '';
        setTimeout(function() {
            liveRegion.textContent = announcement;
        }, 100);
    }
    
    // Handle escape key to close any active overlays
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            timelineCards.forEach(function(card) {
                card.classList.remove('active');
            });
        }
    });
    
    // Improve focus management for the timeline container
    const timelineContainer = document.querySelector('.timeline-cards');
    if (timelineContainer) {
        // Add instructions for screen reader users
        timelineContainer.setAttribute('aria-describedby', 'timeline-instructions');
        
        // Create instructions element
        const instructions = document.createElement('div');
        instructions.id = 'timeline-instructions';
        instructions.className = 'sr-only';
        instructions.textContent = 'Use arrow keys to navigate between timeline items. Press Enter or Space to view details.';
        timelineContainer.parentNode.insertBefore(instructions, timelineContainer);
    }
});
