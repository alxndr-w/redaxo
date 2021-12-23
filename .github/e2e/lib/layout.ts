import {Page} from '@playwright/test';

export const stopAnimations = async (page: Page) =>
    await page.addStyleTag({
        content: `
          *,
          *::before,
          *::after {
            caret-color: transparent !important;
            transition: none !important;
            animation: none !important;
            scroll-behavior: auto !important;
          }
        `
    });

export const waitForImagesLazyloaded = async (page: Page) => {
    await page.evaluate(() => {
        document.querySelectorAll<HTMLElement>('.lazyload').forEach(el => {
            // trigger loading
            // https://github.com/aFarkas/lazysizes#lazysizesloaderunveildomnode
            el.classList.add('lazypreload');
        });
    });
    const locator = page.locator('.lazyload');
    while (await locator.count()) {
        await page.waitForTimeout(100);
    }
};

// mask dynamic content like dates or sensible content like system settings
export const maskContent = async (page: Page) => {
    await page.evaluate(() => {
        const contentSelectors: Array<string> = [
            '.rex-js-script-time',
            '.rex-js-setup-step-5 .form-control-static',
            'td[data-title="Letzter Login"]',
            '#rex-form-exportfilename',
            '#rex-page-system-settings .col-lg-4 td',
            '#rex-page-system-report-html .row td',
            'td[data-title="Version"]',
            'td[data-title="Erstellt am"]',
            'tr[class^="rex-state-"] td[data-title="Zeit"]' // system log items
        ];

        document.querySelectorAll<any>(contentSelectors.join()).forEach(el => {
            el.innerHTML = 'XXX';
            el.value = 'XXX'; // handle input elements
        })
    });
};
