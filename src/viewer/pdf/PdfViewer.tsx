import React, {useContext} from "react";
import {AppContext} from "../../AppContext";
import i18next from "i18next";

export default function PdfViewer() {

    const pdfjsUrl = `vendor/pdfjs/web/viewer.html`;

    const {currentManifest} = useContext(AppContext);
    if (!currentManifest || !currentManifest.resource) {
        return <></>;
    }

    const id = currentManifest.resource.id;

    return <iframe className="aiiif-viewer" src={`${pdfjsUrl}?file=${id}#locale=${i18next.language}`} title={id} />;
}
