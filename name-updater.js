// Script to update all instances of "Unpluggeders" to "eBuzzzMedia"
document.addEventListener('DOMContentLoaded', function() {
    // Update text content in various elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, label, button');
    
    textElements.forEach(element => {
        if (element.textContent.includes('Unpluggeders')) {
            element.textContent = element.textContent.replace(/Unpluggeders/g, 'eBuzzzMedia');
        }
    });
    
    // Update footer content specifically
    const footerLogo = document.querySelector('.footer-logo h3');
    if (footerLogo) {
        footerLogo.textContent = 'eBuzzzMedia';
    }
    
    // Update page title
    document.title = document.title.replace('Unpluggeders', 'eBuzzzMedia');
    
    // Update meta tags
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(tag => {
        const content = tag.getAttribute('content');
        if (content && content.includes('Unpluggeders')) {
            tag.setAttribute('content', content.replace(/Unpluggeders/g, 'eBuzzzMedia'));
        }
    });
    
    // Update contact email if present
    const emailElements = document.querySelectorAll('a[href^="mailto:"]');
    emailElements.forEach(element => {
        if (element.getAttribute('href').includes('unpluggeders.com')) {
            element.setAttribute('href', element.getAttribute('href').replace('unpluggeders.com', 'ebuzzzmedia.com'));
            
            // Also update the displayed text if it shows the email
            if (element.textContent.includes('unpluggeders.com')) {
                element.textContent = element.textContent.replace('unpluggeders.com', 'ebuzzzmedia.com');
            }
        }
    });
    
    // Update email text content in paragraphs and other elements
    textElements.forEach(element => {
        if (element.textContent.includes('hello@unpluggeders.com')) {
            element.textContent = element.textContent.replace('hello@unpluggeders.com', 'hello@ebuzzzmedia.com');
        }
        if (element.textContent.includes('@unpluggeders.com')) {
            element.textContent = element.textContent.replace('@unpluggeders.com', '@ebuzzzmedia.com');
        }
    });
    
    // Update copyright year in footer
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement && copyrightElement.textContent.includes('Unpluggeders')) {
        copyrightElement.textContent = copyrightElement.textContent.replace('Unpluggeders', 'eBuzzzMedia');
        
        // Also update the year if it's outdated
        if (copyrightElement.textContent.includes('2025')) {
            const currentYear = new Date().getFullYear();
            copyrightElement.textContent = copyrightElement.textContent.replace('2025', currentYear);
        }
    }
    
    console.log('Agency name updated from Unpluggeders to eBuzzzMedia throughout the site');
});