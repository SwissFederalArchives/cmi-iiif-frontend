import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import i18next from 'i18next';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

interface IProps {
    icon: IconProp;
    name: string;
    active: boolean;
    badge?: boolean;
    setTab: (currentTab: string) => void;
}

export default function TabButton(props: IProps) {
    const classes = [];
    if (props.badge) {
        classes.push('has-badge');
    }
    if (props.active) {
        classes.push('active');
        return <button className={classes.join(' ')}>
            <FontAwesomeIcon icon={props.icon} title={i18next.t('common:' + props.name)}/>
        </button>;
    }

    return<button className={classes.join(' ')} onClick={() => props.setTab(props.name)}>
            <FontAwesomeIcon icon={props.icon} title={i18next.t('common:' + props.name)}/>
        </button>;
}
