// Tab Navigation System - Initialize when DOM is ready
let navLinks, contentSections, mainNav;
let isSwitching = false; // Prevent multiple rapid clicks

// Wait for DOM to be ready
function initNavigation() {
    navLinks = document.querySelectorAll('.nav-link');
    contentSections = document.querySelectorAll('.content-section');
    mainNav = document.querySelector('.main-nav');
    
    if (!navLinks.length || !contentSections.length) {
        console.warn('Navigation elements not found, retrying...');
        setTimeout(initNavigation, 100);
        return;
    }
    
    // Scroll effect for navigation with throttle
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(() => {
            if (mainNav) {
                if (window.scrollY > 50) {
                    mainNav.classList.add('scrolled');
                } else {
                    mainNav.classList.remove('scrolled');
                }
            }
        }, 10);
    }, { passive: true });
    
    // Add click event listeners to nav links
    navLinks.forEach(link => {
        // Remove any existing listeners by cloning
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Prevent rapid clicking
            if (isSwitching) {
                return;
            }
            
            const tabName = this.getAttribute('data-tab');
            if (tabName) {
                switchTab(tabName);
            }
        }, { passive: false });
    });
}

// Function to switch tab (accessible globally)
function switchToTab(tabName) {
    if (!tabName) return;
    switchTab(tabName);
}

// Main switch tab function
function switchTab(tabName) {
    if (isSwitching || !tabName) return;
    
    isSwitching = true;
    
    // Get elements
    if (!navLinks) navLinks = document.querySelectorAll('.nav-link');
    if (!contentSections) contentSections = document.querySelectorAll('.content-section');
    
    // Remove active class from all nav links and sections with smooth transition
    navLinks.forEach(link => {
        link.style.transition = 'all 0.3s ease';
        link.classList.remove('active');
    });
    
    contentSections.forEach(section => {
        section.style.transition = 'opacity 0.3s ease';
        section.style.opacity = '0';
        setTimeout(() => {
            section.classList.remove('active');
            section.style.opacity = '';
        }, 150);
    });
    
    // Add active class to clicked nav link
    const clickedLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (clickedLink) {
        clickedLink.classList.add('active');
    }
    
    // Show corresponding section with fade-in
    const targetSection = document.getElementById(`${tabName}-section`);
    if (targetSection) {
        setTimeout(() => {
            targetSection.classList.add('active');
            targetSection.style.opacity = '0';
            requestAnimationFrame(() => {
                targetSection.style.transition = 'opacity 0.4s ease';
                targetSection.style.opacity = '1';
            });
            
            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Initialize specific content based on tab
            setTimeout(() => {
                if (tabName === 'home') {
                    initProductAnimations();
                } else if (tabName === 'members') {
                    initTeamCards();
                }
                isSwitching = false;
            }, 400);
        }, 150);
    } else {
        isSwitching = false;
    }
}

// Initialize product animations for home page
function initProductAnimations() {
    const productItems = document.querySelectorAll('.product-item');
    const teamPhotoSection = document.querySelector('.team-photo-section');
    
    // Reset animations
    if (teamPhotoSection) {
        teamPhotoSection.style.opacity = '0';
        teamPhotoSection.style.transform = 'translateY(30px)';
    }
    
    productItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
    });
    
    // Animate team photo section
    if (teamPhotoSection) {
        setTimeout(() => {
            teamPhotoSection.style.transition = 'all 0.8s ease';
            teamPhotoSection.style.opacity = '1';
            teamPhotoSection.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate product items sequentially
    productItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'all 0.8s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + (index * 200)); // Stagger animation
    });
}

// Initialize on page load if home section is active
if (document.getElementById('home-section').classList.contains('active')) {
    setTimeout(() => {
        initProductAnimations();
    }, 300);
}

// Smooth scrolling for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Get modal element
const modal = document.getElementById('memberModal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');

// Function to get team cards (only when members section is active)
function getTeamCards() {
    return document.querySelectorAll('#members-section .team-card');
}

