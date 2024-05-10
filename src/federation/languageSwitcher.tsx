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
        const languages: object = global.config.getTranslations();

        return (
            <nav className="nav-lang noborder">
                <ul>
                    {Object.entries(languages).map(([langKey, langLabel]) => {
                        const isActive = i18n.language === langKey;
                        return (
                            <li key={langKey}>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a 
                                    href="#"
                                    className={isActive ? 'active': ''} 
                                    onClick={(ev) => {ev.preventDefault(); this.changeLanguage(langKey)}} 
                                    title={langLabel} 
                                    aria-label={langLabel}
                                >{langKey.toUpperCase()}</a>
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
        i18n.changeLanguage(code);
    }
}

export default LanguageSwitcher;
