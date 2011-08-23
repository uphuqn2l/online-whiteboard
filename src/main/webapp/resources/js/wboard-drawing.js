/**
 * Whiteboard designer class for element drawing.
 */
WhiteboardDesigner = function(witeboardConfig) {
    this.config = witeboardConfig;

    // create jQuery objects for whiteboard container and dialogs
    var whiteboard = jQuery("#" + this.config.ids.whiteboard);
    var dialogInputText = jQuery("#" + this.config.ids.dialogInputText);
    var dialogInputImage = jQuery("#" + this.config.ids.dialogInputImage);
    var dialogIcons = jQuery("#" + this.config.ids.dialogIcons);
    var dialogResize = jQuery("#" + this.config.ids.dialogResize);

    var offsetLeft = whiteboard.offset().left;
    var offsetTop = whiteboard.offset().top;

    jQuery.extend(whiteboard, {
        "lineEl": {"path": null, "pathArray": null},
        "imageEl": {"cx": 0, "cy": 0},
        "iconEl": {"cx": 0, "cy": 0},
        "textEl": {"cx": 0, "cy": 0}
    });

    var modeSwitcher = {
        "textMode": false,
        "freeLineMode": false,
        "straightLineMode": false,
        "rectangleMode": false,
        "circleMode": false,
        "ellipseMode": false,
        "imageMode": false,
        "iconMode": false,
        "selectMode": false,
        "moveMode": false,
        "bringFrontMode": false,
        "bringBackMode": false,
        "cloneMode": false,
        "removeMode": false,
        "clearMode": false,
        "resizeMode": false
    };

    var dragDropStart = false;
    var lastHoverObj = null;
    var selectedObj = null;
    var wbElements = {};
    var _self = this;

    // create raphael canvas
    var paper = Raphael(this.config.ids.whiteboard, whiteboard.width(), whiteboard.height());

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
        setDefaultProperties(whiteboard.lineEl.path, this.config.properties.freeLine);
        whiteboard.bind("mousemove.mmu", mousemoveHandler);
        whiteboard.one("mouseup.mmu", mouseupHandler);
    }

    this.drawStraightLineBegin = function(x, y) {
        whiteboard.lineEl.pathArray = [];
        whiteboard.lineEl.pathArray[0] = ["M", x - offsetLeft, y - offsetTop];
        whiteboard.lineEl.path = paper.path(whiteboard.lineEl.pathArray);
        setDefaultProperties(whiteboard.lineEl.path, this.config.properties.straightLine);
        whiteboard.bind("mousemove.mmu", mousemoveHandler);
        whiteboard.one("mouseup.mmu", mouseupHandler);
    }

    this.drawText = function(inputText) {
        if (inputText !== "") {
            var textElement = paper.text(whiteboard.textEl.cx, whiteboard.textEl.cy, inputText);
            setDefaultProperties(textElement, this.config.properties.text);
            var hb = drawHelperBox(textElement, this.config.classTypes.text, this.config.properties.text.rotation, null, true);
            wbElements[hb.uuid] = hb;
            this.showProperties('editText');
        }
    }

    this.drawImage = function(inputUrl, width, height) {
        if (inputUrl !== "") {
            var imageElement = paper.image(inputUrl, whiteboard.imageEl.cx, whiteboard.imageEl.cy, width, height);
            var hb = drawHelperBox(imageElement, this.config.classTypes.image, this.config.properties.image.rotation, null, true);
            wbElements[hb.uuid] = hb;
            this.showProperties('editImage');
        }
    }

    this.drawRectangle = function(x, y) {
        var rectElement = paper.rect(x - offsetLeft, y - offsetTop, 160, 100, 0);
        rectElement.scale(1, 1);  // workaround for webkit based browsers
        setDefaultProperties(rectElement, this.config.properties.rectangle);
        var hb = drawHelperBox(rectElement, this.config.classTypes.rectangle, this.config.properties.rectangle.rotation, null, true);
        wbElements[hb.uuid] = hb;
        this.showProperties('editRectangle');
    }

    this.drawCircle = function(x, y) {
        var circleElement = paper.circle(x - offsetLeft, y - offsetTop, 70);
        circleElement.scale(1, 1);  // workaround for webkit based browsers
        setDefaultProperties(circleElement, this.config.properties.circle);
        var hb = drawHelperBox(circleElement, this.config.classTypes.circle, this.config.properties.circle.rotation, null, true);
        wbElements[hb.uuid] = hb;
        this.showProperties('editCircle');
    }

    this.drawEllipse = function(x, y) {
        var ellipseElement = paper.ellipse(x - offsetLeft, y - offsetTop, 80, 50);
        ellipseElement.scale(1, 1);  // workaround for webkit based browsers
        setDefaultProperties(ellipseElement, this.config.properties.ellipse);
        var hb = drawHelperBox(ellipseElement, this.config.classTypes.ellipse, this.config.properties.ellipse.rotation, null, true);
        wbElements[hb.uuid] = hb;
        this.showProperties('editEllipse');
    }

    this.selectElement = function(helperBox) {
        helperBox.circleSet.attr(this.config.attributes.opacityVisible);
        if (selectedObj != null && selectedObj.uuid != helperBox.uuid) {
            // hide last selection
            selectedObj.attr(this.config.attributes.opacityHidden);
            selectedObj.circleSet.attr(this.config.attributes.opacityHidden);
        }
        selectedObj = helperBox;
        selectedObj.visibleSelect = true;
        this.showProperties('edit' + selectedObj.classType);
    }

    this.removeElement = function(helperBox) {
        if (selectedObj != null && selectedObj.uuid == helperBox.uuid) {
            // last selected object = this object ==> reset
            selectedObj = null;
            this.showProperties('editNoSelection');
        }
        wbElements[helperBox.uuid] = null;
        delete wbElements[helperBox.uuid];
        helperBox.element.remove();
        helperBox.circleSet.remove();
        helperBox.remove();
    }

    this.bringFrontElement = function(helperBox) {
        helperBox.element.toFront();
        helperBox.circleSet.toFront();
        helperBox.toFront();
        helperBox.attr(this.config.attributes.opacityHidden);
    }

    this.bringBackElement = function(helperBox) {
        helperBox.toBack();
        helperBox.circleSet.toBack();
        helperBox.element.toBack();
        helperBox.attr(this.config.attributes.opacityHidden);
    }

    this.cloneElement = function(helperBox) {
        var cloneEl = helperBox.element.clone();
        cloneEl.translate(15, 15);
        var hb = drawHelperBox(cloneEl, helperBox.classType, null, null, false);
        if (cloneEl.attr("rotation") != 0) {
            var bbox = cloneEl.getBBox();
            var bboxWidth = parseFloat(cloneEl.width);
            var bboxHeight = parseFloat(cloneEl.height);
            hb.circleSet.rotate(cloneEl.attr("rotation"), bbox.x + bboxWidth / 2, bbox.y + bboxHeight / 2, true);
            hb.rotate(cloneEl.attr("rotation"), bbox.x + bboxWidth / 2, bbox.y + bboxHeight / 2, true);
        }
        helperBox.attr(this.config.attributes.opacityHidden);
        wbElements[hb.uuid] = hb;
    }

    this.resizeWhiteboard = function(width, height) {
        whiteboard.css({width: width + 'px', height: height + 'px'});
        paper.setSize(width, height);
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

    this.openResizeDialog = function() {
        dialogResize.dialog("open");
    }

    this.clearWhiteboard = function() {
        paper.clear();
        this.showProperties('editNoSelection');
        for (eluuid in wbElements) {
            wbElements[eluuid] = null;
            delete wbElements[eluuid];
        }
    }

    this.showProperties = function(showClass) {
        var propsDialog = jQuery(".propertiesPanel");
        propsDialog.find(".editPanel").hide();
        propsDialog.find("." + showClass).show();
    }

    this.transferTextPropertiesToDialog = function(cx, cy, props) {

    }

    this.transferFreeLinePropertiesToDialog = function(props) {

    }

    this.transferStraightLinePropertiesToDialog = function(props) {

    }

    this.transferRectanglePropertiesToDialog = function(cx, cy, props) {

    }

    this.transferCirclePropertiesToDialog = function(cx, cy, props) {

    }

    this.transferEllipsePropertiesToDialog = function(cx, cy, props) {

    }

    this.transferImagePropertiesToDialog = function(cx, cy, props) {

    }

    this.transferIconPropertiesToDialog = function(cx, cy, props) {

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
        _self.dragDropStart = true;
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

        if (lastHoverObj != null) {
            // overlapping ==> handle current overlapped element (hide / show helpers)
            if (selectedObj != null && selectedObj.uuid == this.uuid && selectedObj.visibleSelect) {
                this.attr(_self.config.attributes.selectBoxVisible);
                this.circleSet.attr(_self.config.attributes.opacityVisible);
            } else {
                this.attr(_self.config.attributes.opacityHidden);
            }
            this.attr("cursor", "default");

            // handle new element which overlapps the current one - show "move helper"
            lastHoverObj.circleSet.attr(_self.config.attributes.opacityHidden);
            lastHoverObj.attr(_self.config.attributes.moveBoxVisible);
            lastHoverObj.attr("cursor", "move");
            lastHoverObj = null;
        }

        _self.dragDropStart = false;
    }

    // register hover on element
    var hoverOverEl = function (event) {
        if (_self.dragDropStart) {
            lastHoverObj = this;
            return false;
        }

        if (modeSwitcher.selectMode) {
            this.attr(_self.config.attributes.selectBoxVisible);
            this.attr("cursor", "default");
            return true;
        }

        if (modeSwitcher.moveMode) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.circleSet.attr(_self.config.attributes.opacityHidden);
            }
            this.attr(_self.config.attributes.moveBoxVisible);
            this.attr("cursor", "move");
            return true;
        }

        if (modeSwitcher.removeMode) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.circleSet.attr(_self.config.attributes.opacityHidden);
            }
            this.attr(_self.config.attributes.removeBoxVisible);
            this.attr("cursor", "crosshair");
            return true;
        }

        if (modeSwitcher.bringFrontMode) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.circleSet.attr(_self.config.attributes.opacityHidden);
            }
            this.attr(_self.config.attributes.bringFrontBackBoxVisible);
            this.attr("cursor", "default");
            return true;
        }

        if (modeSwitcher.bringBackMode) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.circleSet.attr(_self.config.attributes.opacityHidden);
            }
            this.attr(_self.config.attributes.bringFrontBackBoxVisible);
            this.attr("cursor", "default");
            return true;
        }

        if (modeSwitcher.cloneMode) {
            if (selectedObj != null && selectedObj.uuid == this.uuid) {
                this.circleSet.attr(_self.config.attributes.opacityHidden);
            }
            this.attr(_self.config.attributes.cloneBoxVisible);
            this.attr("cursor", "default");
            return true;
        }

        this.attr("cursor", whiteboard.css("cursor"));
    }

    var hoverOutEl = function (event) {
        if (_self.dragDropStart) {
            lastHoverObj = null;
            return false;
        }

        if (modeSwitcher.selectMode) {
            if (selectedObj == null || selectedObj.uuid != this.uuid || !selectedObj.visibleSelect) {
                this.attr(_self.config.attributes.opacityHidden);
            }
            return true;
        }

        with (modeSwitcher) {
            if (moveMode || removeMode || bringFrontMode || bringBackMode || cloneMode) {
                if (selectedObj != null && selectedObj.uuid == this.uuid && selectedObj.visibleSelect) {
                    this.attr(_self.config.attributes.selectBoxVisible);
                    this.circleSet.attr(_self.config.attributes.opacityVisible);
                } else {
                    this.attr(_self.config.attributes.opacityHidden);
                }
                this.attr("cursor", "default");
                return true;
            }
        }
    }

    // register handler for click on element
    var clickEl = function(event) {
        if (modeSwitcher.selectMode) {
            _self.selectElement(this);
            return true;
        }

        if (modeSwitcher.removeMode) {
            _self.removeElement(this);
            return true;
        }

        if (modeSwitcher.bringFrontMode) {
            _self.bringFrontElement(this);
            return true;
        }

        if (modeSwitcher.bringBackMode) {
            _self.bringBackElement(this);
            return true;
        }

        if (modeSwitcher.cloneMode) {
            _self.cloneElement(this);
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
            var classType, rotation, dialogType;
            if (modeSwitcher.freeLineMode) {
                classType = _self.config.classTypes.freeLine;
                rotation = _self.config.properties.freeLine.rotation;
                dialogType = "editFreeLine";
            } else {
                classType = _self.config.classTypes.straightLine;
                rotation = _self.config.properties.straightLine.rotation;
                dialogType = "editStraightLine";
            }

            var hb = drawHelperBox(whiteboard.lineEl.path, classType, rotation, null, true);
            wbElements[hb.uuid] = hb;
            _self.showProperties(dialogType);
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

        if (modeSwitcher.imageMode) {
            _self.openImageDialog(event.pageX, event.pageY);
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

    // draw helper shapes around the element
    var drawHelperBox = function(el, classType, rotation, scale, select) {
        // scale
        if (scale && scale != 1.0) {
            el.scale(scale, scale);
        }

        var bbox = el.getBBox();
        var bboxWidth = parseFloat(bbox.width);
        var bboxHeight = parseFloat(bbox.height);
        var helperRect = paper.rect(bbox.x - 1, bbox.y - 1, (bboxWidth !== 0 ? bboxWidth + 2 : 3), (bboxHeight !== 0 ? bboxHeight + 2 : 3));
        helperRect.attr(_self.config.attributes.helperRect);
        helperRect.hover(hoverOverEl, hoverOutEl);
        helperRect.click(clickEl);
        helperRect.drag(ddMoveEl, ddStartEl, ddStopEl);

        // draw invisible circles for possible later selection
        var c1 = paper.circle(bbox.x, bbox.y, 3);
        var c2 = paper.circle(bbox.x + bboxWidth, bbox.y, 3);
        var c3 = paper.circle(bbox.x, bbox.y + bboxHeight, 3);
        var c4 = paper.circle(bbox.x + bboxWidth, bbox.y + bboxHeight, 3);

        // build a set
        var circleSet = paper.set();
        circleSet.push(c1, c2, c3, c4);
        circleSet.attr(_self.config.attributes.circleSet);

        // rotate
        if (rotation && rotation != 0) {
            el.rotate(rotation, bbox.x + bboxWidth / 2, bbox.y + bboxHeight / 2, true);
            circleSet.rotate(rotation, bbox.x + bboxWidth / 2, bbox.y + bboxHeight / 2, true);
            helperRect.rotate(rotation, bbox.x + bboxWidth / 2, bbox.y + bboxHeight / 2, true);
        }

        // set references
        helperRect.element = el;
        helperRect.circleSet = circleSet;
        helperRect.uuid = uuid();
        helperRect.classType = classType;

        if (select) {
            if (selectedObj != null) {
                // hide last selection
                selectedObj.attr(_self.config.attributes.opacityHidden);
                selectedObj.circleSet.attr(_self.config.attributes.opacityHidden);
            }

            // set drawn element as selected
            selectedObj = helperRect;
            selectedObj.visibleSelect = false;
        }

        return helperRect;
    }

    // draw icons in the "choose icon" dialog
    var drawIcons = function() {
        var x = 0, y = 0;
        var fillStroke = {fill: "#000", stroke: "none"};
        var fillNone = {fill: "#000", opacity: 0};
        var fillHover = {fill: "90-#0050af-#002c62", stroke: "#FF0000"};
        var iconPaper = Raphael("iconsArea", 600, 360);
        var wbIcons = _self.config.svgIconSet;

        for (var name in wbIcons) {
            var curIcon = iconPaper.path(wbIcons[name]).attr(fillStroke).translate(x, y);
            curIcon.offsetX = x + 20;
            curIcon.offsetY = y + 20;
            var overlayIcon = iconPaper.rect(x, y, 40, 40).attr(fillNone);
            overlayIcon.icon = curIcon;
            overlayIcon.click(function (event) {
                dialogIcons.dialog("close");
                var iconElement = paper.path(this.icon.attr("path")).attr(fillStroke).translate(whiteboard.iconEl.cx - this.icon.offsetX, whiteboard.iconEl.cy - this.icon.offsetY);
                var hb = drawHelperBox(iconElement, _self.config.classTypes.icon, _self.config.properties.icon.rotation, _self.config.properties.icon.scale, true);
                wbElements[hb.uuid] = hb;
                _self.showProperties('editIcon');
                event.stopPropagation();
                event.preventDefault();
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

    var setDefaultProperties = function(el, propsObj) {
        for (prop in propsObj) {
            if (prop != "rotation") {
                el.attr(prop, propsObj[prop]);
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