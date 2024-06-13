import {Note, LoadResults} from "trilium/frontend";


/**
 * A widget to show note breadcrumbs at the bottom of the page.
 */
const TPL = `<div id="breadcrumbs-bar">
<div id="history-buttons">
    <button onclick="window.history.back()" class="tree-floating-button bx bx-left-arrow-circle tree-settings-button" title="Go Back"></button>
    <button onclick="window.history.forward()" class="tree-floating-button bx bx-right-arrow-circle tree-settings-button" title="Go Back"></button>
</div>
<div id="breadcrumbs"></div>
</div>`;

const styles = `
/* Place your CSS below this */

#breadcrumbs-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-top: 1px solid var(--main-border-color);
    border-bottom: 1px solid var(--main-border-color);
    contain: none;
}

#breadcrumbs-bar.bottom {
    border-bottom: 0;
}

.note-split > #breadcrumbs-bar {
    border-top: 0;
    margin: 0 5px 0 10px;
    padding: 10px 10px 15px 10px;
}

#breadcrumbs-bar.borderless {
    border: 0;
}

#breadcrumbs {
    display: flex;
    align-items: center;
    gap: 6px;
}

#breadcrumbs a {
    display: inline-flex;
    line-height: 1;
    padding: 5px 10px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    transition: transform 200ms ease, background-color 200ms ease, filter 200ms ease;
}

#breadcrumbs a:hover {
    text-decoration: none;
    background-color: rgba(255, 255, 255, 0.2);
    filter: brightness(1.2);
    transform: translateY(-3px);
}

#history-buttons {
    display: inline-flex;
    white-space: nowrap;
}

#breadcrumbs span a {
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
    display: inherit;
}

/* Place your CSS above this */`;

const position = api.startNote.getLabelValue("breadcrumbsPosition") ?? "";

class BreadcrumbWidget extends api.NoteContextAwareWidget {
    title: string;
    $breadcrumbs: JQuery;

    get position() {return position === "bottom" ? 100 : position === "top" ? 1 : 50;}
    static get parentWidget() {return (position === "bottom" || position === "top") ? "center-pane" : "note-detail-pane";}

    constructor() {
        super();
        this.title = "";
    }

    isEnabled() {
        if (!super.isEnabled()) return false;
        const widgetDisable = api.startNote.hasLabel("breadcrumbsDisable");
        const noteDisable = this.note.hasLabel("breadcrumbsDisable");
        return !widgetDisable && !noteDisable;
    }

    doRender() {
        this.$widget = $(TPL);
        this.$breadcrumbs = this.$widget.find("#breadcrumbs");
        this.updateStyles();
        if (position === "bottom") this.$widget.addClass("bottom");
        if (api.startNote.hasLabel("borderless")) this.$widget.addClass("borderless");
        this.cssBlock(styles);
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
            this.refresh();
        }
    }

    async makeBreadcrumb() {
        this.$breadcrumbs.empty();
        const notePath = api.getActiveContextNotePath()?.split("/") ?? [];
        for (let n = 0; n < notePath.length; n++) {
            const path = notePath.slice(0, n + 1);
            const link = await api.createLink(path.join("/"));
            this.$breadcrumbs.append(link);
            if (n < (notePath.length - 1)) this.$breadcrumbs.append("/");
        }
    }

    updateStyles() {
        const buttonWrapper = this.$widget.find("#history-buttons");
        if (!buttonWrapper) return; // This should never happen but... just in case
        const isVisible = buttonWrapper.css("display") !== "none";
        const shouldHide = api.startNote.hasLabel("disableHistory");
        if (isVisible && shouldHide) buttonWrapper.hide();
        if (!isVisible && !shouldHide) buttonWrapper.show();
    }
}

module.exports = BreadcrumbWidget;