jQuery(function() {
    var parentT = jQuery('#toolboxDialog').parent();
    parentT.css('left', parentT.offset().left - 325 + 'px');

    var parentP = jQuery('#propertiesDialog').parent();
    parentP.css('left', parentP.offset().left - 10 + 'px');

    var parentM = jQuery('#monitoringDialog').parent();
    parentM.css('top', parentM.offset().top - 10 + 'px');

    var toolboxItems = jQuery('.toolboxItem');
    toolboxItems.click(function() {
        toolboxItems.removeClass('ui-state-selected');
        jQuery(this).addClass('ui-state-selected');
    });

    // create global variable for whiteboard designer instance
    whiteboardDesigner = new WhiteboardDesigner('whiteboard', 'dialogIcons', 'dialogInputText', svgIconSet);
});

/**
 * Whiteboard designer class for element drawing.
 *
 * @param whiteboardId escaped id of whiteboard container
 * @param dialogIconsId escaped id of "choose icon" dialog
 * @param dialogInputTextId escaped id of "input text" dialog
 * @param svgIconSet icon set in SVG format for using in whiteboard
 */
WhiteboardDesigner = function(whiteboardId, dialogIconsId, dialogInputTextId, svgIconSet) {
    // create jQuery objects for whiteboard container and dialogs
    var whiteboard = jQuery("#" + whiteboardId);
    var dialogIcons = jQuery("#" + dialogIconsId);
    var dialogInputText = jQuery("#" + dialogInputTextId);
    var whiteboardIcons = svgIconSet;

    // create raphael canvas
    var paper = Raphael(whiteboardId, whiteboard.width(), whiteboard.height());

    var offsetLeft = whiteboard.offset().left;
    var offsetTop = whiteboard.offset().top;

    jQuery.extend(whiteboard, {
        "lineEl": {"path": null, "pathArray": null},
        "iconEl": {"cx": 0, "cy": 0},
        "textEl": {"cx": 0, "cy": 0}
    });

    var modeSwitcher = {
        "selectMode": false,
        "textMode": false,
        "freeLineMode": false,
        "straightLineMode": false,
        "rectangleMode": false,
        "circleMode": false,
        "ellipseMode": false,
        "iconMode": false,
        "moveMode": false,
        "removeMode": false,
        "clearMode": false
    };

    var selectedObj = null;
    var _self = this;

    // public access =======================

    this.switchToMode = function(mode, cursor) {
        for (var name in modeSwitcher) {
            modeSwitcher[name] = false;
        }
        modeSwitcher[mode] = true;
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
            drawHelperBox(textElement.getBBox(), textElement);
        }
    }

    this.drawRectangle = function(x, y) {
        var rectElement = paper.rect(x - offsetLeft, y - offsetTop, 160, 100, 0);
        rectElement.attr("fill", "#9ACD32");
        drawHelperBox(rectElement.getBBox(), rectElement);
    }

    this.drawCircle = function(x, y) {
        var circleElement = paper.circle(x - offsetLeft, y - offsetTop, 70);
        circleElement.attr("fill", "#008080");
        circleElement.scale(1, 1);  // workaround for webkit based browsers
        drawHelperBox(circleElement.getBBox(), circleElement);
    }

    this.drawEllipse = function(x, y) {
        var ellipseElement = paper.ellipse(x - offsetLeft, y - offsetTop, 80, 50);
        ellipseElement.attr("fill", "#BA55D3");
        drawHelperBox(ellipseElement.getBBox(), ellipseElement);
    }

    this.openIconsDialog = function(x, y) {
        whiteboard.iconEl.cx = x - offsetLeft;
        whiteboard.iconEl.cy = y - offsetTop;
        dialogIcons.dialog("open");
    }

    this.openTextDialog = function(x, y) {
        whiteboard.textEl.cx = x - offsetLeft;
        whiteboard.textEl.cy = y - offsetTop;
        dialogInputText.dialog("open");
    }

    this.clearWhiteboard = function() {
        paper.clear();
    }

    // private access =======================

    // register handlers for drag & drop on element
    var ddStartEl = function () {
        if (!modeSwitcher.moveMode) {
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
        if (!modeSwitcher.moveMode) {
            return false;
        }

        this.element.translate(dx - this.odx, dy - this.ody);
        this.translate(dx - this.odx, dy - this.ody);
        this.circleSet.translate(dx - this.odx, dy - this.ody);
        this.odx = dx;
        this.ody = dy;
    }

    var ddStopEl = function () {
        if (!modeSwitcher.moveMode) {
            return false;
        }

        this.attr("cursor", "default");
    }

    // register hover on element
    var hoverOverEl = function (event) {
        if (modeSwitcher.selectMode) {
            this.attr({"stroke": "#0D0BF5", "stroke-opacity": 0.8, "stroke-width": 2, "fill-opacity": 0, "stroke-dasharray": "."});
            this.attr("cursor", "default");
            return true;
        }

        if (modeSwitcher.moveMode) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.circleSet.attr({"stroke-opacity": 0, "fill-opacity": 0});
            }
            this.attr({"stroke": "#0D0BF5", "stroke-opacity": 0.8, "stroke-width": 2, "fill": "#0276FD", "fill-opacity": 0.2, "stroke-dasharray": "-"});
            this.attr("cursor", "move");
            return true;
        }

        if (modeSwitcher.removeMode) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.circleSet.attr({"stroke-opacity": 0, "fill-opacity": 0});
            }
            this.attr({"stroke": "#FF0000", "stroke-opacity": 0.8, "stroke-width": 2, "fill": "#FF0000", "fill-opacity": 0.2, "stroke-dasharray": "-"});
            this.attr("cursor", "crosshair");
            return true;
        }

        this.attr("cursor", whiteboard.css("cursor"));
    }

    var hoverOutEl = function (event) {
        if (modeSwitcher.selectMode) {
            if (selectedObj == null || selectedObj.uuid != this.uuid) {
                this.attr({"stroke-opacity": 0, "fill-opacity": 0});
            }
            return true;
        }

        if (modeSwitcher.moveMode) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.attr({"stroke": "#0D0BF5", "stroke-opacity": 0.8, "stroke-width": 2, "fill-opacity": 0, "stroke-dasharray": "."});
                this.circleSet.attr({"stroke-opacity": 0.8, "fill-opacity": 0.8});
            } else {
                this.attr({"stroke-opacity": 0, "fill-opacity": 0});
            }
            this.attr("cursor", "default");
            return true;
        }

        if (modeSwitcher.removeMode) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.attr({"stroke": "#0D0BF5", "stroke-opacity": 0.8, "stroke-width": 2, "fill-opacity": 0, "stroke-dasharray": "."});
                this.circleSet.attr({"stroke-opacity": 0.8, "fill-opacity": 0.8});
            } else {
                this.attr({"stroke-opacity": 0, "fill-opacity": 0});
            }
        }
    }

    // register handler for click on element
    var clickEl = function(event) {
        if (modeSwitcher.selectMode) {
            this.circleSet.attr({"stroke-opacity": 0.8, "fill-opacity": 0.8});
            if (selectedObj != null && selectedObj.uuid != this.uuid) {
                // hide last selection
                selectedObj.attr({"stroke-opacity": 0, "fill-opacity": 0});
                selectedObj.circleSet.attr({"stroke-opacity": 0, "fill-opacity": 0});
            }
            selectedObj = this;
            return true;
        }

        if (modeSwitcher.removeMode) {
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
        if (modeSwitcher.freeLineMode) {
            _self.drawFreeLineBegin(event.pageX, event.pageY);
            return false;
        }

        if (modeSwitcher.straightLineMode) {
            _self.drawStraightLineBegin(event.pageX, event.pageY);
            return false;
        }

        return false;
    }

    var mousemoveHandler = function (event) {
        if (modeSwitcher.freeLineMode) {
            whiteboard.lineEl.path.attr("path", whiteboard.lineEl.path.attr("path") + "L" + (event.pageX - offsetLeft) + "," + (event.pageY - offsetTop));
            return true;
        }

        if (modeSwitcher.straightLineMode) {
            whiteboard.lineEl.pathArray[1] = ["L", event.pageX - offsetLeft, event.pageY - offsetTop];
            whiteboard.lineEl.path.attr("path", whiteboard.lineEl.pathArray);
            return true;
        }
    }

    var mouseupHandler = function () {
        whiteboard.unbind(".mmu");
        if (whiteboard.lineEl.path) {
            drawHelperBox(whiteboard.lineEl.path.getBBox(), whiteboard.lineEl.path);
            whiteboard.lineEl.path = null;
            whiteboard.lineEl.pathArray = null;
        }
    }

    // click handler on whiteboard
    var clickHandler = function(event) {
        if (modeSwitcher.rectangleMode) {
            _self.drawRectangle(event.pageX, event.pageY);
            return true;
        }

        if (modeSwitcher.circleMode) {
            _self.drawCircle(event.pageX, event.pageY);
            return true;
        }

        if (modeSwitcher.ellipseMode) {
            _self.drawEllipse(event.pageX, event.pageY);
            return true;
        }

        if (modeSwitcher.iconMode) {
            _self.openIconsDialog(event.pageX, event.pageY);
            return true;
        }

        if (modeSwitcher.textMode) {
            _self.openTextDialog(event.pageX, event.pageY);
            return true;
        }

        return false;
    }

    // mouseleave handler on whiteboard
    var mouseleaveHandler = function(event) {
        if (modeSwitcher.freeLineMode || modeSwitcher.straightLineMode) {
            mouseupHandler();
        }

        return false;
    }

    var drawHelperBox = function(bbox, el) {
        // draw helper rectangle around the element
        var helperRect = paper.rect(bbox.x - 1, bbox.y - 1, (bbox.width !== 0 ? bbox.width + 2 : 3), (bbox.height !== 0 ? bbox.height + 2 : 3));
        helperRect.attr({"stroke": "#0D0BF5", "stroke-width": 2, "stroke-dasharray": "-", "fill": "#0276FD", "stroke-opacity": 0, "fill-opacity": 0});
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
        circleSet.attr({"stroke": "#0D0BF5", "fill": "#0D0BF5", "stroke-width": 1, "stroke-opacity": 0, "fill-opacity": 0});

        // set references
        helperRect.element = el;
        helperRect.circleSet = circleSet;
        helperRect.uuid = uuid();

        return helperRect;
    }

    // draw icons in the "choose icon" dialog
    var drawIcons = function() {
        var x = 0, y = 0;
        var fillStroke = {fill: "#000", stroke: "none"};
        var fiilNone = {fill: "#000", opacity: 0};
        var fillHover = {fill: "90-#0050af-#002c62", stroke: "#FF0000"};
        var iconPaper = Raphael("iconsArea", 600, 360);

        for (var name in whiteboardIcons) {
            var curIcon = iconPaper.path(whiteboardIcons[name]).attr(fillStroke).translate(x, y);
            curIcon.offsetX = x + 20;
            curIcon.offsetY = y + 20;
            var overlayIcon = iconPaper.rect(x, y, 40, 40).attr(fiilNone);
            overlayIcon.icon = curIcon;
            overlayIcon.click(function () {
                dialogIcons.dialog("close");
                var iconElement = paper.path(this.icon.attr("path")).attr(fillStroke).translate(whiteboard.iconEl.cx - this.icon.offsetX, whiteboard.iconEl.cy - this.icon.offsetY);
                drawHelperBox(iconElement.getBBox(), iconElement);

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