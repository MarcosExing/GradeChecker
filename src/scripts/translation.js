export class Translation {
    /**
     * Initializes a new Translation instance.
     * @param {string} [currentLanguage='en'] - The initial language code (e.g., 'en', 'pt-BR'). Defaults to 'en' (English).
     */
    constructor(currentLanguage='en') {
        /**
         * @type {Object.<string, string>} - An object to store the translations. Keys are translation keys, values are the translated strings.
         */
        this.translations = {};
        /**
         * @type {string} - The currently selected language code.
         */
        this.currentLanguage = currentLanguage;
    }

    /**
     * Translates the page content by replacing text content and placeholders of elements with translated strings.
     * It iterates through all elements with the `data-translate-key` attribute.
     * For each element, it looks up the corresponding translation in the `this.translations` object.
     * If a translation is found, it updates the element's text content or placeholder.
     * @async
     * @returns {Promise<void>} - A promise that resolves when the translation is complete.
     */
    async translatePage() {
        // Select all elements that have the 'data-translate-key' attribute.
        const elementsToTranslate = document.querySelectorAll('[data-translate-key]');
        // Iterate over each element found.
        elementsToTranslate.forEach((element) => {
            // Get the translation key from the 'data-translate-key' attribute.
            const key = element.dataset.translateKey;
            // Check if a translation exists for the current key.
            if (this.translations[key]) {
                // If the element has a 'placeholder' attribute, update the placeholder.
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = this.translations[key];
                }
                // Otherwise, update the text content of the element.
                else {
                    element.textContent = this.translations[key];
                }
            }
        });
    }

    /**
     * Loads the translations for the current language from a JSON file.
     * If the file for the current language is not found or an error occurs, it falls back to English ('en.json').
     * @async
     * @returns {Promise<void>} - A promise that resolves when the translations are loaded.
     */
    async loadTranslations() {
        try {
            // Attempt to fetch the translation file for the current language.
            const response = await fetch(`src/locales/${this.currentLanguage}.json`);
            // If the response is not successful (e.g., 404 Not Found), throw an error.
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${language}`);
            }
            // Parse the JSON response and store the translations.
            this.translations = await response.json();
        } catch (error) {
            console.error(`Error loading translations: `, error);
            const fallbackResponse = await fetch('src/locales/en.json');
            // Parse the JSON response and store the fallback translations.
            this.translations = await fallbackResponse.json();
        }
    }
}
