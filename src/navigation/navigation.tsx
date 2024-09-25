import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Translation } from 'react-i18next';
import Main from '../main/main'; 

import logoMobile from '../images/logo.svg';

require('./navigation.css');

interface INavigationItems {
    to: string,
    name: string,
}

class Navigation extends React.Component<any> {
    menuItems : INavigationItems[] = [];

    getNavLinkClass = (path: string) => {
        return this.props.location.pathname === path ? 'current' : '';
    }

    render() {
        return (
            <Translation ns="common">{(t) => (
                <nav className="nav-main yamm navbar" id="main-navigation-example">
                    <h2 className="sr-only">Navigation</h2>
                    <section className="nav-mobile">
                        <div className="table-row">
                            <div className="nav-mobile-header">
                                <div className="table-row">
                                    <span className="nav-mobile-logo">
                                        <img src={logoMobile} alt="Confederatio Helvetica" />
                                    </span>
                                    <h1>{t('headerProjectTitle')}</h1>
                                </div>
                            </div>
                            <div className="table-cell dropdown">
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <div className="drilldown dropdown-menu" role="menu">
                                    <div className="drilldown-container">
                                        <nav className="nav-page-list">
                                            <ul>
                                                {this.menuItems.map((item) => (
                                                    <React.Fragment key={item.name}>
                                                        {(item.to) && (
                                                            <li className={this.getNavLinkClass(item.to)}>
                                                                <NavLink exact activeClassName={'is-active'} to={item.to}>
                                                                    {t(`navItem${item.name}`)}
                                                                </NavLink>
                                                            </li>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </ul>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content */}
                                            <a href="#" className="yamm-close-bottom"><span className="icon icon--top" aria-hidden="true"></span></a>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <Main>
                        <ul className="nav navbar-nav nomargin">
                            {this.menuItems.map((item) => (
                                <React.Fragment key={item.name}>
                                    {(item.to) && (
                                        <li className={`dropdown yamm-fw ${this.getNavLinkClass(item.to)}`}>
                                            <NavLink exact activeClassName={'is-active'} to={item.to}>
                                                {t(`navItem${item.name}`)}
                                            </NavLink>
                                        </li>
                                    )}
                                </React.Fragment>
                            ))}
                        </ul>
                    </Main>
                </nav>
            )}</Translation>
        );
    }
}

export default Navigation;
