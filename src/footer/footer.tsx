import * as React from 'react';
import { Translation } from "react-i18next";
import logo from '../images/logo.svg';
import * as DOMPurify from 'dompurify';
import { sanitizeRulesSet } from '../lib/ManifestHelpers';

require('./footer.css');

class Footer extends React.Component<any> {
    render() {
        return (
            <Translation ns="common">
                {(t) => (
                    <div className="mod-footer">
                        <footer>
                            <div className="container-fluid">
                                <img className="visible-xs" alt='back to home' src={logo} />
                            </div>

                            <div className="footer-address">
                                <span className="hidden-xs">{t('footerTitle')}</span>
                                <nav className="pull-right">
                                    <ul>
                                        <li><a href={DOMPurify.sanitize(t('footerTermsAndConditionsLink'), sanitizeRulesSet)} target="_blank">{t('footerTermsAndConditionsLabel')}</a></li>
                                        <li><a href={DOMPurify.sanitize(t('footerContactLink'), sanitizeRulesSet)} target="_blank">{t('footerContactLabel')}</a></li>
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

export default Footer;
