// Sprint Navigation Component
// Provides consistent navigation across all sprint checklist pages

class SprintNavigation {
    constructor(currentSprint = 0) {
        this.currentSprint = parseInt(currentSprint);
        this.totalSprints = 8; // Sprint 0-7
        this.baseUrl = './';
        
        // Sprint metadata - Updated to match actual file structure
        this.sprintData = {
            0: { name: 'Setup Guide', file: 'sprint-0.html', progress: 0 },
            1: { name: 'MVP Foundation', file: 'sprint-1.html', progress: 12.5 },
            2: { name: 'Customer Portal', file: 'sprint-2.html', progress: 25 },
            3: { name: 'Claude AI', file: 'sprint-3.html', progress: 37.5 },
            4: { name: '7-Day Content', file: 'sprint-4.html', progress: 50 },
            5: { name: 'Community', file: 'sprint-5.html', progress: 62.5 },
            6: { name: 'Analytics', file: 'sprint-6.html', progress: 75 },
            7: { name: 'Beta & Launch', file: 'sprint-7.html', progress: 87.5 }
        };
    }

    // Generate navigation HTML
    generateNavigation() {
        const navHTML = `
            <nav class="sprint-nav">
                <div class="nav-container">
                    <div class="sprint-progress">
                        ${this.generateSprintSteps()}
                    </div>
                    
                    <div class="global-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.getGlobalProgress()}%"></div>
                        </div>
                        <span class="progress-text">${this.getGlobalProgress()}% Complete</span>
                    </div>
                </div>
            </nav>
        `;
        return navHTML;
    }

    // Generate individual sprint steps
    generateSprintSteps() {
        let stepsHTML = '';
        for (let i = 0; i < this.totalSprints; i++) {
            const sprint = this.sprintData[i];
            const status = this.getSprintStatus(i);
            const href = this.baseUrl + sprint.file;
            
            stepsHTML += `
                <a href="${href}" 
                   class="sprint-step ${status}" 
                   title="Sprint ${i}: ${sprint.name}">
                   ${i}
                </a>
            `;
        }
        return stepsHTML;
    }

    // Get sprint status: completed, current, or empty
    getSprintStatus(sprintNumber) {
        if (sprintNumber < this.currentSprint) {
            return 'completed';
        } else if (sprintNumber === this.currentSprint) {
            return 'current';
        } else {
            return '';
        }
    }

    // Calculate global progress percentage
    getGlobalProgress() {
        return this.sprintData[this.currentSprint]?.progress || 0;
    }

    // Generate navigation buttons for bottom of page
    generateBottomNavigation() {
        const prevSprint = this.currentSprint - 1;
        const nextSprint = this.currentSprint + 1;
        
        let navButtons = '';
        
        // Previous button
        if (prevSprint >= 0) {
            const prevData = this.sprintData[prevSprint];
            navButtons += `
                <a href="${this.baseUrl}${prevData.file}" class="nav-btn nav-btn-secondary">
                    ← Previous: Sprint ${prevSprint}
                </a>
            `;
        }
        
        // Start/Continue current sprint button
        navButtons += `
            <a href="./sprint-${this.currentSprint}.html" class="nav-btn nav-btn-primary">
                Start Sprint ${this.currentSprint} →
            </a>
        `;
        
        // Next button
        if (nextSprint < this.totalSprints) {
            const nextData = this.sprintData[nextSprint];
            navButtons += `
                <a href="${this.baseUrl}${nextData.file}" class="nav-btn nav-btn-secondary">
                    Next: Sprint ${nextSprint} →
                </a>
            `;
        } else if (this.currentSprint === 7) {
            // Complete journey button for last sprint
            navButtons += `
                <a href="../pages/success.html?completed=true" class="nav-btn nav-btn-secondary">
                    Complete Journey 🎉
                </a>
            `;
        }
        
        return `
            <section class="navigation">
                <div class="container">
                    <div class="nav-buttons">
                        ${navButtons}
                    </div>
                </div>
            </section>
        `;
    }

    // Get CSS styles for navigation
    getNavigationCSS() {
        return `
            /* Sprint Navigation - Updated to use design system */
            .sprint-nav {
                background: var(--color-white);
                border-bottom: 3px solid var(--color-black);
                padding: 15px 0;
                position: sticky;
                top: 0;
                z-index: 100;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .nav-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }
            
            .sprint-progress {
                display: flex;
                gap: 15px;
                align-items: center;
            }
            
            .sprint-step {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.9rem;
                text-decoration: none;
                transition: all 0.3s ease;
                border: 2px solid var(--sprint-gray);
                color: var(--sprint-gray);
                position: relative;
            }
            
            .sprint-step:hover {
                transform: scale(1.05);
            }
            
            .sprint-step.completed {
                background: var(--sprint-success);
                border-color: var(--sprint-success);
                color: var(--sprint-white);
            }
            
            .sprint-step.current {
                background: var(--sprint-primary);
                border-color: var(--sprint-primary);
                color: var(--sprint-white);
                transform: scale(1.1);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
            }
            
            .global-progress {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .progress-bar {
                width: 120px;
                height: 6px;
                background: var(--sprint-light-gray);
                border-radius: 3px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--sprint-primary), var(--sprint-secondary));
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 0.8rem;
                color: var(--sprint-gray);
                font-weight: 600;
            }
            
            /* Navigation Buttons */
            .navigation {
                padding: 60px 0;
                background: var(--sprint-light-gray);
                text-align: center;
            }
            
            .nav-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
                flex-wrap: wrap;
            }
            
            .nav-btn {
                padding: 15px 30px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                font-size: 1rem;
            }
            
            .nav-btn-primary {
                background: var(--sprint-primary);
                color: var(--sprint-white);
            }
            
            .nav-btn-secondary {
                background: var(--sprint-white);
                color: var(--sprint-primary);
                border: 2px solid var(--sprint-primary);
            }
            
            .nav-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .sprint-progress {
                    gap: 8px;
                }
                
                .sprint-step {
                    width: 35px;
                    height: 35px;
                    font-size: 0.8rem;
                }
                
                .nav-container {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .nav-buttons {
                    flex-direction: column;
                    align-items: center;
                }
            }
        `;
    }

    // Initialize navigation on page load
    static init(currentSprint) {
        const nav = new SprintNavigation(currentSprint);
        
        // Add navigation HTML to page
        const navElement = document.createElement('div');
        navElement.innerHTML = nav.generateNavigation();
        document.body.insertBefore(navElement.firstElementChild, document.body.firstChild);
        
        // Add bottom navigation if container exists
        const bottomNavContainer = document.getElementById('bottom-navigation');
        if (bottomNavContainer) {
            bottomNavContainer.outerHTML = nav.generateBottomNavigation();
        }
        
        // Add CSS if not already present
        if (!document.getElementById('sprint-nav-styles')) {
            const style = document.createElement('style');
            style.id = 'sprint-nav-styles';
            style.textContent = nav.getNavigationCSS();
            document.head.appendChild(style);
        }
        
        return nav;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SprintNavigation;
}