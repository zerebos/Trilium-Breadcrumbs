/**
 * A widget to show note breadcrumbs at the bottom of the page.
 */
const TPL = `<div style="padding: 10px; border-top: 1px solid var(--main-border-color); contain: none;"><div id="breadcrumbs"></div></div>`;

const styles = `
/* Place your CSS below this */



/* Place your CSS above this */`;


class BreadcrumbWidget extends api.NoteContextAwareWidget {
    get position() {return 100;}
    get parentWidget() {return "center-pane";}

    constructor() {
        super();
        this.title = "";
    }

    isEnabled() {
        if (!super.isEnabled()) return false;
        const widgetDisable = api.startNote.hasLabel("disable");
        const noteDisable = this.note.hasLabel("breadcrumbsDisable");
        return !widgetDisable && !noteDisable;
    }

    doRender() {
        this.$widget = $(TPL);
        this.$breadcrumbs = this.$widget.find("#breadcrumbs");
        this.cssBlock(styles);
        return this.$widget;
    }

    async refreshWithNote(note) {
        await this.makeBreadcrumb(note);
    }

    async entitiesReloadedEvent() {
        if (!this.title) this.title = this.note.title;
        if (this.note.title != this.title) {
            this.title = this.note.title;
            this.refresh();
        }
    }

    async makeBreadcrumb(note) {
        this.$breadcrumbs.empty();
        const notePath = note.getBestNotePath();
        for (let n = 0; n < notePath.length; n++) {
            const path = notePath.slice(0, n + 1);
            const link = await api.createNoteLink(path.join("/"));
            this.$breadcrumbs.append(link);
            if (n < (notePath.length - 1)) this.$breadcrumbs.append(" / ");
        }
    }
}

module.exports = new BreadcrumbWidget();