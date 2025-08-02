
class ThemeManager {
    constructor() {
        this.themeSelect = document.getElementById('theme-select');
        this.currentTheme = localStorage.getItem('theme') || 'bcg'; // Default to BCG
        this.initialize();
    }

    initialize() {
        this.applyTheme(this.currentTheme);
        this.themeSelect.value = this.currentTheme;

        this.themeSelect.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
    }

    applyTheme(themeName) {
        document.body.className = `theme-${themeName}`;
        localStorage.setItem('theme', themeName);
        this.currentTheme = themeName;
        this.updateStylesheet(themeName);
    }

    updateStylesheet(themeName) {
        let themeLink = document.getElementById('theme-stylesheet');
        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.id = 'theme-stylesheet';
            themeLink.rel = 'stylesheet';
            document.head.appendChild(themeLink);
        }
        themeLink.href = `styles/theme-${themeName}.css`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
