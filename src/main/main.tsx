import React from 'react';
import './main.css';

interface IProps {
    children?: JSX.Element;
}

export default function Main(props: IProps) {
    const containerClassName = 'aiiif-main container';
    const { children } = props;
    return <div className={containerClassName}>
        <div className="row">
            <div className="col-xs-12 nomarginbottom">
                <div className="container-fluid">
                    {children}
                </div>
            </div>
        </div>
    </div>;
}

