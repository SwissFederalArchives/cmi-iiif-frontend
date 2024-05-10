import * as React from 'react';
import { Translation } from "react-i18next";
import logo from '../images/logo-CH.svg';

require('./footer.css');

class FederationFooter extends React.Component<any> {
    render() {
        return (
            <Translation ns="common">
                {(t) => (
                    <div className="mod_federation-footer">
                        <footer>
                            <div className="container-fluid">
                                <img className="visible-xs" alt='back to home' src={logo} />
                            </div>

                            <div className="footer-address">
                                <span className="hidden-xs">{t('footerTitle')}</span>
                                <nav className="pull-right">
                                    <ul>
                                        <li><a href={t('footerTermsAndConditionsLink')} target="_blank">{t('footerTermsAndConditionsLabel')}</a></li>
                                        <li><a href={t('footerContactLink')} target="_blank">{t('footerContactLabel')}</a></li>
                                    </ul>
                                </nav>
                            </div>
                        </footer>
                    </div>
                )}
            </Translation>
        );
    }
}

export default FederationFooter;
