import type JQuery from "jquery";
import type {LoadResults} from "trilium/frontend";
import template from "./template.html";
import styles from "./styles.css";


const position = api.startNote.getLabelValue("position") ?? "center";
class BreadcrumbWidget extends api.NoteContextAwareWidget {
    title: string;
    $breadcrumbs: JQuery;
    styleElement: HTMLStyleElement;

    get position() {return position === "bottom" ? 100 : position === "top" ? 1 : 50;}
    static get parentWidget() {return (position === "bottom" || position === "top") ? "center-pane" : "note-detail-pane";}

    constructor() {
        super();
        this.title = "";
    }

    isEnabled() {
        if (!super.isEnabled()) return false;
        const widgetDisable = api.startNote.getLabelValue("globalDisable") === "true";
        const noteDisable = this.note?.hasLabel("breadcrumbsDisable");
        return !widgetDisable && !noteDisable;
    }

    doRender() {
        this.$widget = $(template);
        this.$breadcrumbs = this.$widget.find("#breadcrumbs");
        this.updateStyles();
        const maxWidth = api.startNote.getLabelValue("maxCrumbWidth") ?? 250;
        const maxCrumbWidth = `#breadcrumbs span a { max-width: ${maxWidth}px; }`;
        this.cssBlock(`${styles}\n${maxCrumbWidth}`);
        return this.$widget;
    }

    async refreshWithNote() {
        await this.makeBreadcrumb();
    }

    async entitiesReloadedEvent({loadResults}: {loadResults: LoadResults}) {
        if (loadResults?.attributeRows?.length) this.updateStyles();
        if (!this.note) {
            this.title = "";
            return;
        }
        if (!this.title) this.title = this.note.title;
        if (this.note.title != this.title) {
            this.title = this.note.title;
            await this.refresh();
        }
    }

    async makeBreadcrumb() {
        this.$breadcrumbs.empty();
        const notePath = api.getActiveContextNotePath()?.split("/") ?? [];
        const totalCrumbs = notePath.length;
        // Use user defined value from promoted attribute
        const maxBreadcrumbs = api.startNote.getLabelValue("maxBreadcrumbs") ?? 15; // default value
        // Hide breadcrumbs if they exceed the maximum allowed
        const startIndex = Math.max(0, totalCrumbs - maxBreadcrumbs);

        if (startIndex > 0) {
            this.$breadcrumbs.append(`<span>...</span>`);
        }

        for (let n = startIndex; n < totalCrumbs; n++) {
            const path = notePath.slice(0, n + 1);
            const link = await api.createLink(path.join("/"));
            this.$breadcrumbs.append(link);
            if (n < (totalCrumbs - 1)) this.$breadcrumbs.append("/");
        }
    }

    updateStyles() {
        this.updateHistoryButtons();
        this.updateWidths();
        this.updateBorders();
        this.updatePosition();
    }

    updateHistoryButtons() {
        const buttonWrapper = this.$widget.find("#history-buttons");
        if (!buttonWrapper) return; // This should never happen but... just in case
        const isVisible = buttonWrapper.css("display") !== "none";
        const shouldHide = api.startNote.getLabelValue("hideHistory") === "true";
        if (isVisible && shouldHide) buttonWrapper.hide();
        if (!isVisible && !shouldHide) buttonWrapper.show();
    }

    updateWidths() {
        // TODO: de-dup with doRender
        const maxWidth = api.startNote.getLabelValue("maxCrumbWidth") ?? 250;
        const maxCrumbWidth = `#breadcrumbs span a { max-width: ${maxWidth}px; }`;
        if (!this.styleElement) this.styleElement = this.$widget.find("style").first()[0];
        if (this.styleElement) this.styleElement.textContent = `${styles}\n${maxCrumbWidth}`;
    }

    updateBorders() {
        const shouldHide = api.startNote.getLabelValue("hideBorders") === "true";
        const isVisible = !this.$widget.hasClass("borderless");
        if (isVisible && shouldHide) this.$widget.addClass("borderless");
        if (!isVisible && !shouldHide) this.$widget.removeClass("borderless");
    }

    updatePosition() {
        if (position === "bottom") this.$widget.addClass("bottom");
    }
}

module.exports = BreadcrumbWidget;
