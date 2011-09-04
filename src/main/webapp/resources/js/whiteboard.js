function initWhiteboard(jsWhiteboard, whiteboardId, user, usersCount, pubSubUrl, pubSubTransport) {
    // bind onclick handler for toolbox items
    bindOnclickToolboxItems();

    // configure validator
    jQuery.validator.addMethod("imageSize", function(value, element, param) {
        if (jQuery.find(param).length < 1) {
            return true;
        }

        return !this.optional(element) && jQuery.validator.methods['digits'].call(this, value, element) && parseInt(value) > 0;
    }, "Please enter a valid image size (only positive digits are allowed).");

    var dimensionRules = {
        required: true,
        digits: true,
        min: 1
    };

    // create validator
    dialogValidator = jQuery("#mainForm").validate({
        onfocusout: false,
        onkeyup: false,
        errorPlacement: function(label, elem) {
            elem.closest(".validatable").find(".errormsg").append(label);
        },
        wrapper: "li",
        rules: {
            inputUrl: {
                url: true
            },
            imgWidth: {
                imageSize: "#inputUrl:filled"
            },
            imgHeight: {
                imageSize: "#inputUrl:filled"
            },
            wbWidth: dimensionRules,
            wbHeight: dimensionRules
        },
        messages: {
            inputUrl: "Please enter a valid image URL.",
            imgWidth: "Please enter a valid image width (only positive digits are allowed).",
            imgHeight: "Please enter a valid image height (only positive digits are allowed).",
            wbWidth: "Please enter a valid whiteboard width (only positive digits are allowed).",
            wbHeight: "Please enter a valid whiteboard height (only positive digits are allowed)."
        }
    });

    // configure dialogs
    jQuery("#dialogInputText").dialog("option", "buttons", {
        "Accept": function() {
            var inputText = jQuery(this).find("#textArea").val();
            jQuery(this).dialog("close");
            whiteboardDesigner.drawText(inputText);
        },
        "Close": function() {
            jQuery(this).dialog("close");
        }
    }).bind("dialogclose", function(event, ui) {
        jQuery(this).find("#textArea").val('');
    });

    jQuery("#dialogInputImage").dialog("option", "buttons", {
        "Accept": function() {
            var isValid1 = dialogValidator.element("#inputUrl");
            var isValid2 = dialogValidator.element("#imgWidth");
            var isValid3 = dialogValidator.element("#imgHeight");

            if ((typeof isValid1 !== 'undefined' && !isValid1) || (typeof isValid2 !== 'undefined' && !isValid2) || (typeof isValid3 !== 'undefined' && !isValid3)) {
                // validation failed
                return false;
            }

            var jq = jQuery(this);
            var inputUrl = jq.find("#inputUrl").val();
            var imgWidth = jq.find("#imgWidth").val();
            var imgHeight = jq.find("#imgHeight").val();
            jq.dialog("close");
            whiteboardDesigner.drawImage(inputUrl, imgWidth, imgHeight);
        },
        "Close": function() {
            jQuery(this).dialog("close");
        }
    }).bind("dialogopen", function(event, ui) {
        // show default width / height
        jQuery(this).find("#imgWidth").val(whiteboardDesigner.config.properties.image.width);
        jQuery(this).find("#imgHeight").val(whiteboardDesigner.config.properties.image.height);
    }).bind("dialogclose", function(event, ui) {
        // reset input
        jQuery(this).find("#inputUrl").val('');
        // clean up validation messages
        jQuery("#errorImageUl").html('');
    });

    jQuery("#dialogResize").dialog("option", "buttons", {
        "Accept": function() {
            var isValid1 = dialogValidator.element("#wbWidth");
            var isValid2 = dialogValidator.element("#wbHeight");

            if ((typeof isValid1 !== 'undefined' && !isValid1) || (typeof isValid2 !== 'undefined' && !isValid2)) {
                // validation failed
                return false;
            }

            var jq = jQuery(this);
            var wbWidth = jq.find("#wbWidth").val();
            var wbHeight = jq.find("#wbHeight").val();
            jq.dialog("close");
            whiteboardDesigner.resizeWhiteboard(wbWidth, wbHeight);
        },
        "Close": function() {
            jQuery(this).dialog("close");
        }
    }).bind("dialogclose", function(event, ui) {
        //var jq = jQuery(this);
        //jq.find("#wbWidth").val('');
        //jq.find("#wbHeight").val('');
        // clean up validation messages
        jQuery("#errorResizeUl").html('');
    });

    jQuery("#dialogIcons").dialog("option", "buttons", {
        "Close": function() {
            jQuery(this).dialog("close");
        }
    });

    // create a global whiteboard designer instance
    whiteboardDesigner = new WhiteboardDesigner(new WhiteboardConfig(), whiteboardId, user, pubSubUrl, pubSubTransport);

    // restore existing whiteboard if any exists
    if (!isBlankObject(jsWhiteboard)) {
        whiteboardDesigner.restoreWhiteboard(jsWhiteboard);
    }

    // subscribe to bidirectional channel
    whiteboardDesigner.subscribePubSub();

    if (usersCount > 1) {
        // notificate subscribers about new user
        setTimeout(function() {
            whiteboardDesigner.joinUser(usersCount);
        }, 1000);
    }
}

