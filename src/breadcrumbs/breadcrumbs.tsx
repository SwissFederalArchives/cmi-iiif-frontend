import * as React from 'react';
import i18next from 'i18next';
import { Translation } from 'react-i18next';
import { getRootline } from './breadcrumbs.data';

import './breadcrumbs.css';
import { sanitizeRulesSet } from '../lib/ManifestHelpers';
import * as DOMPurify from 'dompurify';

const Breadcrumbs = () => {
  const rootline = getRootline(i18next.language);

  return (
    <Translation ns='common'>
      {t =>
        rootline ? (
          <>
            <nav className='iiif-header-breadcrumbs navbar treecrumb pull-left'>
              <h2 className='sr-only'>{rootline.header}</h2>
              <ul className='nav navbar-nav'>
                {rootline.levels.map((lvl: any) => (
                  <li key={lvl.id} className='dropdown'>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                      id={`${lvl.id}-dropdown`}
                      href={lvl.href ? lvl.href : '#'}
                      className='dropdown-toggle'
                      data-toggle={lvl.header && 'dropdown'}
                    >
                      {lvl.header && <span className='icon icon--right' />} {lvl.toggle}
                    </a>
                    {lvl.header && (
                      <ul className='dropdown-menu' role='menu' aria-labelledby={`${lvl.id}-dropdown`}>
                        <li className='dropdown-header'>
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a href={DOMPurify.sanitize(lvl.header.href, sanitizeRulesSet)} target='_blank'
                             rel='noreferrer' title=''>
                            {lvl.header.label}
                          </a>
                          {lvl.items &&
                            lvl.items.map((item: any) => (
                              <ul key={item.href}>
                                <li>
                                  <a href={DOMPurify.sanitize(item.href, sanitizeRulesSet)} target='_blank' rel='noreferrer' title=''>
                                    {' '}
                                    {item.label}
                                  </a>
                                </li>
                              </ul>
                            ))}
                        </li>
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </>
        ) : null
      }
    </Translation>
  );
};

export default Breadcrumbs;
