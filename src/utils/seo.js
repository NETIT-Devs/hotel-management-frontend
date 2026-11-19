/**
 * Dynamic SEO Metadata & Structured Data (JSON-LD) Utility
 * Keeps document title, meta description, Open Graph tags, canonical URL,
 * and Schema.org structured data synchronized across SPA route transitions.
 */

const SITE_NAME = 'Serenity Bay Hotel & Resort';

/**
 * Updates or creates a <meta> tag in document.head.
 *
 * @param {string} attrName - Attribute to match ('name' or 'property')
 * @param {string} attrValue - Attribute value (e.g., 'description', 'og:title')
 * @param {string} content - Meta content value
 */
function upsertMetaTag(attrName, attrValue, content) {
    if (!content || typeof document === 'undefined') return;
    let tag = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

/**
 * Updates page-level SEO tags and optional JSON-LD structured data.
 * Returns a cleanup callback to remove route-specific JSON-LD on unmount.
 *
 * @param {object} options
 * @param {string} options.title - Page title (automatically suffixed with site name if omitted)
 * @param {string} options.description - Meta description for search engines & social previews
 * @param {string} [options.canonicalPath] - Relative canonical route path (e.g., '/offers/1')
 * @param {object|null} [options.jsonLd] - Schema.org JSON-LD object
 * @returns {() => void} Cleanup function for useEffect
 */
export function applyPageSEO({ title, description, canonicalPath, jsonLd = null }) {
    if (typeof document === 'undefined') return () => {};

    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
        upsertMetaTag('name', 'description', description);
        upsertMetaTag('property', 'og:description', description);
    }

    upsertMetaTag('property', 'og:title', fullTitle);
    upsertMetaTag('property', 'og:type', 'website');

    if (canonicalPath && typeof window !== 'undefined') {
        const canonicalUrl = `${window.location.origin}${canonicalPath}`;
        let linkEl = document.head.querySelector('link[rel="canonical"]');
        if (!linkEl) {
            linkEl = document.createElement('link');
            linkEl.setAttribute('rel', 'canonical');
            document.head.appendChild(linkEl);
        }
        linkEl.setAttribute('href', canonicalUrl);
        upsertMetaTag('property', 'og:url', canonicalUrl);
    }

    const scriptId = 'serenity-bay-seo-jsonld';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) existingScript.remove();

    if (jsonLd) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
    }

    return () => {
        const currentScript = document.getElementById(scriptId);
        if (currentScript) currentScript.remove();
    };
}
