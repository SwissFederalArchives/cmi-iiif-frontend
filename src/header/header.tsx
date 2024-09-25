import * as React from 'react';
import Config from '../lib/Config';
import { Translation } from 'react-i18next';

import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import Navigation from '../navigation/navigation';
import logo from '../images/logo.svg';
import LanguageSwitcher from '../languageSwitcher/languageSwitcher';

require('./header.css');

declare let global: {
  config: Config;
};
class Header extends React.Component<any> {


  render() {
    const hasBreadcrumbs : boolean = global.config.getBreadcrumbsShow();

    if (hasBreadcrumbs) {
      return (
      <Translation ns="common">
        {t => (
          <>
            <header>
              <Breadcrumbs />
              <section className="nav-services clearfix">
                <h2 className="sr-only">{t('languageSelection')}</h2>
                <LanguageSwitcher />
              </section>
              <div className="brand hidden-xs">
                <img alt={t('logoAlt')} src={logo} />
                <h1>
                  {t('headerProjectTitle')}
                  <br />
                  {t('headerProjectSubtitle')}
                </h1>
              </div>
            </header>
            <Navigation />
          </>
        )}
      </Translation>
      )
    } else {
      return (
      <Translation ns="common">
        {t => (
          <>
            <header>
              <section className="nav-services clearfix">
                <h2 className="sr-only">{t('languageSelection')}</h2>
                <LanguageSwitcher />
              </section>
              <div className="brand hidden-xs">
                <img alt={t('logoAlt')} src={logo} />
                <h1>
                  {t('headerProjectTitle')}
                  <br />
                  {t('headerProjectSubtitle')}
                </h1>
              </div>
            </header>
            <Navigation />
          </>
        )}
      </Translation>
      )
    }
  }
}


export default Header;
