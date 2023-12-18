import * as React from 'react';
import Config from '../lib/Config';
import i18n from 'i18next';

interface IState {
    anchorEl: HTMLDivElement | null
}

declare let global: {
    config: Config;
};

class LanguageSwitcher extends React.Component<any, IState> {
    constructor(props: any) {

        super(props);

        this.state = {
            anchorEl: null
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    render() {
        const supportedLanguages = global.config.getSupportedLanguages();
        return (
            <nav className="nav-lang noborder">
                <ul>
                    {Object.entries(supportedLanguages).map(([langKey]) => {
                        const isActive = i18n.language === langKey;
                        return (
                            <li key={langKey.toLowerCase()}>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a
                                    href="#"
                                    className={isActive ? 'active': ''}
                                    onClick={(ev) => {ev.preventDefault(); this.changeLanguage(langKey.toLowerCase())}}
                                    title={langKey}
                                    aria-label={langKey}
                                >{supportedLanguages[langKey].toUpperCase()}</a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }

    open(event: React.MouseEvent<HTMLDivElement>) {
        this.setState({ anchorEl: event.currentTarget });
    }

    close() {
        this.setState({ anchorEl: null });
    }

    changeLanguage(code: string) {
        this.close();
        const supportedLanguages = global.config.getSupportedLanguages();
        i18n.changeLanguage( supportedLanguages[code].toLowerCase());
    }
}

export default LanguageSwitcher;