// Function to open modal with member data
function openModal(memberData) {
    // Populate modal with data
    document.getElementById('modal-name').textContent = memberData.name;
    document.getElementById('modal-role').textContent = memberData.role;
    document.getElementById('modal-description').textContent = memberData.description;
    document.getElementById('modal-email').textContent = memberData.email;
    document.getElementById('modal-id').textContent = memberData.id || 'N/A';
    document.getElementById('modal-location').textContent = memberData.location;
    document.getElementById('modal-education').textContent = memberData.education || 'N/A';
    
    // Handle avatar photo
    const modalAvatarImg = document.getElementById('modal-avatar-img');
    const modalAvatarIcon = document.getElementById('modal-avatar-icon');
    
    if (memberData.photo && memberData.photo !== '') {
        modalAvatarImg.src = memberData.photo;
        modalAvatarImg.alt = memberData.name;
        modalAvatarImg.classList.add('active');
        modalAvatarIcon.classList.add('hidden');
    } else {
        modalAvatarImg.classList.remove('active');
        modalAvatarIcon.classList.remove('hidden');
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Initialize team cards functionality
function initTeamCards() {
    const cards = getTeamCards();
    
    // Only initialize if cards exist
    if (cards.length === 0) {
        return;
    }
    
    // Add click event to each team card
    cards.forEach(card => {
        // Check if card already has event listener
        if (card.hasAttribute('data-initialized')) {
            return;
        }
        card.setAttribute('data-initialized', 'true');
        
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on email link
            if (e.target.closest('.email-link')) {
                const email = this.dataset.email;
                if (email) {
                    window.location.href = `mailto:${email}`;
                }
                return;
            }
            
            const memberData = {
                name: this.dataset.name,
                role: this.dataset.role,
                description: this.dataset.description,
                email: this.dataset.email,
                id: this.dataset.id,
                photo: this.dataset.photo,
                location: this.dataset.location,
                education: this.dataset.education
            };
            
            openModal(memberData);
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all team cards
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // Add ripple effect on card click
    cards.forEach(card => {
        card.addEventListener('mousedown', function(e) {
            // Don't add ripple if clicking on social icons
            if (e.target.closest('.social-icon')) {
                return;
            }
            
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Initialize team cards on page load (only if members section is visible)
if (document.getElementById('members-section')?.classList.contains('active')) {
    setTimeout(() => {
        initTeamCards();
    }, 300);
}


// Close modal on close button click
modalClose.addEventListener('click', closeModal);

// Close modal on overlay click
modalOverlay.addEventListener('click', closeModal);

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Prevent clicks inside modal content from closing the modal
document.querySelector('.modal-content').addEventListener('click', function(e) {
    e.stopPropagation();
});

// Add click event to email icons
const emailIcons = document.querySelectorAll('.email-link');
emailIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent card click
    });
});


// Dynamic greeting based on time of day
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const subtitle = document.querySelector('.header-subtitle');
    
    if (subtitle && subtitle.textContent === 'Những con người tài năng đằng sau thành công') {
        // Keep the default message, but you can customize based on time
        if (hour < 12) {
            // Morning - keep default or customize
        } else if (hour < 18) {
            // Afternoon - keep default or customize
        } else {
            // Evening - keep default or customize
        }
    }
}

// Call on page load
updateGreeting();

// Add parallax effect to header on scroll (only on members page)
window.addEventListener('scroll', function() {
    const membersSection = document.getElementById('members-section');
    if (membersSection && membersSection.classList.contains('active')) {
        const scrolled = window.pageYOffset;
        const header = membersSection.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
            header.style.opacity = 1 - (scrolled / 500);
        }
    }
});


// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .team-card {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Document Plan Links - Tự động lấy từ file txt trong document_plan
function setDocumentPlanLinks() {
    const documentPlanLinks = {
        'doc-plan-1': 'https://docs.google.com/document/d/13eTWZKlI2omTJtltQgRMGFpgXm8GrXot/edit?usp=drive_link&ouid=116810151199259145644&rtpof=true&sd=true', // Link cho "Bảng kế hoạch"
        'doc-plan-2': 'https://docs.google.com/document/d/1UESKWYvd1TmUv1jP7KdLqsr3rKjEC8mA/edit?usp=drive_link&ouid=116810151199259145644&rtpof=true&sd=true', // Link cho "Báo cáo tiến độ và minh chứng"
        'doc-plan-3': '#'  // Link cho "Biểu mẫu tổng kết điểm" (chưa có link)
    };

    // Set document plan links
    Object.keys(documentPlanLinks).forEach(id => {
        const linkElement = document.getElementById(id);
        if (linkElement) {
            linkElement.href = documentPlanLinks[id];
        }
    });
}

// Set links when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setDocumentPlanLinks();
        initNavigation();
    });
} else {
    setDocumentPlanLinks();
    initNavigation();
}

// Meeting Gallery Modal
const meetingProgressCard = document.getElementById('meeting-progress-card');
const meetingGalleryModal = document.getElementById('meetingGalleryModal');
const galleryClose = document.querySelector('.gallery-close');

if (meetingProgressCard) {
    meetingProgressCard.addEventListener('click', function(e) {
        // Don't open if clicking on button (it has its own handler)
        if (e.target.closest('.view-gallery-btn')) {
            e.stopPropagation();
            openMeetingGallery();
        } else {
            openMeetingGallery();
        }
    });
}

// Open gallery button handler
document.addEventListener('click', function(e) {
    if (e.target.closest('.view-gallery-btn')) {
        openMeetingGallery();
    }
});

function openMeetingGallery() {
    if (meetingGalleryModal) {
        meetingGalleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMeetingGallery() {
    if (meetingGalleryModal) {
        meetingGalleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (galleryClose) {
    galleryClose.addEventListener('click', closeMeetingGallery);
}

if (meetingGalleryModal) {
    const galleryOverlay = meetingGalleryModal.querySelector('.modal-overlay');
    if (galleryOverlay) {
        galleryOverlay.addEventListener('click', closeMeetingGallery);
    }
}

// Full Size Image Modal
function openImageModal(imageSrc) {
    const imageModal = document.getElementById('imageModal');
    const fullSizeImage = document.getElementById('fullSizeImage');
    if (imageModal && fullSizeImage) {
        fullSizeImage.src = imageSrc;
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Product Image Modal
function openProductImageModal(imageSrc) {
    const productImageModal = document.getElementById('productImageModal');
    const productFullSizeImage = document.getElementById('productFullSizeImage');
    if (productImageModal && productFullSizeImage) {
        productFullSizeImage.src = imageSrc;
        productImageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProductImageModal() {
    const productImageModal = document.getElementById('productImageModal');
    if (productImageModal) {
        productImageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close image modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageModal();
        closeMeetingGallery();
        closeProductImageModal();
    }
});

// Make switchToTab globally accessible for onclick handlers
window.switchToTab = switchToTab;
window.openProductImageModal = openProductImageModal;

console.log('Team member page loaded successfully! 🎉');
console.log('Click on any team member card to view detailed information.');
console.log('💡 Tip: Cập nhật documentPlanLinks trong script.js để thay đổi link tài liệu');
