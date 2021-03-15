// -----------------------------------------------------------------------------
// Managing of the navigation through the tree view
// -----------------------------------------------------------------------------

const navFromAttributeName = "data-nav-from";
const navTottributeName = "data-nav-to";

// gets the header html element
const header = document.querySelector("header");

// grabs all navigation 'from' elements (from the header view)
const navigationFromElements = Array.from(
  header ? header.querySelectorAll(`[${navFromAttributeName}]`) : []
);

// gets the main html element
const main = document.querySelector("main");

// grabs all navigation 'to' elements (from the main content)
const navigationToElements = Array.from(
  main ? main.querySelectorAll(`[${navTottributeName}]`) : []
);

// adds a click event handler for each navigation 'from' item
navigationFromElements.forEach((navigationFromElement) => {
  navigationFromElement.addEventListener("click", (e: Event) => {
    e.preventDefault();

    // seek the navigate 'to' the element
    const navFromValue = navigationFromElement.getAttribute(
      navFromAttributeName
    );
    if (navFromValue) {
      const navigationToElement = navigationToElements.find(
        (n) =>
          n.attributes.getNamedItem(navTottributeName)?.nodeValue ===
          navFromValue
      ) as HTMLElement;
      if (navigationToElement && main) {
        // smooth scroll to it
        main.scroll({
          top: navigationToElement.offsetTop,
          behavior: "smooth",
        });
      }
    }

    // activate | deactivate the nodes in tree view
    navigationFromElements.forEach((navFromElement) => {
      if (navFromElement !== navigationFromElement) {
        navFromElement.parentElement?.classList.remove("active");
      } else {
        navFromElement.parentElement?.classList.add("active");
      }
    });
  });
});

// -----------------------------------------------------------------------------
// Managing of the localizations in the whole application
// -----------------------------------------------------------------------------

import englishJson from "./localizations/english.json";
import frenchJson from "./localizations/french.json";

const localizableAttributeName = "data-translate";
const languageAttributeName = "data-language";
const languageStoreKey = "language";

const localizations: Localizations[] = [];

interface Localizations {
  language: string;
  translations: KeyValuePairs;
}

interface KeyValuePairs {
  [key: string]: string;
}

// gets all localizable elements
const localizableElements = Array.from(
  document.querySelectorAll(`[${localizableAttributeName}]`)
);

// gets all available languages
const languages = Array.from(
  document.querySelectorAll(`[${languageAttributeName}]`)
);

// adds language button click event handler
languages.forEach((language) => {
  language.addEventListener("click", (e: Event) => {
    e.preventDefault();

    // stores the new language
    const languageKeyValue = language.attributes.getNamedItem(
      languageAttributeName
    );
    if (languageKeyValue) {
      localStorage.setItem(languageStoreKey, languageKeyValue.value);

      // reevaluates the localizations
      runLocalizations(languageKeyValue.value);
    }
  });
});

// initializes the language following the stored or default value
function initLanguage(): string {
  let language = localStorage.getItem(languageStoreKey);
  if (language === null) {
    language = "english";
    localStorage.setItem(languageStoreKey, language);
  }

  return language;
}

// converts all localizable strings
function runLocalizations(language: string) {
  if (language) {
    const countryLocalizations = localizations.find(
      (l) => l.language === language
    );

    if (countryLocalizations) {
      localizableElements.forEach((localizableElement) => {
        const localizationKey = localizableElement.attributes.getNamedItem(
          localizableAttributeName
        );
        if (localizationKey) {
          const value =
            countryLocalizations.translations[localizationKey.value];
          if (value) {
            localizableElement.innerHTML = value;
          } else {
            localizableElement.innerHTML = localizationKey.value;
          }
        }
      });
    }
  }
}

// localizations entry method
function run() {
  const language = initLanguage();

  try {
    let rawLocalizations = [];
    rawLocalizations.push({ language: "english", json: englishJson });
    rawLocalizations.push({ language: "french", json: frenchJson });

    rawLocalizations.forEach((element) => {
      const languageKvp = element.json as KeyValuePairs;

      localizations.push({
        language: element.language,
        translations: languageKvp,
      });
    });
  } catch (e) {
    console.error(e);
  }

  runLocalizations(language);
}

run();
