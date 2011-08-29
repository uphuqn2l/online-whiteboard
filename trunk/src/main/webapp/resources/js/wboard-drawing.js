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

    var idSubviewProperties = "#pinnedSubview";
    var dragDropStart = false;
    var lastHoverObj = null;
    var selectedObj = null;
    var wbElements = {};
    var _self = this;

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

    this.getSelectedObject = function() {
        return selectedObj;
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
            var hb = drawHelperBox(textElement, this.config.classTypes.text, this.config.properties.text.rotation, null, true, null);
            wbElements[hb.uuid] = hb;

            // send changes to server
            this.sendChanges({
                "action": "create",
                "element": {
                    "type": this.config.classTypes.text,
                    "properties": {
                        "uuid": hb.uuid,
                        "x": whiteboard.textEl.cx,
                        "y": whiteboard.textEl.cy,
                        "rotationDegree": this.config.properties.text.rotation,
                        "text": inputText,
                        "fontFamily": textElement.attr("font-family"),
                        "fontSize": textElement.attr("font-size"),
                        "fontWeight": textElement.attr("font-weight"),
                        "fontStyle": textElement.attr("font-style"),
                        "color": textElement.attr("fill")
                    }
                }
            });

            this.showProperties('editText');
            this.transferTextPropertiesToDialog(whiteboard.textEl.cx, whiteboard.textEl.cy, this.config.properties.text);
        }
    }

    this.drawImage = function(inputUrl, width, height) {
        if (inputUrl !== "") {
            var imageElement = paper.image(inputUrl, whiteboard.imageEl.cx, whiteboard.imageEl.cy, width, height);
            var hb = drawHelperBox(imageElement, this.config.classTypes.image, this.config.properties.image.rotation, null, true, null);
            wbElements[hb.uuid] = hb;
            this.showProperties('editImage');

            // send changes to server
            this.sendChanges({
                "action": "create",
                "element": {
                    "type": this.config.classTypes.image,
                    "properties": {
                        "uuid": hb.uuid,
                        "x": whiteboard.imageEl.cx,
                        "y": whiteboard.imageEl.cy,
                        "rotationDegree": this.config.properties.image.rotation,
                        "url": inputUrl,
                        "width": width,
                        "height": height
                    }
                }
            });

            this.transferImagePropertiesToDialog(whiteboard.imageEl.cx, whiteboard.imageEl.cy, {
                "width": width,
                "height": height,
                "rotation": this.config.properties.image.rotation
            });
        }
    }

    this.drawRectangle = function(x, y) {
        var rectElement = paper.rect(x - offsetLeft, y - offsetTop, 160, 100, 0);
        rectElement.scale(1, 1);  // workaround for webkit based browsers
        setDefaultProperties(rectElement, this.config.properties.rectangle);
        var hb = drawHelperBox(rectElement, this.config.classTypes.rectangle, this.config.properties.rectangle.rotation, null, true, null);
        wbElements[hb.uuid] = hb;

        // send changes to server
        this.sendChanges({
            "action": "create",
            "element": {
                "type": this.config.classTypes.rectangle,
                "properties": {
                    "uuid": hb.uuid,
                    "x": x - offsetLeft,
                    "y": y - offsetTop,
                    "rotationDegree": this.config.properties.rectangle.rotation,
                    "width": rectElement.attr("width"),
                    "height": rectElement.attr("height"),
                    "cornerRadius": rectElement.attr("r"),
                    "backgroundColor": rectElement.attr("fill"),
                    "borderColor": rectElement.attr("stroke"),
                    "borderWidth": rectElement.attr("stroke-width"),
                    "borderStyle": getDasharrayValue(rectElement.attr("stroke-dasharray")),
                    "backgroundOpacity": rectElement.attr("fill-opacity"),
                    "borderOpacity": rectElement.attr("stroke-opacity")
                }
            }
        });

        this.showProperties('editRectangle');
        this.transferRectanglePropertiesToDialog(x - offsetLeft, y - offsetTop, this.config.properties.rectangle);
    }

    this.drawCircle = function(x, y) {
        var circleElement = paper.circle(x - offsetLeft, y - offsetTop, 70);
        circleElement.scale(1, 1);  // workaround for webkit based browsers
        setDefaultProperties(circleElement, this.config.properties.circle);
        var hb = drawHelperBox(circleElement, this.config.classTypes.circle, this.config.properties.circle.rotation, null, true, null);
        wbElements[hb.uuid] = hb;

        // send changes to server
        this.sendChanges({
            "action": "create",
            "element": {
                "type": this.config.classTypes.circle,
                "properties": {
                    "uuid": hb.uuid,
                    "x": x - offsetLeft,
                    "y": y - offsetTop,
                    "rotationDegree": this.config.properties.circle.rotation,
                    "radius": circleElement.attr("r"),
                    "backgroundColor": circleElement.attr("fill"),
                    "borderColor": circleElement.attr("stroke"),
                    "borderWidth": circleElement.attr("stroke-width"),
                    "borderStyle": getDasharrayValue(circleElement.attr("stroke-dasharray")),
                    "backgroundOpacity": circleElement.attr("fill-opacity"),
                    "borderOpacity": circleElement.attr("stroke-opacity")
                }
            }
        });

        this.showProperties('editCircle');
        this.transferCirclePropertiesToDialog(x - offsetLeft, y - offsetTop, this.config.properties.circle);
    }

    this.drawEllipse = function(x, y) {
        var ellipseElement = paper.ellipse(x - offsetLeft, y - offsetTop, 80, 50);
        ellipseElement.scale(1, 1);  // workaround for webkit based browsers
        setDefaultProperties(ellipseElement, this.config.properties.ellipse);
        var hb = drawHelperBox(ellipseElement, this.config.classTypes.ellipse, this.config.properties.ellipse.rotation, null, true, null);
        wbElements[hb.uuid] = hb;

        // send changes to server
        this.sendChanges({
            "action": "create",
            "element": {
                "type": this.config.classTypes.ellipse,
                "properties": {
                    "uuid": hb.uuid,
                    "x": x - offsetLeft,
                    "y": y - offsetTop,
                    "rotationDegree": this.config.properties.ellipse.rotation,
                    "hRadius": ellipseElement.attr("rx"),
                    "vRadius": ellipseElement.attr("ry"),
                    "backgroundColor": ellipseElement.attr("fill"),
                    "borderColor": ellipseElement.attr("stroke"),
                    "borderWidth": ellipseElement.attr("stroke-width"),
                    "borderStyle": getDasharrayValue(ellipseElement.attr("stroke-dasharray")),
                    "backgroundOpacity": ellipseElement.attr("fill-opacity"),
                    "borderOpacity": ellipseElement.attr("stroke-opacity")
                }
            }
        });

        this.showProperties('editEllipse');
        this.transferEllipsePropertiesToDialog(x - offsetLeft, y - offsetTop, this.config.properties.ellipse);
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
        this.showSelectedProperties(selectedObj);
    }

    this.showSelectedProperties = function(selObj) {
        // show and fill properties
        this.showProperties('edit' + selObj.classType);
        var selectedProperties = getSelectedProperties(selObj.element, this.config.properties[selObj.classType.charAt(0).toLowerCase() + selObj.classType.slice(1)]);

        switch (selObj.classType) {
            case this.config.classTypes.text :
                this.transferTextPropertiesToDialog(selObj.element.attr("x"), selObj.element.attr("y"), selectedProperties);
                break;
            case this.config.classTypes.freeLine :
                this.transferFreeLinePropertiesToDialog(selectedProperties);
                break;
            case this.config.classTypes.straightLine :
                this.transferStraightLinePropertiesToDialog(selectedProperties);
                break;
            case this.config.classTypes.rectangle :
                this.transferRectanglePropertiesToDialog(selObj.element.attr("x"), selObj.element.attr("y"), selectedProperties);
                break;
            case this.config.classTypes.circle :
                this.transferCirclePropertiesToDialog(selObj.element.attr("cx"), selObj.element.attr("cy"), selectedProperties);
                break;
            case this.config.classTypes.ellipse :
                this.transferEllipsePropertiesToDialog(selObj.element.attr("cx"), selObj.element.attr("cy"), selectedProperties);
                break;
            case this.config.classTypes.image :
                this.transferImagePropertiesToDialog(selObj.element.attr("x"), selObj.element.attr("y"), selectedProperties);
                break;
            case this.config.classTypes.icon :
                selectedProperties["scale"] = parseFloat((selectedProperties["scale"] + '').split("\\s+")[0]);
                this.transferIconPropertiesToDialog(Math.round(selObj.attr("x") + 1), Math.round(selObj.attr("y") + 1), selectedProperties);
                break;
            default :
        }
    }

    this.removeElement = function(helperBox) {
        var eluuid = helperBox.uuid;
        var elclasstype = helperBox.classType;

        wbElements[eluuid] = null;
        delete wbElements[eluuid];
        helperBox.element.remove();
        helperBox.circleSet.remove();
        helperBox.remove();

        // send changes to server
        this.sendChanges({
            "action": "remove",
            "element": {
                "type": elclasstype,
                "properties": {
                    "uuid": eluuid
                }
            }
        });

        if (selectedObj != null && selectedObj.uuid == eluuid) {
            // last selected object = this object ==> reset
            selectedObj = null;
            this.showProperties('editNoSelection');
        }
    }

    this.bringFrontElement = function(helperBox) {
        helperBox.element.toFront();
        helperBox.circleSet.toFront();
        helperBox.toFront();
        helperBox.attr(this.config.attributes.opacityHidden);

        // send changes to server
        this.sendChanges({
            "action": "toFront",
            "element": {
                "type": helperBox.classType,
                "properties": {
                    "uuid": helperBox.uuid
                }
            }
        });
    }

    this.bringBackElement = function(helperBox) {
        helperBox.toBack();
        helperBox.circleSet.toBack();
        helperBox.element.toBack();
        helperBox.attr(this.config.attributes.opacityHidden);

        // send changes to server
        this.sendChanges({
            "action": "toBack",
            "element": {
                "type": helperBox.classType,
                "properties": {
                    "uuid": helperBox.uuid
                }
            }
        });
    }

    this.cloneElement = function(helperBox) {
        var cloneEl;
        if (helperBox.classType == this.config.classTypes.icon) {
            // workaround with scale factor
            var scaleFactor = parseFloat((helperBox.element.attr("scale") + '').split("\\s+")[0]);
            helperBox.element.scale(1, 1);
            cloneEl = helperBox.element.clone();
            helperBox.element.scale(scaleFactor, scaleFactor);
            cloneEl.scale(scaleFactor, scaleFactor);
        } else {
            cloneEl = helperBox.element.clone();
        }

        // shift clone
        cloneEl.translate(15, 15);

        var hb = drawHelperBox(cloneEl, helperBox.classType, null, null, false, null);
        var rotationDegree = cloneEl.attr("rotation");
        if (rotationDegree != 0) {
            var bbox = cloneEl.getBBox();
            var bboxWidth = parseFloat(bbox.width);
            var bboxHeight = parseFloat(bbox.height);
            hb.circleSet.rotate(rotationDegree, bbox.x + bboxWidth / 2, bbox.y + bboxHeight / 2, true);
            hb.rotate(rotationDegree, bbox.x + bboxWidth / 2, bbox.y + bboxHeight / 2, true);
        }

        helperBox.attr(this.config.attributes.opacityHidden);
        wbElements[hb.uuid] = hb;

        var objChanges = {
            "action": "clone",
            "element": {
                "type": hb.classType,
                "properties": {
                    "uuid": hb.uuid,
                    "rotationDegree": rotationDegree
                }
            }
        };

        switch (hb.classType) {
            case this.config.classTypes.text :
                objChanges.element.properties.x = cloneEl.attr("x");
                objChanges.element.properties.y = cloneEl.attr("y");
                objChanges.element.properties.text = cloneEl.attr("text");
                objChanges.element.properties.fontFamily = cloneEl.attr("font-family");
                objChanges.element.properties.fontSize = cloneEl.attr("font-size");
                objChanges.element.properties.fontWeight = cloneEl.attr("font-weight");
                objChanges.element.properties.fontStyle = cloneEl.attr("font-style");
                objChanges.element.properties.color = cloneEl.attr("fill");
                this.sendChanges(objChanges);

                break;
            case this.config.classTypes.freeLine :
            case this.config.classTypes.straightLine :
                objChanges.element.properties.path = cloneEl.attr("path") + '';
                objChanges.element.properties.color = cloneEl.attr("stroke");
                objChanges.element.properties.lineWidth = cloneEl.attr("stroke-width");
                objChanges.element.properties.lineStyle = getDasharrayValue(cloneEl.attr("stroke-dasharray"));
                objChanges.element.properties.opacity = cloneEl.attr("stroke-opacity");
                this.sendChanges(objChanges);

                break;
            case this.config.classTypes.rectangle :

                break;
            case this.config.classTypes.circle :

                break;
            case this.config.classTypes.ellipse :

                break;
            case this.config.classTypes.image :

                break;
            case this.config.classTypes.icon :

                break;

            default :
        }
    }

    this.resizeWhiteboard = function(width, height) {
        whiteboard.css({width: width + 'px', height: height + 'px'});
        paper.setSize(width, height);

        // send changes to server
        this.sendChanges({
            "action": "resize",
            "parameters": {
                "width": width,
                "height": height
            }
        });
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

        // send changes to server
        this.sendChanges({
            "action": "clear"
        });
    }

    this.showProperties = function(showClass) {
        var propsDialog = jQuery(".propertiesPanel");
        propsDialog.find(".editPanel").hide();
        propsDialog.find("." + showClass).show();
    }

    this.setIdSubviewProperties = function(id) {
        idSubviewProperties = id;
    }

    this.transferTextPropertiesToDialog = function(cx, cy, props) {
        jQuery(idSubviewProperties + "_textCx").val(cx);
        jQuery(idSubviewProperties + "_textCy").val(cy);
        jQuery(idSubviewProperties + "_fontFamily option[value='" + props["font-family"] + "']").attr('selected', true);
        jQuery(idSubviewProperties + "_fontSize").val(props["font-size"]);
        jQuery("input[name='" + idSubviewProperties.substring(1) + "_fontWeight'][value='" + props["font-weight"] + "']").attr('checked', 'checked');
        jQuery("input[name='" + idSubviewProperties.substring(1) + "_fontStyle'][value='" + props["font-style"] + "']").attr('checked', 'checked');
        jQuery(idSubviewProperties + "_textColor div").css('backgroundColor', props["fill"]);
        jQuery(idSubviewProperties + "_textRotation").val(props["rotation"]);
    }

    this.transferFreeLinePropertiesToDialog = function(props) {
        jQuery(idSubviewProperties + "_freeLineColor div").css('backgroundColor', props["stroke"]);
        jQuery(idSubviewProperties + "_freeLineWidth").val(props["stroke-width"]);
        jQuery(idSubviewProperties + "_freeLineStyle option[value='" + props["stroke-dasharray"] + "']").attr('selected', true);
        jQuery(idSubviewProperties + "_freeLineOpacity").val(props["stroke-opacity"].toFixed(1));
        jQuery(idSubviewProperties + "_freeLineRotation").val(props["rotation"]);
    }

    this.transferStraightLinePropertiesToDialog = function(props) {
        jQuery(idSubviewProperties + "_straightLineColor div").css('backgroundColor', props["stroke"]);
        jQuery(idSubviewProperties + "_straightLineWidth").val(props["stroke-width"]);
        jQuery(idSubviewProperties + "_straightLineStyle option[value='" + props["stroke-dasharray"] + "']").attr('selected', true);
        jQuery(idSubviewProperties + "_straightLineOpacity").val(props["stroke-opacity"].toFixed(1));
        jQuery(idSubviewProperties + "_straightLineRotation").val(props["rotation"]);
    }

    this.transferRectanglePropertiesToDialog = function(cx, cy, props) {
        jQuery(idSubviewProperties + "_rectCx").val(cx);
        jQuery(idSubviewProperties + "_rectCy").val(cy);
        jQuery(idSubviewProperties + "_rectWidth").val(props["width"]);
        jQuery(idSubviewProperties + "_rectHeight").val(props["height"]);
        jQuery(idSubviewProperties + "_cornerRadius").val(props["r"]);
        jQuery(idSubviewProperties + "_rectBkgrColor div").css('backgroundColor', props["fill"]);
        jQuery(idSubviewProperties + "_rectBorderColor div").css('backgroundColor', props["stroke"]);
        jQuery(idSubviewProperties + "_rectBorderWidth").val(props["stroke-width"]);
        jQuery(idSubviewProperties + "_rectBorderStyle option[value='" + props["stroke-dasharray"] + "']").attr('selected', true);
        jQuery(idSubviewProperties + "_rectBkgrOpacity").val(props["fill-opacity"].toFixed(1));
        jQuery(idSubviewProperties + "_rectBorderOpacity").val(props["stroke-opacity"].toFixed(1));
        jQuery(idSubviewProperties + "_rectRotation").val(props["rotation"]);
    }

    this.transferCirclePropertiesToDialog = function(cx, cy, props) {
        jQuery(idSubviewProperties + "_circleCx").val(cx);
        jQuery(idSubviewProperties + "_circleCy").val(cy);
        jQuery(idSubviewProperties + "_radius").val(props["r"]);
        jQuery(idSubviewProperties + "_circleBkgrColor div").css('backgroundColor', props["fill"]);
        jQuery(idSubviewProperties + "_circleBorderColor div").css('backgroundColor', props["stroke"]);
        jQuery(idSubviewProperties + "_circleBorderWidth").val(props["stroke-width"]);
        jQuery(idSubviewProperties + "_circleBorderStyle option[value='" + props["stroke-dasharray"] + "']").attr('selected', true);
        jQuery(idSubviewProperties + "_circleBkgrOpacity").val(props["fill-opacity"].toFixed(1));
        jQuery(idSubviewProperties + "_circleBorderOpacity").val(props["stroke-opacity"].toFixed(1));
        jQuery(idSubviewProperties + "_circleRotation").val(props["rotation"]);
    }

    this.transferEllipsePropertiesToDialog = function(cx, cy, props) {
        jQuery(idSubviewProperties + "_ellipseCx").val(cx);
        jQuery(idSubviewProperties + "_ellipseCy").val(cy);
        jQuery(idSubviewProperties + "_hRadius").val(props["rx"]);
        jQuery(idSubviewProperties + "_vRadius").val(props["ry"]);
        jQuery(idSubviewProperties + "_ellipseBkgrColor div").css('backgroundColor', props["fill"]);
        jQuery(idSubviewProperties + "_ellipseBorderColor div").css('backgroundColor', props["stroke"]);
        jQuery(idSubviewProperties + "_ellipseBorderWidth").val(props["stroke-width"]);
        jQuery(idSubviewProperties + "_ellipseBorderStyle option[value='" + props["stroke-dasharray"] + "']").attr('selected', true);
        jQuery(idSubviewProperties + "_ellipseBkgrOpacity").val(props["fill-opacity"].toFixed(1));
        jQuery(idSubviewProperties + "_ellipseBorderOpacity").val(props["stroke-opacity"].toFixed(1));
        jQuery(idSubviewProperties + "_ellipseRotation").val(props["rotation"]);
    }

    this.transferImagePropertiesToDialog = function(cx, cy, props) {
        jQuery(idSubviewProperties + "_imageCx").val(cx);
        jQuery(idSubviewProperties + "_imageCy").val(cy);
        jQuery(idSubviewProperties + "_imageWidth").val(props["width"]);
        jQuery(idSubviewProperties + "_imageHeight").val(props["height"]);
        jQuery(idSubviewProperties + "_imageRotation").val(props["rotation"]);
    }

    this.transferIconPropertiesToDialog = function(cx, cy, props) {
        jQuery(idSubviewProperties + "_iconCx").val(cx);
        jQuery(idSubviewProperties + "_iconCy").val(cy);
        jQuery(idSubviewProperties + "_iconRotation").val(props["rotation"]);
        jQuery(idSubviewProperties + "_iconScale").val(props["scale"].toFixed(1));
    }

    this.makeAsDefault = function(properties) {
        var classType = properties.charAt(0).toUpperCase() + properties.slice(1);
        var props = this.config.properties[properties];

        switch (classType) {
            case this.config.classTypes.text :
                props["font-family"] = jQuery(idSubviewProperties + "_fontFamily option:selected").val();
                props["font-size"] = parseInt(jQuery(idSubviewProperties + "_fontSize").val());
                props["font-weight"] = jQuery("input[name='" + idSubviewProperties.substring(1) + "_fontWeight']:checked").val();
                props["font-style"] = jQuery("input[name='" + idSubviewProperties.substring(1) + "_fontStyle']:checked").val();
                props["fill"] = jQuery(idSubviewProperties + "_textColor div").css('backgroundColor');
                props["rotation"] = parseInt(jQuery(idSubviewProperties + "_textRotation").val());
                break;
            case this.config.classTypes.freeLine :
                props["stroke"] = jQuery(idSubviewProperties + "_freeLineColor div").css('backgroundColor');
                props["stroke-width"] = parseInt(jQuery(idSubviewProperties + "_freeLineWidth").val());
                props["stroke-dasharray"] = jQuery(idSubviewProperties + "_freeLineStyle option:selected").val();
                props["stroke-opacity"] = parseFloat(jQuery(idSubviewProperties + "_freeLineOpacity").val());
                props["rotation"] = parseInt(jQuery(idSubviewProperties + "_freeLineRotation").val());
                break;
            case this.config.classTypes.straightLine :
                props["stroke"] = jQuery(idSubviewProperties + "_straightLineColor div").css('backgroundColor');
                props["stroke-width"] = parseInt(jQuery(idSubviewProperties + "_straightLineWidth").val());
                props["stroke-dasharray"] = jQuery(idSubviewProperties + "_straightLineStyle option:selected").val();
                props["stroke-opacity"] = parseFloat(jQuery(idSubviewProperties + "_straightLineOpacity").val());
                props["rotation"] = parseInt(jQuery(idSubviewProperties + "_straightLineRotation").val());
                break;
            case this.config.classTypes.rectangle :
                props["width"] = parseInt(jQuery(idSubviewProperties + "_rectWidth").val());
                props["height"] = parseInt(jQuery(idSubviewProperties + "_rectHeight").val());
                props["r"] = parseInt(jQuery(idSubviewProperties + "_cornerRadius").val());
                props["fill"] = jQuery(idSubviewProperties + "_rectBkgrColor div").css('backgroundColor');
                props["stroke"] = jQuery(idSubviewProperties + "_rectBorderColor div").css('backgroundColor');
                props["stroke-width"] = parseInt(jQuery(idSubviewProperties + "_rectBorderWidth").val());
                props["stroke-dasharray"] = jQuery(idSubviewProperties + "_rectBorderStyle option:selected").val();
                props["fill-opacity"] = parseFloat(jQuery(idSubviewProperties + "_rectBkgrOpacity").val());
                props["stroke-opacity"] = parseFloat(jQuery(idSubviewProperties + "_rectBorderOpacity").val());
                props["rotation"] = parseInt(jQuery(idSubviewProperties + "_rectRotation").val());
                break;
            case this.config.classTypes.circle :
                props["r"] = parseInt(jQuery(idSubviewProperties + "_radius").val());
                props["fill"] = jQuery(idSubviewProperties + "_circleBkgrColor div").css('backgroundColor');
                props["stroke"] = jQuery(idSubviewProperties + "_circleBorderColor div").css('backgroundColor');
                props["stroke-width"] = parseInt(jQuery(idSubviewProperties + "_circleBorderWidth").val());
                props["stroke-dasharray"] = jQuery(idSubviewProperties + "_circleBorderStyle option:selected").val();
                props["fill-opacity"] = parseFloat(jQuery(idSubviewProperties + "_circleBkgrOpacity").val());
                props["stroke-opacity"] = parseFloat(jQuery(idSubviewProperties + "_circleBorderOpacity").val());
                props["rotation"] = parseInt(jQuery(idSubviewProperties + "_circleRotation").val());
                break;
            case this.config.classTypes.ellipse :
                props["rx"] = parseInt(jQuery(idSubviewProperties + "_hRadius").val());
                props["ry"] = parseInt(jQuery(idSubviewProperties + "_vRadius").val());
                props["fill"] = jQuery(idSubviewProperties + "_ellipseBkgrColor div").css('backgroundColor');
                props["stroke"] = jQuery(idSubviewProperties + "_ellipseBorderColor div").css('backgroundColor');
                props["stroke-width"] = parseInt(jQuery(idSubviewProperties + "_ellipseBorderWidth").val());
                props["stroke-dasharray"] = jQuery(idSubviewProperties + "_ellipseBorderStyle option:selected").val();
                props["fill-opacity"] = parseFloat(jQuery(idSubviewProperties + "_ellipseBkgrOpacity").val());
                props["stroke-opacity"] = parseFloat(jQuery(idSubviewProperties + "_ellipseBorderOpacity").val());
                props["rotation"] = parseInt(jQuery(idSubviewProperties + "_ellipseRotation").val());
                break;
            case this.config.classTypes.image :
                props["width"] = parseInt(jQuery(idSubviewProperties + "_imageWidth").val());
                props["height"] = parseInt(jQuery(idSubviewProperties + "_imageHeight").val());
                props["rotation"] = parseInt(jQuery(idSubviewProperties + "_imageRotation").val());
                break;
            case this.config.classTypes.icon :
                props["rotation"] = parseInt(jQuery(idSubviewProperties + "_iconRotation").val());
                props["scale"] = parseFloat(jQuery(idSubviewProperties + "_iconScale").val());
                break;
            default :
        }
    }

    this.restoreWhiteboard = function(jsWhiteboard) {
        var arrElements = jsWhiteboard["elements"];
        for (var i = 0; i < arrElements.length; i++) {
            var objElement = arrElements[i];
            var classType = objElement.type;
            var props = objElement.properties;
            var hb;

            switch (classType) {
                case this.config.classTypes.text :
                    var textElement = paper.text(props.x, props.y, props.text);
                    setDefaultProperties(textElement, {
                        "font-family" : props.fontFamily,
                        "font-size" : props.fontSize,
                        "font-weight" : props.fontWeight,
                        "font-style" : props.fontStyle,
                        "fill" : props.color
                    });
                    hb = drawHelperBox(textElement, this.config.classTypes.text, props.rotationDegree, null, false, props.uuid);
                    wbElements[hb.uuid] = hb;

                    break;
                case this.config.classTypes.freeLine :
                    var freeLine = paper.path(props.path);
                    setDefaultProperties(freeLine, {
                        "stroke" : props.color,
                        "stroke-width" : props.lineWidth,
                        "stroke-dasharray" : props.lineStyle,
                        "stroke-opacity" : props.opacity
                    });
                    hb = drawHelperBox(freeLine, this.config.classTypes.freeLine, props.rotation, null, false, props.uuid);
                    wbElements[hb.uuid] = hb;

                    break;
                case this.config.classTypes.straightLine :
                    var straightLine = paper.path(props.path);
                    setDefaultProperties(straightLine, {
                        "stroke" : props.color,
                        "stroke-width" : props.lineWidth,
                        "stroke-dasharray" : props.lineStyle,
                        "stroke-opacity" : props.opacity
                    });
                    hb = drawHelperBox(straightLine, this.config.classTypes.straightLine, props.rotation, null, false, props.uuid);
                    wbElements[hb.uuid] = hb;

                    break;
                case this.config.classTypes.rectangle :
                    var rectElement = paper.rect(props.x, props.y, props.width, props.height, props.cornerRadius);
                    rectElement.scale(1, 1);  // workaround for webkit based browsers
                    setDefaultProperties(rectElement, {
                        "fill" : props.backgroundColor,
                        "stroke" : props.borderColor,
                        "stroke-width" : props.borderWidth,
                        "stroke-dasharray" : props.borderStyle,
                        "fill-opacity" : props.backgroundOpacity,
                        "stroke-opacity" : props.borderOpacity
                    });
                    hb = drawHelperBox(rectElement, this.config.classTypes.rectangle, props.rotationDegree, null, false, props.uuid);
                    wbElements[hb.uuid] = hb;

                    break;
                case this.config.classTypes.circle :
                    var circleElement = paper.circle(props.x, props.y, props.radius);
                    circleElement.scale(1, 1);  // workaround for webkit based browsers
                    setDefaultProperties(circleElement, {
                        "fill" : props.backgroundColor,
                        "stroke" : props.borderColor,
                        "stroke-width" : props.borderWidth,
                        "stroke-dasharray" : props.borderStyle,
                        "fill-opacity" : props.backgroundOpacity,
                        "stroke-opacity" : props.borderOpacity
                    });
                    hb = drawHelperBox(circleElement, this.config.classTypes.circle, props.rotationDegree, null, false, props.uuid);
                    wbElements[hb.uuid] = hb;

                    break;
                case this.config.classTypes.ellipse :
                    var ellipseElement = paper.ellipse(props.x, props.y, props.hRadius, props.vRadius);
                    ellipseElement.scale(1, 1);  // workaround for webkit based browsers
                    setDefaultProperties(ellipseElement, {
                        "fill" : props.backgroundColor,
                        "stroke" : props.borderColor,
                        "stroke-width" : props.borderWidth,
                        "stroke-dasharray" : props.borderStyle,
                        "fill-opacity" : props.backgroundOpacity,
                        "stroke-opacity" : props.borderOpacity
                    });
                    hb = drawHelperBox(ellipseElement, this.config.classTypes.ellipse, props.rotationDegree, null, false, props.uuid);
                    wbElements[hb.uuid] = hb;

                    break;
                case this.config.classTypes.image :
                    var imageElement = paper.image(props.url, props.x, props.y, props.width, props.height);
                    hb = drawHelperBox(imageElement, this.config.classTypes.image, props.rotationDegree, null, false, props.uuid);
                    wbElements[hb.uuid] = hb;

                    break;
                case this.config.classTypes.icon :
                    var iconElement = paper.path(this.config.svgIconSet[props.name]).attr({fill: "#000", stroke: "none"});
                    iconElement.scale(props.scaleFactor, props.scaleFactor);
                    var bbox = iconElement.getBBox();
                    // at first bring to 0,0 position after scale
                    iconElement.translate(0 - bbox.x, 0 - bbox.y);
                    // at second move to given position
                    iconElement.translate(props.x, props.y);
                    // and remains
                    hb = drawHelperBox(iconElement, this.config.classTypes.icon, props.rotationDegree, null, false, props.uuid);
                    wbElements[hb.uuid] = hb;

                    break;
                default :
            }
        }

        jQuery("<p style='margin: 2px 0 2px 0'>" + jsWhiteboard["message"] + "</p>").appendTo(".monitoringGroup");
    }

    this.sendChanges = function(jsObject) {
        // set timestamp
        var curDate = new Date();
        jsObject.timestamp = curDate.getTime() + curDate.getTimezoneOffset() * 60000;

        // set data in hidden field
        jQuery("#transferedJsonData").val(JSON.stringify(jsObject));
        // send ajax request
        transferJsonData();
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

        var updatePropsDialog = (selectedObj != null && selectedObj.uuid == this.uuid);
        var objChanges = {
            "action": "move",
            "element": {
                "type": this.classType,
                "properties": {
                    "uuid": this.uuid
                }
            }
        };

        // show current coordinates in the properties dialog (if needed) and send changes to server
        switch (this.classType) {
            case _self.config.classTypes.text :
                objChanges.element.properties.x = this.element.attr("x");
                objChanges.element.properties.y = this.element.attr("y");
                _self.sendChanges(objChanges);

                if (updatePropsDialog) {
                    jQuery(idSubviewProperties + "_textCx").val(objChanges.element.properties.x);
                    jQuery(idSubviewProperties + "_textCy").val(objChanges.element.properties.y);
                }
                break;
            case _self.config.classTypes.freeLine :
            case _self.config.classTypes.straightLine :
                objChanges.element.properties.path = this.element.attr("path") + '';
                _self.sendChanges(objChanges);

                break;
            case _self.config.classTypes.rectangle :
                objChanges.element.properties.x = this.element.attr("x");
                objChanges.element.properties.y = this.element.attr("y");
                _self.sendChanges(objChanges);

                if (updatePropsDialog) {
                    jQuery(idSubviewProperties + "_rectCx").val(objChanges.element.properties.x);
                    jQuery(idSubviewProperties + "_rectCy").val(objChanges.element.properties.y);
                }
                break;
            case _self.config.classTypes.circle :
                objChanges.element.properties.x = this.element.attr("cx");
                objChanges.element.properties.y = this.element.attr("cy");
                _self.sendChanges(objChanges);

                if (updatePropsDialog) {
                    jQuery(idSubviewProperties + "_circleCx").val(objChanges.element.properties.x);
                    jQuery(idSubviewProperties + "_circleCy").val(objChanges.element.properties.y);
                }
                break;
            case _self.config.classTypes.ellipse :
                objChanges.element.properties.x = this.element.attr("cx");
                objChanges.element.properties.y = this.element.attr("cy");
                _self.sendChanges(objChanges);

                if (updatePropsDialog) {
                    jQuery(idSubviewProperties + "_ellipseCx").val(objChanges.element.properties.x);
                    jQuery(idSubviewProperties + "_ellipseCy").val(objChanges.element.properties.y);
                }
                break;
            case _self.config.classTypes.image :
                objChanges.element.properties.x = this.element.attr("x");
                objChanges.element.properties.y = this.element.attr("y");
                _self.sendChanges(objChanges);

                if (updatePropsDialog) {
                    jQuery(idSubviewProperties + "_imageCx").val(objChanges.element.properties.x);
                    jQuery(idSubviewProperties + "_imageCy").val(objChanges.element.properties.y);
                }
                break;
            case _self.config.classTypes.icon :
                objChanges.element.properties.x = Math.round(this.attr("x") + 1);
                objChanges.element.properties.y = Math.round(this.attr("y") + 1);
                _self.sendChanges(objChanges);

                if (updatePropsDialog) {
                    jQuery(idSubviewProperties + "_iconCx").val(objChanges.element.properties.x);
                    jQuery(idSubviewProperties + "_iconCy").val(objChanges.element.properties.y);
                }
                break;

            default :
        }
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
            var classType, defProperties, dialogType, transferMethod;
            if (modeSwitcher.freeLineMode) {
                classType = _self.config.classTypes.freeLine;
                defProperties = _self.config.properties.freeLine;
                dialogType = "editFreeLine";
                transferMethod = "transferFreeLinePropertiesToDialog";
            } else {
                classType = _self.config.classTypes.straightLine;
                defProperties = _self.config.properties.straightLine;
                dialogType = "editStraightLine";
                transferMethod = "transferStraightLinePropertiesToDialog";
            }

            var hb = drawHelperBox(whiteboard.lineEl.path, classType, defProperties.rotation, null, true, null);
            wbElements[hb.uuid] = hb;

            // send changes to server
            _self.sendChanges({
                "action": "create",
                "element": {
                    "type": classType,
                    "properties": {
                        "uuid": hb.uuid,
                        "rotationDegree": defProperties.rotation,
                        "path": whiteboard.lineEl.path.attr("path") + '',
                        "color": whiteboard.lineEl.path.attr("stroke"),
                        "lineWidth": whiteboard.lineEl.path.attr("stroke-width"),
                        "lineStyle": getDasharrayValue(whiteboard.lineEl.path.attr("stroke-dasharray")),
                        "opacity": whiteboard.lineEl.path.attr("stroke-opacity")
                    }
                }
            });

            _self.showProperties(dialogType);
            _self[transferMethod](defProperties);

            // reset
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
    var drawHelperBox = function(el, classType, rotation, scale, select, id) {
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
            el.attr("rotation", parseInt(rotation));
            circleSet.rotate(rotation, bbox.x + bboxWidth / 2, bbox.y + bboxHeight / 2, true);
            helperRect.rotate(rotation, bbox.x + bboxWidth / 2, bbox.y + bboxHeight / 2, true);
        }

        // set references
        helperRect.element = el;
        helperRect.circleSet = circleSet;
        helperRect.classType = classType;
        if (id == null) {
            helperRect.uuid = uuid();
        } else {
            helperRect.uuid = id;
        }

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
            overlayIcon.iconName = name;
            overlayIcon.click(function (event) {
                dialogIcons.dialog("close");
                var iconElement = paper.path(this.icon.attr("path")).attr(fillStroke).translate(whiteboard.iconEl.cx - this.icon.offsetX, whiteboard.iconEl.cy - this.icon.offsetY);
                var hb = drawHelperBox(iconElement, _self.config.classTypes.icon, _self.config.properties.icon.rotation, _self.config.properties.icon.scale, true, null);
                wbElements[hb.uuid] = hb;

                // send changes to server
                var xC = Math.round(hb.attr("x") + 1);
                var yC = Math.round(hb.attr("y") + 1);
                _self.sendChanges({
                    "action": "create",
                    "element": {
                        "type": _self.config.classTypes.icon,
                        "properties": {
                            "uuid": hb.uuid,
                            "x": xC,
                            "y": yC,
                            "rotationDegree": _self.config.properties.icon.rotation,
                            "name": this.iconName,
                            "scaleFactor": _self.config.properties.icon.scale
                        }
                    }
                });

                _self.showProperties('editIcon');
                _self.transferIconPropertiesToDialog(xC, yC, {
                    "scale": _self.config.properties.icon.scale,
                    "rotation": _self.config.properties.icon.rotation
                });
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
                if (prop == "stroke-dasharray") {
                    el.attr(prop, _self.config.dasharrayMapping[propsObj[prop]]);
                } else {
                    el.attr(prop, propsObj[prop]);
                }
            }
        }
    }

    var getSelectedProperties = function(el, propsObj) {
        var selectedProps = {};
        for (prop in propsObj) {
            if (prop == "stroke-dasharray") {
                selectedProps[prop] = getDasharrayValue(el.attr(prop));
            } else {
                selectedProps[prop] = el.attr(prop);
            }
        }

        return selectedProps;
    }

    var getDasharrayValue = function(label) {
        for (value in _self.config.dasharrayMapping) {
            if (label == _self.config.dasharrayMapping[value]) {
                return value;
            }
        }

        return "No";
    }

    // initialize whiteboard
    // 1. register handlers on whiteboard
    whiteboard.bind("click", clickHandler);
    whiteboard.bind("mousedown", mousedownHandler);
    whiteboard.bind("mouseleave", mouseleaveHandler);
    // 2. draw icons
    drawIcons();
}