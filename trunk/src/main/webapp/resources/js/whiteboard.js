jQuery(function() {
    // configure panels
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
    }).bind("dialogopen", function(event, ui) {
        // fix for scrollbars in IE
        jQuery('body').css('overflow', 'hidden');
        jQuery('.ui-widget-overlay').css('width', '100%');
    }).bind("dialogclose", function(event, ui) {
        // fix for scrollbars in IE
        jQuery('body').css('overflow', 'auto');
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
        // fix for scrollbars in IE
        jQuery('body').css('overflow', 'hidden');
        jQuery('.ui-widget-overlay').css('width', '100%');
    }).bind("dialogclose", function(event, ui) {
        // fix for scrollbars in IE
        jQuery('body').css('overflow', 'auto');
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
    }).bind("dialogopen", function(event, ui) {
        // fix for scrollbars in IE
        jQuery('body').css('overflow', 'hidden');
        jQuery('.ui-widget-overlay').css('width', '100%');
    }).bind("dialogclose", function(event, ui) {
        // fix for scrollbars in IE
        jQuery('body').css('overflow', 'auto');
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
    }).bind("dialogopen", function(event, ui) {
        // fix for scrollbars in IE
        jQuery('body').css('overflow', 'hidden');
        jQuery('.ui-widget-overlay').css('width', '100%');
    }).bind("dialogclose", function(event, ui) {
        // fix for scrollbars in IE
        jQuery('body').css('overflow', 'auto');
    });

    // create a global whiteboard designer instance
    whiteboardDesigner = new WhiteboardDesigner(new WhiteboardConfig());
});

function showProperties(id) {
    jQuery("#propertiesDialog").find(".editPanel").hide();
    jQuery("#" + id).show();
}