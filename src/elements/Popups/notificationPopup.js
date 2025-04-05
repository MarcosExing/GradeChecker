/**
 * Represents a notification popup that displays a message to the user.
 */
export class NotificationPopup {
    /**
     * @type {boolean} - A static flag to track if a notification is currently active.
     */
    static isNotificationActive = false;

    /**
     * Creates a new NotificationPopup instance.
     * @param {string} message - The message to be displayed in the notification.
     * @param {string} type - The type of the notification (e.g., 'success', 'error'). This determines the styling.
     */
    constructor(message, type) {
        /**
         * @type {string} - The message to be displayed.
         */
        this.message = message;
        /**
         * @type {string} - The type of the notification.
         */
        this.type = type;

        /**
         * @type {number} - The amount of time (milliseconds) to read a word. 
         */
        this.readWordTime = 70;

        // Check if another NotificationPopup is playing
        if (NotificationPopup.isNotificationActive) {
            console.warn("Another notification is already active, Skipping this one: " + message);
            return;
        }

        // Set the flag to true since we're now displaying a notification.
        NotificationPopup.isNotificationActive = true;

        /**
         * @type {HTMLDivElement} - The overlay element that covers the screen.
         */
        this.notificationPopupOverlay = document.createElement('div');
        this.notificationPopupOverlay.classList.add('overlay-notification-popup');

        /**
         * @type {HTMLDivElement} - The main notification popup element.
         */
        this.notificationPopup = document.createElement('div');
        this.notificationPopup.classList.add('notification-popup');
        // Add the type as a class to style the notification accordingly.
        this.notificationPopup.classList.add(this.type);
        // Set the text content of the notification.
        this.notificationPopup.textContent = this.message;
        
        // Append the notification popup to the overlay.
        this.notificationPopupOverlay.appendChild(this.notificationPopup);
        // Append the overlay to the document body to display it.
        document.body.appendChild(this.notificationPopupOverlay);
        // Start the animation of the notification.
        this.animate();
        // Remove the notification after 3 seconds.
        setTimeout(() => {
            this.notificationPopupOverlay.remove();
            // Reset the flag when the notification is removed.
            NotificationPopup.isNotificationActive = false;
        }, this.readWordTime * this.message.length);
    }

    /**
     * Animates the notification popup to appear and then fade out.
     */
    animate() {
        // Animation to make the notification slide in from the top.
        this.notificationPopup.animate(
            [
                // Start with the notification above its final position and invisible.
                {transform: "translateY(-50%)", opacity: 0},
                // End at its final position and fully visible.
                {transform: "translateY(0)", opacity: 1}
            ],
            {
                // Duration of the slide-in animation.
                duration: 200,
                // Easing function for the animation.
                easing: "ease-in",
                // Keep the final state of the animation after it's done.
                fill: "forwards"
            }
        );
        // Animation to make the notification fade out.
        this.notificationPopup.animate(
            [
                // Start fully visible.
                {opacity: 1},
                // Stay fully visible for a while.
                {opacity: 1},
                // End invisible.
                {opacity: 0}
            ],
            {
                // Duration of the fade-out animation (3 seconds).
                duration: this.readWordTime * this.message.length,
                // Delay before the fade-out starts (after the slide-in).
                delay: 200,
                // Easing function for the animation.
                easing: "ease-in",
                // Keep the final state of the animation after it's done.
                fill: "forwards"
            }
        );
    }

}
