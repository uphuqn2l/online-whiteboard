/**
 * Whiteboard designer class for element drawing.
 */
WhiteboardDesigner = function(witeboardConfig) {
    var config = witeboardConfig;

    // create jQuery objects for whiteboard container and dialogs
    var whiteboard = jQuery("#" + config.ids.whiteboard);
    var dialogInputText = jQuery("#" + config.ids.dialogInputText);
    var dialogInputImage = jQuery("#" + config.ids.dialogInputImage);
    var dialogIcons = jQuery("#" + config.ids.dialogIcons);

    var offsetLeft = whiteboard.offset().left;
    var offsetTop = whiteboard.offset().top;

    jQuery.extend(whiteboard, {
        "lineEl": {"path": null, "pathArray": null},
        "imageEl": {"cx": 0, "cy": 0},
        "iconEl": {"cx": 0, "cy": 0},
        "textEl": {"cx": 0, "cy": 0}
    });

    var modeSwitcher = {
        "selectMode": [false, null],
        "moveMode": [false, null],
        "textMode": [false, "Text"],
        "freeLineMode": [false, "FreeLine"],
        "straightLineMode": [false, "StraightLine"],
        "rectangleMode": [false, "Rectangle"],
        "circleMode": [false, "Circle"],
        "ellipseMode": [false, "Ellipse"],
        "imageMode": [false, "Image"],
        "iconMode": [false, "Icon"],
        "cloneMode": [false, null],
        "removeMode": [false, null],
        "clearMode": [false, null],
        "resizeMode": [false, null]
    };

    var selectedObj = null;
    var _self = this;

    // create raphael canvas
    var paper = Raphael(config.ids.whiteboard, whiteboard.width(), whiteboard.height());

    // public access =======================

    this.switchToMode = function(mode, cursor) {
        for (var name in modeSwitcher) {
            modeSwitcher[name][0] = false;
        }
        modeSwitcher[mode][0] = true;
        whiteboard.css("cursor", cursor);
    }

    this.drawFreeLineBegin = function(x, y) {
        whiteboard.lineEl.path = paper.path("M" + (x - offsetLeft) + "," + (y - offsetTop));
        whiteboard.lineEl.path.attr({stroke: "#000000", "stroke-width": 3});
        whiteboard.bind("mousemove.mmu", mousemoveHandler);
        whiteboard.one("mouseup.mmu", mouseupHandler);
    }

    this.drawStraightLineBegin = function(x, y) {
        whiteboard.lineEl.pathArray = [];
        whiteboard.lineEl.pathArray[0] = ["M", x - offsetLeft, y - offsetTop];
        whiteboard.lineEl.path = paper.path(whiteboard.lineEl.pathArray);
        whiteboard.lineEl.path.attr({stroke: "#000000", "stroke-width": 3});
        whiteboard.bind("mousemove.mmu", mousemoveHandler);
        whiteboard.one("mouseup.mmu", mouseupHandler);
    }

    this.drawText = function(inputText) {
        if (inputText !== "") {
            var textElement = paper.text(whiteboard.textEl.cx, whiteboard.textEl.cy, inputText);
            textElement.attr("font-size", "18");
            drawHelperBox(textElement);
        }
    }

    this.drawImage = function(inputUrl, width, height) {
        if (inputUrl !== "") {
            var imageElement = paper.image(inputUrl, whiteboard.imageEl.cx, whiteboard.imageEl.cy, width, height);
            drawHelperBox(imageElement);
        }
    }

    this.drawRectangle = function(x, y) {
        var rectElement = paper.rect(x - offsetLeft, y - offsetTop, 160, 100, 0);
        rectElement.attr("fill", "#9ACD32");
        drawHelperBox(rectElement);
    }

    this.drawCircle = function(x, y) {
        var circleElement = paper.circle(x - offsetLeft, y - offsetTop, 70);
        circleElement.attr("fill", "#008080");
        circleElement.scale(1, 1);  // workaround for webkit based browsers
        drawHelperBox(circleElement);
    }

    this.drawEllipse = function(x, y) {
        var ellipseElement = paper.ellipse(x - offsetLeft, y - offsetTop, 80, 50);
        ellipseElement.attr("fill", "#BA55D3");
        drawHelperBox(ellipseElement);
    }

    this.openTextDialog = function(x, y) {
        whiteboard.textEl.cx = x - offsetLeft;
        whiteboard.textEl.cy = y - offsetTop;
        dialogInputText.dialog("open");
    }

    this.openImageDialog = function(x, y) {
        whiteboard.imageEl.cx = x - offsetLeft;
        whiteboard.imageEl.cy = y - offsetTop;
        dialogInputImage.dialog("open");
    }

    this.openIconsDialog = function(x, y) {
        whiteboard.iconEl.cx = x - offsetLeft;
        whiteboard.iconEl.cy = y - offsetTop;
        dialogIcons.dialog("open");
    }

    this.clearWhiteboard = function() {
        paper.clear();
    }

    // private access =======================

    // register handlers for drag & drop on element
    var ddStartEl = function () {
        if (!modeSwitcher.moveMode[0]) {
            return false;
        }

        this.odx = 0;
        this.ody = 0;
        this.attr("cursor", "move");
        this.element.toFront();
        this.circleSet.toFront();
        this.toFront();
    }

    var ddMoveEl = function (dx, dy) {
        if (!modeSwitcher.moveMode[0]) {
            return false;
        }

        this.element.translate(dx - this.odx, dy - this.ody);
        this.translate(dx - this.odx, dy - this.ody);
        this.circleSet.translate(dx - this.odx, dy - this.ody);
        this.odx = dx;
        this.ody = dy;
    }

    var ddStopEl = function () {
        if (!modeSwitcher.moveMode[0]) {
            return false;
        }

        this.attr("cursor", "default");
    }

    // register hover on element
    var hoverOverEl = function (event) {
        if (modeSwitcher.selectMode[0]) {
            this.attr(config.attributes.selectBoxVisible);
            this.attr("cursor", "default");
            return true;
        }

        if (modeSwitcher.moveMode[0]) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.circleSet.attr(config.attributes.opacityHidden);
            }
            this.attr(config.attributes.moveBoxVisible);
            this.attr("cursor", "move");
            return true;
        }

        if (modeSwitcher.removeMode[0]) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.circleSet.attr(config.attributes.opacityHidden);
            }
            this.attr(config.attributes.removeBoxVisible);
            this.attr("cursor", "crosshair");
            return true;
        }

        this.attr("cursor", whiteboard.css("cursor"));
    }

    var hoverOutEl = function (event) {
        if (modeSwitcher.selectMode[0]) {
            if (selectedObj == null || selectedObj.uuid != this.uuid) {
                this.attr(config.attributes.opacityHidden);
            }
            return true;
        }

        if (modeSwitcher.moveMode[0]) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.attr(config.attributes.selectBoxVisible);
                this.circleSet.attr(config.attributes.opacityVisible);
            } else {
                this.attr(config.attributes.opacityHidden);
            }
            this.attr("cursor", "default");
            return true;
        }

        if (modeSwitcher.removeMode[0]) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.attr(config.attributes.selectBoxVisible);
                this.circleSet.attr(config.attributes.opacityVisible);
            } else {
                this.attr(config.attributes.opacityHidden);
            }
        }
    }

    // register handler for click on element
    var clickEl = function(event) {
        if (modeSwitcher.selectMode[0]) {
            this.circleSet.attr(config.attributes.opacityVisible);
            if (selectedObj != null && selectedObj.uuid != this.uuid) {
                // hide last selection
                selectedObj.attr(config.attributes.opacityHidden);
                selectedObj.circleSet.attr(config.attributes.opacityHidden);
            }
            selectedObj = this;
            return true;
        }

        if (modeSwitcher.removeMode[0]) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                // last selected object = this object ==> reset
                selectedObj = null;
            }
            this.element.remove();
            this.circleSet.remove();
            this.remove();
            return true;
        }

        return false;
    }

    // mousedown, mousemove and mouseup handlers on whiteboard
    var mousedownHandler = function (event) {
        if (modeSwitcher.freeLineMode[0]) {
            _self.drawFreeLineBegin(event.pageX, event.pageY);
            return false;
        }

        if (modeSwitcher.straightLineMode[0]) {
            _self.drawStraightLineBegin(event.pageX, event.pageY);
            return false;
        }

        return false;
    }

    var mousemoveHandler = function (event) {
        if (modeSwitcher.freeLineMode[0]) {
            whiteboard.lineEl.path.attr("path", whiteboard.lineEl.path.attr("path") + "L" + (event.pageX - offsetLeft) + "," + (event.pageY - offsetTop));
            return true;
        }

        if (modeSwitcher.straightLineMode[0]) {
            whiteboard.lineEl.pathArray[1] = ["L", event.pageX - offsetLeft, event.pageY - offsetTop];
            whiteboard.lineEl.path.attr("path", whiteboard.lineEl.pathArray);
            return true;
        }
    }

    var mouseupHandler = function () {
        whiteboard.unbind(".mmu");
        if (whiteboard.lineEl.path) {
            drawHelperBox(whiteboard.lineEl.path);
            whiteboard.lineEl.path = null;
            whiteboard.lineEl.pathArray = null;
        }
    }

    // click handler on whiteboard
    var clickHandler = function(event) {
        if (modeSwitcher.rectangleMode[0]) {
            _self.drawRectangle(event.pageX, event.pageY);
            return true;
        }

        if (modeSwitcher.circleMode[0]) {
            _self.drawCircle(event.pageX, event.pageY);
            return true;
        }

        if (modeSwitcher.ellipseMode[0]) {
            _self.drawEllipse(event.pageX, event.pageY);
            return true;
        }

        if (modeSwitcher.imageMode[0]) {
            _self.openImageDialog(event.pageX, event.pageY);
            return true;
        }

        if (modeSwitcher.iconMode[0]) {
            _self.openIconsDialog(event.pageX, event.pageY);
            return true;
        }

        if (modeSwitcher.textMode[0]) {
            _self.openTextDialog(event.pageX, event.pageY);
            return true;
        }

        return false;
    }

    // mouseleave handler on whiteboard
    var mouseleaveHandler = function(event) {
        if (modeSwitcher.freeLineMode[0] || modeSwitcher.straightLineMode[0]) {
            mouseupHandler();
        }

        return false;
    }

    var drawHelperBox = function(el) {
        // draw helper rectangle around the element
        var bbox = el.getBBox();
        var helperRect = paper.rect(bbox.x - 1, bbox.y - 1, (bbox.width !== 0 ? bbox.width + 2 : 3), (bbox.height !== 0 ? bbox.height + 2 : 3));
        helperRect.attr(config.attributes.helperRect);
        helperRect.hover(hoverOverEl, hoverOutEl);
        helperRect.click(clickEl);
        helperRect.drag(ddMoveEl, ddStartEl, ddStopEl);

        // draw invisible circles for possible later selection
        var c1 = paper.circle(bbox.x, bbox.y, 3);
        var c2 = paper.circle(bbox.x + bbox.width, bbox.y, 3);
        var c3 = paper.circle(bbox.x, bbox.y + bbox.height, 3);
        var c4 = paper.circle(bbox.x + bbox.width, bbox.y + bbox.height, 3);

        // build a set
        var circleSet = paper.set();
        circleSet.push(c1, c2, c3, c4);
        circleSet.attr(config.attributes.circleSet);

        // set references
        helperRect.element = el;
        helperRect.circleSet = circleSet;
        helperRect.uuid = uuid();
        for (var name in modeSwitcher) {
            if (modeSwitcher[name][0]) {
                helperRect.classType = modeSwitcher[name][1];
                break;
            }
        }

        return helperRect;
    }

    // draw icons in the "choose icon" dialog
    var drawIcons = function() {
        var x = 0, y = 0;
        var fillStroke = {fill: "#000", stroke: "none"};
        var fiilNone = {fill: "#000", opacity: 0};
        var fillHover = {fill: "90-#0050af-#002c62", stroke: "#FF0000"};
        var iconPaper = Raphael("iconsArea", 600, 360);
        var wbIcons = config.svgIconSet;

        for (var name in wbIcons) {
            var curIcon = iconPaper.path(wbIcons[name]).attr(fillStroke).translate(x, y);
            curIcon.offsetX = x + 20;
            curIcon.offsetY = y + 20;
            var overlayIcon = iconPaper.rect(x, y, 40, 40).attr(fiilNone);
            overlayIcon.icon = curIcon;
            overlayIcon.click(function () {
                dialogIcons.dialog("close");
                var iconElement = paper.path(this.icon.attr("path")).attr(fillStroke).translate(whiteboard.iconEl.cx - this.icon.offsetX, whiteboard.iconEl.cy - this.icon.offsetY);
                drawHelperBox(iconElement);

            }).hover(function () {
                this.icon.attr(fillHover);
            }, function () {
                this.icon.attr(fillStroke);
            });
            x += 40;
            if (x > 560) {
                x = 0;
                y += 40;
            }
        }
    }

    // initialize whiteboard
    // 1. register handlers on whiteboard
    whiteboard.bind("click", clickHandler);
    whiteboard.bind("mousedown", mousedownHandler);
    whiteboard.bind("mouseleave", mouseleaveHandler);
    // 2. draw icons
    drawIcons();
}