function isBlankObject(obj) {
    if (obj == null) {
        return true;
    }

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return true;
}

function onShowAutoWidthDialog(jqDialog) {
    // fix for auto width in IE
    var parent = jqDialog.parent();
    var contentWidth = jqDialog.width();
    parent.find('.ui-dialog-titlebar').each(function() {
        jQuery(this).width(contentWidth);

    });
    parent.removeClass("autoWidthDialog").width(contentWidth + 26);
    jqDialog.dialog('option', 'position', 'center');

    // fix for scrollbars in IE
    jQuery('body').css('overflow', 'hidden');
    jQuery('.ui-widget-overlay').css('width', '100%');
}

function onHideAutoWidthDialog(jqDialog) {
    // fix for auto width in IE
    var parent = jqDialog.parent();
    parent.find('.ui-dialog-titlebar').each(function() {
        // reset titlebar width
        jQuery(this).css('width', '');
    });
    parent.addClass("autoWidthDialog");

    // fix for scrollbars in IE
    jQuery('body').css('overflow', 'auto');
}

function adjustOpenAutoWidthDialog(dialogId) {
    var jqDialog = jQuery('#' + dialogId);
    var parent = jqDialog.parent();
    parent.find('.ui-dialog-titlebar').each(function() {
        jQuery(this).css('width', '');
    });
    parent.addClass('autoWidthDialog');

    onShowAutoWidthDialog(jqDialog);
}

function removeUnusedDialogs() {
    jQuery('#toolboxDialog').remove();
    jQuery('#propertiesDialog').remove();
    jQuery('#monitoringDialog').remove();
}

function bindOnclickToolboxItems() {
    var toolboxItems = jQuery('.toolboxItem');
    toolboxItems.bind('click', function() {
        toolboxItems.removeClass('ui-state-selected');
        jQuery(this).addClass('ui-state-selected');
    });
}

function pinPanels() {
    removeUnusedDialogs();
    bindOnclickToolboxItems();
    whiteboardDesigner.setIdSubviewProperties('#pinnedSubview');

    // show properties of last selected element
    if (whiteboardDesigner.getSelectedObject() != null) {
        whiteboardDesigner.showSelectedProperties(whiteboardDesigner.getSelectedObject());
    }

    // hide loading dialog
    loadingDialogWidget.hide();
}

function unpinPanels() {
    bindOnclickToolboxItems();
    whiteboardDesigner.setIdSubviewProperties('#unpinnedSubview');

    // show properties of last selected element
    if (whiteboardDesigner.getSelectedObject() != null) {
        whiteboardDesigner.showSelectedProperties(whiteboardDesigner.getSelectedObject());
    }

    // hide loading dialog
    loadingDialogWidget.hide();
}

function colorToHex(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
}

function sendPropertiesChanges(type) {
    whiteboardDesigner.sendPropertiesChanges(type);
}
